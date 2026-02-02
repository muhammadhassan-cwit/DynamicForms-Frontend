import api from '@/lib/api';
import { ApiResponse, Form, FormField } from '@/types';

export const getForms = async (): Promise<Form[]> => {
  const response = await api.get<ApiResponse<Form[]>>('/forms');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch forms');
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