/**
 * Created by zyz on 2017/8/23.
 */

var settings;
var request = require('request');
var resultHandler;

module.exports = {
    init: function (runtime) {
        settings = runtime.settings;
        resultHandler = runtime.resultWS;
    },
    receiveResult: function (req, res) {
        var jid = "" + req.body.jid;
        var data = "" + req.body.data;

        resultHandler.send(jid, data);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).json({ result: "ok" });
    }
};