'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskFormDialog } from '@/components/forms/TaskFormDialog'; // Changed import
import { cn } from '@/lib/utils';
import TaskListView from './TaskListView';
import TaskBoardView from './TaskBoardView';
import { useSearch } from '@/context/SearchContext';
import { Task, TaskViewTask, mapApiTaskToTaskView } from '@/types';
import TaskDetailsDialog from './TaskDetailsDialog'; // Added
// import DeleteConfirmationDialog from './DeleteConfirmationDialog'; // Added -- REMOVED
import { useToast } from '@/hooks/use-toast'; // Added import for useToast

async function internalDeleteTask(taskId: string): Promise<void> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    // console.error("internalDeleteTask: Authentication token not found in localStorage.");
    throw new Error("Authentication token not found. Please log in again.");
  }
  // console.log("internalDeleteTask: Auth token found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error("internalDeleteTask: NEXT_PUBLIC_API_BASE_URL is not defined.");
    throw new Error("API Base URL is not defined. Please check environment variables.");
  }
  // console.log(`internalDeleteTask: API Base URL: ${apiBaseUrl}`);

  // Extract numeric ID if it's in format "PREFIX-NUMBER" (e.g., "TASK-123" -> "123")
  let cleanId = taskId;
  if (taskId && taskId.includes('-')) {
    const parts = taskId.split('-');
    const lastPart = parts[parts.length - 1];
    if (!isNaN(Number(lastPart))) {
      cleanId = lastPart;
    }
  }

  const url = `${apiBaseUrl}/api/projects/tasks/${cleanId}/`;
  // console.log(`internalDeleteTask: Attempting DELETE request to URL: ${url} for task ID: ${taskId} (Clean ID: ${cleanId})`);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        // If parsing JSON fails, try to get plain text
        errorDetail = await response.text();
      }
      const errorMessage = `Failed to delete task ${taskId}: ${errorDetail}`;
      // console.error(`internalDeleteTask: API response error - ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // console.log(`internalDeleteTask: Task ${taskId} deleted successfully. Response status: ${response.status}`);
  } catch (error: any) {
    const errorMessage = `Network or unexpected error deleting task ${taskId}: ${error.message || "Unknown error"}`;
    // console.error(`internalDeleteTask: Catch block error - ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

type ViewMode = 'list' | 'board';
const ALL_STATUSES: TaskViewTask['status'][] = ['To Do', 'In Progress', 'Review', 'Done', 'Blocked'];

const TaskView = () => {
  const [tasks, setTasks] = useState<TaskViewTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  const { searchQuery } = useSearch();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { toast } = useToast(); // Initialize useToast

  // States for dialogs
  const [selectedTask, setSelectedTask] = useState<TaskViewTask | null>(null); // Re-added selectedTask state
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleDeleteTask = async (taskToDelete: TaskViewTask) => {
    console.log('handleDeleteTask: Starting direct deletion process.');
    if (!taskToDelete) {
      // console.warn('handleDeleteTask: taskToDelete is null, cannot proceed with deletion.');
      toast({ title: 'Error', description: 'No task selected for deletion.', variant: 'destructive' });
      return;
    }
    console.log(`handleDeleteTask: Attempting to delete task with ID: ${taskToDelete.id}, Title: ${taskToDelete.title}`);
    try {
      await internalDeleteTask(taskToDelete.id);
      // console.log('handleDeleteTask: Task deleted successfully, refetching tasks.');
      refetchTasks(); // Re-fetch tasks after successful deletion
      toast({ title: 'Success', description: `Task "${taskToDelete.title}" deleted successfully.` });
    } catch (err: any) {
      // /console.error("handleDeleteTask: Error deleting task:", err);
      toast({ title: 'Error', description: err.message || 'Failed to delete task', variant: 'destructive' });
    } finally {
      // console.log('handleDeleteTask: Deletion process finished.');
      setSelectedTask(null); // Clear selected task
    }
  };

  const refetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    console.log(`refetchTasks: Using token: ${token ? 'present' : 'missing'}`);

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/tasks/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      const apiTasks: Task[] = data.results || [];
      const mappedTasks = apiTasks.map(mapApiTaskToTaskView);
      setTasks(mappedTasks);
    } catch (err: any) {
      console.error("Failed to fetch project tasks:", err);
      setError(`Failed to fetch project tasks: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    refetchTasks();
  }, [refetchTasks]); // Now refetchTasks is a dependency

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

  // Handler for when TaskFormDialog submits (add or edit)
  const handleTaskFormSubmitted = () => {
    refetchTasks(); // Re-fetch tasks to update the list
    setIsAddTaskDialogOpen(false);
    setIsEditTaskDialogOpen(false);
    setSelectedTask(null);
  };

  // Handlers for opening dialogs
  const openEditTaskDialog = (task: TaskViewTask) => {
    setSelectedTask(task);
    setIsEditTaskDialogOpen(true);
  };

  const openViewTaskDialog = (task: TaskViewTask) => {
    setSelectedTask(task);
    setIsDetailsDialogOpen(true);
  };


  return (
    <div className="p-4 sm:p-6 space-y-6 bg-card rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage all project tasks here.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Button to open Add Task Dialog */}
          <Button size="sm" className="gap-2" onClick={() => setIsAddTaskDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
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
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
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
        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          viewMode === 'list' ? (
            <TaskListView
              tasks={filteredTasks}
              onEditTask={openEditTaskDialog}
              onViewTask={openViewTaskDialog}
              onDeleteTask={handleDeleteTask} // Direct call
            />
          ) : (
            <TaskBoardView
              tasks={filteredTasks}
              setTasks={setTasks} // This setTasks is only for DND, actual updates trigger refetch
              columns={boardColumns}
              onTaskUpdatedOrAdded={handleTaskFormSubmitted} // For updates from dialog
              onDeleteTask={handleDeleteTask}
            />
          )
        )}
      </div>
      <TaskDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        task={selectedTask}
        onEdit={() => {
          if (selectedTask) {
            openEditTaskDialog(selectedTask);
            setIsDetailsDialogOpen(false); // Close details dialog when opening edit
          }
        }}
      />
      <TaskFormDialog
        isOpen={isAddTaskDialogOpen || isEditTaskDialogOpen}
        onOpenChange={(open) => { // Changed prop name to onOpenChange
          if (!open) { // Only close if 'open' is false (dialog is closing)
            setIsAddTaskDialogOpen(false);
            setIsEditTaskDialogOpen(false);
            setSelectedTask(null);
          }
        }}
        onTaskSubmitted={handleTaskFormSubmitted}
        initialTask={selectedTask}
      />
    </div>
  );
};



export default TaskView;
