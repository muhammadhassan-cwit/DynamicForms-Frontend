'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublicForm, submitForm } from '@/lib/form-service';
import { Form } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

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

  const validate = (): boolean => {
    if (!form) return false;

    const errors: Record<string, string> = {};

    form.structureSchema.forEach((field) => {
      const value = formData[field.id];

      if (field.required && (!value || value.toString().trim() === '')) {
        errors[field.id] = `${field.label} is required`;
      }

      if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
        errors[field.id] = 'Please enter a valid email';
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

  // Loading State
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

  // Error State
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

  // Success State
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

  // Form View
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Form Header */}
        <div className="bg-white p-8 rounded-t-lg shadow-md border-b">
          <h1 className="text-2xl font-bold text-gray-800">{form.title}</h1>
          {form.description && (
            <p className="text-gray-500 mt-2">{form.description}</p>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-lg shadow-md">
          <div className="space-y-6">
            {form.structureSchema.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {/* Text Input */}
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Email Input */}
                {field.type === 'email' && (
                  <input
                    type="email"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Number Input */}
                {field.type === 'number' && (
                  <input
                    type="number"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Date Input */}
                {field.type === 'date' && (
                  <input
                    type="date"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Textarea */}
                {field.type === 'textarea' && (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Select Dropdown */}
                {field.type === 'select' && (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {/* Validation Error */}
                {validationErrors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mt-6">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Powered by DynamicForms
        </p>
      </div>
    </div>
  );
}