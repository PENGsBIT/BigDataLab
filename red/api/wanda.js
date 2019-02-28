
/*
*
* {
*   userId: "string",
*   tables: [
*       {
*           tablename: "string",
*           columns: [
*               {
*                   name: "string",
*                   type: "string"
*               }
*           ]
*       }
*   ],
*   master:{
*       ip: "string",
*       port: "string"
*   },
*   jid: "string"
* }
*
* */

var util = require('util');
var request = require('request');
const {User, PortalJobMeta, sequelize} = require('./database');
let log;
let api;
let redNodes;
var taql_store;

// function query(sql){
//     return new Promiss((resolve, reject)=>{
//         pool.getConnection(functÍion (err, connection) {
//             connection.query(userSql, function (error, result, fields) {
//                 if(error) return reject(error);
//                 resolve(result)
//             });
//         });
//     });
// }

module.exports = {
    init: function(runtime) {
        log = runtime.log;
        redNodes = api = runtime.nodes;
        taql_store = runtime.taqlStore;
    },
    generateUrl: function (req, res) {
        var resJson = req.body;
        var tables = resJson.tables;
        var master = resJson.master;
        var port = resJson.port;
        var username = "wanda_"+resJson.userId;
        var portal_jid = resJson.portal_jid;

        User.findOrCreate({where: {username: username}})
            .spread(function (user) {
                var jid = new Date().getTime();
                sequelize.sync().then(function () {
                    PortalJobMeta.create({
                        uid: user.uid,
                        username: username,
                        tables: JSON.stringify(tables),
                        master: master,
                        // portal_jid: 'dd',
                        portal_jid: portal_jid.toString(),
                        // jid: 'sss'
                        jid: jid.toString(),
                        port: port.toString()
                    }).then(function () {
                        req.session.user = user.toJSON();
                        // req.session.master = master;
                        // req.session.port = port;
                        res.send(util.format("http://%s/jid/%s", req.headers.host, jid));
                    });
                });

            });

        // var userSql = util.format("select uid, username from users where username=%s;", username);
        //
        // var user = {uid:-1, username:null};
        //
        // var process = function () {
        //
        //     var sql = util.format("insert into portal_job_meta(uid, username, tables, master, portal_jid, jid) values(%s,%s,%s,%s,%s,%s) on duplicate key update uid=%s, username=%s, tables=%s, master=%s, jid=%s", user.uid, user.username, tables, master,portal_jid, jid,user.uid, user.username, tables, master, jid);
        //     query(sql)
        //         .then((rows)=>{
        //             req.session.username = username;
        //             res.send(util.format("http://localhost:3000/jid/%s", jid));
        //         });
        // };
        //
        // query(userSql)
        //     .then((results)=>{
        //         if(results.length == 0){
        //             let createUser = util.format("insert into users(username, password) values(%s, %s)", username, "")
        //             query(createUser).then((rows)=>{
        //                 user.uid = rows[0].uid;
        //                 user.username = rows[0].username;
        //                 process()
        //             })
        //         }else{
        //             user.uid = results[0].uid;
        //             user.username = results[0].username;
        //             process()
        //         }
        //     })

    },
    renderHtml: function (req, res) {
        // var user = req.session.user;
        // if(!user){
        //     res.status(404).end();
        // }
        var jid = req.params.jid;
        PortalJobMeta.count({where: {jid: jid}})
            .then(function (count) {
                if(count<1){
                    res.status(404).end();
                }else{
                    res.redirect("/?jid="+jid);
                }
            });
        // query(util.format("select 1 from portal_job_meta where jid=%s and username=%s;", jid, username))
        //     .then((rows)=>{
        //         if(rows.length==0){
        //             res.status(404).end()
        //         }else{
        //             res.sendFile("/");
        //         }
        //     })
    },
    runJob: function (req, res) {
        var jid = req.params.jid;


        PortalJobMeta.findOne({where: {jid: jid}})
            .then(function (item) {

                let masterip = item.master;
                let masterport = item.port;
                let flow_id = null;
                let config = null;
                [config, flow_id] = get_flow_config(jid);
                // const newest = taql_store.getTable(jid + '_result_table_newest')[0];
                // taql_store.setTable(jid + '_result_table_newest', [taql_store.getTable(jid + '_result_table_newest')[0], masterip + ':' + masterport]);
                console.log('start-job(get): ' + masterip + ':' + masterport);

                for(var i=0; i<config.length;i++){
                    var n = config[i];
                    if(n.type==='count'||n.type==='sum'||n.type==='max'){
                        if(n.needGroupBy){
                            n[n.type+'column'] = n.column;
                            n.type = 'groupby-'+n.type;
                            n.groupbycolumn = n.groupByCol;
                            delete n.column;
                            delete n.groupByCol;
                            delete n.needGroupBy;
                        }
                    }
                }

                var dest_table = taql_store.getTable(jid)[0];
                console.log('http://'+item.master+':'+item.port+'/node');
                console.log('config: '+JSON.stringify(config));
                try {
                    request({
                        url: 'http://'+item.master+':'+item.port+'/node',
                        method: 'POST',
                        json: {jid: jid, data: config, table: dest_table},
                    },function(error, response, body){
                        if (!error && response.statusCode === 200) {
                            console.log("driver getNewTableForAnalyse");
                            res.json({status: 0, status_msg: 'success'});
                        } else {
                            res.json({status: -1, status_msg: error});
                            console.error(error);
                        }
                    });
                } catch (e) {
                    // res.json({status: -1, status_msg: e});
                    console.log(e);
                }
            });
    },
    statusQuery: function (req, res) {
        var jid = req.params.jid;
        PortalJobMeta.findOne({where: {jid: jid}})
            .then(function (item) {
                request({
                    url: 'http://'+item.master+':'+item.port+'/statusquery',
                    method: 'post',
                    body: jid
                }, function (error, response, body) {
                    /*
                    * -2: 不存在
                    * 0=任务未开始
                    * 1=任务运行中
                    * 2=任务成功运行完成
                    * -1=任务运行时错误
                    * */


                    if (!error && response.statusCode === 200) {
                        var status = 'unknown error';
                        var progress = 0.0;
                        if(body==-2){
                            status = "NOT EXISTS";
                        }else if(body==-1){
                            status = "FAILED";
                            progress = 100.0;
                        }else if(body==0){
                            status = "PENDING";
                            progress = 0.0;
                        }else if(body==1){
                            status = "RUNNING";
                            progress = 60.0;
                        }else if(body==2){
                            status = "SUCCESS";
                            progress = 100.0;
                        }
                        var ret = {
                            "jid": jid,
                            "data": {
                                "status": status,
                                "progress":progress
                            }
                        };
                        res.json(ret);
                    } else {
                        res.json({status: -1, status_msg: error});
                        console.error(error);
                    }

                });
            });

    },
    getColumns: function (req, res) {
        var table = req.params.table;
        var jid = req.params.jid;
        PortalJobMeta.findOne({where: {jid: jid}})
            .then(function (item) {
                var tables = JSON.parse(item.tables);
                var ret = [];
                for(var i=0;i<tables.length;i++){
                    if(tables[i].table==table){
                        var cols = tables[i].columns;
                        for(var j=0;j<cols.length;j++){
                            ret.push(cols[j].name);
                        }
                        break;
                    }
                }
                res.send(JSON.stringify(ret));
            });
    },
    parseResult: function(req, res){
        var jid = req.params.jid;
        if(!jid){
            res.status(404).end();
        }
        PortalJobMeta.findOne({where: {jid: jid}})
            .then(function (item) {
                res.redirect("http://"+item.master+":3030/dv/index.html?jid="+jid);
            });
    }
};

function asFlow(config) {
    if (config) {
        let header = [];
        header.push({
            id: config.id,
            label: config.label,
            type: 'tab'
        });
        return header.concat(config.nodes);
    } else {
        return null;
    }
}

function get_flow_config(jid) {
    let flow_id = taql_store.gettaskId(jid);
    if (taql_store) {
        return [asFlow(redNodes.getFlow(flow_id)), flow_id];
    } else {
        return null;
    }
}
