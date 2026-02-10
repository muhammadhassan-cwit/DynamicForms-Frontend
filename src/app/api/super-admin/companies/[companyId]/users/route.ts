import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ companyId: string }> };

// GET /api/super-admin/companies/:companyId/users
export async function GET(_request: NextRequest, { params }: Params) {
  const { companyId } = await params;
  const { data, status } = await backendFetch(`/super-admin/companies/${companyId}/users`);
  return NextResponse.json(data, { status });
}

// POST /api/super-admin/companies/:companyId/users
export async function POST(request: NextRequest, { params }: Params) {
  const { companyId } = await params;
  const body = await request.json();
  const { data, status } = await backendFetch(`/super-admin/companies/${companyId}/users`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status });
}
