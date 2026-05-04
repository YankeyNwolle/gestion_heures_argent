import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { getDepartments, getPrograms, getSubjects, createSubject, getTeachers } from '../api/auth';
import './Academia.css';

/* ── Tabs ────────────────────────────────────────────────── */
const TABS = ['Enseignants', 'Départements', 'Filières', 'Matières'];

const GRADE_BADGE = {
  assistant:        'badge-neutral',
  maitre_assistant: 'badge-primary',
  professeur:       'badge-warning',
};
const STATUS_BADGE = {
  permanent: 'badge-success',
  vacataire: 'badge-info',
};

function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function getInitials(fn, ln) { return `${(fn||'')[0]||''}${(ln||'')[0]||''}`.toUpperCase()||'?'; }

/* ── Modal nouvelle matière ──────────────────────────────── */
function SubjectModal({ programs, onClose, onSaved }) {
  const [form, setForm] = useState({ name:'', code:'', program_id:'', cm_hours:0, td_hours:0, tp_hours:0, coefficient:1 });
  const [saving, setSaving] = useState(false);
  function set(k,v) { setForm(p=>({...p,[k]:v})); }
  async function handle(e) {
    e.preventDefault();
    if (!form.name || !form.program_id) { toast.error('Nom et filière requis'); return; }
    try {
      setSaving(true);
      await createSubject({ ...form, program_id: parseInt(form.program_id) });
      toast.success('Matière créée');
      onSaved();
    } catch(err) { toast.error(err?.response?.data?.message||'Erreur'); }
    finally { setSaving(false); }
  }
  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Nouvelle matière</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><span className="material-symbols-outlined" style={{fontSize:18}}>close</span></button>
        </div>
        <form onSubmit={handle}>
          <div className="form-grid-2">
            <div className="form-field"><label className="form-label">Nom *</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} /></div>
            <div className="form-field"><label className="form-label">Code</label><input className="form-input" value={form.code} onChange={e=>set('code',e.target.value)} /></div>
          </div>
          <div className="form-field" style={{marginTop:12}}>
            <label className="form-label">Filière *</label>
            <select className="form-select" value={form.program_id} onChange={e=>set('program_id',e.target.value)}>
              <option value="">— Sélectionner —</option>
              {programs.map(p=><option key={p.id} value={p.id}>{p.name} ({p.level})</option>)}
            </select>
          </div>
          <div className="form-grid-3" style={{marginTop:12}}>
            <div className="form-field"><label className="form-label">CM (h)</label><input className="form-input" type="number" min={0} value={form.cm_hours} onChange={e=>set('cm_hours',parseFloat(e.target.value)||0)} /></div>
            <div className="form-field"><label className="form-label">TD (h)</label><input className="form-input" type="number" min={0} value={form.td_hours} onChange={e=>set('td_hours',parseFloat(e.target.value)||0)} /></div>
            <div className="form-field"><label className="form-label">TP (h)</label><input className="form-input" type="number" min={0} value={form.tp_hours} onChange={e=>set('tp_hours',parseFloat(e.target.value)||0)} /></div>
          </div>
          <div className="form-field" style={{marginTop:12}}>
            <label className="form-label">Coefficient</label>
            <input className="form-input" type="number" min={0.5} step={0.5} value={form.coefficient} onChange={e=>set('coefficient',parseFloat(e.target.value)||1)} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Création…' : <><span className="material-symbols-outlined" style={{fontSize:16}}>add</span>Créer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function Academia() {
  const [tab, setTab]           = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [depts, setDepts]       = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showSubjModal, setShowSubjModal] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, dRes, pRes, sRes] = await Promise.all([
        getTeachers(),
        getDepartments(),
        getPrograms(),
        getSubjects(),
      ]);
      setTeachers(tRes.data.teachers || []);
      setDepts(dRes.data.departments || dRes.data || []);
      setPrograms(pRes.data.programs || pRes.data || []);
      setSubjects(sRes.data.subjects || sRes.data || []);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Layout title="Gestion Académique" subtitle="Enseignants, départements, filières et matières">
      {/* Tab bar */}
      <div className="acad-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`acad-tab${tab===i?' active':''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* ── Enseignants ── */}
      {tab === 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Enseignants ({teachers.length})</h3>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Enseignant</th><th>Grade</th><th>Statut</th><th>Département</th><th style={{textAlign:'right'}}>Service (h ETD)</th><th>Spécialité</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:4}).map((_,i)=>(
                  <tr key={i}>{Array.from({length:6}).map((_,j)=><td key={j}><div className="skeleton" style={{height:13,width:'75%',borderRadius:4}}/></td>)}</tr>
                )) : teachers.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty-state"><span className="material-symbols-outlined">group</span><h4>Aucun enseignant</h4></div></td></tr>
                ) : teachers.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="teacher-avatar">{getInitials(t.first_name, t.last_name)}</div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{t.first_name} {t.last_name}</div>
                          <div style={{ fontSize:11, color:'var(--text-faint)' }}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${GRADE_BADGE[t.grade]||'badge-neutral'}`}>{(t.grade||'').replace('_',' ')}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[t.status]||'badge-neutral'}`}>{t.status}</span></td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{t.department_name||'—'}</td>
                    <td style={{textAlign:'right',fontSize:13,fontWeight:600}}>{t.contractual_hours}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.speciality||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Départements ── */}
      {tab === 1 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Départements ({depts.length})</h3>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Nom</th><th>Code</th><th>Description</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:3}).map((_,i)=>(
                  <tr key={i}>{Array.from({length:3}).map((_,j)=><td key={j}><div className="skeleton" style={{height:13,width:'70%',borderRadius:4}}/></td>)}</tr>
                )) : depts.length===0 ? (
                  <tr><td colSpan={3}><div className="empty-state"><span className="material-symbols-outlined">domain</span><h4>Aucun département</h4></div></td></tr>
                ) : depts.map(d=>(
                  <tr key={d.id}>
                    <td style={{fontWeight:600,fontSize:13}}>{d.name}</td>
                    <td><span className="badge badge-neutral">{d.code||'—'}</span></td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{d.description||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Filières ── */}
      {tab === 2 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Filières ({programs.length})</h3>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Nom</th><th>Code</th><th>Niveau</th><th>Département</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:4}).map((_,i)=>(
                  <tr key={i}>{Array.from({length:4}).map((_,j)=><td key={j}><div className="skeleton" style={{height:13,width:'70%',borderRadius:4}}/></td>)}</tr>
                )) : programs.length===0 ? (
                  <tr><td colSpan={4}><div className="empty-state"><span className="material-symbols-outlined">account_tree</span><h4>Aucune filière</h4></div></td></tr>
                ) : programs.map(p=>(
                  <tr key={p.id}>
                    <td style={{fontWeight:600,fontSize:13}}>{p.name}</td>
                    <td><span className="badge badge-primary">{p.code||'—'}</span></td>
                    <td><span className="badge badge-info">{p.level}</span></td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{p.department_name||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Matières ── */}
      {tab === 3 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Matières ({subjects.length})</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowSubjModal(true)}>
              <span className="material-symbols-outlined" style={{fontSize:14}}>add</span>Nouvelle matière
            </button>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Matière</th><th>Code</th><th>Filière</th><th style={{textAlign:'right'}}>CM</th><th style={{textAlign:'right'}}>TD</th><th style={{textAlign:'right'}}>TP</th><th style={{textAlign:'right'}}>Coeff.</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:5}).map((_,i)=>(
                  <tr key={i}>{Array.from({length:7}).map((_,j)=><td key={j}><div className="skeleton" style={{height:13,width:'65%',borderRadius:4}}/></td>)}</tr>
                )) : subjects.length===0 ? (
                  <tr><td colSpan={7}><div className="empty-state"><span className="material-symbols-outlined">menu_book</span><h4>Aucune matière</h4></div></td></tr>
                ) : subjects.map(s=>(
                  <tr key={s.id}>
                    <td style={{fontWeight:600,fontSize:13}}>{s.name}</td>
                    <td><span className="badge badge-neutral">{s.code||'—'}</span></td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{s.program_name||'—'}</td>
                    <td style={{textAlign:'right',fontSize:12}}>{s.cm_hours||0}h</td>
                    <td style={{textAlign:'right',fontSize:12}}>{s.td_hours||0}h</td>
                    <td style={{textAlign:'right',fontSize:12}}>{s.tp_hours||0}h</td>
                    <td style={{textAlign:'right',fontSize:12,fontWeight:600}}>{s.coefficient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showSubjModal && (
        <SubjectModal programs={programs} onClose={() => setShowSubjModal(false)} onSaved={() => { setShowSubjModal(false); load(); }} />
      )}
    </Layout>
  );
}
