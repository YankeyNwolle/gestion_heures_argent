import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  getHours, 
  validateHour, 
  validateAllHours, 
  contestHour 
} from '../api/auth';
import './Validation.css';

/* ── Helpers ─────────────────────────────────────────────── */
function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtCFA(n) { return (n ?? 0).toLocaleString('fr-FR') + ' FCFA'; }

const TYPE_COLORS = { CM: '#6366f1', TD: '#f59e0b', TP: '#22c55e' };
const STATUS_BADGE = {
  pending: { label: 'En attente', class: 'badge-warning' },
  validated: { label: 'Validée', class: 'badge-success' },
  contested: { label: 'Contestée', class: 'badge-danger' }
};

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
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999 }} onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal p-8 rounded-[24px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100" 
        style={{ maxWidth: 460, width: '90%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
           <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>feedback</span>
           </div>
           <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Contester la séance</h2>
        </div>

        <div style={{ marginBottom: '20px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
           <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Séance concernée</p>
           <p style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>
              {entry?.subject_name} — {fmtDate(entry?.date)}
           </p>
        </div>

        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', display: 'block' }}>Motif détaillé *</label>
          <textarea 
            className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#ef4444] outline-none text-[14px] transition-all" 
            style={{ 
              minHeight: '120px', 
              background: '#fff',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
              lineHeight: '1.6'
            }}
            placeholder="Expliquez ici ce qui ne va pas (ex: durée incorrecte, type de cours erroné...)"
            value={reason} onChange={e => setReason(e.target.value)} 
          />
        </div>

        <div className="flex gap-3 justify-end mt-8">
          <button className="btn btn-ghost" style={{ borderRadius: '12px', fontWeight: '700' }} onClick={onClose}>Annuler</button>
          <button 
            className="btn btn-primary" 
            onClick={handle} 
            disabled={saving} 
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              borderColor: 'transparent',
              borderRadius: '12px',
              padding: '0 24px',
              fontWeight: '800',
              boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
            }}
          >
            {saving ? 'Envoi…' : 'Envoyer la contestation'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Modal View Reason ───────────────────────────────────── */
function ViewReasonModal({ entry, onClose }) {
  return (
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 9999 }} onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal p-6 rounded-[20px] bg-white shadow-2xl border border-gray-100" 
        style={{ maxWidth: 400, width: '90%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
           <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>info</span>
           <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Détail de la contestation</h3>
        </div>
        <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', color: '#7f1d1d', fontSize: '13px', lineHeight: '1.6', fontStyle: 'italic', borderLeft: '4px solid #ef4444' }}>
           "{entry.contest_reason}"
        </div>
        <div className="mt-6 flex justify-end">
           <button className="btn btn-primary btn-sm px-6" style={{ borderRadius: '10px', background: '#1e293b' }} onClick={onClose}>Fermer</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function ValidationPage() {
  const { user, canManage, isTeacher } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [contest,  setContest]  = useState(null);
  const [actionId, setActionId] = useState(null);
  const [filter,   setFilter]   = useState(location.state?.filter || 'all');
  const [search,   setSearch]   = useState('');
  const [viewingReason, setViewingReason] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getHours(); 
      const raw = res.data?.hours ?? res.data?.entries ?? res.data;
      setEntries(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleValidate(id) {
    setActionId(id);
    try {
      await validateHour(id);
      toast.success('Séance validée');
      setEntries(p => p.map(e => e.id === id ? { ...e, status: 'validated' } : e));
    } catch (err) {
      toast.error('Erreur');
    } finally {
      setActionId(null);
    }
  }

  async function handleContest(id, reason) {
    try {
      await contestHour(id, reason);
      toast.success('Contestation envoyée');
      setEntries(p => p.map(e => e.id === id ? { ...e, status: 'contested', contest_reason: reason } : e));
    } catch (err) {
      toast.error('Erreur');
    }
  }

  const filteredEntries = entries.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch = !search || 
      `${e.teacher_first_name} ${e.teacher_last_name} ${e.subject_name}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    pending: entries.filter(e => e.status === 'pending').length,
    contested: entries.filter(e => e.status === 'contested').length,
    validated: entries.filter(e => e.status === 'validated').length,
    totalEtd: entries.filter(e => e.status === 'validated').reduce((s, e) => s + parseFloat(e.etd_hours || 0), 0)
  };

  return (
    <Layout title="Centre de Validation" subtitle="Suivi et approbation des séances">
      
      {/* Le tableau des validations s'affiche directement ici */}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar (Style SaisieHeures) */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfdfe' }}>
          <div className="flex gap-2">
            {['all', 'pending', 'contested', 'validated'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  transition: 'all 0.2s',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? 'white' : '#64748b',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {f === 'all' ? 'Toutes' : f === 'pending' ? 'À valider' : f === 'contested' ? 'Contestées' : 'Validées'}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
             <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
             <input 
               type="text" 
               placeholder="Rechercher..." 
               style={{ padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', width: '200px', outline: 'none' }}
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
          </div>
        </div>

        {/* Table (Exactly same as SaisieHeures) */}
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Matière</th>
                {canManage && <th>Enseignant</th>}
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'right' }}>ETD</th>
                <th style={{ textAlign: 'center' }}>Statut</th>
                <th>Sem.</th>
                <th>Observations</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: canManage ? 8 : 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: '12px', width: '70%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : filteredEntries.length === 0 ? (
                <tr><td colSpan={canManage ? 9 : 8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontStyle: 'italic' }}>Aucune donnée à afficher</td></tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>{fmtDate(e.date)}</td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{e.subject_name || '—'}</div>
                      {e.room && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{e.room}</div>}
                    </td>
                    {canManage && <td style={{ fontSize: '13px' }}>{e.teacher_first_name} {e.teacher_last_name}</td>}
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge" style={{ background: `${TYPE_COLORS[e.type]}15`, color: TYPE_COLORS[e.type], fontSize: '10px', fontWeight: '800' }}>{e.type}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>{(parseFloat(e.etd_hours) || 0).toFixed(2)} h</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${STATUS_BADGE[e.status]?.class || 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                        {STATUS_BADGE[e.status]?.label || e.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                       {e.semester ? `S${e.semester}` : '—'}
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748b', maxWidth: '200px' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {e.status === 'contested' && e.contest_reason && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div title={e.contest_reason} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic', color: '#ef4444', flex: 1 }}>
                                   "Contest: {e.contest_reason.substring(0, 25)}..."
                                </div>
                                <button onClick={() => setViewingReason(e)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer' }}>
                                   <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>visibility</span>
                                </button>
                             </div>
                          )}
                          {e.notes && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div title={e.notes} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600', color: '#6366f1', flex: 1 }}>
                                   {e.status === 'pending' && e.updated_at ? 'Réponse: ' : 'Note: '}{e.notes.substring(0, 25)}...
                                </div>
                                <button onClick={() => setViewingReason({ ...e, contest_reason: e.notes })} style={{ background: '#e0e7ff', color: '#6366f1', border: 'none', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer' }}>
                                   <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>visibility</span>
                                </button>
                             </div>
                          )}
                          {!e.contest_reason && !e.notes && <span style={{ color: '#cbd5e1' }}>—</span>}
                       </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Actions pour TOUS (Validation) */}
                        {e.status === 'pending' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleValidate(e.id)} disabled={actionId === e.id} style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}>
                             {actionId === e.id ? '...' : 'Valider'}
                          </button>
                        )}

                        {/* Actions spécifiques Enseignant : Contester */}
                        {isTeacher && e.status === 'pending' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => setContest(e)} style={{ height: '28px', color: '#ef4444', border: '1px solid #fee2e2' }}>
                             Contester
                          </button>
                        )}

                        {/* Actions spécifiques RH : Modifier */}
                        {canManage && (e.status === 'pending' || e.status === 'contested') && (
                          <button 
                            className="btn btn-ghost btn-sm" 
                            onClick={() => {
                              console.log("Navigating to edit session:", e.id);
                              navigate('/saisieheures', { state: { editSession: e } });
                            }}
                            style={{ 
                              height: '32px', 
                              color: 'var(--primary)', 
                              border: '1px solid #c7d2fe',
                              background: '#f5f7ff',
                              fontWeight: '700',
                              padding: '0 12px'
                            }}
                          >
                             <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>edit</span>
                             Modifier
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {contest && (
        <ContestModal
          entry={contest}
          onClose={() => setContest(null)}
          onConfirm={handleContest}
        />
      )}
      {viewingReason && (
        <ViewReasonModal
          entry={viewingReason}
          onClose={() => setViewingReason(null)}
        />
      )}
    </Layout>
  );
}
