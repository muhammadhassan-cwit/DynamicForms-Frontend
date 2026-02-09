import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

// POST /api/public/forms/:formId/upload → Upload file (public, multipart/form-data)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const formData = await request.formData();

  // Forward the FormData directly to Express
  // Do NOT set Content-Type — fetch auto-sets it with the correct boundary
  const response = await fetch(`${BACKEND_URL}/public/forms/${formId}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
