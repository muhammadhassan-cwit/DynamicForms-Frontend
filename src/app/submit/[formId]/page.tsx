'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublicForm, submitForm } from '@/lib/form-service';
import { Form } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-500">This form may not exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-6">Your response has been submitted successfully.</p>
          {submissionId && (
            <Link
              href={`/submit/result/${submissionId}?email=${encodeURIComponent(submittedEmail)}`}
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-t-lg shadow-md border-b">
          <h1 className="text-2xl font-bold text-gray-800">{form.title}</h1>
          {form.description && (
            <p className="text-gray-500 mt-2">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-lg shadow-md">
          <div className="space-y-6">
            {form.structureSchema.map((field) => (
              <div key={field.id}>{renderField(field)}</div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mt-6">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isAnyUploading}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : isAnyUploading ? 'Uploading...' : 'Submit'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Powered by DynamicForms
        </p>
      </div>
    </div>
  );
}