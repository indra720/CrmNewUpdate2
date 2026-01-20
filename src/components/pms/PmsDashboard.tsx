'use client';
import { formatDistanceToNowStrict } from 'date-fns';
import { FolderKanban, CheckSquare, Users, Clock, Calendar, } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProjectCard } from './ProjectCard';
import { TaskRow } from './TaskRow';
import { mockProjects, mockTasks, mockProjectMembers } from '@/lib/mockData';
import { PieChart as RechartsPieChart, Pie, Sector, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

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
  const recentProjects = mockProjects.slice(0, 4);
  const recentTasks = mockTasks.filter(t => t.status !== 'done').slice(0, 5);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMobile = useIsMobile();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const stats = {
    totalProjects: mockProjects.length,
    activeTasks: mockTasks.filter(t => t.status === 'in_progress').length,
    completedTasks: mockTasks.filter(t => t.status === 'done').length,
    teamMembers: 4,
  };

  const taskStatusData = Object.entries(
    mockTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()), // Format status for display
    value: count,
  }));

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const upcomingTasks = mockTasks.filter(task => {
    if (task.status === 'done' || !task.deadline) return false;
    const deadlineDate = new Date(task.deadline);
    return deadlineDate >= today && deadlineDate <= sevenDaysFromNow;
  });

  const teamWorkloadData = mockProjectMembers.map(member => {
    const assignedTasks = mockTasks.filter(task =>
      task.assigneeId === member.id && task.status !== 'done'
    ).length;
    return {
      name: member.name,
      activeTasks: assignedTasks,
    };
  }).filter(member => member.activeTasks > 0);


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




  



  return (
    <div className="space-y-8 bg-card rounded-md p-6">
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
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
            <a href="/admin/project/all" className="text-sm text-white hover:underline bg-[#fa7516] p-2 rounded-md">
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentProjects.slice(0, 4).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={mockProjectMembers.filter(m => m.projectId === project.id)}
              />
            ))}
          </div>
        </section>

        {/* Active Tasks Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Active Tasks</h2>
            <a href="/admin/tasks" className="text-sm text-white hover:underline bg-[#fa7516] p-2 rounded-md">
              View all
            </a>
          </div>
          <div className="bg-card rounded-xl border border-border">
            {recentTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
            {recentTasks.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No active tasks
              </div>
            )}
          </div>
        </section>

        {/* Task Status Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Task Status Overview</h2>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 h-[350px]">
            {
              taskStatusData.length > 0 ? (
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

        {/* Upcoming Deadlines - New Compact Display */}
        {/* <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h2>
          </div>
          <div className="bg-card rounded-xl border border-border">
            {upcomingTasks.length > 0 ? (
              <ul className="divide-y divide-border">
                {upcomingTasks.map((task) => {
                  const deadlineDate = new Date(task.deadline);
                  const daysLeft = formatDistanceToNowStrict(deadlineDate, { addSuffix: true });
                  return (
                    <li key={task.id} className="flex justify-between items-center p-4">
                      <span className="font-medium text-foreground">{task.title}</span>
                      <span className="text-sm text-muted-foreground">{daysLeft}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No tasks due soon
              </div>
            )}
          </div>
        </section> */}


        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#fa7516]" />
              Upcoming Deadlines
            </h2>
          </div>

          <div className="bg-card rounded-xl border border-border p-2 space-y-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const deadlineDate = new Date(task.deadline);
                const diffDays = Math.ceil(
                  (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={task.id}
                    className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-lg border border-border bg-background hover:shadow-md transition-all"
                  >
                    {/* Left */}
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {task.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due on {deadlineDate.toDateString()}
                      </span>
                    </div>

                    {/* Right */}
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${getUrgencyStyles(
                        diffDays
                      )}`}
                    >
                      {diffDays <= 0
                        ? "Overdue"
                        : `${diffDays} day${diffDays > 1 ? "s" : ""} left`}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No tasks due soon
              </div>
            )}
          </div>
        </section>


        {/* Team Workload */}
        {/* <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Team Workload</h2>
          </div>
          <div className="bg-card rounded-xl border border-border">
            {teamWorkloadData.length > 0 ? (
              <ul className="divide-y divide-border">
                {teamWorkloadData.map((member) => (
                  <li key={member.name} className="flex justify-between items-center p-4">
                    <span className="font-medium text-foreground">{member.name}</span>
                    <span className="text-sm text-muted-foreground">{member.activeTasks} tasks</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No team workload data available
              </div>
            )}
          </div>
        </section> */}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-[#fa7516]" />
              Team Workload
            </h2>
          </div>

          <div className="bg-card rounded-xl border border-border p-2 space-y-2">
            {teamWorkloadData.length > 0 ? (
              teamWorkloadData.map((member) => (
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
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
