module.exports = function(RED) {
    function linear_regression_ModelNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.labelCol){
		this.warn('labelCol is not specified.');
	}
	if(!config.numMaxIter){
		this.warn('numMaxIter is not specified.');
	}
    }
    RED.nodes.registerType("linear-regression-model",linear_regression_ModelNode);
}

