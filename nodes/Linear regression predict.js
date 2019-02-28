module.exports = function(RED) {
    function linear_regression_predictNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("linear-regression-predict",linear_regression_predictNode);
}

