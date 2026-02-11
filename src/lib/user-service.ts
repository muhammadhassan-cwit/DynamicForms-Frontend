import api from '@/lib/api';
import { ApiResponse, CompanyUser, DashboardStats } from '@/types';

export const getUsers = async (companyId: string): Promise<CompanyUser[]> => {
  const response = await api.get<ApiResponse<CompanyUser[]>>(`/companies/${companyId}/users`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch users');
  }

  return response.data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/users/${userId}`);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete user');
  }
};

export const getDashboardStats = async () => {
  const response = await api.get<ApiResponse<DashboardStats>>('/users/stats');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch dashboard stats');
  }

  return response.data.data;
};