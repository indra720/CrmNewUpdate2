// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation'; // Import useParams
// import { Loader2, AlertCircle, History as HistoryIcon, Clock, User, Info, CalendarDays, ChevronRight } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';

// // Define interfaces for the history data
// interface HistoryEntry {
//   id: string;
//   action: string;
//   model_name: string;
//   old_data: Record<string, any> | null;
//   new_data: Record<string, any> | null;
//   performed_by_name: string;
//   created_at: string;
// }

// // interface MilestoneHistoryPageProps {
// //   milestoneId: string; // No longer needed as prop
// // }

// export default function MilestoneHistoryPage() {
//   const params = useParams();
//   const milestoneId = params.milestoneId as string; // Get milestoneId from URL

//   const [history, setHistory] = useState<HistoryEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchMilestoneHistory = async (id: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         throw new Error("Authentication token not found.");
//       }

//       const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/milestones/${id}/history/`;
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Token ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setHistory(data);
//     } catch (err: any) {
//       console.error("Failed to fetch milestone history:", err);
//       setError(err.message || "Failed to load milestone history.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (milestoneId) {
//       fetchMilestoneHistory(milestoneId);
//     } else {
//       setHistory([]);
//       setLoading(false);
//       setError("No milestone ID provided in URL.");
//     }
//   }, [milestoneId]);

//   const formatDateTime = (isoString: string) => {
//     if (!isoString) return 'N/A';
//     const date = new Date(isoString);
//     return date.toLocaleString(); // Adjust based on desired locale format
//   };

//   const renderChanges = (oldData: Record<string, any> | null, newData: Record<string, any> | null) => {
//     if (!oldData && !newData) return null; // No data to display
//     if (!oldData && newData) {
//       // Creation or full update where old data was empty
//       return (
//         <div className="mt-2 space-y-1 text-sm text-gray-700">
//           {Object.entries(newData).map(([key, value]) => (
//             <div key={key} className="flex items-center gap-2">
//               <span className="font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
//               <span className="text-green-600">{JSON.stringify(value)}</span>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     // Compare oldData and newData for updates
//     const changes: JSX.Element[] = [];
//     const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

//     allKeys.forEach(key => {
//       const oldValue = oldData ? oldData[key] : undefined;
//       const newValue = newData ? newData[key] : undefined;

//       if (oldValue !== newValue) {
//         changes.push(
//           <div key={key} className="flex items-center gap-2 text-sm">
//             <span className="font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
//             {oldValue !== undefined && <span className="text-red-500 line-through">{JSON.stringify(oldValue)}</span>}
//             {oldValue !== undefined && newValue !== undefined && <span className="mx-1">→</span>}
//             {newValue !== undefined && <span className="text-green-600">{JSON.stringify(newValue)}</span>}
//           </div>
//         );
//       }
//     });

//     return changes.length > 0 ? (
//       <div className="mt-2 space-y-1 text-gray-700">{changes}</div>
//     ) : (
//       <p className="mt-2 text-sm text-gray-500">No significant changes recorded.</p>
//     );
//   };

//   return (
//     <div className="container mx-auto flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 bg-card">
//       {/* Header for the History Page */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
//             <HistoryIcon className="w-4 h-4" />
//             <span>Milestones</span>
//             <ChevronRight className="w-3 h-3" />
//             <span className="font-medium text-foreground">History</span>
//           </div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Milestone Activity Log</h1>
//         </div>
//         <div>
//             <CardDescription>ID: <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{milestoneId}</span></CardDescription>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <HistoryIcon className="h-5 w-5 text-primary" /> Activity Timeline
//           </CardTitle>
//           <CardDescription>Recent changes and actions related to this milestone.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
//               <Loader2 className="h-8 w-8 animate-spin mb-4" />
//               <p>Loading history...</p>
//             </div>
//           ) : error ? (
//             <div className="flex flex-col items-center justify-center py-8 text-destructive">
//               <AlertCircle className="h-8 w-8 mb-4" />
//               <p>{error}</p>
//               <Button onClick={() => fetchMilestoneHistory(milestoneId)} variant="outline" className="mt-4">Retry</Button>
//             </div>
//           ) : history.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
//               <Info className="h-8 w-8 mb-4 opacity-60" />
//               <p className="text-lg font-medium">No history found</p>
//               <p className="text-sm mt-2">There are no activity logs for this milestone yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {history.map((entry, index) => (
//                 <div key={entry.id || index} className="flex gap-4">
//                   <div className="relative flex flex-col items-center">
//                     <span className="relative flex h-3 w-3 rounded-full bg-primary" />
//                     {index < history.length - 1 && (
//                       <div className="h-full w-px bg-muted-foreground/50 absolute top-3" />
//                     )}
//                   </div>
//                   <div className="flex-1 pb-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                       <h4 className="font-semibold text-lg">{entry.model_name} {entry.action.replace(/_/g, ' ')}</h4>
//                       <Badge variant="secondary" className="capitalize">
//                         {entry.action.replace(/_/g, ' ')}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
//                       <User className="h-4 w-4" /> Performed by: {entry.performed_by_name}
//                     </p>
//                     <p className="text-sm text-muted-foreground flex items-center gap-1">
//                       <CalendarDays className="h-4 w-4" /> At: {formatDateTime(entry.created_at)}
//                     </p>
//                     <div className="mt-3 bg-muted p-3 rounded-md">
//                         {renderChanges(entry.old_data, entry.new_data)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }








'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Loader2,
  AlertCircle,
  History as HistoryIcon,
  Clock,
  User,
  Info,
  CalendarDays,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define interfaces for the history data
interface HistoryEntry {
  id: string;
  action: string;
  model_name: string;        // fixed typo: was action_name → model_name
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  performed_by_name: string;
  created_at: string;
}

export default function MilestoneHistoryPage() {
  const params = useParams();
  const milestoneId = params.milestoneId as string;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optional: filters (you can expand later)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  const fetchMilestoneHistory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found.');

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/milestones/${id}/history/`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHistory(data);
    } catch (err: any) {
      console.error('Failed to fetch milestone history:', err);
      setError(err.message || 'Failed to load milestone history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (milestoneId) {
      fetchMilestoneHistory(milestoneId);
    } else {
      setHistory([]);
      setLoading(false);
      setError('No milestone ID provided in URL.');
    }
  }, [milestoneId]);

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderChanges = (oldData: Record<string, any> | null, newData: Record<string, any> | null) => {
    if (!oldData && !newData) return null;

    if (!oldData && newData) {
      return (
        <div className="mt-3 space-y-2 text-sm">
          {Object.entries(newData).map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <span className="font-medium text-gray-600 capitalize min-w-[140px]">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-green-700 font-medium">{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      );
    }

    const changes: JSX.Element[] = [];
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    allKeys.forEach((key) => {
      const oldValue = oldData?.[key];
      const newValue = newData?.[key];

      if (oldValue !== newValue) {
        changes.push(
          <div key={key} className="flex items-start gap-3 text-sm">
            <span className="font-medium text-gray-600 capitalize min-w-[140px]">
              {key.replace(/_/g, ' ')}:
            </span>
            {oldValue !== undefined && (
              <span className="text-red-600 line-through">{JSON.stringify(oldValue)}</span>
            )}
            {oldValue !== undefined && newValue !== undefined && (
              <span className="text-gray-400 mx-1">→</span>
            )}
            {newValue !== undefined && (
              <span className="text-green-700 font-medium">{JSON.stringify(newValue)}</span>
            )}
          </div>
        );
      }
    });

    return changes.length > 0 ? (
      <div className="mt-3 space-y-2">{changes}</div>
    ) : (
      <p className="mt-3 text-sm text-gray-500 italic">No significant field changes.</p>
    );
  };

  // Simple client-side filtering (optional)
  const filteredHistory = history.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.performed_by_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'All' || entry.action === filterAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="container mx-auto flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 bg-background">
      {/* Header – same style as your second code */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <HistoryIcon className="w-4 h-4" />
            <span>Milestones</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground">History</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Milestone Activity Log</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activity..."
              className="pl-9 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Card – cleaner, more modern */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HistoryIcon className="h-5 w-5 text-primary" />
                Activity Timeline
              </CardTitle>
              <CardDescription className="mt-1">
                All changes and actions for milestone{' '}
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                  {milestoneId}
                </span>
              </CardDescription>
            </div>
            <Badge variant="outline">Total: {filteredHistory.length}</Badge>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading activity history...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <AlertCircle className="h-10 w-10 mb-4" />
              <p className="text-lg font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => fetchMilestoneHistory(milestoneId)}
              >
                Retry
              </Button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Info className="h-12 w-12 mb-4 opacity-70" />
              <h3 className="text-lg font-medium">No activity found</h3>
              <p className="mt-2 text-center max-w-md">
                No history entries match your filters or this milestone has no activity yet.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredHistory.map((entry, index) => (
                <div key={entry.id} className="relative pl-10">
                  {/* Timeline line & dot */}
                  <div className="absolute left-4 top-1.5 bottom-0 w-px bg-border -z-10" />
                  <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full border-4 border-background bg-primary flex items-center justify-center">
                    <HistoryIcon className="h-4 w-4 text-primary-foreground" />
                  </div>

                  <Card className="border shadow-sm hover:shadow transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {entry.model_name} • {entry.action.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            {entry.performed_by_name}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="secondary" className="capitalize">
                            {entry.action.replace(/_/g, ' ')}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {formatDateTime(entry.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Changes section – cleaner layout */}
                      <div className="bg-muted/60 rounded-lg p-4 border">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                          Changes
                        </h4>
                        {renderChanges(entry.old_data, entry.new_data)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}