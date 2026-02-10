'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { getCompany, getCompanyUsers, deleteCompany, updateCompany, deleteCompanyUser } from '@/lib/super-admin-service';
import { CompanyDetail, CompanyUser } from '@/types';
import {
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  DocumentIcon,
  ClipboardListIcon,
  UsersIcon,
  GlobeIcon,
  BuildingIcon,
  SpinnerIcon,
  ExclamationTriangleIcon,
  XIcon,
} from '@/components/icons';

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200/70 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200/70 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200/70 rounded animate-pulse" />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="h-5 w-24 bg-gray-200/70 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200/70 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md relative z-10 animate-scaleIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <SpinnerIcon className="w-4 h-4" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  isOpen,
  onClose,
  company,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDetail;
  onSave: (data: { name: string; domain: string; address?: string; isActive: boolean }) => Promise<void>;
}) {
  const [name, setName] = useState(company.name);
  const [domain, setDomain] = useState(company.domain);
  const [address, setAddress] = useState(company.address || '');
  const [isActive, setIsActive] = useState(company.isActive);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) {
      toast.error('Name and domain are required');
      return;
    }
    setSaving(true);
    try {
      await onSave({ name, domain, address: address || undefined, isActive });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md relative z-10 animate-scaleIn">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Edit Company</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              placeholder="Optional"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
            >
              {saving ? (
                <>
                  <SpinnerIcon className="w-4 h-4" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<CompanyUser | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyData = await getCompany(companyId);
        setCompany(companyData);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch company details');
      } finally {
        setLoading(false);
      }

      try {
        const usersData = await getCompanyUsers(companyId);
        setUsers(usersData);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch company users');
      }
    };

    fetchData();
  }, [companyId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCompany(companyId);
      toast.success('Company deleted successfully');
      router.push('/super-admin/companies');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete company');
      setDeleting(false);
    }
  };

  const handleEdit = async (data: { name: string; domain: string; address?: string; isActive: boolean }) => {
    try {
      const updated = await updateCompany(companyId, data);
      setCompany(updated);
      setShowEditModal(false);
      toast.success('Company updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update company');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    try {
      await deleteCompanyUser(companyId, userToDelete.publicId);
      setUsers((prev) => prev.filter((u) => u.publicId !== userToDelete.publicId));
      toast.success('User deleted successfully');
      setUserToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-4 w-32 bg-gray-200/70 rounded animate-pulse mb-3" />
          <div className="h-7 w-48 bg-gray-200/70 rounded animate-pulse" />
        </div>
        <DetailSkeleton />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-16">
        <BuildingIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Company not found</p>
        <Link
          href="/super-admin/companies"
          className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-block"
        >
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/super-admin/companies"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-3"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Companies
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{company.domain}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Company Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
              <GlobeIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Domain</p>
              <p className="text-sm font-medium text-gray-900">{company.domain}</p>
            </div>
          </div>
          {company.address && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <BuildingIcon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-medium text-gray-900">{company.address}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${company.isActive ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${company.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className={`text-sm font-medium ${company.isActive ? 'text-green-700' : 'text-red-700'}`}>
                {company.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm font-medium text-gray-900">{new Date(company.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {company.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <DocumentIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Forms</p>
              <p className="text-xl font-bold text-gray-900">{company.stats.totalForms}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <ClipboardListIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Submissions</p>
              <p className="text-xl font-bold text-gray-900">{company.stats.totalSubmissions}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Contacts</p>
              <p className="text-xl font-bold text-gray-900">{company.stats.totalContacts}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Users ({users.length})</h2>
          <Link
            href={`/super-admin/companies/${companyId}/users/new`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            <UserPlusIcon className="w-4 h-4" />
            Add User
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <UsersIcon className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No users in this company</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                    Last Login
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Created
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.publicId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500 sm:hidden">{user.fullName || '-'}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="text-sm text-gray-600">{user.fullName || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-500">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title={`Delete ${user.email}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${company.name}"? This action cannot be undone and will remove all associated data.`}
        isLoading={deleting}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          company={company}
          onSave={handleEdit}
        />
      )}

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.email}"? This will remove the user from this company.`}
        isLoading={deletingUser}
      />
    </div>
  );
}
