var util = require('util');
var request = require('request');
const {User, PortalJobMeta, sequelize} = require('./database');
let log;
let api;
let redNodes;
var taql_store;

module.exports = {
    init: function(runtime) {
        log = runtime.log;
        redNodes = api = runtime.nodes;
        taql_store = runtime.taqlStore;
    },
    jobResult: function (req, res) {
        var data = req.body;
        PortalJobMeta.findOne({where: {jid: data.id}})
            .then(function (item) {
                data.id = item.portal_jid;
                try {
                    console.log(JSON.stringify(data));
                    request.post({
                        url:'http://10.190.88.204:8080/dmp-api/external/dataUseJobResult',
                        formData: {
                            'id': data.id,
                            'filename': data.filename,
                            'hive_table_list': JSON.stringify(data.hive_table_list),
                            'tag': data.tag
                        }
                    }, function optionalCallback(err, httpResponse, body) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('http://10.190.88.204:8080/dmp-api/external/dataUseJobResult');
                        console.log(body);
                    });
                    // request({
                    //         url: 'http://10.190.88.204:8080/dmp-api/external/dataUseJobResult',
                    //         method: 'POST',
                    //         data: {
                    //             'id': data.id,
                    //             'filename': data.filename,
                    //             'hive_table_list': JSON.stringify(data.hive_table_list),
                    //             'tag': data.tag
                    //         }
                    //     },
                    //     // console.log(jobConfig),
                    //     function(error, response, body){
                    //
                    //         if (!error && response.statusCode == 200) {
                    //             console.log('http://10.190.88.204:8080/dmp-api/external/dataUseJobResult');
                    //             console.log(body);
                    //         } else {
                    //             console.error(error);
                    //         }
                    //     }
                    // );
                } catch (e) {
                    console.log(e);
                }
                res.json({
                    "status": "SUCCESS",//状态码，操作成功为“SUCCESS”，操作失败为“FAILURE”
                    "message": "操作成功",//消息，
                    "object": null
                });

            });
    }
};