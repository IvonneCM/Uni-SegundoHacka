const USE_MOCK = false;

const SUBMISSION_URL =
  import.meta.env.VITE_SUBMISSION_URL || "http://localhost:4004";

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};

const mockAssignments = [
  {
    id: "ae42280c-cc8e-49ee-bd8e-a84b8e9d65c1",
    title: "Ejercicio de ciclos",
    description: "Resolver usando estructuras repetitivas.",
    language: "javascript",
    deadline: "2026-05-19T23:59",
    professor_name: "Maria Profesora",
  },
];

const mockSubmissions = [
  {
    id: "sub-001",
    assignment_id: "ae42280c-cc8e-49ee-bd8e-a84b8e9d65c1",
    student_name: "Juan Estudiante",
    student_email: "student@test.com",
    language: "javascript",
    attempt_number: 1,
    status: "submitted",
    submitted_at: "2026-05-19T19:10",
  },
];

export const professorApi = {
  getDashboard: async () => {
    if (USE_MOCK) {
      return {
        totalAssignments: 4,
        openAssignments: 3,
        closedAssignments: 1,
        totalSubmissions: 12,
        pendingSubmissions: 5,
        gradedSubmissions: 7,
        recentAssignments: mockAssignments,
        recentSubmissions: mockSubmissions,
      };
    }

    const data = await request(`${SUBMISSION_URL}/assignments`);

    return {
      totalAssignments: data.assignments.length,
      openAssignments: data.assignments.length,
      closedAssignments: 0,
      totalSubmissions: 0,
      pendingSubmissions: 0,
      gradedSubmissions: 0,
      recentAssignments: data.assignments,
      recentSubmissions: [],
    };
  },

  getAssignments: async () => {
    if (USE_MOCK) return mockAssignments;

    const data = await request(`${SUBMISSION_URL}/assignments`);
    return data.assignments;
  },

  createAssignment: async (payload) => {
    if (USE_MOCK) {
      return {
        ok: true,
      };
    }

    return request(`${SUBMISSION_URL}/assignments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAssignmentSummary: async (assignmentId) => {
    if (USE_MOCK) {
      return {
        assignment: {
          ...mockAssignments[0],
          assignment_status: "open",
        },
        stats: {
          total_submissions: 12,
          total_students: 6,
          max_attempts: 4,
          last_submission_at: "2026-05-19T19:10",
        },
      };
    }

    return request(`${SUBMISSION_URL}/assignments/${assignmentId}/summary`);
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    if (USE_MOCK) {
      return mockSubmissions;
    }

    const data = await request(
      `${SUBMISSION_URL}/submissions/assignment/${assignmentId}`
    );

    return data.submissions;
  },
  getSubmissionsByStudent: async (studentId) => {
  if (USE_MOCK) {
    return mockSubmissions;
  }

  const data = await request(
    `${SUBMISSION_URL}/submissions/student/${studentId}`
  );

  return data.submissions || data;
},

getSubmissionById: async (submissionId) => {
  if (USE_MOCK) {
    return mockSubmissions.find((item) => item.id === submissionId);
  }

  const data = await request(
    `${SUBMISSION_URL}/submissions/${submissionId}`
  );

  return data.submission || data;
},
};