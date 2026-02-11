export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: 'admin' | 'employee' | 'superadmin';
  companyId?: string;
  isSuperAdmin?: boolean;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox' | 'radio' | 'file' | 'image' | 'phone' | 'url' | 'rating';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface Form {
  publicId: string;
  title: string;
  description: string | null;
  structureSchema: FormField[];
  version: string;
  isCurrent: boolean;
  isPublished: boolean;
  createdAt: string;
  company?: {
    name: string;
  };
}

export interface Submission {
  submissionId: string;
  responseData: Record<string, any>;
  status: string;
  submittedAt: string;
  contact: {
    email: string;
    fullName: string | null;
  };
  form?: {
    publicId: string;
    title: string;
    version: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UploadValidationRequest {
  fieldId: string;
  fileSize: number;
  mimeType: string;
}

export interface UploadValidationResponse {
  allowed: boolean;
  maxSize: number;
  allowedTypes: string[];
}

export interface UploadResponse {
  filePath: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface SuperAdminStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalForms: number;
  activeForms: number;
  totalRespondents: number;
  uniqueRespondents: number;
}

export interface CompanyUser {
  publicId: string;
  email: string;
  fullName?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CompanyDetail {
  publicId: string;
  name: string;
  domain: string;
  address?: string;
  timezone?: string;
  themeConfig?: Record<string, any>;
  settingsMetadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  users?: CompanyUser[];
  stats?: {
    totalForms: number;
    activeForms: number;
    totalRespondents: number;
    activeRespondents: number;
    uniqueRespondents: number;
  };
}