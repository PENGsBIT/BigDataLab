module.exports = function(RED) {
    function sampleNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("sample",sampleNode);
}

