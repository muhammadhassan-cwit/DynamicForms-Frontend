'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/types';
import { validateUpload, uploadFile } from '@/lib/form-service';
import FieldWrapper from './field-wrapper';
import { UploadCloudIcon, CheckCircleIcon, ExclamationCircleIcon, SpinnerIcon } from '@/components/icons';

interface FileFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  formId: string;
  onUploadingChange: (isUploading: boolean) => void;
}

const extensionColors: Record<string, { bg: string; text: string }> = {
  pdf: { bg: 'bg-red-100', text: 'text-red-700' },
  doc: { bg: 'bg-blue-100', text: 'text-blue-700' },
  docx: { bg: 'bg-blue-100', text: 'text-blue-700' },
  xls: { bg: 'bg-green-100', text: 'text-green-700' },
  xlsx: { bg: 'bg-green-100', text: 'text-green-700' },
  csv: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  txt: { bg: 'bg-gray-100', text: 'text-gray-700' },
  png: { bg: 'bg-purple-100', text: 'text-purple-700' },
  jpg: { bg: 'bg-orange-100', text: 'text-orange-700' },
  jpeg: { bg: 'bg-orange-100', text: 'text-orange-700' },
  gif: { bg: 'bg-pink-100', text: 'text-pink-700' },
  webp: { bg: 'bg-teal-100', text: 'text-teal-700' },
};

export default function FileField({ field, value, onChange, error, formId, onUploadingChange }: FileFieldProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const isImage = field.type === 'image';
  const acceptTypes = field.allowedTypes?.join(',') || (isImage ? 'image/*' : '*/*');

  // Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getMaxSizeDisplay = () => {
    const maxSize = field.maxSize || (isImage ? 5242880 : 10485760);
    return formatFileSize(maxSize);
  };

  const getExtension = (name: string) => {
    return name.split('.').pop()?.toLowerCase() || '';
  };

  const getExtensionColor = (ext: string) => {
    return extensionColors[ext] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setStatus('uploading');
    onUploadingChange(true);

    // Create local preview for images
    if (isImage) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }

    setFileName(file.name);
    setFileSize(file.size);

    try {
      await validateUpload(formId, {
        fieldId: field.id,
        fileSize: file.size,
        mimeType: file.type,
      });

      const result = await uploadFile(formId, field.id, file);

      onChange(result.filePath);
      setStatus('success');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
      setStatus('error');
      onChange('');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
    } finally {
      onUploadingChange(false);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    setFileName('');
    setFileSize(0);
    onChange('');
    setStatus('idle');
    setUploadError('');
  };

  const ext = getExtension(fileName);
  const extColor = getExtensionColor(ext);

  return (
    <FieldWrapper field={field} error={error || uploadError}>
      <div className="mt-1">
        {/* Idle State — Upload Area */}
        {status === 'idle' && !value && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-300 transition-colors duration-200">
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
              <UploadCloudIcon className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Click to upload {isImage ? 'image' : 'file'}
              </span>
              <span className="text-gray-400 text-xs mt-1">
                Max size: {getMaxSizeDisplay()}
              </span>
            </label>
          </div>
        )}

        {/* Uploading State */}
        {status === 'uploading' && (
          <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4">
            {isImage && previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 rounded-lg border border-gray-200 shadow-sm mb-3 opacity-60"
              />
            )}
            {!isImage && fileName && (
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${extColor.bg} flex items-center justify-center`}>
                  <span className={`text-xs font-bold uppercase ${extColor.text}`}>{ext}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 truncate">{fileName}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(fileSize)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <SpinnerIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          </div>
        )}

        {/* Success State — Image Preview */}
        {(status === 'success' || value) && isImage && (
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 rounded-lg border border-gray-200 shadow-sm mb-3"
              />
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm truncate">{fileName || 'Image uploaded'}</span>
                {fileSize > 0 && (
                  <span className="text-xs text-gray-400 flex-shrink-0">({formatFileSize(fileSize)})</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors flex-shrink-0 ml-2"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Success State — File Card (WhatsApp-style) */}
        {(status === 'success' || value) && !isImage && (
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${extColor.bg} flex items-center justify-center`}>
                <span className={`text-xs font-bold uppercase ${extColor.text}`}>{ext}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{fileName || 'File uploaded'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {fileSize > 0 && (
                    <span className="text-xs text-gray-400">{formatFileSize(fileSize)}</span>
                  )}
                  {ext && (
                    <span className={`text-xs font-medium uppercase px-1.5 py-0.5 rounded ${extColor.bg} ${extColor.text}`}>
                      {ext}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && !value && (
          <div className="border-2 border-dashed border-red-300 rounded-xl p-6 bg-red-50/30">
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
              <ExclamationCircleIcon className="w-10 h-10 text-red-400 mb-2" />
              <span className="text-sm font-medium text-red-600">Upload failed. Click to try again</span>
            </label>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}