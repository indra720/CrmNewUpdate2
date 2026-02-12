'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchSprintHistory } from '@/lib/api';
import { SprintHistoryEntry, Sprint } from '@/components/pms/sprint-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge'; // New import
import { format } from 'date-fns';
import {
  History as HistoryIcon,
  ArrowRight,
  PlusCircle,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  Info // New import
} from 'lucide-react';
import { cn } from '@/lib/utils'; // New import

// Helper function to render sprint details for history
const SprintDetailsDisplay = ({ sprint, className }: { sprint: Sprint | null, className?: string }) => {
  if (!sprint) return <p className={cn("text-muted-foreground italic", className)}>N/A</p>;

  // Function to create a consistent detail line
  const DetailLine = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  );

  return (
    <div className={cn("text-sm space-y-1 p-2 rounded-md", className)}>
      <DetailLine label="Name" value={`${sprint.name} (${sprint.sprint_number})`} />
      <DetailLine label="Goal" value={sprint.goal} />
      <DetailLine label="Status" value={<Badge variant="outline" className="capitalize">{sprint.status}</Badge>} />
      <DetailLine label="Dates" value={`${format(new Date(sprint.start_date), 'MMM d, yyyy')} - ${format(new Date(sprint.end_date), 'MMM d, yyyy')}`} />
      <DetailLine label="Target SP" value={sprint.story_points_target} />
      <DetailLine label="Project" value={sprint.project_name} />
    </div>
  );
};


export default function SprintHistoryPage() {
  const searchParams = useSearchParams();
  const sprintId = searchParams.get('sprintId');

  const [history, setHistory] = useState<SprintHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sprintId) {
      const loadHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedHistory = await fetchSprintHistory(sprintId);
          setHistory(fetchedHistory);
        } catch (err: any) {
          console.error("Failed to fetch sprint history:", err);
          setError(err.message || "Failed to load sprint history.");
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    } else {
      setIsLoading(false);
      setError("No sprint ID provided to fetch history.");
    }
  }, [sprintId]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3 text-primary">
            <HistoryIcon className="w-8 h-8" />
            <CardTitle className="text-3xl font-extrabold tracking-tight">Sprint History</CardTitle>
          </div>
          <CardDescription className="text-lg mt-2 text-muted-foreground">
            Detailed log of changes for sprint: <span className="font-semibold text-primary">{sprintId || 'N/A'}</span>
          </CardDescription>
        </CardHeader>
      </Card>

      {!sprintId && (
        <AlertCard
          type="error"
          message="No sprint ID provided. Please navigate from a specific sprint to view its history."
        />
      )}

      {isLoading && sprintId && (
        <AlertCard
          type="info"
          message="Loading sprint history..."
          icon={<Loader2 className="animate-spin" />}
        />
      )}
      {error && <AlertCard type="error" message={`Error: ${error}`} />}

      {!isLoading && !error && history.length === 0 && sprintId && (
        <AlertCard type="info" message="No history entries found for this sprint." />
      )}

      <div className="space-y-8">
        {history.map((entry) => {
          let ActionIcon = HistoryIcon; // Default icon
          let actionColorClass = "text-muted-foreground";

          switch (entry.action) {
            case 'create':
              ActionIcon = PlusCircle;
              actionColorClass = "text-green-500";
              break;
            case 'update':
              ActionIcon = Pencil;
              actionColorClass = "text-blue-500";
              break;
            case 'delete':
              ActionIcon = Trash2;
              actionColorClass = "text-red-500";
              break;
          }

          return (
            <Card key={entry.id} className="shadow-lg border-l-4 border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ActionIcon className={cn("w-6 h-6", actionColorClass)} />
                  <CardTitle className={cn("text-xl font-bold capitalize", actionColorClass)}>
                    {entry.action}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  Performed by: <span className="font-semibold">{entry.performed_by_name || 'System'}</span>
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="p-4 bg-red-50/20 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-800">
                    <h3 className="font-bold mb-3 text-red-600 dark:text-red-300 flex items-center gap-2">
                      Old Data <ArrowRight className="w-4 h-4 text-red-400" />
                    </h3>
                    <SprintDetailsDisplay sprint={entry.old_data} className="text-red-700 dark:text-red-200" />
                  </div>
                  <div className="p-4 bg-green-50/20 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-bold mb-3 text-green-600 dark:text-green-300 flex items-center gap-2">
                      New Data <ArrowRight className="w-4 h-4 text-green-400" />
                    </h3>
                    <SprintDetailsDisplay sprint={entry.new_data} className="text-green-700 dark:text-green-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Simple AlertCard helper component for messages
const AlertCard = ({ type, message, icon }: { type: 'error' | 'info'; message: string; icon?: React.ReactNode }) => (
  <Card className={cn(
    "mb-4",
    type === 'error' && "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    type === 'info' && "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
  )}>
    <CardContent className="flex items-center p-4 gap-3">
      {icon || (type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />)}
      <p className="text-sm font-medium">{message}</p>
    </CardContent>
  </Card>
);