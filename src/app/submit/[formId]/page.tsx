'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublicForm, submitForm } from '@/lib/form-service';
import { Form } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ExclamationCircleIcon, CheckCircleIcon, SpinnerIcon } from '@/components/icons';
import {
  TextField,
  TextareaField,
  NumberField,
  DateField,
  SelectField,
  CheckboxField,
  RadioField,
  RatingField,
  FileField,
} from '@/components/form-fields/form-fields';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicForm(formId);
        setForm(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    if (validationErrors[fieldId]) {
      setValidationErrors({ ...validationErrors, [fieldId]: '' });
    }
  };

  const handleUploadingChange = (fieldId: string, isUploading: boolean) => {
    setUploadingFields({ ...uploadingFields, [fieldId]: isUploading });
  };

  const isAnyUploading = Object.values(uploadingFields).some((v) => v);

  const validate = (): boolean => {
    if (!form) return false;

    const errors: Record<string, string> = {};

    form.structureSchema.forEach((field) => {
      const value = formData[field.id];

      if (field.required) {
        if (field.type === 'checkbox') {
          if (!value || !Array.isArray(value) || value.length === 0) {
            errors[field.id] = `${field.label} is required`;
          }
        } else if (field.type === 'file' || field.type === 'image') {
          if (!value || value.toString().trim() === '') {
            errors[field.id] = `${field.label} is required`;
          }
        } else if (field.type === 'rating') {
          if (!value || value === 0) {
            errors[field.id] = `${field.label} is required`;
          }
        } else {
          if (!value || value.toString().trim() === '') {
            errors[field.id] = `${field.label} is required`;
          }
        }
      }

      if (value) {
        if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
          errors[field.id] = 'Please enter a valid email';
        }

        if (field.type === 'phone' && !/^[+]?[\d\s\-()]{7,}$/.test(value)) {
          errors[field.id] = 'Please enter a valid phone number';
        }

        if (field.type === 'url' && !/^https?:\/\/.+\..+/.test(value)) {
          errors[field.id] = 'Please enter a valid URL (starting with http:// or https://)';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;
    if (!form) return;

    setIsSubmitting(true);

    try {
      const emailField = form.structureSchema.find((f) => f.type === 'email');
      const email = emailField ? formData[emailField.id] : '';

      const nameField = form.structureSchema.find(
        (f) => f.type === 'text' && f.label.toLowerCase().includes('name')
      );
      const fullName = nameField ? formData[nameField.id] : '';

      const responseData: Record<string, any> = {};
      form.structureSchema.forEach((field) => {
        responseData[field.label] = formData[field.id] || '';
      });

      const id = await submitForm(formId, {
        email,
        fullName,
        responseData,
      });

      setSubmissionId(id);
      setSubmittedEmail(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.id];
    const fieldError = validationErrors[field.id];
    const onChange = (val: any) => handleInputChange(field.id, val);

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <TextField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'number':
        return (
          <NumberField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'date':
        return (
          <DateField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'select':
        return (
          <SelectField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            field={field}
            value={value || []}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'radio':
        return (
          <RadioField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'rating':
        return (
          <RatingField
            field={field}
            value={value || 0}
            onChange={onChange}
            error={fieldError}
          />
        );

      case 'file':
      case 'image':
        return (
          <FileField
            field={field}
            value={value || ''}
            onChange={onChange}
            error={fieldError}
            formId={formId}
            onUploadingChange={(isUploading) => handleUploadingChange(field.id, isUploading)}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 font-medium text-lg mb-2">Form Unavailable</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
            <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-8">Your response has been submitted successfully.</p>
          {submissionId && (
            <Link
              href={`/submit/result/${submissionId}?email=${encodeURIComponent(submittedEmail)}`}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              View Your Submission
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-6 sm:p-8 rounded-t-2xl shadow-sm border border-gray-100 border-b-0 border-l-4 border-l-blue-600">
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="text-gray-500 mt-2 text-sm">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-b-2xl shadow-sm border border-gray-100 border-t-0">
          <div className="space-y-6">
            {form.structureSchema.map((field) => (
              <div key={field.id}>{renderField(field)}</div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mt-6">
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isAnyUploading}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon className="w-4 h-4" />
                Submitting...
              </>
            ) : isAnyUploading ? (
              <>
                <SpinnerIcon className="w-4 h-4" />
                Uploading...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by DynamicForms
        </p>
      </div>
    </div>
  );
}
