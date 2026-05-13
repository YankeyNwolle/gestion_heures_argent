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
  const r = await pool.query(`
    SELECT t.id, u.last_name, t.status, t.contractual_hours, 
           COALESCE((SELECT SUM(etd_hours) FROM hour_entries WHERE teacher_id=t.id), 0) as total_etd 
    FROM teachers t 
    JOIN users u ON u.id=t.user_id
  `);
  console.table(r.rows);
  process.exit(0);
}
run();
