import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../API/auth';
import './LoginPage.css';

/* ─── Shared logo/header ─────────────────────────────────── */
function AuthHeader() {
  return (
    <div className="auth-header">
      <div className="auth-logo">
        <span>🎓</span>
      </div>
      <h1 className="auth-title">Gestion des Heures</h1>
      <p className="auth-subtitle">Système de gestion des heures d'enseignement</p>
    </div>
  );
}

/* ─── Login form ─────────────────────────────────────────── */
function LoginForm() {
  const { signin } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await signin(email, password);
      toast.success(`Bienvenue, ${user.first_name} !`);
      const from = location.state?.from?.pathname;
      const hasDeepLink = from && from !== '/login' && from !== '/';
      const dest = hasDeepLink ? from : '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Identifiants incorrects ou erreur serveur';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="login-email">Adresse email</label>
        <input
          id="login-email"
          type="email"
          className={`form-control${errors.email ? ' error' : ''}`}
          placeholder="vous@gmail.com"
          {...register('email', {
            required: "L'email est requis",
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' },
          })}
        />
        {errors.email && <div className="form-error">⚠ {errors.email.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">Mot de passe</label>
        <div className="password-input-wrapper">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            className={`form-control${errors.password ? ' error' : ''}`}
            placeholder="••••••••"
            {...register('password', { required: 'Le mot de passe est requis' })}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <div className="form-error">⚠ {errors.password.message}</div>}
      </div>

      {errorMsg && (
        <div className="auth-alert auth-alert-danger">
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        id="login-submit"
        type="submit"
        className="btn btn-primary btn-lg w-full auth-btn"
        disabled={loading}
      >
        
        {loading ? 'Connexion en cours…' : 'Se connecter'}
      </button>
    </form>
  );
}

/* ─── Register form ──────────────────────────────────────── */
function RegisterForm() {
  const { setSessionFromAuthResponse } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  {/* Icônes SVG à ajouter en haut du fichier, avant les composants */}

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      grade: 'assistant',
      status: 'permanent',
    },
  });
  const password = watch('password');

  const onSubmit = async ({ first_name, last_name, email, password, grade, status }) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiRegister({ first_name, last_name, email, password, grade, status });
      const { token, user } = res.data;
      setSessionFromAuthResponse(token, user);
      toast.success(`Compte créé ! Bienvenue, ${first_name} 🎉`);
      navigate('/hours', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Erreur lors de l'inscription";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row cols-2">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-firstname">Prénom</label>
          <input
            id="reg-firstname"
            type="text"
            className={`form-control${errors.first_name ? ' error' : ''}`}
            placeholder="Ange"
            {...register('first_name', { required: 'Prénom requis' })}
          />
          {errors.first_name && <div className="form-error">⚠ {errors.first_name.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-lastname">Nom</label>
          <input
            id="reg-lastname"
            type="text"
            className={`form-control${errors.last_name ? ' error' : ''}`}
            placeholder="Yankey"
            {...register('last_name', { required: 'Nom requis' })}
          />
          {errors.last_name && <div className="form-error">⚠ {errors.last_name.message}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">Adresse email</label>
        <input
          id="reg-email"
          type="email"
          className={`form-control${errors.email ? ' error' : ''}`}
          placeholder="nwolle14@gmail.com"
          {...register('email', {
            required: "L'email est requis",
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' },
          })}
        />
        {errors.email && <div className="form-error">⚠ {errors.email.message}</div>}
      </div>

      <div className="form-row cols-2">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-grade">Grade</label>
          <select
            id="reg-grade"
            className={`form-control${errors.grade ? ' error' : ''}`}
            {...register('grade', { required: 'Requis' })}
          >
            <option value="assistant">Assistant</option>
            <option value="maitre_assistant">Maître assistant</option>
            <option value="professeur">Professeur</option>
            <option value="maitre_conferences">Maître de Conférences</option>
          </select>
          {errors.grade && <div className="form-error">⚠ {errors.grade.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-status">Statut</label>
          <select
            id="reg-status"
            className={`form-control${errors.status ? ' error' : ''}`}
            {...register('status', { required: 'Requis' })}
          >
            <option value="permanent">Permanent</option>
            <option value="vacataire">Vacataire</option>
            <option value="autre">Autre</option>
          </select>
          {errors.status && <div className="form-error">⚠ {errors.status.message}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-password">Mot de passe</label>
        <div className="password-input-wrapper">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            className={`form-control${errors.password ? ' error' : ''}`}
            placeholder="Min. 8 caractères"
            {...register('password', {
              required: 'Mot de passe requis',
              minLength: { value: 8, message: 'Min. 8 caractères' },
            })}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <div className="form-error">⚠ {errors.password.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-confirm">Confirmer le mot de passe</label>
        <div className="password-input-wrapper">
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            className={`form-control${errors.confirm ? ' error' : ''}`}
            placeholder="Répétez le mot de passe"
            {...register('confirm', {
              required: 'Confirmation requise',
              validate: (v) => v === password || 'Les mots de passe ne correspondent pas',
            })}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowConfirm(!showConfirm)}
            title={showConfirm ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirm && <div className="form-error">⚠ {errors.confirm.message}</div>}
      </div>

      {errorMsg && (
        <div className="auth-alert auth-alert-danger">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="auth-info-box">
        Le compte créé est un compte <strong>Enseignant</strong> avec votre grade et statut. Pour un rôle administrateur ou RH, contactez l'administration.
      </div>

      <button
        id="register-submit"
        type="submit"
        className="btn btn-primary btn-lg w-full auth-btn"
        disabled={loading}
      >
        {loading ? 'Inscription en cours…' : 'Créer mon compte'}
      </button>
    </form>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function LoginPage() {
  const [tab, setTab] = useState('login');

  return (
    <div className="auth-page">
      {/* Decorative blobs */}
      <div className="auth-blob auth-blob-top" />
      <div className="auth-blob auth-blob-bottom" />

      <div className="auth-card">
        <AuthHeader />

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => setTab('login')}
            type="button"
          >
             Connexion
          </button>
          <button
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => setTab('register')}
            type="button"
          >
           Inscription
          </button>
        </div>

        <div className="auth-form-body">
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>

      <p className="auth-footer-note">
        © {new Date().getFullYear()} GestionHeures &mdash; Enseignement Supérieur
      </p>
    </div>
  );
}
