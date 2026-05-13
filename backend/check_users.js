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
  const r = await pool.query("SELECT id, email, is_active FROM users");
  console.table(r.rows);
  process.exit(0);
}
run();
