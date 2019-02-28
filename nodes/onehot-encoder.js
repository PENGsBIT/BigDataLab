module.exports = function(RED) {
    function onehotNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.features){
		this.warn('projections not specified.');
	}
    }
    RED.nodes.registerType("onehot",onehotNode);
}

