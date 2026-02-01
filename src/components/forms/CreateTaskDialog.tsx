// 'use client'
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { CalendarIcon, Plus } from 'lucide-react';
// import { format } from 'date-fns';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import { mockUsers, mockProjects } from '@/lib/mockData';

// const taskSchema = z.object({
//   title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title must be less than 100 characters'),
//   description: z.string().max(500, 'Description must be less than 500 characters').optional(),
//   projectId: z.string().min(1, 'Please select a project'),
//   assignedToId: z.string().optional(),
//   priority: z.enum(['low', 'medium', 'high']),
//   status: z.enum(['todo', 'in_progress', 'done']),
//   dueDate: z.date({ required_error: 'Due date is required' }),
// });

// type TaskFormValues = z.infer<typeof taskSchema>;

// interface CreateTaskDialogProps {
//   trigger?: React.ReactNode;
//   defaultProjectId?: string;
//   onTaskCreated?: (task: TaskFormValues) => void;
// }

// export function CreateTaskDialog({ trigger, defaultProjectId, onTaskCreated }: CreateTaskDialogProps) {
//   const [open, setOpen] = useState(false);
//   const { toast } = useToast();

//   const form = useForm<TaskFormValues>({
//     resolver: zodResolver(taskSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       projectId: defaultProjectId || '',
//       assignedToId: '',
//       priority: 'medium',
//       status: 'todo',
//     },
//   });

//   const onSubmit = (data: TaskFormValues) => {
//     console.log('Task created:', data);
    
//     toast({
//       title: "Task Created",
//       description: `"${data.title}" has been added successfully.`,
//     });

//     onTaskCreated?.(data);
//     form.reset();
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button className="gap-2">
//             <Plus className="w-4 h-4" />
//             New Task
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px] w-[calc(100%-1rem)] h-[90vh] overflow-y-auto hide-scrollbar">
//         <DialogHeader>
//           <DialogTitle>Create New Task</DialogTitle>
//           <DialogDescription>
//             Add a new task to your project. Assign team members and set priorities.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Task Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter task title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description (Optional)</FormLabel>
//                   <FormControl>
//                     <Textarea 
//                       placeholder="Describe the task..." 
//                       className="resize-none" 
//                       rows={3}
//                       {...field} 
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="projectId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Project</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select project" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {mockProjects.map((project) => (
//                         <SelectItem key={project.id} value={String(project.id)}>
//                           {project.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="assignedToId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Assign To (Optional)</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select team member" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {mockUsers.map((user) => (
//                         <SelectItem key={user.id} value={user.id}>
//                           {user.firstName} {user.lastName}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="priority"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Priority</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select priority" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="low">Low</SelectItem>
//                         <SelectItem value="medium">Medium</SelectItem>
//                         <SelectItem value="high">High</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="todo">To Do</SelectItem>
//                         <SelectItem value="in_progress">In Progress</SelectItem>
//                         <SelectItem value="done">Done</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="dueDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Due Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             "pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "MMM d, yyyy") : "Pick a date"}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex justify-end gap-3 pt-4">
//               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">Create Task</Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }





'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockProjects, mockUsers } from '@/lib/mockData';

export default function CreateTaskDialogSimple() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedToId: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 👉 yahin apna API / logic lagana
    console.log('Task Data:', formData);

    toast({
      title: 'Task Created',
      description: 'Task successfully added',
    });

    setFormData({
      title: '',
      description: '',
      projectId: '',
      assignedToId: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <Select
            value={formData.projectId}
            onValueChange={(v) => handleChange('projectId', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {mockProjects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.assignedToId}
            onValueChange={(v) => handleChange('assignedToId', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign To (optional)" />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              value={formData.priority}
              onValueChange={(v) => handleChange('priority', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.status}
              onValueChange={(v) => handleChange('status', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
