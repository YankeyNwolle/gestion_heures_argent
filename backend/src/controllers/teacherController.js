import * as TeacherModel from "../models/teacherModel.js";
import * as UserModel from "../models/userModel.js";
import ExcelJS from "exceljs";
import pool from "../config/database.js";
import fs from "fs";

export const getTeachers = async (req, res) => {
  try {
    const {page=1,limit=20,grade,status,department_id,search} = req.query;
    console.log("DEBUG: getTeachers query params:", req.query);
    console.log("DEBUG: req.user:", req.user);
    const result = await TeacherModel.getAllTeachers({page:parseInt(page),limit:parseInt(limit),grade,status,department_id:department_id?parseInt(department_id):null,search});
    console.log("DEBUG: Teachers found:", result.teachers.length, "Total:", result.pagination.total);
    res.json(result);
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getTeacher = async (req, res) => {
  try {
    const teacher = await TeacherModel.getTeacherById(parseInt(req.params.id));
    if (!teacher) return res.status(404).json({message:"Enseignant non trouvé"});
    res.json({teacher});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getMyProfile = async (req, res) => {
  try {
    const teacher = await TeacherModel.getTeacherByUserId(req.user.id);
    if (!teacher) return res.status(404).json({message:"Profil enseignant non trouvé"});
    res.json({teacher});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const createTeacher = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.status === 'vacataire') {
      data.contractual_hours = 0;
    }
    const teacher = await TeacherModel.createTeacher(data);
    res.status(201).json({message:"Enseignant créé",teacher});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur",detail:e.message}); }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await TeacherModel.updateTeacher(parseInt(req.params.id), req.body);
    if (!teacher) return res.status(404).json({message:"Enseignant non trouvé"});
    res.json({message:"Enseignant mis à jour",teacher});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getTeacherBalance = async (req, res) => {
  try {
    const {year} = req.query;
    const balance = await TeacherModel.getTeacherBalance(parseInt(req.params.id), year);
    res.json({balance});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getTeacherAccounting = async (req, res) => {
  try {
    const {year} = req.query;
    const accounting = await TeacherModel.getTeacherAccounting(parseInt(req.params.id), year);
    res.json({accounting});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getTeacherCount = async (req, res) => {
  try {
    const count = await TeacherModel.getTeacherCount();
    res.json({count});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getMyUEs = async (req, res) => {
  try {
    const teacher = await TeacherModel.getTeacherByUserId(req.user.id);
    if (!teacher) return res.status(404).json({message:"Profil enseignant non trouvé"});
    const ues = await TeacherModel.getTeacherUEs(teacher.id);
    res.json({ues});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
export const importTeachers = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Fichier Excel requis" });
  
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    
    const teachers = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      teachers.push({
        email: row.getCell(1).text,
        first_name: row.getCell(2).text,
        last_name: row.getCell(3).text,
        grade: row.getCell(4).text, // assistant, maitre_assistant, professeur
        rank: row.getCell(5).text,  // A, B
        status: row.getCell(6).text, // permanent, vacataire
        speciality: row.getCell(7).text,
        department_code: row.getCell(8).text
      });
    });

    const results = { success: 0, errors: 0, details: [] };

    for (const t of teachers) {
      try {
        if (!t.email || !t.first_name) continue;

        // 1. Check if user exists
        let user = await UserModel.getUserByEmail(t.email);
        if (!user) {
          user = await UserModel.createUser({
            email: t.email,
            first_name: t.first_name,
            last_name: t.last_name,
            password: "Password123!", // Default password
            role: "enseignant"
          });
        }

        // 2. Get department id
        const deptRes = await pool.query("SELECT id FROM departments WHERE code = $1", [t.department_code]);
        const deptId = deptRes.rows[0]?.id || null;

        // 3. Determine contractual hours based on status and rank
        let hours = 192;
        if (t.status === 'vacataire') {
          hours = 0; // Les vacataires n'ont pas d'heures contractuelles (tout est complémentaire)
        } else {
          if (t.rank === 'B') hours = 240;
          if (t.rank === 'A') hours = 150;
        }

        // 4. Create or Update teacher profile
        const existingTeacher = await TeacherModel.getTeacherByUserId(user.id);
        if (existingTeacher) {
          await TeacherModel.updateTeacher(existingTeacher.id, {
            department_id: deptId,
            grade: t.grade || existingTeacher.grade,
            rank: t.rank || existingTeacher.rank,
            status: t.status || existingTeacher.status,
            speciality: t.speciality || existingTeacher.speciality,
            contractual_hours: hours
          });
        } else {
          await TeacherModel.createTeacher({
            user_id: user.id,
            department_id: deptId,
            grade: t.grade || 'assistant',
            rank: t.rank || null,
            status: t.status || 'permanent',
            speciality: t.speciality || '',
            contractual_hours: hours
          });
        }

        results.success++;
      } catch (err) {
        results.errors++;
        results.details.push({ email: t.email, error: err.message });
      }
    }

    // Clean up file
    fs.unlinkSync(req.file.path);

    res.json({ message: "Import terminé", results });
  } catch (e) {
    console.error(e);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Erreur lors de l'import", detail: e.message });
  }
};
