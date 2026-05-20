import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';

import Layout from './components/Layout/Layout';
import ProfessorLayout from './components/ProfessorLayout/ProfessorLayout';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Assignments from './pages/Assignments/Assignments';
import SubmitCode from './pages/Assignments/SubmitCode';
import Submissions from './pages/Submissions/Submissions';
import SubmissionDetail from './pages/Submissions/SubmissionDetail';
import Results from './pages/Results/Results';
import Audit from './pages/Results/Audit';
import LmsSync from './pages/LmsSync/LmsSync';
import Users from './pages/Users/Users';

import ProfessorDashboard from './pages/Professor/ProfessorDashboard';
import ProfessorAssignments from './pages/Professor/ProfessorAssignments';
import ProfessorAssignmentDetail from './pages/Professor/ProfessorAssignmentDetail';
import ProfessorAudit from './pages/Professor/ProfessorAudit';
import ProfessorLms from './pages/Professor/ProfessorLms';
import ProfessorGrading from './pages/Professor/ProfessorGrading';

import './index.css';

function StudentLayout({ children }) {
  return <Layout>{children}</Layout>;
}

function TeacherLayout({ children }) {
  return <ProfessorLayout>{children}</ProfessorLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas profesor */}
          <Route path="/professor" element={<TeacherLayout><ProfessorDashboard /></TeacherLayout>} />
          <Route path="/professor/assignments" element={<TeacherLayout><ProfessorAssignments /></TeacherLayout>} />
          <Route path="/professor/assignments/:id" element={<TeacherLayout><ProfessorAssignmentDetail /></TeacherLayout>} />
          <Route path="/professor/submissions/:id" element={<TeacherLayout><SubmissionDetail /></TeacherLayout>} />
          <Route path="/professor/audit" element={<TeacherLayout><ProfessorAudit /></TeacherLayout>} />
          <Route path="/professor/lms" element={<TeacherLayout><ProfessorLms /></TeacherLayout>} />
          <Route path="/professor/grading/:submissionId" element={<TeacherLayout><ProfessorGrading /></TeacherLayout>} />

          {/* Rutas estudiante */}
          <Route path="/dashboard" element={<StudentLayout><Dashboard /></StudentLayout>} />
          <Route path="/assignments" element={<StudentLayout><Assignments /></StudentLayout>} />
          <Route path="/assignments/:id/submit" element={<StudentLayout><SubmitCode /></StudentLayout>} />
          <Route path="/submissions" element={<StudentLayout><Submissions /></StudentLayout>} />
          <Route path="/submissions/:id" element={<StudentLayout><SubmissionDetail /></StudentLayout>} />
          <Route path="/results" element={<StudentLayout><Results /></StudentLayout>} />

          {/* Rutas admin */}
          <Route path="/audit" element={<StudentLayout><Audit /></StudentLayout>} />
          <Route path="/lms-sync" element={<StudentLayout><LmsSync /></StudentLayout>} />
          <Route path="/users" element={<StudentLayout><Users /></StudentLayout>} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}