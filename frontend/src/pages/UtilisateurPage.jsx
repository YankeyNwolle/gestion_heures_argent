import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./UtilisateurPage.css";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    section: "Principal",
    links: [
      { icon: "dashboard", label: "Tableau de bord" },
      { icon: "history_edu", label: "Saisie des heures", path: "/saisieheures" },
      { icon: "history", label: "Historique" },
    ],
  },
  {
    section: "Administration",
    links: [
      { icon: "person_search", label: "Enseignants" },
      { icon: "domain", label: "Gestion Académique" },
      { icon: "group", label: "Utilisateurs",  path: "/utilisateurs"},
    ],
  },
  {
    section: "Rapports",
    links: [
      { icon: "analytics", label: "Rapports & Exports", path: "/rapportexport" },
      { icon: "settings", label: "Paramètres" },
    ],
  },
];

const USERS = [
  {
    id: "#49201",
    initials: "SA",
    name: "Système Administrateur",
    email: "admin@universite.ci",
    role: "ADMINISTRATEUR",
    roleClass: "role-admin",
    status: "Actif",
    lastActivity: "12/03/2026",
    avatarClass: "avatar-blue-light",
  },
  {
    id: "#49202",
    initials: "AA",
    name: "ange ange",
    email: "ange@gmail.com",
    role: "RH",
    roleClass: "role-rh",
    status: "Actif",
    lastActivity: "12/03/2026",
    avatarClass: "avatar-indigo-light",
  },
  {
    id: "#49203",
    initials: "CY",
    name: "christian yankey",
    email: "nwolle14@gmail.com",
    role: "ENSEIGNANT",
    roleClass: "role-admin",
    status: "Actif",
    lastActivity: "13/03/2026",
    avatarClass: "avatar-blue-solid",
  },
];

const AUDIT_ITEMS = [
  {
    dotClass: "dot-blue",
    title: "Modification des permissions : Jean Dupont",
    time: "Aujourd'hui à 14:32 par Admin_Core",
  },
  {
    dotClass: "dot-gray",
    title: "Nouvel utilisateur enregistré : Lucas Bernard",
    time: "Hier à 11:20",
  },
  {
    dotClass: "dot-red",
    title: "Échec de connexion répétitif : Compte #48291",
    time: "Hier à 22:05",
  },
];

const TABS = ["Tous les comptes", "Administrateurs", "Enseignants", "RH"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

function Sidebar() {
  const navigate = useNavigate(); // Hook pour naviguer
  const location = useLocation(); // Hook pour obtenir l'URL actuelle

  const handleNavClick = (link) => {
    if (link.path) {
      navigate(link.path); // Navigue vers le chemin spécifié
    }
    // Vous pouvez ajouter une logique pour les liens sans path si nécessaire
  };


  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="logo-icon">
            <Icon name="school" />
          </div>
          <div>
            <div className="logo-title">GestionHeures</div>
            <div className="logo-subtitle">Enseignement Supérieur</div>
          </div>
        </div>
      </div>

      {/* Profile */}
      {/* <div className="sidebar-profile">
        <div className="sidebar-profile-inner">
          <div className="profile-avatar">CY</div>
          <div>
            <div className="profile-name">christian yankey</div>
            <div className="profile-role">Administrateur</div>
          </div>
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.section} className="nav-section">
            <div className="nav-section-header">
              <p className="nav-section-label">{group.section}</p>
            </div>
            {group.links.map((link) => (
              <button
                key={link.label}
                className={`nav-link${link.active ? " active" : ""}`}
                onClick={() => handleNavClick(link)} // Ajout du onClick pour naviguer
              >
                <Icon name={link.icon} />
                {link.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <a href="#" className="logout-link">
          <Icon name="logout" />
          <span>Déconnexion</span>
        </a>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">Utilisateurs</div>
        <div className="topbar-subtitle">Gestion des comptes</div>
      </div>
      <div className="topbar-right">
        <div className="topbar-divider" />
        <div className="topbar-user-info">
          <div className="topbar-avatar">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNsFO_HNcSPv6epbZnH6M3kqvSnGvWagVjrslmY_4wNIePUxE9MIeZfYL5FQZ8H-HqH0oy0f-Vu9uoNmAu4blWanXT9dLI2pY1kVFuPx5-Wpa0XEmjWhfjiNYD6SCS7VpDyjp49l7ZA0rr9sfhlW5qbDJmcOZ257ZGUjuaMLURgM-jCwg46pOPmG4E_32digBiqTpkUcXNQqGpRvsXFTpJNNBb5kgAnLSEpwPZeQSLQ3qvtzpm3_fboL3pUJ-H8S7aJfcjj_Kd-B3V"
              alt="Admin Avatar"
            />
          </div>
          <div className="topbar-user-meta">
            <div className="topbar-user-name">christian yankey</div>
            <div className="topbar-user-role">Administrateur</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PageHeader() {
  return (
    <section className="page-header">
      <div>
        <h2 className="page-title">Utilisateurs</h2>
        <nav className="breadcrumb">
          <a href="#">Administration</a>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Comptes Utilisateurs</span>
        </nav>
      </div>
      <div className="header-actions">
        <button className="btn-secondary">
          <Icon name="file_download" />
          Exporter CSV
        </button>
        <button className="btn-primary">
          <Icon name="person_add" />
          Nouvel utilisateur
        </button>
      </div>
    </section>
  );
}

function FiltersBar({ userCount }) {
  return (
    <div className="filters-bar">
      <div className="search-wrap">
        <div className="search-icon">
          <Icon name="search" />
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher par nom ou email..."
        />
      </div>
      <div className="filter-right">
        <select className="select-filter">
          <option>Tous les rôles</option>
          <option>Admin</option>
          <option>RH</option>
          <option>Enseignant</option>
        </select>
        <div className="count-badge">{userCount} COMPTE(S)</div>
      </div>
    </div>
  );
}

function UserTableRow({ user }) {
  return (
    <tr>
      {/* Name & Identity */}
      <td>
        <div className="user-cell">
          <div className={`user-avatar ${user.avatarClass}`}>{user.initials}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-id">ID: {user.id}</div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td>
        <span className="email-cell">{user.email}</span>
      </td>

      {/* Role */}
      <td>
        <span className={`role-badge ${user.roleClass}`}>{user.role}</span>
      </td>

      {/* Status */}
      <td>
        <span className="status-badge status-active">
          <span className="status-dot" />
          {user.status}
        </span>
      </td>

      {/* Last Activity */}
      <td>
        <span className="date-cell">{user.lastActivity}</span>
      </td>

      {/* Actions */}
      <td>
        <button className="action-btn">
          <Icon name="more_vert" />
        </button>
      </td>
    </tr>
  );
}

function UserTable({ users }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="table-card">
      {/* Tabs */}
      <div className="table-tabs">
        <div className="tabs-list">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`tab-btn${activeTab === i ? " tab-active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="filter-btn">
          <Icon name="filter_list" />
          Filtrer
        </button>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom &amp; Identité</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière activité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserTableRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <p className="pagination-info">
          Affichage de 1 à {users.length} sur {users.length} résultats
        </p>
        <div className="pagination-controls">
          <button className="page-nav-btn" disabled>
            <Icon name="chevron_left" />
          </button>
          <button className="page-num-btn active">1</button>
          <button className="page-nav-btn">
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function AuditLog() {
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <div className="audit-icon">
          <Icon name="security" />
        </div>
        <h3 className="audit-title">Journal d'audit récent</h3>
      </div>
      <ul className="audit-list">
        {AUDIT_ITEMS.map((item, i) => (
          <li key={i} className="audit-item">
            <div className={`audit-dot ${item.dotClass}`} />
            <div>
              <p className="audit-item-title">{item.title}</p>
              <p className="audit-item-time">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="audit-more-btn">
        Voir l'historique complet
        <Icon name="arrow_forward" />
      </button>
    </div>
  );
}

function InsightsCard() {
  return (
    <div className="insights-card">
      <div className="insights-card-bg" />
      <div className="insights-inner">
        <div className="insights-icon-wrap">
          <Icon name="insights" />
        </div>
        <h3 className="insights-title">Analyse de l'engagement</h3>
        <p className="insights-desc">
          Découvrez comment les utilisateurs interagissent avec les outils
          pédagogiques du portail.
        </p>
        <button className="btn-dark">Générer un rapport</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Utilisateurs() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopBar />

        <div className="page-content">
          <PageHeader />
          <FiltersBar userCount={USERS.length} />
          <UserTable users={USERS} />

          <div className="audit-grid">
            <AuditLog />
            <InsightsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
