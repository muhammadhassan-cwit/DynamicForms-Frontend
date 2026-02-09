import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

type Params = { params: Promise<{ formId: string }> };

// GET /api/forms/:formId → Get a form (authenticated)
export async function GET(_request: NextRequest, { params }: Params) {
  const { formId } = await params;
  const { data, status } = await backendFetch(`/forms/${formId}`);
  return NextResponse.json(data, { status });
}

// PATCH /api/forms/:formId → Update a form (authenticated)
export async function PATCH(request: NextRequest, { params }: Params) {
  const { formId } = await params;
  const body = await request.json();
  const { data, status } = await backendFetch(`/forms/${formId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status });
}

// DELETE /api/forms/:formId → Delete a form (authenticated)
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { formId } = await params;
  const { data, status } = await backendFetch(`/forms/${formId}`, {
    method: 'DELETE',
  });
  return NextResponse.json(data, { status });
}
