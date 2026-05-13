import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion_heures_universitaire',
  password: 'bonjourjesuis14',
  port: 5432,
});

async function run() {
  try {
    await pool.query(`ALTER TABLE ues ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1`);
    console.log("Column 'semester' added to 'ues' table.");
  } catch (e) {
    console.error("Error adding column:", e);
  } finally {
    process.exit(0);
  }
}
run();
