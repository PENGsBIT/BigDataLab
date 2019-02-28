/**
 * Copyright 2014, 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var express = require("express");
var session = require('express-session');
var bodyParser = require("body-parser");
var util = require('util');
var path = require('path');
var passport = require('passport');
var when = require('when');
var cors = require('cors');

var routes = require('./routes');

var ui = require("./ui");
var theme = require("./theme");
var comms = require("./comms");

var auth = require("./auth");
var needsPermission = auth.needsPermission;

var i18n;
var log;
var adminApp;
var nodeApp;
var server;
var runtime;
var routesModules = Object();

requireRouteModules();

var errorHandler = function(err,req,res,next) {
    if (err.message === "request entity too large") {
        log.error(err);
    } else {
        console.log(err.stack);
    }
    log.audit({event: "api.error",error:err.code||"unexpected_error",message:err.toString()},req);
    res.status(400).json({error:"unexpected_error", message:err.toString()});
};

var ensureRuntimeStarted = function(req,res,next) {
    if (!runtime.isStarted()) {
        log.error("Node-RED runtime not started");
        res.status(503).send("Not started");
    } else {
        next();
    }
}

function requireRouteModules() {
    for (var key in routes) {
        var route = routes[key];
        routesModules[key] = require(route.module);
    }
}

function initRoutesModules(app) {
    for (var key in routes) {
        var route = routes[key];
        if (key === 'library') {
            routesModules[key].init(app, runtime);
        } else {
            routesModules[key].init(runtime);
        }
    }
}

function addRoutes(app) {
    for (var key in routes) {
        var route = routes[key];
        var routeModule = routesModules[key];
        console.log(key);
        route.routes.forEach(function (r) {
            console.log(r.entrance);
            var method = app[r.method].bind(app);
            method(r.regex, needsPermission(r.permission), routeModule[r.entrance], errorHandler);
        });
    }
}

function init(_server,_runtime) {
    server = _server;
    runtime = _runtime;
    var settings = runtime.settings;
    i18n = runtime.i18n;
    log = runtime.log;
    if (settings.httpNodeRoot !== false) {
        nodeApp = express();
    }
    if (settings.httpAdminRoot !== false) {
        comms.init(server,runtime);
        auth.init(runtime);

        adminApp = express();
        initRoutesModules(adminApp);

        // Editor
        if (!settings.disableEditor) {
            ui.init(runtime);
            var editorApp = express();
            if (settings.requireHttps === true) {
                editorApp.enable('trust proxy');
                editorApp.use(function (req, res, next) {
                    if (req.secure) {
                        next();
                    } else {
                        res.redirect('https://' + req.headers.host + req.originalUrl);
                    }
                });
            }
            editorApp.get("/",ensureRuntimeStarted,ui.ensureSlash,ui.editor);
            editorApp.get("/icons/:icon",ui.icon);
            theme.init(runtime);
            if (settings.editorTheme) {
                editorApp.use("/theme",theme.app());
            }
            editorApp.use("/",ui.editorResources);
            adminApp.use(editorApp);
        }
        var maxApiRequestSize = settings.apiMaxLength || '5mb';
        adminApp.use(bodyParser.json({limit:maxApiRequestSize}));
        adminApp.use(bodyParser.urlencoded({limit:maxApiRequestSize,extended:true}));
        adminApp.use(session({
            secret: 'sessiontest',
            resave: true,
            saveUninitialized:true
        }));
        // adminApp.get('/',function(req,res){
        //     var user={
        //         username:"",
        //         password:""
        //     }
        //     req.session.user=user;
        // });
        adminApp.get("/auth/login",auth.login,errorHandler);

        if (settings.adminAuth) {
            //TODO: all passport references ought to be in ./auth
            adminApp.use(passport.initialize());
            adminApp.post("/auth/token",
                auth.ensureClientSecret,
                auth.authenticateClient,
                auth.getToken,
                auth.errorHandler
            );
            adminApp.post("/auth/revoke",needsPermission(""),auth.revoke,errorHandler);
        }
        if (settings.httpAdminCors) {
            var corsHandler = cors(settings.httpAdminCors);
            adminApp.use(corsHandler);
        }

        addRoutes(adminApp);
    }
}
function start() {
    return i18n.registerMessageCatalog("editor",path.resolve(path.join(__dirname,"locales")),"editor.json").then(function(){
        comms.start();
    });
}
function stop() {
    comms.stop();
    return when.resolve();
}
module.exports = {
    init: init,
    start: start,
    stop: stop,
    library: {
        register: routesModules['library'].register
    },
    auth: {
        needsPermission: auth.needsPermission
    },
    comms: {
        publish: comms.publish
    },
    get adminApp() { return adminApp; },
    get nodeApp() { return nodeApp; },
    get server() { return server; }
};
