'use client'
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export const TaskRow = ({ task }) => {
  const isDone = task.status === 'done';

  const priorityVariant = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
  };

  const statusVariant = {
    done: 'default',
    in_progress: 'secondary',
    todo: 'outline',
  }

  return (
    <div className={cn(
      "group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-all",
      isDone && "text-muted-foreground"
    )}>
      {/* --- Checkbox & Title --- */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Checkbox checked={isDone} className="flex-shrink-0" />
        <span className={cn("font-medium text-sm", isDone && "line-through")}>
          {task.title}
        </span>
      </div>

      {/* --- Badges & Actions --- */}
      <div className="flex items-center gap-3 pl-8 sm:pl-0 sm:ml-auto">
        <Badge variant={statusVariant[task.status] || 'default'} className="capitalize w-24 justify-center">
          {task.status.replace('_', ' ')}
        </Badge>
        <Badge variant={priorityVariant[task.priority] || 'default'} className="capitalize w-20 justify-center hidden sm:flex">
          {task.priority}
        </Badge>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="sm:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
