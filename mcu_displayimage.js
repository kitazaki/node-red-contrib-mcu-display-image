module.exports = function(RED) {
    function DisplayJpeg(config) {
        RED.nodes.createNode(this,config);
        console.log(config);
    }
    RED.nodes.registerType("mcu_displayjpeg",DisplayJpeg);

    function DisplayPng(config) {
        RED.nodes.createNode(this,config);
        console.log(config);
    }
    RED.nodes.registerType("mcu_displaypng",DisplayPng);
}
