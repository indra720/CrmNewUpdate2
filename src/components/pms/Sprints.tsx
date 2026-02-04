'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Users,
  Target,
  BarChart3,
  LayoutGrid,
  Settings2,
  History,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Milestone as MilestoneIcon,
  Search,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Pencil,
  GripVertical
} from 'lucide-react';
import { format, addWeeks, addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

import {
  SprintStatus, SprintType, SprintTask, Sprint, Project, Milestone, User
} from './sprint-types';
import {
  mockProjects, mockUsers, mockMilestones, initialSprints, mockBacklogTasks, burndownData
} from './sprint-mock-data';
import { CreateSprintDialog } from '../forms/CreateSprintDialog';
import { useSearch } from '@/context/SearchContext';

// --- Sub-components ---

const TaskCard = ({ task, isSortable = true }: { task: SprintTask, isSortable?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: !isSortable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = {
    Low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    Medium: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    Urgent: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };

  const typeIcon = {
    Bug: <AlertCircle className="w-3 h-3 text-red-500" />,
    Feature: <PlusCircle className="w-3 h-3 text-blue-500" />,
    Improvement: <TrendingUp className="w-3 h-3 text-green-500" />,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-2 ${task.blocked ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColor[task.priority]}`}>
          {task.priority}
        </Badge>
      </div>
      <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {typeIcon[task.type]}
          <span className="text-[10px] text-muted-foreground">{task.type}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.assigneeId && (
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
              {mockUsers.find(u => u.id === task.assigneeId)?.name.charAt(0)}
            </div>
          )}
          <Badge variant="secondary" className="text-[10px] h-5">
            {task.storyPoints} SP
          </Badge>
        </div>
      </div>
      {task.blocked && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-medium">
          <AlertCircle className="w-3 h-3" /> Blocked
        </div>
      )}
    </div>
  );
};

const BoardColumn = ({ id, title, tasks }: { id: string, title: string, tasks: SprintTask[] }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-full min-w-[280px] bg-muted/50 dark:bg-muted/20 rounded-xl border p-3 h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const ALL_STATUSES: SprintTask['status'][] = ['Todo', 'In Progress', 'Review', 'Done'];

// --- Main Page Component ---

export function Sprints() {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(initialSprints[0]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<SprintTask[]>(mockBacklogTasks);
  const [projectBacklog, setProjectBacklog] = useState<SprintTask[]>([
    { id: 'TASK-201', title: 'Database Optimization', type: 'Improvement', priority: 'Medium', status: 'Todo', storyPoints: 3 },
    { id: 'TASK-202', title: 'Email Notification Service', type: 'Feature', priority: 'High', status: 'Todo', storyPoints: 5 },
    { id: 'TASK-203', title: 'Mobile App CI/CD', type: 'Improvement', priority: 'Low', status: 'Todo', storyPoints: 2 },
  ]);
  const [activeTab, setActiveTab] = useState('board');
  const { searchQuery } = useSearch();

  // Form State for Create Sprint
  const [newSprint, setNewSprint] = useState<Partial<Sprint>>({
    type: 'Development',
    durationWeeks: 2,
    workingDays: [1, 2, 3, 4, 5],
    status: 'Draft',
    settings: {
      allowTaskOverflow: false,
      autoClose: true,
      allowScopeChange: false,
      freezeWhenActive: true
    },
    teamMembers: [],
    capacity: {}
  });

  const { filteredTasks, boardColumns } = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    const isStatusQuery = ALL_STATUSES.some(s => s.toLowerCase().replace(' ', '') === lowerCaseQuery.replace(' ', ''));

    const tasksToShow = tasks.filter(task => {
      if (isStatusQuery) {
        return task.status.toLowerCase().replace(' ', '') === lowerCaseQuery.replace(' ', '');
      }
      return task.title.toLowerCase().includes(lowerCaseQuery);
    });

    const columnsToShow = isStatusQuery 
      ? ALL_STATUSES.filter(s => s.toLowerCase().replace(' ', '') === lowerCaseQuery.replace(' ', ''))
      : ALL_STATUSES;

    return { filteredTasks: tasksToShow, boardColumns: columnsToShow };
  }, [tasks, searchQuery]);


  // Derived Values
  const totalStoryPoints = useMemo(() => filteredTasks.reduce((sum, t) => sum + t.storyPoints, 0), [filteredTasks]);
  const completedStoryPoints = useMemo(() => filteredTasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + t.storyPoints, 0), [filteredTasks]);
  const progressPercent = activeSprint ? (completedStoryPoints / activeSprint.storyPointsTarget) * 100 : 0;

  const totalCapacity = useMemo(() => {
    return Object.values(newSprint.capacity || {}).reduce((sum, val) => sum + (val || 0), 0);
  }, [newSprint.capacity]);

  // Lifecycle handlers
  const handleStartSprint = (id: string) => {
    setSprints(prev => prev.map(s => {
      if (s.id === id) return { ...s, status: 'Active' };
      if (s.status === 'Active') return { ...s, status: 'Frozen' }; // Auto-freeze others
      return s;
    }));
  };

  const handleCompleteSprint = (id: string) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
    setActiveTab('retrospective');
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newSprint.projectId) newErrors.projectId = "Project is required";
    if (!newSprint.name) newErrors.name = "Sprint name is required";
    if (!newSprint.startDate) newErrors.startDate = "Start date is required";
    if (!newSprint.teamMembers?.length) newErrors.teamMembers = "At least one team member required";

    // Check for overlapping active sprints
    const activeExists = sprints.some(s => s.status === 'Active' && s.projectId === newSprint.projectId);
    if (activeExists && newSprint.status === 'Active') {
      newErrors.status = "Only one active sprint allowed per project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSprint = () => {
    if (!validateForm()) return;

    const sprint: Sprint = {
      ...(newSprint as Sprint),
      id: `SP-00${sprints.length + 1}`,
      number: `Sprint 0${sprints.length + 1}`,
      startDate: newSprint.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: newSprint.endDate || format(addWeeks(new Date(), newSprint.durationWeeks || 2), 'yyyy-MM-dd'),
      status: 'Planned',
      totalCapacity: totalCapacity,
    } as Sprint;
    setSprints([...sprints, sprint]);
    setIsCreateDialogOpen(false);
  };

  // Date Calculation logic
  useEffect(() => {
    if (newSprint.startDate && newSprint.durationWeeks) {
      const end = addWeeks(new Date(newSprint.startDate), newSprint.durationWeeks);
      setNewSprint(prev => ({ ...prev, endDate: format(end, 'yyyy-MM-dd') }));
    }
  }, [newSprint.startDate, newSprint.durationWeeks]);

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping into a column
    const columns: SprintTask['status'][] = ['Todo', 'In Progress', 'Review', 'Done'];
    if (columns.includes(overId as any)) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: overId as any } : t));
    }
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen p-4 sm:p-6 lg:p-2 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Projects</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground">Sprints</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sprint Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <History className="w-4 h-4" />
            Sprint History
          </Button>
          <CreateSprintDialog
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            handleCreateSprint={handleCreateSprint}
            newSprint={newSprint}
            setNewSprint={setNewSprint}
            errors={errors}
            sprintsLength={sprints.length}
            allSprints={sprints}
          />
        </div>
      </div>

      {/* Sprint Active Info Bar */}
      {activeSprint && (
        <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="p-6 md:w-1/3 bg-black/10 dark:bg-black/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 uppercase text-[10px]">
                    {activeSprint.status}
                  </Badge>
                  <span className="text-sm opacity-80">{activeSprint.number}</span>
                </div>
                <h2 className="text-xl font-bold mb-1">{activeSprint.name}</h2>
                <p className="text-sm opacity-90 line-clamp-1 italic">"{activeSprint.goal}"</p>
                <div className="flex items-center gap-4 mt-4 text-xs opacity-80">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(activeSprint.startDate), 'MMM d')} - {format(new Date(activeSprint.endDate), 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {activeSprint.storyPointsTarget} SP Target
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sprint Progress</span>
                  <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-primary-foreground/20" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div>
                    <p className="text-[10px] uppercase opacity-70 tracking-wider">Completed</p>
                    <p className="text-lg font-bold">{completedStoryPoints} <span className="text-sm font-normal opacity-70">pts</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase opacity-70 tracking-wider">Days Left</p>
                    <p className="text-lg font-bold">{differenceInDays(new Date(activeSprint.endDate), new Date())} <span className="text-sm font-normal opacity-70">days</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase opacity-70 tracking-wider">Sprint Health</p>
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-bold">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 md:w-1/4 border-l border-white/10 dark:border-primary-foreground/20 flex flex-col justify-center items-center gap-3">
                {activeSprint.status === 'Planned' && (
                  <Button className="w-full bg-primary-foreground text-primary hover:bg-slate-100" onClick={() => handleStartSprint(activeSprint.id)}>
                    Start Sprint
                  </Button>
                )}
                {activeSprint.status === 'Active' && (
                  <>
                    <Button className="w-full bg-primary-foreground text-primary hover:bg-slate-100" onClick={() => handleCompleteSprint(activeSprint.id)}>
                      Complete Sprint
                    </Button>
                    <Button variant="ghost" className="w-full text-primary-foreground hover:bg-primary-foreground/10 border border-primary-foreground/30">
                      Pause Sprint
                    </Button>
                  </>
                )}
                {activeSprint.status === 'Completed' && (
                  <Button className="w-full bg-muted text-muted-foreground" disabled>
                    Sprint Completed
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs */}
      <Tabs defaultValue="board" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <TabsList className="bg-transparent border-none w-full sm:w-auto overflow-x-auto justify-start h-auto p-1">
            <TabsTrigger value="board" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg gap-2 text-xs sm:text-sm py-2 px-3">
              <LayoutGrid className="w-4 h-4" />
              Sprint Board
            </TabsTrigger>
            <TabsTrigger value="backlog" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg gap-2 text-xs sm:text-sm py-2 px-3">
              <History className="w-4 h-4" />
              Sprint Backlog
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg gap-2 text-xs sm:text-sm py-2 px-3">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="retrospective" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg gap-2 text-xs sm:text-sm py-2 px-3" disabled={activeSprint?.status !== 'Completed'}>
              <History className="w-4 h-4" />
              Retrospective
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 px-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 4. SPRINT BOARD */}
        <TabsContent value="board" className="mt-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 h-full">
                {boardColumns.map(status => (
                  <BoardColumn key={status} title={status} id={status} tasks={filteredTasks.filter(t => t.status === status)} />
                ))}
              </div>
            </div>
          </DndContext>
        </TabsContent>

        {/* 3. SPRINT BACKLOG */}
        <TabsContent value="backlog" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sprint Items</CardTitle>
                  <CardDescription>Tasks currently committed to this sprint</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">{filteredTasks.length} Tasks</Badge>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                        <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 cursor-move" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] uppercase">{task.type}</Badge>
                            <span className="text-[10px] text-muted-foreground">{task.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Assignee</p>
                            <p className="text-xs">{mockUsers.find(u => u.id === task.assigneeId)?.name || 'Unassigned'}</p>
                          </div>
                          <div className="text-right w-12">
                            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Points</p>
                            <p className="text-xs font-bold">{task.storyPoints}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Edit Task</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setProjectBacklog([...projectBacklog, task]);
                                  setTasks(tasks.filter(t => t.id !== task.id));
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Remove from Sprint
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Project Backlog</CardTitle>
                    <CardDescription>Drag to Sprint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {projectBacklog.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 border rounded-lg bg-muted/50 hover:bg-background hover:border-primary transition-all cursor-pointer group"
                            onClick={() => {
                              if (totalStoryPoints + task.storyPoints > (activeSprint?.storyPointsTarget || 100)) {
                                alert("Warning: This task will exceed sprint capacity target!");
                              }
                              setTasks([...tasks, task]);
                              setProjectBacklog(projectBacklog.filter(t => t.id !== task.id));
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className="text-[9px] h-4">{task.priority}</Badge>
                              <Plus className="w-3 h-3 text-slate-400 group-hover:text-primary" />
                            </div>
                            <h4 className="text-xs font-medium leading-tight">{task.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] text-muted-foreground font-mono">{task.id}</span>
                              <span className="text-[9px] font-bold">{task.storyPoints} SP</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resource Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeSprint && activeSprint.teamMembers.map(memberId => {
                        const user = mockUsers.find(u => u.id === memberId);
                        const userTasks = tasks.filter(t => t.assigneeId === memberId);
                        const points = userTasks.reduce((sum, t) => sum + t.storyPoints, 0);
                        const capacity = activeSprint.capacity[memberId] || 0;
                        const load = (points * 4) / (capacity || 1) * 100; // Mock: 1 SP = 4 hours

                        return (
                          <div key={memberId} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">{user?.name}</span>
                              <span className={load > 90 ? 'text-red-600 font-bold' : 'text-muted-foreground'}>{points} SP / {capacity}h</span>
                            </div>
                            <Progress value={load} className={`h-1.5 ${load > 90 ? 'bg-red-100 dark:bg-red-900/50 [&>div]:bg-red-500' : ''}`} />
                          </div>
                        );
                      })}
                      {activeTab === 'backlog' && (
                        <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/40 p-3 rounded-lg flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                            <strong>Capacity Warning:</strong> Elena Rodriguez is currently at 110% capacity. Consider reassigning tasks.
                          </p>
                        </div>
                      )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </TabsContent>

        {/* 5. SPRINT ANALYTICS */}
        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sprint Burndown Chart</CardTitle>
                <CardDescription>Remaining effort vs Ideal progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={burndownData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <RechartsTooltip
                        contentStyle={{ 
                            background: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                      />
                      <Line type="monotone" dataKey="ideal" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" dot={false} strokeWidth={2} name="Ideal Burndown" />
                      <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} name="Actual Burndown" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="bg-foreground text-background border-none">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Sprint Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">22.4</span>
                    <span className="text-muted-foreground text-sm">pts / sprint</span>
                  </div>
                  <div className="mt-4 h-[60px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { v: 18 }, { v: 24 }, { v: 21 }, { v: 25 }, { v: 22 }
                      ]}>
                        <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="url(#colorVelocity)" fillOpacity={1} />
                        <defs>
                          <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">Calculated over the last 5 sprints</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Sprint Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Carry-over %</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">12%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Completion %</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Estimated vs Actual</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">+4.2h</Badge>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Sprint Health</span>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800/40 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Healthy</span>
                      </div>
                      <p className="text-[10px] text-green-600 dark:text-green-300 mt-1">Sprint is on track to complete all committed story points.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 6. SPRINT RETROSPECTIVE */}
        <TabsContent value="retrospective" className="mt-0">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Sprint Summary: {activeSprint?.number}</h2>
              <p className="text-muted-foreground">This sprint was completed on Feb 3, 2025. Here is the summary of work done.</p>
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">24</p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Points Done</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">92%</p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Success Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Carry Over</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-100 bg-green-50/20 dark:border-green-800/30 dark:bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> What went well?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[120px] bg-card"
                    placeholder="List the successes and achievements..."
                    defaultValue="• Team collaboration on OAuth implementation was excellent.&#10;• New automated tests caught 3 major bugs before release.&#10;• Morning standups were more focused and efficient."
                  />
                </CardContent>
              </Card>
              <Card className="border-red-100 bg-red-50/20 dark:border-red-800/30 dark:bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> What went wrong?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[120px] bg-card"
                    placeholder="List the challenges and blockers..."
                    defaultValue="• API documentation was delayed by 2 days.&#10;• One developer was out sick, causing delay in CSS fixes.&#10;• Requirements for password reset flow were slightly ambiguous."
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Action Items for Next Sprint</CardTitle>
                <Button size="sm" variant="outline" className="gap-2">
                  <PlusCircle className="w-4 h-4" /> Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Update API docs template to include edge cases',
                  'Schedule 1:1 session for requirement clarification',
                  'Review test coverage for mobile responsive components'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Checkbox id={`action-${i}`} />
                    <Label htmlFor={`action-${i}`} className="flex-1 text-sm">{item}</Label>
                    <Badge className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-none">Pending</Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button className="bg-foreground text-background">Save Retrospective</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
