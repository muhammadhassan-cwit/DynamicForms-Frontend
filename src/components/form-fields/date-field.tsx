'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface DateFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function DateField({ field, value, onChange, error }: DateFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </FieldWrapper>
  );
}