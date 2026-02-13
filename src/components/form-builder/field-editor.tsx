'use client';

import { useState, useRef, useEffect } from 'react';
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
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'file', label: 'File Upload' },
  { value: 'image', label: 'Image Upload' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'url', label: 'URL' },
  { value: 'rating', label: 'Rating' },
];

const fileSizeOptions = [
  { value: 1048576, label: '1 MB' },
  { value: 2097152, label: '2 MB' },
  { value: 5242880, label: '5 MB' },
  { value: 10485760, label: '10 MB' },
];

const imageTypeOptions = [
  { value: 'image/jpeg', label: 'JPG/JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/gif', label: 'GIF' },
  { value: 'image/webp', label: 'WEBP' },
];

const fileTypeOptions = [
  { value: 'application/pdf', label: 'PDF' },
  { value: 'application/msword', label: 'DOC' },
  { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'DOCX' },
  { value: 'application/vnd.ms-excel', label: 'XLS' },
  { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'XLSX' },
  { value: 'text/csv', label: 'CSV' },
  { value: 'text/plain', label: 'TXT' },
];

const typesWithPlaceholder = ['text', 'email', 'textarea', 'number', 'phone', 'url'];
const typesWithOptions = ['select', 'checkbox', 'radio'];
const typesWithFileConfig = ['file', 'image'];

export default function FieldEditor({ field, index, onUpdate, onRemove }: FieldEditorProps) {
  const [isTypesDropdownOpen, setIsTypesDropdownOpen] = useState(false);
  const [optionsText, setOptionsText] = useState<string>(field.options?.join(', ') || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTypesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdate(index, { ...field, [key]: value });
  };

  const handleOptionsChange = (value: string) => {
    setOptionsText(value);
  };

  const handleOptionsBlur = () => {
    const options = optionsText.split(',').map((opt) => opt.trim()).filter(Boolean);
    onUpdate(index, { ...field, options });
  };

  const handleAllowedTypeToggle = (mimeType: string) => {
    const currentTypes = field.allowedTypes || [];
    let newTypes: string[];

    if (currentTypes.includes(mimeType)) {
      newTypes = currentTypes.filter((t) => t !== mimeType);
    } else {
      newTypes = [...currentTypes, mimeType];
    }

    onUpdate(index, { ...field, allowedTypes: newTypes });
  };

  const handleRemoveType = (mimeType: string) => {
    const currentTypes = field.allowedTypes || [];
    const newTypes = currentTypes.filter((t) => t !== mimeType);
    onUpdate(index, { ...field, allowedTypes: newTypes });
  };

  const getAvailableFileTypes = () => {
    if (field.type === 'image') return imageTypeOptions;
    if (field.type === 'file') return fileTypeOptions;
    return [];
  };

  const getDefaultMaxSize = () => {
    if (field.type === 'image') return 5242880;
    return 10485760;
  };

  const getTypeLabel = (mimeType: string) => {
    const allTypes = [...imageTypeOptions, ...fileTypeOptions];
    return allTypes.find((t) => t.value === mimeType)?.label || mimeType;
  };

  const selectedCount = field.allowedTypes?.length || 0;

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

        {typesWithPlaceholder.includes(field.type) && (
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
        )}

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

      {typesWithOptions.includes(field.type) && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options (comma-separated) *
          </label>
          <input
            type="text"
            value={optionsText}
            onChange={(e) => handleOptionsChange(e.target.value)}
            onBlur={handleOptionsBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      {typesWithFileConfig.includes(field.type) && (
        <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {field.type === 'image' ? 'Image' : 'File'} Upload Settings
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Max File Size
              </label>
              <select
                value={field.maxSize || getDefaultMaxSize()}
                onChange={(e) => handleChange('maxSize', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fileSizeOptions.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Allowed Types
              </label>
              <button
                type="button"
                onClick={() => setIsTypesDropdownOpen(!isTypesDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
              >
                <span className={selectedCount > 0 ? 'text-gray-700' : 'text-gray-400'}>
                  {selectedCount > 0 ? `${selectedCount} type${selectedCount > 1 ? 's' : ''} selected` : 'Select types...'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isTypesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isTypesDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {getAvailableFileTypes().map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={field.allowedTypes?.includes(type.value) || false}
                        onChange={() => handleAllowedTypeToggle(type.value)}
                        className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Selected types as tags */}
              {selectedCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {field.allowedTypes?.map((mimeType) => (
                    <span
                      key={mimeType}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                    >
                      {getTypeLabel(mimeType)}
                      <button
                        type="button"
                        onClick={() => handleRemoveType(mimeType)}
                        className="hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}