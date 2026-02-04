import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface SubmissionListItem {
  submissionId: string;
  contact: {
    email: string;
    fullName: string | null;
  };
  status: string;
  submittedAt: string;
}

interface SubmissionDetail {
  submissionId: string;
  contact: {
    email: string;
    fullName: string | null;
  };
  responseData: Record<string, any>;
  status: string;
  submittedAt: string;
  form: {
    publicId: string;
    title: string;
    version: string;
  };
}

export const listSubmissions = async (formId: string): Promise<SubmissionListItem[]> => {
  const response = await api.get<ApiResponse<SubmissionListItem[]>>(
    `/forms/${formId}/submissions`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch submissions');
  }

  return response.data.data;
};

export const getSubmission = async (submissionId: string): Promise<SubmissionDetail> => {
  const response = await api.get<ApiResponse<SubmissionDetail>>(
    `/submissions/${submissionId}`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch submission');
  }

  return response.data.data;
};

export const deleteSubmission = async (submissionId: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(
    `/submissions/${submissionId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete submission');
  }
};