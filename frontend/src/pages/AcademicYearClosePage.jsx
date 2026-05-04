import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAcademicYears, createAcademicYear, activateYear, closeYear } from "../api/auth";
import "./AcademicYearClosePage.css";

const NAV_ITEMS = [
  { section: "Principal", links: [
    { icon: "dashboard", label: "Tableau de bord", path: "/dashboard" },
    { icon: "history_edu", label: "Saisie des heures", path: "/saisieheures" },
    { icon: "rule_folder", label: "Validation", path: "/Validation" },
  ]},
  { section: "Administration", links: [
    { icon: "group", label: "Utilisateurs", path: "/utilisateur" },
    { icon: "school", label: "Gestion Académique", path: "/academia" },
    { icon: "payments", label: "État Paiements", path: "/paiement" },
  ]},
  { section: "Système", links: [
    { icon: "analytics", label: "Rapports & Exports", path: "/rapportexport" },
    { icon: "shield", label: "Journal d'audit", path: "/audit" },
    { icon: "settings", label: "Paramètres", path: "/Settings" },
  ]},
];

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function AcademicYearClosePage() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ label: "", start_date: "", end_date: "", is_current: false });
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { fetchYears(); }, []);

  const fetchYears = async () => {
    setLoading(true);
    try { const res = await getAcademicYears(); setYears(res.data.years || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAcademicYear(form);
      setShowCreate(false); setForm({ label: "", start_date: "", end_date: "", is_current: false });
      fetchYears();
    } catch (e) { alert(e.response?.data?.message || "Erreur"); }
  };

  const handleActivate = async (id) => {
    if (!confirm("Activer cette année comme année courante ?")) return;
    setActionLoading(id);
    try { await activateYear(id); fetchYears(); }
    catch (e) { alert("Erreur"); }
    finally { setActionLoading(null); }
  };

  const handleClose = async (id) => {
    if (!confirm("Clôturer cette année académique ? Les données seront archivées.")) return;
    setActionLoading(id);
    try { await closeYear(id); fetchYears(); }
    catch (e) { alert("Erreur"); }
    finally { setActionLoading(null); }
  };

  const handleNavClick = (link) => { if (link.path) navigate(link.path); };

  return (
    <div className="ayc-layout">
      {/* Sidebar */}
      <aside className="ayc-sidebar">
        <div className="ayc-sidebar__logo">
          <div className="ayc-logo-icon"><Icon name="school" /></div>
          <div><h1 className="ayc-logo-title">GestionHeures</h1><p className="ayc-logo-sub">Enseignement Supérieur</p></div>
        </div>
        <nav className="ayc-nav">
          {NAV_ITEMS.map((g) => (
            <div key={g.section} className="ayc-nav-section">
              <p className="ayc-nav-section-label">{g.section}</p>
              {g.links.map((l) => (
                <button key={l.label} className={`ayc-nav-item ${location.pathname === l.path ? "ayc-nav-item--active" : ""}`} onClick={() => handleNavClick(l)}>
                  <Icon name={l.icon} /><span>{l.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="ayc-sidebar__footer">
          <button className="ayc-nav-item" onClick={() => navigate("/login")}><Icon name="logout" /><span>Déconnexion</span></button>
        </div>
      </aside>

      {/* Main */}
      <div className="ayc-main-wrapper">
        <header className="ayc-topbar">
          <div>
            <h2 className="ayc-topbar__title">Clôture d'Année Académique</h2>
            <p className="ayc-topbar__sub">Gestion du cycle de vie des exercices</p>
          </div>
          <button className="ayc-btn ayc-btn--primary" onClick={() => setShowCreate(true)}>
            <Icon name="add" /> Nouvelle Année
          </button>
        </header>

        <main className="ayc-content">
          {/* Info Banner */}
          <div className="ayc-info-banner">
            <Icon name="info" className="ayc-info-icon" />
            <div>
              <p className="ayc-info-title">Comment fonctionne la clôture ?</p>
              <p className="ayc-info-text">
                La clôture archive les données de l'année sélectionnée et permet de passer à la suivante.
                Les heures saisies restent consultables mais ne sont plus modifiables après la clôture.
                Activez la nouvelle année avant de clôturer l'ancienne.
              </p>
            </div>
          </div>

          {/* Create Modal */}
          {showCreate && (
            <div className="ayc-modal-overlay" onClick={() => setShowCreate(false)}>
              <div className="ayc-modal" onClick={e => e.stopPropagation()}>
                <div className="ayc-modal-header">
                  <h3>Créer une Année Académique</h3>
                  <button className="ayc-modal-close" onClick={() => setShowCreate(false)}>
                    <Icon name="close" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="ayc-modal-form">
                  <div className="ayc-form-group">
                    <label>Libellé (ex: 2026-2027)</label>
                    <input type="text" value={form.label} onChange={e => setForm({...form,label:e.target.value})} required placeholder="2026-2027" />
                  </div>
                  <div className="ayc-form-row">
                    <div className="ayc-form-group">
                      <label>Date de début</label>
                      <input type="date" value={form.start_date} onChange={e => setForm({...form,start_date:e.target.value})} required />
                    </div>
                    <div className="ayc-form-group">
                      <label>Date de fin</label>
                      <input type="date" value={form.end_date} onChange={e => setForm({...form,end_date:e.target.value})} required />
                    </div>
                  </div>
                  <label className="ayc-checkbox-label">
                    <input type="checkbox" checked={form.is_current} onChange={e => setForm({...form,is_current:e.target.checked})} />
                    Définir comme année courante
                  </label>
                  <div className="ayc-modal-actions">
                    <button type="button" className="ayc-btn ayc-btn--ghost" onClick={() => setShowCreate(false)}>Annuler</button>
                    <button type="submit" className="ayc-btn ayc-btn--primary">Créer</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Years Grid */}
          {loading ? (
            <div className="ayc-loading">Chargement...</div>
          ) : (
            <div className="ayc-years-grid">
              {years.map((y) => (
                <div key={y.id} className={`ayc-year-card ${y.is_current ? "ayc-year-card--active" : ""}`}>
                  <div className="ayc-year-card__header">
                    <div className="ayc-year-card__icon-wrap">
                      <Icon name={y.is_current ? "calendar_today" : "event_available"} />
                    </div>
                    {y.is_current && <span className="ayc-year-badge">EN COURS</span>}
                  </div>
                  <h3 className="ayc-year-card__label">{y.label}</h3>
                  <div className="ayc-year-card__dates">
                    <div>
                      <span className="ayc-date-label">Début</span>
                      <span className="ayc-date-value">{new Date(y.start_date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="ayc-date-arrow"><Icon name="arrow_forward" /></div>
                    <div>
                      <span className="ayc-date-label">Fin</span>
                      <span className="ayc-date-value">{new Date(y.end_date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <div className="ayc-year-card__actions">
                    {!y.is_current && (
                      <button className="ayc-btn ayc-btn--outline" onClick={() => handleActivate(y.id)} disabled={actionLoading === y.id}>
                        <Icon name="play_arrow" /> Activer
                      </button>
                    )}
                    {y.is_current && (
                      <button className="ayc-btn ayc-btn--danger" onClick={() => handleClose(y.id)} disabled={actionLoading === y.id}>
                        <Icon name="lock" /> Clôturer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
