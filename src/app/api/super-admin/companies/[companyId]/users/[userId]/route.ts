import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ companyId: string; userId: string }> };

// DELETE /api/super-admin/companies/:companyId/users/:userId
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { companyId, userId } = await params;
  const { data, status } = await backendFetch(
    `/super-admin/companies/${companyId}/users/${userId}`,
    { method: 'DELETE' }
  );
  return NextResponse.json(data, { status });
}
