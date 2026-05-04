import pool from "../config/database.js";

export const getAuditLogs = async ({ page=1, limit=30, user_id=null, action=null, table_name=null, date_from=null, date_to=null }) => {
  const offset=(page-1)*limit;
  let q=`SELECT a.*,u.first_name,u.last_name,u.email FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id WHERE 1=1`;
  const p=[];let i=1;
  if(user_id){q+=` AND a.user_id=$${i++}`;p.push(user_id);}
  if(action){q+=` AND a.action=$${i++}`;p.push(action);}
  if(table_name){q+=` AND a.table_name ILIKE $${i++}`;p.push(`%${table_name}%`);}
  if(date_from){q+=` AND a.created_at>=$${i++}`;p.push(date_from);}
  if(date_to){q+=` AND a.created_at<=$${i++}`;p.push(date_to);}
  const cq=q.replace(/SELECT[\s\S]*?FROM/,"SELECT COUNT(*) as total FROM");
  const cr=await pool.query(cq,p);
  const total=parseInt(cr.rows[0].total,10);
  q+=` ORDER BY a.created_at DESC LIMIT $${i++} OFFSET $${i}`;
  p.push(limit,offset);
  const r=await pool.query(q,p);
  return {logs:r.rows,pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}};
};

export const createAuditLog = async ({user_id,action,table_name,record_id,details}) => {
  const r=await pool.query(
    `INSERT INTO audit_logs(user_id,action,table_name,record_id,details)VALUES($1,$2,$3,$4,$5)RETURNING *`,
    [user_id||null,action,table_name,record_id||null,details?JSON.stringify(details):null]
  );
  return r.rows[0];
};

export const getRecentAuditLogs = async (limit=10) => {
  return(await pool.query(
    `SELECT a.*,u.first_name,u.last_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT $1`,[limit]
  )).rows;
};
