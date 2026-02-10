'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createCompany } from '@/lib/super-admin-service';
import { ChevronLeftIcon, SpinnerIcon } from '@/components/icons';

const TIMEZONE_OPTIONS = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Istanbul',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland',
];

interface CreateCompanyForm {
  name: string;
  domain: string;
  address: string;
  timezone: string;
  isActive: boolean;
  primaryColor: string;
  logoUrl: string;
  maxUsersAllowed: string;
  maxFormsAllowed: string;
}

export default function CreateCompanyPage() {
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyForm>({
    defaultValues: {
      timezone: 'UTC',
      isActive: true,
      primaryColor: '',
      logoUrl: '',
      maxUsersAllowed: '',
      maxFormsAllowed: '',
    },
  });

  const onSubmit = async (data: CreateCompanyForm) => {
    try {
      // Build themeConfig from form fields
      const themeConfig: Record<string, any> = {};
      if (data.primaryColor) themeConfig.primaryColor = data.primaryColor;
      if (data.logoUrl) themeConfig.logoUrl = data.logoUrl;

      // Build settingsMetadata from form fields
      const settingsMetadata: Record<string, any> = {};
      if (data.maxUsersAllowed) settingsMetadata.maxUsersAllowed = parseInt(data.maxUsersAllowed);
      if (data.maxFormsAllowed) settingsMetadata.maxFormsAllowed = parseInt(data.maxFormsAllowed);

      await createCompany({
        name: data.name,
        domain: data.domain,
        address: data.address || undefined,
        timezone: data.timezone || undefined,
        isActive: data.isActive,
        themeConfig: Object.keys(themeConfig).length > 0 ? themeConfig : undefined,
        settingsMetadata: Object.keys(settingsMetadata).length > 0 ? settingsMetadata : undefined,
      });
      toast.success('Company created successfully');
      router.push('/super-admin/companies');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create company');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-white transition-all duration-200';

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
        <h1 className="text-2xl font-bold text-gray-900">Create Company</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new company to the platform</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Company name is required' })}
              className={inputClass}
              placeholder="Enter company name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1.5">
              Domain <span className="text-red-500">*</span>
            </label>
            <input
              id="domain"
              type="text"
              {...register('domain', { required: 'Domain is required' })}
              className={inputClass}
              placeholder="example.com"
            />
            {errors.domain && (
              <p className="text-red-500 text-xs mt-1.5">{errors.domain.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
              Address <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input
              id="address"
              type="text"
              {...register('address')}
              className={inputClass}
              placeholder="123 Main St, City, Country"
            />
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1.5">
              Timezone
            </label>
            <select
              id="timezone"
              {...register('timezone')}
              className={inputClass}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between py-1">
            <div>
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Status
              </label>
              <p className="text-xs text-gray-400 mt-0.5">Company will be active immediately after creation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                type="checkbox"
                {...register('isActive')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-5 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Theme Configuration</p>

              {/* Primary Color */}
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Brand Color <span className="text-gray-400 text-xs font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="primaryColor"
                    type="color"
                    {...register('primaryColor')}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    {...register('primaryColor')}
                    className={inputClass}
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Logo URL <span className="text-gray-400 text-xs font-normal">(optional)</span>
                </label>
                <input
                  id="logoUrl"
                  type="url"
                  {...register('logoUrl')}
                  className={inputClass}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-3">Limits</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Max Users */}
                <div>
                  <label htmlFor="maxUsersAllowed" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Users <span className="text-gray-400 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="maxUsersAllowed"
                    type="number"
                    min="1"
                    {...register('maxUsersAllowed')}
                    className={inputClass}
                    placeholder="Unlimited"
                  />
                </div>

                {/* Max Forms */}
                <div>
                  <label htmlFor="maxFormsAllowed" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Forms <span className="text-gray-400 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="maxFormsAllowed"
                    type="number"
                    min="1"
                    {...register('maxFormsAllowed')}
                    className={inputClass}
                    placeholder="Unlimited"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="w-4 h-4" />
                  Creating...
                </>
              ) : (
                'Create Company'
              )}
            </button>
            <Link
              href="/super-admin/companies"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
