import { NextRequest, NextResponse } from 'next/server';
import { backendFetchPublic } from '@/lib/auth';

type Params = { params: Promise<{ formId: string }> };

// POST /api/public/forms/:formId/validate-upload → Validate file upload (public)
export async function POST(request: NextRequest, { params }: Params) {
  const { formId } = await params;
  const body = await request.json();
  const { data, status } = await backendFetchPublic(`/public/forms/${formId}/validate-upload`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status });
}
