const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add a postinstall script to run the build command
if (!packageJson.scripts.postinstall) {
  packageJson.scripts.postinstall = 'npm run build';
  
  // Write the updated package.json back to disk
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Added postinstall script to package.json');
} else {
  console.log('postinstall script already exists in package.json');
}

// Exit with success code
process.exit(0);