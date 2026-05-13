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
  const tableName = process.argv[2];
  if (!tableName) {
    console.log("Usage: node check_generic.js <table_name>");
    process.exit(1);
  }
  console.log(`--- ${tableName.toUpperCase()} COLUMNS ---`);
  const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`, [tableName]);
  console.table(res.rows);
  process.exit(0);
}
run();
