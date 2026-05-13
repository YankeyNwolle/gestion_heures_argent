import * as SettingsModel from "../models/settingsModel.js";
import pool from "../config/database.js";

export const getEquivalences = async (req, res) => {
  try { res.json({rates: await SettingsModel.getEquivalenceRates()}); }
  catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const updateEquivalence = async (req, res) => {
  try {
    const {type, coefficient} = req.body;
    if (!type||coefficient===undefined) return res.status(400).json({message:"Type et coefficient requis"});
    const rate = await SettingsModel.updateEquivalenceRate(type, parseFloat(coefficient));
    if (!rate) return res.status(404).json({message:"Type non trouvé"});

    // Audit Log
    pool.query(`INSERT INTO audit_logs(user_id,action,table_name,record_id,details)VALUES($1,'PUT','/api/settings/equivalences',$2,$3)`,
      [req.user.id, rate.id, JSON.stringify({type, old: rate.coefficient, new: parseFloat(coefficient)})]
    ).catch(()=>{});

    res.json({message:"Coefficient mis à jour",rate});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getHourlyRates = async (req, res) => {
  try { res.json({rates: await SettingsModel.getHourlyRates()}); }
  catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const updateHourlyRate = async (req, res) => {
  try {
    const {grade, status, rate} = req.body;
    if (!grade||!status||rate===undefined) return res.status(400).json({message:"Grade, statut et taux requis"});
    const updated = await SettingsModel.updateHourlyRate(grade, status, parseFloat(rate));
    if (!updated) return res.status(404).json({message:"Combinaison grade/statut non trouvée"});

    // Audit Log
    pool.query(`INSERT INTO audit_logs(user_id,action,table_name,record_id,details)VALUES($1,'PUT','/api/settings/rates',$2,$3)`,
      [req.user.id, updated.id, JSON.stringify({grade, status, rate: parseFloat(rate)})]
    ).catch(()=>{});

    res.json({message:"Taux mis à jour",rate: updated});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getAcademicYears = async (req, res) => {
  try { res.json({years: await SettingsModel.getAcademicYears()}); }
  catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getCurrentYear = async (req, res) => {
  try {
    const year = await SettingsModel.getCurrentAcademicYear();
    if (!year) return res.status(404).json({message:"Aucune année académique active"});
    res.json({year});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const createAcademicYear = async (req, res) => {
  try {
    const year = await SettingsModel.createAcademicYear(req.body);
    res.status(201).json({message:"Année créée",year});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur",detail:e.message}); }
};

export const activateYear = async (req, res) => {
  try {
    const year = await SettingsModel.setCurrentYear(parseInt(req.params.id));
    if (!year) return res.status(404).json({message:"Année non trouvée"});
    res.json({message:"Année activée",year});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const closeYear = async (req, res) => {
  try {
    const year = await SettingsModel.closeAcademicYear(parseInt(req.params.id));
    if (!year) return res.status(404).json({message:"Année non trouvée"});
    res.json({message:"Année clôturée",year});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
