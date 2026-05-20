import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Assignments from './pages/Assignments/Assignments';
import SubmitCode from './pages/Assignments/SubmitCode';
import Submissions from './pages/Submissions/Submissions';
import SubmissionDetail from './pages/Submissions/SubmissionDetail';
import Results from './pages/Results/Results';
import Audit from './pages/Results/Audit';
import LmsSync from './pages/LmsSync';
import Users from './pages/Users';
import './index.css';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, color: '#64748b' }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          <Route path="/assignments" element={
            <PrivateRoute><Assignments /></PrivateRoute>
          } />
          <Route path="/assignments/:id/submit" element={
            <PrivateRoute roles={['student']}><SubmitCode /></PrivateRoute>
          } />

          <Route path="/submissions" element={
            <PrivateRoute><Submissions /></PrivateRoute>
          } />
          <Route path="/submissions/:id" element={
            <PrivateRoute><SubmissionDetail /></PrivateRoute>
          } />

          <Route path="/results" element={
            <PrivateRoute roles={['professor', 'admin']}><Results /></PrivateRoute>
          } />

          <Route path="/audit" element={
            <PrivateRoute roles={['admin']}><Audit /></PrivateRoute>
          } />

          <Route path="/lms-sync" element={<LmsSync />} />
          <Route path="/users" element={<Users />} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
