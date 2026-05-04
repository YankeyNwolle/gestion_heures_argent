import pool from "../config/database.js";

// ─── Equivalence Rates (CM/TD/TP → ETD) ────────────────
export const getEquivalenceRates = async () => (await pool.query(`SELECT * FROM equivalence_rates ORDER BY type`)).rows;

export const updateEquivalenceRate = async (type, coefficient) => {
  const r = await pool.query(
    `UPDATE equivalence_rates SET coefficient=$1,updated_at=NOW() WHERE type=$2 RETURNING *`,
    [coefficient, type]
  );
  return r.rows[0]||null;
};

export const getEquivalenceRateByType = async (type) => {
  const r = await pool.query(`SELECT coefficient FROM equivalence_rates WHERE type=$1`,[type]);
  return r.rows[0]?.coefficient || null;
};

// ─── Hourly Rates (taux horaires par grade/statut) ──────
export const getHourlyRates = async () => (await pool.query(`SELECT * FROM hourly_rates ORDER BY grade,status`)).rows;

export const updateHourlyRate = async (grade, status, rate) => {
  const r = await pool.query(
    `UPDATE hourly_rates SET rate=$1,updated_at=NOW() WHERE grade=$2 AND status=$3 RETURNING *`,
    [rate, grade, status]
  );
  return r.rows[0]||null;
};

export const getHourlyRate = async (grade, status) => {
  const r = await pool.query(`SELECT rate FROM hourly_rates WHERE grade=$1 AND status=$2`,[grade,status]);
  return r.rows[0]?.rate || null;
};

// ─── Academic Years ─────────────────────────────────────
export const getAcademicYears = async () => (await pool.query(`SELECT * FROM academic_years ORDER BY start_date DESC`)).rows;

export const getCurrentAcademicYear = async () => {
  const r = await pool.query(`SELECT * FROM academic_years WHERE is_current=TRUE LIMIT 1`);
  return r.rows[0]||null;
};

export const createAcademicYear = async ({label, start_date, end_date, is_current=false}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (is_current) await client.query(`UPDATE academic_years SET is_current=FALSE WHERE is_current=TRUE`);
    const r = await client.query(
      `INSERT INTO academic_years(label,start_date,end_date,is_current)VALUES($1,$2,$3,$4)RETURNING *`,
      [label,start_date,end_date,is_current]
    );
    await client.query('COMMIT');
    return r.rows[0];
  } catch(e) { await client.query('ROLLBACK'); throw e; }
  finally { client.release(); }
};

export const setCurrentYear = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`UPDATE academic_years SET is_current=FALSE WHERE is_current=TRUE`);
    const r = await client.query(`UPDATE academic_years SET is_current=TRUE WHERE id=$1 RETURNING *`,[id]);
    await client.query('COMMIT');
    return r.rows[0]||null;
  } catch(e) { await client.query('ROLLBACK'); throw e; }
  finally { client.release(); }
};

export const closeAcademicYear = async (id) => {
  const r = await pool.query(
    `UPDATE academic_years SET is_current=FALSE WHERE id=$1 RETURNING *`,
    [id]
  );
  return r.rows[0]||null;
};
