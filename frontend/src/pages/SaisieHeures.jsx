import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  createHour, getRecentHours,
  getSubjects, getTeachers, getMyTeacherProfile,
  getCurrentYear,
} from '../api/auth';
import './SaisieHeures.css';

/* ── Constants ───────────────────────────────────────────── */
const COEFFICIENTS = { CM: 1.5, TD: 1.0, TP: 0.75 };
const TYPE_COLORS  = { CM: '#6366f1', TD: '#f59e0b', TP: '#22c55e' };

function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_BADGE = {
  pending:   { label: 'En attente', cls: 'badge-warning' },
  validated: { label: 'Validé',     cls: 'badge-success' },
  contested: { label: 'Contesté',   cls: 'badge-danger'  },
};

/* ── Composant principal ─────────────────────────────────── */
export default function SaisieHeures() {
  const { canManage } = useAuth();

  /* Form state */
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date:        today,
    subject_id:  '',
    teacher_id:  '',
    type:        'CM',
    hours:       2,
    room:        '',
    notes:       '',
  });
  const [saving, setSaving] = useState(false);

  /* Data */
  const [subjects,    setSubjects]   = useState([]);
  const [teachers,    setTeachers]   = useState([]);
  const [recentHours, setRecent]     = useState([]);
  const [myTeacher,   setMyTeacher]  = useState(null);
  const [currentYear, setYear]       = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  const etd = parseFloat((form.hours * COEFFICIENTS[form.type]).toFixed(2));

  /* Load data */
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoadingData(true);
        const [subjRes, yearRes, recentRes] = await Promise.all([
          getSubjects(),
          getCurrentYear(),
          getRecentHours(10),
        ]);
        if (!active) return;
        const subjectsList = subjRes.data?.subjects ?? subjRes.data;
        setSubjects(Array.isArray(subjectsList) ? subjectsList : []);

        setYear(yearRes.data?.year ?? yearRes.data ?? null);

        const recentList = recentRes.data?.hours ?? recentRes.data?.entries ?? recentRes.data;
        setRecent(Array.isArray(recentList) ? recentList : []);

        // Charger les enseignants si admin/rh
        if (canManage) {
          const tRes = await getTeachers();
          if (active) setTeachers(tRes.data.teachers || []);
        } else {
          // Enseignant : récupérer son propre profil
          const meRes = await getMyTeacherProfile().catch(() => null);
          if (active && meRes) {
            setMyTeacher(meRes.data.teacher);
            setForm(f => ({ ...f, teacher_id: meRes.data.teacher?.id?.toString() || '' }));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoadingData(false);
      }
    }
    load();
    return () => { active = false; };
  }, [canManage]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject_id) { toast.error('Veuillez sélectionner une matière'); return; }
    if (!form.teacher_id && canManage) { toast.error('Veuillez sélectionner un enseignant'); return; }
    if (!form.date) { toast.error('Veuillez sélectionner une date'); return; }
    if (form.hours <= 0) { toast.error('La durée doit être supérieure à 0'); return; }

    try {
      setSaving(true);
      const payload = {
        subject_id:       parseInt(form.subject_id),
        teacher_id:       canManage ? parseInt(form.teacher_id) : myTeacher?.id,
        academic_year_id: currentYear?.id,
        date:             form.date,
        type:             form.type,
        hours:            parseFloat(form.hours),
        etd_hours:        etd,
        room:             form.room || null,
        notes:            form.notes || null,
      };
      await createHour(payload);
      toast.success('Séance enregistrée avec succès !');
      // Reset form
      setForm({ date: today, subject_id: '', teacher_id: canManage ? '' : form.teacher_id, type: 'CM', hours: 2, room: '', notes: '' });
      // Refresh recent
      const recentRes = await getRecentHours(10);
      const recentList = recentRes.data?.hours ?? recentRes.data?.entries ?? recentRes.data;
      setRecent(Array.isArray(recentList) ? recentList : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Saisie des heures" subtitle="Enregistrez vos heures d'enseignement">
      <div className="sh-layout">
        {/* ── Formulaire ── */}
        <div className="card sh-form-card">
          <div className="sh-form-header">
            <span className="material-symbols-outlined sh-form-header-icon">edit_note</span>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Nouvelle séance</h3>
              <p style={{ fontSize: 12 }}>Année académique : {currentYear?.label || '—'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Enseignant (visible admin/rh) */}
            {canManage && (
              <div className="form-field sh-form-field">
                <label className="form-label">Enseignant *</label>
                <select className="form-select" value={form.teacher_id}
                  onChange={e => set('teacher_id', e.target.value)}>
                  <option value="">— Sélectionner —</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.first_name} {t.last_name} ({t.grade?.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date + Matière */}
            <div className="form-grid-2 sh-form-field">
              <div className="form-field">
                <label className="form-label">Date de la séance *</label>
                <input className="form-input" type="date" value={form.date}
                  onChange={e => set('date', e.target.value)} max={today} />
              </div>
              <div className="form-field">
                <label className="form-label">Matière (UE) *</label>
                <select className="form-select" value={form.subject_id}
                  onChange={e => set('subject_id', e.target.value)}>
                  <option value="">— Sélectionner —</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.code ? `(${s.code})` : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type + Durée + Salle */}
            <div className="form-grid-3 sh-form-field">
              <div className="form-field">
                <label className="form-label">Type d'heure *</label>
                <div className="sh-toggle">
                  {['CM', 'TD', 'TP'].map(t => (
                    <button key={t} type="button"
                      className={`sh-toggle-btn${form.type === t ? ' active' : ''}`}
                      style={form.type === t ? { background: TYPE_COLORS[t], borderColor: TYPE_COLORS[t], color: '#fff' } : {}}
                      onClick={() => set('type', t)}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Durée réelle (h) *</label>
                <input className="form-input" type="number" min="0.5" max="12" step="0.5"
                  value={form.hours} onChange={e => set('hours', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-field">
                <label className="form-label">Salle / Amphi</label>
                <input className="form-input" type="text" placeholder="Ex: Amphi A"
                  value={form.room} onChange={e => set('room', e.target.value)} />
              </div>
            </div>

            {/* Notes */}
            <div className="form-field sh-form-field">
              <label className="form-label">Commentaires (optionnel)</label>
              <textarea className="form-textarea" rows={2}
                placeholder="Contenu de la séance, observations…"
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>

            {/* Submit */}
            <div className="sh-form-actions">
              <button type="button" className="btn btn-ghost"
                onClick={() => setForm({ date: today, subject_id: '', teacher_id: canManage?'':form.teacher_id, type: 'CM', hours: 2, room: '', notes: '' })}>
                Réinitialiser
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? <><span className="material-symbols-outlined spin" style={{ fontSize: 16 }}>refresh</span> Enregistrement…</>
                  : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span> Enregistrer la séance</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* ── Colonne droite ── */}
        <div className="sh-right-col">
          {/* Calcul ETD */}
          <div className="sh-etd-card">
            <div className="sh-etd-header">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>calculate</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Calcul ETD</span>
            </div>
            <div className="sh-etd-body">
              <div className="sh-etd-row">
                <span>Durée saisie</span>
                <strong>{form.hours} h {form.type}</strong>
              </div>
              <div className="sh-etd-row">
                <span>Coefficient {form.type}</span>
                <strong>× {COEFFICIENTS[form.type]}</strong>
              </div>
              <div className="sh-etd-divider" />
              <div className="sh-etd-row sh-etd-total">
                <span>Équivalence ETD</span>
                <strong style={{ color: 'var(--primary)', fontSize: 18 }}>{etd} h TD</strong>
              </div>
            </div>
            <div className="sh-etd-note">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
              CM×1.5 · TD×1.0 · TP×0.75
            </div>
          </div>

          {/* Mon service (enseignant) */}
          {!canManage && myTeacher && (
            <div className="card sh-service-card">
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Mon service</h4>
              <div className="sh-service-row">
                <span>Service annuel</span>
                <span>{myTeacher.contractual_hours ?? 192} h ETD</span>
              </div>
              <div className="sh-service-row">
                <span>Grade</span>
                <span style={{ textTransform: 'capitalize' }}>{(myTeacher.grade||'').replace('_',' ')}</span>
              </div>
              <div className="sh-service-row">
                <span>Statut</span>
                <span className={`badge ${myTeacher.status==='permanent'?'badge-success':'badge-warning'}`}>
                  {myTeacher.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Dernières saisies ── */}
      <div className="card" style={{ marginTop: 20, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Dernières saisies</h3>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{recentHours.length} entrée(s)</span>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Matière</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Durée</th>
                <th style={{ textAlign: 'right' }}>ETD</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                Array.from({length:3}).map((_,i)=>(
                  <tr key={i}>{Array.from({length:6}).map((_,j)=>(
                    <td key={j}><div className="skeleton" style={{height:12,width:'70%',borderRadius:4}}/></td>
                  ))}</tr>
                ))
              ) : recentHours.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state" style={{ padding: '24px 0' }}>
                      <span className="material-symbols-outlined">schedule</span>
                      <h4>Aucune saisie récente</h4>
                    </div>
                  </td>
                </tr>
              ) : (
                recentHours.map(h => {
                  const st = STATUS_BADGE[h.status] || STATUS_BADGE.pending;
                  return (
                    <tr key={h.id}>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(h.date)}</td>
                      <td style={{ fontSize: 13 }}>{h.subject_name || '—'}</td>
                      <td>
                        <span className="badge" style={{ background: `${TYPE_COLORS[h.type]}20`, color: TYPE_COLORS[h.type] }}>
                          {h.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 13 }}>{h.hours} h</td>
                      <td style={{ textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{h.etd_hours} h</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}