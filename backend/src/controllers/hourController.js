import * as HourModel from "../models/hourModel.js";
import { getEquivalenceRateByType } from "../models/settingsModel.js";
import { getTeacherByUserId } from "../models/teacherModel.js";
import { getCurrentAcademicYear } from "../models/settingsModel.js";
import pool from "../config/database.js";

/**
 * Créer une saisie d'heures avec calcul ETD automatique.
 * Le coefficient est récupéré depuis la table equivalence_rates en BDD (pas en dur).
 */
export const createHour = async (req, res) => {
  try {
    const { teacher_id, subject_id, date, type, hours, room, notes, academic_year_id } = req.body;
    if (!type || !hours || !date) return res.status(400).json({message:"Type, heures et date sont requis"});
    if (!['CM','TD','TP'].includes(type)) return res.status(400).json({message:"Type invalide (CM, TD, TP)"});
    if (parseFloat(hours) <= 0) return res.status(400).json({message:"Les heures doivent être > 0"});

    // Déterminer le teacher_id si non fourni (enseignant connecté)
    let tid = teacher_id;
    if (!tid) {
      const teacher = await getTeacherByUserId(req.user.id);
      if (!teacher) return res.status(400).json({message:"Profil enseignant non trouvé"});
      tid = teacher.id;
    }

    // Année académique en cours si non spécifiée
    let yearId = academic_year_id;
    if (!yearId) {
      const currentYear = await getCurrentAcademicYear();
      yearId = currentYear?.id || null;
    }

    // Calcul ETD depuis la BDD
    const coefficient = await getEquivalenceRateByType(type);
    if (!coefficient) return res.status(500).json({message:`Coefficient ETD non trouvé pour le type ${type}`});
    const etd_hours = parseFloat(hours) * parseFloat(coefficient);

    const entry = await HourModel.createHourEntry({
      teacher_id: tid, subject_id, academic_year_id: yearId,
      date, type, hours: parseFloat(hours), etd_hours,
      room, notes, created_by: req.user.id
    });

    // Audit log
    pool.query(`INSERT INTO audit_logs(user_id,action,table_name,record_id,details)VALUES($1,'POST','/api/hours',$2,$3)`,
      [req.user.id, entry.id, JSON.stringify({tid, type, hours, etd_hours})]
    ).catch(()=>{});

    res.status(201).json({message:"Heures enregistrées",entry,calculation:{hours:parseFloat(hours),coefficient:parseFloat(coefficient),etd_hours}});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur",detail:e.message}); }
};

export const getHours = async (req, res) => {
  try {
    const {page=1,limit=20,teacher_id,type,status,academic_year_id,date_from,date_to} = req.query;
    // Si enseignant, ne montrer que ses propres heures
    let tid = teacher_id ? parseInt(teacher_id) : null;
    if (req.user.role === 'enseignant') {
      const teacher = await getTeacherByUserId(req.user.id);
      tid = teacher?.id || 0;
    }
    const result = await HourModel.getHourEntries({page:parseInt(page),limit:parseInt(limit),teacher_id:tid,type,status,academic_year_id:academic_year_id?parseInt(academic_year_id):null,date_from,date_to});
    res.json(result);
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getHour = async (req, res) => {
  try {
    const entry = await HourModel.getHourEntryById(parseInt(req.params.id));
    if (!entry) return res.status(404).json({message:"Saisie non trouvée"});
    res.json({entry});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const updateHour = async (req, res) => {
  try {
    const { type, hours } = req.body;
    let etd_hours;
    if (type && hours) {
      const coefficient = await getEquivalenceRateByType(type);
      etd_hours = parseFloat(hours) * parseFloat(coefficient);
    }
    const entry = await HourModel.updateHourEntry(parseInt(req.params.id), {...req.body, etd_hours});
    if (!entry) return res.status(404).json({message:"Saisie non trouvée"});
    res.json({message:"Saisie mise à jour",entry});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const deleteHour = async (req, res) => {
  try {
    const entry = await HourModel.deleteHourEntry(parseInt(req.params.id));
    if (!entry) return res.status(404).json({message:"Saisie non trouvée"});
    
    // Audit log
    pool.query(`INSERT INTO audit_logs(user_id,action,table_name,record_id,details)VALUES($1,'DELETE','/api/hours',$2,$3)`,
      [req.user.id, parseInt(req.params.id), JSON.stringify({action:"delete_hour", entry})]
    ).catch(()=>{});

    res.json({message:"Saisie supprimée"});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getRecentHours = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 10);
    
    // Si Admin ou RH, on montre ses propres saisies (qu'il a créées pour les autres)
    if (req.user.role === 'admin' || req.user.role === 'rh') {
      const entries = await HourModel.getRecentEntriesByCreator(req.user.id, limit);
      return res.json({ entries, hours: entries });
    }

    // Si Enseignant, on montre ses propres heures
    const teacher = await getTeacherByUserId(req.user.id);
    if (!teacher) return res.json({ entries: [], hours: [] });
    
    const entries = await HourModel.getRecentEntries(teacher.id, limit);
    res.json({ entries, hours: entries });
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
