// 'use client';
// import React from 'react';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Task } from '@/lib/mock-tasks';
// import { format } from 'date-fns';
// import { Calendar, Clock, Loader, User, Tag, CircleCheck, AlertTriangle } from 'lucide-react';

// interface TaskDetailsDialogProps {
//   task: Task | null;
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// const statusIcons = {
//   'To Do': <Clock className="h-4 w-4" />,
//   'In Progress': <Loader className="h-4 w-4 animate-spin" />,
//   'Done': <CircleCheck className="h-4 w-4 text-green-500" />,
// };

// const priorityIcons = {
//   'low': <CircleCheck className="h-4 w-4 text-gray-500" />,
//   'medium': <AlertTriangle className="h-4 w-4 text-yellow-500" />,
//   'high': <AlertTriangle className="h-4 w-4 text-red-500" />,
// }

// const priorityVariant: { [key in Task['priority']]: 'destructive' | 'default' | 'secondary' } = {
//   'high': 'destructive',
//   'medium': 'default',
//   'low': 'secondary',
// };

// const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
//   <div>
//     <h4 className="text-sm font-semibold text-muted-foreground flex items-center mb-1">
//       {icon}
//       <span className="ml-2">{label}</span>
//     </h4>
//     <div className="text-md font-medium">{value}</div>
//   </div>
// );

// const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({ task, isOpen, onOpenChange }) => {
//   if (!task) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl w-[calc(100%-1rem)] max-h-[90vh] overflow-y-auto hide-scrollbar">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold pr-12">{task.title}</DialogTitle>
//           <DialogDescription>
//             Details for task #{task.id}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-6 pt-4 pb-2">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//             <DetailItem
//               icon={statusIcons[task.status]}
//               label="Status"
//               value={<Badge variant={task.status === 'Done' ? 'default' : 'outline'} className="text-sm">{task.status}</Badge>}
//             />
//             <DetailItem
//               icon={priorityIcons[task.priority]}
//               label="Priority"
//               value={<Badge variant={priorityVariant[task.priority]} className="capitalize text-sm">{task.priority}</Badge>}
//             />
//             <DetailItem
//               icon={<Calendar className="h-4 w-4" />}
//               label="Due Date"
//               value={format(task.dueDate, 'MMM d, yyyy')}
//             />
//             <DetailItem
//               icon={<User className="h-4 w-4" />}
//               label="Assignee"
//               value={
//                 <div className="flex items-center gap-2">
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={task.assignee.avatar} />
//                     <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <span>{task.assignee.name}</span>
//                 </div>
//               }
//             />
//           </div>
//           {task.description && (
//             <div>
//               <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
//               <p className="text-md bg-gray-50 p-3 rounded-md border">{task.description}</p>
//             </div>
//           )}
//           {task.tags && task.tags.length > 0 && (
//             <DetailItem
//               icon={<Tag className="h-4 w-4" />}
//               label="Tags"
//               value={
//                 <div className="flex flex-wrap gap-2">
//                   {task.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
//                 </div>
//               }
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TaskDetailsDialog;





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
} from 'lucide-react';
import { Task } from '@/lib/mock-tasks';

interface TaskDetailsDialogProps {
  task: Task | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
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
  [key in Task['priority']]: 'destructive' | 'default' | 'secondary';
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
}) => {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-gray-50 to-white">
        {/* ---------- HEADER ---------- */}
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold leading-tight">
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

