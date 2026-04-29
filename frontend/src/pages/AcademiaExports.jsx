import { useState } from "react";
import "./AcademiaExports.css";

const exportHistory = [
  {
    id: 1,
    name: "releve_notes_l3_physique.pdf",
    type: "Relevé Collectif",
    date: "Il y a 2 heures",
    size: "1.2 MB",
    status: "ready",
    icon: "📄",
    iconClass: "icon-pdf",
  },
  {
    id: 2,
    name: "stats_assiduite_semestre1.xlsx",
    type: "Analyse Excel",
    date: "Hier, 15:45",
    size: "856 KB",
    status: "ready",
    icon: "📊",
    iconClass: "icon-excel",
  },
  {
    id: 3,
    name: "bilan_marie_curie.pdf",
    type: "Bilan Individuel",
    date: "12 Oct 2023",
    size: "420 KB",
    status: "archived",
    icon: "🗂️",
    iconClass: "icon-doc",
  },
  {
    id: 4,
    name: "rapport_annuel_global_2023.pdf",
    type: "Rapport Annuel",
    date: "En cours...",
    size: "—",
    status: "processing",
    icon: "⏳",
    iconClass: "icon-pending",
  },
];

const navItems = [
  { label: "Tableau de bord", icon: "⊞" },
  { label: "Cours", icon: "📚" },
  { label: "Étudiants", icon: "👥" },
  { label: "Rapports & Exports", icon: "📈", active: true },
  { label: "Paramètres", icon: "⚙" },
];

const statusConfig = {
  ready: { label: "Prêt", className: "badge-ready" },
  archived: { label: "Archivé", className: "badge-archived" },
  processing: { label: "Traitement", className: "badge-processing" },
};

export default function AcademiaExports() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered = exportHistory.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="academia-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <span>🎓</span>
          </div>
          <div>
            <p className="logo-title">Academia</p>
            <p className="logo-sub">PORTAIL ACADÉMIQUE</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`nav-item ${item.active ? "nav-item--active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="nav-item">
            <span className="nav-icon">❓</span>
            <span>Aide</span>
          </a>
          <a href="#" className="nav-item nav-item--logout">
            <span className="nav-icon">↩</span>
            <span>Déconnexion</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">Rapports &amp; Exports</span>
            <div className="divider-v" />
            <div className="year-selector">
              <span className="year-icon">📅</span>
              <span>Année Académique 2023–2024</span>
              <span className="chevron">▾</span>
            </div>
          </div>
          <div className="topbar-right">
            <button className="notif-btn">🔔</button>
            <div className="user-info">
              <div className="user-text">
                <p className="user-name">Dr. Jean Dupont</p>
                <p className="user-role">Professeur Principal</p>
              </div>
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="page-canvas">
          {/* Hero */}
          <section className="hero-section">
            <h1 className="hero-title">Centre d'Exportation</h1>
            <p className="hero-sub">
              Générez et téléchargez des rapports académiques détaillés pour vos
              étudiants et vos cours. Tous les exports sont conformes aux
              standards institutionnels.
            </p>
          </section>

          {/* Action Cards */}
          <section className="cards-grid">
            {[
              {
                id: "bilan",
                emoji: "🔍",
                colorClass: "card-blue",
                title: "Bilan Individuel",
                desc: "Résumé complet des performances pour un étudiant spécifique, incluant notes, assiduité et commentaires.",
                btnLabel: "Générer le Bilan",
                btnClass: "btn-primary",
              },
              {
                id: "pdf",
                emoji: "📋",
                colorClass: "card-red",
                title: "Fiches de Notes PDF",
                desc: "Exportez des relevés de notes officiels au format PDF pour toute une classe ou un groupe d'examen.",
                btnLabel: "Exporter en PDF",
                btnClass: "btn-outline",
              },
              {
                id: "excel",
                emoji: "📊",
                colorClass: "card-green",
                title: "États Excel (XLSX)",
                desc: "Données brutes structurées pour analyse statistique approfondie. Idéal pour le suivi administratif.",
                btnLabel: "Exporter en Excel",
                btnClass: "btn-outline",
              },
            ].map((card) => (
              <div
                key={card.id}
                className={`export-card ${card.colorClass} ${
                  hoveredCard === card.id ? "card-hovered" : ""
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-icon-wrap">
                  <span className="card-emoji">{card.emoji}</span>
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.desc}</p>
                <button className={`card-btn ${card.btnClass}`}>
                  {card.btnLabel}
                </button>
              </div>
            ))}
          </section>

          {/* History */}
          <section className="history-section">
            <div className="history-header">
              <h2 className="section-title">Historique des exports</h2>
              <div className="history-controls">
                <div className="search-wrap">
                  <span className="search-icon">🔎</span>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Rechercher un rapport..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="filter-btn">
                  <span>⫶</span> Filtrer
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="exports-table">
                <thead>
                  <tr>
                    <th>Nom du fichier</th>
                    <th>Type</th>
                    <th>Date de génération</th>
                    <th>Taille</th>
                    <th>Statut</th>
                    <th className="th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => {
                    const { label, className } = statusConfig[row.status];
                    return (
                      <tr key={row.id} className="table-row">
                        <td>
                          <div className="file-cell">
                            <span className={`file-icon ${row.iconClass}`}>
                              {row.icon}
                            </span>
                            <span className="file-name">{row.name}</span>
                          </div>
                        </td>
                        <td className="cell-muted">{row.type}</td>
                        <td className="cell-muted">{row.date}</td>
                        <td className="cell-muted">{row.size}</td>
                        <td>
                          <span className={`badge ${className}`}>{label}</span>
                        </td>
                        <td className="td-right">
                          <button
                            className={`action-btn ${
                              row.status === "processing"
                                ? "action-btn--disabled"
                                : ""
                            }`}
                            disabled={row.status === "processing"}
                          >
                            {row.status === "archived" ? "👁" : "⬇"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <span className="pagination-info">
                Affichage de 1–4 sur 12 exports
              </span>
              <div className="pagination-btns">
                <button className="page-btn" disabled>
                  Précédent
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${
                      currentPage === p ? "page-btn--active" : ""
                    }`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button className="page-btn">Suivant</button>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="cta-banner">
            <div className="cta-text">
              <h2 className="cta-title">Besoin d'un rapport personnalisé ?</h2>
              <p className="cta-desc">
                Notre équipe administrative peut configurer des modèles
                d'exportation spécifiques à vos besoins pédagogiques ou aux
                exigences de votre département.
              </p>
              <button className="cta-btn">✉ Contacter le support</button>
            </div>
            <div className="cta-visual">
              <div className="cta-decoration">
                <div className="deco-circle deco-1" />
                <div className="deco-circle deco-2" />
                <div className="deco-circle deco-3" />
                <span className="deco-emoji">📘</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
