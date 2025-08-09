#!/usr/bin/env node

// Set NODE_ENV to development
process.env.NODE_ENV = 'development';

// Import and run the TypeScript server using tsx
const { spawn } = require('child_process');
const path = require('path');

// Try to find tsx in node_modules or use npx
const tsx = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

tsx.on('close', (code) => {
  process.exit(code);
});

tsx.on('error', (err) => {
  console.error('Failed to start development server:', err);
  process.exit(1);
});