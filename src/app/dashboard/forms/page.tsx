'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getForms, deleteForm } from '@/lib/form-service';
import { Form } from '@/types';
import { FormCardSkeleton } from '@/components/ui/skeleton';

export default function FormsPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (formId: string, formTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${formTitle}"?`)) {
      return;
    }

    try {
      await deleteForm(formId);
      setForms(forms.filter((form) => form.publicId !== formId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete form');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Forms</h1>
        {isAdmin && (
          <Link
            href="/dashboard/forms/new"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Create Form
          </Link>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <FormCardSkeleton />
          <FormCardSkeleton />
          <FormCardSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchForms}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && forms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">No forms yet</p>
          {isAdmin && (
            <>
              <p className="text-gray-400 mb-4">Create your first form to get started</p>
              <Link
                href="/dashboard/forms/new"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                + Create Form
              </Link>
            </>
          )}
        </div>
      )}

      {/* Forms Grid */}
      {!isLoading && !error && forms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form.publicId} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {form.title}
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {form.description || 'No description'}
              </p>

              {/* Status and Version */}
              <div className="flex gap-2 mb-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    form.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  v{form.version}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/forms/${form.publicId}`}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                >
                  View
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(form.publicId, form.title)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm hover:bg-red-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}