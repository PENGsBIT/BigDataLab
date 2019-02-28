/*
edit by zpc
obtain ID and tablename
 */

var redNodes;
var log;
var taqlStore;
var request = require('request');
var tables;
module.exports={
    init: function (runtime) {
        settings = runtime.settings;
        redNodes = runtime.nodes;
        log = runtime.log;
        taqlStore = runtime.taqlStore;
    },
getId: function (req, res) {
        //var tables = req.query.tables;
        var jid = req.body.jid;
        // console.log(JSON.stringify(req.body));
        // console.log(req.body.jid);

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).json({result: "ok"});

        var host = req.session.host;
        var port = req.session.port;

        request({
            url: 'http://'+host+':'+port+'/list',
            method:'GET'
        },
        function(error, response, body){
            if(!error && response.statusCode == 200){

                tables=(body);
                console.log("==========");
                console.log(jid);
                console.log(tables);
                console.log("==========");
            }else{
                console.error(error);
            }

        });

        taqlStore.setTable(jid, tables);
    },

};
