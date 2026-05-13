import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/gestion_heures"
});

async function seed() {
  const password = await bcrypt.hash('Enseignant123!', 12);
  
  try {
    // 1. Create 3 Teachers
    const teachers = [
      { email: 'asst@univ.ci', first: 'Alain', last: 'Koffi', grade: 'assistant', status: 'permanent', hours: 192 },
      { email: 'mait@univ.ci', first: 'Bertin', last: 'Yao', grade: 'maitre_assistant', status: 'permanent', hours: 192 },
      { email: 'prof@univ.ci', first: 'Charles', last: 'Diallo', grade: 'professeur', status: 'permanent', hours: 192 },
    ];

    console.log("--- Création des enseignants ---");
    for (const t of teachers) {
      // Check if user exists
      const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [t.email]);
      let userId;
      if (userRes.rows.length === 0) {
        const insUser = await pool.query(
          'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [t.email, password, t.first, t.last, 'enseignant']
        );
        userId = insUser.rows[0].id;
      } else {
        userId = userRes.rows[0].id;
      }

      // Create teacher profile
      await pool.query(
        'INSERT INTO teachers (user_id, department_id, grade, status, contractual_hours) VALUES ($1, 1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET grade=$2, status=$3, contractual_hours=$4',
        [userId, t.grade, t.status, t.hours]
      );
      console.log(`✅ ${t.first} ${t.last} (${t.grade}) créé.`);
    }

    // 2. Add some hours for them (via a "RH" simulation)
    const currentYear = await pool.query('SELECT id FROM academic_years WHERE is_current=TRUE LIMIT 1');
    const yearId = currentYear.rows[0].id;
    
    // Get teacher IDs
    const tIds = await pool.query('SELECT t.id, u.first_name FROM teachers t JOIN users u ON u.id=t.user_id WHERE u.email IN (\'asst@univ.ci\', \'mait@univ.ci\', \'prof@univ.ci\')');
    
    console.log("\n--- Saisie des heures (Simulée par RH) ---");
    for (const row of tIds.rows) {
      // Add 20h for each (mix of CM, TD)
      const entries = [
        { type: 'CM', h: 4, etd: 6, subject: 1, date: '2026-05-01' },
        { type: 'TD', h: 2, etd: 2, subject: 2, date: '2026-05-05' },
      ];

      for (const e of entries) {
        await pool.query(
          'INSERT INTO hour_entries (teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 2)',
          [row.id, e.subject, yearId, e.date, e.type, e.h, e.etd, 'pending']
        );
      }
      console.log(`✅ Heures ajoutées pour ${row.first_name}.`);
    }

    console.log("\n🚀 Données de démo prêtes !");
    console.log("Emails: asst@univ.ci, mait@univ.ci, prof@univ.ci");
    console.log("Mot de passe: Enseignant123!");

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

seed();
