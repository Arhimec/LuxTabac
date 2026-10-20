const http = require('http');
const fs = require('fs');
const path = require('path');
const ordersHandler = require('./api/orders.js');
const quotaHandler = require('./api/quota.js');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

/**
 * Lightweight local development server mimicking Vercel's static + serverless function behavior.
 */
const server = http.createServer((req, res) => {
    // Enhance response with Express/Vercel helper methods
    res.status = function(code) {
        res.statusCode = code;
        return res;
    };

    res.json = function(data) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
        return res;
    };

    // Parse URL
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Route: /api/quota
    if (pathname.startsWith('/api/quota')) {
        return quotaHandler(req, res);
    }

    // Route: /api/orders
    if (pathname.startsWith('/api/orders')) {
        let bodyBuffer = '';
        req.on('data', chunk => {
            bodyBuffer += chunk;
        });
        req.on('end', () => {
            if (bodyBuffer) {
                try {
                    req.body = JSON.parse(bodyBuffer);
                } catch {
                    req.body = bodyBuffer;
                }
            } else {
                req.body = {};
            }
            ordersHandler(req, res);
        });
        return;
    }

    // Static files
    let filePath = path.join(process.cwd(), pathname === '/' ? 'index.html' : pathname);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    } else {
        // Fallback to index.html for SPA routes
        const indexHtml = path.join(process.cwd(), 'index.html');
        if (fs.existsSync(indexHtml)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(indexHtml).pipe(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`\n🚀 LuxTabac Reserve local server running at http://localhost:${PORT}`);
        console.log(`📦 SQLite database ready at ./data/luxtabac.db`);
        console.log(`⚡ API endpoint active at http://localhost:${PORT}/api/orders\n`);
    });
}

module.exports = server;
