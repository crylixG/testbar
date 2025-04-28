// This script ensures NODE_ENV is set to production
// before running the server in production mode
if (process.env.NODE_ENV !== 'production') {
  console.log('NODE_ENV not set, defaulting to production');
  process.env.NODE_ENV = 'production';
}

// Run the application
console.log(`Starting server in ${process.env.NODE_ENV} mode`);
import('./dist/index.js').catch(err => {
  console.error('Failed to start the server:', err);
  process.exit(1);
});