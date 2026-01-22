'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Users, LayoutGrid, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

import { mockTeamMembers, TeamMember } from '@/lib/mock-team-members';
import { mockProjects, mockProjectMembers, mockTasks } from '@/lib/mockData'; // Added mockProjects, mockProjectMembers, mockTasks
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTeamMemberDialog } from './AddTeamMemberDialog';
import {AnimatedCounter} from '@/components/dashboard/animated-counter'; // Assuming this is available

// Import the new components
import TeamMemberList from './TeamMemberList';
import MemberProfileDialog from './MemberProfileDialog';
import { EditTeamMemberDialog } from './EditTeamMemberDialog';
import RemoveConfirmationDialog from './RemoveConfirmationDialog';


// A simple StatCard component for reusability
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => (
  <Card className="flex flex-col">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {typeof value === 'number' ? (
        <AnimatedCounter from={0} to={value} className="text-2xl font-bold" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);


const TeamView = () => {
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]); // Renamed to avoid conflict, initialized as empty
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogs, setDialogs] = useState({ profile: false, edit: false, remove: false });

  // Fetch role and ID, then filter members
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setCurrentUserRole(role);
    setCurrentUserId(userId);

    let membersToSet: TeamMember[] = [];

    if (role === 'admin' || role === 'superadmin') {
      membersToSet = mockTeamMembers;
    } else if (role === 'team-leader' && userId) {
      // Find projects the team leader is part of
      const teamLeaderProjectIds = mockProjectMembers
        .filter(member => member.id === userId)
        .map(member => member.projectId);

      // Find all unique member IDs associated with these projects
      const uniqueRelevantMemberIds = new Set<string>();
      mockProjectMembers.forEach(member => {
        if (teamLeaderProjectIds.includes(member.projectId)) {
          uniqueRelevantMemberIds.add(member.id);
        }
      });
      // Filter mockTeamMembers to include only relevant members
      membersToSet = mockTeamMembers.filter(member => uniqueRelevantMemberIds.has(member.id));
    }
    // For other roles or if not logged in, membersToSet remains empty

    setAllTeamMembers(membersToSet);
  }, []); // Empty dependency array means this effect runs once on mount.


  const filteredMembers = useMemo(() => {
    // Filter the `allTeamMembers` state
    return allTeamMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTeamMembers, searchTerm]); // Dependency on allTeamMembers

  // Derived metrics for the overview cards - now based on filteredMembers
  const totalMembers = filteredMembers.length;
  const activeProjects = useMemo(() => {
    const projectSet = new Set<string>();
    filteredMembers.forEach(member => member.projects.forEach(p => projectSet.add(p)));
    return projectSet.size;
  }, [filteredMembers]);
  const totalTasksInProgress = useMemo(() => {
    return filteredMembers.reduce((sum, member) => {
      // Assuming mockTasks is available globally or passed down if needed for accurate task status
      const inProgressCount = mockTasks.filter(t => 
        t.assigneeId === member.id && t.status === 'in_progress'
      ).length;
      return sum + inProgressCount;
    }, 0);
  }, [filteredMembers]);
  // Placeholder: In a real app, this would come from actual task data
  const completedTasksLast7Days = Math.floor(Math.random() * 50) + 10; 

  const handleAddMember = (newMemberData: Omit<TeamMember, 'id' | 'projects' | 'tasks' | 'lastActivity' | 'tasksAssigned'>) => {
    const newMember: TeamMember = {
      id: `MEMBER-${Date.now()}`, // Unique ID
      ...newMemberData,
      projects: [], // Initially no projects
      tasks: [], // Initially no tasks
      tasksAssigned: 0, // Initially no tasks
      lastActivity: new Date(),
    };
    setAllTeamMembers(prev => [...prev, newMember]); // Update allTeamMembers
  };

  const openDialog = (type: 'profile' | 'edit' | 'remove', member: TeamMember) => {
    setSelectedMember(member);
    setDialogs(d => ({ ...d, [type]: true }));
  };

  const closeDialog = (type: 'profile' | 'edit' | 'remove') => {
    setDialogs(d => ({ ...d, [type]: false }));
    setTimeout(() => setSelectedMember(null), 300); // Clear selected member after dialog closes
  };

  const handleUpdateMember = (updatedMember: TeamMember) => {
    setAllTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m)); // Update allTeamMembers
    closeDialog('edit');
  };

  const handleConfirmRemove = () => {
    if (selectedMember) {
      setAllTeamMembers(prev => prev.filter(m => m.id !== selectedMember.id)); // Update allTeamMembers
    }
    closeDialog('remove');
  };


  return (
    <div className="p-4 sm:p-6 space-y-6 bg-white rounded-lg shadow-sm">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your project team members.</p>
        </div>
        {/* Only Admin and Superadmin can add members */}
        {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
            <Button size="sm" className="gap-2" onClick={() => setIsAddMemberDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Member
            </Button>
        )}
      </div>

      {/* Team Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Members" 
          value={totalMembers} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          description="Members currently in your team."
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          icon={<LayoutGrid className="h-4 w-4 text-muted-foreground" />} 
          description="Projects with active team involvement."
        />
        <StatCard 
          title="Tasks in Progress" 
          value={totalTasksInProgress} 
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} 
          description="Total active tasks across the team."
        />
        <StatCard 
          title="Completed (7 Days)" 
          value={completedTasksLast7Days} 
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} 
          description="Tasks completed in the last week."
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-8" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Placeholder for role/status filters */}
        <div className="md:ml-auto">
          {/* Filters for Role, Status etc. will go here */}
        </div>
      </div>

      {/* Team Members List */}
      <TeamMemberList
        teamMembers={filteredMembers}
        onViewMember={(member) => openDialog('profile', member)}
        onEditMember={(member) => openDialog('edit', member)}
        onRemoveMember={(member) => openDialog('remove', member)}
      />

      {/* Dialogs */}
      <AddTeamMemberDialog
        isOpen={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onAddMember={handleAddMember}
      />
      <MemberProfileDialog
        isOpen={dialogs.profile}
        onOpenChange={() => closeDialog('profile')}
        member={selectedMember}
      />
      <EditTeamMemberDialog
        isOpen={dialogs.edit}
        onOpenChange={() => closeDialog('edit')}
        member={selectedMember}
        onUpdateMember={handleUpdateMember}
      />
      <RemoveConfirmationDialog
        isOpen={dialogs.remove}
        onOpenChange={() => closeDialog('remove')}
        member={selectedMember}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
};

export default TeamView;
