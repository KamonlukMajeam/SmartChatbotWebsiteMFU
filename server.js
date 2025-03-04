const http = require('http');
const path = require('path');
const fs = require('fs');

// ตั้งค่า IP และ Port
const hostname = 'localhost'; // ใช้ 0.0.0.0 ถ้าต้องการให้เข้าถึงจากทุกที่
const port = 3000;

const server = http.createServer((req, res) => {
    // ตรวจสอบ path ของ request
    let filePath = path.join(__dirname, req.url === '/' ? 'login.html' : req.url);
    const extname = path.extname(filePath);

    // ตั้งค่า MIME types
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
    };

    // ถ้าไม่มีส่วนขยาย ให้ตั้งเป็น .html
    if (!extname) filePath += '.html';

    // ตั้งค่า Content-Type
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // อ่านไฟล์
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // ไฟล์ไม่พบ -> ส่งหน้า 404
                fs.readFile(path.join(__dirname, '404.html'), (err404, content404) => {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(content404 || '404 Not Found');
                });
            } else {
                // ความผิดพลาดอื่น ๆ
                res.statusCode = 500;
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // ส่งไฟล์ที่ร้องขอ
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.end(content);
        }
    });
});

// รันเซิร์ฟเวอร์
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
