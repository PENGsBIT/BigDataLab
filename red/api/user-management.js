/*
edit by kaimary
User Management Module
 */

var redNodes;
var log;
var taqlStore;
var con;
var util = require('util');
var mysql = require('mysql');
var settings;

var config = require('./config');

module.exports= {
    init: function (runtime) {
        settings = runtime.settings;
        redNodes = runtime.nodes;
        log = runtime.log;
        taqlStore = runtime.taqlStore;

        con = mysql.createConnection({
            host: config.db.address,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
        });

        con.connect(function (err) {
            if (err) {
                throw err;
            }
            console.log("Mysql db connected.");
        });

    },
    createUser: function (req, res) {
        var usrname = req.body.username;
        var passwd = req.body.password;
        var user = {
            username: usrname,
            password: passwd
        };
        req.session.user=user;

        console.log("username:%s; password:%s.", req.session.user.username, req.session.user.password);

        var sql = util.format("SELECT * FROM users WHERE username='%s' AND password='%s'", usrname, passwd);
        con.query(sql, function (err, rows, fields) {
            if (err) {
                throw err;
            }
            if (rows.length) {
                console.log("User existed! Please log in.");
            }
            else {
                sql = util.format("INSERT INTO users (username, password) VALUES ('%s', '%s')", usrname, passwd);
                con.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    console.log("User inserted.");
                });
            }
        });

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).json({result: "ok"});
    },

    userVerify: function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        if(req.session.user) {
            var user = req.session.user;
            var sql = util.format("SELECT * FROM users WHERE username='%s' AND password='%s'",
                user.username, user.password);
            console.log(sql);
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                }
                if (rows.length) {
                    console.log("Verified!");
                    res.status(200).json({result: "ok"});
                }
                else {
                    res.status(200).json({result: "fail"});
                }
            });
        }else{
            res.status(404).end()
        }
    },
    getJobList: function (req, res) {
        var result = [];
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        if (req.session.user) {
            var user = req.session.user;
            var sql = util.format("SELECT uid FROM users WHERE username='%s' AND password='%s'",
                user.username, user.password);
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                }
                if (rows.length) {
                    var uid = rows[0].uid;
                    console.log("The uid for user %s is %s:", user.username, uid);

                    sql = util.format("SELECT * FROM joblist WHERE uid='%s'", uid);
                    con.query(sql, function (err, rows) {
                        if (err) {
                            throw err;
                        }
                        if (rows.length) {
                            console.log("There are %d jobs for this user.", rows.length);
                            console.log("Retrieving job list for this user...");
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                result.push({jid: row.jid});
                            }
                            res.send(JSON.stringify(result));
                            res.status(200).json({result: "ok"});
                        }
                        else {
                            console.log("No data for user %s.", usrname);
                            res.status(200).json({result: "fail"});
                        }
                    });

                    console.log(result);
                }
            });
        }
    }
};