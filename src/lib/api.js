import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:4000/api';
const SUBMISSION_URL = import.meta.env.VITE_SUBMISSION_URL || 'http://localhost:4001/api';
const GRADING_URL = import.meta.env.VITE_GRADING_URL || 'http://localhost:4002/api';
const PLAGIARISM_URL = import.meta.env.VITE_PLAGIARISM_URL || 'http://localhost:4004/api';
const AUDIT_URL = import.meta.env.VITE_AUDIT_URL || 'http://localhost:4005/api';

const getToken = () => localStorage.getItem('token');

const withAuth = (config = {}) => ({
  ...config,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
    ...config.headers,
  },
});

const handleError = (err) => {
  const msg = err?.response?.data?.message || err?.response?.data?.msg || 'Error inesperado';
  throw new Error(msg);
};

// ─── Auth Service ────────────────────────────────────────────────────────────
const authApi = axios.create({ baseURL: AUTH_URL });

export const authService = {
  login: (email, password) =>
    authApi.post('/auth/login', { email, password }).then(r => r.data).catch(handleError),

  register: (data) =>
    authApi.post('/auth/register', data).then(r => r.data).catch(handleError),

  me: () =>
    authApi.get('/auth/me', withAuth()).then(r => r.data).catch(handleError),
};

// ─── Submission Service ──────────────────────────────────────────────────────
const submissionApi = axios.create({ baseURL: SUBMISSION_URL });

export const submissionService = {
  // Assignments
  getAssignments: () =>
    submissionApi.get('/assignments', withAuth()).then(r => r.data).catch(handleError),

  getAssignmentById: (id) =>
    submissionApi.get(`/assignments/${id}`, withAuth()).then(r => r.data).catch(handleError),

  createAssignment: (data) =>
    submissionApi.post('/assignments', data, withAuth()).then(r => r.data).catch(handleError),

  // Submissions — matches DB: assignment_id, student_id, source_code, language, attempt_number
  getSubmissions: (assignmentId) =>
    submissionApi.get(`/submissions?assignment_id=${assignmentId}`, withAuth()).then(r => r.data).catch(handleError),

  getMySubmissions: () =>
    submissionApi.get('/submissions/mine', withAuth()).then(r => r.data).catch(handleError),

  submitCode: ({ assignment_id, source_code, language }) =>
    submissionApi.post('/submissions', { assignment_id, source_code, language }, withAuth()).then(r => r.data).catch(handleError),

  getSubmissionById: (id) =>
    submissionApi.get(`/submissions/${id}`, withAuth()).then(r => r.data).catch(handleError),

  // Summary view (v_submission_summary) — returns all joined data
  getSubmissionSummary: (submissionId) =>
    submissionApi.get(`/submissions/${submissionId}/summary`, withAuth()).then(r => r.data).catch(handleError),
};

// ─── Grading Service ─────────────────────────────────────────────────────────
const gradingApi = axios.create({ baseURL: GRADING_URL });

export const gradingService = {
  // grading_results: final_score, execution_status, execution_output, execution_logs
  getResult: (submissionId) =>
    gradingApi.get(`/grading/${submissionId}`, withAuth()).then(r => r.data).catch(handleError),

  triggerGrading: (submissionId) =>
    gradingApi.post(`/grading/${submissionId}/grade`, {}, withAuth()).then(r => r.data).catch(handleError),

  // grading_criteria
  getCriteria: (assignmentId) =>
    gradingApi.get(`/criteria?assignment_id=${assignmentId}`, withAuth()).then(r => r.data).catch(handleError),

  // test_cases
  getTestCases: (assignmentId) =>
    gradingApi.get(`/test-cases?assignment_id=${assignmentId}`, withAuth()).then(r => r.data).catch(handleError),
};

// ─── Plagiarism Service ──────────────────────────────────────────────────────
const plagiarismApi = axios.create({ baseURL: PLAGIARISM_URL });

export const plagiarismService = {
  // plagiarism_reports: internal_similarity, external_similarity, result (low_risk|medium_risk|high_risk)
  getReport: (submissionId) =>
    plagiarismApi.get(`/plagiarism/${submissionId}`, withAuth()).then(r => r.data).catch(handleError),

  triggerCheck: (submissionId) =>
    plagiarismApi.post(`/plagiarism/${submissionId}/check`, {}, withAuth()).then(r => r.data).catch(handleError),
};

// ─── Audit Service ───────────────────────────────────────────────────────────
const auditApi = axios.create({ baseURL: AUDIT_URL });

export const auditService = {
  getLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return auditApi.get(`/audit-logs?${qs}`, withAuth()).then(r => r.data).catch(handleError);
  },

  getLmsSyncLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return auditApi.get(`/lms-sync?${qs}`, withAuth()).then(r => r.data).catch(handleError);
  },
};
