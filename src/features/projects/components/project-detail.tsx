'use client';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { apiClient } from '@/shared/config/axios';
import { queryKeys } from '@/shared/lib/query-keys';
import { getInitials } from '@/shared/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { InviteMemberDialog } from './invite-member-dialog';

interface ProjectDetailProps {
  projectId: string;
  projectName: string;
}

export function ProjectDetail({ projectId, projectName }: ProjectDetailProps) {
  const [showInvite, setShowInvite] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/members`);
      return response.data;
    },
  });

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="text-primary h-5 w-5" />
            اعضای تیم
          </CardTitle>
          <InviteMemberDialog
            projectId={projectId}
            projectName={projectName}
            open={showInvite}
            onOpenChange={setShowInvite}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground py-4 text-center">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-3">
              {members?.map(
                (member: {
                  id: string;
                  user: { id: string; name: string; email: string; avatar: string | null };
                  role: string;
                }) => (
                  <div
                    key={member.id}
                    className="bg-muted/50 flex items-center justify-between rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="ring-border h-9 w-9 ring-2">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.user.name}</p>
                        <p className="text-muted-foreground text-xs">{member.user.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {member.role === 'ADMIN' ? 'مدیر' : 'عضو'}
                    </Badge>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog - کنترل شده توسط state داخلی */}
      {showInvite && (
        <InviteMemberDialog
          projectId={projectId}
          projectName={projectName}
          open={showInvite}
          onOpenChange={setShowInvite}
        />
      )}
    </>
  );
}
