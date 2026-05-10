import * as AcademicModel from "../models/academicModel.js";

// ─── Departments ────────────────────────────────────────
export const getDepartments = async (req,res) => { try{res.json({departments:await AcademicModel.getAllDepartments()});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const getDepartment = async (req,res) => { try{const d=await AcademicModel.getDepartmentById(parseInt(req.params.id));if(!d)return res.status(404).json({message:"Département non trouvé"});res.json({department:d});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const createDepartment = async (req,res) => { try{const d=await AcademicModel.createDepartment(req.body);res.status(201).json({message:"Département créé",department:d});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const updateDepartment = async (req,res) => { try{const d=await AcademicModel.updateDepartment(parseInt(req.params.id),req.body);if(!d)return res.status(404).json({message:"Département non trouvé"});res.json({message:"Département mis à jour",department:d});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const deleteDepartment = async (req,res) => { try{const d=await AcademicModel.deleteDepartment(parseInt(req.params.id));if(!d)return res.status(404).json({message:"Département non trouvé"});res.json({message:"Département supprimé"});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };

// ─── UEs (Unité d'Enseignement) ─────────────────────────
export const getUEs = async (req,res) => { try{res.json({ues:await AcademicModel.getAllUEs(req.query.department_id?parseInt(req.query.department_id):null)});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const createUE = async (req,res) => { try{const u=await AcademicModel.createUE(req.body);res.status(201).json({message:"UE créée",ue:u});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const updateUE = async (req,res) => { try{const u=await AcademicModel.updateUE(parseInt(req.params.id),req.body);if(!u)return res.status(404).json({message:"UE non trouvée"});res.json({message:"UE mise à jour",ue:u});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const deleteUE = async (req,res) => { try{const u=await AcademicModel.deleteUE(parseInt(req.params.id));if(!u)return res.status(404).json({message:"UE non trouvée"});res.json({message:"UE supprimée"});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };

// ─── Subjects ───────────────────────────────────────────
export const getSubjects = async (req,res) => { try{res.json({subjects:await AcademicModel.getAllSubjects(req.query.ue_id?parseInt(req.query.ue_id):null)});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const getSubject = async (req,res) => { try{const s=await AcademicModel.getSubjectById(parseInt(req.params.id));if(!s)return res.status(404).json({message:"Matière non trouvée"});res.json({subject:s});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const createSubject = async (req,res) => { try{const s=await AcademicModel.createSubject(req.body);res.status(201).json({message:"Matière créée",subject:s});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const updateSubject = async (req,res) => { try{const s=await AcademicModel.updateSubject(parseInt(req.params.id),req.body);if(!s)return res.status(404).json({message:"Matière non trouvée"});res.json({message:"Matière mise à jour",subject:s});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
export const deleteSubject = async (req,res) => { try{const s=await AcademicModel.deleteSubject(parseInt(req.params.id));if(!s)return res.status(404).json({message:"Matière non trouvée"});res.json({message:"Matière supprimée"});}catch(e){console.error(e);res.status(500).json({message:"Erreur serveur"});} };
