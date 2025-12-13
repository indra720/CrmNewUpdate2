'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

const SuperAdminReportsIndexContent = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/superadmin/reports/reports-index'); // Redirect to the generic reports index
  }, [router]);

  return null; // Or a loading spinner
}

export default function SuperAdminReportsIndexPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuperAdminReportsIndexContent />
    </Suspense>
  );
}
