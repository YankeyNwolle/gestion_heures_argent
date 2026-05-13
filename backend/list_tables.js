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
  const r = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
  console.log("Tables in public schema:");
  console.table(r.rows);
  process.exit(0);
}
run();
