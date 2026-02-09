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
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white transition-all duration-200"
      />
    </FieldWrapper>
  );
}
