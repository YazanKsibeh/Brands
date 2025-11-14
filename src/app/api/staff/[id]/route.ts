import { NextRequest, NextResponse } from 'next/server';
import { StaffProfile, StaffUpdateRequest } from '@/entities/staff';

// This would normally come from a database
// For now, we'll import the same mock data (in a real app, this would be in a shared data store)
const mockStaff: StaffProfile[] = [
  {
    id: 'staff_001',
    email: 'sarah.johnson@localstyle.com',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'brand_owner',
    phoneNumber: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-5c4f-9233-650e88866e',
    dateOfBirth: '1985-03-15',
    address: {
      street: '123 Fashion Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Michael Johnson',
      phoneNumber: '+1 (555) 234-5679',
      relationship: 'Spouse',
    },
    status: 'active',
    department: 'Executive',
    position: 'Brand Owner',
    branchId: null,
    branchName: null,
    manager: {
      id: null,
      name: null,
    },
    employeeId: 'EMP001',
    hireDate: '2020-01-15T00:00:00Z',
    terminationDate: null,
    salary: 120000,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLogin: '2024-02-10T15:30:00Z',
    permissions: [
      'products.view', 'products.create', 'products.edit', 'products.delete',
      'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
      'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
      'staff.view', 'staff.create', 'staff.edit', 'staff.delete',
      'branches.view', 'branches.create', 'branches.edit', 'branches.delete',
      'brand.view', 'brand.edit',
      'reports.view', 'reports.export',
      'settings.view', 'settings.edit',
    ],
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    createdBy: 'system',
    updatedBy: 'staff_001',
  },
  {
    id: 'staff_002',
    email: 'marcus.chen@localstyle.com',
    name: 'Marcus Chen',
    firstName: 'Marcus',
    lastName: 'Chen',
    role: 'branch_manager',
    phoneNumber: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    dateOfBirth: '1990-07-22',
    address: {
      street: '456 Retail Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Lisa Chen',
      phoneNumber: '+1 (555) 345-6780',
      relationship: 'Sister',
    },
    status: 'active',
    department: 'Operations',
    position: 'Store Manager',
    branchId: 'branch_001',
    branchName: 'Downtown LA Store',
    manager: {
      id: 'staff_001',
      name: 'Sarah Johnson',
    },
    employeeId: 'EMP002',
    hireDate: '2021-03-01T00:00:00Z',
    terminationDate: null,
    salary: 75000,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLogin: '2024-02-10T14:15:00Z',
    permissions: [
      'products.view', 'products.create', 'products.edit',
      'categories.view',
      'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
      'staff.view', 'staff.create', 'staff.edit',
      'branches.view',
      'reports.view',
      'settings.view',
    ],
    createdAt: '2021-03-01T00:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    createdBy: 'staff_001',
    updatedBy: 'staff_002',
  },
  {
    id: 'staff_003',
    email: 'emma.rodriguez@localstyle.com',
    name: 'Emma Rodriguez',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    role: 'staff',
    phoneNumber: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    dateOfBirth: '1995-11-08',
    address: {
      street: '789 Commerce St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phoneNumber: '+1 (555) 456-7891',
      relationship: 'Father',
    },
    status: 'active',
    department: 'Sales',
    position: 'Sales Associate',
    branchId: 'branch_001',
    branchName: 'Downtown LA Store',
    manager: {
      id: 'staff_002',
      name: 'Marcus Chen',
    },
    employeeId: 'EMP003',
    hireDate: '2022-06-15T00:00:00Z',
    terminationDate: null,
    salary: 45000,
    isEmailVerified: true,
    isPhoneVerified: false,
    lastLogin: '2024-02-10T16:45:00Z',
    permissions: [
      'products.view',
      'categories.view',
      'orders.view', 'orders.create', 'orders.edit',
      'reports.view',
    ],
    createdAt: '2022-06-15T00:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    createdBy: 'staff_002',
    updatedBy: 'staff_003',
  },
  {
    id: 'staff_004',
    email: 'david.kim@localstyle.com',
    name: 'David Kim',
    firstName: 'David',
    lastName: 'Kim',
    role: 'staff',
    phoneNumber: '+1 (555) 567-8901',
    avatar: null,
    dateOfBirth: '1993-04-12',
    address: {
      street: '321 Style Lane',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Grace Kim',
      phoneNumber: '+1 (555) 567-8902',
      relationship: 'Mother',
    },
    status: 'pending',
    department: 'Sales',
    position: 'Sales Associate',
    branchId: 'branch_002',
    branchName: 'SF Union Square',
    manager: {
      id: 'staff_005',
      name: 'Jennifer Martinez',
    },
    employeeId: 'EMP004',
    hireDate: '2024-02-01T00:00:00Z',
    terminationDate: null,
    salary: 45000,
    isEmailVerified: false,
    isPhoneVerified: false,
    lastLogin: null,
    permissions: [
      'products.view',
      'categories.view',
      'orders.view', 'orders.create', 'orders.edit',
      'reports.view',
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    createdBy: 'staff_001',
    updatedBy: 'staff_001',
  },
  {
    id: 'staff_005',
    email: 'jennifer.martinez@localstyle.com',
    name: 'Jennifer Martinez',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    role: 'branch_manager',
    phoneNumber: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e6',
    dateOfBirth: '1988-09-25',
    address: {
      street: '654 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Roberto Martinez',
      phoneNumber: '+1 (555) 678-9013',
      relationship: 'Husband',
    },
    status: 'active',
    department: 'Operations',
    position: 'Store Manager',
    branchId: 'branch_002',
    branchName: 'SF Union Square',
    manager: {
      id: 'staff_001',
      name: 'Sarah Johnson',
    },
    employeeId: 'EMP005',
    hireDate: '2021-08-01T00:00:00Z',
    terminationDate: null,
    salary: 78000,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLogin: '2024-02-10T13:20:00Z',
    permissions: [
      'products.view', 'products.create', 'products.edit',
      'categories.view',
      'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
      'staff.view', 'staff.create', 'staff.edit',
      'branches.view',
      'reports.view',
      'settings.view',
    ],
    createdAt: '2021-08-01T00:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    createdBy: 'staff_001',
    updatedBy: 'staff_005',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staff = mockStaff.find(s => s.id === params.id);

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: StaffUpdateRequest = await request.json();
    const staffIndex = mockStaff.findIndex(s => s.id === params.id);

    if (staffIndex === -1) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    const existingStaff = mockStaff[staffIndex];

    // Update staff member
    const updatedStaff: StaffProfile = {
      ...existingStaff,
      ...body,
      name: body.firstName && body.lastName 
        ? `${body.firstName} ${body.lastName}` 
        : existingStaff.name,
      address: body.address ? { ...existingStaff.address, ...body.address } : existingStaff.address,
      emergencyContact: body.emergencyContact 
        ? { ...existingStaff.emergencyContact, ...body.emergencyContact } 
        : existingStaff.emergencyContact,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current_user', // Would be from auth context
    };

    mockStaff[staffIndex] = updatedStaff;

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffIndex = mockStaff.findIndex(s => s.id === params.id);

    if (staffIndex === -1) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    const staff = mockStaff[staffIndex];

    // Prevent deletion of active staff members directly
    // Usually they should be deactivated first
    if (staff.status === 'active') {
      return NextResponse.json(
        { error: 'Cannot delete active staff member. Please deactivate first.' },
        { status: 400 }
      );
    }

    // Check if staff member has any dependencies (orders, etc.)
    // In a real app, you'd check the database for related records
    
    mockStaff.splice(staffIndex, 1);

    return NextResponse.json(
      { message: 'Staff member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}