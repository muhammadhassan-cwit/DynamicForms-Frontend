'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getPublicSubmission } from '@/lib/form-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubmissionResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const submissionId = params.submissionId as string;
  const email = searchParams.get('email') || '';

  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicSubmission(submissionId, email);
        setSubmission(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load submission');
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      fetchSubmission();
    } else {
      setError('Email is required to view this submission');
      setIsLoading(false);
    }
  }, [submissionId, email]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-500">Unable to load this submission.</p>
        </div>
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-white p-8 rounded-t-lg shadow-md border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            {submission.form?.title || 'Form Submission'}
          </h1>
          <p className="text-gray-500 mt-1">Submission Details</p>
        </div>

        {/* Submission Data */}
        <div className="bg-white p-8 rounded-b-lg shadow-md">
          <div className="space-y-4">
            {/* Company Info */}
            {submission.company?.name && (
              <div className="pb-4 border-b">
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-gray-800 font-medium">{submission.company.name}</p>
              </div>
            )}

            {/* Response Data */}
            {submission.responseData &&
              Object.entries(submission.responseData).map(([key, value]) => (
                <div key={key} className="py-2">
                  <p className="text-sm text-gray-500">{key}</p>
                  <p className="text-gray-800">{value as string || 'N/A'}</p>
                </div>
              ))}

            {/* Status */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Status</p>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 capitalize">
                {submission.status}
              </span>
            </div>

            {/* Submitted At */}
            <div>
              <p className="text-sm text-gray-500">Submitted at</p>
              <p className="text-gray-800">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Powered by DynamicForms
        </p>
      </div>
    </div>
  );
}