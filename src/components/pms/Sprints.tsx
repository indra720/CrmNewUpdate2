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
  mockProjects, mockUsers, mockMilestones, initialSprints, mockBacklogTasks
} from './sprint-mock-data';
import { CreateSprintDialog } from '../forms/CreateSprintDialog'; // Keep import
import { useSearch } from '@/context/SearchContext';
import { fetchSprints, fetchProjectBacklogTasks, fetchSprintBurndownData, fetchSprintCapacityVelocity, SprintCapacityVelocityResponse } from '@/lib/api';
import { Task } from '@/types'; // Revert to original import
import { useRouter } from 'next/navigation';

interface BurndownDataPoint {
  day: string;
  ideal: number;
  actual: number;
}


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

const ALL_STATUSES: SprintTask['status'][] = ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'];

// Helper to map API Task to SprintTask
const mapTaskToSprintTask = (apiTask: Task): SprintTask => {
  // Map API status to SprintTask status
  let sprintTaskStatus: SprintTask['status'];
  switch (apiTask.status) {
    case 'todo':
      sprintTaskStatus = 'Todo';
      break;

    case 'in_progress':
      sprintTaskStatus = 'In Progress';
      break;

    case 'review':
      sprintTaskStatus = 'Review';
      break;

    case 'done':
      sprintTaskStatus = 'Done';
      break;

    case 'blocked': // ⭐ IMPORTANT
      sprintTaskStatus = 'Blocked'; // Set to 'Blocked' instead of 'Todo'
      break;

    default:
      sprintTaskStatus = 'Todo';
  }


  // Map API priority to SprintTask priority
  let sprintTaskPriority: SprintTask['priority'];
  switch (apiTask.priority) {
    case 'low': sprintTaskPriority = 'Low'; break;
    case 'medium': sprintTaskPriority = 'Medium'; break;
    case 'high': sprintTaskPriority = 'High'; break;
    case 'critical': sprintTaskPriority = 'Urgent'; break; // Map 'critical' to 'Urgent'
    default: sprintTaskPriority = 'Medium';
  }

  // Convert estimated_hours to storyPoints (e.g., 1 SP = 4 hours, or a default)
  const storyPoints = apiTask.estimated_hours
    ? Math.max(1, Math.round(apiTask.estimated_hours / 4))
    : 1;
  // Assuming 1 SP = 4 hours, default to 0

  // Map assigned_to (number) to assigneeId (string)
  const assigneeId = apiTask.assigned_to ? String(apiTask.assigned_to) : undefined;

  let type: SprintTask['type'] = 'Feature'; // Default to Feature, as API Task doesn't have this directly
  // Additional logic could be added here to infer 'type' from task title/description if a pattern exists.

  return {
    id: apiTask.id,
    title: apiTask.title,
    type: type,
    priority: sprintTaskPriority,
    status: sprintTaskStatus,
    assigneeId: assigneeId,
    storyPoints: storyPoints,
    blocked: apiTask.status === 'blocked', // Set blocked based on API status
    sprintId: apiTask.sprint || undefined, // Add sprintId from API task
  };
};

// --- Main Page Component ---

export function Sprints({ isHistoryView = false }: { isHistoryView?: boolean }) {
  const [sprints, setSprints] = useState<Sprint[]>([]); // Initialize with empty array
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null); // Initialize with null
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<SprintTask[]>([]); // Restore mock tasks
  const [projectBacklog, setProjectBacklog] = useState<SprintTask[]>([]); // Restore mock project backlog
  const [activeTab, setActiveTab] = useState('backlog');
  const [isLoadingSprints, setIsLoadingSprints] = useState(true); // New loading state for sprints
  const [sprintsError, setSprintsError] = useState<string | null>(null); // New error state for sprints
  const [burndownChartData, setBurndownChartData] = useState<BurndownDataPoint[]>([]);
  const [isLoadingBurndown, setIsLoadingBurndown] = useState(false);
  const [capacityVelocityData, setCapacityVelocityData] = useState<SprintCapacityVelocityResponse | null>(null);
  const [isLoadingCapacityVelocity, setIsLoadingCapacityVelocity] = useState(false);
  const { searchQuery } = useSearch();

  const router = useRouter();
  const handleNavigateHistory = () => {
    if (activeSprint) {
      router.push(`/admin/project/sprint-history?sprintId=${activeSprint.id}`);
    } else {
      // Optionally handle the case where no active sprint is selected
      // For now, navigate to a general history page or show a message
      router.push(`/admin/project/sprint-history`);
    }
  }
  // Function to load sprints from API, made reusable
  const loadSprints = async () => {
    setIsLoadingSprints(true);
    setSprintsError(null);
    try {
      const fetchedSprints: Sprint[] = await fetchSprints();
      setSprints(fetchedSprints);
      // Set an active sprint, e.g., the first 'Active' one or the first in the list
      if (fetchedSprints.length > 0) {
        const active = fetchedSprints.find(s => s.status === 'Active') || fetchedSprints[0];
        setActiveSprint(active || null); // Ensure activeSprint is never undefined
      }
    } catch (err: any) {
      setSprintsError(err.message || "Failed to fetch sprints.");
    } finally {
      setIsLoadingSprints(false);
    }
  };
  const loadBurndownData = async () => {
    if (!activeSprint || activeTab !== 'analytics') {
      setBurndownChartData([]); // Clear data if no active sprint or not on analytics tab
      return;
    }
    setIsLoadingBurndown(true);
    try {
      const response = await fetchSprintBurndownData(activeSprint.id);
      // Assuming `response.dates` and `response.remaining_tasks` are arrays of the same length
      if (response && response.dates && response.remaining_tasks && activeSprint.story_points_target !== undefined) {
        const sprintDuration = response.dates.length;
        const targetPoints = activeSprint.story_points_target;
        const transformedData: BurndownDataPoint[] = response.dates.map((dateStr, index) => {
          const idealRemaining = Math.max(0, targetPoints - (targetPoints / sprintDuration) * index); // Linear ideal burndown
          return {
            day: format(new Date(dateStr), 'MMM d'), // Format date for display
            ideal: parseFloat(idealRemaining.toFixed(1)), // Keep one decimal for ideal
            actual: response.remaining_tasks[index],
          };
        });
        setBurndownChartData(transformedData);
      } else {

        setBurndownChartData([]); // Clear data if response is invalid

      }

    } catch (error) {

      console.error("Failed to fetch burndown data:", error);

      setBurndownChartData([]);

    } finally {

      setIsLoadingBurndown(false);

    }

  };

  const loadCapacityVelocityData = async () => {
    if (!activeSprint || activeTab !== 'analytics') {
      setCapacityVelocityData(null);
      return;
    }
    setIsLoadingCapacityVelocity(true);
    try {
      const response = await fetchSprintCapacityVelocity(activeSprint.id);
      setCapacityVelocityData(response);
    } catch (error) {
      console.error("Failed to fetch capacity and velocity data:", error);
      setCapacityVelocityData(null);
    } finally {
      setIsLoadingCapacityVelocity(false);
    }

  };



  // Effect to load sprints on component mount

  useEffect(() => {

    loadSprints();

  }, []); // Empty dependency array means this runs once on mount



  // Effect to load project backlog tasks when activeSprint changes

  useEffect(() => {

    if (activeSprint && activeSprint.project) {

      const loadProjectBacklog = async () => {

        try {

                    const fetchedApiTasks = await fetchProjectBacklogTasks(activeSprint.project);

                    console.log("Fetched API Tasks:", fetchedApiTasks); // Log fetched raw API tasks

          

                    const mappedAllProjectTasks = fetchedApiTasks.map(mapTaskToSprintTask);

                    console.log("Mapped All Project Tasks:", mappedAllProjectTasks); // Log tasks after mapping

          

                    // Apply new filter: exclude tasks with status 'Done'

                    const filteredMappedTasks = mappedAllProjectTasks.filter(task => task.status !== 'Done');

                    console.log("Filtered Mapped Tasks (excluding Done):", filteredMappedTasks); // Log tasks after excluding 'Done'

                    

                    // Filter tasks for the active sprint (Sprint Items)

                    const sprintItems = filteredMappedTasks.filter(task => task.sprintId === activeSprint.id);

                    setTasks(sprintItems); // Populate 'tasks' state for Sprint Items

                    console.log("Sprint Items (tasks for active sprint):", sprintItems); // Log sprint items

                    // Filter tasks not assigned to the active sprint (Project Backlog)

                    const projectBacklogItems = filteredMappedTasks.filter(

                      task => task.sprintId !== activeSprint.id

                    );

          

                    setProjectBacklog(projectBacklogItems); // Populate 'projectBacklog' state for Project Backlog

                    console.log("Project Backlog Items (not in active sprint):", projectBacklogItems); // Log project backlog items



        } catch (err: any) {



          // Handle error state for project backlog if needed

        }

      };

      loadProjectBacklog();

    } else {

      // Clear tasks and backlog if no active sprint or project is selected/available

      setTasks([]); // Clear sprint items

      setProjectBacklog([]); // Clear project backlog

    }

  }, [activeSprint]); // Dependency array includes activeSprint



  useEffect(() => {
    console.log("ACTIVE SPRINT FULL:", activeSprint);
  }, [activeSprint]);



  // Effect to load burndown data when activeSprint or activeTab changes

  useEffect(() => {

    loadBurndownData();

    loadCapacityVelocityData(); // Load capacity/velocity data here

  }, [activeSprint, activeTab]);



  // newSprint and errors state are now managed inside CreateSprintDialog.tsx
  // No need for these states here anymore.


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
  const progressPercent = activeSprint && activeSprint.story_points_target > 0 ? (completedStoryPoints / activeSprint.story_points_target) * 100 : 0;

  const progressBarColorClass = useMemo(() => {
    if (progressPercent < 40) return 'bg-red-500';
    if (progressPercent < 70) return 'bg-orange-500';
    return 'bg-green-500';
  }, [progressPercent]);

  // This function now receives *validated* sprint data from CreateSprintDialog
  const handleSaveNewSprint = async (sprintData: Partial<Sprint>) => { // Make async
    // After successfully creating a sprint, re-fetch the entire list
    // This ensures the local state is in sync with the backend
    await loadSprints(); // Re-fetch all sprints
    setIsCreateDialogOpen(false); // Close dialog
  };


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
    const columns: SprintTask['status'][] = ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'];
    if (columns.includes(overId as any)) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: overId as any } : t));
    }
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen p-2 space-y-8">
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
          <Button variant="outline" className="gap-2" onClick={handleNavigateHistory}>
            <History className="w-4 h-4" />
            Sprint History
          </Button>
          {/* CreateSprintDialog now receives the onSaveSprint prop */}
          <CreateSprintDialog
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            onSaveSprint={handleSaveNewSprint} // Pass the new handler
            sprintsLength={sprints.length}
            allSprints={sprints} // Still needed for cross-sprint validation
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
                  <span className="text-sm opacity-80">{activeSprint.sprint_number}</span>
                </div>
                <h2 className="text-xl font-bold mb-1">{activeSprint.name}</h2>
                <p className="text-sm opacity-90 line-clamp-1 italic">"{activeSprint.goal}"</p>
                <div className="flex items-center gap-4 mt-4 text-xs opacity-80">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {activeSprint.start_date && activeSprint.end_date ? `${format(new Date(activeSprint.start_date), 'MMM d')} - ${format(new Date(activeSprint.end_date), 'MMM d')}` : 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {activeSprint.story_points_target} SP Target
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sprint Progress</span>
                  <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <Progress
                  value={progressPercent}
                  className={`h-2 bg-primary-foreground/20 [&>div]:${progressBarColorClass}`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div>
                    <p className="text-[10px] uppercase opacity-70 tracking-wider">Completed</p>
                    <p className="text-lg font-bold">{completedStoryPoints} <span className="text-sm font-normal opacity-70">pts</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase opacity-70 tracking-wider">Days Left</p>
                    <p className="text-lg font-bold">{activeSprint.end_date ? differenceInDays(new Date(activeSprint.end_date), new Date()) : 'N/A'} <span className="text-sm font-normal opacity-70">days</span></p>
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
          <TabsList className="bg-transparent border-none w-[280px] sm:w-full overflow-x-auto justify-start h-auto p-2">
            {/* <TabsTrigger value="board" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg gap-2 text-md sm:text-md py-2 px-3">
              <LayoutGrid className="w-4 h-4" />
              Sprint Board
            </TabsTrigger> */}
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

          {/* <div className="flex items-center gap-2 px-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </div> */}
        </div>
        {/* 3. SPRINT BACKLOG */}
        <TabsContent value="backlog" className="mt-0 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sprint Items</CardTitle>
                  <CardDescription>Tasks currently committed to this sprint</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">{filteredTasks.length} Tasks</Badge>
              </CardHeader>
              <CardContent className=''>
                <ScrollArea className="h-[500px]    pr-4">
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
                            if (totalStoryPoints + task.storyPoints > (activeSprint?.story_points_target || 100)) {
                              alert("Warning: This task will exceed sprint capacity target!");
                            }
                            setTasks([...tasks, task]);
                            setProjectBacklog(projectBacklog.filter(t => t.id !== task.id));
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-[9px] h-4">{task.status}</Badge>
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
                  {activeSprint ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Resource allocation details (team members, capacity) are not available from the current API response for this sprint.
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No active sprint selected.
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
                  {isLoadingBurndown ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Loading Burndown Chart...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={burndownChartData}>
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
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="bg-foreground text-background border-none">
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Sprint Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCapacityVelocity ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : capacityVelocityData ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{capacityVelocityData.velocity.completed_tasks}</span>
                      <span className="text-muted-foreground text-sm">pts / sprint</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No data</div>
                  )}
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
                    {isLoadingCapacityVelocity ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : capacityVelocityData ? (
                      <div className={`p-3 rounded-lg ${capacityVelocityData.status === 'at_risk'
                        ? 'bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/40'
                        : capacityVelocityData.status === 'critical'
                          ? 'bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800/40'
                          : 'bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800/40'
                        }`}>
                        <div className={`flex items-center gap-2 ${capacityVelocityData.status === 'at_risk'
                          ? 'text-orange-700 dark:text-orange-400'
                          : capacityVelocityData.status === 'critical'
                            ? 'text-red-700 dark:text-red-400'
                            : 'text-green-700 dark:text-green-400'
                          }`}>
                          {capacityVelocityData.status === 'at_risk' && <AlertCircle className="w-4 h-4" />}
                          {capacityVelocityData.status === 'critical' && <AlertCircle className="w-4 h-4" />}
                          {capacityVelocityData.status !== 'at_risk' && capacityVelocityData.status !== 'critical' && <CheckCircle2 className="w-4 h-4" />}
                          <span className="text-xs font-semibold uppercase">
                            {capacityVelocityData.status === 'at_risk' ? 'At Risk' :
                              capacityVelocityData.status === 'critical' ? 'Critical' :
                                'Healthy'}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1 ${capacityVelocityData.status === 'at_risk'
                          ? 'text-orange-600 dark:text-orange-300'
                          : capacityVelocityData.status === 'critical'
                            ? 'text-red-600 dark:text-red-300'
                            : 'text-green-600 dark:text-green-300'
                          }`}>
                          {capacityVelocityData.status === 'at_risk' ? 'Sprint is facing some challenges.' :
                            capacityVelocityData.status === 'critical' ? 'Sprint is in serious trouble.' :
                              'Sprint is on track to complete all committed story points.'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No data</div>
                    )}
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