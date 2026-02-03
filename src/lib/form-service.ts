import api from '@/lib/api';
import { ApiResponse, Form, FormField } from '@/types';

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
  body: { email: string, fullName?: string; responseData: Record<string, any>}
): Promise<void> => {
  const response = await api.post<ApiResponse<null>>(
    `/public/forms/${formId}/submit`,
    body
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to submit form');
  }
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
