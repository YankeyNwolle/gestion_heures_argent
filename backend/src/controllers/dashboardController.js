import pool from "../config/database.js";
import { getCurrentAcademicYear } from "../models/settingsModel.js";
import { getTeacherByUserId } from "../models/teacherModel.js";
import * as HourModel from "../models/hourModel.js";

export const getStats = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    const stats = {
      totalEtd: 0,
      complementaryHours: 0,
      amountDue: 0,
      teachersOverLimit: 0,
      teacherCount: 0,
      academicYear: currentYear ? currentYear.label : 'Aucune active'
    };

    if (!currentYear) return res.json(stats);

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

    stats.totalEtd = rows.reduce((s,r)=>s+parseFloat(r.total_etd||0),0);
    stats.complementaryHours = rows.reduce((s,r)=>s+parseFloat(r.complementary_etd||0),0);
    stats.amountDue = rows.reduce((s,r)=>s+parseFloat(r.amount_due||0),0);
    stats.potentialAmount = rows.reduce((s,r)=>s+parseFloat(r.potential_amount||0),0);
    stats.teachersOverLimit = rows.filter(r=>parseFloat(r.complementary_etd||0)>0).length;

    // Récupérer le nombre de contestations en attente
    const contestRes = await pool.query(`SELECT COUNT(*) as c FROM hour_entries WHERE status='contested' AND academic_year_id=$1`, [currentYear.id]);
    stats.contestedCount = parseInt(contestRes.rows[0].c);

    const teacherCountResult = await pool.query(`SELECT COUNT(*) as c FROM teachers t JOIN users u ON u.id=t.user_id WHERE u.is_active=TRUE`);
    stats.teacherCount = parseInt(teacherCountResult.rows[0].c);

    res.json(stats);
  } catch(e) { 
    console.error("Dashboard Stats Error:", e); 
    res.status(500).json({message:"Erreur lors de la récupération des statistiques"}); 
  }
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
    const result = await pool.query(`SELECT * FROM v_accounting WHERE academic_year=$1 ORDER BY last_name`,[currentYear.label]);
    res.json({teachers: result.rows, academicYear: currentYear.label});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getDepartmentStats = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.json({data:[]});
    const result = await pool.query(
      `SELECT d.name, SUM(h.etd_hours) as total_etd
       FROM hour_entries h
       JOIN teachers t ON t.id = h.teacher_id
       JOIN departments d ON d.id = t.department_id
       WHERE h.academic_year_id = $1
       GROUP BY d.name
       ORDER BY total_etd DESC`,
      [currentYear.id]
    );
    res.json({data: result.rows});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getProgramStats = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.json({data:[]});
    const result = await pool.query(
      `SELECT p.name, p.level, SUM(h.etd_hours) as total_etd
       FROM hour_entries h
       JOIN subjects s ON s.id = h.subject_id
       JOIN ues p ON p.id = s.ue_id
       WHERE h.academic_year_id = $1
       GROUP BY p.name, p.level
       ORDER BY total_etd DESC`,
      [currentYear.id]
    );
    res.json({data: result.rows});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
