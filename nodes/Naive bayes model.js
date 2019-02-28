module.exports = function(RED) {
    function Naive_bayes_modelNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

    }
    RED.nodes.registerType("Naive bayes model",Naive_bayes_modelNode);
}

