import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { updateLastLogin } from "../models/userModel.js";

// ═══ INSCRIPTION ═══
export const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, first_name, last_name, grade, status } = req.body;
    await client.query('BEGIN');
    const userExists = await client.query("SELECT id FROM users WHERE email=$1",[email]);
    if (userExists.rows.length > 0) { await client.query('ROLLBACK'); return res.status(400).json({message:"Email déjà utilisé"}); }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await client.query(
      `INSERT INTO users(email,password_hash,first_name,last_name,role)VALUES($1,$2,$3,$4,'enseignant')RETURNING id,email,first_name,last_name,role`,
      [email,hashedPassword,first_name,last_name]
    );
    const userData = newUser.rows[0];
    await client.query(`INSERT INTO teachers(user_id,grade,status)VALUES($1,$2,$3)`,[userData.id,grade??'assistant',status??'permanent']);
    // Audit log
    await client.query(`INSERT INTO audit_logs(user_id,action,table_name,record_id,details)VALUES($1,'POST','/api/auth/register',$2,$3)`,
      [userData.id,userData.id,JSON.stringify({email,first_name,last_name,grade:grade??'assistant'})]
    );
    await client.query('COMMIT');
    const token = jwt.sign({id:userData.id,email:userData.email,role:userData.role},process.env.JWT_SECRET,{expiresIn:"8h"});
    res.status(201).json({message:"Utilisateur créé avec succès",token,user:{...userData,grade:grade??'assistant',status:status??'permanent'}});
  } catch(error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({message:"Erreur serveur",detail:error.message});
  } finally { client.release(); }
};

// ═══ CONNEXION ═══
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userQuery = await pool.query(
      `SELECT u.*, t.id as teacher_id 
       FROM users u LEFT JOIN teachers t ON t.user_id = u.id 
       WHERE u.email=$1`, [email]
    );
    if (userQuery.rows.length === 0) return res.status(401).json({message:"Identifiants invalides"});
    const user = userQuery.rows[0];
    if (!user.is_active) return res.status(403).json({message:"Compte désactivé. Contactez l'administration."});
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({message:"Identifiants invalides"});
    await updateLastLogin(user.id);
    // Include role in JWT for RBAC
    const token = jwt.sign(
      {id:user.id,email:user.email,role:user.role},
      process.env.JWT_SECRET,{expiresIn:"8h"}
    );
    // Audit log
    pool.query(`INSERT INTO audit_logs(user_id,action,table_name,details)VALUES($1,'POST','/api/auth/login',$2)`,
      [user.id,JSON.stringify({email})]
    ).catch(()=>{});
    res.json({token,user:{id:user.id,email:user.email,first_name:user.first_name,last_name:user.last_name,role:user.role,teacher_id:user.teacher_id}});
  } catch(error) { console.error(error); res.status(500).json({message:"Erreur serveur"}); }
};

// ═══ PROFIL CONNECTÉ ═══
export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id,u.email,u.first_name,u.last_name,u.role,u.is_active,u.last_login,
              t.id as teacher_id,t.grade,t.status as teacher_status,t.speciality,t.contractual_hours,
              d.name as department_name
       FROM users u LEFT JOIN teachers t ON t.user_id=u.id LEFT JOIN departments d ON d.id=t.department_id
       WHERE u.id=$1`,[req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({message:"Utilisateur non trouvé"});
    res.json({user:result.rows[0]});
  } catch(error) { console.error(error); res.status(500).json({message:"Erreur serveur"}); }
};

// ═══ CHANGEMENT DE MOT DE PASSE ═══
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({message:"Tous les champs sont requis"});
    
    const user = await pool.query("SELECT password_hash FROM users WHERE id=$1", [req.user.id]);
    if (user.rows.length === 0) return res.status(404).json({message:"Utilisateur non trouvé"});
    
    const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
    if (!validPassword) return res.status(401).json({message:"Mot de passe actuel incorrect"});
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2", [hashedPassword, req.user.id]);
    
    pool.query(`INSERT INTO audit_logs(user_id,action,table_name,details)VALUES($1,'PUT','/api/auth/change-password',$2)`,
      [req.user.id, JSON.stringify({action: "password_change"})]
    ).catch(()=>{});
    
    res.json({message:"Mot de passe mis à jour avec succès"});
  } catch(error) {
    console.error(error);
    res.status(500).json({message:"Erreur serveur"});
  }
};