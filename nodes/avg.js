module.exports = function(RED) {
    function avgNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("avg",avgNode);
}

