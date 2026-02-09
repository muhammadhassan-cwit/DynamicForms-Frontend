'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getPublicSubmission } from '@/lib/form-service';
import { Skeleton } from '@/components/ui/skeleton';
import { ExclamationCircleIcon } from '@/components/icons';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 font-medium text-lg mb-2">Unable to Load</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-t-2xl shadow-sm border border-gray-100 border-b-0 border-l-4 border-l-blue-600">
          <h1 className="text-2xl font-bold text-gray-900">
            {submission.form?.title || 'Form Submission'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Submission Details</p>
        </div>

        {/* Submission Data */}
        <div className="bg-white p-6 sm:p-8 rounded-b-2xl shadow-sm border border-gray-100 border-t-0">
          <div className="space-y-1">
            {/* Company Info */}
            {submission.company?.name && (
              <div className="pb-4 mb-4 border-b border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Company</p>
                <p className="text-gray-800 font-medium">{submission.company.name}</p>
              </div>
            )}

            {/* Response Data */}
            {submission.responseData &&
              Object.entries(submission.responseData).map(([key, value], index) => (
                <div key={key} className={`py-3 ${index % 2 === 1 ? 'bg-gray-50/50 -mx-6 px-6 sm:-mx-8 sm:px-8 rounded-lg' : ''}`}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</p>
                  <p className="text-gray-800 text-sm">{value as string || 'N/A'}</p>
                </div>
              ))}

            {/* Status */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Status</p>
              <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                {submission.status}
              </span>
            </div>

            {/* Submitted At */}
            <div className="pt-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted at</p>
              <p className="text-gray-800 text-sm">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by DynamicForms
        </p>
      </div>
    </div>
  );
}
