'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { listSubmissions, deleteSubmission } from '@/lib/submission-service';
import { getForm } from '@/lib/form-service';
import { Form } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface SubmissionItem {
  submissionId: string;
  contact: {
    email: string;
    fullName: string | null;
  };
  status: string;
  submittedAt: string;
}

export default function SubmissionsPage() {
  const params = useParams();
  const { user } = useAuth();
  const formId = params.id as string;

  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [formData, submissionsData] = await Promise.all([
          getForm(formId),
          listSubmissions(formId),
        ]);
        setForm(formData);
        setSubmissions(submissionsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const handleDelete = async (submissionId: string, email: string) => {
    if (!confirm(`Delete submission from "${email}"?`)) {
      return;
    }

    // Save current list for rollback
    const previousSubmissions = [...submissions];

    // Optimistic update: remove from list immediately
    setSubmissions(submissions.filter((s) => s.submissionId !== submissionId));

    try {
      await deleteSubmission(submissionId);
    } catch (err: any) {
      // Rollback: put the item back
      setSubmissions(previousSubmissions);
      alert(err.message || 'Failed to delete submission');
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href={`/dashboard/forms/${formId}`}
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to Form
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/forms/${formId}`}
          className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block"
        >
          ← Back to {form?.title || 'Form'}
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Submissions ({submissions.length})
        </h1>
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No submissions yet</p>
          <p className="text-gray-400 mt-2">
            Share the form link to start receiving submissions
          </p>
        </div>
      )}

      {/* Submissions List */}
      {submissions.length > 0 && (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.submissionId}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {submission.contact.fullName || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500">{submission.contact.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 capitalize">
                  {submission.status}
                </span>
                <Link
                  href={`/dashboard/submission-detail/${submission.submissionId}`}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                >
                  View
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(submission.submissionId, submission.contact.email)}
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