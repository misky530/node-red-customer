module.exports = function(RED) {
    function MyVueNode(config) {
        RED.nodes.createNode(this, config);

        // 在这里实现节点的逻辑
        this.on('input', function(msg) {
            // 处理输入消息
            msg.payload = msg.payload || "Hello, Vue!";
            this.send(msg);
        });
    }

    // 注册节点类型
    RED.nodes.registerType('my-vue-node', MyVueNode);
};