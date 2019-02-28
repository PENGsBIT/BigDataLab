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

var log;
var redNodes;
var settings;
var taqlStore;
var env;

var request = require('request');
var mysql = require("mysql");
var config = require('./config');

const {User, PortalJobMeta, sequelize} = require('./database');

function asFlows(allFlows, flow) {
    var flows = [];
    if(flow){
        var header = [];
        header.push({id:flow.id, label:flow.label, type: "tab"});
        flows = header.concat(flow.nodes);
    }

    var result = {flows: flows, rev: allFlows.rev};
    console.log(JSON.stringify(result));
    return result;
}

function toFlow(flows){
    var result = {};
    var id = findFlowId(flows);
    result.id = id;
    result.label = "流程 1";
    result.nodes = flows.filter(function(node){
        return node.z && node.z === id;
    });

    return result;
}

function findFlowId(flows){
    for(var i = 0; i < flows.length; i++){
        if(flows[i].type === "tab"){
            return flows[i].id;
        }
    }
    console.error("Not found.");
}

function parseNewTables(flows){
    var persistNodes = flows.filter(function(elem){
        return elem.type === "kmeans-model" && elem.strategy === "disk";
    });
    return persistNodes.map(function(elem){
        return elem.modelName;
    }).join(",");
}

module.exports = {
    init: function(runtime) {
        settings = runtime.settings;
        redNodes = runtime.nodes;
        log = runtime.log;
        taqlStore = runtime.taqlStore;
        env = runtime.env;
    },
    get: function(req,res) {
        var version = req.get("Node-RED-API-Version")||"v1";
        if (version === "v1") {
            log.audit({event: "flows.get",version:"v1"},req);
            res.status(400).json({code:"invalid_api_version", message:"Invalid API Version requested"});
        } else if (version === "v2") {
            log.audit({event: "flows.get",version:"v2"},req);
            // console.log("Query params: "+JSON.stringify(req.query));
            var jid = req.query.jid;

            PortalJobMeta.findOne({where: {jid: jid}})
                .then(function (item) {

                    req.session.master = item.master;
                    req.session.port = item.port;

                    var flowId = taqlStore.gettaskId(jid);
                    var flows = redNodes.getFlows();
                    var flow = redNodes.getFlow(flowId);
                    var result = asFlows(flows, flow);
                    console.log(flowId);
                    console.log("GET /flows param:" + JSON.stringify({jid:jid, flowId: flowId, flows: flows, flow: flow}));
                    console.log("GET /flows", JSON.stringify(result));
                    res.json(result);

                });


        } else {
            log.audit({event: "flows.get",version:version,error:"invalid_api_version"},req);
            res.status(400).json({code:"invalid_api_version", message:"Invalid API Version requested"});
        }
    },
    post: function(req,res) {
        var version = req.get("Node-RED-API-Version")||"v1";
        var flows = req.body;
        var deploymentType = req.get("Node-RED-Deployment-Type")||"full";
        log.audit({event: "flows.set",type:deploymentType,version:version},req);
        if (deploymentType === 'reload') {
            redNodes.loadFlows().then(function() {
                res.status(204).end();
            }).otherwise(function(err) {
                log.warn(log._("api.flows.error-reload",{message:err.message}));
                log.warn(err.stack);
                res.status(500).json({error:"unexpected_error", message:err.message});
            });
        } else {
            const flowConfig = flows.flows;
            let output_dest = 'default';
            for (let i = 0; i < flowConfig.length; i++) {
                const node = flowConfig[i];
                if (node.type === 'output') {
                    output_dest = node.dest;
                }
            }

            let output_pos = -1;
            let output_id = '';
            for (let i = 0; i < flowConfig.length; i++) {
                const node = flowConfig[i];
                if (node.type === 'output') {
                    output_id = node.id;
                    output_pos = i;
                }
            }
            for (let i = 0; i < flowConfig.length; i++) {
                const node = flowConfig[i];
                if (node.wires !== undefined && JSON.stringify(node.wires).indexOf(output_id) > -1) {
                    node.wires = [[]];
                }
            }
            if (output_pos > -1) {
                flowConfig.splice(output_pos, 1);
            }

            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
            const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
            const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
            const minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
            const time = year + month + day + '_' + hour + minute;
            const newest = output_dest + '_' + flows.jid + '_' + time;
            console.log('flows(post): newest=' + newest);
            console.log(8888888888888888888888888888888);
            console.log(flowConfig);
            const jobConfig = {jid: flows.jid, data: flowConfig, table: newest};
            console.log(777777777777777777777777777);
            console.log(jobConfig);
            taqlStore.setTable(flows.jid + '_result_table_newest', [newest, env.sparkDefault]);
            taqlStore.setTable(flows.jid, [newest]);

            //Store data into mysql.joblist table
            var con = mysql.createConnection({
                host: config.db.address,
                user: config.db.user,
                password: config.db.password,
                database: config.db.database
            });

            con.connect(function (err) {
                if (err) throw err;
                console.log("mysql db connected.");
            });
            if (req.session.user) {
                var user = req.session.user;
                var jid = flows.jid;
                var datetime = require('node-datetime');
                var dt = datetime.create();
                //var formatted = dt.format('Y-m-d H:M:S');
                var sql = util.format("SELECT * FROM joblist WHERE jid='%s'", jid);
                con.query(sql, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    if (rows.length) {
                        sql = util.format("UPDATE joblist SET frequency = frequency +1 WHERE jid='%s'", jid);
                        con.query(sql, function (err, rows) {
                            if (err) {
                                throw err;
                            }
                        });
                        console.log("jid: %s exists, frequency +1...", jid);
                    }
                    else {
                        sql = util.format("SELECT uid FROM users WHERE username='%s' AND password='%s'",
                            user.username, user.password);
                        con.query(sql, function (err, rows) {
                            if (err) {
                                throw err;
                            }
                            if (rows.length) {
                                var uid = rows[0].uid;
                                console.log("The uid for user %s is %s:", user.username, uid);
                                sql = util.format("INSERT INTO joblist (username, uid, jid, createtime, frequency) VALUES ('%s', '%s', '%s', '%s', 1)",
                                    user.username, uid, jid, datetime);
                                con.query(sql, function (err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("Jid:%s inserted...", jid);
                                });
                            }
                        });
                    }
                });
            }
            // if (taqlStore.gettaskId(flows.jid) !== undefined) {
            //     redNodes.updateFlow(taqlStore.gettaskId(flows.jid), toFlow(flowConfig)).then(function () {
            //         request({
            //                 url:env.taskmanagerDefault,
            //                 method:'POST',
            //                 form: {
            //                     jid: flows.jid,
            //                     job_id: taqlStore.gettaskId(flows.jid),
            //                     new_tables: newest
            //                 }
            //             },
            //             function(error, response, body){
            //                 if(!error && response.statusCode === 200){
            //                     console.log("portal getNewTableForAnalyse");
            //                 }else{
            //                     console.error(error);
            //                 }
            //             });
            //         res.json({rev: taqlStore.gettaskId(flows.jid), status: 'ok'});
            //     });
            // } else {
            //     redNodes.addFlow(toFlow(flowConfig)).then(function (flowId) {
            //         taqlStore.settaskId(flows.jid, flowId);
            //         request({
            //                 url:env.taskmanagerDefault,
            //                 method:'POST',
            //                 form: {
            //                     jid: flows.jid,
            //                     job_id: taqlStore.gettaskId(flows.jid),
            //                     new_tables: newest
            //                 }
            //             },
            //             function(error, response, body){
            //                 if(!error && response.statusCode === 200){
            //                     console.log("driver getNewTableForAnalyse");
            //                 }else{
            //                     console.error(error);
            //                 }
            //             });
            //         res.json({rev: taqlStore.gettaskId(flows.jid), status: 'ok'});
            //     });
            // }

            // try {
            //     request({
            //         url: 'http://'+env.driverDefault+'/node',
            //         method: 'POST',
            //         json: jobConfig,
            //         // console.log(jobConfig),
            //         function(error, response, body){
            //             if (!error && response.statusCode == 200) {
            //                 console.log("driver getNewTableForAnalyse");
            //             } else {
            //                 console.error(error);
            //             }
            //         }
            //     });
            // } catch (e) {
            //     console.log(e);
            // }

            // PortalJobMeta.findOne({where: {jid: flows.jid}})
            //     .then(function (item) {
            //
            //         req.session.master = item.master;
            //         req.session.port = item.port;
            //
            //         try {
            //             request({
            //                 url: 'http://'+item.master+':'+item.port+'/node',
            //                 method: 'POST',
            //                 json: jobConfig},
            //                 // console.log(jobConfig),
            //                 function(error, response, body){
            //                     if (!error && response.statusCode == 200) {
            //                         console.log("driver getNewTableForAnalyse");
            //                     } else {
            //                         console.error(error);
            //                     }
            //                 }
            //             );
            //         } catch (e) {
            //             console.log(e);
            //         }
            //
            //     });


            if(taqlStore.gettaskId(flows.jid)!==undefined){
                redNodes.updateFlow(taqlStore.gettaskId(flows.jid), toFlow(flowConfig)).then(function() {
                    if (version === "v1") {
                        res.status(204).end();
                    } else if (version === "v2") {
                        // var jid = flows.jid;
                        // taqlStore.settaskId(jid, flowId);
                        // console.log("sending message to TM."+ JSON.stringify({data:{
                        //     jid: jid,
                        //     job_id: flowId,
                        //     new_tables: parseNewTables(flowConfig)
                        // }}));
                        PortalJobMeta.findOne({where: {jid: flows.jid}})
                            .then(function (item) {

                                req.session.master = item.master;
                                req.session.port = item.port;
                                try {
                                    request({
                                        url: 'http://10.190.88.204:8080/dmp-api/external/dataUseProcessDoneRersult?id='+item.portal_jid+'&flag=true',
                                        method: 'GET',
                                        },
                                        // console.log(jobConfig),
                                        function(error, response, body){
                                            if (!error && response.statusCode == 200) {
                                                console.log('http://10.190.88.204:8080/dmp-api/external/dataUseProcessDoneRersult?id='+item.portal_jid+'&flag=true');
                                                console.log(body);
                                            } else {
                                                console.error(error);
                                            }
                                        }
                                    );
                                } catch (e) {
                                    console.log(e);
                                }

                            });
                    } else {
                        // TODO: invalid version
                    }
                }).otherwise(function(err) {
                    log.warn(log._("api.flows.error-save",{message:err.message}));
                    log.warn(err.stack);
                    // res.status(500).json({error:"unexpected_error", message:err.message});
                });
            }else{
                redNodes.addFlow(toFlow(flowConfig)).then(function(flowId) {
                    if (version === "v1") {
                        res.status(204).end();
                    } else if (version === "v2") {
                        var jid = flows.jid;
                        console.log("add flow add flow add flow add flow add flow");
                        console.log(flowId);
                        taqlStore.settaskId(jid, flowId);
                        console.log("sending message to TM."+ JSON.stringify({data:{
                            jid: jid,
                            job_id: flowId,
                            new_tables: parseNewTables(flowConfig)
                        }}));

                        PortalJobMeta.findOne({where: {jid: flows.jid}})
                            .then(function (item) {

                                req.session.master = item.master;
                                req.session.port = item.port;

                                try {
                                    request({
                                            url: 'http://10.190.88.204:8080/dmp-api/external/dataUseProcessDoneRersult?id='+item.portal_jid+'&flag=true',
                                            method: 'GET',
                                        },
                                        // console.log(jobConfig),
                                        function(error, response, body){
                                            if (!error && response.statusCode == 200) {
                                                console.log('http://10.190.88.204:8080/dmp-api/external/dataUseProcessDoneRersult?id='+item.portal_jid+'&flag=true');
                                                console.log(body);
                                            } else {
                                                console.error(error);
                                            }
                                        }
                                    );
                                } catch (e) {
                                    console.log(e);
                                }

                            });

                        // request({
                        //         url:env.taskmanagerDefault,
                        //         method:'POST',
                        //         // body:JSON.stringify({data:{
                        //         //         jid: jid,
                        //         //         job_id: flowId,
                        //         //         new_tables: parseNewTables(flowConfig)
                        //         // }})
                        //         form: {
                        //             jid: jid,
                        //             // job_id: flowId,
                        //             // new_tables: parseNewTables(flowConfig)
                        //         }
                        //     },
                        //     function(error, response, body){
                        //         if(!error && response.statusCode == 200){
                        //             console.log("driver getNewTableForAnalyse");
                        //         }else{
                        //             console.error(error);
                        //         }
                        //     });
                        // res.json({rev:flowId});
                    } else {
                        // TODO: invalid version
                    }
                }).otherwise(function(err) {
                    log.warn(log._("api.flows.error-save",{message:err.message}));
                    log.warn(err.stack);
                    // res.status(500).json({error:"unexpected_error", message:err.message});
                });
            }

            res.json({status: 'ok'});
        }
    },

    load: function (req, res) {
        const jid = req.body.jid;
        if (taqlStore.getTable(jid + '_result_table_newest') !== undefined) {
            const resultTable = taqlStore.getTable(jid + '_result_table_newest')[0];
            const master = taqlStore.getTable(jid + '_result_table_newest')[1] || env.sparkDefault;
            const jobConfig = {
                jid: jid,
                data: [{
                    id: "90189f47.641f3",
                    type: "tab",
                    label: "Flow 1"
                }, {
                    id: "bf7b35e3.8464c8",
                    type: "data-source",
                    z: "90189f47.641f3",
                    name: resultTable,
                    alias: "",
                    x: 380.5,
                    y: 194,
                    wires: [[]]
                }],
                table: '' + jid + Math.random().toString(36).substr(2)
            };
            request({
                    url: 'http://'+env.driverDefault+ '/node',
                    method: 'POST',
                    json: jobConfig
                },
                function(error, response, body){
                    if (!error && response.statusCode === 200) {
                        console.log("driver getNewTableForAnalyse");
                    } else {
                        console.error(error);
                    }
                });
            res.json({status: 'ok'});
        } else {
            res.json({status: 'ok', msg: 'empty'});
        }
    }
};