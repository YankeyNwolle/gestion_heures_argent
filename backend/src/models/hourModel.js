import pool from "../config/database.js";

export const createHourEntry = async ({ teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, room, notes, created_by }) => {
  const result = await pool.query(
    `INSERT INTO hour_entries (teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, room, notes, created_by, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending') RETURNING *`,
    [teacher_id, subject_id||null, academic_year_id||null, date, type, hours, etd_hours, room||null, notes||null, created_by]
  );
  return result.rows[0];
};

export const getHourEntryById = async (id) => {
  const result = await pool.query(
    `SELECT h.*, s.name as subject_name, s.code as subject_code,
            u.first_name as teacher_first_name, u.last_name as teacher_last_name
     FROM hour_entries h LEFT JOIN subjects s ON s.id=h.subject_id
     LEFT JOIN teachers t ON t.id=h.teacher_id LEFT JOIN users u ON u.id=t.user_id
     WHERE h.id=$1`, [id]
  );
  return result.rows[0] || null;
};

export const getHourEntries = async ({ page=1, limit=20, teacher_id=null, type=null, status=null, academic_year_id=null, date_from=null, date_to=null }) => {
  const offset = (page-1)*limit;
  let q = `SELECT h.*, s.name as subject_name, u.first_name as teacher_first_name, u.last_name as teacher_last_name, t.grade
     FROM hour_entries h LEFT JOIN subjects s ON s.id=h.subject_id
     LEFT JOIN teachers t ON t.id=h.teacher_id LEFT JOIN users u ON u.id=t.user_id WHERE 1=1`;
  const p = []; let i = 1;
  if(teacher_id){q+=` AND h.teacher_id=$${i++}`;p.push(teacher_id);}
  if(type){q+=` AND h.type=$${i++}`;p.push(type);}
  if(status){q+=` AND h.status=$${i++}`;p.push(status);}
  if(academic_year_id){q+=` AND h.academic_year_id=$${i++}`;p.push(academic_year_id);}
  if(date_from){q+=` AND h.date>=$${i++}`;p.push(date_from);}
  if(date_to){q+=` AND h.date<=$${i++}`;p.push(date_to);}
  const cq = q.replace(/SELECT[\s\S]*?FROM/,"SELECT COUNT(*) as total FROM");
  const cr = await pool.query(cq,p);
  const total = parseInt(cr.rows[0].total,10);
  q += ` ORDER BY h.date DESC LIMIT $${i++} OFFSET $${i}`;
  p.push(limit,offset);
  const result = await pool.query(q,p);
  return { entries:result.rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)} };
};

export const getRecentEntries = async (teacherId, limit=5) => {
  const r = await pool.query(
    `SELECT h.*, s.name as subject_name FROM hour_entries h LEFT JOIN subjects s ON s.id=h.subject_id
     WHERE h.teacher_id=$1 ORDER BY h.date DESC LIMIT $2`, [teacherId,limit]
  );
  return r.rows;
};

export const getPendingEntries = async (academic_year_id=null) => {
  let q = `SELECT h.*, s.name as subject_name, u.first_name as teacher_first_name, u.last_name as teacher_last_name, t.grade
     FROM hour_entries h LEFT JOIN subjects s ON s.id=h.subject_id
     LEFT JOIN teachers t ON t.id=h.teacher_id LEFT JOIN users u ON u.id=t.user_id WHERE h.status='pending'`;
  const p = [];
  if(academic_year_id){q+=` AND h.academic_year_id=$1`;p.push(academic_year_id);}
  q += ` ORDER BY h.date ASC`;
  return (await pool.query(q,p)).rows;
};

/** Heures en attente ou contestées pour l'enseignant connecté (vue « Mes validations »). */
export const getTeacherValidationEntries = async (teacherId, academic_year_id=null) => {
  let q = `SELECT h.*, s.name as subject_name, u.first_name as teacher_first_name, u.last_name as teacher_last_name, t.grade
     FROM hour_entries h LEFT JOIN subjects s ON s.id=h.subject_id
     LEFT JOIN teachers t ON t.id=h.teacher_id LEFT JOIN users u ON u.id=t.user_id
     WHERE h.teacher_id=$1 AND h.status IN ('pending','contested')`;
  const p = [teacherId];
  let i = 2;
  if (academic_year_id) { q += ` AND h.academic_year_id=$${i++}`; p.push(academic_year_id); }
  q += ` ORDER BY h.date ASC`;
  return (await pool.query(q, p)).rows;
};

export const validateEntry = async (id, validatorId) => {
  const r = await pool.query(
    `UPDATE hour_entries SET status='validated',validated_by=$1,validated_at=NOW(),updated_at=NOW() WHERE id=$2 RETURNING *`,
    [validatorId,id]
  );
  return r.rows[0]||null;
};

export const validateAllPending = async (validatorId, academic_year_id=null) => {
  let q = `UPDATE hour_entries SET status='validated',validated_by=$1,validated_at=NOW(),updated_at=NOW() WHERE status='pending'`;
  const p = [validatorId];
  if(academic_year_id){q+=` AND academic_year_id=$2`;p.push(academic_year_id);}
  q += ` RETURNING id`;
  return (await pool.query(q,p)).rows.length;
};

export const contestEntry = async (id, reason) => {
  const r = await pool.query(
    `UPDATE hour_entries SET status='contested',contest_reason=$1,updated_at=NOW() WHERE id=$2 RETURNING *`,
    [reason,id]
  );
  return r.rows[0]||null;
};

export const updateHourEntry = async (id, data) => {
  const f=[],p=[];let i=1;
  for(const[k,v]of Object.entries(data)){if(v!==undefined&&['subject_id','date','type','hours','etd_hours','room','notes'].includes(k)){f.push(`${k}=$${i++}`);p.push(v);}}
  if(!f.length)return null;
  f.push(`updated_at=NOW()`,`status='pending'`);p.push(id);
  const r=await pool.query(`UPDATE hour_entries SET ${f.join(",")} WHERE id=$${i} RETURNING *`,p);
  return r.rows[0]||null;
};

export const deleteHourEntry = async (id) => {
  return (await pool.query(`DELETE FROM hour_entries WHERE id=$1 RETURNING id`,[id])).rows[0]||null;
};

export const getMonthlyStats = async (academic_year_id) => {
  return (await pool.query(
    `SELECT EXTRACT(MONTH FROM date) as month, EXTRACT(YEAR FROM date) as year,
       SUM(CASE WHEN type='CM' THEN etd_hours ELSE 0 END) as cm_etd,
       SUM(CASE WHEN type='TD' THEN etd_hours ELSE 0 END) as td_etd,
       SUM(CASE WHEN type='TP' THEN etd_hours ELSE 0 END) as tp_etd,
       SUM(etd_hours) as total_etd, COUNT(*) as entries_count
     FROM hour_entries WHERE academic_year_id=$1
     GROUP BY EXTRACT(YEAR FROM date),EXTRACT(MONTH FROM date) ORDER BY year,month`,
    [academic_year_id]
  )).rows;
};

export const getDistribution = async (teacherId=null, academic_year_id=null) => {
  let q = `SELECT type,SUM(hours) as raw_hours,SUM(etd_hours) as etd_hours,COUNT(*) as count FROM hour_entries WHERE 1=1`;
  const p=[];let i=1;
  if(teacherId){q+=` AND teacher_id=$${i++}`;p.push(teacherId);}
  if(academic_year_id){q+=` AND academic_year_id=$${i++}`;p.push(academic_year_id);}
  q+=` GROUP BY type ORDER BY type`;
  return (await pool.query(q,p)).rows;
};
