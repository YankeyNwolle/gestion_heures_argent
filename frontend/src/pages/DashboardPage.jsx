import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardStats,
  getTeacherSummary,
  getDistributionChart,
  getRecentHours,
  exportTeacherPDF,
  exportTeacherExcel,
  getDepartmentStats,
  getProgramStats,
  getMyUEs,
} from '../api/auth';
import toast from 'react-hot-toast';
import './DashboardPage.css';

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(n) { return (n ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 }); }
function fmtCFA(n) { return (n ?? 0).toLocaleString('fr-FR') + ' FCFA'; }
function getInitials(fn, ln) { return `${(fn||'')[0]||''}${(ln||'')[0]||''}`.toUpperCase() || '?'; }

const GRADE_BADGE = { assistant: 'badge-neutral', maitre_assistant: 'badge-primary', professeur: 'badge-warning', autres: 'badge-info' };
const TYPE_COLORS  = { CM: '#6366f1', TD: '#f59e0b', TP: '#22c55e' };

/* ── KPI Card ────────────────────────────────────────────── */
function KPICard({ label, value, sub, iconName, colorVar, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card kpi-card p-6 border border-[var(--border)] rounded-[var(--r-lg)] bg-white shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</p>
          <h2 className="text-[26px] font-black text-[var(--text-main)] leading-none">{value}</h2>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface-2)]" style={{ color: colorVar }}>
          <span className="material-symbols-outlined text-[22px]">{iconName}</span>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-[12px] font-medium text-[var(--text-faint)]">{sub}</span>
      </div>
    </motion.div>
  );
}

/* ── DistBar ─────────────────────────────────────────────── */
function DistBar({ label, pct, color, subLabel }) {
  return (
    <div className="dist-bar mb-4">
      <div className="dist-bar__header">
        <span className="dist-bar__label">{label}</span>
        <span className="dist-bar__pct" style={{ color }}>{subLabel || `${pct}%`}</span>
      </div>
      <div className="dist-bar__track">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
          className="dist-bar__fill" 
          style={{ backgroundColor: color }} 
        />
      </div>
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3 border-b border-[var(--border)]">
          <div className="skeleton h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, isAdmin, canManage } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats]         = useState({ 
    totalEtd: 0, 
    complementaryHours: 0, 
    amountDue: 0, 
    potentialAmount: 0, 
    teacherCount: 0, 
    contestedCount: 0 
  });
  const [teachers, setTeachers]   = useState([]);
  const [recentHours, setRecentHours] = useState([]);
  const [distrib, setDistrib]     = useState([]);
  const [myUEs, setMyUEs]         = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [progStats, setProgStats] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          getDashboardStats(),
          canManage ? getTeacherSummary() : Promise.resolve({ data: { teachers: [] } }),
          getDistributionChart(),
          getRecentHours(10), // On en prend un peu plus pour la vue enseignant
          !canManage ? getMyUEs() : Promise.resolve({ data: { ues: [] } }),
          canManage ? getDepartmentStats() : Promise.resolve({ data: [] }),
          canManage ? getProgramStats() : Promise.resolve({ data: [] }),
        ]);

        if (!active) return;

        if (results[0].status === 'fulfilled') setStats(results[0].value?.data);
        if (results[1].status === 'fulfilled') setTeachers(results[1].value?.data?.teachers || []);
        if (results[2].status === 'fulfilled') setDistrib(results[2].value?.data?.data || []);
        if (results[3].status === 'fulfilled') {
          const hData = results[3].value?.data;
          setRecentHours(hData?.entries || hData?.hours || []);
        }
        if (results[4]?.status === 'fulfilled') setMyUEs(results[4].value?.data?.ues || []);
        if (results[5]?.status === 'fulfilled') setDeptStats(results[5].value?.data?.data || []);
        if (results[6]?.status === 'fulfilled') setProgStats(results[6].value?.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [canManage]);

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

  const totalDist = distrib.reduce((s, d) => s + parseFloat(d.etd_hours || 0), 0);
  const cmPct  = totalDist ? Math.round((distrib.find(d=>d.type==='CM')?.etd_hours||0)/totalDist*100) : 0;
  const tdPct  = totalDist ? Math.round((distrib.find(d=>d.type==='TD')?.etd_hours||0)/totalDist*100) : 0;
  const tpPct  = totalDist ? 100 - cmPct - tdPct : 0;

  return (
    <Layout title="Tableau de bord" subtitle={`Année académique ${stats?.academicYear || '…'}`}>
      {canManage && stats?.contestedCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="contested-alert" 
          onClick={() => navigate('/Validation', { state: { filter: 'contested' } })}
        >
          <span className="material-symbols-outlined text-[50px] font-bold">report</span>
          <div className="flex-1">
            <h2>{stats.contestedCount} SÉANCE(S) CONTESTÉE(S) EN ATTENTE</h2>
            <p>Action requise : Des corrections sont nécessaires pour débloquer les calculs de paie.</p>
          </div>
          <button className="contested-btn">Traiter maintenant</button>
        </motion.div>
      )}

      <div className="kpi-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard index={0} label={canManage ? "Total ETD" : "Mon ETD"} value={loading ? '—' : `${fmt(stats?.totalEtd)} h`} sub="Heures équivalent TD" iconName="schedule" colorVar="#6366f1" />
        <KPICard index={1} label="Complémentaires" value={loading ? '—' : `${fmt(stats?.complementaryHours)} h`} sub="Heures à régler" iconName="add_circle" colorVar="#f59e0b" />
        <KPICard index={2} label={canManage ? "Montant à régler" : "Mon Montant Dû"} value={loading ? '—' : fmtCFA(stats?.amountDue)} sub="Budget prévisionnel" iconName="payments" colorVar="#22c55e" />
        <KPICard index={3} label={canManage ? "Dépassements" : "Mes Alertes"} value={loading ? '—' : (canManage ? (stats?.teachersOverLimit ?? 0) : (stats?.contestedCount ?? 0))} sub={canManage ? `sur ${stats?.teacherCount ?? 0} profs` : "Séances à corriger"} iconName="warning" colorVar="#64748b" />
      </div>

      <div className="dash-grid">
        <div className="card dash-table-card bg-white border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--shadow-sm)]">
          {canManage && (
            <div className="dash-section-header">
              <h3 className="dash-section-title text-[16px] font-bold text-[#1e293b]">
                <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}>history</span>
                Récapitulatif des enseignants
              </h3>
              <button className="btn btn-ghost btn-sm text-[var(--primary)]" onClick={() => navigate('/academia')}>Voir tout</button>
            </div>
          )}

          <div className="overflow-x-auto">
            {canManage ? (
              <table className="w-full text-[13px] dash-table">
                <thead>
                  <tr className="bg-[#fcfdfe] border-b-2 border-[#f1f5f9]">
                    <th className="p-5 text-left text-[11px] font-black text-[#64748b] uppercase tracking-[2px] col-enseignant">Enseignant</th>
                    <th className="p-5 text-left text-[11px] font-black text-[#64748b] uppercase tracking-[2px] border-l border-[#f1f5f9] col-grade">Grade</th>
                    <th className="p-5 text-left text-[11px] font-black text-[#64748b] uppercase tracking-[2px] border-l border-[#f1f5f9] col-statut">Statut</th>
                    <th className="p-5 text-right text-[11px] font-black text-[#64748b] uppercase tracking-[2px] border-l border-[#f1f5f9] col-etd">ETD Total</th>
                    <th className="p-5 text-right text-[11px] font-black text-[#64748b] uppercase tracking-[2px] border-l border-[#f1f5f9] col-surplus">Surplus</th>
                    <th className="p-5 text-right text-[11px] font-black text-[#64748b] uppercase tracking-[2px] border-l border-[#f1f5f9] col-montant">Montant Dû</th>
                    <th className="p-5 text-right text-[11px] font-black text-[#64748b] uppercase tracking-[2px] border-l border-[#f1f5f9] col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {loading ? Array.from({length:5}).map((_,i)=><SkeletonRow key={i} cols={7}/>) : teachers.map((t,i)=>(
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-[#f8faff] transition-colors"
                    >
                      <td className="p-5 align-middle col-enseignant">
                        <span className="font-extrabold text-[#1e293b] text-[15px]">{t.first_name} {t.last_name}</span>
                      </td>
                      <td className="p-5 align-middle border-l border-[#f8fafc] col-grade">
                        <span className={`badge ${GRADE_BADGE[t.grade]||'badge-neutral'} !rounded-md px-3 py-1 font-bold`}>{t.grade}</span>
                      </td>
                      <td className="p-5 align-middle border-l border-[#f8fafc] col-statut">
                        <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">{t.status}</span>
                      </td>
                      <td className="p-5 align-middle text-right border-l border-[#f8fafc] col-etd">
                        <span className="text-[15px] font-black text-[#475569]">{fmt(t.total_etd)} h</span>
                      </td>
                      <td className="p-5 align-middle text-right border-l border-[#f8fafc] col-surplus">
                        {parseFloat(t.complementary_etd||0) > 0 ? (
                          <span className="bg-[#fff7ed] text-[#ea580c] px-3 py-1 rounded-full font-black text-[12px]">{fmt(t.complementary_etd)} h</span>
                        ) : (
                          <span className="text-[#e2e8f0]">0 h</span>
                        )}
                      </td>
                      <td className="p-5 align-middle text-right border-l border-[#f8fafc] col-montant">
                        {parseInt(t.amount_due||0) > 0 ? (
                          <span className="text-[#10b981] font-black text-[16px]">{fmtCFA(t.amount_due)}</span>
                        ) : (
                          <span className="text-[#e2e8f0]">0 FCFA</span>
                        )}
                      </td>
                      <td className="p-5 align-middle text-right border-l border-[#f8fafc] col-actions">
                        <div className="actions-row">
                          <button 
                            className="btn-action-sm shadow-md"
                            style={{ backgroundColor: '#dc2626', color: 'white' }}
                            onClick={async () => {
                               const res = await exportTeacherPDF(t.teacher_id);
                               const url = window.URL.createObjectURL(new Blob([res.data]));
                               const link = document.createElement('a');
                               link.href = url;
                               link.setAttribute('download', `fiche_${t.last_name}.pdf`);
                               document.body.appendChild(link);
                               link.click();
                               link.remove();
                            }}
                            title="Exporter en PDF"
                          >
                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                          </button>
                          <button 
                            className="btn-action-sm shadow-md"
                            style={{ backgroundColor: '#16a34a', color: 'white' }}
                            onClick={async () => {
                               const res = await exportTeacherExcel(t.teacher_id);
                               const url = window.URL.createObjectURL(new Blob([res.data]));
                               const link = document.createElement('a');
                               link.href = url;
                               link.setAttribute('download', `recap_${t.last_name}.xlsx`);
                               document.body.appendChild(link);
                               link.click();
                               link.remove();
                            }}
                            title="Exporter en Excel"
                          >
                            <span className="material-symbols-outlined text-[20px]">table_view</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8">
                {/* --- Dashboard Minimaliste --- */}
                <div className="space-y-6">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                        {user?.grade?.replace('_', ' ')} {user?.status}
                      </p>
                      <p style={{ fontSize: '15px', color: '#059669', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payments</span>
                        Valeur estimée : {new Intl.NumberFormat('fr-FR').format(stats?.potentialAmount || 0)} FCFA
                      </p>
                    </div>
                    <button 
                      className="btn"
                      onClick={handleDownload}
                      disabled={downloading}
                      style={{ 
                        background: '#1e293b', 
                        color: 'white', 
                        fontSize: '12px', 
                        fontWeight: '700', 
                        padding: '10px 20px', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: downloading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                      {downloading ? 'Génération...' : 'Télécharger mon récapitulatif'}
                    </button>
                  </div>

                  <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Mes dernières séances</h3>
                      <button onClick={() => navigate('/Validation')} style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Historique complet</button>
                    </div>
                    <div className="data-table-wrap">
                      <table className="data-table w-full">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Matière</th>
                            <th>Type</th>
                            <th style={{ textAlign: 'right' }}>ETD</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentHours.length > 0 ? recentHours.map((h, i) => (
                            <tr key={i}>
                              <td style={{ fontSize: '12px', color: '#64748b' }}>{new Date(h.date).toLocaleDateString('fr-FR')}</td>
                              <td style={{ fontSize: '13px', fontWeight: '600' }}>{h.subject_name || h.subject}</td>
                              <td>
                                <span className="badge" style={{ background: `${TYPE_COLORS[h.type] || '#ccc'}15`, color: TYPE_COLORS[h.type] || '#666', fontSize: '10px' }}>{h.type}</span>
                              </td>
                              <td style={{ textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>{fmt(h.etd_hours || h.hours)} h</td>
                              <td>
                                <span className={`badge ${h.status === 'validated' ? 'badge-success' : h.status === 'contested' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                                  {h.status === 'validated' ? 'Validée' : h.status === 'contested' ? 'Contestée' : 'En attente'}
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontStyle: 'italic' }}>Aucune séance récente</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>library_books</span>
                        Mes Unités d'Enseignement (UE)
                      </h3>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{myUEs.length} total</span>
                    </div>
                    <div className="data-table-wrap">
                      <table className="data-table w-full">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Nom de l'UE</th>
                            <th style={{ textAlign: 'center' }}>Niveau</th>
                            <th>Département</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myUEs.length > 0 ? myUEs.map((ue, idx) => (
                            <tr key={idx}>
                              <td>
                                <span className="text-[11px] font-black text-[var(--primary)] bg-[#6366f110] px-2 py-0.5 rounded">
                                  {ue.code || '—'}
                                </span>
                              </td>
                              <td style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{ue.name}</td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={`badge ue-level-${ue.level || 'L1'}`} style={{ fontSize: '10px', minWidth: '40px' }}>
                                  {ue.level}
                                </span>
                              </td>
                              <td style={{ fontSize: '12px', color: '#64748b' }}>{ue.department_name}</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontStyle: 'italic' }}>
                                Aucune UE enregistrée pour le moment.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dash-right-col">
          <div className="card bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-6 shadow-[var(--shadow-sm)]">
            <h3 className="dash-section-title mb-6">Répartition des heures</h3>
            <div className="flex flex-col gap-2">
              <DistBar label="CM (Cours Magistral)" pct={cmPct} color="#6366f1" />
              <DistBar label="TD (Travaux Dirigés)"  pct={tdPct} color="#f59e0b" />
              <DistBar label="TP (Travaux Pratiques)" pct={tpPct} color="#22c55e" />
            </div>
          </div>

          <div className="card bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-6 shadow-[var(--shadow-sm)]">
            <h3 className="dash-section-title mb-4">Actions rapides</h3>
            <div className="flex flex-col gap-2">
              <button className="btn btn-secondary !justify-start py-3" onClick={() => navigate('/saisieheures')}>
                <span className="material-symbols-outlined text-[20px] mr-3">add</span> Saisir des heures
              </button>
              {canManage && (
                <button className="btn btn-secondary !justify-start py-3" onClick={() => navigate('/Validation')}>
                  <span className="material-symbols-outlined text-[20px] mr-3">rule_folder</span> Valider les heures
                </button>
              )}
              {!canManage && (
                <button className="btn btn-secondary !justify-start py-3" onClick={handleDownload} disabled={downloading}>
                  <span className="material-symbols-outlined text-[20px] mr-3">download</span> 
                  {downloading ? 'Génération...' : 'Mon récapitulatif PDF'}
                </button>
              )}
            </div>
          </div>

          {canManage && (
            <>
              <div className="card bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-6 shadow-[var(--shadow-sm)] mt-6">
                <h3 className="dash-section-title mb-4">Heures par Département</h3>
                <div className="flex flex-col gap-3">
                  {deptStats.slice(0, 5).map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px]">
                      <span className="font-medium text-[#475569]">{d.name}</span>
                      <span className="font-bold text-[var(--primary)]">{fmt(d.total_etd)} h</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-6 shadow-[var(--shadow-sm)] mt-6">
                <h3 className="dash-section-title mb-4">Top Filières (ETD)</h3>
                <div className="flex flex-col gap-3">
                  {progStats.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px]">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1e293b]">{p.name}</span>
                        <span className="text-[10px] text-[#94a3b8] uppercase font-bold">{p.level}</span>
                      </div>
                      <span className="font-black text-[#10b981]">{fmt(p.total_etd)} h</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
