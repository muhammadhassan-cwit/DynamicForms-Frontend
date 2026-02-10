import api from '@/lib/api';
import { ApiResponse, SuperAdminStats, CompanyDetail, CompanyUser } from '@/types';

export const getStats = async (): Promise<SuperAdminStats> => {
  const response = await api.get<ApiResponse<SuperAdminStats>>('/super-admin/stats');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch stats');
  }

  return response.data.data;
};

export const getCompanies = async (): Promise<CompanyDetail[]> => {
  const response = await api.get<ApiResponse<CompanyDetail[]>>('/super-admin/companies');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch companies');
  }

  return response.data.data;
};

export const getCompany = async (companyId: string): Promise<CompanyDetail> => {
  const response = await api.get<ApiResponse<CompanyDetail>>(`/super-admin/companies/${companyId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch company');
  }

  return response.data.data;
};

interface CreateCompanyData {
  name: string;
  domain: string;
  address?: string;
  timezone?: string;
  isActive?: boolean;
  themeConfig?: Record<string, any>;
  settingsMetadata?: Record<string, any>;
}

export const createCompany = async (data: CreateCompanyData): Promise<CompanyDetail> => {
  const response = await api.post<ApiResponse<CompanyDetail>>('/super-admin/companies', data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to create company');
  }

  return response.data.data;
};

interface UpdateCompanyData {
  name?: string;
  domain?: string;
  address?: string;
  timezone?: string;
  isActive?: boolean;
  themeConfig?: Record<string, any>;
  settingsMetadata?: Record<string, any>;
}

export const updateCompany = async (companyId: string, data: UpdateCompanyData): Promise<CompanyDetail> => {
  const response = await api.patch<ApiResponse<CompanyDetail>>(`/super-admin/companies/${companyId}`, data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update company');
  }

  return response.data.data;
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/super-admin/companies/${companyId}`);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete company');
  }
};

export const getCompanyUsers = async (companyId: string): Promise<CompanyUser[]> => {
  const response = await api.get<ApiResponse<CompanyUser[]>>(`/super-admin/companies/${companyId}/users`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch company users');
  }

  return response.data.data;
};

export const deleteCompanyUser = async (companyId: string, userId: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/super-admin/companies/${companyId}/users/${userId}`);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete user');
  }
};

interface CreateCompanyUserData {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}

export const createCompanyUser = async (companyId: string, data: CreateCompanyUserData): Promise<CompanyUser> => {
  const response = await api.post<ApiResponse<CompanyUser>>(`/super-admin/companies/${companyId}/users`, data);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to create user');
  }

  return response.data.data;
};
