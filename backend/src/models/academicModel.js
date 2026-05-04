import pool from "../config/database.js";

// ─── Departments ────────────────────────────────────────
export const getAllDepartments = async () => (await pool.query(`SELECT * FROM departments ORDER BY name`)).rows;
export const getDepartmentById = async (id) => (await pool.query(`SELECT * FROM departments WHERE id=$1`,[id])).rows[0]||null;
export const createDepartment = async ({name,code,description}) => (await pool.query(`INSERT INTO departments(name,code,description)VALUES($1,$2,$3)RETURNING *`,[name,code||null,description||null])).rows[0];
export const updateDepartment = async (id,{name,code,description}) => {
  const f=[],p=[];let i=1;
  if(name!==undefined){f.push(`name=$${i++}`);p.push(name);}
  if(code!==undefined){f.push(`code=$${i++}`);p.push(code);}
  if(description!==undefined){f.push(`description=$${i++}`);p.push(description);}
  if(!f.length)return null;p.push(id);
  return(await pool.query(`UPDATE departments SET ${f.join(",")} WHERE id=$${i} RETURNING *`,p)).rows[0]||null;
};
export const deleteDepartment = async (id) => (await pool.query(`DELETE FROM departments WHERE id=$1 RETURNING id`,[id])).rows[0]||null;

// ─── Programs ───────────────────────────────────────────
export const getAllPrograms = async (department_id=null) => {
  let q=`SELECT p.*,d.name as department_name,ay.label as academic_year FROM programs p LEFT JOIN departments d ON d.id=p.department_id LEFT JOIN academic_years ay ON ay.id=p.academic_year_id WHERE 1=1`;
  const p=[];
  if(department_id){q+=` AND p.department_id=$1`;p.push(department_id);}
  q+=` ORDER BY p.level,p.name`;
  return(await pool.query(q,p)).rows;
};
export const createProgram = async ({name,code,level,department_id,academic_year_id}) => (await pool.query(`INSERT INTO programs(name,code,level,department_id,academic_year_id)VALUES($1,$2,$3,$4,$5)RETURNING *`,[name,code||null,level,department_id||null,academic_year_id||null])).rows[0];
export const updateProgram = async (id,data) => {
  const f=[],p=[];let i=1;
  for(const[k,v]of Object.entries(data)){if(v!==undefined&&['name','code','level','department_id','academic_year_id'].includes(k)){f.push(`${k}=$${i++}`);p.push(v);}}
  if(!f.length)return null;p.push(id);
  return(await pool.query(`UPDATE programs SET ${f.join(",")} WHERE id=$${i} RETURNING *`,p)).rows[0]||null;
};
export const deleteProgram = async (id) => (await pool.query(`DELETE FROM programs WHERE id=$1 RETURNING id`,[id])).rows[0]||null;

// ─── Subjects ───────────────────────────────────────────
export const getAllSubjects = async (program_id=null) => {
  let q=`SELECT s.*,p.name as program_name,p.level FROM subjects s LEFT JOIN programs p ON p.id=s.program_id WHERE 1=1`;
  const p=[];
  if(program_id){q+=` AND s.program_id=$1`;p.push(program_id);}
  q+=` ORDER BY s.name`;
  return(await pool.query(q,p)).rows;
};
export const getSubjectById = async (id) => (await pool.query(`SELECT s.*,p.name as program_name FROM subjects s LEFT JOIN programs p ON p.id=s.program_id WHERE s.id=$1`,[id])).rows[0]||null;
export const createSubject = async ({name,code,program_id,cm_hours,td_hours,tp_hours,coefficient}) => (await pool.query(`INSERT INTO subjects(name,code,program_id,cm_hours,td_hours,tp_hours,coefficient)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *`,[name,code||null,program_id||null,cm_hours||0,td_hours||0,tp_hours||0,coefficient||1.0])).rows[0];
export const updateSubject = async (id,data) => {
  const f=[],p=[];let i=1;
  for(const[k,v]of Object.entries(data)){if(v!==undefined&&['name','code','program_id','cm_hours','td_hours','tp_hours','coefficient'].includes(k)){f.push(`${k}=$${i++}`);p.push(v);}}
  if(!f.length)return null;p.push(id);
  return(await pool.query(`UPDATE subjects SET ${f.join(",")} WHERE id=$${i} RETURNING *`,p)).rows[0]||null;
};
export const deleteSubject = async (id) => (await pool.query(`DELETE FROM subjects WHERE id=$1 RETURNING id`,[id])).rows[0]||null;
