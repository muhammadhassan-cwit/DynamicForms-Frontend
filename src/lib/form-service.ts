import api from '@/lib/api';
import {
  ApiResponse,
  Form,
  FormField,
  UploadValidationRequest,
  UploadValidationResponse,
  UploadResponse,
} from '@/types';

export const getForms = async (): Promise<Form[]> => {
  const response = await api.get<ApiResponse<Form[]>>('/forms');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch forms');
  }

  return response.data.data;
};

export const getForm = async (formId: string): Promise<Form> => {
  const response = await api.get<ApiResponse<Form>>(`/forms/${formId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch form');
  }

  return response.data.data;
};

export const getPublicForm = async (formId: string): Promise<Form> => {
  const response = await api.get<ApiResponse<Form>>(`/public/forms/${formId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch form');
  }

  return response.data.data;
};

export const submitForm = async (
  formId: string,
  body: { email: string; fullName?: string; responseData: Record<string, any> }
): Promise<string> => {
  const response = await api.post<ApiResponse<{ submissionId: string }>>(
    `/public/forms/${formId}/submit`,
    body
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to submit form');
  }

  return response.data.data.submissionId;
};

export const getPublicSubmission = async (
  submissionId: string,
  email: string
): Promise<any> => {
  const response = await api.get<ApiResponse<any>>(
    `/public/submissions/${submissionId}?email=${encodeURIComponent(email)}`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch submission');
  }

  return response.data.data;
};

export const deleteForm = async (formId: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/forms/${formId}`);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete form');
  }
};

interface CreateFormData {
  title: string;
  description?: string;
  structureSchema: FormField[];
  isPublished: boolean;
}

export const createForm = async (data: CreateFormData): Promise<Form> => {
  const response = await api.post<ApiResponse<Form>>('/forms', data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to create form');
  }

  return response.data.data;
};

interface UpdateFormData {
  title?: string;
  description?: string;
  structureSchema?: FormField[];
  isPublished?: boolean;
  isMajorChange?: boolean;
}

export const updateForm = async (
  formId: string,
  data: UpdateFormData
): Promise<Form> => {
  const response = await api.patch<ApiResponse<Form>>(`/forms/${formId}`, data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update form');
  }

  return response.data.data;
};

export const validateUpload = async (
  formId: string,
  data: UploadValidationRequest
): Promise<UploadValidationResponse> => {
  const response = await api.post<ApiResponse<UploadValidationResponse>>(
    `/public/forms/${formId}/validate-upload`,
    data
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'File validation failed');
  }

  return response.data.data;
};

export const uploadFile = async (
  formId: string,
  fieldId: string,
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('fieldId', fieldId);
  formData.append('file', file);

  const response = await api.post<ApiResponse<UploadResponse>>(
    `/public/forms/${formId}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'File upload failed');
  }

  return response.data.data;
};