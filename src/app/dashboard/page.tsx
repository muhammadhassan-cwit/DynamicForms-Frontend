'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getDashboardStats } from '@/lib/user-service';
import { DashboardStats } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  DocumentIcon,
  PlusIcon,
  ShieldIcon,
  ChevronRightIcon,
  UsersIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@/components/icons';

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200/70 rounded-lg animate-pulse" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-gray-200/70 rounded animate-pulse mb-2" />
          <div className="h-7 w-16 bg-gray-200/70 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        const message = err.message || 'Failed to fetch stats';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = stats
    ? [
        ...(user?.role === 'admin'
          ? [
              {
                label: 'Total Employees',
                value: stats.totalEmployees,
                icon: UsersIcon,
                color: 'bg-blue-50 text-blue-600',
              },
            ]
          : []),
        {
          label: 'Total Forms',
          value: stats.totalForms,
          icon: DocumentIcon,
          color: 'bg-purple-50 text-purple-600',
        },
        {
          label: 'Active Forms',
          value: stats.activeForms,
          icon: DocumentIcon,
          color: 'bg-emerald-50 text-emerald-600',
        },
        {
          label: 'Total Respondents',
          value: stats.totalRespondents,
          icon: ClipboardListIcon,
          color: 'bg-amber-50 text-amber-600',
        },
        {
          label: 'Unique Respondents',
          value: stats.uniqueRespondents,
          icon: CheckCircleIcon,
          color: 'bg-teal-50 text-teal-600',
        },
      ]
    : [];

  const skeletonCount = user?.role === 'admin' ? 5 : 4;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.fullName || user?.email}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your workspace.</p>
      </div>

      {/* Stats Section */}
      {error ? (
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center mb-8">
          <ExclamationCircleIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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