import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import pool from "../config/database.js";
import { getCurrentAcademicYear } from "../models/settingsModel.js";
import { getTeacherById, getTeacherAccounting, getTeacherByUserId } from "../models/teacherModel.js";

/**
 * Générer une fiche PDF individuelle pour un enseignant.
 */
export const exportTeacherPDF = async (req, res) => {
  try {
    const teacherId = parseInt(req.params.teacherId);

    // Sécurité : si c'est un enseignant, il ne peut exporter que SON profil
    if (req.user.role === 'enseignant') {
      const ownProfile = await getTeacherByUserId(req.user.id);
      if (!ownProfile || ownProfile.id !== teacherId) {
        return res.status(403).json({message: "Vous n'êtes pas autorisé à exporter ce récapitulatif"});
      }
    }

    const teacher = await getTeacherById(teacherId);
    if (!teacher) return res.status(404).json({message:"Enseignant non trouvé"});

    const currentYear = await getCurrentAcademicYear();
    const accounting = await getTeacherAccounting(teacherId, currentYear?.label);
    const acc = accounting[0] || {};

    // Récupérer les heures détaillées
    const hoursResult = await pool.query(
      `SELECT h.*, s.name as subject_name FROM hour_entries h
       LEFT JOIN subjects s ON s.id=h.subject_id
       WHERE h.teacher_id=$1 AND h.academic_year_id=$2 ORDER BY h.date`,
      [teacherId, currentYear?.id]
    );

    const doc = new PDFDocument({margin:50,size:'A4'});
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`attachment; filename=fiche_${teacher.last_name}_${teacher.first_name}.pdf`);
    doc.pipe(res);

    // En-tête
    doc.fontSize(18).font('Helvetica-Bold').text('FICHE INDIVIDUELLE D\'ENSEIGNEMENT',{align:'center'});
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Année Académique : ${currentYear?.label || 'N/A'}`,{align:'center'});
    doc.moveDown();

    // Ligne de séparation
    doc.moveTo(50,doc.y).lineTo(545,doc.y).stroke();
    doc.moveDown();

    // Infos enseignant
    doc.fontSize(11).font('Helvetica-Bold').text('INFORMATIONS PERSONNELLES');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Nom complet : ${teacher.first_name} ${teacher.last_name}`);
    doc.text(`Email : ${teacher.email}`);
    doc.text(`Grade : ${(teacher.grade||'').replace('_',' ').toUpperCase()}`);
    doc.text(`Statut : ${(teacher.status||'').toUpperCase()}`);
    doc.text(`Département : ${teacher.department_name || 'Non assigné'}`);
    doc.text(`Service contractuel : ${teacher.contractual_hours} h ETD`);
    doc.moveDown();

    // Bilan
    doc.font('Helvetica-Bold').fontSize(11).text('BILAN DES HEURES');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Heures CM brutes : ${acc.cm_raw || 0} h`);
    doc.text(`Heures TD brutes : ${acc.td_raw || 0} h`);
    doc.text(`Heures TP brutes : ${acc.tp_raw || 0} h`);
    doc.text(`Total ETD : ${acc.total_etd || 0} h`);
    doc.text(`Service normal : ${acc.normal_etd || 0} h ETD`);
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold');
    doc.text(`Heures complémentaires : ${acc.complementary_etd || 0} h ETD`);
    doc.text(`Taux horaire : ${acc.hourly_rate || 0} FCFA/h`);
    doc.fontSize(12).text(`MONTANT DÛ : ${parseInt(acc.amount_due || 0).toLocaleString('fr-FR')} FCFA`);
    doc.moveDown();

    // Tableau des heures
    if (hoursResult.rows.length > 0) {
      doc.font('Helvetica-Bold').fontSize(11).text('DÉTAIL DES SÉANCES');
      doc.moveDown(0.3);

      const tableTop = doc.y;
      const colWidths = [70,170,40,50,55,60];
      const headers = ['Date','Matière','Type','Heures','ETD','Statut'];

      // Headers
      doc.font('Helvetica-Bold').fontSize(8);
      let xPos = 50;
      headers.forEach((h,i) => { doc.text(h, xPos, tableTop, {width:colWidths[i]}); xPos+=colWidths[i]; });
      doc.moveDown(0.5);

      // Rows
      doc.font('Helvetica').fontSize(8);
      hoursResult.rows.forEach(row => {
        if (doc.y > 750) { doc.addPage(); }
        const y = doc.y;
        xPos = 50;
        const dateStr = new Date(row.date).toLocaleDateString('fr-FR');
        doc.text(dateStr,xPos,y,{width:colWidths[0]}); xPos+=colWidths[0];
        doc.text(row.subject_name||'-',xPos,y,{width:colWidths[1]}); xPos+=colWidths[1];
        doc.text(row.type,xPos,y,{width:colWidths[2]}); xPos+=colWidths[2];
        doc.text(String(row.hours),xPos,y,{width:colWidths[3]}); xPos+=colWidths[3];
        doc.text(String(row.etd_hours),xPos,y,{width:colWidths[4]}); xPos+=colWidths[4];
        doc.text(row.status||'pending',xPos,y,{width:colWidths[5]});
        doc.moveDown(0.3);
      });
    }

    // Pied de page
    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica').text(
      `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      {align:'center'}
    );

    doc.end();
  } catch(e) { console.error(e); if(!res.headersSent) res.status(500).json({message:"Erreur de génération PDF",detail:e.message}); }
};

/**
 * Exporter l'état comptable global en Excel.
 */
export const exportAccountingExcel = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    const result = await pool.query(`SELECT * FROM v_accounting WHERE academic_year=$1 ORDER BY last_name`,[currentYear?.label]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GestionHeures';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('État Comptable');

    // Titre
    ws.mergeCells('A1:I1');
    const titleCell = ws.getCell('A1');
    titleCell.value = `ÉTAT COMPTABLE — ${currentYear?.label || 'N/A'}`;
    titleCell.font = {bold:true, size:14};
    titleCell.alignment = {horizontal:'center'};

    ws.mergeCells('A2:I2');
    ws.getCell('A2').value = `Généré le ${new Date().toLocaleDateString('fr-FR')}`;
    ws.getCell('A2').alignment = {horizontal:'center'};

    // En-têtes
    const headerRow = ws.addRow([]);
    ws.addRow(['Nom','Prénom','Grade','Rang','Statut','Département','CM (h)','TD (h)','TP (h)','Total ETD','Service','Complémentaires','Taux (FCFA)','Montant Dû (FCFA)']);
    const hr = ws.getRow(4);
    hr.font = {bold:true, color:{argb:'FFFFFFFF'}};
    hr.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF1E3A5F'}};
    hr.alignment = {horizontal:'center'};

    // Colonnes
    ws.columns = [
      {key:'last_name',width:15},{key:'first_name',width:15},{key:'grade',width:18},{key:'rank',width:8},
      {key:'status',width:12},{key:'dept',width:20},{key:'cm',width:10},
      {key:'td',width:10},{key:'tp',width:10},{key:'total_etd',width:12},
      {key:'normal',width:12},{key:'comp',width:15},{key:'rate',width:12},{key:'amount',width:15}
    ];

    let totalAmount = 0;
    result.rows.forEach((r,i) => {
      const row = ws.addRow([
        r.last_name, r.first_name,
        (r.grade||'').replace('_',' '), r.rank || '-', r.status,
        r.department_name||'-',
        parseFloat(r.cm_raw||0), parseFloat(r.td_raw||0), parseFloat(r.tp_raw||0),
        parseFloat(r.total_etd||0), parseFloat(r.normal_etd||0),
        parseFloat(r.complementary_etd||0), parseFloat(r.hourly_rate||0),
        parseInt(r.amount_due||0)
      ]);
      // Zebra striping
      if (i%2===1) row.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FFF0F4F8'}};
      totalAmount += parseInt(r.amount_due||0);
    });

    // Total
    const totalRow = ws.addRow(['','','','','TOTAL','','','','','','','', totalAmount]);
    totalRow.font = {bold:true};
    totalRow.getCell(13).numFmt = '#,##0';

    // Format monétaire
    ws.getColumn(13).numFmt = '#,##0';

    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',`attachment; filename=etat_comptable_${currentYear?.label||'export'}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch(e) { console.error(e); if(!res.headersSent) res.status(500).json({message:"Erreur export Excel",detail:e.message}); }
};

/**
 * État de paiement simplifié (JSON pour la page frontend).
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.json({payments:[], total:0});
    const result = await pool.query(`SELECT * FROM v_accounting WHERE academic_year=$1 ORDER BY last_name`,[currentYear.label]);
    const payments = result.rows.map(r => ({
      teacher_id: r.teacher_id, first_name: r.first_name, last_name: r.last_name,
      grade: r.grade, status: r.status, department: r.department_name,
      total_etd: parseFloat(r.total_etd||0), contractual_hours: parseFloat(r.contractual_hours||0),
      complementary_etd: parseFloat(r.complementary_etd||0),
      hourly_rate: parseFloat(r.hourly_rate||0), amount_due: parseInt(r.amount_due||0)
    }));
    const total = payments.reduce((s,p)=>s+p.amount_due,0);
    res.json({payments, total, academicYear: currentYear.label});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

/**
 * Générer un état global des heures en PDF.
 */
export const exportGlobalPDF = async (req, res) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    if (!currentYear) return res.status(404).json({message:"Année académique non trouvée"});

    const result = await pool.query(`SELECT * FROM v_accounting WHERE academic_year=$1 ORDER BY last_name`,[currentYear.label]);
    const teachers = result.rows;

    const doc = new PDFDocument({margin:40, size:'A4', layout:'landscape'});
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`attachment; filename=etat_global_${currentYear.label}.pdf`);
    doc.pipe(res);

    // En-tête
    doc.fontSize(16).font('Helvetica-Bold').text('ÉTAT GLOBAL DES HEURES ET PAIEMENTS', {align:'center'});
    doc.fontSize(11).font('Helvetica').text(`Année Académique : ${currentYear.label}`, {align:'center'});
    doc.moveDown();

    // Tableau
    const tableTop = doc.y;
    const colWidths = [120, 80, 60, 60, 60, 80, 80, 100];
    const headers = ['Enseignant', 'Grade', 'CM', 'TD', 'TP', 'ETD Total', 'Compl.', 'Montant Dû'];

    doc.font('Helvetica-Bold').fontSize(9);
    let x = 40;
    headers.forEach((h, i) => {
      doc.text(h, x, tableTop, {width: colWidths[i]});
      x += colWidths[i];
    });

    doc.moveTo(40, doc.y + 12).lineTo(750, doc.y + 12).stroke();
    doc.moveDown(0.8);

    doc.font('Helvetica').fontSize(8);
    let currentY = doc.y;
    let totalAmount = 0;

    teachers.forEach(t => {
      if (currentY > 500) {
        doc.addPage();
        currentY = 40;
      }
      x = 40;
      doc.text(`${t.last_name} ${t.first_name}`, x, currentY, {width: colWidths[0]}); x += colWidths[0];
      doc.text((t.grade||'').replace('_',' '), x, currentY, {width: colWidths[1]}); x += colWidths[1];
      doc.text(String(t.cm_raw||0), x, currentY, {width: colWidths[2]}); x += colWidths[2];
      doc.text(String(t.td_raw||0), x, currentY, {width: colWidths[3]}); x += colWidths[3];
      doc.text(String(t.tp_raw||0), x, currentY, {width: colWidths[4]}); x += colWidths[4];
      doc.text(`${t.total_etd||0} h`, x, currentY, {width: colWidths[5]}); x += colWidths[5];
      doc.text(`${t.complementary_etd||0} h`, x, currentY, {width: colWidths[6]}); x += colWidths[6];
      doc.text(`${parseInt(t.amount_due||0).toLocaleString('fr-FR')} FCFA`, x, currentY, {width: colWidths[7], align:'right'});
      
      totalAmount += parseInt(t.amount_due||0);
      currentY += 15;
    });

    doc.moveTo(40, currentY).lineTo(750, currentY).stroke();
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text(`TOTAL GÉNÉRAL : ${totalAmount.toLocaleString('fr-FR')} FCFA`, 550, currentY + 5, {align:'right'});

    doc.end();
  } catch(e) { console.error(e); if(!res.headersSent) res.status(500).json({message:"Erreur export PDF global"}); }
};
