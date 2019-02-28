module.exports = function(RED) {
    function var_sampNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("var-samp",var_sampNode);
}

