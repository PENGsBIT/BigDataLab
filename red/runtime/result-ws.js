/**
 * Created by zyz on 2017/8/24.
 */
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 1884, path: '/ws/result'});
var wsMap = [];

module.exports = {
    init: function () {
        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                const data = JSON.parse(message);
                if (data.type !== undefined) {
                    switch (data.type) {
                        case 'jid':
                            if (wsMap[data.jid] !== undefined) {
                                wsMap[data.jid].push(ws);
                            } else {
                                wsMap[data.jid] = [ws];
                            }
                            break;
                    }
                }
            });
        });
    },
    send: function (jid, data) {
        if (wsMap[jid] !== undefined) {
            for (let i = 0; i < wsMap[jid].length; i++) {
                try {
                    wsMap[jid][i].send(data);
                } catch (err) {
                    console.log(jid + ' no.' + i + ' WebSocket has been closed');
                }
            }
        }
    }
};
