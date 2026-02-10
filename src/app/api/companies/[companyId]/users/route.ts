import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ companyId: string }> };

// GET /api/companies/:companyId/users
export async function GET(_request: NextRequest, { params }: Params) {
  const { companyId } = await params;
  const { data, status } = await backendFetch(`/companies/${companyId}/users`);
  return NextResponse.json(data, { status });
}
