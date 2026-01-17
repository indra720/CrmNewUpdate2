'use client';

import { mockProjects, mockProjectMembers } from '@/lib/mockData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, DollarSign, Calendar, Users, Briefcase, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProjectMemberDialog } from '../forms/AddProjectMemberDialog';
import { AddProjectTaskDialog } from '../forms/AddProjectTaskDialog';


// Helper to get a single project by slug
const getProjectBySlug = (slug: string) => {
  return mockProjects.find(p => p.slug === slug);
};

// This defines the shape of the props the page will receive
interface ProjectDetailsPageProps {
  params: {
    slug: string;
  };
}

// The page component
export default function ProjectDetails({ params }: ProjectDetailsPageProps) {
  const project = getProjectBySlug(params.slug);
  
  // If no project is found, render a 404 page
  if (!project) {
    notFound();
  }

  const members = mockProjectMembers.filter(m => m.projectId === project.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Mock tasks for progress calculation (adapt as needed)
  const mockTasks = []; // Assuming no tasks data; replace with actual if available
  const completedTasks = mockTasks.filter(t => t.status === 'done').length;
  const totalTasks = mockTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : project.progress || 0;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        href="/admin/project/all" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </Link>

      {/* Project Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>{project.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {project.description}
            </p>
            
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {members.length} members
              </span>
            </div>
          </div>

          <Button variant="outline" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
            <AddProjectTaskDialog />
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            {mockTasks.length > 0 ? (
              mockTasks.map((task) => (
                <div key={task.id} className="py-3 border-b border-border last:border-b-0">
                  {/* Placeholder for TaskRow; adapt as needed */}
                  <p className="text-sm text-foreground">{task.title || 'Sample Task'}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No tasks yet. Create your first task to get started.
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Team</h2>
            <AddProjectMemberDialog />
          </div>

          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            {members.map((member) => (
              <div key={member.id || member.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name ? member.name.charAt(0) : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {member.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {member.email || 'No email'}
                  </p>
                </div>
                <Badge variant="secondary">
                  {member.role || 'Member'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}