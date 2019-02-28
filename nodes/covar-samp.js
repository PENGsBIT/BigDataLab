module.exports = function(RED) {
    function covar_sampNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("covar-samp",covar_sampNode);
}

