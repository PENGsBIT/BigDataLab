module.exports = function(RED) {
    function collect_setNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("collect_set",collect_setNode);
}

