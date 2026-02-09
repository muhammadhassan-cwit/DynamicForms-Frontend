import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ submissionId: string }> };

// GET /api/submissions/:submissionId → Get submission (authenticated)
export async function GET(_request: NextRequest, { params }: Params) {
  const { submissionId } = await params;
  const { data, status } = await backendFetch(`/submissions/${submissionId}`);
  return NextResponse.json(data, { status });
}

// DELETE /api/submissions/:submissionId → Delete submission (authenticated)
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { submissionId } = await params;
  const { data, status } = await backendFetch(`/submissions/${submissionId}`, {
    method: 'DELETE',
  });
  return NextResponse.json(data, { status });
}
