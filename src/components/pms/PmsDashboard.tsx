'use client';
import { formatDistanceToNowStrict } from 'date-fns';
import { FolderKanban, CheckSquare, Users, Clock, Calendar, } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProjectCard } from './ProjectCard';
import { TaskRow } from './TaskRow';
import { mockProjectMembers } from '@/lib/mockData'; // Removed mockProjects
import { PieChart as RechartsPieChart, Pie, Sector, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useEffect } from 'react';
import { useSearch } from '@/context/SearchContext'; // Import useSearch
import { DashboardTask, fetchActiveDashboardTasks, fetchProjects, fetchTaskStatusOverview, fetchTeamWorkload, fetchUpcomingDeadlines, TaskStatusOverview, TeamWorkload, UpcomingDeadline } from "@/lib/api"; // Import the fetchProjects API function
import { Project } from "@/types"; // Import Project type if not already globally available



const renderActiveShapeForDesktop = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name}: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const renderActiveShapeForMobile = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;

  return (
    <g>
      {/* Central Text Display */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        <tspan x={cx} dy="-1.2em" fontSize="16px" fontWeight="bold" fill={fill}>{payload.name}</tspan>
        <tspan x={cx} dy="1.5em" fontSize="14px" fill="#333">{`Value: ${value}`}</tspan>
        <tspan x={cx} dy="1.5em" fontSize="12px" fill="#999">{`(Rate: ${(percent * 100).toFixed(2)}%)`}</tspan>
      </text>

      {/* Original Sector for active slice pop-out */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Original Sector for outer ring */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* Original Path and Circle for the line effect */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
    </g>
  );
};


export const PmsDashboard = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]); // State for fetched projects
  const [projectsLoading, setProjectsLoading] = useState(true); // Loading state for projects
  const [projectsError, setProjectsError] = useState<string | null>(null); // Error state for projects
  const { searchQuery } = useSearch(); // Use global search context
  const [tasksToDisplay, setTasksToDisplay] = useState<DashboardTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [taskStatusOverview, setTaskStatusOverview] =
    useState<TaskStatusOverview | null>(null);

  const [taskStatusLoading, setTaskStatusLoading] = useState(true);
  const [taskStatusError, setTaskStatusError] = useState<string | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] =
    useState<UpcomingDeadline[]>([]);

  const [deadlinesLoading, setDeadlinesLoading] = useState(true);
  const [deadlinesError, setDeadlinesError] = useState<string | null>(null);
  const [teamWorkload, setTeamWorkload] = useState<TeamWorkload[]>([]);
  const [workloadLoading, setWorkloadLoading] = useState(true);
  const [workloadError, setWorkloadError] = useState<string | null>(null);


  const isDone = (status: string) => status === 'done';
  const isInProgress = (status: string) => status === 'in_progress';
  const isToDo = (status: string) => status === 'to_do';
  const review = (status: string) => status === 'review';

  useEffect(() => {
    setCurrentUserRole(localStorage.getItem('userRole'));
    setCurrentUserId(localStorage.getItem('userId'));

    const getProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const projectsData = await fetchProjects();
        setAllProjects(projectsData);
      } catch (err: any) {
        setProjectsError(err.message || 'Failed to fetch projects');
        // Fallback to mock data if API fails, similar to ProjectsView
        // setAllProjects(mockProjects as Project[]);
      } finally {
        setProjectsLoading(false);
      }
    };

    getProjects();
  }, []);


  // fetch active task 

  useEffect(() => {
    const getActiveTasks = async () => {
      setTasksLoading(true);
      setTasksError(null);

      try {
        const tasks = await fetchActiveDashboardTasks();
        setTasksToDisplay(tasks);
      } catch (err: any) {
        setTasksError(err.message || "Failed to fetch tasks");
      } finally {
        setTasksLoading(false);
      }
    };

    getActiveTasks();

  }, [])

  //Fetch status overview for pie chart 

  useEffect(() => {
    const getTaskStatusOverview = async () => {
      setTaskStatusLoading(true);
      setTaskStatusError(null);

      try {
        const data = await fetchTaskStatusOverview();
        setTaskStatusOverview(data);
      } catch (err: any) {
        setTaskStatusError(err.message || "Failed to fetch task status overview");
      } finally {
        setTaskStatusLoading(false);
      }
    };

    getTaskStatusOverview();
  }, []);

  // fetch upcoming deadlines for the upcoming deadlines section
  useEffect(() => {
    const getUpcomingDeadlines = async () => {
      setDeadlinesLoading(true);
      setDeadlinesError(null);

      try {
        const data = await fetchUpcomingDeadlines();
        setUpcomingDeadlines(data);
      } catch (err: any) {
        setDeadlinesError(err.message || "Failed to fetch deadlines");
      } finally {
        setDeadlinesLoading(false);
      }
    };

    getUpcomingDeadlines();
  }, []);

  // fetch team workload data

  useEffect(() => {
    const getTeamWorkload = async () => {
      setWorkloadLoading(true);
      setWorkloadError(null);

      try {
        const data = await fetchTeamWorkload();
        setTeamWorkload(data);
      } catch (err: any) {
        setWorkloadError(err.message || "Failed to fetch team workload");
      } finally {
        setWorkloadLoading(false);
      }
    };

    getTeamWorkload();
  }, []);



  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMobile = useIsMobile();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  let projectsToDisplay: Project[] = [];
  let membersToDisplay = [];

  if (projectsLoading) {
    projectsToDisplay = [];
  }
  else if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {

    //  Projects sabko dikhenge
    projectsToDisplay = allProjects;

    //  tasksToDisplay ko touch mat karo
    // API already setTasksToDisplay() kar chuki hai

    membersToDisplay = mockProjectMembers; // (jab tak members API nahi hai)

  }
  else if (currentUserRole === 'team-leader' && currentUserId) {

    const teamLeaderProjectIds = mockProjectMembers
      .filter(member => member.id === currentUserId)
      .map(member => member.projectId);

    projectsToDisplay = allProjects.filter(project =>
      teamLeaderProjectIds.includes(Number(project.id))
    );

    membersToDisplay = mockProjectMembers.filter(member =>
      teamLeaderProjectIds.includes(member.projectId)
    );
  }
  else {
    projectsToDisplay = [];
    membersToDisplay = [];
  }


  // Apply search filtering to projectsToDisplay
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const filteredProjects = projectsToDisplay.filter(project =>
    project.name.toLowerCase().includes(lowerCaseSearchQuery) ||
    project.description.toLowerCase().includes(lowerCaseSearchQuery)
  );

  // Apply search filtering to tasksToDisplay
  const filteredTasks = tasksToDisplay.filter(task =>
    (task.title ?? '').toLowerCase().includes(lowerCaseSearchQuery) ||
    (task.description ?? '').toLowerCase().includes(lowerCaseSearchQuery)
  );

  // --- End Role-based data filtering ---


  // Use filteredProjects here
  const recentTasks = filteredTasks
    .filter(t => !isDone(t.status))
    .slice(0, 5);

  const stats = {
    totalProjects: filteredProjects.length,
    activeTasks: tasksToDisplay.filter(t => isInProgress(t.status)).length,
    completedTasks: tasksToDisplay.filter(t => isDone(t.status)).length,
    teamMembers: membersToDisplay.length,
  };


  const handleViewTask = (taskId: string) => {
    console.log("View task", taskId);
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasksToDisplay(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };


  const taskStatusData = taskStatusOverview
    ? [
      {
        name: "To Do",
        value: taskStatusOverview.todo.count,
      },
      {
        name: "In Progress",
        value: taskStatusOverview.in_progress.count,
      },
      {
        name: "Done",
        value: taskStatusOverview.done.count,
      },
    ]
    : [];


  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const upcomingTasks = tasksToDisplay.filter(task => {
    if (task.status === 'done' || !task.deadline) return false;
    const deadlineDate = new Date(task.deadline);
    const matchesSearch =
      (task.title ?? '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (task.project_name ?? '').toLowerCase().includes(lowerCaseSearchQuery); // Assuming project_name is available for search

    return matchesSearch && deadlineDate >= today && deadlineDate <= sevenDaysFromNow;
  });

  // const teamWorkloadData = membersToDisplay.map(member => {
  //   const assignedTasks = tasksToDisplay.filter(task => // Filter from tasksToDisplay
  //     task.assigneeId === member.id && !isDone(task.status)
  //   ).length;
  //   return {
  //     name: member.name,
  //     activeTasks: assignedTasks,
  //   };
  // }).filter(member => member.activeTasks > 0);

  const teamWorkloadData = teamWorkload.map(member => ({
    name: member.name,
    activeTasks: member.task_count,
  }));

  // Apply search filtering to teamWorkloadData
  const filteredTeamWorkload = teamWorkloadData.filter(member =>
    member.name.toLowerCase().includes(lowerCaseSearchQuery)
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']




  const getUrgencyStyles = (daysLeft: number) => {
    if (daysLeft <= 1) return "bg-red-50 text-red-600 border-red-200";
    if (daysLeft <= 3) return "bg-orange-50 text-orange-600 border-orange-200";
    return "bg-green-50 text-green-600 border-green-200";
  };


  const getWorkloadColor = (tasks: number) => {
    if (tasks >= 6) return "bg-red-500";
    if (tasks >= 3) return "bg-orange-500";
    return "bg-green-500";
  };






  // Show a loading state or nothing if role/ID is not yet determined
  if (!currentUserRole || !currentUserId || projectsLoading || tasksLoading) {
    // Also check projectsLoading
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading dashboard data...
      </div>
    );
  }






  return (
    <div className="space-y-8 bg-card rounded-md p-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={CheckSquare}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon={Clock}
          trend={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Main Content Grid - Two Columns (or more as needed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects - Spans full width on large screens */}
        {(searchQuery === '' || filteredProjects.length > 0) && (
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
              <a href={`/${currentUserRole}/project/all`} className="text-sm text-white hover:underline bg-[#fa7516] p-2 rounded-md">
                View all
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projectsLoading && <p className="col-span-2 text-center py-4">Loading projects...</p>}
              {projectsError && <p className="col-span-2 text-center py-4 text-red-500">Error: {projectsError}</p>}
              {!projectsLoading && !projectsError && filteredProjects.slice(0, 4).map((project) => ( // Display top 2 projects
                <ProjectCard
                  key={project.id}
                  project={{
                    ...project,
                    id: Number(project.id),
                  }}
                  members={(project.members ?? []).map(member => ({ name: member.name }))}
                />
              ))}
              {!projectsLoading && !projectsError && filteredProjects.length === 0 && (
                <div className="col-span-2 p-8 text-center text-muted-foreground">
                  No recent projects found.
                </div>
              )}
            </div>
          </section>
        )}
        {/* Active Tasks Section */}
        {(searchQuery === '' || recentTasks.length > 0) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Active Tasks</h2>
              <a href={(() => {
                let tasksPageHref = '';
                switch (currentUserRole) {
                  case 'admin':
                    tasksPageHref = '/admin/project/tasks';
                    break;
                  case 'superadmin':
                    tasksPageHref = '/superadmin/projects/tasks';
                    break;
                  case 'staff':
                    tasksPageHref = '/staff/tasks';
                    break;
                  case 'team-leader':
                    tasksPageHref = '/team-leader/project/tasks';
                    break;
                  default:
                    tasksPageHref = '/'; // Fallback or handle unknown role
                }
                return tasksPageHref;
              })()} className="text-sm text-white hover:underline bg-[#fa7516] p-2 rounded-md">
                View all
              </a>
            </div>
            <div className="bg-card rounded-xl border border-border">
              {recentTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onViewTask={() => handleViewTask(task.id)}
                  onStatusChange={(status) =>
                    handleStatusChange(task.id, status)
                  }
                />

              ))}
              {recentTasks.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No active tasks
                </div>
              )}
            </div>
          </section>
        )}

        {/* Task Status Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Task Status Overview</h2>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 h-[350px]">
            {
              taskStatusLoading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Loading task status...
                </div>
              ) : taskStatusError ? (
                <div className="h-full flex items-center justify-center text-red-500">
                  {taskStatusError}
                </div>
              ) : taskStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={isMobile ? renderActiveShapeForMobile : renderActiveShapeForDesktop}
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      isAnimationActive={false}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No task data available
                </div>
              )
            }

          </div>
        </section>


        {(searchQuery === '' || upcomingDeadlines.length > 0) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#fa7516]" />
                Upcoming Deadlines
              </h2>
            </div>

            <div className="bg-card rounded-xl border border-border p-2 space-y-2">
              {deadlinesLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading deadlines...
                </div>
              ) : deadlinesError ? (
                <div className="p-8 text-center text-red-500">
                  {deadlinesError}
                </div>
              ) : upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg border border-border bg-background hover:shadow-md transition-all"
                  >
                    {/* LEFT */}
                    <div className="flex flex-col  md:items-center gap-2">
                      <span className="font-medium text-foreground">
                        {task.title}
                      </span>
                      <span className="text-md text-muted-foreground">
                        Project: {task.project_name}
                      </span>

                    </div>

                    {/* RIGHT */}
                    <div className='flex flex-col justify-end items-end'>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border  sm:w-[80px] ${getUrgencyStyles(
                          task.days_left
                        )}`}
                      >
                        {task.days_left <= 0
                          ? "Overdue"
                          : `${task.days_left} day${task.days_left > 1 ? "s" : ""} left`}
                      </span>
                      <span className="text-md text-muted-foreground">
                        Due on {new Date(task.due_date).toDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No tasks due soon
                </div>
              )}

            </div>
          </section>
        )}

        {(searchQuery === '' || filteredTeamWorkload.length > 0) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-[#fa7516]" />
                Team Workload
              </h2>
            </div>

            <div className="bg-card rounded-xl border border-border p-2 space-y-2 h-[350px] overflow-y-auto">
              {
                workloadLoading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading team workload...
                  </div>
                ) : workloadError ? (
                  <div className="p-8 text-center text-red-500">
                    {workloadError}
                  </div>
                ) : filteredTeamWorkload.length > 0 ? (
                  filteredTeamWorkload.map((member) => (
                    <div
                      key={member.name}
                      className="p-4 rounded-lg border border-border bg-background hover:shadow-md transition-all"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#fa7516]/10 flex items-center justify-center font-semibold text-[#fa7516]">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Team Member
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-semibold text-foreground">
                          {member.activeTasks} Tasks
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${getWorkloadColor(
                            member.activeTasks
                          )}`}
                          style={{
                            width: `${Math.min(member.activeTasks * 15, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No team workload data available
                  </div>
                )
              }

            </div>
          </section>
        )}

      </div >
    </div >
  );
}

export default PmsDashboard;