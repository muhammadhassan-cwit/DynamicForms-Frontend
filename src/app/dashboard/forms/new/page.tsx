'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FormField } from '@/types';
import { createForm } from '@/lib/form-service';
import FieldEditor from '@/components/form-builder/field-editor';

interface FormData {
  title: string;
  description: string;
}

export default function CreateFormPage() {
  const router = useRouter();
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

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

  const onSubmit = async (data: FormData, isPublished: boolean) => {
    setError(null);

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createForm({
        title: data.title,
        description: data.description || undefined,
        structureSchema: fields,
        isPublished,
      });

      router.push('/dashboard/forms');
    } catch (err: any) {
      setError(err.message || 'Failed to create form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Form</h1>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Form Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
            >
              + Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No fields added yet. Click "Add Field" to start building your form.
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
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
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}