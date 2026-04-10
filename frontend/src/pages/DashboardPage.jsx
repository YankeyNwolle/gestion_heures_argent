import React from "react";
import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <div className="dashboard">
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
            <h1 className="sidebar-brand-title">The Archive</h1>
            <span className="sidebar-brand-subtitle">Administrative Portal</span>
          </div>
        </div>

        {/* User card */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">CY</div>
          <div style={{ overflow: "hidden" }}>
            <p className="sidebar-username">Christian Yankey</p>
            <span className="sidebar-role">Administrateur</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Tableau de bord</span>
          </a>

          <span className="nav-section-label">Opérations</span>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Saisie des heures</span>
          </a>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Historique</span>
          </a>

          <span className="nav-section-label">Administration</span>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Enseignants</span>
          </a>

          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Gestion Académique</span>
          </a>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <a className="nav-item" href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Déconnexion</span>
          </a>
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
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <input
                className="search-input"
                placeholder="Rechercher..."
                type="text"
              />
            </div>
          </div>

          <div className="topbar-actions">
            <button className="topbar-icon-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="notification-dot" />
            </button>

            <button className="topbar-icon-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>

            <div className="topbar-divider" />

            <div className="topbar-user">
              <div className="topbar-user-info">
                <span className="topbar-user-name">Administrateur</span>
                <span className="topbar-user-status">Session active</span>
              </div>
              <img
                alt="Administrator Avatar"
                className="topbar-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9E-enDQkhZuKGcWfN3UPGeK6Y1B_sTaeKoJLRAYz2v0VWeDv5VFZ8Y2_5PP8Pf10fuOLPJ_d7Y7KJ6HvVxKNmCFjlZGQxEmLRYtufb68RjgUQMOtKkpbnnkwAW35wNz9Rfkn48fpS2nTvoWXiEhqVmWcknyiz4zYAa0j-jMXxW-KhAHf5olRJU4N7S5wZqRLOBBQRyg-1i9XSOhocmW5RXnZcp8nWjU_nphnlJdWc_0YkhckwigX3dJOsEMu4nc0a_yJWvnjZWc0W"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">

          {/* Page header */}
          <section className="page-header">
            <div>
              <h2 className="page-title">Tableau de bord</h2>
              <p className="page-subtitle">Vue globale des indicateurs de performance académique.</p>
            </div>
            <div className="date-badge">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>vendredi 13 mars 2026</span>
            </div>
          </section>

          {/* KPI Grid */}
          <section className="kpi-grid">
            {/* Card 1 - Total ETD */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="kpi-label-top">Temps réel</span>
              </div>
              <div>
                <h3 className="kpi-value">0.0 h</h3>
                <p className="kpi-desc">Total heures ETD</p>
              </div>
              <div className="kpi-footer">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Année en cours
              </div>
              <div className="kpi-bg-circle blue" />
            </div>

            {/* Card 2 - Heures complémentaires */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon purple">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="kpi-value">0.0 h</h3>
                <p className="kpi-desc">Heures complémentaires</p>
              </div>
              <div className="kpi-footer">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Au-delà du service contractuel
              </div>
              <div className="kpi-bg-circle purple" />
            </div>

            {/* Card 3 - Montant */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon amber">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="kpi-value">0 FCFA</h3>
                <p className="kpi-desc">Montant à régler</p>
              </div>
              <div className="kpi-footer">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Heures complémentaires dues
              </div>
              <div className="kpi-bg-circle amber" />
            </div>

            {/* Card 4 - Dépassement */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon red">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="kpi-value">0</h3>
                <p className="kpi-desc">Enseignants en dépassement</p>
              </div>
              <div className="kpi-footer">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Sur la période sélectionnée
              </div>
              <div className="kpi-bg-circle red" />
            </div>
          </section>

          {/* Charts */}
          <section className="charts-section">
            {/* Monthly hours chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title">
                  <span className="chart-dot primary" />
                  <h3>Heures par mois (ETD)</h3>
                </div>
                <button className="chart-menu-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 8h16M4 16h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
              <div className="empty-state">
                <div className="empty-icon-wrapper">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p className="empty-title">Aucune donnée mensuelle disponible</p>
                <p className="empty-hint">
                  Commencez par saisir des heures dans le menu "Saisie des heures".
                </p>
              </div>
            </div>

            {/* Donut chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-title">
                  <span className="chart-dot orange" />
                  <h3>Répartition CM/TD/TP</h3>
                </div>
              </div>
              <div className="empty-state">
                <div className="donut-wrapper">
                  <svg viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      fill="transparent"
                      r="15.915"
                      stroke="#f1f5f9"
                      strokeWidth="4"
                    />
                  </svg>
                  <div className="donut-center">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <p className="empty-title">Aucune heure saisie</p>
                <div className="donut-legend">
                  <div className="donut-legend-item">
                    <span className="donut-legend-label">CM</span>
                    <span className="donut-legend-value">0%</span>
                  </div>
                  <div className="donut-legend-item">
                    <span className="donut-legend-label">TD</span>
                    <span className="donut-legend-value">0%</span>
                  </div>
                  <div className="donut-legend-item">
                    <span className="donut-legend-label">TP</span>
                    <span className="donut-legend-value">0%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Teacher table */}
          <section className="teacher-table-card">
            <div className="teacher-table-header">
              <div className="teacher-table-title">
                <div className="icon-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3>Récapitulatif enseignants</h3>
              </div>
              <span className="count-badge">0 enseignants</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Enseignant</th>
                    <th>Statut</th>
                    <th>Contingent</th>
                    <th className="center">Effectué (ETD)</th>
                    <th className="right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-empty-row">
                    <td colSpan={5}>
                      <div className="table-empty-content">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                        <p>Aucun enseignant répertorié</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 Academic Architect. Système de gestion des heures d&apos;enseignement.</p>
        </footer>
      </main>
    </div>
  );
}
