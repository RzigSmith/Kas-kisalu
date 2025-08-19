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
    
    if (url.pathname === '/api/admin/stats') {
      if (req.method === 'GET') {
        // Sample data for dashboard
        const statsData = {
          totalProjects: 15,
          totalUsers: 3,
          projects: [
            {
              id: 1,
              project_name: "Rénovation Campus Lingwala",
              description: "Travaux de rénovation complète du campus",
              address: "Lingwala, Kinshasa",
              status: "Terminé",
              sector: "Construction",
              project_images: []
            },
            {
              id: 2,
              project_name: "Agriculture Mweka",
              description: "Projet agricole dans la région de Mweka",
              address: "Mweka, Kasaï",
              status: "En cours",
              sector: "Agriculture",
              project_images: []
            },
            {
              id: 3,
              project_name: "Élevage Yangambi",
              description: "Développement de l'élevage bovin",
              address: "Yangambi",
              status: "En cours",
              sector: "Élevage",
              project_images: []
            },
            {
              id: 4,
              project_name: "Transport Matériaux",
              description: "Service de transport de matériaux de construction",
              address: "Kinshasa",
              status: "Actif",
              sector: "Transport",
              project_images: []
            }
          ],
          users: [
            {
              id: 1,
              username: "admin",
              email: "admin@kaskisalu.com",
              role: "administrateur"
            },
            {
              id: 2,
              username: "gestionnaire",
              email: "gestionnaire@kaskisalu.com",
              role: "gestionnaire"
            }
          ]
        };
        res.writeHead(200);
        res.end(JSON.stringify(statsData));
        return;
      }
    }
    
    // Add /api/admin/stats endpoint for dashboard
    if (url.pathname === '/api/admin/stats') {
      res.setHeader('Content-Type', 'application/json');
      
      if (req.method === 'GET') {
        const statsData = {
          totalProjects: 6,
          activeProjects: 3,
          completedProjects: 2,
          sectors: {
            construction: 2,
            agriculture: 2, 
            elevage: 1,
            transport: 1
          }
        };
        
        res.writeHead(200);
        res.end(JSON.stringify(statsData));
        return;
      }
    }

    // Add /api/projects endpoints for compatibility with admin forms
    if (url.pathname === '/api/projects' || url.pathname.startsWith('/api/projects/')) {
      res.setHeader('Content-Type', 'application/json');
      
      // Handle individual project GET/PUT by ID
      const projectMatch = url.pathname.match(/^\/api\/projects\/(\d+)$/);
      if (projectMatch && req.method === 'GET') {
        const projectId = parseInt(projectMatch[1]);
        const projectsData = [
          {
            id: 1,
            project_name: "Rénovation Campus Lingwala",
            description: "Travaux de rénovation complète du campus universitaire avec modernisation des infrastructures",
            address: "Lingwala, Kinshasa",
            status: "Terminé",
            sector: "Construction",
            project_images: [],
            created_at: new Date('2024-01-15').toISOString()
          },
          {
            id: 2,
            project_name: "Agriculture Mweka",
            description: "Projet agricole moderne dans la région de Mweka avec techniques durables",
            address: "Mweka, Kasaï",
            status: "En cours",
            sector: "Agriculture",
            project_images: [],
            created_at: new Date('2024-03-20').toISOString()
          },
          {
            id: 3,
            project_name: "Élevage Yangambi",
            description: "Développement de l'élevage bovin avec amélioration génétique",
            address: "Yangambi",
            status: "En cours",
            sector: "Élevage",
            project_images: [],
            created_at: new Date('2024-02-10').toISOString()
          }
        ];
        
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
          res.writeHead(200);
          res.end(JSON.stringify(project));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Project not found' }));
        }
        return;
      }

      if (projectMatch && req.method === 'PUT') {
        const body = await parseBody(req);
        console.log('Project update:', body);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Projet mis à jour avec succès!' }));
        return;
      }
      
      if (url.pathname === '/api/projects' && req.method === 'GET') {
        // Return all projects
        const projectsData = [
          {
            id: 1,
            project_name: "Rénovation Campus Lingwala",
            description: "Travaux de rénovation complète du campus universitaire avec modernisation des infrastructures",
            address: "Lingwala, Kinshasa",
            status: "Terminé",
            sector: "Construction",
            project_images: [],
            created_at: new Date('2024-01-15').toISOString()
          },
          {
            id: 2,
            project_name: "Agriculture Mweka",
            description: "Projet agricole moderne dans la région de Mweka avec techniques durables",
            address: "Mweka, Kasaï",
            status: "En cours",
            sector: "Agriculture",
            project_images: [],
            created_at: new Date('2024-03-20').toISOString()
          },
          {
            id: 3,
            project_name: "Élevage Yangambi",
            description: "Développement de l'élevage bovin avec amélioration génétique",
            address: "Yangambi",
            status: "En cours",
            sector: "Élevage",
            project_images: [],
            created_at: new Date('2024-02-10').toISOString()
          },
          {
            id: 4,
            project_name: "Transport Matériaux Kinshasa",
            description: "Service de transport spécialisé pour matériaux de construction",
            address: "Kinshasa",
            status: "Actif",
            sector: "Transport",
            project_images: [],
            created_at: new Date('2024-04-05').toISOString()
          },
          {
            id: 5,
            project_name: "Résidence Moderne Gombe",
            description: "Construction de résidence haut standing avec équipements modernes",
            address: "Gombe, Kinshasa",
            status: "En cours",
            sector: "Construction",
            project_images: [],
            created_at: new Date('2024-05-15').toISOString()
          },
          {
            id: 6,
            project_name: "Ferme Intégrée Bandundu",
            description: "Développement d'une ferme intégrée avec cultures diversifiées",
            address: "Bandundu",
            status: "Planifié",
            sector: "Agriculture",
            project_images: [],
            created_at: new Date('2024-06-01').toISOString()
          }
        ];
        
        res.writeHead(200);
        res.end(JSON.stringify(projectsData));
        return;
      }
      
      if (req.method === 'POST') {
        const body = await parseBody(req);
        console.log('Project creation:', body);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Projet ajouté avec succès!' }));
        return;
      }
    }
    
    // 404 for unknown API routes
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }
  
  // Projects endpoint (outside of /api/ for frontend compatibility)
  if (url.pathname === '/projects') {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'GET') {
      // Sample project data for development
      const projectsData = [
        {
          id: 1,
          project_name: "Rénovation Campus Lingwala",
          description: "Travaux de rénovation complète du campus universitaire avec modernisation des infrastructures",
          address: "Lingwala, Kinshasa",
          status: "Terminé",
          sector: "Construction",
          project_images: [],
          created_at: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          project_name: "Agriculture Mweka",
          description: "Projet agricole moderne dans la région de Mweka avec techniques durables",
          address: "Mweka, Kasaï",
          status: "En cours",
          sector: "Agriculture",
          project_images: [],
          created_at: new Date('2024-03-20').toISOString()
        },
        {
          id: 3,
          project_name: "Élevage Yangambi",
          description: "Développement de l'élevage bovin avec amélioration génétique",
          address: "Yangambi",
          status: "En cours",
          sector: "Élevage",
          project_images: [],
          created_at: new Date('2024-02-10').toISOString()
        },
        {
          id: 4,
          project_name: "Transport Matériaux Kinshasa",
          description: "Service de transport spécialisé pour matériaux de construction",
          address: "Kinshasa",
          status: "Actif",
          sector: "Transport",
          project_images: [],
          created_at: new Date('2024-04-05').toISOString()
        },
        {
          id: 5,
          project_name: "Résidence Moderne Gombe",
          description: "Construction de résidence haut standing avec équipements modernes",
          address: "Gombe, Kinshasa",
          status: "En cours",
          sector: "Construction",
          project_images: [],
          created_at: new Date('2024-05-15').toISOString()
        },
        {
          id: 6,
          project_name: "Ferme Intégrée Bandundu",
          description: "Développement d'une ferme intégrée avec cultures diversifiées",
          address: "Bandundu",
          status: "Planifié",
          sector: "Agriculture",
          project_images: [],
          created_at: new Date('2024-06-01').toISOString()
        }
      ];
      
      res.writeHead(200);
      res.end(JSON.stringify(projectsData));
      return;
    }
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