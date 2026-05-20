const SUBMISSION_URL =
  import.meta.env.VITE_SUBMISSION_URL || "http://localhost:4004";

const GRADING_URL =
  import.meta.env.VITE_GRADING_URL || "http://localhost:4002";

const token = () => localStorage.getItem("token") || "";

const request = async (baseUrl, endpoint, options = {}) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "x-token": token(),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};

const safeNumber = (value) => Number(value || 0);

export const professorApi = {
  getDashboard: async () => {
    const assignmentsData = await request(SUBMISSION_URL, "/assignments");
    const assignments = assignmentsData.assignments || [];

    let totalSubmissions = 0;
    let pendingSubmissions = 0;
    let gradedSubmissions = 0;
    let rejectedSubmissions = 0;

    for (const assignment of assignments) {
      const submissionsData = await request(
        SUBMISSION_URL,
        `/submissions/assignment/${assignment.id}`
      );

      const submissions = submissionsData.submissions || [];

      totalSubmissions += submissions.length;
      pendingSubmissions += submissions.filter(
        (s) => s.status === "submitted" || s.status === "plagiarism_review"
      ).length;
      gradedSubmissions += submissions.filter((s) => s.status === "graded").length;
      rejectedSubmissions += submissions.filter((s) => s.status === "rejected").length;
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
      rejectedSubmissions,
      recentAssignments: assignments.slice(0, 5),
    };
  },

  getAssignments: async () => {
    const data = await request(SUBMISSION_URL, "/assignments");
    return data.assignments || [];
  },

  createAssignment: async (payload) => {
    return request(SUBMISSION_URL, "/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAssignmentSummary: async (assignmentId) => {
    const data = await request(
      SUBMISSION_URL,
      `/assignments/${assignmentId}/summary`
    );

    return {
      assignment: data.assignment,
      stats: {
        total_submissions: safeNumber(data.stats?.total_submissions),
        total_students: safeNumber(data.stats?.total_students),
        max_attempts: safeNumber(data.stats?.max_attempts),
        last_submission_at: data.stats?.last_submission_at || null,
      },
      submissions_by_status: data.submissions_by_status || [],
      criteria: data.criteria || [],
      test_cases: data.test_cases || [],
    };
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    const data = await request(
      SUBMISSION_URL,
      `/submissions/assignment/${assignmentId}`
    );

    return data.submissions || [];
  },

  getSubmissionById: async (submissionId) => {
    const data = await request(SUBMISSION_URL, `/submissions/${submissionId}`);
    return data.submission;
  },

  getSubmissionForGrading: async (submissionId) => {
    const data = await request(
      SUBMISSION_URL,
      `/internal/grading/submission/${submissionId}`
    );

    return data.data;
  },

  getSubmissionSummary: async (submissionId) => {
    const data = await request(
      SUBMISSION_URL,
      `/internal/summary/submission/${submissionId}`
    );

    return data.summary;
  },

  getSubmissionsForPlagiarism: async (assignmentId) => {
    const data = await request(
      SUBMISSION_URL,
      `/internal/plagiarism/assignment/${assignmentId}`
    );

    return data.submissions || [];
  },

  updateSubmissionStatus: async (submissionId, status, userId) => {
    return request(SUBMISSION_URL, `/submissions/${submissionId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        user_id: userId,
      }),
    });
  },

  gradeSubmission: async (submissionId) => {
    const data = await request(GRADING_URL, `/grading/${submissionId}`, {
      method: "POST",
    });

    return data.result || data.grading || data;
  },

  getGradingBySubmission: async (submissionId) => {
    return request(GRADING_URL, `/grading/submission/${submissionId}`);
  },

  getAllGradingResults: async () => {
    return request(GRADING_URL, "/grading/results/all");
  },
    updateGradeManually: async (submissionId, payload) => {
    const data = await request(GRADING_URL, `/grading/${submissionId}/manual`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return data.result;
  },

  getStudentAttemptsWithGrades: async (assignmentId, studentId) => {
    const data = await request(
      GRADING_URL,
      `/grading/attempts/${assignmentId}/${studentId}`
    );

    return data.attempts || [];
  },
};
