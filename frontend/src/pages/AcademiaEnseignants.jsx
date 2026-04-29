import { useState } from "react";
import "./AcademiaEnseignants.css";

// ─── Data ────────────────────────────────────────────────────────
const navItems = [
  { icon: "⊞", label: "Tableau de bord" },
  { icon: "⏱", label: "Saisie des heures" },
  { icon: "📋", label: "Historique" },
  { icon: "👥", label: "Enseignants", active: true },
  { icon: "🎓", label: "Gestion Académique" },
  { icon: "📤", label: "Rapports & Exports" },
  { icon: "⚙", label: "Paramètres", footer: true },
];

const teachers = [
  {
    id: 1,
    initials: "MB",
    color: "av-blue",
    name: "Marc Bertrand",
    email: "m.bertrand@academia.edu",
    grade: "Professeur",
    dept: "Informatique",
    status: "permanent",
  },
  {
    id: 2,
    initials: "SL",
    color: "av-purple",
    name: "Sophie Laurent",
    email: "s.laurent@academia.edu",
    grade: "Maître-Assistant",
    dept: "Génie Civil",
    status: "vacataire",
  },
  {
    id: 3,
    initials: "JD",
    color: "av-emerald",
    name: "Julien Dupont",
    email: "j.dupont@academia.edu",
    grade: "Assistant",
    dept: "Mathématiques",
    status: "permanent",
  },
  {
    id: 4,
    initials: "AM",
    color: "av-orange",
    name: "Amélie Morel",
    email: "a.morel@academia.edu",
    grade: "Professeur",
    dept: "Économie",
    status: "permanent",
  },
  {
    id: 5,
    initials: "TR",
    color: "av-blue",
    name: "Thomas Rousseau",
    email: "t.rousseau@academia.edu",
    grade: "Maître-Assistant",
    dept: "Informatique",
    status: "vacataire",
  },
];

const statusMap = {
  permanent: { label: "Permanent", cls: "tag-permanent" },
  vacataire: { label: "Vacataire", cls: "tag-vacataire" },
};

const grades = ["Tous les grades", "Professeur", "Maître-Assistant", "Assistant"];
const depts = ["Tous les départements", "Informatique", "Génie Civil", "Économie", "Mathématiques"];

// ─── Component ───────────────────────────────────────────────────
export default function AcademiaEnseignants() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("Tous les grades");
  const [dept, setDept] = useState("Tous les départements");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchGrade = grade === "Tous les grades" || t.grade === grade;
    const matchDept = dept === "Tous les départements" || t.dept === dept;
    return matchSearch && matchGrade && matchDept;
  });

  const mainNav = navItems.filter((n) => !n.footer);
  const footerNav = navItems.filter((n) => n.footer);

  return (
    <div className="ens-root">
      {/* ── Topbar ── */}
      <header className="ens-topbar">
        <div className="topbar-left">
          <span className="topbar-brand">Academia</span>
          <div className="topbar-search-wrap">
            <span className="ts-icon">🔎</span>
            <input
              className="topbar-search"
              type="text"
              placeholder="Rechercher un enseignant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="topbar-right">
          <button className="tb-icon-btn">❓</button>
          <button className="tb-icon-btn tb-notif">
            🔔<span className="notif-pip" />
          </button>
          <div className="tb-avatar">AD</div>
        </div>
      </header>

      <div className="ens-body">
        {/* ── Sidebar ── */}
        <aside className="ens-sidebar">
          <div className="sidebar-logo">
            <div className="logo-badge">🎓</div>
            <div>
              <p className="logo-title">Academia</p>
              <p className="logo-sub">Academic Management</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {mainNav.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`snav-item ${item.active ? "snav-item--active" : ""}`}
              >
                <span className="snav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="sidebar-footer">
            {footerNav.map((item) => (
              <a key={item.label} href="#" className="snav-item">
                <span className="snav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ens-main">
          <div className="ens-canvas">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <span className="bc-segment">Gestion</span>
              <span className="bc-sep">/</span>
              <span className="bc-segment bc-active">Enseignants</span>
            </div>

            {/* Page Header */}
            <div className="page-header">
              <div className="ph-text">
                <h1 className="page-title">Gestion des Enseignants</h1>
                <p className="page-sub">
                  Gérez l'ensemble du corps professoral, leurs grades et leurs
                  affectations départementales.
                </p>
              </div>
              <button
                className="btn-add"
                onClick={() => setShowModal(true)}
              >
                <span className="btn-add-plus">+</span>
                Ajouter un enseignant
              </button>
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-wide">
                <div className="stat-wide-text">
                  <p className="stat-label">Effectif Total</p>
                  <p className="stat-number">248</p>
                  <p className="stat-trend">↑ +12 ce semestre</p>
                </div>
                <div className="stat-wide-visual">
                  {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
                    <div
                      key={i}
                      className="bar-sparkline"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="stat-narrow">
                <div className="stat-narrow-inner">
                  <p className="stat-label-light">Départements</p>
                  <p className="stat-narrow-value">14 Actifs</p>
                  <button className="stat-link">Voir la répartition →</button>
                </div>
                <span className="stat-deco">🏛</span>
              </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
              <div className="filters-left">
                <div className="select-wrap">
                  <select
                    className="ens-select"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                  <span className="select-chevron">▾</span>
                </div>
                <div className="select-wrap">
                  <select
                    className="ens-select"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    {depts.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <span className="select-chevron">▾</span>
                </div>
              </div>
              <div className="filters-right">
                <button className="filt-btn">⫶ Filtres avancés</button>
                <button className="filt-btn">⬇ Exporter</button>
              </div>
            </div>

            {/* Table */}
            <div className="table-card">
              <div className="table-scroll">
                <table className="ens-table">
                  <thead>
                    <tr>
                      <th>Nom de l'enseignant</th>
                      <th>Grade</th>
                      <th>Département</th>
                      <th>Statut</th>
                      <th className="th-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => {
                      const { label, cls } = statusMap[t.status];
                      return (
                        <tr key={t.id} className="ens-row">
                          <td>
                            <div className="teacher-cell">
                              <div className={`t-avatar ${t.color}`}>
                                {t.initials}
                              </div>
                              <div>
                                <p className="t-name">{t.name}</p>
                                <p className="t-email">{t.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="td-grade">{t.grade}</td>
                          <td className="td-dept">{t.dept}</td>
                          <td>
                            <span className={`status-tag ${cls}`}>{label}</span>
                          </td>
                          <td className="td-right">
                            <button className="more-btn">⋯</button>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="empty-row">
                          Aucun enseignant trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="table-footer">
                <p className="pag-info">
                  Affichage de 1 à {filtered.length} sur 248 enseignants
                </p>
                <div className="pag-controls">
                  <button className="pg" disabled>‹</button>
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      className={`pg ${currentPage === p ? "pg--active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="pg-dots">…</span>
                  <button className="pg">50</button>
                  <button className="pg">›</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Add Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Ajouter un enseignant</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input className="form-input" type="text" placeholder="Ex : Jean Martin" />
              </div>
              <div className="form-group">
                <label className="form-label">Email institutionnel</label>
                <input className="form-input" type="email" placeholder="j.martin@academia.edu" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Grade</label>
                  <select className="form-input">
                    {grades.slice(1).map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Département</label>
                  <select className="form-input">
                    {depts.slice(1).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select className="form-input">
                  <option>Permanent</option>
                  <option>Vacataire</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="modal-btn-save">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
