'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { getCompanies } from '@/lib/super-admin-service';
import { CompanyDetail } from '@/types';
import { PlusIcon, SearchIcon, BuildingIcon } from '@/components/icons';

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-200/70 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q)
    );
  }, [companies, search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all registered companies</p>
        </div>
        <Link
          href="/super-admin/companies/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <PlusIcon className="w-4 h-4" />
          Create Company
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <BuildingIcon className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {search ? 'No companies match your search' : 'No companies yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                    Domain
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((company) => (
                  <tr
                    key={company.publicId}
                    onClick={() => router.push(`/super-admin/companies/${company.publicId}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500 sm:hidden">{company.domain}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="text-sm text-gray-600">{company.domain}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          company.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {company.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-500">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
