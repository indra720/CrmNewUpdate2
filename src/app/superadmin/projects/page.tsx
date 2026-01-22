'use client';

import ProjectsView from '@/components/pms/ProjectsView';

export default function SuperadminProjectsPage() {
  return (
    <div>
      {/* The ProjectsView component already has internal logic to display all projects for superadmin */}
      <ProjectsView />
    </div>
  );
}
