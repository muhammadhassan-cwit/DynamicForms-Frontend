import { NextRequest, NextResponse } from 'next/server';
import { backendFetchPublic } from '@/lib/auth';

type Params = { params: Promise<{ formId: string }> };

// GET /api/public/forms/:formId → Get published form (public)
export async function GET(_request: NextRequest, { params }: Params) {
  const { formId } = await params;
  const { data, status } = await backendFetchPublic(`/public/forms/${formId}`);
  return NextResponse.json(data, { status });
}
