import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { getUsers, createUser, updateUser, deleteUser } from '../api/auth';
import './UtilisateurPage.css';

/* ── Helpers ─────────────────────────────────────────────── */
function getInitials(fn, ln) { return `${(fn||'')[0]||''}${(ln||'')[0]||''}`.toUpperCase() || '?'; }
function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}

const ROLE_BADGE  = { admin: 'badge-danger', rh: 'badge-primary', enseignant: 'badge-success' };
const ROLE_LABEL  = { admin: 'Admin', rh: 'RH', enseignant: 'Enseignant' };
const ROLE_COLORS = ['#6366f1','#22c55e','#f59e0b','#38bdf8'];

/* ── Modal Nouvel Utilisateur ────────────────────────────── */
function UserModal({ user: editUser, onClose, onSaved }) {
  const isEdit = !!editUser;
  const [form, setForm] = useState({
    first_name: editUser?.first_name || '',
    last_name:  editUser?.last_name  || '',
    email:      editUser?.email      || '',
    password:   '',
    role:       editUser?.role       || 'enseignant',
    grade:      editUser?.grade      || 'assistant',
    status:     editUser?.status     || 'permanent',
    contractual_hours: editUser?.contractual_hours || 192,
  });
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (!isEdit && form.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    try {
      setSaving(true);
      if (isEdit) {
        const payload = { 
          first_name: form.first_name, 
          last_name: form.last_name, 
          email: form.email, 
          role: form.role,
          grade: form.grade,
          status: form.status,
          contractual_hours: parseFloat(form.contractual_hours)
        };
        await updateUser(editUser.id, payload);
        toast.success('Utilisateur mis à jour');
      } else {
        await createUser(form);
        toast.success('Utilisateur créé avec succès');
      }
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Prénom *</label>
              <input className="form-input" value={form.first_name}
                onChange={e => set('first_name', e.target.value)} placeholder="Jean" />
            </div>
            <div className="form-field">
              <label className="form-label">Nom *</label>
              <input className="form-input" value={form.last_name}
                onChange={e => set('last_name', e.target.value)} placeholder="Dupont" />
            </div>
          </div>

          <div className="form-field" style={{ marginTop: 14 }}>
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={form.email}
              onChange={e => set('email', e.target.value)} placeholder="jean.dupont@universite.ci" />
          </div>

          {!isEdit && (
            <div className="form-field" style={{ marginTop: 14 }}>
              <label className="form-label">Mot de passe *</label>
              <input className="form-input" type="password" value={form.password}
                onChange={e => set('password', e.target.value)} placeholder="Minimum 6 caractères" />
            </div>
          )}

          <div className="form-field" style={{ marginTop: 14 }}>
            <label className="form-label">Rôle *</label>
            <select className="form-select" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="enseignant">Enseignant</option>
              <option value="rh">Ressources Humaines (RH)</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {form.role === 'enseignant' && (
            <div className="form-grid-3" style={{ marginTop: 14 }}>
              <div className="form-field">
                <label className="form-label">Grade *</label>
                <select className="form-select" value={form.grade} onChange={e => set('grade', e.target.value)}>
                  <option value="assistant">Assistant</option>
                  <option value="maitre_assistant">Maître Assistant</option>
                  <option value="professeur">Professeur</option>
                  <option value="autres">Autres</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Statut *</label>
                <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="permanent">Permanent</option>
                  <option value="vacataire">Vacataire</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Quota (h ETD) *</label>
                <input className="form-input" type="number" value={form.contractual_hours} onChange={e => set('contractual_hours', e.target.value)} />
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? <><span className="material-symbols-outlined spin" style={{ fontSize: 16 }}>refresh</span> Enregistrement…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>{isEdit ? 'Mettre à jour' : 'Créer'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Confirm Delete ──────────────────────────────────────── */
function ConfirmModal({ user, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 className="modal-title">Désactiver le compte</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Voulez-vous désactiver le compte de <strong style={{ color: 'var(--text)' }}>
          {user.first_name} {user.last_name}</strong> ? Le compte sera désactivé mais les données seront conservées.
        </p>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_off</span>
            Désactiver
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function UtilisateurPage() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState('');
  const [showCreate, setCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [delUser, setDelUser]   = useState(null);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const LIMIT = 15;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUsers({ page, limit: LIMIT, role: roleFilter || undefined, search: search || undefined });
      setUsers(res.data.users || []);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      toast.error('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  /* Debounce search */
  const [debouncedSearch, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(debouncedSearch), 400);
    return () => clearTimeout(t);
  }, [debouncedSearch]);

  async function handleDelete() {
    try {
      await deleteUser(delUser.id);
      toast.success('Compte désactivé');
      setDelUser(null);
      loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la désactivation');
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  /* Stats */
  const countByRole = (r) => users.filter(u => u.role === r).length;

  return (
    <Layout title="Utilisateurs" subtitle="Gestion des comptes et des accès">
      {/* Stats row */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total comptes', val: total, icon: 'group', color: '#6366f1' },
          { label: 'Administrateurs', val: countByRole('admin'), icon: 'admin_panel_settings', color: '#ef4444' },
          { label: 'RH', val: countByRole('rh'), icon: 'badge', color: '#6366f1' },
          { label: 'Enseignants', val: countByRole('enseignant'), icon: 'school', color: '#22c55e' },
        ].map(k => (
          <div key={k.label} className="kpi-card animate-in">
            <div className="kpi-card__icon" style={{ background: `${k.color}20`, color: k.color }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{k.icon}</span>
            </div>
            <div className="kpi-card__label">{k.label}</div>
            <div className="kpi-card__value">{k.val}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div className="users-toolbar">
          <div className="topbar__search" style={{ maxWidth: 280 }}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Rechercher nom, email…"
              value={debouncedSearch}
              onChange={e => { setDebounced(e.target.value); setPage(1); }}
            />
          </div>

          <select
            className="form-select"
            style={{ width: 160 }}
            value={roleFilter}
            onChange={e => { setRole(e.target.value); setPage(1); }}
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="rh">RH</option>
            <option value="enseignant">Enseignants</option>
          </select>

          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-primary" onClick={() => setCreate(true)}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>
              Nouvel utilisateur
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({length: 6}).map((_,j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: j===0?'60%':'80%', borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <span className="material-symbols-outlined">group</span>
                      <h4>Aucun utilisateur trouvé</h4>
                      <p>Modifiez vos filtres ou créez un nouvel utilisateur.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="user-avatar-sm" style={{ background: `${ROLE_COLORS[u.id % ROLE_COLORS.length]}20`, color: ROLE_COLORS[u.id % ROLE_COLORS.length] }}>
                          {getInitials(u.first_name, u.last_name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{u.first_name} {u.last_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>#{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${ROLE_BADGE[u.role] || 'badge-neutral'}`}>
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                    </td>
                    <td>
                      {u.is_active
                        ? <span className="badge badge-success"><span className="dot dot-success" />Actif</span>
                        : <span className="badge badge-neutral"><span className="dot dot-neutral" />Inactif</span>
                      }
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(u.last_login)}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Modifier"
                          onClick={() => setEditUser(u)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                        </button>
                        {u.is_active && (
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            title="Désactiver"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => setDelUser(u)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_off</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="users-pagination">
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              {total} résultat(s) — page {page} / {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p}
                  className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
              <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <UserModal onClose={() => setCreate(false)} onSaved={() => { setCreate(false); loadUsers(); }} />
      )}
      {editUser && (
        <UserModal user={editUser} onClose={() => setEditUser(null)} onSaved={() => { setEditUser(null); loadUsers(); }} />
      )}
      {delUser && (
        <ConfirmModal user={delUser} onClose={() => setDelUser(null)} onConfirm={handleDelete} />
      )}
    </Layout>
  );
}
