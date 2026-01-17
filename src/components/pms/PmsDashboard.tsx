'use client';
import { FolderKanban, CheckSquare, Users, Clock } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProjectCard } from './ProjectCard';
import { TaskRow } from './TaskRow';
import { mockProjects, mockTasks, mockProjectMembers } from '@/lib/mockData';

export const PmsDashboard = () => {
  const recentProjects = mockProjects.slice(0, 4);
  const recentTasks = mockTasks.filter(t => t.status !== 'done').slice(0, 5);

  const stats = {
    totalProjects: mockProjects.length,
    activeTasks: mockTasks.filter(t => t.status === 'in_progress').length,
    completedTasks: mockTasks.filter(t => t.status === 'done').length,
    teamMembers: 4,
  };

  return (
    <div className="space-y-8 bg-card rounded-md p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={CheckSquare}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon={Clock}
          trend={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
            <a href="/admin/project/all" className="text-sm text-white hover:underline bg-[#fa7516] p-2 rounded-md">
              View all
            </a>
          </div>
          <div className="grid gap-4">
            {recentProjects.slice(0, 2).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={mockProjectMembers.filter(m => m.projectId === project.id)}
              />
            ))}
          </div>
        </section>

        {/* Recent Tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Active Tasks</h2>
            <a href="/admin/tasks" className="text-sm text-white hover:underline bg-[#fa7516] p-2 rounded-md">
              View all
            </a>
          </div>
          <div className="bg-card rounded-xl border border-border">
            {recentTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
            {recentTasks.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No active tasks
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
