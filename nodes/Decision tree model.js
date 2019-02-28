module.exports = function(RED) {
    function Decision_tree_model(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.type){
		this.warn('type is not specified.');
	}
    }
    RED.nodes.registerType("Decision tree model",Decision_tree_model);
}

