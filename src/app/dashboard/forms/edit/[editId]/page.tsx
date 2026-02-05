'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FormField } from '@/types';
import { getForm, updateForm } from '@/lib/form-service';
import FieldEditor from '@/components/form-builder/field-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface FormData {
  title: string;
  description: string;
}

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.editId as string;

  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isMajorChange, setIsMajorChange] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Load current form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        const form = await getForm(formId);

        // Pre-fill form details
        setValue('title', form.title);
        setValue('description', form.description || '');

        // Pre-fill fields
        setFields(form.structureSchema);
        setCurrentVersion(form.version);
        setIsPublished(form.isPublished);
      } catch (err: any) {
        setLoadError(err.message || 'Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId, setValue]);

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updatedField: FormField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const validateFields = (): boolean => {
    if (fields.length === 0) {
      setError('Please add at least one field');
      return false;
    }

    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].label.trim()) {
        setError(`Field ${i + 1} must have a label`);
        return false;
      }
      if (fields[i].type === 'select' && (!fields[i].options || fields[i].options!.length === 0)) {
        setError(`Field ${i + 1} (Dropdown) must have at least one option`);
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (data: FormData, publishAction: boolean) => {
    setError(null);

    if (!validateFields()) return;

    setIsSubmitting(true);

    try {
      const updatedForm = await updateForm(formId, {
        title: data.title,
        description: data.description || undefined,
        structureSchema: fields,
        isPublished: publishAction,
        isMajorChange,
      });

      toast.success('Form updated successfully');
      router.push(`/dashboard/forms/${updatedForm.publicId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-24 w-full mb-3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Load Error State
  if (loadError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{loadError}</p>
        <Link
          href="/dashboard/forms"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to Forms
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Form</h1>
          <p className="text-sm text-gray-500 mt-1">
            Current version: v{currentVersion} •{' '}
            <span className={isPublished ? 'text-green-600' : 'text-yellow-600'}>
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </p>
        </div>
        <Link
          href="/dashboard/forms"
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>

      <form className="space-y-6">
        {/* Form Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter form title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter form description (optional)"
              />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Fields</h2>

          {fields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No fields. Click "Add Field" below to start.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  onUpdate={updateField}
                  onRemove={removeField}
                />
              ))}
            </div>
          )}

          {/* Add Field Button - At Bottom */}
          <button
            type="button"
            onClick={addField}
            className="mt-4 bg-blue-50 text-blue-600 px-4 py-3 rounded-md text-sm hover:bg-blue-100 border border-blue-200 border-dashed"
          >
            + Add Field
          </button>
        </div>

        {/* Version Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Version Settings</h2>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="majorChange"
              checked={isMajorChange}
              onChange={(e) => setIsMajorChange(e.target.checked)}
              className="h-4 w-4 mt-1 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <label htmlFor="majorChange" className="text-sm font-medium text-gray-700">
                This is a major change
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Check this if you added, removed, or changed field types.
                Leave unchecked for small edits like label or title changes.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isMajorChange
                  ? `Version will change: v${currentVersion} → v${Number(currentVersion.split('.')[0]) + 1}.0`
                  : `Version will change: v${currentVersion} → v${currentVersion.split('.')[0]}.${Number(currentVersion.split('.')[1]) + 1}`}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        )}

        {/* Action Buttons - Different for Draft vs Published */}
        <div className="flex gap-4 justify-end">
          {isPublished ? (
            <>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isSubmitting}
                className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-md hover:bg-yellow-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Unpublish'}
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={isSubmitting}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isSubmitting}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={isSubmitting}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Save & Publish'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}