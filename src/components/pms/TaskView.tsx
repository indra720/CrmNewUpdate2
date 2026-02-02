'use client';
import React, { useMemo, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { mockTasks, Task } from '@/lib/mock-tasks';
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
import { useSearch } from '@/context/SearchContext';

type ViewMode = 'list' | 'board';
const ALL_STATUSES: Task['status'][] = ['To Do', 'In Progress', 'Done'];

const TaskView = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  
  const { searchQuery } = useSearch();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const { filteredTasks, boardColumns } = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    const isStatusQuery = ALL_STATUSES.some(s => s.toLowerCase() === lowerCaseQuery);

    const tasksToShow = tasks.filter(task => {
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesStatusFilter = statusFilter === 'all' || task.status === statusFilter;

      if (isStatusQuery) {
        return task.status.toLowerCase() === lowerCaseQuery && matchesPriority;
      }
      
      const matchesSearch = task.title.toLowerCase().includes(lowerCaseQuery);
      return matchesSearch && matchesStatusFilter && matchesPriority;
    });

    const columnsToShow = isStatusQuery 
      ? ALL_STATUSES.filter(s => s.toLowerCase() === lowerCaseQuery)
      : ALL_STATUSES;

    return { filteredTasks: tasksToShow, boardColumns: columnsToShow };
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

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
    <div className="p-4 sm:p-6 space-y-6 bg-card rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage all project tasks here.</p>
        </div>
        <div className="flex items-center gap-2">
          <AddProjectTaskDialog onTaskAdd={onTaskAdd} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn('h-8', viewMode === 'list' && 'bg-background shadow')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('board')}
            className={cn('h-8', viewMode === 'board' && 'bg-background shadow')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        {viewMode === 'list' ? (
          <TaskListView tasks={filteredTasks} />
        ) : (
          <TaskBoardView tasks={filteredTasks} setTasks={setTasks} columns={boardColumns} />
        )}
      </div>
    </div>
  );
};

export default TaskView;
