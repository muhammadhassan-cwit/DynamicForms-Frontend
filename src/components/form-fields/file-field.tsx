'use client';

import { useState } from 'react';
import { FormField } from '@/types';
import { validateUpload, uploadFile } from '@/lib/form-service';
import FieldWrapper from './field-wrapper';

interface FileFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  formId: string;
  onUploadingChange: (isUploading: boolean) => void;
}

export default function FileField({ field, value, onChange, error, formId, onUploadingChange }: FileFieldProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const isImage = field.type === 'image';
  const acceptTypes = field.allowedTypes?.join(',') || (isImage ? 'image/*' : '*/*');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getMaxSizeDisplay = () => {
    const maxSize = field.maxSize || (isImage ? 5242880 : 10485760);
    return formatFileSize(maxSize);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setStatus('uploading');
    onUploadingChange(true);

    try {
      await validateUpload(formId, {
        fieldId: field.id,
        fileSize: file.size,
        mimeType: file.type,
      });

      const result = await uploadFile(formId, field.id, file);

      setFileName(result.originalName);
      onChange(result.filePath);
      setStatus('success');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
      setStatus('error');
      onChange('');
    } finally {
      onUploadingChange(false);
    }
  };

  const handleRemove = () => {
    setFileName('');
    onChange('');
    setStatus('idle');
    setUploadError('');
  };

  const getBackendUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    return apiUrl.replace('/api/v1', '');
  };

  return (
    <FieldWrapper field={field} error={error || uploadError}>
      <div className="mt-1">
        {status === 'idle' && !value && (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
              type="file"
              accept={acceptTypes}
              onChange={handleFileChange}
              className="hidden"
              id={`file-${field.id}`}
            />
            <label
              htmlFor={`file-${field.id}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="text-gray-400 text-4xl mb-2">
                {isImage ? '🖼️' : '📄'}
              </span>
              <span className="text-blue-500 hover:text-blue-600">
                Click to upload {isImage ? 'image' : 'file'}
              </span>
              <span className="text-gray-400 text-sm mt-1">
                Max size: {getMaxSizeDisplay()}
              </span>
            </label>
          </div>
        )}

        {status === 'uploading' && (
          <div className="border border-gray-300 rounded-md p-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-gray-600">Uploading...</span>
          </div>
        )}

        {(status === 'success' || value) && (
          <div className="border border-green-300 bg-green-50 rounded-md p-4">
            {isImage && value && (
              <img
                src={`${getBackendUrl()}${value}`}
                alt="Preview"
                className="max-h-40 rounded-md mb-2"
              />
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700 text-sm truncate max-w-xs">
                  {fileName || 'File uploaded'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {status === 'error' && !value && (
          <div className="border-2 border-dashed border-red-300 rounded-md p-4">
            <input
              type="file"
              accept={acceptTypes}
              onChange={handleFileChange}
              className="hidden"
              id={`file-${field.id}`}
            />
            <label
              htmlFor={`file-${field.id}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="text-red-400 text-4xl mb-2">⚠️</span>
              <span className="text-red-500">Upload failed. Click to try again</span>
            </label>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}