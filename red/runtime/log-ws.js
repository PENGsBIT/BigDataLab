/**
 * Created by zyz on 2017/8/24.
 */
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 1883, path: '/ws/log'});
var wsMap = [];

module.exports = {
    init: function () {
        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                var data = JSON.parse(message);
                if (data.type !== undefined) {
                    switch (data.type) {
                        case 'jid':
                            wsMap[data.jid] = ws;
                            break;
                    }
                }
            });
        });
    },
    send: function (jid, data) {
        if (wsMap[jid] !== undefined) {
            wsMap[jid].send(data);
        }
    },
    broadcast: function (data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    } 
};
