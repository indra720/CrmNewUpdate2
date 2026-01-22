'use client';

import { PmsDashboard } from '@/components/pms/PmsDashboard';

export default function SuperadminPmsDashboardPage() {
  return (
    <div>
      {/* The PmsDashboard component already has internal logic to display all content for superadmin */}
      <PmsDashboard />
    </div>
  );
}