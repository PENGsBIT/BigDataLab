var localStorage = require('node-persist');
var express = require("express");
var router = express.Router();

router.use('/getFlows', function (req, res) {
    var result = "";
    localStorage.keys().forEach(function (item) {
        result+=item+": "+JSON.stringify(localStorage.getItemSync(item))+"<br>";
    });
    res.send(result);
});

module.exports = router;
