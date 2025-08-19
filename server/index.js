const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('@neondatabase/serverless');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
app.use(cors({
  origin: 'http://0.0.0.0:2000', // adapte selon ton frontend
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // adapte selon HTTPS
}));

// Configurer le dossier d'upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// PostgreSQL pool adapté NeonDB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // NeonDB gère le SSL automatiquement, tu peux retirer l'option ssl si tu veux
});

// Route de test pour dashboard
app.get('/api/projects', (req, res) => {
  res.json([
    {
      project_name: "Projet 1",
      description: "Description projet 1",
      address: "Adresse 1",
      status: "En cours",
      sector: "Secteur A",
      project_images: []
    },
    {
      project_name: "Projet 2",
      description: "Description projet 2",
      address: "Adresse 2",
      status: "Terminé",
      sector: "Secteur B",
      project_images: []
    }
  ]);
});



// Route POST pour ajouter un projet
app.post('/api/projects', upload.array('project_images'), async (req, res) => {
  try {
    const {
      project_name,
      description,
      address,
      status,
      sector
    } = req.body;
    const imageFiles = req.files || [];
    const imagePaths = imageFiles.map(f => f.path); // stocke le chemin réel

   
    // Insérer le projet dans la base
    const result = await pool.query(
      `INSERT INTO projects (project_name, description, address, status, project_images, sector)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [project_name, description, address, status, sector, JSON.stringify(imagePaths)]
    );

    res.json({ success: true, project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" }); // 500 = code HTTP valide
  }
});

// Route pour récupérer les projets réalisés
app.get('/api/projects/realised', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects WHERE status = 'Réalisé' OR status = 'Terminé'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer les secteurs distincts
app.get('/api/sectors', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT sector FROM projects WHERE sector IS NOT NULL`
    );
    res.json(result.rows.map(row => row.sector));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erreur lors de la déconnexion" });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: "Déconnexion réussie" });
  });
});

app.use('/uploads', express.static(uploadDir)); // Pour servir les images

// Middleware global de gestion des erreurs (optionnel, pour attraper les erreurs non gérées)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Erreur serveur" });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));