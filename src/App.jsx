import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ReportIntake from './pages/ReportIntake';
import ReportView from './pages/ReportView';
import Marketplace from './pages/Marketplace';
import LegalPage from './pages/LegalPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<LegalPage kind="privacy" />} />
      <Route path="/terms" element={<LegalPage kind="terms" />} />
      <Route path="/grievance" element={<LegalPage kind="grievance" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports/new" element={<ReportIntake />} />
          <Route path="/reports/:id/edit" element={<ReportIntake />} />
          <Route path="/reports/:id" element={<ReportView />} />
        </Route>
      </Route>
    </Routes>
  );
}
