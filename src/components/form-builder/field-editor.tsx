'use client';

import { FormField } from '@/types';

interface FieldEditorProps {
  field: FormField;
  index: number;
  onUpdate: (index: number, field: FormField) => void;
  onRemove: (index: number) => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
];

export default function FieldEditor({ field, index, onUpdate, onRemove }: FieldEditorProps) {
  const handleChange = (key: keyof FormField, value: any) => {
    onUpdate(index, { ...field, [key]: value });
  };

  const handleOptionsChange = (value: string) => {
    // Convert comma-separated string to array
    const options = value.split(',').map((opt) => opt.trim()).filter(Boolean);
    onUpdate(index, { ...field, options });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">Field {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Field Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fieldTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label *
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter field label"
          />
        </div>

        {/* Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter placeholder text"
          />
        </div>

        {/* Required */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${index}`}
            checked={field.required || false}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={`required-${index}`} className="ml-2 text-sm text-gray-700">
            Required field
          </label>
        </div>
      </div>

      {/* Options (only for select type) */}
      {field.type === 'select' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options (comma-separated) *
          </label>
          <input
            type="text"
            value={field.options?.join(', ') || ''}
            onChange={(e) => handleOptionsChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}
    </div>
  );
}