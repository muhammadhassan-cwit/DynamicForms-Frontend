'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getForms, deleteForm } from '@/lib/form-service';
import { Form } from '@/types';
import { FormCardSkeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/confirm-modal';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, DocumentIcon, ExclamationCircleIcon } from '@/components/icons';

export default function FormsPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const isAdmin = user?.role === 'admin';

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getForms();
      setForms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const previousForms = [...forms];
    setForms(forms.filter((form) => form.publicId !== deleteTarget.id));
    setDeleteTarget(null);

    try {
      await deleteForm(deleteTarget.id);
      toast.success('Form Deleted Successfully');
    } catch (err: any) {
      setForms(previousForms);
      toast.error(err.message || 'Failed to Delete Form');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Forms</h1>
        {isAdmin && (
          <Link
            href="/dashboard/forms/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <PlusIcon className="w-4 h-4" />
            Create Form
          </Link>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <FormCardSkeleton />
          <FormCardSkeleton />
          <FormCardSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Something went wrong</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchForms}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && forms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">No forms yet</p>
          {isAdmin && (
            <>
              <p className="text-gray-400 text-sm mb-6">Create your first form to get started</p>
              <Link
                href="/dashboard/forms/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <PlusIcon className="w-4 h-4" />
                Create Form
              </Link>
            </>
          )}
        </div>
      )}

      {/* Forms Grid */}
      {!isLoading && !error && forms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {forms.map((form) => (
            <div
              key={form.publicId}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col"
            >
              {/* Title */}
              <h2 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
                {form.title}
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">
                {form.description || 'No description'}
              </p>

              {/* Status and Version */}
              <div className="flex items-center gap-2 mb-4">
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

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Link
                  href={`/dashboard/forms/${form.publicId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  View
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href={`/dashboard/forms/edit/${form.publicId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: form.publicId, title: form.title })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 ml-auto"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Form?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
