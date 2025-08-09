// Minimal Express server for testing
const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');

// Simple server setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/contact', (req, res) => {
  res.json({ message: 'Contact endpoint available' });
});

app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ success: true, message: 'Contact form submitted successfully' });
});

// Serve static files in production
app.use(express.static('client/dist'));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/dist', 'index.html'));
});

// Start server
const port = parseInt(process.env.PORT || "5000", 10);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});