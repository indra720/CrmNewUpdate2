'use client';

import { TaskBoardView } from '@/components/pms/TaskBoardView';
import { useState, useEffect } from 'react';
import { mockProjects, mockProjectMembers, mockTasks } from '@/lib/mockData';
import { Task } from '@/lib/mock-tasks'; // Assuming Task type is needed here

export default function TeamLeaderTasksPage() {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setCurrentUserRole(role);
    setCurrentUserId(userId);

    let tasksToSet: Task[] = [];

    if (role === 'admin' || role === 'superadmin') {
      tasksToSet = mockTasks;
    } else if (role === 'team-leader' && userId) {
      // Find projects the team leader is part of
      const teamLeaderProjectIds = mockProjectMembers
        .filter(member => member.id === userId)
        .map(member => member.projectId);

      // Filter tasks that belong to these projects
      tasksToSet = mockTasks.filter(task => teamLeaderProjectIds.includes(task.projectId));
    }
    // For other roles or if not logged in, tasksToSet remains empty

    setDisplayTasks(tasksToSet);
    setIsLoading(false);
  }, []);

  const handleSetTasks = (newTasks: React.SetStateAction<Task[]>) => {
    setDisplayTasks(newTasks);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  if (!currentUserRole || !currentUserId) {
    return (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
            You are not authorized to view this page.
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Tasks</h1>
      <TaskBoardView tasks={displayTasks} setTasks={handleSetTasks} />
    </div>
  );
}
