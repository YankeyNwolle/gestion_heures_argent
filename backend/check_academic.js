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
  console.log("--- PROGRAMS (UEs) ---");
  const p = await pool.query("SELECT * FROM programs");
  console.table(p.rows);

  console.log("--- SUBJECTS ---");
  const s = await pool.query("SELECT * FROM subjects LIMIT 10");
  console.table(s.rows);

  process.exit(0);
}
run();
