import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RapportExport from './pages/RapportExport';
import UtilisateurPage from './pages/UtilisateurPage';
import SaisieHeures from './pages/SaisieHeures';
import Academia from './pages/Academia';
import Settings from './pages/Settings';
import Validation from './pages/Validation';
import AuditLogPage from './pages/AuditLogPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import AcademicYearClosePage from './pages/AcademicYearClosePage';

/* ── Route protégée générique ────────────────────────────── */
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* ── Route publique (redirige si déjà connecté) ─────────── */
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />

        {/* Toutes les rôles connectés */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/saisieheures" element={
          <ProtectedRoute><SaisieHeures /></ProtectedRoute>
        } />
        <Route path="/Validation" element={
          <ProtectedRoute><Validation /></ProtectedRoute>
        } />

        {/* Admin + RH */}
        <Route path="/academia" element={
          <ProtectedRoute allowedRoles={['admin', 'rh']}>
            <Academia />
          </ProtectedRoute>
        } />
        <Route path="/rapportexport" element={
          <ProtectedRoute allowedRoles={['admin', 'rh']}>
            <RapportExport />
          </ProtectedRoute>
        } />
        <Route path="/paiement" element={
          <ProtectedRoute allowedRoles={['admin', 'rh']}>
            <PaymentStatusPage />
          </ProtectedRoute>
        } />

        {/* Admin uniquement */}
        <Route path="/utilisateur" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UtilisateurPage />
          </ProtectedRoute>
        } />
        <Route path="/Settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/audit" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AuditLogPage />
          </ProtectedRoute>
        } />
        <Route path="/cloture" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AcademicYearClosePage />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;