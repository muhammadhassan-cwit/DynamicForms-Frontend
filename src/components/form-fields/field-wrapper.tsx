'use client';

import { FormField } from '@/types';

interface FieldWrapperProps {
  field: FormField;
  error?: string;
  children: React.ReactNode;
}

export default function FieldWrapper({ field, error, children }: FieldWrapperProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}