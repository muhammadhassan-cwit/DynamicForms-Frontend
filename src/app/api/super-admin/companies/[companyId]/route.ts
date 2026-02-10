import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ companyId: string }> };

// GET /api/super-admin/companies/:companyId
export async function GET(_request: NextRequest, { params }: Params) {
  const { companyId } = await params;
  const { data, status } = await backendFetch(`/super-admin/companies/${companyId}`);
  return NextResponse.json(data, { status });
}

// PATCH /api/super-admin/companies/:companyId
export async function PATCH(request: NextRequest, { params }: Params) {
  const { companyId } = await params;
  const body = await request.json();
  const { data, status } = await backendFetch(`/super-admin/companies/${companyId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status });
}

// DELETE /api/super-admin/companies/:companyId
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { companyId } = await params;
  const { data, status } = await backendFetch(`/super-admin/companies/${companyId}`, {
    method: 'DELETE',
  });
  return NextResponse.json(data, { status });
}
