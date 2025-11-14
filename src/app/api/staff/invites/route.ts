import { NextRequest, NextResponse } from 'next/server';
import { StaffInvite, StaffInviteRequest } from '@/entities/staff';

// Mock data for staff invites
const mockInvites: StaffInvite[] = [
  {
    id: 'invite_001',
    email: 'alice.smith@example.com',
    firstName: 'Alice',
    lastName: 'Smith',
    role: 'staff',
    branchId: 'branch_001',
    branchName: 'Downtown LA Store',
    position: 'Sales Associate',
    department: 'Sales',
    invitedBy: 'Sarah Johnson',
    message: 'Welcome to the LocalStyle team! We\'re excited to have you join us.',
    status: 'pending',
    sentAt: '2024-02-08T10:00:00Z',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: '2024-02-08T10:00:00Z',
    acceptedAt: null,
  },
  {
    id: 'invite_002',
    email: 'bob.wilson@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    role: 'branch_manager',
    branchId: 'branch_003',
    branchName: 'Chicago North',
    position: 'Store Manager',
    department: 'Operations',
    invitedBy: 'Sarah Johnson',
    message: null,
    status: 'expired',
    sentAt: '2024-01-25T10:00:00Z',
    expiresAt: '2024-02-01T10:00:00Z',
    createdAt: '2024-01-25T10:00:00Z',
    acceptedAt: null,
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    let filteredInvites = [...mockInvites];

    if (status) {
      filteredInvites = filteredInvites.filter(invite => invite.status === status);
    }

    if (email) {
      filteredInvites = filteredInvites.filter(invite => 
        invite.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    return NextResponse.json(filteredInvites);
  } catch (error) {
    console.error('Error fetching staff invites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff invites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const inviteData: StaffInviteRequest = await request.json();

    // Check if user already has a pending invite
    const existingInvite = mockInvites.find(
      invite => invite.email === inviteData.email && invite.status === 'pending'
    );

    if (existingInvite) {
      return NextResponse.json(
        { error: 'User already has a pending invite' },
        { status: 400 }
      );
    }

    // Generate new invite
    const newInvite: StaffInvite = {
      id: `invite_${String(mockInvites.length + 1).padStart(3, '0')}`,
      email: inviteData.email,
      firstName: inviteData.firstName,
      lastName: inviteData.lastName,
      role: inviteData.role,
      branchId: inviteData.branchId || null,
      branchName: null, // Would be fetched from branch service
      position: inviteData.position || null,
      department: inviteData.department || null,
      invitedBy: 'Current User', // Would be from auth context
      message: inviteData.message || null,
      status: 'pending',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdAt: new Date().toISOString(),
      acceptedAt: null,
    };

    mockInvites.push(newInvite);

    // In a real app, you would send the invitation email here
    console.log(`Invitation email would be sent to ${inviteData.email}`);

    return NextResponse.json(newInvite, { status: 201 });
  } catch (error) {
    console.error('Error creating staff invite:', error);
    return NextResponse.json(
      { error: 'Failed to create staff invite' },
      { status: 500 }
    );
  }
}