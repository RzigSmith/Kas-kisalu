// Simple HTTP server using built-in Node.js modules
import { createServer } from 'http';
import { readFile, readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Simple MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Simple body parser for JSON
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

// Create HTTP server
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  console.log(`${req.method} ${url.pathname}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API routes
  if (url.pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (url.pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', message: 'Server is running' }));
      return;
    }
    
    if (url.pathname === '/api/contact') {
      if (req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Contact endpoint available' }));
        return;
      }
      
      if (req.method === 'POST') {
        const body = await parseBody(req);
        console.log('Contact form submission:', body);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Contact form submitted successfully' }));
        return;
      }
    }
    
    // 404 for unknown API routes
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }
  
  // Serve static files or client app
  try {
    let filePath = join(__dirname, 'client/dist', url.pathname === '/' ? 'index.html' : url.pathname);
    
    try {
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
    } catch {
      // File doesn't exist, serve index.html for client-side routing
      filePath = join(__dirname, 'client/dist/index.html');
    }
    
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const mimeType = mimeTypes[ext] || 'text/plain';
    
    res.setHeader('Content-Type', mimeType);
    res.writeHead(200);
    res.end(content);
    
  } catch (error) {
    // Fallback HTML response
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kas Kisalu - Development Server</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 50px; }
            h1 { color: #333; }
            .status { color: #28a745; }
          </style>
        </head>
        <body>
          <h1>Kas Kisalu Development Server</h1>
          <p class="status">✅ Server is running successfully!</p>
          <p>The server is ready for development. Frontend assets will be served once the build is complete.</p>
          <h3>Available API Endpoints:</h3>
          <ul>
            <li><a href="/api/health">/api/health</a> - Server health check</li>
            <li><a href="/api/contact">/api/contact</a> - Contact form endpoint</li>
          </ul>
        </body>
      </html>
    `);
  }
});

const port = parseInt(process.env.PORT || "5000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});