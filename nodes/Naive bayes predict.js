module.exports = function(RED) {
    function Naive_bayes_predictNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("Naive bayes predict",Naive_bayes_predictNode);
}

