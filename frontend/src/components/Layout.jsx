import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './Layout.css';

/* ── Navigation config par rôle ─────────────────────────── */
const NAV_CONFIG = {
  admin: [
    {
      section: 'Principal',
      links: [
        { icon: 'dashboard',    label: 'Tableau de bord', path: '/dashboard' },
        { icon: 'schedule',     label: 'Saisie des heures', path: '/saisieheures' },
        { icon: 'rule_folder',  label: 'Validation', path: '/Validation' },
      ],
    },
    {
      section: 'Administration',
      links: [
        { icon: 'group',        label: 'Enseignants', path: '/academia' },
        { icon: 'account_tree', label: 'Gestion Académique', path: '/academia' },
        { icon: 'manage_accounts', label: 'Utilisateurs', path: '/utilisateur' },
      ],
    },
    {
      section: 'Rapports & Finance',
      links: [
        { icon: 'assessment',   label: 'Rapports & Exports', path: '/rapportexport' },
        { icon: 'payments',     label: 'État de paiement', path: '/paiement' },
        { icon: 'event_available', label: 'Clôture d\'année', path: '/cloture' },
      ],
    },
    {
      section: 'Système',
      links: [
        { icon: 'history',      label: 'Journal d\'audit', path: '/audit' },
        { icon: 'settings',     label: 'Paramètres', path: '/Settings' },
      ],
    },
  ],
  rh: [
    {
      section: 'Principal',
      links: [
        { icon: 'dashboard',   label: 'Tableau de bord', path: '/dashboard' },
        { icon: 'schedule',    label: 'Saisie des heures', path: '/saisieheures' },
        { icon: 'rule_folder', label: 'Validation', path: '/Validation' },
      ],
    },
    {
      section: 'Enseignants',
      links: [
        { icon: 'group',       label: 'Enseignants', path: '/academia' },
      ],
    },
    {
      section: 'Rapports',
      links: [
        { icon: 'assessment',  label: 'Rapports & Exports', path: '/rapportexport' },
        { icon: 'payments',    label: 'État de paiement', path: '/paiement' },
      ],
    },
  ],
  enseignant: [
    {
      section: 'Mon espace',
      links: [
        { icon: 'dashboard',  label: 'Mon tableau de bord', path: '/dashboard' },
        { icon: 'schedule',   label: 'Saisir mes heures', path: '/saisieheures' },
        { icon: 'rule_folder', label: 'Mes validations', path: '/Validation' },
      ],
    },
  ],
};

/* ── Role labels ─────────────────────────────────────────── */
const ROLE_LABELS = {
  admin: 'Administrateur',
  rh: 'Ressources Humaines',
  enseignant: 'Enseignant',
};

/* ── Initials helper ─────────────────────────────────────── */
function getInitials(first, last) {
  return `${(first || '')[0] || ''}${(last || '')[0] || ''}`.toUpperCase() || '?';
}

/* ── Layout ──────────────────────────────────────────────── */
export default function Layout({ children, title, subtitle }) {
  const { user, signout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navSections = NAV_CONFIG[user?.role] ?? NAV_CONFIG['enseignant'];
  const initials = getInitials(user?.first_name, user?.last_name);

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>school</span>
          </div>
          <div>
            <div className="sidebar__brand-name">GestHeures</div>
            <div className="sidebar__brand-sub">Enseignement Supérieur</div>
          </div>
        </div>

        {/* User profile */}
        <div style={{ padding: '10px 10px 0' }}>
          <div className="sidebar__profile">
            <div className="sidebar__avatar">{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div className="sidebar__user-name">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="sidebar__user-role">
                {ROLE_LABELS[user?.role] ?? user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {navSections.map((section) => (
            <div key={section.section} className="nav-section">
              <span className="nav-section-label">{section.section}</span>
              {section.links.map((link) => (
                <button
                  key={link.path + link.label}
                  className={`nav-link${location.pathname === link.path ? ' active' : ''}`}
                  onClick={() => navigate(link.path)}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer / Déconnexion */}
        <div className="sidebar__footer">
          <button className="nav-link" onClick={signout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            <div className="topbar__breadcrumb">
              <span className="topbar__breadcrumb-item">GestHeures</span>
              <span className="material-symbols-outlined topbar__breadcrumb-sep">chevron_right</span>
              <span className="topbar__breadcrumb-current">{title || 'Tableau de bord'}</span>
            </div>
          </div>

          <div className="topbar__right">
            <div className="topbar__icon-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="topbar__notif-dot" />
            </div>
            <div className="topbar__divider" />
            <div className="topbar__user">
              <div>
                <div className="topbar__user-name">{user?.first_name} {user?.last_name}</div>
                <div className="topbar__user-role">{ROLE_LABELS[user?.role] ?? user?.role}</div>
              </div>
              <div className="topbar__user-avatar">{initials}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-canvas">
          {(title || subtitle) && (
            <div className="page-header">
              <div>
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            key={location.pathname}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0d2137',
            border: '1px solid rgba(21, 101, 192, 0.18)',
            fontSize: '13px',
            boxShadow: '0 8px 24px rgba(13, 71, 161, 0.12)',
          },
          success: { iconTheme: { primary: '#1565c0', secondary: '#ffffff' } },
          error:   { iconTheme: { primary: '#c62828', secondary: '#ffffff' } },
        }}
      />
    </div>
  );
}
