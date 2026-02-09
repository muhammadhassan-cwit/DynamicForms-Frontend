export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: 'admin' | 'employee';
  companyId: string;
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