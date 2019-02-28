module.exports = function(RED) {
    function Decision_tree_predictNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("Decision tree predict",Decision_tree_predictNode);
}

