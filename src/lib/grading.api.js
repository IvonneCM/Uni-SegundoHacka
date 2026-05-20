import axios from 'axios';

const gradingApi = axios.create({
  baseURL: import.meta.env.VITE_GRADING_API_URL || 'http://localhost:4002',
});

export const gradeSubmissionApi = async (submissionId) => {
  const response = await gradingApi.post(`/grading/${submissionId}`);
  return response.data;
};

export const getGradingBySubmissionApi = async (submissionId) => {
  const response = await gradingApi.get(`/grading/submission/${submissionId}`);
  return response.data;
};

export const getAllGradingResultsApi = async () => {
  const response = await gradingApi.get('/grading/results/all');
  return response.data;
};

export const reviewGradingApi = async (gradingResultId, data) => {
  const response = await gradingApi.patch(
    `/grading/${gradingResultId}/review`,
    data
  );

  return response.data;
};

export default gradingApi;