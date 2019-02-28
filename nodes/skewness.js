module.exports = function(RED) {
    function skewnessNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("skewness",skewnessNode);
}

