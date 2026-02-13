'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getSubmission, deleteSubmission } from '@/lib/submission-service';
import { getForm } from '@/lib/form-service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/confirm-modal';
import { FormField } from '@/types';
import { ChevronLeftIcon, TrashIcon, DownloadIcon } from '@/components/icons';

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

const browserOpenable = ['pdf', 'txt', 'csv'];

const extensionColors: Record<string, { bg: string; text: string }> = {
    pdf: { bg: 'bg-red-100', text: 'text-red-700' },
    doc: { bg: 'bg-blue-100', text: 'text-blue-700' },
    docx: { bg: 'bg-blue-100', text: 'text-blue-700' },
    xls: { bg: 'bg-green-100', text: 'text-green-700' },
    xlsx: { bg: 'bg-green-100', text: 'text-green-700' },
    csv: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    txt: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function SubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const submissionId = params.submissionId as string;

    const isAdmin = user?.role === 'admin';

    const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
    const [formFields, setFormFields] = useState<FormField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const submissionData = await getSubmission(submissionId);
                setSubmission(submissionData);

                if (submissionData.form?.publicId) {
                    const formData = await getForm(submissionData.form.publicId);
                    setFormFields(formData.structureSchema || []);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load submission');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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

    const getFieldType = (label: string): string => {
        const field = formFields.find((f) => f.label === label);
        return field?.type || 'text';
    };

    const getBackendUrl = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        return apiUrl.replace('/api/v1', '');
    };

    const getExtension = (filePath: string) => {
        return filePath.split('.').pop()?.toLowerCase() || '';
    };

    const renderValue = (label: string, value: any) => {
        const fieldType = getFieldType(label);

        if (!value || value === '') {
            return <p className="text-gray-400 italic text-sm">No response</p>;
        }

        if (fieldType === 'image') {
            const fullUrl = encodeURI(`${getBackendUrl()}${value}`);
            return (
                <div>
                    <img
                        src={fullUrl}
                        alt={label}
                        className="max-h-48 rounded-lg border border-gray-200 shadow-sm"
                    />
                    <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm mt-2"
                    >
                        View Full Size
                    </a>
                </div>
            );
        }

        if (fieldType === 'file') {
            const fullUrl = encodeURI(`${getBackendUrl()}${value}`);
            const ext = getExtension(value);
            const extColor = extensionColors[ext] || { bg: 'bg-gray-100', text: 'text-gray-700' };
            const fileName = value.split('/').pop() || 'File';
            const displayName = fileName.replace(/^\d+-/, '');

            if (browserOpenable.includes(ext)) {
                return (
                    <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${extColor.bg} flex items-center justify-center`}>
                            <span className={`text-xs font-bold uppercase ${extColor.text}`}>{ext}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-gray-700 truncate">{displayName}</p>
                            <a
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                                Open File
                            </a>
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${extColor.bg} flex items-center justify-center`}>
                        <span className={`text-xs font-bold uppercase ${extColor.text}`}>{ext}</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-gray-700 truncate">{displayName}</p>
                        <a
                            href={fullUrl}
                            download
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                            <DownloadIcon className="w-3 h-3" />
                            Download File
                        </a>
                    </div>
                </div>
            );
        }

        if (fieldType === 'checkbox' && Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-2">
                    {value.map((item: string, idx: number) => (
                        <span
                            key={idx}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            );
        }

        if (fieldType === 'rating') {
            const rating = Number(value) || 0;
            return (
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">({rating}/5)</span>
                </div>
            );
        }

        return <p className="text-gray-800 text-sm">{String(value)}</p>;
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
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
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Back to Forms
                </Link>
            </div>
        );
    }

    if (!submission) return null;

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <Link
                    href={`/dashboard/forms/${submission.form.publicId}/submissions`}
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-3 transition-colors"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Back to Submissions
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submission Details</h1>
            </div>

            {/* Form Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 pb-3 border-b border-gray-100">Form Info</h2>
                <div className="flex items-center gap-3">
                    <p className="text-gray-800 font-medium">{submission.form.title}</p>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        v{submission.form.version}
                    </span>
                </div>
            </div>

            {/* Submitter Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 pb-3 border-b border-gray-100">Submitter Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                        <p className="text-gray-800 font-medium">{submission.contact.fullName || 'Anonymous'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                        <p className="text-gray-800 font-medium">{submission.contact.email}</p>
                    </div>
                </div>
            </div>

            {/* Response Data */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 pb-3 border-b border-gray-100">Response Data</h2>
                <div className="divide-y divide-gray-100">
                    {Object.entries(submission.responseData).map(([key, value], index) => (
                        <div key={key} className={`py-3 ${index % 2 === 1 ? 'bg-gray-50/50 -mx-6 px-6' : ''}`}>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">{key}</p>
                            {renderValue(key, value)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Status & Timestamp */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Status</p>
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                            {submission.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Submitted at</p>
                        <p className="text-gray-800 text-sm font-medium">
                            {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete Submission
                    </button>
                </div>
            )}

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