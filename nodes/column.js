module.exports = function(RED) {
    function columnNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("column",columnNode);
}

