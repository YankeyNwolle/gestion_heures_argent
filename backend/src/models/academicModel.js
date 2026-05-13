import pool from "../config/database.js";

// ─── Departments ────────────────────────────────────────
export const getAllDepartments = async () => (await pool.query(`SELECT * FROM departments ORDER BY name`)).rows;
export const getDepartmentById = async (id) => (await pool.query(`SELECT * FROM departments WHERE id=$1`, [id])).rows[0] || null;
export const createDepartment = async ({ name, code, description }) => (await pool.query(`INSERT INTO departments(name,code,description)VALUES($1,$2,$3)RETURNING *`, [name, code || null, description || null])).rows[0];
export const updateDepartment = async (id, { name, code, description }) => {
  const f = [], p = []; let i = 1;
  if (name !== undefined) { f.push(`name=$${i++}`); p.push(name); }
  if (code !== undefined) { f.push(`code=$${i++}`); p.push(code); }
  if (description !== undefined) { f.push(`description=$${i++}`); p.push(description); }
  if (!f.length) return null; p.push(id);
  return (await pool.query(`UPDATE departments SET ${f.join(",")} WHERE id=$${i} RETURNING *`, p)).rows[0] || null;
};
export const deleteDepartment = async (id) => (await pool.query(`DELETE FROM departments WHERE id=$1 RETURNING id`, [id])).rows[0] || null;

// ─── UEs (Unité d'Enseignement) ─────────────────────────
export const getAllUEs = async (department_id = null) => {
  let q = `SELECT u.*,d.name as department_name,ay.label as academic_year FROM ues u LEFT JOIN departments d ON d.id=u.department_id LEFT JOIN academic_years ay ON ay.id=u.academic_year_id WHERE 1=1`;
  const p = [];
  if (department_id) { q += ` AND u.department_id=$1`; p.push(department_id); }
  q += ` ORDER BY u.level,u.name`;
  return (await pool.query(q, p)).rows;
};
export const createUE = async ({ name, code, level, department_id, academic_year_id, semester }) => (await pool.query(`INSERT INTO ues(name,code,level,department_id,academic_year_id,semester)VALUES($1,$2,$3,$4,$5,$6)RETURNING *`, [name, code || null, level, department_id || null, academic_year_id || null, semester || 1])).rows[0];
export const updateUE = async (id, data) => {
  const f = [], p = []; let i = 1;
  for (const [k, v] of Object.entries(data)) { if (v !== undefined && ['name', 'code', 'level', 'department_id', 'academic_year_id', 'semester'].includes(k)) { f.push(`${k}=$${i++}`); p.push(v); } }
  if (!f.length) return null; p.push(id);
  return (await pool.query(`UPDATE ues SET ${f.join(",")} WHERE id=$${i} RETURNING *`, p)).rows[0] || null;
};
export const deleteUE = async (id) => (await pool.query(`DELETE FROM ues WHERE id=$1 RETURNING id`, [id])).rows[0] || null;


// ─── Subjects ───────────────────────────────────────────
export const getAllSubjects = async (ue_id = null) => {
  let q = `SELECT s.*,p.name as ue_name,p.level FROM subjects s LEFT JOIN ues p ON p.id=s.ue_id WHERE 1=1`;
  const p = [];
  if (ue_id) { q += ` AND s.ue_id=$1`; p.push(ue_id); }
  q += ` ORDER BY s.name`;
  return (await pool.query(q, p)).rows;
};
export const getSubjectById = async (id) => (await pool.query(`SELECT s.*,p.name as ue_name FROM subjects s LEFT JOIN ues p ON p.id=s.ue_id WHERE s.id=$1`, [id])).rows[0] || null;
export const createSubject = async ({ name, code, ue_id, cm_hours, td_hours, tp_hours, coefficient }) => (await pool.query(`INSERT INTO subjects(name,code,ue_id,cm_hours,td_hours,tp_hours,coefficient)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *`, [name, code || null, ue_id || null, cm_hours || 0, td_hours || 0, tp_hours || 0, coefficient || 1.0])).rows[0];
export const updateSubject = async (id, data) => {
  const f = [], p = []; let i = 1;
  for (const [k, v] of Object.entries(data)) { if (v !== undefined && ['name', 'code', 'ue_id', 'cm_hours', 'td_hours', 'tp_hours', 'coefficient'].includes(k)) { f.push(`${k}=$${i++}`); p.push(v); } }
  if (!f.length) return null; p.push(id);
  return (await pool.query(`UPDATE subjects SET ${f.join(",")} WHERE id=$${i} RETURNING *`, p)).rows[0] || null;
};
export const deleteSubject = async (id) => (await pool.query(`DELETE FROM subjects WHERE id=$1 RETURNING id`, [id])).rows[0] || null;