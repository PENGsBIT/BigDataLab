module.exports = function(RED) {
    function kurtosisNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("kurtosis",kurtosisNode);
}

