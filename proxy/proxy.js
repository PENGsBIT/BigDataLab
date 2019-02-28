var express = require("express");
var router = express.Router();
var request = require('request');


router.use('/columns/:table', function (req, res) {
    // var host = req.headers.host.substring(0, req.headers.host.lastIndexOf(':'));
    var table = req.params.table;
    var host = req.session.master;
    var port = req.session.port;
    if(!host){
        console.log('NOOOOOOOOOOOOO host and port in session');
        res.send('[]');
        return;
    }
    //http://10.141.212.118
    request({
        url: 'http://'+host+':'+port+'/columns',
        // url: host+':8082/columns',
        method: 'POST',
        body: 'table='+table
    }, function (error, response, body) {
        console.log('Proxy for get table columns: ', body);
        res.send(body);
    });
});

module.exports = router;
