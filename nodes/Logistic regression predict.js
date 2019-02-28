module.exports = function(RED) {
    function logistic_regression_predictNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("logistic-regression-predict",logistic_regression_predictNode);
}

