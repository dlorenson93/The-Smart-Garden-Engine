const { execSync } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, '..');

console.log('🔄 Applying password reset migration...');

try {
  // Change to backend directory and run Prisma commands
  process.chdir(backendDir);
  
  console.log('📦 Pushing schema to database...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  
  console.log('🔨 Regenerating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Migration complete! Prisma Client regenerated.');
  console.log('🔄 Please restart your backend server.');
} catch (error) {
  console.error('❌ Error applying migration:', error.message);
  process.exit(1);
}
