const crypto = require('crypto');
const fs = require('fs');

const filePath = 'D:\\data\\mtim\\db\\zhenhai';

// 读取公钥文件
const publicKey = fs.readFileSync(`${filePath}/public_key.pem`, 'utf8');

// 假设这是你的原文
const data = fs.readFileSync(`${filePath}/license.json`, 'utf8');

// 假设这是你通过某种方式获得的签名（这里是一个base64编码的字符串）
const signature = fs.readFileSync(`${filePath}/signature.dat`, 'utf8');

// 使用crypto模块的verify方法验证签名
const isVerified = crypto.verify(
    'sha256', // 使用的哈希算法
    Buffer.from(data), // 原始数据
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(signature, 'base64') // 签名
);

console.log(isVerified ? '签名验证成功' : '签名验证失败');