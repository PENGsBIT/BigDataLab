/**
 * Created by zyz on 2017/8/23.
 */

var settings;
var request = require('request');
var logHandler;

module.exports = {
    init: function (runtime) {
        settings = runtime.settings;
        logHandler = runtime.logWS;
    },
    receiveLog: function (req, res) {
        var data = "" + req.body.data;
        logHandler.broadcast(data);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).json({ result: "ok" });
    }
};