'use client'
import { useState } from 'react';
import { Filter, LayoutGrid, List } from 'lucide-react';

import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockProjectMembers } from '@/lib/mockData';
import { ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CreateProjectDialog } from '@/components/forms/CreateProjectDialog';

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Planned', value: 'planned' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Hold', value: 'on-hold' },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = activeFilter === 'all' 
    ? mockProjects 
    : mockProjects.filter(p => p.status === activeFilter);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your projects
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        {/* Filters & View Toggle */}
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

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
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
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "flex flex-col gap-3"
        )}>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              members={mockProjectMembers.filter(m => m.projectId === project.id)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </div>
    </>
  );
}