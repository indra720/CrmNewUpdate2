'use client';
import React, { useMemo, useState } from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';

import { mockTasks, Task } from '@/lib/mock-tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddProjectTaskDialog } from '../forms/AddProjectTaskDialog';
import { cn } from '@/lib/utils';
import TaskListView from './TaskListView';
import TaskBoardView from './TaskBoardView';

type ViewMode = 'list' | 'board';

const TaskView = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('board'); // Default to board view
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Memoized filtering logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const onTaskAdd = (newTaskData: {
    title: string;
    description?: string;
    assignee: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
    tags?: string;
  }) => {
    const newTags = newTaskData.tags ? newTaskData.tags.split(',').map(tag => tag.trim()) : [];
    const fullTask: Task = {
      id: `TASK-${Math.floor(Math.random() * 1000)}`,
      title: newTaskData.title,
      description: newTaskData.description,
      status: newTaskData.status,
      priority: newTaskData.priority,
      assignee: { name: newTaskData.assignee }, 
      dueDate: newTaskData.dueDate,
      tags: newTags,
    };
    setTasks(prev => [fullTask, ...prev]);
  };


  return (
    <div className="p-4 sm:p-6 space-y-6 bg-white rounded-lg shadow-sm">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage all project tasks here.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* We will pass the onTaskAdd function to the dialog later */}
          <AddProjectTaskDialog onTaskAdd={onTaskAdd} />
        </div>
      </div>

      {/* Filters and View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks by title..." 
            className="pl-8" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn('h-8', viewMode === 'list' && 'bg-white shadow')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('board')}
              className={cn('h-8', viewMode === 'board' && 'bg-white shadow')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {viewMode === 'list' ? (
          <TaskListView tasks={filteredTasks} />
        ) : (
          <TaskBoardView tasks={filteredTasks} setTasks={setTasks} />
        )}
      </div>
    </div>
  );
};

export default TaskView;
