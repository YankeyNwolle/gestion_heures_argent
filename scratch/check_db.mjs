import pool from "../backend/src/config/database.js";
import "dotenv/config";

async function check() {
  const users = await pool.query("SELECT * FROM users");
  console.log("USERS:", users.rows.map(u => ({ id: u.id, email: u.email, role: u.role, is_active: u.is_active })));
  
  const teachers = await pool.query("SELECT * FROM teachers");
  console.log("TEACHERS:", teachers.rows.map(t => ({ id: t.id, user_id: t.user_id, department_id: t.department_id })));
  
  process.exit(0);
}
check();
