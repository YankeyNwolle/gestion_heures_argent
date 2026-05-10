import * as HourModel from "../models/hourModel.js";
import { getCurrentAcademicYear } from "../models/settingsModel.js";
import { getTeacherByUserId } from "../models/teacherModel.js";

export const getPendingHours = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    let entries;
    if (req.user.role === "admin" || req.user.role === "rh") {
      entries = await HourModel.getPendingEntries(currentYear?.id);
    } else {
      const teacher = await getTeacherByUserId(req.user.id);
      entries = teacher
        ? await HourModel.getTeacherValidationEntries(teacher.id, currentYear?.id)
        : [];
    }
    res.json({ entries, hours: entries, count: entries.length });
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const validateHour = async (req, res) => {
  try {
    const entryId = parseInt(req.params.id);
    const existingEntry = await HourModel.getHourEntryById(entryId);
    if (!existingEntry) return res.status(404).json({message:"Saisie non trouvée"});

    // Si enseignant, vérifier que c'est le sien
    if (req.user.role === 'enseignant') {
      const teacher = await getTeacherByUserId(req.user.id);
      if (!teacher || existingEntry.teacher_id !== teacher.id) {
        return res.status(403).json({message:"Action non autorisée sur cette séance"});
      }
    }

    const entry = await HourModel.validateEntry(entryId, req.user.id);
    res.json({message:"Heure validée",entry});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const validateAll = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    const count = await HourModel.validateAllPending(req.user.id, currentYear?.id);
    res.json({message:`${count} heure(s) validée(s)`,count});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const contestHour = async (req, res) => {
  try {
    const {reason} = req.body;
    if (!reason) return res.status(400).json({message:"Motif de contestation requis"});
    
    const entryId = parseInt(req.params.id);
    const existingEntry = await HourModel.getHourEntryById(entryId);
    if (!existingEntry) return res.status(404).json({message:"Saisie non trouvée"});

    // Si enseignant, vérifier que c'est le sien
    if (req.user.role === 'enseignant') {
      const teacher = await getTeacherByUserId(req.user.id);
      if (!teacher || existingEntry.teacher_id !== teacher.id) {
        return res.status(403).json({message:"Action non autorisée sur cette séance"});
      }
    }

    const entry = await HourModel.contestEntry(entryId, reason);
    res.json({message:"Heure contestée",entry});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
