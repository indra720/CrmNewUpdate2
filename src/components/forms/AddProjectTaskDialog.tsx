'use client';

import { fetchProjects, fetchProjectMembersForProjectCard, fetchSprints, fetchMilestones, createTask } from '@/lib/api';
import { Project, Sprint, Milestone, ProjectMember } from '@/types';
import { z } from 'zod';
import { CalendarIcon, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const addTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional(),
  assignee: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  tags: z.string().optional(),
  sprint: z.string().optional(),
  milestone: z.string().optional(),
  project: z.string().min(1, 'Project is required.'),
});

type AddTaskFormValues = z.infer<typeof addTaskSchema>;

interface AddProjectTaskDialogProps {
  onTaskAdd: (data: AddTaskFormValues) => void;
}

const statusMap = {
  "To Do": "todo",
  "In Progress": "in_progress",
  "Done": "done",
} as const;


export function AddProjectTaskDialog({ onTaskAdd }: AddProjectTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddTaskFormValues>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'To Do',
      tags: '',
      sprint: '',
      milestone: '',
      project: '',
    },
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [assignees, setAssignees] = useState<ProjectMember[]>([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);
  const [assigneeError, setAssigneeError] = useState<string | null>(null);

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [sprintError, setSprintError] = useState<string | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [milestoneError, setMilestoneError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const selectedProject = useWatch({
    control: form.control,
    name: "project",
  });



  // Fetch Projects when dialog opens
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
      form.reset();
      setProjects([]);
      setAssignees([]);
      setSprints([]);
      setMilestones([]);
      setLoadingProjects(true);
      setLoadingAssignees(false);
      setLoadingSprints(false);
      setLoadingMilestones(false);
      setProjectError(null);
      setAssigneeError(null);
      setSprintError(null);
      setMilestoneError(null);
      return;
    }

    const loadProjects = async () => {
      setLoadingProjects(true);
      setProjectError(null);
      try {


        const data = await fetchProjects();
        setProjects(data);
        if (data.length > 0) {
          form.reset({
            ...form.getValues(),
            project: data[0].id,
          });
        }
      } catch (err: any) {
        setProjectError(err.message || 'Failed to load projects');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load projects',
          variant: 'destructive',
        });
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [open, form, toast]);

  // Fetch dependent data (assignees, sprints, milestones) when project changes
  useEffect(() => {

    if (!selectedProject || !open) return;

    let isCurrent = true;

    const loadDependentData = async () => {
      setLoadingAssignees(true);
      setLoadingSprints(true);
      setLoadingMilestones(true);

      try {
        const [assigneeData, sprintData, milestoneData] = await Promise.all([
          fetchProjectMembersForProjectCard(selectedProject),
          fetchSprints(selectedProject),
          fetchMilestones(selectedProject),
        ]);

        if (!isCurrent) return;

        const transformedAssignees = assigneeData.map((member: any) => ({
          ...member,
          value: String(member.id),
          label: member.user_name,
        }));

        setAssignees(transformedAssignees);
        const filteredSprints = sprintData.filter(
          (s: any) => s.project === selectedProject
        );

        setSprints(filteredSprints);

        const filteredMilestones = milestoneData.filter(
          (m: any) => m.project === selectedProject
        );

        setMilestones(filteredMilestones);

        if (transformedAssignees.length > 0) {
          form.setValue('assignee', String(transformedAssignees[0].value));
        }

        if (sprintData.length > 0) {
          form.setValue('sprint', String(sprintData[0].id));
        }

        if (milestoneData.length > 0) {
          form.setValue('milestone', String(milestoneData[0].id));
        }

      } catch (err) {
        console.log("Dependent fetch error:", err);
      } finally {
        if (isCurrent) {
          setLoadingAssignees(false);
          setLoadingSprints(false);
          setLoadingMilestones(false);
        }
      }
    };

    loadDependentData();

    return () => {
      isCurrent = false;
    };

  }, [selectedProject]); // ⭐ ONLY THIS


  const onSubmit = async (data: AddTaskFormValues) => {
    setIsSubmitting(true);
    try {
      const assignedToMember = assignees.find((m) => m.id === data.assignee);
      const assignedToUserId = assignedToMember?.user;

      const payload = {
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        status: statusMap[data.status],
        due_date: format(data.dueDate, 'yyyy-MM-dd'),
        project: data.project,
        assigned_to: assignedToUserId ?? null,
        sprint: data.sprint || null,
        milestone: data.milestone || null,
      };


      await createTask(payload);

      toast({
        title: 'Task Created',
        description: `Task "${data.title}" added successfully.`,
      });

      onTaskAdd(data);
      setOpen(false);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create task',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] w-[calc(100%-1rem)] max-h-[90vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Project */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project *</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);

                      // CLEAR OLD DATA 
                      setAssignees([]);
                      setSprints([]);
                      setMilestones([]);

                      form.setValue('assignee', '');
                      form.setValue('sprint', '');
                      form.setValue('milestone', '');
                    }}

                    value={field.value}
                    disabled={loadingProjects || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingProjects
                              ? 'Loading projects...'
                              : projectError
                                ? 'Error loading projects'
                                : 'Select project'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Implement login screen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details..." className="resize-y min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status + Assignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingAssignees || !selectedProject || isSubmitting}


                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingAssignees
                                ? 'Loading members...'
                                : assigneeError
                                  ? 'Error loading'
                                  : 'Select assignee'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignees.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sprint + Milestone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sprint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprint</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingSprints || !selectedProject || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingSprints
                                ? 'Loading sprints...'
                                : sprintError
                                  ? 'Error loading'
                                  : 'Select sprint (optional)'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sprints.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}
                          >
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="milestone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingMilestones || !selectedProject || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingMilestones
                                ? 'Loading milestones...'
                                : milestoneError
                                  ? 'Error loading'
                                  : 'Select milestone (optional)'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {milestones.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}
                          >
                            {m.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Priority + Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-1.5">Due Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="frontend, urgent, api" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}