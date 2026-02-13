'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Users, LayoutGrid, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { TeamMember } from '@/lib/mock-team-members';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTeamMemberDialog } from './AddTeamMemberDialog';
import {AnimatedCounter} from '@/components/dashboard/animated-counter'; // Assuming this is available

// Import the new components
import TeamMemberList from './TeamMemberList';
import MemberProfileDialog from './MemberProfileDialog';
import { useSearch } from '@/context/SearchContext';


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
    const [teamStats, setTeamStats] = useState({
      total_members: 0,
      active_projects: 0,
      tasks_in_progress: 0,
      completed_last_7_days: 0,
    });
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // Fetch data from API
    useEffect(() => {
      const fetchTeamOverview = async () => {
        const token = localStorage.getItem('authToken')
        try {
          const response = await fetch('http://18.138.124.3/api/projects/team/overview/',{
            method:'GET',
            headers:{
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`, 
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTeamStats(data.stats);
          setTeamMembers(data.members.map((member: any) => ({
              id: member.id.toString(),
              name: member.name,
              role: member.role as TeamMember['role'],
              email: member.email,
              projects: member.projects || [],
              tasks: [], 
              tasksAssigned: member.task_count || 0,
              lastActivity: new Date(), // Placeholder, API doesn't provide this directly
          })));
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTeamOverview();
    }, []);
  
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const { searchQuery } = useSearch();
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
    useEffect(() => {
      const role = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      setCurrentUserRole(role);
      setCurrentUserId(userId);
    }, []); 
  
  
    const filteredMembers = useMemo(() => {
      return teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [teamMembers, searchQuery]);
  
  
    const handleAddMember = (newMemberData: Omit<TeamMember, 'id' | 'projects' | 'tasks' | 'lastActivity' | 'tasksAssigned'>) => {
      const newMember: TeamMember = {
        id: `MEMBER-${Date.now()}`, // Unique ID
        ...newMemberData,
        projects: [], // Initially no projects
        tasks: [], // Initially no tasks
        tasksAssigned: 0, // Initially no tasks
        lastActivity: new Date(),
      };
      setTeamMembers(prev => [...prev, newMember]); // Update teamMembers
    };
  
    const handleViewMember = (memberId: string) => {
      setSelectedMemberId(memberId);
      setIsProfileDialogOpen(true);
    };
  
    const handleCloseProfileDialog = () => {
      setIsProfileDialogOpen(false);
      setTimeout(() => setSelectedMemberId(null), 300); // Clear selected member ID after dialog closes
    };
  
    if (loading) {
      return <div className="p-4 sm:p-6 text-center">Loading team data...</div>;
    }
  
    if (error) {
      return <div className="p-4 sm:p-6 text-center text-red-500">Error: {error}</div>;
    }
  
  
    return (
      <div className="p-4 sm:p-6 space-y-6 bg-card rounded-lg shadow-sm">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage your project team members.</p>
          </div>
          {/* Only Admin and Superadmin can add members */}
          {/* Only Admin and Superadmin can add members */}
          {/* {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
              <Button size="sm" className="gap-2" onClick={() => setIsAddMemberDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Member
              </Button>
          )} */}
        </div>
    {/*  */}
        {/* Team Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Members" 
            value={teamStats.total_members} 
            icon={<Users className="h-4 w-4 text-muted-foreground" />} 
            description="Members currently in your team."
          />
          <StatCard 
            title="Active Projects" 
            value={teamStats.active_projects} 
            icon={<LayoutGrid className="h-4 w-4 text-muted-foreground" />} 
            description="Projects with active team involvement."
          />
          <StatCard 
            title="Tasks in Progress" 
            value={teamStats.tasks_in_progress} 
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} 
            description="Total active tasks across the team."
          />
          <StatCard 
            title="Completed (7 Days)" 
            value={teamStats.completed_last_7_days} 
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} 
            description="Tasks completed in the last week."
          />
        </div>
  
        {/* Team Members List */}
        <TeamMemberList
          teamMembers={filteredMembers}
          onViewMember={(member) => handleViewMember(member.id)}
        />
  
        {/* Dialogs */}
        <AddTeamMemberDialog
          isOpen={isAddMemberDialogOpen}
          onOpenChange={setIsAddMemberDialogOpen}
          onAddMember={handleAddMember}
        />
        <MemberProfileDialog
          isOpen={isProfileDialogOpen}
          onOpenChange={handleCloseProfileDialog}
          memberId={selectedMemberId}
        />
      </div>
    );
  };

export default TeamView;
