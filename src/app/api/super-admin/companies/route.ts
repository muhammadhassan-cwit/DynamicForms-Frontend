import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

// GET /api/super-admin/companies
export async function GET() {
  const { data, status } = await backendFetch('/super-admin/companies');
  return NextResponse.json(data, { status });
}

// POST /api/super-admin/companies
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, status } = await backendFetch('/super-admin/companies', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return NextResponse.json(data, { status });
}
