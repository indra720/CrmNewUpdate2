'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchSprintHistory } from '@/lib/api'; // Assuming this function exists or will be created
import { SprintHistoryEntry } from '@/components/pms/sprint-types'; // Assuming this interface exists

const SprintHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sprintId = searchParams.get('sprintId');
  const { toast } = useToast();

  const [history, setHistory] = useState<SprintHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSprintHistory = async () => {
      if (!sprintId) {
        setError('Sprint ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchSprintHistory(sprintId);
        setHistory(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch sprint history.');
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch sprint history.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    getSprintHistory();
  }, [sprintId, toast]);

  if (!sprintId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <p className="text-xl text-red-500 mb-4">Error: Sprint ID not provided.</p>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Sprint History for Sprint ID: {sprintId}</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>History Log</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-8">{error}</div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="border-b pb-2 last:border-b-0">
                  <p className="text-sm">
                    <strong>Status:</strong> {entry.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.created_date).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-700">{entry.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">No sprint history found for this sprint.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintHistoryPage;
