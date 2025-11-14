import { NextRequest, NextResponse } from 'next/server';
import { StaffStatsResponse } from '@/entities/staff';

export async function GET(request: NextRequest) {
  try {
    // In a real app, these would be calculated from the database
    const stats: StaffStatsResponse = {
      totalStaff: 5,
      activeStaff: 4,
      pendingInvites: 1,
      byRole: {
        admin: 0,
        brand_owner: 1,
        branch_manager: 2,
        staff: 2,
      },
      byStatus: {
        active: 4,
        inactive: 0,
        pending: 1,
        suspended: 0,
      },
      byBranch: {
        'branch_001': 2, // Downtown LA Store
        'branch_002': 2, // SF Union Square
        'none': 1, // Brand Owner (no specific branch)
      },
      recentHires: 1, // Last 30 days
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching staff statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff statistics' },
      { status: 500 }
    );
  }
}