module.exports = function(RED) {
    function randomforest_modelNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.numTrees){
		this.warn('Tree number is not specified.');
	}
    }
    RED.nodes.registerType("randomforest-model",randomforest_modelNode);
}

