// ═══════════════════════════════════════════════════════════════════════════════
// MODEL — Utilisateurs (Users)
// Couche d'accès aux données pour la table `users`
// ═══════════════════════════════════════════════════════════════════════════════

import pool from "../config/database.js";
import bcrypt from "bcrypt";

/**
 * Créer un nouvel utilisateur.
 */
export const createUser = async ({ email, password, first_name, last_name, role = "enseignant" }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, role, is_active, created_at`,
    [email, hashedPassword, first_name, last_name, role]
  );
  return result.rows[0];
};

/**
 * Récupérer un utilisateur par ID (avec profil enseignant si applicable).
 */
export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.is_active,
            u.last_login, u.created_at, u.updated_at,
            t.id as teacher_id, t.grade, t.status as teacher_status,
            t.speciality, t.contractual_hours,
            d.name as department_name, d.id as department_id
     FROM users u
     LEFT JOIN teachers t ON t.user_id = u.id
     LEFT JOIN departments d ON d.id = t.department_id
     WHERE u.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Récupérer un utilisateur par email.
 */
export const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Liste paginée de tous les utilisateurs avec filtre optionnel par rôle.
 */
export const getAllUsers = async ({ page = 1, limit = 20, role = null, search = null }) => {
  const offset = (page - 1) * limit;
  let query = `
    SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.is_active,
           u.last_login, u.created_at
    FROM users u
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (role) {
    query += ` AND u.role = $${paramIndex++}`;
    params.push(role);
  }

  if (search) {
    query += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Count total
  const countResult = await pool.query(
    query.replace(/SELECT[\s\S]*?FROM/, "SELECT COUNT(*) as total FROM"),
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  // Paginated results
  query += ` ORDER BY u.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  return {
    users: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Mettre à jour un utilisateur.
 */
export const updateUser = async (id, { email, first_name, last_name, role, is_active }) => {
  const fields = [];
  const params = [];
  let paramIndex = 1;

  if (email !== undefined) { fields.push(`email = $${paramIndex++}`); params.push(email); }
  if (first_name !== undefined) { fields.push(`first_name = $${paramIndex++}`); params.push(first_name); }
  if (last_name !== undefined) { fields.push(`last_name = $${paramIndex++}`); params.push(last_name); }
  if (role !== undefined) { fields.push(`role = $${paramIndex++}`); params.push(role); }
  if (is_active !== undefined) { fields.push(`is_active = $${paramIndex++}`); params.push(is_active); }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex}
     RETURNING id, email, first_name, last_name, role, is_active, updated_at`,
    params
  );
  return result.rows[0] || null;
};

/**
 * Supprimer un utilisateur (soft delete — désactiver le compte).
 */
export const deleteUser = async (id) => {
  const result = await pool.query(
    `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1
     RETURNING id, email, is_active`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Mettre à jour la date de dernière connexion.
 */
export const updateLastLogin = async (id) => {
  await pool.query(
    `UPDATE users SET last_login = NOW() WHERE id = $1`,
    [id]
  );
};

/**
 * Changer le mot de passe d'un utilisateur.
 */
export const updatePassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [hashedPassword, id]
  );
};
