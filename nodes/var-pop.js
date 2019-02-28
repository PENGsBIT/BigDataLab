module.exports = function(RED) {
    function var_popNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("var-pop",var_popNode);
}

