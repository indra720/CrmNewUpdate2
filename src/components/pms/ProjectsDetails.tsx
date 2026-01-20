'use client';

import { mockProjects, mockProjectMembers, mockTasks, mockActivities } from '@/lib/mockData'; // Import mockTasks and mockActivities
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, DollarSign, Calendar, Users, Briefcase, MoreHorizontal, CheckSquare, ListTodo, Activity, GanttChart, SquareStack, CheckCircle, MessageSquare, PlusCircle } from 'lucide-react'; // Added activity-related icons
import { Button } from '@/components/ui/button';
import { AddProjectMemberDialog } from '../forms/AddProjectMemberDialog';
import { AddProjectTaskDialog } from '../forms/AddProjectTaskDialog';
import { TaskRow } from './TaskRow'; // Import TaskRow
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { TaskView } from './TaskView';
import { formatDistanceToNowStrict } from 'date-fns'; // Import for date formatting


// Helper to get a single project by slug
const getProjectBySlug = (slug: string) => {
  return mockProjects.find(p => p.slug === slug);
};

// Helper to get icon for activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'task_completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'status_changed':
      return <Activity className="h-4 w-4 text-blue-500" />;
    case 'member_added':
      return <Users className="h-4 w-4 text-purple-500" />;
    case 'comment_added':
      return <MessageSquare className="h-4 w-4 text-yellow-500" />;
    case 'task_created':
      return <PlusCircle className="h-4 w-4 text-cyan-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
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
  const projectTasks = mockTasks.filter(task => task.projectId === project.id) || []; // Filter tasks for this project, ensure default empty array
  const projectActivities = mockActivities.filter(activity => activity.projectId === project.id); // Filter activities for this project

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const completedTasks = projectTasks.filter(t => t.status === 'done').length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : project.progress || 0;

  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskViewOpen(true);
  };

  const handleTaskStatusChange = (taskId: number, newStatus: string) => {
    // In a real app, you'd update your backend/state management here
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // For mock data, you might update mockTasks directly for immediate feedback
    // but in this stateless component, it won't persist
  };


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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert('Edit Project')}>Edit Project</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Archive Project')}>Archive Project</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Delete Project')} className="text-red-600">Delete Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <SquareStack className="h-5 w-5 text-[#fa7516]" /> Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-semibold text-foreground">{totalTasks}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-sm text-muted-foreground">Completed Tasks</span>
                <span className="font-semibold text-green-500">{completedTasks}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-sm text-muted-foreground">Remaining Tasks</span>
                <span className="font-semibold text-orange-500">{totalTasks - completedTasks}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-sm text-muted-foreground">Members Assigned</span>
                <span className="font-semibold text-foreground">{members.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-[#fa7516]" /> Tasks
              </h2>
              <AddProjectTaskDialog />
            </div>

            <div className="bg-card rounded-xl border border-border">
              {projectTasks.length > 0 ? (
                projectTasks.map((task) => (
                  <TaskRow 
                    key={task.id} 
                    task={task} 
                    onViewTask={() => handleViewTask(task)}
                    onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No tasks yet. Create your first task to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-[#fa7516]" /> Team
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
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
                      {member.role || 'Member'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {mockTasks.filter(t => t.assigneeId === member.id && t.projectId === project.id && t.status !== 'done').length} Tasks
                  </Badge>
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <AddProjectMemberDialog />
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-green-500" /> Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-muted-foreground">Total Budget:</span>
                <span className="font-medium text-foreground">${project.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-muted-foreground">Estimated Cost:</span>
                <span className="font-medium text-foreground">$45,000</span> {/* Mock data */}
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                <span className="text-muted-foreground">Variance:</span>
                <span className="font-medium text-red-500">-$5,000</span> {/* Mock data */}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-purple-500" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectActivities.length > 0 ? (
                projectActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{activity.user}</span> {activity.description}
                      <span className="text-xs ml-2 text-gray-500">{formatDistanceToNowStrict(new Date(activity.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No recent activity</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedTask && (
        <TaskView isOpen={isTaskViewOpen} onClose={() => setIsTaskViewOpen(false)} task={selectedTask} />
      )}
    </div>
  );
}