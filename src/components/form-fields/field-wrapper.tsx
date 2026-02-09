'use client';

import { FormField } from '@/types';
import { ExclamationCircleIcon } from '@/components/icons';

interface FieldWrapperProps {
  field: FormField;
  error?: string;
  children: React.ReactNode;
}

export default function FieldWrapper({ field, error, children }: FieldWrapperProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5">
          <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
