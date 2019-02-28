/**
 * author: Shile Zhang
 * Date: 2017.1.7
 * modify by zpc
 * 2018.3.20
 * Basic taql related functions
 */
var log;
var redNodes;
var settings;
var taqlStore;
var env;
var resultHandler;

var request = require('request');
const {User, PortalJobMeta, sequelize} = require('./database');

module.exports = {
    init: function (runtime) {
        settings = runtime.settings;
        redNodes = runtime.nodes;
        log = runtime.log;
        taqlStore = runtime.taqlStore;
    	env = runtime.env;
        resultHandler = runtime.resultWS;
    },
     setTable: function (req, res) {
         console.log("req.body: " + JSON.stringify(req.body));
         var jid = "" + req.body.jid;
         var tables = req.body.tables;
         taqlStore.setTable(jid, tables);
         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         res.status(200).json({ result: "ok" });
     },
    getTable: function (req, res) {
        var jid = req.params.jid;
        PortalJobMeta.findOne({where: {jid: jid}})
            .then(function (item) {
               // var master = item.master;
               // var port = item.port;
               // request({
               //     url: 'http://'+master+':'+port+'/list'
               // }, function (error, response, body) {
               //     res.status(200).json({tables: body});
               // });
                var tables = JSON.parse(item.tables);
                var ret = [];
                for(var i=0;i<tables.length;i++){
                    ret.push(tables[i].table);
                }
                // console.log(tables);
                // console.log(JSON.stringify(tables[0]));
                // console.log(ret);
                res.status(200).json({tables: ret});
            });
        // var tables = taqlStore.getTable(jid);
        // res.status(200).json({ tables: tables });
    },

    deleteId: function (req, res) {
        var jid = req.params.jid;
        taqlStore.deleteId(jid);
        res.status(200).json({ result: "ok" });
    },

    sendStatus: function (req, res) {
        var jid = req.params.jid;
        var status = req.params.status;
        console.log('JOB Status: ' + jid + ' - ' + status);
        if (status === 'bbcz') {
            resultHandler.send(jid, '{"type": "alert", "msg": "表不存在"}');
            status = 'error';
        }
        request({
                url: 'http://' + env.taskmanagerDefault + '/manageplatform/deployAnalyse/getAnalyseStatus',
                method: 'POST',
                form: {
                    jid: jid,
                    status: status
                }
            },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log("portal getAnalyseStatus success");
                         res.json({ result: "ok" });
                    } else {
                        res.json({ result: "fail" });
                        console.error(error);
                    }
                });

        }
}
