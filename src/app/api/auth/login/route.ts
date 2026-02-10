// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(data, { status: response.status });
    }

    const cookieStore = await cookies();

    // Set HTTP-only cookie
    cookieStore.set('token', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Set role hint cookie (non-sensitive, used by middleware for routing)
    cookieStore.set('isSuperAdmin', data.data.user.isSuperAdmin ? '1' : '0', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    // Flatten company.publicId into companyId for frontend convenience
    const backendUser = data.data.user;
    const user = {
      id: backendUser.publicId,
      email: backendUser.email,
      fullName: backendUser.fullName,
      role: backendUser.role,
      isSuperAdmin: backendUser.isSuperAdmin,
      companyId: backendUser.company?.publicId || undefined,
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: { user },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}