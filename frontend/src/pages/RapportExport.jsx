import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { exportExcel, exportTeacherPDF, getTeachers, exportGlobalPDF } from '../api/auth';
import './RapportExport.css';

export default function RapportExport() {
  const [teachers, setTeachers]     = useState([]);
  const [selectedT, setSelectedT]   = useState('');
  const [loadingT, setLoadingT]     = useState(false);
  const [exportingXls, setXls]      = useState(false);
  const [exportingPdf, setPdf]      = useState(false);
  const [exportingGlobal, setGlobal] = useState(false);
  const [loaded, setLoaded]         = useState(false);

  async function loadTeachers() {
    if (loaded) return;
    try {
      setLoadingT(true);
      const res = await getTeachers();
      setTeachers(res.data.teachers || []);
      setLoaded(true);
    } catch { toast.error('Impossible de charger les enseignants'); }
    finally { setLoadingT(false); }
  }

  async function handleExcelAll() {
    try {
      setXls(true);
      const res = await exportExcel();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = `rapport_heures_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
      toast.success('Rapport Excel téléchargé');
    } catch { toast.error('Erreur lors de l\'export Excel'); }
    finally { setXls(false); }
  }

  async function handlePdfGlobal() {
    try {
      setGlobal(true);
      const res = await exportGlobalPDF();
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url;
      a.download = `etat_global_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click(); URL.revokeObjectURL(url);
      toast.success('État global PDF téléchargé');
    } catch { toast.error('Erreur lors de l\'export PDF global'); }
    finally { setGlobal(false); }
  }

  async function handlePdf() {
    if (!selectedT) { toast.error('Veuillez sélectionner un enseignant'); return; }
    try {
      setPdf(true);
      const res = await exportTeacherPDF(selectedT);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank'); URL.revokeObjectURL(url);
      toast.success('PDF ouvert');
    } catch { toast.error('Erreur lors de l\'export PDF'); }
    finally { setPdf(false); }
  }

  return (
    <Layout title="Rapports & Exports" subtitle="Générez et téléchargez les rapports d'enseignement">
      <div className="rapport-grid">
        {/* Export global Excel */}
        <div className="card rapport-card">
          <div className="rapport-card-icon" style={{ background:'rgba(21,101,192,0.12)', color:'#1565c0' }}>
            <span className="material-symbols-outlined">table_view</span>
          </div>
          <h3 className="rapport-card-title">État pour la comptabilité (Excel)</h3>
          <p className="rapport-card-desc">
            Exporte toutes les données d'heures complémentaires, montants dus et récapitulatifs par enseignant au format Excel.
          </p>
          <div className="rapport-card-footer">
            <span className="badge badge-primary">Format .xlsx</span>
            <button className="btn btn-primary" onClick={handleExcelAll} disabled={exportingXls}>
              {exportingXls
                ? <><span className="material-symbols-outlined spin" style={{fontSize:16}}>refresh</span>Export…</>
                : <><span className="material-symbols-outlined" style={{fontSize:16}}>download</span>Télécharger</>
              }
            </button>
          </div>
        </div>

        {/* Export global PDF */}
        <div className="card rapport-card">
          <div className="rapport-card-icon" style={{ background:'rgba(239,68,68,0.12)', color:'#ef4444' }}>
            <span className="material-symbols-outlined">description</span>
          </div>
          <h3 className="rapport-card-title">État global des heures (PDF)</h3>
          <p className="rapport-card-desc">
            Génère un récapitulatif PDF de l'ensemble des enseignants, leurs heures normales/complémentaires et les montants à payer.
          </p>
          <div className="rapport-card-footer">
            <span className="badge badge-danger">Format PDF</span>
            <button className="btn btn-primary" onClick={handlePdfGlobal} disabled={exportingGlobal}>
              {exportingGlobal
                ? <><span className="material-symbols-outlined spin" style={{fontSize:16}}>refresh</span>Génération…</>
                : <><span className="material-symbols-outlined" style={{fontSize:16}}>download</span>Télécharger</>
              }
            </button>
          </div>
        </div>

        {/* Export PDF individuel */}
        <div className="card rapport-card">
          <div className="rapport-card-icon" style={{ background:'rgba(2,132,199,0.12)', color:'#0277bd' }}>
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </div>
          <h3 className="rapport-card-title">Fiche enseignant individuelle</h3>
          <p className="rapport-card-desc">
            Génère une fiche individuelle récapitulant les heures effectuées, le bilan ETD et le montant calculé pour un enseignant spécifique.
          </p>
          <div className="form-field" style={{ marginBottom:14 }}>
            <label className="form-label">Sélectionner un enseignant</label>
            <select
              className="form-select"
              value={selectedT}
              onFocus={loadTeachers}
              onChange={e => setSelectedT(e.target.value)}
            >
              <option value="">— Cliquer pour charger —</option>
              {loadingT && <option disabled>Chargement…</option>}
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
              ))}
            </select>
          </div>
          <div className="rapport-card-footer">
            <span className="badge badge-info">Format PDF</span>
            <button className="btn btn-primary" onClick={handlePdf} disabled={exportingPdf || !selectedT}>
              {exportingPdf
                ? <><span className="material-symbols-outlined spin" style={{fontSize:16}}>refresh</span>Génération…</>
                : <><span className="material-symbols-outlined" style={{fontSize:16}}>open_in_new</span>Générer</>
              }
            </button>
          </div>
        </div>

        {/* Info card */}
        <div className="card rapport-card rapport-info-card">
          <div className="rapport-card-icon" style={{ background:'rgba(21,101,192,0.1)', color:'#0d47a1' }}>
            <span className="material-symbols-outlined">info</span>
          </div>
          <h3 className="rapport-card-title">À propos des rapports</h3>
          <ul className="rapport-info-list">
            <li><span className="material-symbols-outlined" style={{fontSize:14,color:'var(--primary)'}}>check_circle</span>Basés sur l'année académique active</li>
            <li><span className="material-symbols-outlined" style={{fontSize:14,color:'var(--info)'}}>calculate</span>Calculés selon les taux de grade/statut</li>
            <li><span className="material-symbols-outlined" style={{fontSize:14,color:'var(--primary-hover)'}}>warning</span>Incluent uniquement les heures validées</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
