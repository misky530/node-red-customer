module.exports = function (RED) {
    function licenseChecker(config) {
        RED.nodes.createNode(this, config);
        const fs = require('fs');

        this.on('input', function (msg) {
            const filePath = config.filePath || msg.filePath;
            if (!filePath) {
                this.error("No filePath provided", msg);
                return;
            }

            // license.json
            const licenseJsonPath = `${filePath}/license.json`;  

            // read file
            fs.readFile(licenseJsonPath, 'utf8', (err, data) => {
                if (err) {
                    this.error(`Error reading license.json file: ${err.message}`, msg);
                } else {
                    msg.payload = JSON.parse(data);
                    this.send(msg);
                }
            });

            // check signature
            // 获取 Node-RED 的用户目录路径
            // const userDir = RED.settings.userDir;

            // signature.dat
            const signatureDatPath= `${filePath}/signature.dat`;           

            // read file
            fs.readFile(signatureDatPath, 'utf8', (err, data) => {
                if (err) {
                    this.error(`Error reading signature.dat file: ${err.message}`, msg);
                } else {
                    msg.signature = data;
                    this.send(msg);
                }
            });

            // 在节点启动时输出用户目录路径
            this.log(`Node-RED user directory is: ${userDir}`);
        });
    }
    RED.nodes.registerType("license-checker", licenseChecker);
};