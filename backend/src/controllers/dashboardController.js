import pool from "../config/database.js";
import { getCurrentAcademicYear } from "../models/settingsModel.js";
import { getTeacherByUserId } from "../models/teacherModel.js";
import * as HourModel from "../models/hourModel.js";

export const getStats = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.json({totalEtd:0,complementaryHours:0,amountDue:0,teachersOverLimit:0,teacherCount:0});

    // Stats globales ou individuelles selon le rôle
    let teacherId = null;
    if (req.user.role === 'enseignant') {
      const teacher = await getTeacherByUserId(req.user.id);
      teacherId = teacher?.id;
    }

    let statsQuery;
    const params = [];
    if (teacherId) {
      statsQuery = `SELECT * FROM v_accounting WHERE teacher_id=$1 AND academic_year=$2`;
      params.push(teacherId, currentYear.label);
    } else {
      statsQuery = `SELECT * FROM v_accounting WHERE academic_year=$1`;
      params.push(currentYear.label);
    }

    const result = await pool.query(statsQuery, params);
    const rows = result.rows;

    const totalEtd = rows.reduce((s,r)=>s+parseFloat(r.total_etd||0),0);
    const complementaryHours = rows.reduce((s,r)=>s+parseFloat(r.complementary_etd||0),0);
    const amountDue = rows.reduce((s,r)=>s+parseFloat(r.amount_due||0),0);
    const teachersOverLimit = rows.filter(r=>parseFloat(r.complementary_etd||0)>0).length;

    const teacherCountResult = await pool.query(`SELECT COUNT(*) as c FROM teachers t JOIN users u ON u.id=t.user_id WHERE u.is_active=TRUE`);

    res.json({
      totalEtd: Math.round(totalEtd*100)/100,
      complementaryHours: Math.round(complementaryHours*100)/100,
      amountDue: Math.round(amountDue),
      teachersOverLimit,
      teacherCount: parseInt(teacherCountResult.rows[0].c),
      academicYear: currentYear.label
    });
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getMonthlyChart = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.json({data:[]});
    const data = await HourModel.getMonthlyStats(currentYear.id);
    res.json({data, academicYear: currentYear.label});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getDistributionChart = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    let teacherId = null;
    if (req.user.role === 'enseignant') {
      const teacher = await getTeacherByUserId(req.user.id);
      teacherId = teacher?.id;
    }
    const data = await HourModel.getDistribution(teacherId, currentYear?.id);
    res.json({data});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getTeacherSummary = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.json({teachers:[]});
    const result = await pool.query(`SELECT * FROM v_teacher_balance WHERE academic_year=$1 ORDER BY last_name`,[currentYear.label]);
    res.json({teachers: result.rows, academicYear: currentYear.label});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
