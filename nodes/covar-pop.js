module.exports = function(RED) {
    function covar_popNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("covar-pop",covar_popNode);
}

