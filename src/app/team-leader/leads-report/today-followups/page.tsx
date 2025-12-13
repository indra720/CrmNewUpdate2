'use client';

import { getTeamCustomersByTag, exportTeamLeaderLeads } from '@/lib/api';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
// Force re-save for DialogClose error
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, Phone, MessageSquare, ArrowUpDown, Calendar, FileDown, ArrowLeft, Briefcase, Users, Clock, Tag, MoreVertical, Plus, Minus , HistoryIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import React from 'react';

export default function TodayFollowupsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [statusValue, setStatusValue] = useState('Intrested');
  const [messageValue, setMessageValue] = useState('');
  const [followDate, setFollowDate] = useState('');
  const [followTime, setFollowTime] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  async function fetchLeads() {
    try {
      setLoading(true);
      const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
      const data = await getTeamCustomersByTag('today_follow', formattedStartDate, formattedEndDate);
      setLeads(data.leads || []);
      setTotalPages(data.total_pages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [page, search, startDate, endDate]);

  const handleExport = async () => {
    try {
      const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

      const payload = {
        status: 'today_followups', // Correct status for this page
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        // all_interested is omitted or implicitly '0' for this status
      };

      await exportTeamLeaderLeads(payload); // Pass the payload object
      toast({
        title: "Export Successful",
        description: "Your leads have been exported.",
        className: 'bg-green-500 text-white'
    });
    } catch (error: any) { // Type the error for //console.error
        //console.error("Export failed", error);
        toast({
            title: "Export Failed",
            description: error.message || "Could not export leads. Please try again.", // Display error message from API
            variant: "destructive"
        });
    }
};

  async function openEditModal(lead: any) {
    setEditingLead(lead);
    setStatusValue(lead.status || 'Intrested');
    setMessageValue(lead.message || '');
    setFollowDate(lead.follow_up_date || '');
    setFollowTime(lead.follow_up_time || '');
    setShowModal(true);
  }

  async function saveChanges() {
    if (!editingLead) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    toast({
        title: "Status Updated",
        description: `Follow-up for ${editingLead.name} has been updated.`,
        className: 'bg-green-500 text-white'
    });
    setShowModal(false);
    fetchLeads(); // Refresh leads
  }

  const table = useReactTable({
    data: leads,
    columns: [
      {
        id: 'sn_expander',
        header: 'S.N.',
        cell: ({ row }) => (
          <>
            {/* Mobile: only button */}
            <div className="md:hidden">
              <Button
                size="icon"
                variant="ghost"
                className="text-green-600"
                onClick={() => toggleRow(row.original.id)}
              >
                {expandedRowId === row.original.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            {/* md to lg-1: only button (no number), centered */}
            <div className="hidden md:flex lg:hidden justify-center">
              <Button
                size="icon"
                variant="ghost"
                className="text-green-600"
                onClick={() => toggleRow(row.original.id)}
              >
                {expandedRowId === row.original.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            {/* lg+: only number */}
            <div className="hidden lg:block">
              {row.index + 1}.
            </div>
          </>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'staff',
        header: 'Staff',
        cell: ({ row }) => <div className="capitalize">{row.original.assigned_to?.name || 'N/A'}</div>,
      },
      {
        accessorKey: 'teamLeader',
        header: 'Team Leader',
        cell: ({ row }) => <div className="capitalize">{row.original.team_leader || 'N/A'}</div>,
        meta: {
          className: 'hidden md:table-cell', // Hide below md (mobile), show md+
        },
      },
      {
        accessorKey: 'call',
        header: 'Call',
        cell: ({ row }) => (
          <a href={`tel:+91${row.getValue('call')}`} className="inline-block hover:scale-110 transition-transform">
            <Phone className="h-5 w-5 text-blue-500" />
          </a>
        ),
        meta: {
          className: 'hidden md:table-cell', // Hide below md (mobile), show md+
        },
      },
      {
        accessorKey: 'whatsapp',
        header: 'Whatsapp',
        cell: ({ row }) => (
          <a 
            href={`https://wa.me/+91${row.getValue('call')}?text=${encodeURIComponent('Hello ' + row.original.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:scale-110 transition-transform"
          >
            <MessageSquare className="h-6 w-6 text-green-500" />
          </a>
        ),
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+
        },
      },
      {
        accessorKey: 'follow_up_date',
        header: 'Date',
        cell: ({ row }) => <div className="capitalize">{row.getValue('follow_up_date') || 'N/A'}</div>,
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+
        },
      },
      {
        accessorKey: 'follow_up_time',
        header: 'Time',
        cell: ({ row }) => <div className="capitalize">{row.getValue('follow_up_time') || 'N/A'}</div>,
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+
        },
      },
      {
        id: 'history',
        header: 'History',
        cell: ({ row }) => (
          <Link href={`/team-leader/lead-history?id=${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <HistoryIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            </Button>
          </Link>
        ),
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+ (replaced actions)
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <TooltipProvider>
    <div className="space-y-6 flex flex-col h-full pt-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">
              <div className="relative w-full flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('name')?.setFilterValue(event.target.value)
                  }
                  className="pl-10 w-full"
                />
              </div>
      
              <div className="space-y-2 w-full flex-1">
                <Label htmlFor="start_date">Start Date</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="space-y-2 w-full flex-1">
                <Label htmlFor="end_date">End Date</Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
              <div className="w-full flex-1">
                <Button type="button" onClick={handleExport} className="h-9 w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-2 md:p-6 md:pt-4">
            <div className="w-full rounded-md border overflow-x-hidden md:overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className={`text-center px-2 ${header.column.columnDef.meta?.className || ''}`}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className={`text-center px-2 ${cell.column.columnDef.meta?.className || ''}`}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                        {expandedRowId === row.original.id && (
                          <TableRow className="lg:hidden">
                            <TableCell colSpan={table.getAllColumns().length} className="p-0">
                              <div className="p-4">
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                    <Avatar>
                                      <AvatarImage src={`https://avatar.vercel.sh/${row.original.name}.png`} alt={row.original.name} />
                                      <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="text-lg font-bold">{row.original.name}</div>
                                      <div className="text-sm text-gray-500">{row.original.status || 'N/A'}</div>
                                    </div>
                                  </div>
                                  {/* Table-like grid for details: 2 cols on md+, 1 on mobile */}
                                  <div className="overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                      {/* Row 1: Call | Whatsapp */}
                                      <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <Phone className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Call:</span>
                                        </div>
                                        <a href={`tel:+91${row.original.call}`} className="text-sm text-blue-500 hover:underline ml-auto md:ml-0">
                                          {row.original.call}
                                        </a>
                                      </div>
                                      <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <MessageSquare className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Whatsapp:</span>
                                        </div>
                                        <a 
                                          href={`https://wa.me/+91${row.original.call}?text=${encodeURIComponent('Hello ' + row.original.name)}`} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="text-sm text-green-500 hover:underline ml-auto md:ml-0"
                                        >
                                          Message
                                        </a>
                                      </div>
                                      {/* Row 2: Status | Staff */}
                                      <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <Tag className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Status:</span>
                                        </div>
                                        <span className="text-sm capitalize ml-auto md:ml-0">{row.original.status || 'N/A'}</span>
                                      </div>
                                      <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <Users className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Staff:</span>
                                        </div>
                                        <span className="text-sm capitalize ml-auto md:ml-0">{row.original.assigned_to?.name || 'N/A'}</span>
                                      </div>
                                      {/* Row 3: Follow Up Date | Follow Up Time */}
                                      <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Follow Up Date:</span>
                                        </div>
                                        <span className="text-sm ml-auto md:ml-0">{row.original.follow_up_date || 'N/A'}</span>
                                      </div>
                                      <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Follow Up Time:</span>
                                        </div>
                                        <span className="text-sm ml-auto md:ml-0">{row.original.follow_up_time || 'N/A'}</span>
                                      </div>
                                      {/* Row 4: Team Leader | Follow Up Button */}
                                      <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                        <div className="flex items-center">
                                          <Users className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Team Leader:</span>
                                        </div>
                                        <span className="text-sm capitalize ml-auto md:ml-0">{row.original.team_leader || 'N/A'}</span>
                                      </div>
                                      <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-center md:justify-end">
                                        <Button size="sm" onClick={() => openEditModal(row.original)}>
                                          Follow Up
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 border-t">
              <div className="flex flex-col items-center space-y-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getRowModel().rows.length} of {leads.length} entries
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className={!table.getCanPreviousPage() ? '' : 'bg-orange-500 hover:bg-orange-600 text-white'}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className={!table.getCanNextPage() ? '' : 'bg-orange-500 hover:bg-orange-600 text-white'}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal} >
        <DialogContent className="w-[95vw] sm:max-w-md p-4 max-h-[90vh] flex flex-col rounded-md">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Leads Update</DialogTitle>
            <DialogDescription>Update the status and follow-up details for this lead.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 p-4 overflow-y-auto flex-1 ">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
               <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Intrested">Follow Up</SelectItem>
                    <SelectItem value="Lost">Discard</SelectItem>
                    <SelectItem value="Visit">Visit</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {statusValue === 'Intrested' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">
                    <span className="hidden sm:inline"></span><span className="sm:hidden"></span> Date
                  </Label>
                  <Input id="followUpDate" type="date" value={followDate} onChange={(e) => setFollowDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="followUpTime">
                    <span className="hidden sm:inline"></span><span className="sm:hidden"></span> Time 
                  </Label>
                  <Input id="followUpTime" type="time" value={followTime} onChange={(e) => setFollowTime(e.target.value)} className='p-1' />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={messageValue} onChange={(e) => setMessageValue(e.target.value)} placeholder="Enter a message or notes..."/>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={saveChanges}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}











// class TeamLeaderExportDashboardLeadsAPIView(APIView):
//     """
//     API to export leads for 4 specific pages: Interested, Pending, Today, Tomorrow.
//     POST: Generates Excel file based on 'tag' and optional date range.
//     """
//     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser]

//     def post(self, request, format=None):
//         # 1. Get Params
//         tag = request.data.get('tag') # E.g., 'today_followups', 'Intrested'
//         staff_id = request.data.get('staff_id')
//         start_date_str = request.data.get('start_date')
//         end_date_str = request.data.get('end_date')
        
//         # 2. Verify Team Leader
//         try:
//             tl_instance = Team_Leader.objects.get(user=request.user)
//         except Team_Leader.DoesNotExist:
//             return Response({"error": "Team Leader profile not found."}, status=status.HTTP_404_NOT_FOUND)

//         # 3. Determine Base Queryset (All TL leads or Specific Staff)
//         if staff_id:
//             try:
//                 staff = Staff.objects.get(id=staff_id)
//                 if staff.team_leader != tl_instance:
//                     return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
//                 # Staff Leads
//                 base_qs = LeadUser.objects.filter(assigned_to=staff)
//             except Staff.DoesNotExist:
//                  return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
//         else:
//             # All Leads under TL (Assigned to any staff OR unassigned)
//             staff_members = Staff.objects.filter(team_leader=tl_instance)
//             base_qs = LeadUser.objects.filter(
//                 Q(assigned_to__in=staff_members) | Q(team_leader=tl_instance, assigned_to=None)
//             )

//         # 4. Date Setup
//         today = timezone.now().date()
//         tomorrow = today + timedelta(days=1)

//         # --- 5. FILTER LOGIC BASED ON TAG ---
        
//         if tag == 'today_followups':
//             # Logic: Status Interested + FollowUp Date is TODAY
//             leads = base_qs.filter(status='Intrested', follow_up_date=today)
//             filename_tag = "Today_FollowUps"
            
//         elif tag == 'tomorrow_followups':
//             # Logic: Status Interested + FollowUp Date is TOMORROW
//             leads = base_qs.filter(status='Intrested', follow_up_date=tomorrow)
//             filename_tag = "Tomorrow_FollowUps"

//         elif tag == 'pending_followups':
//             # Logic: Status Interested + FollowUp Date exists (Pending)
//             leads = base_qs.filter(status='Intrested', follow_up_date__isnull=False)
//             filename_tag = "Pending_FollowUps"

//         elif tag == 'Intrested':
//             # Logic: Status Interested + User selected Date Range (Created/Updated)
//             try:
//                 if start_date_str and end_date_str:
//                     s_date = datetime.strptime(start_date_str, '%Y-%m-%d')
//                     e_date = datetime.strptime(end_date_str, '%Y-%m-%d')
                    
//                     start = timezone.make_aware(datetime.combine(s_date, datetime.min.time()))
//                     end = timezone.make_aware(datetime.combine(e_date, datetime.max.time()))
                    
//                     # Filter by updated_date
//                     leads = base_qs.filter(status='Intrested', updated_date__range=[start, end])
//                 else:
//                     # Default: All Interested
//                     leads = base_qs.filter(status='Intrested')
//             except ValueError:
//                  return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)
            
//             filename_tag = "Interested_Leads"

//         else:
//              return Response({"error": "Invalid tag provided."}, status=status.HTTP_400_BAD_REQUEST)

//         # --- 6. GENERATE EXCEL ---
//         data = []
//         for lead in leads:
//             assigned_name = lead.assigned_to.name if lead.assigned_to else "Unassigned"
            
//             data.append({
//                 'Name': lead.name,
//                 'Call': lead.call,
//                 'Status': lead.status,
//                 'Staff Name': assigned_name,
//                 'Follow Up Date': lead.follow_up_date,
//                 'Follow Up Time': lead.follow_up_time,
//                 'Message': lead.message,
//                 'Date Added': localtime(lead.created_date).strftime('%Y-%m-%d'),
//             })

//         if not data:
//              return Response({"message": "No data found for export."}, status=status.HTTP_404_NOT_FOUND)

//         df = pd.DataFrame(data)
//         response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
//         response['Content-Disposition'] = f'attachment; filename={filename_tag}_{today}.xlsx'

//         with pd.ExcelWriter(response, engine='xlsxwriter') as writer:
//             df.to_excel(writer, index=False, sheet_name='Leads')

//         return response







//  path('api/team-leader/staff-dashboard/', api.TeamLeaderStaffDashboardAPIView.as_view(), name='api_team_leader_staff_dashboard'),

//     # --- TEAM LEADER ADD STAFF ---
//     path('api/team-leader/add-staff/', api.TeamLeaderAddStaffAPIView.as_view(), name='api_team_leader_add_staff'),

//     # --- TEAM LEADER EDIT STAFF ---
//     path('api/team-leader/staff/edit/<int:id>/', api.TeamLeaderStaffEditAPIView.as_view(), name='api_team_leader_staff_edit'),

//     # ---  STAFF (CALENDAR) 
//     path('api/team-leader/staff-calendar/<int:staff_id>/', api.TeamLeaderStaffCalendarAPIView.as_view(), name='api_team_leader_staff_calendar'),

//     # --- TEAM LEADER VIEW STAFF INCENTIVE ---
//     path('api/team-leader/staff-incentive/<int:staff_id>/', api.TeamLeaderStaffIncentiveAPIView.as_view(), name='api_team_leader_staff_incentive'),

//     # --- TEAM LEADER STAFF LEADS LIST (GET) ---
//     path('api/team-leader/staff-leads/<int:staff_id>/<str:tag>/', api.TeamLeaderStaffLeadsListAPIView.as_view(), name='api_tl_staff_leads_list'),

//     # --- TEAM LEADER EXPORT LEADS (POST) ---
//     path('api/team-leader/export-leads/', api.TeamLeaderExportLeadsAPIView.as_view(), name='api_tl_export_leads'),

//     # --- TEAM LEADER ALL LEADS (CARD CLICK) ---
//     path('api/team-leader/all-leads/<str:tag>/', api.TeamLeadLeadsReportAPIView.as_view(), name='api_tl_all_leads'),

//     #STAFFPRODUCTIVITY
//     path('api/team-leader/productivity-report/', api.TeamLeaderStaffProductivityReportAPIView.as_view(), name='api_team_leader_productivity_report'),

//     # --- FREELANCER PRODUCTIVITY REPORT ---
//     path('team-leader/freelancer-productivity/', TeamLeaderFreelancerProductivityAPIView.as_view(), name='teamleader-freelancer-productivity'),

//     # --- TEAM LEADER LEADS DASHBOARD ---
//     path('api/leads/', LeadsDashboardAPIView.as_view(), name='leads-dashboard'),

//     #ADDLEADAPI
//     path('api/leads/add/', AddLeadAPI.as_view(), name='api-add-lead'),


//     #TEAMCUSTOMESTAGSS
//     path('api/teamcustomer/<str:tag>/', TeamCustomerAPIView.as_view(), name='api-teamcustomer-tag'),

//     # --- TEAM LEADER UPDATE LEAD STATUS ---
//     path('api/team-leader/update-lead/<int:id>/', api.TeamLeaderUpdateLeadAPIView.as_view(), name='api_tl_update_lead'),

//     # --- TEAM LEADER LEAD HISTORY ---
//     path('api/team-leader/lead-history/<int:id>/', api.TeamLeaderLeadHistoryAPIView.as_view(), name='api_tl_lead_history'),

//     #ACTIVITY LOGS
//     path('api/activityteamlogs/', ActivityLogsRoleAPIView.as_view(), name='api-activitylogs-role'),

//     #VISITTEAMLEADER
//     path('api/visits/', VisitTeamLeaderAPIView.as_view(), name='api-visits'),

//     # EXPORTSLEADS
//     path('api/team-leader/export-dashboard-leads/', api.TeamLeaderExportDashboardLeadsAPIView.as_view(), name='api_tl_export_dashboard'),

//     # --- TEAM LEADER PROFILE ---
//     path('api/team-leader/profile/', api.TeamLeaderProfileViewAPIView.as_view(), name='api_tl_profile'),

//      #... ADD SELL FREELANCER ...
//     path('api/v2/add_sell_freelancer/<int:id>/', AddSellFreelancerV2APIView.as_view(), name='api_add_sell_freelancer_v2'),












// from django.urls import path
// from . import views
// from django.conf import settings
// from django.conf.urls.static import static
// urlpatterns = [
//     path('', views.login, name='login'),
//     path('update-password/', views.update_password, name='update_password'),
//     path('leam_lead_show/<int:id>/<str:tag>/', views.teamleader_perticular_leads, name='leam_lead_show'),
//     path('export_leads_status_wise_staff/', views.export_leads_status_wise_staff, name='export_leads_status_wise_staff'),
//     # path('', views.super_dashboard, name='super_dashboard'),
//     path('super_admin/', views.super_admin, name='super_admin'),
//     path('super_user_dashboard/', views.super_user_dashboard, name='super_user_dashboard'),
//     path('admin_side_leads_record/<str:tag>/', views.admin_side_leads_record, name='admin_side_leads_record'),
//     path('admin_add/', views.admin_add, name='admin_add'),
//     path('team_dashboard/', views.team_dashboard, name='team_dashboard'),
//     path('add_team_leader_user/', views.add_team_leader_user, name='add_team_leader_user'),
//     path('team_leader_userss/', views.team_leader_user, name='team_leader_user'),
//     # path('home/', views.home, name='home'),
//     path('leads/', views.leads, name='leads'),
//     path('export_leads_staff/', views.export_leads_staff, name='export_leads_staff'),
//     path('customer_details/<str:email>/', views.customer_details, name='customer_details'),
//     path('assigned/<str:email>/',views.assigned,name='assigned'),
    
//     path('view_profile/', views.view_profile, name='view_profile'),
//     # path('add_user/', views.add_user, name='add_user'),
//     path('lost_leads/<str:tag>/', views.lost_leads, name='lost_leads'),
//     path('import_leads/', views.import_leads, name='import_leads'),
//     path('customer/', views.customer, name='customer'),
//     path('visits_staff/', views.visits_staff, name='visits_staff'),
//     path('maybe/', views.maybe, name='maybe'),
//     path('not_picked/', views.not_picked, name='not_picked'),
//     path('lost/', views.lost, name='lost'),
//     path('total_leads_admin/', views.total_leads_admin, name='total_leads_admin'),
//     path('visit_lead_staff_side/', views.visit_lead_staff_side, name='visit_lead_staff_side'),
//     # path('staff/', views.staff, name='staff'),
//     # path('new_staff_add/', views.new_staff_add, name='new_staff_add'),
//     path('logout/', views.logout_view, name='logout'),
//     path('status_update/', views.status_update, name='status_update'),
//     path('staff_user/', views.staff_user, name='staff_user'),
//     path('all_leads_data/<str:tag>/', views.all_leads_data, name='all_leads_data'),
//     path('add_staff/', views.add_staff, name='add_staff'),
//     path('staff_dashboard/', views.staff_dashboard, name='staff_dashboard'),
//     path('admin_view_profile/', views.admin_view_profile,name='admin_view_profile'),
//     # path('import/', views.import_data, name='import_data'),
//     path('excel_upload/', views.excel_upload, name='excel_upload'),
//     # path('update_user/', views.update_user, name='update_user'),
//     # path('Staff_excel_upload/', views.Staff_excel_upload, name='Staff_excel_upload'),
//     path('team_view_profile/', views.team_view_profile, name='team_view_profile'),
//     path('staff_view_profile/', views.staff_view_profile, name='staff_view_profile'),
//     # path('send-data/', views.send_data, name='send_data'),
//     path('adminedit/<int:id>/', views.adminedit, name='editadmin'),
//     path('teamedit/<int:id>/', views.teamedit, name='teamedit'),
//     path('staffedit/<int:id>/', views.staffedit, name='staffedit'),
//     path('bulk_from/', views.bulk_from, name='bulk_from'),
//     path('lead/', views.lead, name='lead'),
//     path('to-test-data/', views.bulk_from_data, name='bulk_from_data'),
//     path('update_send_status/', views.update_send_status, name='update_send_status'),
//     path('activitylogs/', views.activitylogs, name='activitylogs'),
//     path('log_activity_add/', views.log_activity_add, name='log_activity_add'),
//     path('edit-marketing/<str:source>/', views.edit_record, name='edit-marketing'),
//     path('update-record/', views.update_record, name='update_record'),
//     path('export/', views.export_users, name='export_users'),
//     # path('customer_details/<int:id>/',views.customer_details,name='customer_details'),

//     path('team_leader_staff_interested_leads/<int:id>/', views.team_leader_staff_interested_leads, name='team_leader_staff_interested_leads'),
    
//     path('teamcustomer/<str:tag>/', views.teamcustomer, name='teamcustomer'),
//     path('teamlost_leads/', views.teamlost_leads, name='teamlost_leads'),
//     path('teammaybe/', views.teammaybe, name='teammaybe'),
//     path('teamnot_picked/', views.teamnot_picked, name='teamnot_picked'),
//     path('teamlost/', views.teamlost, name='teamlost'),
//     path('visit_team_leader_side/', views.visit_team_leader_side, name='visit_team_leader_side'),

//     path('lead_user/<int:id>/', views.get_lead_user_data, name='get_lead_user_data'),
//     path('lead_user/update/<int:id>/', views.update_lead_user, name='update_lead_user'),
//     path('auto-assign/', views.auto_assign_leads, name='auto_assign'),

//     path('project/', views.project, name='project'),

//     path('send_file/<int:file_id>/', views.send_file_to_client,
//         name='send_file_to_client'),
        
//     path('executive-manager/add-inquiry/', views.add_inquiry, name="add_inquiry" ),
//     path('update-inquiry-forms/<int:id>/', views.update_inquiry_forms, name='update-inquiry-forms'),
//     path('interested-not-interested-inquiry/', views.interested_not_interested_inquiry, name="interested-not-interested-inquiry" ),
//     path('update-inquiry/<int:id>', views.update_inquiry, name="update_inquiry" ),
//     path('update-delivery-status/', views.update_inquiry_status, name="update_delivery" ),
//     path('inquiry_-lits/<str:status>', views.pending_inquiry_lists, name="inquiry_lists"),
//     # ----------------------------- Super Admin ------------------------------
//     path('get-team-leaders/', views.get_team_leaders, name='get_team_leaders'),
//     path('get_admin/', views.get_admin, name='get_admin'),
//     path('get_staff/', views.get_staff, name='get_staff'),

//     path('add_team_leader_admin_side/', views.add_team_leader_admin_side, name='add_team_leader_admin_side'),
//     path('add_staff_admin_side/', views.add_staff_admin_side, name='add_staff_admin_side'),
//     path('get_team_leaders_admin_side/', views.get_team_leaders_admin_side, name='get_team_leaders_admin_side'),
//     path('productivity_index/', views.productivity_index, name='productivity_index'),
//     path('staff-productivity/', views.staff_productivity_view, name='staff_productivity_view'),
//     path('teamleader_productivity_view/', views.teamleader_productivity_view, name='teamleader_productivity_view'),
//     path('admin_productivity_view/', views.admin_productivity_view, name='admin_productivity_view'),
//     path('freelancer_productivity_view/', views.freelancer_productivity_view, name='freelancer_productivity_view'),
//     path('toggle-user-active/', views.toggle_user_active, name='toggle_user_active'),
//     path('super_user_side_staff_leads/<str:tag>/', views.super_user_side_staff_leads, name='super_user_side_staff_leads'),

//     path('project_list/<str:tag>/', views.project_list, name='project_list'),
//     path('project_edit/<int:id>/', views.project_edit, name='project_edit'),
//     path('staff/<int:staff_id>/calendar/', views.staff_productivity_calendar_view, name='staff_calendar'),
//     path('check-location/', views.check_location, name='check_location'),
//     path('check-superuser/', views.check_superuser, name='check_superuser'),
//     path('incentive_slap_staff/<int:staff_id>/', views.incentive_slap_staff, name='incentive_slap_staff'),
//     path('add_sell_freelancer/<int:id>/', views.add_sell_freelancer, name='add_sell_freelancer'),

//     path('add_freelancer/', views.add_freelancer, name='add_freelancer'),
//     path('add_freelancer_super_side/', views.add_freelancer_super_side, name='add_freelancer_super_side'),
//     path('team_lead_leads_report/<int:id>/<str:tag>/', views.team_lead_leads_report, name='team_lead_leads_report'),
//     path('api/get-matching-leads/', views.get_matching_leads, name='get_matching_leads'),
//     path('api/today-interested-leads/', views.today_interested_count, name='today_interested_leads'),
//     path('attendance_calendar/<int:id>/', views.attendance_calendar, name='attendance_calendar'),
//     path('get-task-details/', views.get_task_details, name='get_task_details'),
//     path('get_logo/', views.get_logo, name='get_logo'),
//     path('it_staff_list/', views.it_staff_super_admin_side, name='it_staff_list'),
//     path('add_lead/', views.AddLeadBySelf, name='add_lead_by_self'),
//     path('lead_listory/<int:id>/', views.LeadHistory, name='lead_listory'),

// ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

