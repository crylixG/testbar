const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running Heroku postbuild script...');

// Add the postinstall script to package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add heroku-postbuild script to run when deploying to Heroku
if (!packageJson.scripts['heroku-postbuild']) {
  packageJson.scripts['heroku-postbuild'] = 'npm run build';
  
  // Make sure Vite and other dev dependencies aren't imported at runtime
  // by moving the server build process to a separate command
  if (!packageJson.scripts['build:server']) {
    packageJson.scripts['build:server'] = 'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:@vitejs/* --external:react --external:react-dom';
    packageJson.scripts['build'] = 'vite build && npm run build:server';
  }
  
  // Write the updated package.json back to disk
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Added heroku-postbuild script to package.json');
} else {
  console.log('heroku-postbuild script already exists in package.json');
}

// Now run the build process manually
try {
  console.log('Building the application...');
  
  // Build the client
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build the server without including Vite dependencies
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:@vitejs/* --external:react --external:react-dom', { stdio: 'inherit' });
  
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Update Procfile to use a simplified start command that doesn't depend on Vite
const procfilePath = path.join(__dirname, 'Procfile');
fs.writeFileSync(procfilePath, 'web: node server.js');
console.log('Updated Procfile to use simplified server.js');

// Create a simple start script that doesn't depend on Vite
const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = `
// Simple production server that doesn't depend on Vite
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log(\`Starting server in \${process.env.NODE_ENV} mode\`);

// Serve static files and API
import('express').then(({ default: express }) => {
  const app = express();
  const path = import('path').then(m => m.default);
  
  // Serve static files from the dist/client directory
  app.use(express.static('./dist/client'));
  
  // Set up API routes
  import('./dist/routes.js').then(({ registerRoutes }) => {
    const http = require('http');
    const server = http.createServer(app);
    
    registerRoutes(app);
    
    // Use the PORT environment variable provided by Heroku
    const port = process.env.PORT || 5000;
    server.listen(port, '0.0.0.0', () => {
      console.log(\`Server running on port \${port}\`);
    });
  }).catch(err => {
    console.error('Failed to load API routes:', err);
  });
}).catch(err => {
  console.error('Failed to start Express server:', err);
});
`;

fs.writeFileSync(serverJsPath, serverJsContent);
console.log('Created simplified server.js for production');

// Exit with success code
process.exit(0);