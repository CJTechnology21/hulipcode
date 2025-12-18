/**
 * Migration Runner
 * Runs all pending migrations in order
 * 
 * Usage: node backend/migrations/migrate.js
 */

const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const migrationsDir = __dirname;
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js') && file !== 'migrate.js')
    .sort();

  console.log(`📦 Found ${files.length} migration(s)`);

  for (const file of files) {
    const migrationPath = path.join(migrationsDir, file);
    const migration = require(migrationPath);

    if (typeof migration.up === 'function') {
      console.log(`\n🔄 Running migration: ${file}...`);
      try {
        await migration.up();
        console.log(`✅ Migration ${file} completed`);
      } catch (error) {
        console.error(`❌ Migration ${file} failed:`, error);
        throw error;
      }
    }
  }

  console.log('\n✅ All migrations completed successfully!');
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations().catch((error) => {
    console.error('❌ Migration runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations };

