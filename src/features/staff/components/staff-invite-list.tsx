"use client";

/**
 * Staff Invite List Component
 * Displays and manages pending staff invitations
 */

import React from 'react';
import { format } from 'date-fns';
import { 
  useGetStaffInvites, 
  useResendStaffInvite, 
  useCancelStaffInvite 
} from '../api/use-staff';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { StaffInvite } from '@/entities/staff';
import { 
  Mail, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  Trash2,
  Eye
} from 'lucide-react';

interface StaffInviteListProps {
  className?: string;
}

export const StaffInviteList: React.FC<StaffInviteListProps> = ({ className }) => {
  const { toast } = useToast();
  const { data: invites, isLoading, error } = useGetStaffInvites();
  const resendInviteMutation = useResendStaffInvite();
  const cancelInviteMutation = useCancelStaffInvite();

  const getStatusBadge = (status: StaffInvite['status']) => {
    const variants = {
      pending: 'secondary',
      accepted: 'default',
      expired: 'destructive',
      cancelled: 'outline',
    } as const;

    const colors = {
      pending: 'text-yellow-600',
      accepted: 'text-green-600', 
      expired: 'text-red-600',
      cancelled: 'text-gray-600',
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: StaffInvite['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'accepted':
        return <Mail className="h-4 w-4 text-green-600" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <Trash2 className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleResendInvite = async (invite: StaffInvite) => {
    try {
      await resendInviteMutation.mutateAsync(invite.id);
      toast({
        title: 'Invite Resent',
        description: `Invitation has been resent to ${invite.email}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend invitation',
        variant: 'destructive',
      });
    }
  };

  const handleCancelInvite = async (invite: StaffInvite) => {
    try {
      await cancelInviteMutation.mutateAsync(invite.id);
      toast({
        title: 'Invite Cancelled',
        description: `Invitation to ${invite.email} has been cancelled`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel invitation',
        variant: 'destructive',
      });
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Staff Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading invitations...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Staff Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">Failed to load invitations</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Staff Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">No pending invitations</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Staff Invitations
          <Badge variant="secondary" className="ml-auto">
            {invites.filter(inv => inv.status === 'pending').length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell className="font-medium">{invite.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {invite.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invite.status)}
                    {getStatusBadge(invite.status)}
                  </div>
                </TableCell>
                <TableCell>{invite.invitedBy}</TableCell>
                <TableCell>
                  {format(new Date(invite.sentAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div className={isExpired(invite.expiresAt) ? 'text-red-600' : ''}>
                    {format(new Date(invite.expiresAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invite.status === 'pending' && !isExpired(invite.expiresAt) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvite(invite)}
                          disabled={resendInviteMutation.isPending}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={cancelInviteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel the invitation to {invite.email}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleCancelInvite(invite)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Cancel Invitation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {invite.message && (
                      <Button variant="ghost" size="sm" title="View message">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};