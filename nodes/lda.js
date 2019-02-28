module.exports = function(RED) {
    function ldaNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.numTrees){
		this.warn('Tree number is not specified.');
	}
    }
    // RED.nodes.registerType("lda-model",ldaNode);
}

