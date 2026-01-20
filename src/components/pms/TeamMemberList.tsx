'use client';
import React from 'react';
import { TeamMember } from '@/lib/mock-team-members';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  onViewMember: (member: TeamMember) => void;
  onEditMember: (member: TeamMember) => void;
  onRemoveMember: (member: TeamMember) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({ teamMembers, onViewMember, onEditMember, onRemoveMember }) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead className="hidden sm:table-cell">Role</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Projects</TableHead>
            <TableHead className="text-center hidden sm:table-cell">Tasks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{member.role}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {member.projects.length > 0 ? member.projects.join(', ') : 'N/A'}
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">{member.tasksAssigned}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[40px]">
                      <DropdownMenuItem onSelect={() => onViewMember(member)} className="px-2 py-1">
                        <Eye className="mr-2 h-4 w-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onEditMember(member)} className="px-2 py-1">
                        <Pencil className="mr-2 h-4 w-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onRemoveMember(member)} className="text-red-600 focus:text-red-500 px-2 py-1">
                        <Trash2 className="mr-2 h-4 w-4" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No team members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMemberList;
