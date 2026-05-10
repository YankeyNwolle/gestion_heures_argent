import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getPendingHours, validateHour, validateAllHours, contestHour, exportTeacherPDF } from '../api/auth';
import './Validation.css';

/* ── Helpers ─────────────────────────────────────────────── */
function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
const TYPE_COLORS = { CM: '#6366f1', TD: '#f59e0b', TP: '#22c55e' };

/* ── Modal Contest ───────────────────────────────────────── */
function ContestModal({ entry, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  async function handle() {
    if (!reason.trim()) { toast.error('Veuillez indiquer un motif'); return; }
    setSaving(true);
    await onConfirm(entry.id, reason);
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2 className="modal-title">Contester la séance</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
          Séance du <strong style={{ color: 'var(--text)' }}>{fmtDate(entry?.date)}</strong> — <strong style={{ color: 'var(--text)' }}>{entry?.subject_name}</strong>
        </p>
        <div className="form-field">
          <label className="form-label">Motif de la contestation *</label>
          <textarea className="form-textarea" rows={3}
            placeholder="Ex: durée incorrecte, matière erronée, absence non justifiée…"
            value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-danger" onClick={handle} disabled={saving}>
            {saving ? 'Envoi…' : 'Contester'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function ValidationPage() {
  const { user, canManage, isTeacher } = useAuth();

  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [contest,  setContest]  = useState(null); // entry en contestation
  const [actionId, setActionId] = useState(null); // id en cours d'action

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPendingHours();
      const raw = res.data?.hours ?? res.data?.entries ?? res.data;
      const list = Array.isArray(raw) ? raw : [];
      setEntries(list);
    } catch {
      toast.error('Impossible de charger les heures en attente');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleValidate(id) {
    setActionId(id);
    try {
      await validateHour(id);
      toast.success('Séance validée !');
      setEntries(p => p.filter(e => e.id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setActionId(null);
    }
  }

  async function handleValidateAll() {
    if (!window.confirm(`Valider toutes les ${entries.length} séances en attente ?`)) return;
    try {
      await validateAllHours();
      toast.success('Toutes les séances ont été validées !');
      setEntries([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la validation groupée');
    }
  }

  async function handleContest(id, reason) {
    try {
      await contestHour(id, reason);
      toast.success('Séance contestée');
      setEntries(p => p.map(e => e.id === id ? { ...e, status: 'contested' } : e));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la contestation');
    }
  }

  async function handleDownload() {
    if (!user?.teacher_id) {
      toast.error("Profil enseignant non trouvé");
      return;
    }
    try {
      setDownloading(true);
      const res = await exportTeacherPDF(user.teacher_id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recapitulatif_${user.last_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Récapitulatif téléchargé');
    } catch (err) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setDownloading(false);
    }
  }

  const pendingCount   = entries.filter(e => e.status === 'pending').length;
  const contestedCount = entries.filter(e => e.status === 'contested').length;
  const totalETD       = entries.reduce((s, e) => s + parseFloat(e.etd_hours || 0), 0);

  return (
    <Layout 
      title={isTeacher ? "Mes heures et validations" : "Validation des heures"} 
      subtitle={isTeacher ? "Consultez, confirmez ou contestez vos séances enregistrées par la RH" : "Vérifiez et validez les séances enregistrées"}
    >

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card animate-in">
          <div className="kpi-card__icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>pending</span>
          </div>
          <div className="kpi-card__label">En attente</div>
          <div className="kpi-card__value">{loading ? '—' : pendingCount}</div>
          <div className="kpi-card__sub">séances à valider</div>
        </div>
        <div className="kpi-card animate-in">
          <div className="kpi-card__icon" style={{ background: '#ef444420', color: '#ef4444' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
          </div>
          <div className="kpi-card__label">Contestées</div>
          <div className="kpi-card__value">{loading ? '—' : contestedCount}</div>
          <div className="kpi-card__sub">séances contestées</div>
        </div>
        <div className="kpi-card animate-in">
          <div className="kpi-card__icon" style={{ background: '#6366f120', color: '#6366f1' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>schedule</span>
          </div>
          <div className="kpi-card__label">Total ETD en attente</div>
          <div className="kpi-card__value">{loading ? '—' : `${totalETD.toFixed(1)} h`}</div>
          <div className="kpi-card__sub">équivalent TD</div>
        </div>
      </div>

      {/* Table card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div className="val-toolbar">
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Séances enregistrées</h3>
            <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
              {entries.length} séance(s) en attente de traitement
            </p>
          </div>
          {(canManage || entries.length > 0) && pendingCount > 0 && (
            <button className="btn btn-primary" onClick={handleValidateAll} disabled={!canManage}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>done_all</span>
              Tout valider ({pendingCount})
            </button>
          )}
          {isTeacher && (
            <button className="btn btn-secondary" onClick={handleDownload} disabled={downloading}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              {downloading ? 'Téléchargement…' : 'Télécharger mon récapitulatif'}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Matière</th>
                {canManage && <th>Enseignant</th>}
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'right' }}>Durée</th>
                <th style={{ textAlign: 'right' }}>ETD</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: canManage ? 8 : 6 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 13, width: '75%', borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 8 : 6}>
                    <div className="empty-state">
                      <span className="material-symbols-outlined">rule_folder</span>
                      <h4>Aucune séance en attente</h4>
                      <p>Toutes les séances ont été traitées.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map(entry => (
                  <tr key={entry.id} className={entry.status === 'contested' ? 'val-contested-row' : ''}>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {fmtDate(entry.date)}
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{entry.subject_name || '—'}</div>
                      {entry.room && <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{entry.room}</div>}
                    </td>
                    {canManage && (
                      <td style={{ fontSize: 12 }}>
                        {entry.teacher_first_name} {entry.teacher_last_name}
                      </td>
                    )}
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge" style={{ background: `${TYPE_COLORS[entry.type]}20`, color: TYPE_COLORS[entry.type] }}>
                        {entry.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: 13 }}>{entry.hours} h</td>
                    <td style={{ textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{(parseFloat(entry.etd_hours) || 0).toFixed(2)} h</td>
                    <td>
                      {entry.status === 'contested'
                        ? <span className="badge badge-danger"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>error</span> Contesté</span>
                        : <span className="badge badge-warning">En attente</span>
                      }
                    </td>
                    <td>
                      {entry.status === 'pending' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--success)', borderColor: 'var(--success-light)', background: 'var(--success-light)' }}
                            disabled={actionId === entry.id}
                            onClick={() => handleValidate(entry.id)}
                          >
                            {actionId === entry.id
                              ? <span className="material-symbols-outlined spin" style={{ fontSize: 14 }}>refresh</span>
                              : <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                            }
                            Valider
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => setContest(entry)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                            Contester
                          </button>
                        </div>
                      )}
                      {entry.status === 'contested' && (
                        <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right', maxWidth: 200 }}>
                          {entry.contest_reason || '—'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contest modal */}
      {contest && (
        <ContestModal
          entry={contest}
          onClose={() => setContest(null)}
          onConfirm={handleContest}
        />
      )}
    </Layout>
  );
}
