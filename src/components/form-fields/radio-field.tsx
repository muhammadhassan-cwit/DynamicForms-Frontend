'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface RadioFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function RadioField({ field, value, onChange, error }: RadioFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <div className="space-y-2 mt-1">
        {field.options?.map((option) => (
          <label key={option} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={field.id}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}