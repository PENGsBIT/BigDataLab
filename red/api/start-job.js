/**
 * created by luchang
 */
var when = require('when');
var util = require('util');

var request = require('request');

var redNodes;
var log;
var taql_store;

module.exports = {
    init: (runtime) => {
        log = runtime.log;
        redNodes = runtime.nodes;
        taql_store = runtime.taqlStore;
    },
    get: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let jid = req.params.jid;
        let masterip = req.params.masterip;
        let masterport = req.params.port;

        let flow_id = null;
        let config = null;
        [config, flow_id] = get_flow_config(jid);
        const newest = taql_store.getTable(jid + '_result_table_newest')[0];
        taql_store.setTable(jid + '_result_table_newest', [taql_store.getTable(jid + '_result_table_newest')[0], masterip + ':' + masterport]);
        console.log('start-job(get): ' + masterip + ':' + masterport);

        console.log('========');
        console.log(config);
        let output_pos = -1;
        let output_id = '';
        for (let i = 0; i < config.length; i++) {
            const node = config[i];
            if (node.type === 'output') {
                output_id = node.id;
                output_pos = i;
            }
        }
        for (let i = 0; i < config.length; i++) {
            const node = config[i];
            if (node.wires !== undefined && JSON.stringify(node.wires).indexOf(output_id) > -1) {
                node.wires = [[]];
            }
        }
        if (output_pos > -1) {
            config.splice(output_pos, 1);
        }
        console.log('========');
        console.log(config);
        console.log('==================================================')
        console.log('==================================================')
        console.log('==================================================')
        console.log('==================================================')
        request({
            url: 'http://' + masterip + ':' + masterport + '/node',
            method: 'POST',
            json: {jid: jid, data: config, table: newest}
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("portal getNewTableForAnalyse");
                } else {
                    console.error(error);
                }
            });
        console.log('==================================================')
        console.log('==================================================')
        console.log('==================================================')
        console.log('==================================================')
        res.json({rev: taql_store.gettaskId(jid), status: 'ok'});

        // send_flow_config({
        //     url: 'http://10.141.211.91:8001'
        // }, masterip, masterport, config).then((rtn_msg) => {
        //     res.json({
        //         jid: jid,
        //         flow_id: flow_id,
        //         result: rtn_msg.result,
        //         message: rtn_msg.message
        //     });
        // }).catch((rtn_msg) => {
        //     res.json({
        //         jid: jid,
        //         flow_id: flow_id,
        //         result: rtn_msg.result,
        //         message: rtn_msg.message
        //     });
        // });
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

function send_flow_config(service, masterip, masterport, config) {
    return when.promise((resolve, reject) => {
        let service_url = service.url;

        // let url = service_hostname + service_path;

        let options = {
            url: service_url,
            form: {
                config: JSON.stringify(config),
                masterip: masterip,
                masterport: masterport
            }
        };

        request.post(options, (error, response, data) => {
            let rtn_msg = {};
            if (!error) {
                try {
                    console.log(data);
                    d = JSON.parse(data);
                    if (d.error) {
                        rtn_msg = {
                            result: false,
                            error: d.error,
                            message: d.message
                        };
                        reject(rtn_msg);
                    } else {
                        rtn_msg = {
                            result: 'ok',
                            message: d.message
                        }
                    }
                    resolve(rtn_msg);
                } catch (err) {
                    rtn_msg = {
                        result: false,
                        message: 'some errors occur.'
                    }
                    reject(rtn_msg);
                }
            } else {
                rtn_msg = {
                    result: false,
                    message: 'some errors occur.'
                }
                reject(rtn_msg);
            }
        });
    });

}
