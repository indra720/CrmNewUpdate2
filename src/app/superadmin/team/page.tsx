'use client';

import TeamView from '@/components/pms/TeamView';

export default function SuperadminTeamPage() {
  return (
    <div>
      {/* The TeamView component already has internal logic to display all team members for superadmin */}
      <TeamView />
    </div>
  );
}
