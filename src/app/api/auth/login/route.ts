/**
 * Authentication Login API route - Handles user login for LocalStyle application
 * POST /api/auth/login - Authenticates users and returns JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse, User } from '@/entities/user';

/**
 * Handle POST request for user login
 * Accepts username and password, returns mock authentication data
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { username, password } = body;

    // Validate that credentials are provided and non-empty
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // For now, accept any non-empty credentials as valid
    // In a real application, this would involve password verification and database lookup

    // Generate mock JWT tokens (in a real app, these would be properly signed)
    const mockAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAwMSIsInVzZXJuYW1lIjoiJHt1c2VybmFtZX0iLCJyb2xlIjoiYnJhbmRfb3duZXIiLCJpYXQiOjE3MzY1MDAwMDAsImV4cCI6MTczNjUwMzYwMH0.mock_signature_access`;
    const mockRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAwMSIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzM2NTAwMDAwLCJleHAiOjE3Mzc3MDk2MDB9.mock_signature_refresh`;

    // Create mock user data with brand_owner role
    const mockUser: User = {
      id: 'user_001',
      email: `${username}@localstyle.com`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'brand_owner'
    };

    // Construct the authentication response following the AuthResponse interface
    const authResponse: AuthResponse = {
      user: mockUser,
      tokens: {
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      }
    };

    return NextResponse.json(authResponse, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for login.' },
    { status: 405 }
  );
}