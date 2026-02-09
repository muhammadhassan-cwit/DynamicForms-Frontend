import { NextRequest, NextResponse } from 'next/server';
import { backendFetchPublic } from '@/lib/auth';

type Params = { params: Promise<{ submissionId: string }> };

// GET /api/public/submissions/:submissionId → Get public submission (public)
export async function GET(request: NextRequest, { params }: Params) {
  const { submissionId } = await params;
  const email = request.nextUrl.searchParams.get('email') || '';
  const { data, status } = await backendFetchPublic(
    `/public/submissions/${submissionId}?email=${encodeURIComponent(email)}`
  );
  return NextResponse.json(data, { status });
}
