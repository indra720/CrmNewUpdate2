'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const ReportContent = ({ params }: { params: { reportType: string } }) => {
  const router = useRouter();
  const { reportType } = params;
  const [DynamicReportComponent, setDynamicReportComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const component = await import(`../${reportType}/page`);
        setDynamicReportComponent(() => component.default);
      } catch (error) {
        //console.error(`Failed to load report component for ${reportType}:`, error);
        // Optionally, redirect to a 404 page or show an error message
        router.push('/404');
      }
    };

    if (reportType) {
      loadComponent();
    }
  }, [reportType, router]);

  if (!DynamicReportComponent) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <DynamicReportComponent />;
};


export default function ReportPage({ params }: { params: { reportType: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportContent params={params} />
    </Suspense>
  );
}
