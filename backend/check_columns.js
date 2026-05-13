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
  console.log("--- UES COLUMNS ---");
  const r1 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'ues'");
  console.table(r1.rows);

  console.log("--- SUBJECTS COLUMNS ---");
  const r2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'subjects'");
  console.table(r2.rows);

  console.log("--- TEACHERS COLUMNS ---");
  const r3 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'teachers'");
  console.table(r3.rows);

  process.exit(0);
}
run();
