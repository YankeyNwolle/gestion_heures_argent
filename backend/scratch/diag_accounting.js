import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion_heures_universitaire',
  password: 'bonjourjesuis14',
  port: 5432,
});

async function diagnostic() {
  try {
    const res = await pool.query("SELECT last_name, grade, status, contractual_hours, total_etd, complementary_etd, amount_due FROM v_accounting");
    console.table(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
diagnostic();
