import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ formId: string }> };

// GET /api/forms/:formId/submissions → List submissions (authenticated)
export async function GET(_request: NextRequest, { params }: Params) {
  const { formId } = await params;
  const { data, status } = await backendFetch(`/forms/${formId}/submissions`);
  return NextResponse.json(data, { status });
}
