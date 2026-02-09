import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

// GET /api/forms → List all forms (authenticated)
export async function GET() {
  const { data, status } = await backendFetch('/forms');
  return NextResponse.json(data, { status });
}

// POST /api/forms → Create a form (authenticated)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, status } = await backendFetch('/forms', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status });
}
