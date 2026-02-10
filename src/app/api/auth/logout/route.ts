// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('isSuperAdmin');

  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}