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
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-y"
      />
    </FieldWrapper>
  );
}
