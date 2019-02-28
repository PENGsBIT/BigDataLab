module.exports = function(RED) {
    function corrNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("corr",corrNode);
}

