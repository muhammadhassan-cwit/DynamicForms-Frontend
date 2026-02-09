'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface TextareaFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function TextareaField({ field, value, onChange, error }: TextareaFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </FieldWrapper>
  );
}