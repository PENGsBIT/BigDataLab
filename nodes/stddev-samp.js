module.exports = function(RED) {
    function stddev_sampNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("stddev-samp",stddev_sampNode);
}

