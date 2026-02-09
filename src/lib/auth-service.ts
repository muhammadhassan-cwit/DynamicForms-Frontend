import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', {
    email,
    password,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Login failed');
  }

  return response.data.data.user;
};
