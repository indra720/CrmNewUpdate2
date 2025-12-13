'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const sourceToPathMap: { [key: string]: string } = {
  'admin': '/admin/users/admin',
  'team-leader': '/admin/users/team-leader',
  'staff': '/admin/users/staff',
  'associate': '/admin/users/associates',
  'freelancer': '/admin/users/freelancer',
};

function BackButtonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const source = searchParams.get('source');

  const handleBack = () => {
    if (source && sourceToPathMap[source]) {
      router.push(sourceToPathMap[source]);
    } else {
      router.back();
    }
  };

  const backPath = source ? sourceToPathMap[source] : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {backPath ? (
            <Link href={backPath}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Back</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function BackButton() {
  return (
    <Suspense fallback={
      <Button variant="outline" size="icon">
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
    }>
      <BackButtonContent />
    </Suspense>
  );
}
