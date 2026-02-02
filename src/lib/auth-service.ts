import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
    email,
    password,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Login failed');
  }

  return response.data.data;
};
