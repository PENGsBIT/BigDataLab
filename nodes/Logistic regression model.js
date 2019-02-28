module.exports = function(RED) {
    function logistic_regression_model(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.labelCol){
		this.warn('labelCol is not specified.');
	}
	if(!config.numMaxIter){
		this.warn('numMaxIter is not specified.');
	}
    }
    RED.nodes.registerType("logistic-regression-model",logistic_regression_model);
}

