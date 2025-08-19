#!/usr/bin/env node

// Démarrage direct sans cross-env
process.env.NODE_ENV = 'development';

// Import et démarrage du serveur
import('./server/index.ts').catch(err => {
  console.error('Erreur lors du démarrage:', err);
  
  // Fallback vers le serveur simple
  console.log('Basculement vers le serveur simple...');
  import('./simple-server.mjs');
});