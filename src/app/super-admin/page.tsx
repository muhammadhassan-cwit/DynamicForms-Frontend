'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getStats } from '@/lib/super-admin-service';
import { SuperAdminStats } from '@/types';
import {
  BuildingIcon,
  UsersIcon,
  DocumentIcon,
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

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch stats';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          label: 'Total Companies',
          value: stats.totalCompanies,
          icon: BuildingIcon,
          color: 'bg-indigo-50 text-indigo-600',
        },
        {
          label: 'Active Companies',
          value: stats.activeCompanies,
          icon: CheckCircleIcon,
          color: 'bg-green-50 text-green-600',
        },
        {
          label: 'Total Users',
          value: stats.totalUsers,
          icon: UsersIcon,
          color: 'bg-blue-50 text-blue-600',
        },
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
          icon: UsersIcon,
          color: 'bg-teal-50 text-teal-600',
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview and statistics</p>
      </div>

      {error ? (
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center">
          <ExclamationCircleIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <StatCardSkeleton key={i} />)
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
    </div>
  );
}
