import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RapportExport from './pages/RapportExport'
import UtilisateurPage from './pages/UtilisateurPage'
import SaisieHeures from './pages/SaisieHeures'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rapportexport" element={<RapportExport />} />
        <Route path="/utilisateur" element={<UtilisateurPage />} />
        <Route path="/saisieheures" element={<SaisieHeures />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App