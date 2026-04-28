import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Ajout des hooks pour la navigation
import "./SaisieHeures.css";


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
      { icon: "group", label: "Utilisateurs", path: "/utilisateur" },
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

const COURSES = [
  "Informatique Avancée (UE-INF201)",
  "Algorithmique & Graphes (UE-ALG105)",
  "Bases de données (UE-DB402)",
  "Systèmes d'exploitation (UE-SYS301)",
];

const GROUPS = [
  "Promotion entière",
  "Groupe A1",
  "Groupe A2",
  "Groupe B1",
];

const RECENT_ENTRIES = [
  {
    date: "25 Oct 2023",
    subject: "Algorithmique & Graphes",
    type: "TD",
    typeColor: "blue",
    duration: "1.5 h",
    status: "Validé",
    statusColor: "green",
  },
  {
    date: "24 Oct 2023",
    subject: "Bases de données",
    type: "TP",
    typeColor: "purple",
    duration: "2.0 h",
    status: "En attente",
    statusColor: "amber",
  },
];

const COEFFICIENTS = { CM: 1.5, TD: 1.0, TP: 0.66 };

export default function SaisieHeures() {
  const [hourType, setHourType] = useState("CM");
  const [duration, setDuration] = useState(2.0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const etd = (duration * COEFFICIENTS[hourType]).toFixed(1);
  const navigate = useNavigate(); // Hook pour naviguer
  const location = useLocation(); // Hook pour obtenir l'URL actuelle

  const handleNavClick = (link) => {
    if (link.path) {
      navigate(link.path); // Navigue vers le chemin spécifié
    }
    // Vous pouvez ajouter une logique pour les liens sans path si nécessaire
  };


  return (
    <div className="sh-layout">
      {/* Sidebar */}
      <aside className={`sh-sidebar ${sidebarOpen ? "sh-sidebar--open" : ""}`}>
        <div className="sh-sidebar__logo">
          <div className="sh-logo-icon">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h1 className="sh-logo-title">Academia</h1>
            <p className="sh-logo-sub">Academic Management</p>
          </div>
        </div>

        <nav className="sh-nav">
          {NAV_ITEMS.map((group) => (
            <div key={group.section} className="nav-section"> {/* Ajout de la classe CSS si nécessaire */}
              <div className="nav-section-header">
                <p className="nav-section-label">{group.section}</p>
              </div>
              {group.links.map((link) => (
                <button
                  key={link.label}
                  className={`sh-nav__item ${location.pathname === link.path ? "sh-nav__item--active" : ""}`}
                  onClick={() => handleNavClick(link)} // Ajout du onClick pour naviguer
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sh-sidebar__footer">
          <a href="#" className="sh-nav__item">
            <span className="material-symbols-outlined">settings</span>
            <span>Paramètres</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="sh-main-wrapper">
        {/* TopBar */}
        <header className="sh-topbar">
          <div className="sh-topbar__left">
            <button
              className="sh-icon-btn sh-topbar__menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="sh-search">
              <span className="material-symbols-outlined sh-search__icon">search</span>
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="sh-search__input"
              />
            </div>
          </div>

          <div className="sh-topbar__right">
            <button className="sh-icon-btn sh-notif-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="sh-notif-dot"></span>
            </button>
            <button className="sh-icon-btn">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="sh-divider"></div>
            <div className="sh-user">
              <div className="sh-user__info">
                <p className="sh-user__name">Dr. Jean Dupont</p>
                <p className="sh-user__role">Professeur Agrégé</p>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAG4ic0GNuNp_3drcSuXcjbZEzOmruyMStLTf6HIt5jZoPmGGnmplizQdQpEuQhz96qtYTA6ZIl-2ag2JWKYS9TaSNZ4yqcJZcm-RAuNmY54FEncd-G1sV_PFTwvzTIygem7PtWPEkzsxx0jYAl8wUg0g01I8zl6fnVcM_TBsr4tq8-hk9L-HCJGh51TFKxx4qgB1aJE3VM0FqfK43JbhbAimB7S4mroppBovV87kKO20_Lfjxd5VH42U_JN4WC9_GCBH7HVvsv36G"
                alt="User profile"
                className="sh-user__avatar"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="sh-content">
          {/* Breadcrumb + Title */}
          <div className="sh-page-header">
            <nav className="sh-breadcrumb">
              <span className="sh-breadcrumb__link">Tableau de bord</span>
              <span className="material-symbols-outlined sh-breadcrumb__chevron">chevron_right</span>
              <span className="sh-breadcrumb__current">Saisie des heures</span>
            </nav>
            <h2 className="sh-page-title">Nouvelle saisie d'heures</h2>
            <p className="sh-page-sub">Enregistrez vos heures d'enseignement pour validation académique.</p>
          </div>

          {/* Bento Grid */}
          <div className="sh-bento">
            {/* Form Card */}
            <div className="sh-card sh-card--form">
              <div className="sh-card__header">
                <h3 className="sh-card__title">
                  <span className="material-symbols-outlined sh-card__title-icon">edit_note</span>
                  Informations de la séance
                </h3>
              </div>

              <div className="sh-form-body">
                {/* Date + Subject */}
                <div className="sh-form-row sh-form-row--2col">
                  <div className="sh-field">
                    <label className="sh-label">Date de la séance</label>
                    <div className="sh-input-wrap">
                      <span className="material-symbols-outlined sh-input-icon">calendar_today</span>
                      <input
                        type="date"
                        defaultValue="2023-10-27"
                        className="sh-input sh-input--icon"
                      />
                    </div>
                  </div>

                  <div className="sh-field">
                    <label className="sh-label">Unité d'Enseignement (UE)</label>
                    <select className="sh-select">
                      {COURSES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type + Duration + Group */}
                <div className="sh-form-row sh-form-row--3col">
                  <div className="sh-field">
                    <label className="sh-label">Type d'heure</label>
                    <div className="sh-toggle">
                      {["CM", "TD", "TP"].map((t) => (
                        <button
                          key={t}
                          className={`sh-toggle__btn ${hourType === t ? "sh-toggle__btn--active" : ""}`}
                          onClick={() => setHourType(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sh-field">
                    <label className="sh-label">Durée réelle (h)</label>
                    <div className="sh-input-wrap sh-input-wrap--suffix">
                      <input
                        type="number"
                        step="0.5"
                        value={duration}
                        onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                        className="sh-input"
                      />
                      <span className="sh-input-suffix">heures</span>
                    </div>
                  </div>

                  <div className="sh-field">
                    <label className="sh-label">Groupe</label>
                    <select className="sh-select">
                      {GROUPS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div className="sh-field">
                  <label className="sh-label">Commentaires / Contenu du cours</label>
                  <textarea
                    className="sh-textarea"
                    rows={3}
                    placeholder="Décrivez brièvement le contenu de la séance..."
                  />
                </div>

                {/* Actions */}
                <div className="sh-form-actions">
                  <button className="sh-btn sh-btn--ghost">Annuler</button>
                  <button className="sh-btn sh-btn--primary">
                    <span className="material-symbols-outlined">save</span>
                    Enregistrer la séance
                  </button>
                </div>
              </div>
            </div>

            {/* Side Column */}
            <div className="sh-side-col">
              {/* ETD Card */}
              <div className="sh-etd-card">
                <div className="sh-etd-card__bg-circle"></div>
                <p className="sh-etd-card__eyebrow">Calcul d'Équivalence</p>

                <div className="sh-etd-card__row">
                  <div>
                    <p className="sh-etd-card__sub">Total Saisi</p>
                    <p className="sh-etd-card__value">
                      {duration.toFixed(1)} <span className="sh-etd-card__unit">h {hourType}</span>
                    </p>
                  </div>
                  <span className="material-symbols-outlined sh-etd-card__icon">calculate</span>
                </div>

                <div className="sh-etd-card__divider"></div>

                <div className="sh-etd-card__row">
                  <div>
                    <p className="sh-etd-card__sub">Équivalence ETD</p>
                    <p className="sh-etd-card__value">
                      {etd} <span className="sh-etd-card__unit">h TD</span>
                    </p>
                  </div>
                  <div className="sh-etd-card__coeff">
                    <p>x {COEFFICIENTS[hourType]}</p>
                  </div>
                </div>
              </div>

              {/* Service Card */}
              <div className="sh-card sh-card--service">
                <h4 className="sh-service__title">Votre Service</h4>
                <div className="sh-service__rows">
                  <div className="sh-service__row">
                    <span className="sh-service__label">Service prévisionnel</span>
                    <span className="sh-service__val">192.0 h</span>
                  </div>
                  <div className="sh-service__row">
                    <span className="sh-service__label">Heures validées</span>
                    <span className="sh-service__val sh-service__val--green">145.5 h</span>
                  </div>
                  <div className="sh-service__row">
                    <span className="sh-service__label sh-service__label--primary">Cette saisie</span>
                    <span className="sh-service__val sh-service__val--primary">+ {etd} h</span>
                  </div>
                </div>

                <div className="sh-progress-wrap">
                  <div className="sh-progress-meta">
                    <span className="sh-progress-meta__label">Progression</span>
                    <span className="sh-progress-meta__value">77%</span>
                  </div>
                  <div className="sh-progress-bar">
                    <div className="sh-progress-bar__fill" style={{ width: "77%" }}></div>
                  </div>
                </div>
              </div>

              {/* Alert */}
              <div className="sh-alert">
                <span className="material-symbols-outlined sh-alert__icon">info</span>
                <p className="sh-alert__text">
                  <strong>Note :</strong> Les heures de TP sont converties avec un coefficient de 2/3 (0.66) pour le calcul ETD.
                </p>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="sh-history">
            <div className="sh-history__header">
              <h3 className="sh-history__title">Dernières saisies</h3>
              <button className="sh-history__link">Voir tout l'historique</button>
            </div>

            <div className="sh-table-wrap">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Matière</th>
                    <th>Type</th>
                    <th className="sh-table__th--right">Durée (ETD)</th>
                    <th className="sh-table__th--center">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ENTRIES.map((entry, i) => (
                    <tr key={i} className="sh-table__row">
                      <td className="sh-table__date">{entry.date}</td>
                      <td className="sh-table__subject">{entry.subject}</td>
                      <td>
                        <span className={`sh-badge sh-badge--${entry.typeColor}`}>{entry.type}</span>
                      </td>
                      <td className="sh-table__duration">{entry.duration}</td>
                      <td className="sh-table__status">
                        <span className={`sh-pill sh-pill--${entry.statusColor}`}>{entry.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}