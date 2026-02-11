import { NextResponse } from 'next/server';
import { backendFetch, getToken } from '@/lib/auth';

export async function GET() {
  const token = await getToken();

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { data, status } = await backendFetch('/users/stats');
    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}