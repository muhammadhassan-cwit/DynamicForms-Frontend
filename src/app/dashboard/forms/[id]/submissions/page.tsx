'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { listSubmissions, deleteSubmission } from '@/lib/submission-service';
import { getForm } from '@/lib/form-service';
import { Form } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/confirm-modal';
import { ChevronLeftIcon, EyeIcon, TrashIcon, InboxIcon } from '@/components/icons';

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
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);

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

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const previousSubmissions = [...submissions];
        setSubmissions(submissions.filter((s) => s.submissionId !== deleteTarget.id));
        setDeleteTarget(null);

        try {
            await deleteSubmission(deleteTarget.id);
            toast.success('Submission Deleted Successfully');
        } catch (err: any) {
            setSubmissions(previousSubmissions);
            toast.error(err.message || 'Failed to Delete Submission');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl">
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                    <div className="p-4"><Skeleton className="h-14 w-full" /></div>
                    <div className="p-4"><Skeleton className="h-14 w-full" /></div>
                    <div className="p-4"><Skeleton className="h-14 w-full" /></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Link
                    href={`/dashboard/forms/${formId}`}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Back to Form
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
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-3 transition-colors"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Back to {form?.title || 'Form'}
                </Link>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submissions</h1>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {submissions.length}
                    </span>
                </div>
            </div>

            {/* Empty State */}
            {submissions.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                    <InboxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">No submissions yet</p>
                    <p className="text-gray-400 mt-1 text-sm">
                        Share the form link to start receiving submissions
                    </p>
                </div>
            )}

            {/* Submissions List */}
            {submissions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {submissions.map((submission) => (
                        <div
                            key={submission.submissionId}
                            className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                    {(submission.contact.fullName || submission.contact.email || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                        {submission.contact.fullName || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{submission.contact.email}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {new Date(submission.submittedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize hidden sm:inline-flex">
                                    {submission.status}
                                </span>
                                <Link
                                    href={`/dashboard/submission-detail/${submission.submissionId}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <EyeIcon className="w-3.5 h-3.5" />
                                    View
                                </Link>
                                {isAdmin && (
                                    <button
                                        onClick={() => setDeleteTarget({ id: submission.submissionId, email: submission.contact.email })}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Delete</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirm Modal - moved outside the map loop */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Submission?"
                message={`Are you sure you want to delete the submission from "${deleteTarget?.email}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
