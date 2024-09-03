module.exports = function(RED) {
    function MyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.customText = config.customText || "default text"; // 读取配置值

        node.on('input', function(msg) {
            msg.payload = msg.payload + " - " + node.customText; // 将配置值附加到payload
            node.send(msg);
        });
    }
    RED.nodes.registerType("my-node", MyNode);
}