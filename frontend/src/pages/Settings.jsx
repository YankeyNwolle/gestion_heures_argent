import { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { 
  getAcademicYears, 
  activateYear, 
  createAcademicYear,
  getHourlyRates,
  updateHourlyRate,
  getEquivalences,
  updateEquivalence
} from '../api/auth';
import "./Settings.css";

/* ── Icon helper ───────────────────────────────────────── */
function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Settings() {
  const [years, setYears]       = useState([]);
  const [hrRates, setHrRates]   = useState([]);
  const [eqRates, setEqRates]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  // Form for new academic year
  const [newYear, setNewYear]   = useState({ label:'', start_date:'', end_date:'' });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [yRes, hRes, eRes] = await Promise.all([
        getAcademicYears(),
        getHourlyRates(),
        getEquivalences()
      ]);
      setYears(yRes.data.years || []);
      setHrRates(hRes.data.rates || []);
      setEqRates(eRes.data.rates || []);
    } catch (e) { toast.error('Erreur de chargement des paramètres'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleActivateYear(id) {
    try {
      await activateYear(id);
      toast.success('Année académique activée');
      loadData();
    } catch (e) { toast.error('Erreur lors de l\'activation'); }
  }

  async function handleCreateYear(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await createAcademicYear(newYear);
      toast.success('Année créée avec succès');
      setNewYear({ label:'', start_date:'', end_date:'' });
      loadData();
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur de création'); }
    finally { setSaving(false); }
  }

  async function handleUpdateHrRate(grade, status, rate) {
    try {
      await updateHourlyRate({ grade, status, rate: parseFloat(rate) });
      toast.success('Taux horaire mis à jour');
      loadData();
    } catch (e) { toast.error('Erreur de mise à jour'); }
  }

  async function handleUpdateEqRate(type, coefficient) {
    try {
      await updateEquivalence({ type, coefficient: parseFloat(coefficient) });
      toast.success('Coefficient d\'équivalence mis à jour');
      loadData();
    } catch (e) { toast.error('Erreur de mise à jour'); }
  }

  return (
    <Layout title="Paramètres Système" subtitle="Configurez les règles de gestion et l'année académique active">
      <div className="settings-container">
        
        {/* ── Année Académique ── */}
        <section className="settings-section animate-in">
          <div className="settings-section__header">
            <Icon name="calendar_month" className="section-icon" />
            <div>
              <h2 className="section-title">Année Académique</h2>
              <p className="section-desc">Définissez l'année active pour les saisies et les calculs.</p>
            </div>
          </div>

          <div className="settings-grid">
            {/* List and activate */}
            <div className="card">
              <h3 className="card-title">Années configurées</h3>
              <div className="years-list">
                {years.map(y => (
                  <div key={y.id} className={`year-item ${y.is_current ? 'active' : ''}`}>
                    <div className="year-info">
                      <span className="year-label">{y.label}</span>
                      <span className="year-dates">Du {new Date(y.start_date).toLocaleDateString()} au {new Date(y.end_date).toLocaleDateString()}</span>
                    </div>
                    {y.is_current ? (
                      <span className="badge badge-success">Actuelle</span>
                    ) : (
                      <button className="btn btn-outline btn-sm" onClick={() => handleActivateYear(y.id)}>Activer</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Create new */}
            <div className="card">
              <h3 className="card-title">Ajouter une année</h3>
              <form onSubmit={handleCreateYear} className="settings-form">
                <div className="form-field">
                  <label>Libellé (ex: 2025-2026)</label>
                  <input type="text" value={newYear.label} onChange={e=>setNewYear(p=>({...p, label:e.target.value}))} required />
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Début</label>
                    <input type="date" value={newYear.start_date} onChange={e=>setNewYear(p=>({...p, start_date:e.target.value}))} required />
                  </div>
                  <div className="form-field">
                    <label>Fin</label>
                    <input type="date" value={newYear.end_date} onChange={e=>setNewYear(p=>({...p, end_date:e.target.value}))} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? 'Création...' : 'Enregistrer l\'année'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── Taux Horaires ── */}
        <section className="settings-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="settings-section__header">
            <Icon name="payments" className="section-icon" />
            <div>
              <h2 className="section-title">Taux Horaires</h2>
              <p className="section-desc">Définissez le montant payé par heure (FCFA) selon le grade et le statut.</p>
            </div>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Statut</th>
                    <th style={{ textAlign: 'right' }}>Taux (FCFA / h ETD)</th>
                    <th style={{ width: 120 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hrRates.map(r => (
                    <tr key={`${r.grade}-${r.status}`}>
                      <td className="font-bold capitalize">{r.grade.replace('_',' ')}</td>
                      <td><span className={`badge ${r.status==='permanent'?'badge-success':'badge-info'}`}>{r.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <input 
                          type="number" 
                          className="table-input" 
                          defaultValue={r.rate} 
                          onBlur={(e) => handleUpdateHrRate(r.grade, r.status, e.target.value)}
                        />
                      </td>
                      <td>
                        <span className="text-faint text-[10px]">Auto-save au focus</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Équivalences ETD ── */}
        <section className="settings-section animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="settings-section__header">
            <Icon name="calculate" className="section-icon" />
            <div>
              <h2 className="section-title">Coefficients d'Équivalence (ETD)</h2>
              <p className="section-desc">Règles de conversion des heures réelles en heures d'enseignement (ETD).</p>
            </div>
          </div>
          <div className="grid-3">
            {eqRates.map(r => (
              <div key={r.type} className="card eq-card">
                <div className="eq-header">
                  <span className="eq-type">{r.type}</span>
                  <span className="eq-desc">{r.description}</span>
                </div>
                <div className="eq-body">
                  <label>Coefficient</label>
                  <div className="eq-input-group">
                    <input 
                      type="number" 
                      step="0.05" 
                      defaultValue={r.coefficient} 
                      onBlur={(e) => handleUpdateEqRate(r.type, e.target.value)}
                    />
                    <span className="eq-unit">ETD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
