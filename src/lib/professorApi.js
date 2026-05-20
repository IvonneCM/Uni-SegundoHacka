const USE_MOCK = false;

const SUBMISSION_URL =
  import.meta.env.VITE_SUBMISSION_URL || "http://localhost:4004";

const token = () => localStorage.getItem("token") || "";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${SUBMISSION_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "x-token": token(),
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

export const professorApi = {
  getDashboard: async () => {
    const assignmentsData = await request("/assignments");
    const assignments = assignmentsData.assignments || [];

    let totalSubmissions = 0;
    let pendingSubmissions = 0;
    let gradedSubmissions = 0;

    for (const assignment of assignments) {
      const submissionsData = await request(
        `/submissions/assignment/${assignment.id}`
      );

      const submissions = submissionsData.submissions || [];

      totalSubmissions += submissions.length;

      pendingSubmissions += submissions.filter(
        (s) => s.status === "submitted" || s.status === "plagiarism_review"
      ).length;

      gradedSubmissions += submissions.filter(
        (s) => s.status === "graded"
      ).length;
    }

    return {
      totalAssignments: assignments.length,
      openAssignments: assignments.filter(
        (a) => new Date(a.deadline) > new Date()
      ).length,
      closedAssignments: assignments.filter(
        (a) => new Date(a.deadline) <= new Date()
      ).length,
      totalSubmissions,
      pendingSubmissions,
      gradedSubmissions,
      recentAssignments: assignments.slice(0, 5),
      recentSubmissions: [],
    };
  },

  getAssignments: async () => {
    const data = await request("/assignments");
    return data.assignments || [];
  },

  createAssignment: async (payload) => {
    return request("/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAssignmentSummary: async (assignmentId) => {
    const data = await request(`/assignments/${assignmentId}/summary`);

    return {
      ...data,
      criteria: data.criteria || [],
      test_cases: data.test_cases || [],
    };
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    const data = await request(`/submissions/assignment/${assignmentId}`);
    return data.submissions || [];
  },

  getSubmissionById: async (submissionId) => {
    const data = await request(`/submissions/${submissionId}`);
    return data.submission;
  },

  getSubmissionForGrading: async (submissionId) => {
    const data = await request(`/internal/grading/submission/${submissionId}`);
    return data.data;
  },

  getSubmissionsForPlagiarism: async (assignmentId) => {
    const data = await request(`/internal/plagiarism/assignment/${assignmentId}`);
    return data.submissions || [];
  },

  getSubmissionSummary: async (submissionId) => {
    const data = await request(`/internal/summary/submission/${submissionId}`);
    return data.summary;
  },

  updateSubmissionStatus: async (submissionId, status, userId) => {
    return request(`/submissions/${submissionId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        user_id: userId,
      }),
    });
  },
};