module.exports = function(RED) {
    function randomforest_predict(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("randomforest-predict",randomforest_predict);
}

