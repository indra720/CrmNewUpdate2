'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      {children}
    </Suspense>
  );
}
