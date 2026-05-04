import { useState } from "react";
import "./Settings.css";

/* ── Static data ───────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: "dashboard",       label: "Tableau de bord" },
  { icon: "pending_actions", label: "Saisie des heures" },
  { icon: "history",         label: "Historique" },
  { icon: "group",           label: "Enseignants" },
  { icon: "school",          label: "Gestion Académique" },
  { icon: "ios_share",       label: "Rapports & Exports" },
  { icon: "settings",        label: "Paramètres", active: true },
];

const INITIAL_RATES = [
  { id: 1, grade: "Professeur Titulaire",   cm: "75.00", td: "55.00" },
  { id: 2, grade: "Maître de Conférences",  cm: "62.50", td: "48.00" },
  { id: 3, grade: "Chargé d'Enseignement",  cm: "45.00", td: "38.50" },
];

const AUDIT_ENTRIES = [
  {
    id: 1,
    dot: "blue",
    text: <><strong>Mise à jour des taux horaires</strong> par Aris Veldon</>,
    time: "Aujourd'hui à 09:45",
    tag: "CONFIG",
  },
  {
    id: 2,
    dot: "green",
    text: <><strong>Nouvelle année académique active</strong> : 2024 – 2025</>,
    time: "Hier à 16:20",
    tag: "SYSTÈME",
  },
];

/* ── Icon helper ───────────────────────────────────────── */
function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

/* ── Toggle switch ─────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="toggle__track">
        <div className="toggle__thumb" />
      </div>
    </label>
  );
}

/* ── Sidebar ───────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <Icon name="school" />
        </div>
        <div>
          <p className="sidebar__brand-name">Academia</p>
          <p className="sidebar__brand-sub">Academic Management</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ icon, label, active }) => (
          <button
            key={label}
            className={`nav-item${active ? " nav-item--active" : ""}`}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__user">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGOHmYD2OeugbkM02aLT5rMJcaXQWfiNAV6BjvCYQKnvOpAfiYhIgCzmGFbPJYI5RWWvhmHdsdVKRnbgn3M7SNxIPWlnO4OIwjvkdKamZVvkKhYUNS3t3LtWR4naPfGo7NQ-yl4Obw_wA9CqzRbQt-uNGqq68Qd7JptxEIM1y7bb5kElX_i2NhA_2RL0aUTU5e4T9F-l3OpZMFYMEktn1Oj88L2BVmDkoK8uTtiFDtatQNeI92uMvqhz5A2WG4drQnoZMVgWuaZsD-"
          alt="User profile"
        />
        <div style={{ overflow: "hidden" }}>
          <p className="sidebar__user-name">Dr. Aris Veldon</p>
          <p className="sidebar__user-role">Administrateur</p>
        </div>
      </div>
    </aside>
  );
}

/* ── Top bar ───────────────────────────────────────────── */
function TopBar() {
  return (
    <header className="topbar">
      <span className="topbar__title">Paramètres Système</span>
      <div className="topbar__right">
        <div className="topbar__search">
          <Icon name="search" />
          <input type="text" placeholder="Rechercher un paramètre..." />
        </div>
        <button className="icon-btn">
          <Icon name="notifications" />
          <span className="notification-dot" />
        </button>
        <button className="icon-btn">
          <Icon name="help_outline" />
        </button>
      </div>
    </header>
  );
}

/* ── Academic year section ─────────────────────────────── */
function AcademicYearSection() {
  return (
    <section>
      <div className="section-header">
        <div>
          <h2 className="section-title">Configuration de l'exercice</h2>
          <p className="section-subtitle">
            Définissez la période active pour la gestion académique.
          </p>
        </div>
        <div className="year-widget">
          <div className="year-widget__icon">
            <Icon name="calendar_today" />
          </div>
          <div>
            <label className="year-widget__label">Année académique actuelle</label>
            <select className="year-widget__select" defaultValue="2024 - 2025">
              <option>2023 - 2024</option>
              <option>2024 - 2025</option>
              <option>2025 - 2026</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Hourly rates card ─────────────────────────────────── */
function RatesCard() {
  const [rates, setRates] = useState(INITIAL_RATES);

  const update = (id, field, value) =>
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Taux Horaires par Grade</span>
        <button className="btn-link-add">
          <Icon name="add" />
          Ajouter un grade
        </button>
      </div>

      <div className="rates-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Cours Magistral (CM)</th>
              <th>Travaux Dirigés (TD)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((row) => (
              <tr key={row.id}>
                <td className="td-grade">{row.grade}</td>
                <td>
                  <div className="rate-input-wrap">
                    <input
                      className="rate-input"
                      type="text"
                      value={row.cm}
                      onChange={(e) => update(row.id, "cm", e.target.value)}
                    />
                    <span className="rate-unit">€/h</span>
                  </div>
                </td>
                <td>
                  <div className="rate-input-wrap">
                    <input
                      className="rate-input"
                      type="text"
                      value={row.td}
                      onChange={(e) => update(row.id, "td", e.target.value)}
                    />
                    <span className="rate-unit">€/h</span>
                  </div>
                </td>
                <td>
                  <button className="action-btn">
                    <Icon name="more_vert" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card__footer">
        <button className="btn btn--ghost">Annuler</button>
        <button className="btn btn--primary">Enregistrer les taux</button>
      </div>
    </div>
  );
}

/* ── Notification preferences card ────────────────────── */
const NOTIF_ITEMS = [
  {
    id: "reminders",
    title: "Rappels de saisie des heures",
    desc: "Alerter les enseignants 48h avant la fin de période.",
    default: true,
  },
  {
    id: "validation",
    title: "Validation des rapports",
    desc: "Envoyer une notification lors de l'approbation d'un rapport.",
    default: true,
  },
  {
    id: "budget",
    title: "Alertes de seuil budgétaire",
    desc: "Notifier la direction quand 80% du budget est consommé.",
    default: false,
  },
];

function NotificationsCard() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(NOTIF_ITEMS.map((n) => [n.id, n.default]))
  );

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">
          <Icon name="notifications_active" />
          Préférences de Notification
        </span>
      </div>

      <div className="notif-list">
        {NOTIF_ITEMS.map(({ id, title, desc }) => (
          <div key={id} className="notif-item">
            <div>
              <p className="notif-item__title">{title}</p>
              <p className="notif-item__desc">{desc}</p>
            </div>
            <Toggle
              checked={prefs[id]}
              onChange={() =>
                setPrefs((prev) => ({ ...prev, [id]: !prev[id] }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Profile card ──────────────────────────────────────── */
function ProfileCard() {
  const [form, setForm] = useState({
    name: "Aris Veldon",
    dept: "Faculté des Sciences Humaines",
    lang: "fr",
  });

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="profile-card">
      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
        <div className="profile-card__avatar-wrap">
          <img
            className="profile-card__avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCYlU3lRDhNXOaefzV83LMKzr9gHqEzgW99v0UxFudn3gAYM7S-_NUP2NiCJ0d-IJuF9exUBM83nuHH-fJ1hLahriz3uJ_zR_J9OjV_GyhhhB8aRRRVa6mt9Q8DeOCplKv9XiuCcjpQ4V1q4a9A-5OWzjdjgK2fClxUQhoq3OlR8owUYpLTwEWHNlwoCuqyqdyGi9aoyVkckgJaP4ihHhBaToIQvvslUZ4MOc1QeUnE_5KEfgFVkPrZnQoVzufZqCDh0imgCA5Umvh"
            alt="User profile"
          />
          <button className="profile-card__camera-btn">
            <Icon name="photo_camera" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="profile-card__info">
        <h3 className="profile-card__name">Dr. Aris Veldon</h3>
        <p className="profile-card__email">aris.veldon@academia.edu</p>
        <span className="badge-admin">Administrateur Senior</span>
      </div>

      {/* Form */}
      <div className="profile-form">
        <div className="form-group">
          <label className="form-label">Nom complet</label>
          <input
            className="form-input"
            type="text"
            value={form.name}
            onChange={set("name")}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Département</label>
          <input
            className="form-input"
            type="text"
            value={form.dept}
            onChange={set("dept")}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Langue de l'interface</label>
          <select
            className="form-select"
            value={form.lang}
            onChange={set("lang")}
          >
            <option value="fr">Français (France)</option>
            <option value="en">English (UK)</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn--primary btn--full">
            Sauvegarder le profil
          </button>
          <button className="btn btn--outline btn--full">
            Changer le mot de passe
          </button>
        </div>
      </div>

      {/* Session info */}
      <div className="session-info">
        <div className="session-row">
          <span>Dernière connexion</span>
          <span>Il y a 2 heures</span>
        </div>
        <div className="session-row">
          <span>IP de session</span>
          <span>192.168.1.42</span>
        </div>
        <button className="btn btn--danger" style={{ marginTop: "1.5rem" }}>
          <Icon name="logout" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

/* ── Audit log section ─────────────────────────────────── */
function AuditSection() {
  return (
    <div className="audit-section">
      <div className="audit-section__header">
        <h3 className="audit-section__title">Journal d'audit</h3>
        <a className="audit-section__link" href="#">
          Voir tout l'historique
        </a>
      </div>
      <div className="audit-list">
        {AUDIT_ENTRIES.map(({ id, dot, text, time, tag }) => (
          <div key={id} className="audit-item">
            <div className={`audit-dot audit-dot--${dot}`} />
            <div className="audit-text">
              <p>{text}</p>
              <p className="audit-time">{time}</p>
            </div>
            <span className="audit-tag">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FAB ───────────────────────────────────────────────── */
function FAB() {
  return (
    <button className="fab">
      <Icon name="save" />
      <span className="fab__tooltip">Tout enregistrer</span>
    </button>
  );
}

/* ── Root component ────────────────────────────────────── */
export default function AcademiaSettings() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <TopBar />

        <div className="canvas">
          <AcademicYearSection />

          <div className="settings-grid">
            {/* Left column */}
            <div className="settings-grid__left">
              <RatesCard />
              <NotificationsCard />
            </div>

            {/* Right column */}
            <div className="settings-grid__right">
              <ProfileCard />
            </div>
          </div>

          <AuditSection />
        </div>
      </div>

      <FAB />
    </div>
  );
}
