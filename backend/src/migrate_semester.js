import pool from './config/database.js';

async function migrate() {
  try {
    console.log("Adding semester column to hour_entries...");
    await pool.query("ALTER TABLE hour_entries ADD COLUMN IF NOT EXISTS semester INTEGER;");
    console.log("Migration successful.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
