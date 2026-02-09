'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface NumberFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function NumberField({ field, value, onChange, error }: NumberFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </FieldWrapper>
  );
}