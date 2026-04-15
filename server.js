const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.md': 'text/markdown',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Remove query strings or hashes
    filePath = filePath.split('?')[0].split('#')[0];

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Para arquivos estáticos (pages/, js, css, etc.) → retorna 404 real
                // Só retorna index.html para rotas sem extensão (navegação SPA)
                const hasExtension = path.extname(filePath) !== '';
                const isPagesRequest = filePath.startsWith('./pages/');

                if (hasExtension || isPagesRequest) {
                    // Arquivo estático não encontrado → 404
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found', 'utf-8');
                } else {
                    // Rota SPA sem extensão → serve index.html
                    fs.readFile('./index.html', (err, indexContent) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Server error');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    });
                }
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop.');
});
