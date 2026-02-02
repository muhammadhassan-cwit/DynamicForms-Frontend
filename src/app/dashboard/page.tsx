'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {user?.fullName || user?.email}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Forms</h2>
          <p className="text-gray-500 mb-4">Create and manage your forms</p>
          <Link
            href="/dashboard/forms"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            View Forms →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Create Form</h2>
          <p className="text-gray-500 mb-4">Build a new dynamic form</p>
          <Link
            href="/dashboard/forms/new"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Create New →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Role</h2>
          <p className="text-gray-500 mb-4">Your current role</p>
          <p className="text-lg font-bold text-gray-800 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}