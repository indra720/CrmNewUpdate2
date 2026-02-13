'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LayoutGrid,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Users,
  CheckSquare,
  BarChart3,
  Flag,
  Eye,
  Edit,
  Trash2,
  Clock,
  Info,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

type HistoryEntry = {
  id: string;
  action: string;
  model_name: string;
  old_data: any | null;
  new_data: any;
  performed_by_name: string;
  created_at: string;
};

type SuccessCriterion = {
  id: string;
  text: string;
  checked: boolean;
};

const statusColors: Record<string, string> = {
  'Not Started': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Blocked': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
};

export default function MilestoneHistoryPage() {
  const searchParams = useSearchParams();
  const milestoneId = searchParams.get('milestone');

  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState<string>('Milestone History');
  const [milestoneCode, setMilestoneCode] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false); // open by default
  const isMobile = useIsMobile();


  useEffect(() => {
    if (!milestoneId) {
      setError('No milestone ID provided in URL');
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/milestones/${milestoneId}/history/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: HistoryEntry[] = await response.json();
        setHistoryEntries(data);

        // Try to extract title & code from the first entry (creation)
        if (data.length > 0) {
          const creationEntry = data.find((e) => e.action === 'create');
          if (creationEntry?.new_data) {
            setMilestoneTitle(creationEntry.new_data.title || 'Milestone History');
            setMilestoneCode(creationEntry.new_data.code || '');
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch milestone history:', err);
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [milestoneId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusFromData = (data: any) => {
    return data?.status?.replace('_', ' ') || 'Unknown';
  };

  const getPriorityBadgeVariant = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 bg-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Projects</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground">Milestone History</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {milestoneTitle}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              History for {milestoneCode ? milestoneCode : milestoneId || 'selected milestone'}
            </span>
          </CardTitle>
          <CardDescription>
            Timeline of changes made to this milestone
          </CardDescription>
        </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading history...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-destructive">
                <AlertCircle className="h-8 w-8 mb-4" />
                <p>{error}</p>
              </div>
            ) : historyEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">No history entries found</h3>
                <p className="mt-1">This milestone has not been modified yet.</p>
              </div>
            ) : (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Changes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(entry.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.action === 'create' ? 'default' :
                            entry.action === 'update' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {entry.action.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.performed_by_name}</TableCell>
                      <TableCell>
                        {entry.action === 'create' ? (
                          <span className="text-sm text-muted-foreground">
                            Milestone created
                          </span>
                        ) : (
                          <div className="text-sm">
                            {entry.old_data && entry.new_data && (
                              <ul className="list-disc pl-4">
                                {Object.keys(entry.new_data).map((key) => {
                                  if (entry.old_data?.[key] !== entry.new_data[key]) {
                                    return (
                                      <li key={key}>
                                        <strong>{key}:</strong> changed from{' '}
                                        <span className="line-through">
                                          {JSON.stringify(entry.old_data[key])}
                                        </span>{' '}
                                        to <strong>{JSON.stringify(entry.new_data[key])}</strong>
                                      </li>
                                    );
                                  }
                                  return null;
                                })}
                              </ul>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>      </Card>

      {/* We keep your original details dialog, but it will show the latest state */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[calc(100%-2rem)] max-h-[95vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>{milestoneTitle}</DialogTitle>
            <DialogDescription>
              Detailed view of milestone {milestoneCode || milestoneId}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : historyEntries.length > 0 ? (
            <div className="space-y-6 py-4">
              {/* Show the latest state (from the most recent entry) */}
              {(() => {
                const latest = historyEntries[0]?.new_data || {};
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5 text-primary" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Title</Label>
                          <p className="text-sm">{latest.title || '—'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Code</Label>
                          <p className="text-sm font-mono">{latest.code || '—'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Description</Label>
                          <p className="text-sm text-muted-foreground">
                            {latest.description || '—'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Priority</Label>
                          <Badge variant={getPriorityBadgeVariant(latest.priority)}>
                            {latest.priority || '—'}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Due Date</Label>
                          <p className="text-sm">
                            {latest.due_date
                              ? formatDate(latest.due_date)
                              : '—'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Ownership
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Owner ID</Label>
                            <p className="text-sm">{latest.owner || '—'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Created by</Label>
                            <p className="text-sm">{latest.created_by || '—'}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Current Status</Label>
                            <Badge
                              className={
                                statusColors[getStatusFromData(latest)] ||
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {getStatusFromData(latest)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })()}

              {/* Success Criteria – only shown if present in latest data */}
              {historyEntries[0]?.new_data?.criteria && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-primary" />
                      Success Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {historyEntries[0].new_data.criteria.map((criterion: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 border rounded-md">
                            <Checkbox
                              id={`crit-${idx}`}
                              checked={criterion.is_completed}
                              disabled
                            />
                            <Label
                              htmlFor={`crit-${idx}`}
                              className="text-sm font-medium"
                            >
                              {criterion.title}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No data available
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" disabled>
              <Edit className="w-4 h-4 mr-2" />
              Edit Milestone (not implemented)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}