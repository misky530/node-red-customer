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
                    console.log('msg.payload:', msg.payload);
                    console.log('msg.payload:', 'msg.payload.license');
                    
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
                    // this.send(msg);
                }
            });           

            // public_key.pem
            const publicPemPath = `${filePath}/public_key.pem`;

            // read file
            fs.readFile(publicPemPath, 'utf8', (err, data) => {
                if (err) {
                    this.error(`Error reading public.key file: ${err.message}`, msg);
                } else {
                    // 将 public_key.pem 文件内容转换为 PEM 格式
                    const pem = data.replace(/\\n/g, '\n');
                    // 使用 RSA 公钥验证 signature.dat 文件和 license.json 文件
                    const licenseJson = JSON.stringify(msg.payload);
                    const licenseJsonBuffer = Buffer.from(licenseJson, 'utf8');                    

                    const crypto = require('crypto');
                    const signature = Buffer.from(msg.signature, 'base64');
                    console.log('signature:', signature);

                    const publicKey = crypto.createPublicKey(pem);
                    const verified = crypto.verify('RSA-SHA256', signature, publicKey, licenseJsonBuffer);
                    if (verified) {
                        this.log('Signature is valid');
                        this.send(msg);
                    } else {
                        this.error('Signature is invalid');                   
                    }
                }
            });
        });

        
    }
    RED.nodes.registerType("license-checker", licenseChecker);
};