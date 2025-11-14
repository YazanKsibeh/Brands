"use client";

/**
 * Staff Invites Management Page
 * Allows viewing and managing staff invitations
 */

import React, { useState } from 'react';
import { StaffInviteList } from '@/features/staff/components/staff-invite-list';
import { StaffInviteForm } from '@/features/staff/components/staff-invite-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Mail } from 'lucide-react';

const StaffInvitesPage: React.FC = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Invitations</h1>
          <p className="text-muted-foreground">
            Manage and send invitations to new staff members
          </p>
        </div>
        <Button onClick={() => setShowInviteForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Send Invitation
        </Button>
      </div>

      <Tabs defaultValue="invites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Pending Invites
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Send Invite
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invites" className="space-y-4">
          <StaffInviteList />
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Staff Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <StaffInviteForm 
                onSuccess={() => {
                  // Could switch to invites tab after successful send
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Invite Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Send Staff Invitation
              </h2>
              <p className="text-sm text-muted-foreground">
                Invite a new team member to join your organization
              </p>
            </div>
            <StaffInviteForm 
              onSuccess={() => setShowInviteForm(false)}
              onCancel={() => setShowInviteForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffInvitesPage;