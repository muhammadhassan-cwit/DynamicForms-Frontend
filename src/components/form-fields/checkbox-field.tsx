'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface CheckboxFieldProps {
  field: FormField;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export default function CheckboxField({ field, value, onChange, error }: CheckboxFieldProps) {
  const selectedValues = value || [];

  const handleToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <FieldWrapper field={field} error={error}>
      <div className="space-y-2 mt-1">
        {field.options?.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedValues.includes(option)
                ? 'border-blue-300 bg-blue-50/50 text-blue-900'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-blue-50/30 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleToggle(option)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}
