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
    const entry = await HourModel.validateEntry(parseInt(req.params.id), req.user.id);
    if (!entry) return res.status(404).json({message:"Saisie non trouvée"});
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
    const entry = await HourModel.contestEntry(parseInt(req.params.id), reason);
    if (!entry) return res.status(404).json({message:"Saisie non trouvée"});
    res.json({message:"Heure contestée",entry});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
