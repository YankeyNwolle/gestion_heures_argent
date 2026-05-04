import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardStats,
  getTeacherSummary,
  getDistributionChart,
} from '../api/auth';
import './DashboardPage.css';

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(n) { return (n ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 }); }
function fmtCFA(n) { return (n ?? 0).toLocaleString('fr-FR') + ' FCFA'; }
function getInitials(fn, ln) { return `${(fn||'')[0]||''}${(ln||'')[0]||''}`.toUpperCase() || '?'; }

const ROLE_BADGE = { admin: 'badge-danger', rh: 'badge-primary', enseignant: 'badge-success' };
const ROLE_LABEL = { admin: 'Admin', rh: 'RH', enseignant: 'Enseignant' };

/* ── KPI Card ────────────────────────────────────────────── */
function KPICard({ label, value, sub, iconName, colorVar, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(13, 71, 161, 0.15)' }}
      className="kpi-card relative overflow-hidden bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-[18px_20px] transition-colors hover:border-[var(--border-hover)]"
    >
      <div
        className="kpi-card__icon absolute right-4 top-4 w-9 h-9 rounded-[var(--r-md)] flex items-center justify-center text-lg"
        style={{ background: `${colorVar}20`, color: colorVar }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{iconName}</span>
      </div>
      <div className="kpi-card__label text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-[0.06em] mb-1.5">{label}</div>
      <div className="kpi-card__value text-[26px] font-extrabold text-[var(--text)] leading-none mb-1">{value}</div>
      {sub && <div className="kpi-card__sub text-[11px] text-[var(--text-faint)]">{sub}</div>}
    </motion.div>
  );
}

/* ── Skeleton ────────────────────────────────────────────── */
function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 4 }} /></td>
      ))}
    </tr>
  );
}

/* ── Distribution mini-chart ─────────────────────────────── */
function DistBar({ label, pct, color }) {
  return (
    <div className="dist-bar">
      <div className="dist-bar__header">
        <span className="dist-bar__label">{label}</span>
        <span className="dist-bar__pct">{pct}%</span>
      </div>
      <div className="dist-bar__track">
        <div className="dist-bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, isAdmin, canManage } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats]         = useState(null);
  const [teachers, setTeachers]   = useState([]);
  const [distrib, setDistrib]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [sRes, tRes, dRes] = await Promise.all([
          getDashboardStats(),
          canManage ? getTeacherSummary() : Promise.resolve({ data: { teachers: [] } }),
          getDistributionChart(),
        ]);
        if (!active) return;
        setStats(sRes.data);
        setTeachers(tRes.data.teachers || []);
        setDistrib(dRes.data.data || []);
      } catch (e) {
        if (active) setError('Impossible de charger les données. Vérifiez la connexion.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [canManage]);

  /* Distribution % */
  const totalDist = distrib.reduce((s, d) => s + parseFloat(d.total_hours || 0), 0);
  const cmPct  = totalDist ? Math.round((distrib.find(d=>d.type==='CM')?.total_hours||0)/totalDist*100) : 0;
  const tdPct  = totalDist ? Math.round((distrib.find(d=>d.type==='TD')?.total_hours||0)/totalDist*100) : 0;
  const tpPct  = 100 - cmPct - tdPct;

  return (
    <Layout
      title="Tableau de bord"
      subtitle={`Année académique ${stats?.academicYear || '…'} — Vue globale des indicateurs`}
    >
      {error && (
        <div className="dash-alert">
          <span className="material-symbols-outlined">warning</span>
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="kpi-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5 mb-6">
        <KPICard
          index={0}
          label="Total ETD"
          value={loading ? '—' : `${fmt(stats?.totalEtd)} h`}
          sub="Heures équivalent TD"
          iconName="schedule"
          colorVar="#6366f1"
        />
        <KPICard
          index={1}
          label="Heures complémentaires"
          value={loading ? '—' : `${fmt(stats?.complementaryHours)} h`}
          sub="Au-delà du service"
          iconName="add_circle"
          colorVar="#f59e0b"
        />
        <KPICard
          index={2}
          label="Montant à régler"
          value={loading ? '—' : fmtCFA(stats?.amountDue)}
          sub="Heures complémentaires"
          iconName="payments"
          colorVar="#22c55e"
        />
        <KPICard
          index={3}
          label="Dépassements"
          value={loading ? '—' : (stats?.teachersOverLimit ?? 0)}
          sub={`sur ${stats?.teacherCount ?? 0} enseignants`}
          iconName="warning"
          colorVar="#ef4444"
        />
      </div>

      {/* Charts + table */}
      <div className="dash-grid grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 items-start">
        {/* Teacher table — admin/rh */}
        {canManage && (
          <div className="card dash-table-card p-0 overflow-hidden bg-white border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--shadow-sm)]">
            <div className="dash-section-header flex items-center justify-between p-[16px_20px_12px] border-b border-[var(--border)]">
              <div>
                <h3 className="dash-section-title text-[14px] font-bold">Récapitulatif enseignants</h3>
                <p className="text-[12px] text-[var(--text-faint)]">{teachers.length} enseignant(s)</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/academia')}>
                Voir tout
              </button>
            </div>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Enseignant</th>
                    <th>Grade / Statut</th>
                    <th>Département</th>
                    <th style={{ textAlign: 'right' }}>ETD total</th>
                    <th style={{ textAlign: 'right' }}>Complémentaires</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                    : teachers.length === 0
                    ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="empty-state">
                            <span className="material-symbols-outlined">group</span>
                            <h4>Aucun enseignant répertorié</h4>
                            <p>Ajoutez des enseignants via la gestion académique.</p>
                          </div>
                        </td>
                      </tr>
                    )
                    : teachers.map((t, i) => (
                      <motion.tr
                        key={t.teacher_id ?? i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <td className="p-3 border-b border-[var(--border)]">
                          <div className="flex items-center gap-2.5">
                            <div className="teacher-avatar w-[30px] h-[30px] rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-[11px] font-bold shrink-0">{getInitials(t.first_name, t.last_name)}</div>
                            <div>
                              <div className="font-semibold text-[13px]">{t.first_name} {t.last_name}</div>
                              <div className="text-[11px] text-[var(--text-faint)]">{t.department_name || '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 border-b border-[var(--border)]">
                          <div className="text-[12px]">
                            <span className="capitalize">{(t.grade||'').replace('_',' ')}</span>
                            <span className="badge badge-neutral ml-1.5">{t.status}</span>
                          </div>
                        </td>
                        <td className="p-3 border-b border-[var(--border)] text-[12px] text-[var(--text-muted)]">{t.department_name || '—'}</td>
                        <td className="p-3 border-b border-[var(--border)] text-right font-semibold">{fmt(t.total_etd)} h</td>
                        <td className="p-3 border-b border-[var(--border)] text-right">
                          {parseFloat(t.complementary_etd || 0) > 0
                            ? <span className="badge badge-warning">{fmt(t.complementary_etd)} h</span>
                            : <span className="text-[var(--text-faint)] text-[12px]">—</span>
                          }
                        </td>
                      </motion.tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Right column */}
        <div className="dash-right-col flex flex-col gap-4">
          {/* Distribution chart */}
          <div className="card bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-5">
            <div className="dash-section-header flex items-center justify-between mb-3.5">
              <h3 className="dash-section-title text-[14px] font-bold">Répartition CM / TD / TP</h3>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[80, 60, 40].map((w, i) => <div key={i} className="skeleton h-9 rounded-lg" style={{ width: `${w}%` }} />)}
              </div>
            ) : totalDist === 0 ? (
              <div className="empty-state py-6 flex flex-col items-center text-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-[var(--text-faint)] opacity-70">bar_chart</span>
                <h4 className="text-[14px] font-medium text-[var(--text-muted)]">Aucune heure saisie</h4>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-1">
                <DistBar label="CM (Cours Magistral)" pct={cmPct} color="#6366f1" />
                <DistBar label="TD (Travaux Dirigés)"  pct={tdPct} color="#f59e0b" />
                <DistBar label="TP (Travaux Pratiques)" pct={tpPct} color="#22c55e" />
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="card bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-5">
            <h3 className="dash-section-title text-[14px] font-bold mb-3.5">Actions rapides</h3>
            <div className="flex flex-col gap-2">
              <button className="btn btn-secondary !justify-start"
                onClick={() => navigate('/saisieheures')}>
                <span className="material-symbols-outlined text-[16px]">add</span>
                Saisir des heures
              </button>
              {canManage && (
                <button className="btn btn-secondary !justify-start"
                  onClick={() => navigate('/Validation')}>
                  <span className="material-symbols-outlined text-[16px]">rule_folder</span>
                  Valider les heures
                </button>
              )}
              {canManage && (
                <button className="btn btn-secondary !justify-start"
                  onClick={() => navigate('/rapportexport')}>
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Exporter un rapport
                </button>
              )}
              {isAdmin && (
                <button className="btn btn-secondary !justify-start"
                  onClick={() => navigate('/utilisateur')}>
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Gérer les utilisateurs
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
