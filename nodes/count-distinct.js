module.exports = function(RED) {
    function count_distinctNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("count-distinct",count_distinctNode);
}

