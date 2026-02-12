  'use client'
  import React from 'react';
  import { MoreHorizontal } from 'lucide-react';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Checkbox } from '@/components/ui/checkbox';
  import { cn } from '@/lib/utils';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';

  interface TaskRowProps {
    task: any; // You should replace 'any' with a proper Task type if available
    onViewTask: () => void;
    onStatusChange: (newStatus: 'To Do' | 'In Progress' | 'Done') => void;
  }

  export const TaskRow: React.FC<TaskRowProps> = ({ task, onViewTask, onStatusChange }) => {
    const isDone = task.status === 'Done';

    const priorityVariant = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline',
    };

    const statusVariant = {
      'Done': 'default',
      'In Progress': 'secondary',
      'To Do': 'outline',
    }

    return (
      <div className={cn(
        "group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-all",
        isDone && "text-muted-foreground"
      )}>
        {/* --- Checkbox & Title --- */}
        <div className="flex items-center gap-4 flex-1 min-w-0" onClick={onViewTask} role="button">
          <Checkbox checked={isDone} onCheckedChange={(checked) => onStatusChange(checked ? 'Done' : 'To Do')} className="flex-shrink-0" />
          <span className={cn("font-medium text-sm", isDone && "line-through")}>
            {task.title}
          </span>
        </div>

        {/* --- Badges & Actions --- */}
        <div className="flex items-center gap-3 pl-8 sm:pl-0 sm:ml-auto">
          <Badge variant={statusVariant[task.status] || 'default'} className="capitalize w-24 justify-center">
            {task.status}
          </Badge>
          <Badge variant={priorityVariant[task.priority] || 'default'} className="capitalize w-20 justify-center hidden sm:flex">
            {task.priority}
          </Badge>
          
          <DropdownMenu>
              {/* <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="sm:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
              </DropdownMenuTrigger> */}
              {/* <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onViewTask}>View Task</DropdownMenuItem>
                  <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => onStatusChange('To Do')}>To Do</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange('In Progress')}>In Progress</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange('Done')}>Done</DropdownMenuItem>
                      </DropdownMenuSubContent>
                  </DropdownMenuSub>
              </DropdownMenuContent> */}
          </DropdownMenu>
        </div>
      </div>
    );
  };
