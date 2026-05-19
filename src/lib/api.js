import axios from 'axios';

const USE_MOCK = true; // CAMBIA ESTO a false cuando tengas backend

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
  login: async (email, password) => {
    if (USE_MOCK) {
      return {
        token: "fake-jwt",
        user: { id: 1, name: "Ivonne", role: "student" }
      };
    }
    return authApi.post('/auth/login', { email, password }).then(r => r.data).catch(handleError);
  },

  register: async (data) => {
    if (USE_MOCK) return { success: true };
    return authApi.post('/auth/register', data).then(r => r.data).catch(handleError);
  },

  me: async () => {
    if (USE_MOCK) {
      return { id: 1, name: "Ivonne", role: "student" };
    }
    return authApi.get('/auth/me', withAuth()).then(r => r.data).catch(handleError);
  },
};

// ─── Submission Service ──────────────────────────────────────────────────────
const submissionApi = axios.create({ baseURL: SUBMISSION_URL });

export const submissionService = {
  getAssignments: async () => {
    if (USE_MOCK) {
      return [
        { id: 1, title: "Sorting Algorithm", due_date: "2026-06-01" },
        { id: 2, title: "Binary Tree", due_date: "2026-06-05" },
      ];
    }
    return submissionApi.get('/assignments', withAuth()).then(r => r.data).catch(handleError);
  },

  getAssignmentById: async (id) => {
    if (USE_MOCK) {
      return { id, title: "Sorting Algorithm", description: "Implement quicksort" };
    }
    return submissionApi.get(`/assignments/${id}`, withAuth()).then(r => r.data).catch(handleError);
  },

  createAssignment: async (data) => {
    if (USE_MOCK) return { ...data, id: Math.random() };
    return submissionApi.post('/assignments', data, withAuth()).then(r => r.data).catch(handleError);
  },

  getSubmissions: async (assignmentId) => {
    if (USE_MOCK) {
      return [
        { id: 1, student: "Ivonne", grade: 85, plagiarism: 10 },
        { id: 2, student: "Carlos", grade: 92, plagiarism: 5 },
      ];
    }
    return submissionApi.get(`/submissions?assignment_id=${assignmentId}`, withAuth()).then(r => r.data).catch(handleError);
  },

  getMySubmissions: async () => {
    if (USE_MOCK) {
      return [
        { id: 1, assignment: "Sorting Algorithm", grade: 85 },
      ];
    }
    return submissionApi.get('/submissions/mine', withAuth()).then(r => r.data).catch(handleError);
  },

  submitCode: async ({ assignment_id, source_code, language }) => {
    if (USE_MOCK) {
      return { id: 99, assignment_id, source_code, language };
    }
    return submissionApi.post('/submissions', { assignment_id, source_code, language }, withAuth()).then(r => r.data).catch(handleError);
  },

  getSubmissionById: async (id) => {
    if (USE_MOCK) {
      return { id, assignment: "Sorting Algorithm", grade: 85 };
    }
    return submissionApi.get(`/submissions/${id}`, withAuth()).then(r => r.data).catch(handleError);
  },

  getSubmissionSummary: async (submissionId) => {
    if (USE_MOCK) {
      return {
        id: submissionId,
        student: "Ivonne",
        assignment: "Sorting Algorithm",
        grade: 85,
        plagiarism: 12,
        feedback: "Buen trabajo, pero optimiza"
      };
    }
    return submissionApi.get(`/submissions/${submissionId}/summary`, withAuth()).then(r => r.data).catch(handleError);
  },
};

// ─── Grading Service ─────────────────────────────────────────────────────────
const gradingApi = axios.create({ baseURL: GRADING_URL });

export const gradingService = {
  getResult: async (submissionId) => {
    if (USE_MOCK) {
      return {
        final_score: 85,
        execution_status: "success",
        execution_output: "OK",
        execution_logs: "All tests passed"
      };
    }
    return gradingApi.get(`/grading/${submissionId}`, withAuth()).then(r => r.data).catch(handleError);
  },

  triggerGrading: async () => {
    if (USE_MOCK) return { status: "queued" };
    return gradingApi.post(`/grading`, {}, withAuth()).then(r => r.data).catch(handleError);
  },

  getCriteria: async () => {
    if (USE_MOCK) {
      return [{ id: 1, name: "Correctness", weight: 70 }];
    }
    return gradingApi.get(`/criteria`, withAuth()).then(r => r.data).catch(handleError);
  },

  getTestCases: async () => {
    if (USE_MOCK) {
      return [{ id: 1, input: "1 2", expected: "2" }];
    }
    return gradingApi.get(`/test-cases`, withAuth()).then(r => r.data).catch(handleError);
  },
};

// ─── Plagiarism Service ──────────────────────────────────────────────────────
const plagiarismApi = axios.create({ baseURL: PLAGIARISM_URL });

export const plagiarismService = {
  getReport: async (submissionId) => {
    if (USE_MOCK) {
      return {
        internal_similarity: 10,
        external_similarity: 5,
        result: "low_risk"
      };
    }
    return plagiarismApi.get(`/plagiarism/${submissionId}`, withAuth()).then(r => r.data).catch(handleError);
  },

  triggerCheck: async () => {
    if (USE_MOCK) return { status: "checking" };
    return plagiarismApi.post(`/plagiarism`, {}, withAuth()).then(r => r.data).catch(handleError);
  },
};

// ─── Audit Service ───────────────────────────────────────────────────────────
const auditApi = axios.create({ baseURL: AUDIT_URL });

export const auditService = {
  getLogs: async () => {
    if (USE_MOCK) {
      return [
        { id: 1, action: "LOGIN", user: "Ivonne" },
        { id: 2, action: "SUBMIT", user: "Ivonne" },
      ];
    }
    return auditApi.get(`/audit-logs`, withAuth()).then(r => r.data).catch(handleError);
  },

  getLmsSyncLogs: async () => {
    if (USE_MOCK) {
      return [{ id: 1, status: "success" }];
    }
    return auditApi.get(`/lms-sync`, withAuth()).then(r => r.data).catch(handleError);
  },
};