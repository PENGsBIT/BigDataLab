module.exports = function(RED) {
    function collect_listNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("collect_list",collect_listNode);
}

