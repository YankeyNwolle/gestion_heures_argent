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
    await pool.query('DELETE FROM hourly_rates');
    await pool.query(`
      INSERT INTO hourly_rates (grade, status, rate) VALUES 
      ('professeur', 'permanent', 20000),
      ('professeur', 'vacataire', 25000),
      ('maitre_assistant', 'permanent', 15000),
      ('maitre_assistant', 'vacataire', 18000),
      ('assistant', 'permanent', 10000),
      ('assistant', 'vacataire', 12000),
      ('autres', 'permanent', 8000),
      ('autres', 'vacataire', 10000)
    `);
    console.log('Taux horaires configurés avec succès !');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
