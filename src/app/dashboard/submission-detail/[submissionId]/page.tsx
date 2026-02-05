'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getSubmission, deleteSubmission } from '@/lib/submission-service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/confirm-modal';

interface SubmissionDetail {
    submissionId: string;
    contact: {
        email: string;
        fullName: string | null;
    };
    responseData: Record<string, any>;
    status: string;
    submittedAt: string;
    form: {
        publicId: string;
        title: string;
        version: string;
    };
}

export default function SubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const submissionId = params.submissionId as string;

    const isAdmin = user?.role === 'admin';

    const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setIsLoading(true);
                const data = await getSubmission(submissionId);
                setSubmission(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load submission');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmission();
    }, [submissionId]);

    const handleDelete = async () => {
        setShowDeleteModal(false);

        try {
            await deleteSubmission(submissionId);
            toast.success('Submission deleted successfully');
            if (submission?.form?.publicId) {
                router.push(`/dashboard/forms/${submission.form.publicId}/submissions`);
            } else {
                router.push('/dashboard/forms');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete submission');
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="max-w-3xl">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
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
                    href="/dashboard/forms"
                    className="text-blue-500 hover:text-blue-600"
                >
                    ← Back to Forms
                </Link>
            </div>
        );
    }

    if (!submission) return null;

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href={`/dashboard/forms/${submission.form.publicId}/submissions`}
                    className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block"
                >
                    ← Back to Submissions
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Submission Details</h1>
            </div>

            {/* Form Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Form Info</h2>
                <div className="flex items-center gap-3">
                    <p className="text-gray-800">{submission.form.title}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        v{submission.form.version}
                    </span>
                </div>
            </div>

            {/* Submitter Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Submitter Info</h2>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800">{submission.contact.fullName || 'Anonymous'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{submission.contact.email}</p>
                    </div>
                </div>
            </div>

            {/* Response Data */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Response Data</h2>
                <div className="space-y-3">
                    {Object.entries(submission.responseData).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-sm text-gray-500">{key}</p>
                            <p className="text-gray-800">{value as string || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status & Time */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 capitalize">
                            {submission.status}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Submitted at</p>
                        <p className="text-gray-800">
                            {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isAdmin && (
                <div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200"
                    >
                        Delete Submission
                    </button>
                </div>
            )}
            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Submission?"
                message="Are you sure you want to delete this submission? This cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
}