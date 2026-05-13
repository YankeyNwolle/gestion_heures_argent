import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion_heures_universitaire',
  password: 'bonjourjesuis14',
  port: 5432,
});

async function seed() {
  try {
    console.log('--- Démarrage de la génération des données démo ---');
    
    // Hash du mot de passe commun: "Pass1234!"
    const hash = await bcrypt.hash('Pass1234!', 10);
    
    // 1. S'assurer qu'un département existe
    const deptRes = await pool.query("INSERT INTO departments (name, code) VALUES ('Sciences et Technologie', 'ST') ON CONFLICT DO NOTHING RETURNING id");
    const deptId = deptRes.rows[0]?.id || 1;

    // 2. S'assurer qu'une année académique active existe
    const yearRes = await pool.query("INSERT INTO academic_years (label, start_date, end_date, is_current) VALUES ('2025-2026', '2025-09-01', '2026-07-31', TRUE) ON CONFLICT (label) DO UPDATE SET is_current = TRUE RETURNING id");
    const yearId = yearRes.rows[0].id;
    const yearLabel = '2025-2026';

    // 3. Création des 3 utilisateurs / enseignants
    const teachersData = [
      { email: 'prof.yao@univ.ci', first: 'Amani', last: 'Yao', grade: 'professeur', status: 'permanent', quota: 192 },
      { email: 'dr.traore@univ.ci', first: 'Moussa', last: 'Traoré', grade: 'maitre_assistant', status: 'permanent', quota: 192 },
      { email: 'm.bakayoko@univ.ci', first: 'Bakary', last: 'Bakayoko', grade: 'assistant', status: 'vacataire', quota: 0 },
    ];

    const teacherIds = [];

    for (const t of teachersData) {
      // Créer user
      const userRes = await pool.query(
        "INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, 'enseignant') ON CONFLICT (email) DO UPDATE SET first_name=$3 RETURNING id",
        [t.email, hash, t.first, t.last]
      );
      const userId = userRes.rows[0].id;
      
      // Créer prof
      const profRes = await pool.query(
        "INSERT INTO teachers (user_id, department_id, grade, status, contractual_hours) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET grade=$3, status=$4 RETURNING id",
        [userId, deptId, t.grade, t.status, t.quota]
      );
      teacherIds.push(profRes.rows[0].id);
      console.log(`Enseignant créé: ${t.first} ${t.last} (${t.grade})`);
    }

    // 4. Créer des matières
    const sub1 = await pool.query("INSERT INTO subjects (name, code) VALUES ('Architecture des Ordinateurs', 'INF101') ON CONFLICT DO NOTHING RETURNING id");
    const sub2 = await pool.query("INSERT INTO subjects (name, code) VALUES ('Calcul Numérique', 'MAT201') ON CONFLICT DO NOTHING RETURNING id");
    const s1Id = sub1.rows[0]?.id || 1;
    const s2Id = sub2.rows[0]?.id || 2;

    // 5. Attribuer des heures par le RH (Simulé: status = 'pending')
    // On efface les anciennes heures de démo pour ces profs pour avoir un tableau propre
    await pool.query("DELETE FROM hour_entries WHERE teacher_id = ANY($1)", [teacherIds]);

    const hoursEntries = [
      { tId: teacherIds[0], sId: s1Id, type: 'CM', h: 4, date: '2026-05-02', notes: 'Cours Magistral Intro' },
      { tId: teacherIds[0], sId: s1Id, type: 'TD', h: 2, date: '2026-05-05', notes: 'Exercices Architecture' },
      { tId: teacherIds[1], sId: s2Id, type: 'TD', h: 3, date: '2026-05-03', notes: 'TD Matrices' },
      { tId: teacherIds[2], sId: s2Id, type: 'TP', h: 4, date: '2026-05-04', notes: 'TP Matlab' },
    ];

    for (const h of hoursEntries) {
      // Calcul ETD simplifié pour le seed
      let coeff = 1.0;
      if (h.type === 'CM') coeff = 1.5;
      if (h.type === 'TP') coeff = 0.75;
      const etd = h.h * coeff;

      await pool.query(
        "INSERT INTO hour_entries (teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)",
        [h.tId, h.sId, yearId, h.date, h.type, h.h, etd, h.notes]
      );
    }

    console.log('--- Données démo générées avec succès ---');
    console.log('Emails: prof.yao@univ.ci, dr.traore@univ.ci, m.bakayoko@univ.ci');
    console.log('Mot de passe: Pass1234!');
    
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors du seeding:', err);
    process.exit(1);
  }
}

seed();
