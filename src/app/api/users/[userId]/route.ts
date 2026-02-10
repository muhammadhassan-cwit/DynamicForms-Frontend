import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ userId: string }> };

// DELETE /api/users/:userId
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { userId } = await params;
  const { data, status } = await backendFetch(`/users/${userId}`, {
    method: 'DELETE',
  });
  return NextResponse.json(data, { status });
}
