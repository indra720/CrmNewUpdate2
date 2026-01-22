'use client';

import TeamView from '@/components/pms/TeamView';

export default function TeamLeaderTeamPage() {
  return (
    <div>
      {/* 
        The TeamView component is reused to display team members.
        For a team leader, this component should be configured or have logic 
        to show only the members of their specific team.
      */}
      <TeamView />
    </div>
  );
}
