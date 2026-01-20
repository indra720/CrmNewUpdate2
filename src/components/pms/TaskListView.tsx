'use client';
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

import { Task } from '@/lib/mock-tasks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskListViewProps {
  tasks: Task[];
}

const statusVariant: { [key in Task['status']]: 'default' | 'secondary' | 'outline' } = {
  'To Do': 'secondary',
  'In Progress': 'default',
  'Done': 'outline',
};


const priorityVariant: { [key in Task['priority']]: 'destructive' | 'default' | 'secondary' } = {
  'high': 'destructive',
  'medium': 'default',
  'low': 'secondary',
};

const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {
  const handleActionClick = (action: string, task: Task) => {
    // In a real app, you'd trigger a dialog, drawer, or API call here
    console.log(`${action} clicked for task:`, task.id);
    if (action === 'View Details') {
      alert(`Viewing details for ${task.title}`);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20px] sm:w-[50px]"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Priority</TableHead>
            <TableHead className="hidden sm:table-cell">Assignee</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-medium text-muted-foreground">{task.id.split('-')[1]}</TableCell>
                <TableCell>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    Due: {format(task.dueDate, 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={statusVariant[task.status]}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant={priorityVariant[task.priority]} className='capitalize'>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{task.assignee.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleActionClick('View Details', task)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick('Edit Task', task)}>
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleActionClick('Delete Task', task)}
                      >
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No tasks found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskListView;
