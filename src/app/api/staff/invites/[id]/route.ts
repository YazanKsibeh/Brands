import { NextRequest, NextResponse } from 'next/server';
import { StaffInvite } from '@/entities/staff';

// Mock data (would normally come from database)
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
    invitedBy: {
      id: 'staff_001',
      name: 'Sarah Johnson',
    },
    message: 'Welcome to the LocalStyle team! We\'re excited to have you join us.',
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    invitedBy: {
      id: 'staff_001',
      name: 'Sarah Johnson',
    },
    message: null,
    status: 'expired',
    expiresAt: '2024-02-01T10:00:00Z',
    createdAt: '2024-01-25T10:00:00Z',
    acceptedAt: null,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invite = mockInvites.find(inv => inv.id === params.id);

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invite);
  } catch (error) {
    console.error('Error fetching invite:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invite' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const inviteIndex = mockInvites.findIndex(inv => inv.id === params.id);

    if (inviteIndex === -1) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    const existingInvite = mockInvites[inviteIndex];

    // Check if invite is expired
    if (new Date(existingInvite.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Invite has expired' },
        { status: 400 }
      );
    }

    // Update invite status
    const updatedInvite: StaffInvite = {
      ...existingInvite,
      status: body.status,
      acceptedAt: body.status === 'accepted' ? new Date().toISOString() : existingInvite.acceptedAt,
    };

    mockInvites[inviteIndex] = updatedInvite;

    return NextResponse.json(updatedInvite);
  } catch (error) {
    console.error('Error updating invite:', error);
    return NextResponse.json(
      { error: 'Failed to update invite' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inviteIndex = mockInvites.findIndex(inv => inv.id === params.id);

    if (inviteIndex === -1) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    mockInvites.splice(inviteIndex, 1);

    return NextResponse.json(
      { message: 'Invite cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling invite:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invite' },
      { status: 500 }
    );
  }
}