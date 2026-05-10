// ═══════════════════════════════════════════════════════════════════════════════
// MODEL — Enseignants (Teachers)
// Couche d'accès aux données pour la table `teachers`
// ═══════════════════════════════════════════════════════════════════════════════

import pool from "../config/database.js";

/**
 * Liste paginée de tous les enseignants avec filtres.
 */
export const getAllTeachers = async ({ page = 1, limit = 20, grade = null, status = null, department_id = null, search = null }) => {
  const offset = (page - 1) * limit;
  let query = `
    SELECT t.id, t.user_id, t.grade, t.rank, t.status, t.speciality, t.contractual_hours,
           t.created_at, t.updated_at,
           u.email, u.first_name, u.last_name, u.is_active,
           d.name as department_name, d.code as department_code, d.id as department_id
    FROM teachers t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN departments d ON d.id = t.department_id
    WHERE u.is_active = TRUE
  `;
  const params = [];
  let paramIndex = 1;

  if (grade) {
    query += ` AND t.grade = $${paramIndex++}`;
    params.push(grade);
  }
  if (status) {
    query += ` AND t.status = $${paramIndex++}`;
    params.push(status);
  }
  if (department_id) {
    query += ` AND t.department_id = $${paramIndex++}`;
    params.push(department_id);
  }
  if (search) {
    query += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Count
  const countQuery = query.replace(/SELECT[\s\S]*?FROM/, "SELECT COUNT(*) as total FROM");
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total, 10);

  // Paginated
  query += ` ORDER BY u.last_name ASC, u.first_name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  return {
    teachers: result.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Récupérer un enseignant par son ID.
 */
export const getTeacherById = async (id) => {
  const result = await pool.query(
    `SELECT t.*, u.email, u.first_name, u.last_name, u.is_active, u.role,
            d.name as department_name, d.code as department_code
     FROM teachers t
     JOIN users u ON u.id = t.user_id
     LEFT JOIN departments d ON d.id = t.department_id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Récupérer un enseignant par l'ID utilisateur.
 */
export const getTeacherByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT t.*, u.email, u.first_name, u.last_name,
            d.name as department_name, d.code as department_code
     FROM teachers t
     JOIN users u ON u.id = t.user_id
     LEFT JOIN departments d ON d.id = t.department_id
     WHERE t.user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

/**
 * Créer un profil enseignant (lié à un user existant).
 */
export const createTeacher = async ({ user_id, department_id, grade, rank, status, speciality, contractual_hours = 192.00 }) => {
  const result = await pool.query(
    `INSERT INTO teachers (user_id, department_id, grade, rank, status, speciality, contractual_hours)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, department_id || null, grade, rank || null, status, speciality || null, contractual_hours]
  );
  return result.rows[0];
};

/**
 * Mettre à jour un profil enseignant.
 */
export const updateTeacher = async (id, { department_id, grade, rank, status, speciality, contractual_hours }) => {
  const fields = [];
  const params = [];
  let paramIndex = 1;

  if (department_id !== undefined) { fields.push(`department_id = $${paramIndex++}`); params.push(department_id); }
  if (grade !== undefined) { fields.push(`grade = $${paramIndex++}`); params.push(grade); }
  if (rank !== undefined) { fields.push(`rank = $${paramIndex++}`); params.push(rank); }
  if (status !== undefined) { fields.push(`status = $${paramIndex++}`); params.push(status); }
  if (speciality !== undefined) { fields.push(`speciality = $${paramIndex++}`); params.push(speciality); }
  if (contractual_hours !== undefined) { fields.push(`contractual_hours = $${paramIndex++}`); params.push(contractual_hours); }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await pool.query(
    `UPDATE teachers SET ${fields.join(", ")} WHERE id = $${paramIndex}
     RETURNING *`,
    params
  );
  return result.rows[0] || null;
};

/**
 * Bilan heures d'un enseignant pour une année académique.
 * Utilise la vue v_teacher_balance.
 */
export const getTeacherBalance = async (teacherId, yearLabel = null) => {
  let query = `SELECT * FROM v_teacher_balance WHERE teacher_id = $1`;
  const params = [teacherId];

  if (yearLabel) {
    query += ` AND academic_year = $2`;
    params.push(yearLabel);
  }

  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Récapitulatif comptable d'un enseignant (via la vue v_accounting).
 */
export const getTeacherAccounting = async (teacherId, yearLabel = null) => {
  let query = `SELECT * FROM v_accounting WHERE teacher_id = $1`;
  const params = [teacherId];

  if (yearLabel) {
    query += ` AND academic_year = $2`;
    params.push(yearLabel);
  }

  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Nombre total d'enseignants actifs.
 */
export const getTeacherCount = async () => {
  const result = await pool.query(
    `SELECT COUNT(*) as total FROM teachers t JOIN users u ON u.id = t.user_id WHERE u.is_active = TRUE`
  );
  return parseInt(result.rows[0].total, 10);
};
