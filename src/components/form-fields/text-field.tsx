'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface TextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function TextField({ field, value, onChange, error }: TextFieldProps) {
  const getInputType = () => {
    switch (field.type) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  };

  return (
    <FieldWrapper field={field} error={error}>
      <input
        type={getInputType()}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </FieldWrapper>
  );
}