import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion_heures_universitaire',
  password: 'bonjourjesuis14',
  port: 5432,
});

async function seed() {
  try {
    console.log('--- DÉBUT DE L\'INJECTION ACADÉMIQUE ---');

    // 1. Départements (UFR)
    const depts = [
      ['UFR Mathématiques et Informatique', 'MATH-INFO'],
      ['UFR Sciences Juridiques et Politiques', 'DROIT'],
      ['UFR Sciences Économiques et Gestion', 'ECO-GEST'],
      ['UFR Biosciences', 'BIO'],
      ['UFR Sciences de l\'Homme et de la Société', 'SHS'],
      ['UFR Lettres, Langues et Arts', 'LLA'],
      ['UFR Sciences de la Terre et des Ressources Minières', 'STRM']
    ];

    for (const [name, code] of depts) {
      await pool.query('INSERT INTO departments (name, code) VALUES ($1, $2) ON CONFLICT DO NOTHING', [name, code]);
    }
    console.log('✅ Départements ajoutés.');

    // 2. Filières (UEs)
    const ues = [
      ['Licence Informatique', 'L_INFO', 'L1', 'MATH-INFO'],
      ['Master Big Data et IA', 'M_BDIA', 'M1', 'MATH-INFO'],
      ['Licence Droit Privé', 'L_DROIT_P', 'L2', 'DROIT'],
      ['Master Droit des Affaires', 'M_DROIT_A', 'M2', 'DROIT'],
      ['Licence Gestion des Entreprises', 'L_GEST', 'L3', 'ECO-GEST'],
      ['Master Finance', 'M_FIN', 'M2', 'ECO-GEST'],
      ['Licence Biotechnologie', 'L_BIO', 'L2', 'BIO'],
      ['Licence Communication', 'L_COMM', 'L1', 'LLA']
    ];

    for (const [name, code, level, deptCode] of ues) {
      const dept = await pool.query('SELECT id FROM departments WHERE code = $1', [deptCode]);
      if (dept.rows[0]) {
        await pool.query('INSERT INTO ues (name, code, level, department_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [name, code, level, dept.rows[0].id]);
      }
    }
    console.log('✅ Filières (UEs) ajoutées.');

    // 3. Matières (Subjects)
    const subjects = [
      // INFO
      ['Algorithmique et Structures de Données', 'INFO101', 'L_INFO', 30, 20, 15],
      ['Bases de Données Relationnelles', 'INFO201', 'L_INFO', 25, 15, 10],
      ['Programmation Orientée Objet (Java)', 'INFO202', 'L_INFO', 20, 20, 20],
      ['Réseaux Informatiques', 'INFO301', 'L_INFO', 20, 10, 10],
      ['Machine Learning Appliqué', 'INFO501', 'M_BDIA', 30, 0, 30],
      ['Architecture Cloud', 'INFO502', 'M_BDIA', 20, 0, 20],
      
      // DROIT
      ['Droit Civil : Les Personnes', 'DRT101', 'L_DROIT_P', 40, 20, 0],
      ['Droit Constitutionnel', 'DRT102', 'L_DROIT_P', 35, 15, 0],
      ['Droit Pénal Général', 'DRT201', 'L_DROIT_P', 30, 10, 0],
      ['Droit des Sociétés', 'DRT501', 'M_DROIT_A', 30, 10, 0],
      
      // ECO-GEST
      ['Microéconomie 1', 'ECO101', 'L_GEST', 30, 20, 0],
      ['Macroéconomie 1', 'ECO102', 'L_GEST', 30, 20, 0],
      ['Comptabilité Générale', 'GST101', 'L_GEST', 20, 30, 0],
      ['Marketing Stratégique', 'GST501', 'M_FIN', 25, 15, 0],
      ['Analyse Financière', 'GST502', 'M_FIN', 30, 10, 0],
      
      // BIO
      ['Biologie Cellulaire', 'BIO101', 'L_BIO', 30, 10, 20],
      ['Génétique Mendélienne', 'BIO201', 'L_BIO', 25, 15, 10],
      
      // LLA
      ['Théories de la Communication', 'COM101', 'L_COMM', 30, 10, 0],
      ['Journalisme et Éthique', 'COM301', 'L_COMM', 20, 10, 0]
    ];

    for (const [name, code, ueCode, cm, td, tp] of subjects) {
      const ue = await pool.query('SELECT id FROM ues WHERE code = $1', [ueCode]);
      if (ue.rows[0]) {
        await pool.query(
          'INSERT INTO subjects (name, code, ue_id, cm_hours, td_hours, tp_hours) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
          [name, code, ue.rows[0].id, cm, td, tp]
        );
      }
    }
    console.log('✅ Matières (Subjects) ajoutées.');

    console.log('--- INJECTION TERMINÉE AVEC SUCCÈS ---');
    process.exit(0);
  } catch (e) {
    console.error('❌ Erreur lors de l\'injection :', e);
    process.exit(1);
  }
}

seed();
