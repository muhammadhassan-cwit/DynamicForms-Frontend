'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { DocumentIcon, PlusIcon, ShieldIcon, ChevronRightIcon } from '@/components/icons';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.fullName || user?.email}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Forms Card */}
        <Link
          href="/dashboard/forms"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200">
            <DocumentIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Forms</h2>
          <p className="text-sm text-gray-500 mb-4">Create and manage your forms</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all duration-200">
            View Forms
            <ChevronRightIcon className="w-4 h-4" />
          </span>
        </Link>

        {/* Create Form Card */}
        <Link
          href="/dashboard/forms/new"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors duration-200">
            <PlusIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Create Form</h2>
          <p className="text-sm text-gray-500 mb-4">Build a new dynamic form</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 group-hover:gap-2.5 transition-all duration-200">
            Create New
            <ChevronRightIcon className="w-4 h-4" />
          </span>
        </Link>

        {/* Role Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-4">
            <ShieldIcon className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Role</h2>
          <p className="text-sm text-gray-500 mb-4">Your current role</p>
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-violet-50 text-violet-700 border border-violet-200 capitalize">
            {user?.role}
          </span>
        </div>
      </div>
    </div>
  );
}
