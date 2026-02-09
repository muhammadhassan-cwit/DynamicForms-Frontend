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
import { ChevronLeftIcon, EyeIcon, TrashIcon, LinkIcon, CopyIcon } from '@/components/icons';

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

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/submit/${form?.publicId}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="bg-white p-6 rounded-xl border border-gray-100">
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
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <ChevronLeftIcon />
          Back to Forms
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
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-2"
          >
            <ChevronLeftIcon />
            Back to Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{form.title}</h1>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${
              form.isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {form.isPublished ? 'Published' : 'Draft'}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-600 border border-gray-200">
            v{form.version}
          </span>
        </div>
      </div>

      {/* Form Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 pb-3 mb-4 border-b border-gray-100">Form Details</h2>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
            <p className="text-gray-800">{form.description || 'No description'}</p>
          </div>

          {form.isPublished && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Public URL</p>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-blue-600 text-sm truncate flex-1">
                  {typeof window !== 'undefined' && `${window.location.origin}/submit/${form.publicId}`}
                </p>
                <button
                  onClick={handleCopyUrl}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  title="Copy URL"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 pb-3 mb-4 border-b border-gray-100">
          Form Fields ({form.structureSchema.length})
        </h2>

        {form.structureSchema.length === 0 ? (
          <p className="text-gray-500">No fields defined</p>
        ) : (
          <div className="space-y-2">
            {form.structureSchema.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {field.type}
                      {field.type === 'select' && field.options && (
                        <span> &middot; {field.options.join(', ')}</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200 capitalize">
                  {field.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/dashboard/forms/${formId}/submissions`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <EyeIcon />
          View Submissions
        </Link>
        {isAdmin && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-lg font-medium text-sm border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
          >
            <TrashIcon />
            Delete Form
          </button>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Form?"
        message={`Are you sure you want to delete "${form?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
