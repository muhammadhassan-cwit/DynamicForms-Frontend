import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth';

// GET /api/super-admin/stats
export async function GET() {
  const { data, status } = await backendFetch('/super-admin/stats');
  return NextResponse.json(data, { status });
}
