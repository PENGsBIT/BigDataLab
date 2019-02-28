module.exports = function(RED) {
    function stddev_popNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("stddev-pop",stddev_popNode);
}

