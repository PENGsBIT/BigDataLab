module.exports = function(RED) {
    function projectNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
	if(!config.columns){
		this.warn('Columns not specified.');
	}
	if(!config.outputCol){
		this.warn('outputCol not specified.');
	}
    }
    RED.nodes.registerType("vector-asm",projectNode);
}

