'use client';

import ProjectsView from '@/components/pms/ProjectsView';

export default function TeamLeaderProjectsPage() {
  return (
    <div>
      {/* 
        The ProjectsView component is reused here. 
        It has its own internal logic to check the user's role 
        and display projects accordingly. For a team leader, it will
        show their assigned projects and hide admin-only buttons.
      */}
      <ProjectsView />
    </div>
  );
}
