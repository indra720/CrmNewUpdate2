'use client';

import TaskBoardView from '@/components/pms/TaskBoardView';
import { mockTasks } from '@/lib/mockData'; // Assuming mockTasks is available globally for superadmin
import { Task } from '@/lib/mock-tasks'; // Assuming Task type is needed here
import { useState } from 'react';


export default function SuperadminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks); // For superadmin, initially all mock tasks

  const handleSetTasks = (newTasks: React.SetStateAction<Task[]>) => {
    if (Array.isArray(newTasks)) {
      setTasks(newTasks);
    } else {
      setTasks(prevTasks => newTasks(prevTasks));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Tasks</h1>
      <TaskBoardView tasks={tasks} setTasks={handleSetTasks} />
    </div>
  );
}