'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getForm, deleteForm } from '@/lib/form-service';
import { Form } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/confirm-modal';

export default function ViewFormPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        const data = await getForm(formId);
        setForm(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleDelete = async () => {
    setShowDeleteModal(false);

    try {
      await deleteForm(formId);
      toast.success('Form deleted successfully');
      router.push('/dashboard/forms');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete form');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href="/dashboard/forms"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to Forms
        </Link>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/dashboard/forms"
            className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block"
          >
            ← Back to Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{form.title}</h1>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 text-sm rounded-full ${form.isPublished
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
              }`}
          >
            {form.isPublished ? 'Published' : 'Draft'}
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
            v{form.version}
          </span>
        </div>
      </div>

      {/* Form Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Details</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-800">{form.description || 'No description'}</p>
          </div>

          {form.isPublished && (
            <div>
              <p className="text-sm text-gray-500">Public URL</p>
              <p className="text-blue-500">
                {typeof window !== 'undefined' && `${window.location.origin}/submit/${form.publicId}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Form Fields ({form.structureSchema.length})
        </h2>

        {form.structureSchema.length === 0 ? (
          <p className="text-gray-500">No fields defined</p>
        ) : (
          <div className="space-y-3">
            {form.structureSchema.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {index + 1}. {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Type: {field.type}
                    {field.type === 'select' && field.options && (
                      <span> • Options: {field.options.join(', ')}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href={`/dashboard/forms/${formId}/submissions`}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View Submissions
        </Link>
        {isAdmin && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200"
          >
            Delete Form
          </button>
        )}
        {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Form?"
        message={`Are you sure you want to delete "${form?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      </div>
    </div>
  );
}