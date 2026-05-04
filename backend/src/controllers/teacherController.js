import * as TeacherModel from "../models/teacherModel.js";

export const getTeachers = async (req, res) => {
  try {
    const {page=1,limit=20,grade,status,department_id,search} = req.query;
    const result = await TeacherModel.getAllTeachers({page:parseInt(page),limit:parseInt(limit),grade,status,department_id:department_id?parseInt(department_id):null,search});
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
    const teacher = await TeacherModel.createTeacher(req.body);
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
