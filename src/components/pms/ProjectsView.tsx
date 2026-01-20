'use client'
import { useState, useEffect } from 'react';
import { Filter, LayoutGrid, List, FolderKanban, CheckSquare, Clock, ClipboardList, Search, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockProjectMembers, Project } from '@/lib/mockData';
import { ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CreateProjectDialog } from '@/components/forms/CreateProjectDialog';
import { StatsCard } from './StatsCard';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Planned', value: 'planned' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Hold', value: 'on-hold' },
];

type SortKey = 'name' | 'startDate' | 'endDate' | 'progress';
type SortOrder = 'asc' | 'desc';

export default function Projects() {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setCurrentUserRole(role);

    if (role === 'admin' || role === 'superadmin' || role === 'team-leader') {
      setUserProjects(mockProjects);
    } else if (role === 'staff' && userId) {
      const staffProjectIds = mockProjectMembers
        .filter(member => member.memberId === userId)
        .map(member => member.projectId);
      
      const filtered = mockProjects.filter(project => staffProjectIds.includes(project.id));
      setUserProjects(filtered);
    }
  }, []);

  const filteredProjects = activeFilter === 'all'
    ? userProjects
    : userProjects.filter(p => p.status === activeFilter);

  const searchedProjects = filteredProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...searchedProjects].sort((a, b) => {
    let compareA: any;
    let compareB: any;

    switch (sortKey) {
      case 'name':
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
        break;
      case 'startDate':
        compareA = new Date(a.startDate).getTime();
        compareB = new Date(b.startDate).getTime();
        break;
      case 'endDate':
        compareA = new Date(a.endDate).getTime();
        compareB = new Date(b.endDate).getTime();
        break;
      case 'progress':
        compareA = a.progress;
        compareB = b.progress;
        break;
      default:
        return 0;
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });


  // Project Stats for Quick Summary
  const totalProjects = userProjects.length;
  const activeProjects = userProjects.filter(p => p.status === 'active').length;
  const completedProjects = userProjects.filter(p => p.status === 'completed').length;
  const plannedProjects = userProjects.filter(p => p.status === 'planned').length;

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              {currentUserRole === 'staff' ? 'Projects assigned to you' : 'Manage and track all your projects'}
            </p>
          </div>
          {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && <CreateProjectDialog />}
        </div>

        {/* Project Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Projects"
            value={totalProjects}
            icon={FolderKanban}
            trend={0}
          />
          <StatsCard
            title="Active Projects"
            value={activeProjects}
            icon={CheckSquare}
            trend={5}
          />
          <StatsCard
            title="Completed Projects"
            value={completedProjects}
            icon={Clock}
            trend={2}
          />
          <StatsCard
            title="Planned Projects"
            value={plannedProjects}
            icon={ClipboardList}
            trend={-1}
          />
        </div>

        {/* Filters, Search & View Toggle */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as ProjectStatus | 'all')}>
              <div className="w-[300px] overflow-x-auto sm:w-full">
                <TabsList className="bg-secondary/50  whitespace-nowrap">
                  {statusFilters.map((filter) => (
                    <TabsTrigger
                      key={filter.value}
                      value={filter.value}
                      className="data-[state=active]:bg-[#fa7516] flex-shrink-0 text-black"
                    >
                      {filter.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>

          <div className="flex flex-row flex-wrap items-center justify-end gap-3 md:flex-nowrap md:gap-4">
            <div className="relative w-full min-w-[180px] sm:w-auto md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={sortKey} onValueChange={(value: SortKey) => setSortKey(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Project Name</SelectItem>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="endDate">End Date</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUpWideNarrow className="h-4 w-4" />
                ) : (
                  <ArrowDownWideNarrow className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center border border-border rounded-lg p-1 bg-secondary/50">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", viewMode === 'grid' && "bg-card shadow-sm")}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", viewMode === 'list' && "bg-card shadow-sm")}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-1 lg:grid-cols-2  gap-4"
            : "flex flex-col gap-3"
        )}>
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={mockProjectMembers.filter(m => m.projectId === project.id)}
            />
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found for your account.</p>
          </div>
        )}
      </div>
    </>
  );
}