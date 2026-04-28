import React from "react";
import "./RapportExport.css";

export default function RapportExport() {
  return (
    <div className="rapport-page">

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <span className="sidebar-brand-title">The Archive</span>
            <span className="sidebar-brand-subtitle">Admin Portal</span>
          </div>
        </div>

        {/* User card */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">CY</div>
          <div style={{ overflow: "hidden" }}>
            <span className="sidebar-username">Christian Yankey</span>
            <span className="sidebar-role">Administrateur</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">Principal</span>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
            <span>Tableau de bord</span>
          </a>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
            <span>Saisie des heures</span>
          </a>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
            <span>Historique</span>
          </a>

          <span className="nav-section-label mt">Administration</span>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
            <span>Enseignants</span>
          </a>

          <span className="nav-section-label mt">Rapports</span>

          {/* Active item */}
          <a className="nav-item active" href="#">
            <svg className="icon-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
            <span>Rapports &amp; Exports</span>
          </a>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Paramètres</span>
          </a>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">

        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-search">
            <div className="search-wrapper">
              <span className="search-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <input
                className="search-input"
                placeholder="Rechercher un enseignant ou un rapport..."
                type="text"
              />
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-icons">
              <button className="topbar-icon-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
              </button>
              <button className="topbar-icon-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            <div className="topbar-divider" />

            <div className="topbar-date">
              <span className="topbar-date-text">vendredi 13 mars 2026</span>
              <div className="topbar-date-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">

          {/* Page header */}
          <div className="page-header">
            <h2 className="page-title">Rapports &amp; Exports</h2>
            <p className="page-subtitle">
              Générer des bilans individuels et des états comptables globaux pour l'institution.
            </p>
          </div>

          {/* Filter section */}
          <section className="filter-card">
            <div className="filter-card-header">
              <div className="filter-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <h3>Paramètres du rapport</h3>
            </div>

            <div className="filter-grid">
              <div className="form-group">
                <label htmlFor="enseignant">Enseignant</label>
                <select className="form-select" id="enseignant">
                  <option>— Tous les enseignants —</option>
                  <option>Jean-Michel Dupuis</option>
                  <option>Sarah Labarthe</option>
                  <option>Marc Lefebvre</option>
                </select>
                <p className="form-hint">Sélectionner pour un bilan individuel ou PDF</p>
              </div>

              <div className="form-group">
                <label htmlFor="annee">Année académique</label>
                <select className="form-select" id="annee">
                  <option>2025-2026 (en cours)</option>
                  <option>2024-2025</option>
                  <option>2023-2024</option>
                </select>
              </div>
            </div>
          </section>

          {/* Action cards */}
          <div className="action-grid">

            {/* Card 1 — Bilan individuel */}
            <article className="action-card">
              <div className="action-card-icon indigo">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
              </div>
              <h4>Bilan individuel</h4>
              <p>
                Voir le détail des heures ETD, heures complémentaires et montant dû pour un enseignant.
              </p>
              <button className="btn btn-secondary indigo">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Afficher le bilan
              </button>
            </article>

            {/* Card 2 — Fiche PDF */}
            <article className="action-card">
              <div className="action-card-icon red">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
              </div>
              <h4>Fiche individuelle PDF</h4>
              <p>
                Générer une fiche de synthèse PDF pour un enseignant sélectionné prêt pour l'impression.
              </p>
              <button className="btn btn-secondary red">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Télécharger PDF
              </button>
            </article>

            {/* Card 3 — Excel */}
            <article className="action-card">
              <div className="action-card-icon emerald">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
              </div>
              <h4>État comptable Excel</h4>
              <p>
                Exporter l'état global de tous les enseignants avec montants dus pour la comptabilité.
              </p>
              <button className="btn btn-emerald">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  />
                </svg>
                Exporter Excel
              </button>
            </article>
          </div>

          {/* History table */}
          <section className="history-card">
            <div className="history-card-header">
              <div className="history-card-title">
                <span>🗂️</span>
                <h3>Historique des exports récents</h3>
              </div>
              <span className="record-count-badge">3 Enregistrements</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type de rapport</th>
                    <th>Cible</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-date">13/03/2026 08:45</td>
                    <td>
                      <div className="td-type">
                        <span className="type-dot emerald" />
                        <span className="td-type-label">Comptabilité Globale (Excel)</span>
                      </div>
                    </td>
                    <td className="td-target">Tous les enseignants</td>
                    <td>
                      <span className="status-badge green">Complété</span>
                    </td>
                    <td>
                      <button className="td-action-btn">Télécharger</button>
                    </td>
                  </tr>

                  <tr>
                    <td className="td-date">12/03/2026 14:20</td>
                    <td>
                      <div className="td-type">
                        <span className="type-dot red" />
                        <span className="td-type-label">Fiche de Synthèse (PDF)</span>
                      </div>
                    </td>
                    <td className="td-target">Dr. Sarah Labarthe</td>
                    <td>
                      <span className="status-badge green">Complété</span>
                    </td>
                    <td>
                      <button className="td-action-btn">Télécharger</button>
                    </td>
                  </tr>

                  <tr>
                    <td className="td-date">10/03/2026 09:12</td>
                    <td>
                      <div className="td-type">
                        <span className="type-dot indigo" />
                        <span className="td-type-label">Bilan d'heures (Aperçu)</span>
                      </div>
                    </td>
                    <td className="td-target">Pr. Marc Lefebvre</td>
                    <td>
                      <span className="status-badge blue">Visualisé</span>
                    </td>
                    <td>
                      <button className="td-action-btn">Ré-ouvrir</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 Academic Architect — Système de gestion académique.</p>
          <div className="footer-meta">
            <div className="footer-meta-item">
              <span className="footer-dot" />
              <span>26°C Très ensoleillé</span>
            </div>
            <div className="footer-meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3a10.003 10.003 0 00-6.237 2.152c-.853.692-1.514 1.583-1.921 2.58m4.44 11.168l-.053-.09A10.003 10.003 0 013 12c0-1.268.235-2.483.664-3.593a3.001 3.001 0 014.285-1.536m3.606 3.006a15.981 15.981 0 00-3.003-3.003m0 0a15.998 15.998 0 013-3m-3 3H9m3 3h3"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                />
              </svg>
              <span>Serveur Opérationnel</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
