
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Loader,
  User,
  Tag,
  CircleCheck,
  AlertTriangle,
  Pencil,
} from 'lucide-react';
import { TaskViewTask } from '@/types';
import { Button } from '@/components/ui/button';

interface TaskDetailsDialogProps {
  task: TaskViewTask | null;
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onClose?: () => void;
  onEdit?: () => void;
}

/* ------------------ ICON MAPS ------------------ */

const statusIcons = {
  'To Do': <Clock className="h-4 w-4 text-muted-foreground" />,
  'In Progress': <Loader className="h-4 w-4 animate-spin text-blue-500" />,
  'Done': <CircleCheck className="h-4 w-4 text-green-600" />,
};

const priorityIcons = {
  low: <CircleCheck className="h-4 w-4 text-gray-400" />,
  medium: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  high: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

const priorityVariant: {
  [key in TaskViewTask['priority']]: 'destructive' | 'default' | 'secondary';
} = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

/* ------------------ SMALL UI BLOCK ------------------ */

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="rounded-xl border bg-white p-4 shadow-sm space-y-1">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-sm font-semibold">{value}</div>
  </div>
);

/* ------------------ MAIN COMPONENT ------------------ */

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  task,
  isOpen,
  onOpenChange,
  onClose,
  onEdit,
}) => {
  if (!task) return null;

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open);
    if (!open && onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-gray-50 to-white">
        {/* ---------- HEADER ---------- */}
        <DialogHeader className="space-y-3 relative">
          {onEdit && (
            <div className="absolute right-8 top-0">
               <Button variant="ghost" size="sm" onClick={onEdit} className="gap-2">
                 <Pencil className="h-4 w-4" />
                 Edit
               </Button>
            </div>
          )}
          <DialogTitle className="text-2xl font-bold leading-tight pr-12">
            {task.title}
          </DialogTitle>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={task.status === 'Done' ? 'default' : 'outline'}
              className="flex items-center gap-1"
            >
              {statusIcons[task.status]}
              {task.status}
            </Badge>

            <Badge
              variant={priorityVariant[task.priority]}
              className="flex items-center gap-1 capitalize"
            >
              {priorityIcons[task.priority]}
              {task.priority}
            </Badge>
          </div>

          <DialogDescription>
            Task ID: <span className="font-medium">{task.id}</span>
          </DialogDescription>
        </DialogHeader>

        {/* ---------- META INFO ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="Due Date"
            value={format(task.dueDate, 'MMM d, yyyy')}
          />

          <InfoCard
            icon={<User className="h-4 w-4" />}
            label="Assignee"
            value={
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>
                    {task.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{task.assignee.name}</span>
              </div>
            }
          />
        </div>

        {/* ---------- DESCRIPTION ---------- */}
        {task.description && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Description
            </h4>
            <div className="rounded-xl border bg-white p-4 text-sm leading-relaxed shadow-sm">
              {task.description}
            </div>
          </div>
        )}

        {/* ---------- TAGS ---------- */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;

