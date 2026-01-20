'use client';
import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, LayoutGrid, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

import { mockTeamMembers, TeamMember } from '@/lib/mock-team-members';
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogs, setDialogs] = useState({ profile: false, edit: false, remove: false });


  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teamMembers, searchTerm]);

  // Derived metrics for the overview cards
  const totalMembers = teamMembers.length;
  const activeProjects = useMemo(() => {
    const projectSet = new Set<string>();
    teamMembers.forEach(member => member.projects.forEach(p => projectSet.add(p)));
    return projectSet.size;
  }, [teamMembers]);
  const totalTasksInProgress = useMemo(() => {
    return teamMembers.reduce((sum, member) => {
      const inProgressCount = member.tasks.filter(t => t.status === 'In Progress').length;
      return sum + inProgressCount;
    }, 0);
  }, [teamMembers]);
  // Placeholder: In a real app, this would come from actual task data
  const completedTasksLast7Days = Math.floor(Math.random() * 50) + 10; 

  const handleAddMember = (newMemberData: Omit<TeamMember, 'id' | 'projects' | 'tasksAssigned' | 'lastActivity'>) => {
    const newMember: TeamMember = {
      id: `MEMBER-${Date.now()}`, // Unique ID
      ...newMemberData,
      projects: [], // Initially no projects
      tasksAssigned: 0, // Initially no tasks
      lastActivity: new Date(),
    };
    setTeamMembers(prev => [...prev, newMember]);
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
    setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    closeDialog('edit');
  };

  const handleConfirmRemove = () => {
    if (selectedMember) {
      setTeamMembers(prev => prev.filter(m => m.id !== selectedMember.id));
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
        <Button size="sm" className="gap-2" onClick={() => setIsAddMemberDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
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
