'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { format } from 'date-fns';
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
import { Search, Loader2, Phone, MessageSquare, ArrowUpDown, Calendar as CalendarIcon, FileDown, ArrowLeft, Briefcase, Users, Clock, Tag, MoreVertical, Plus, Minus , HistoryIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DatePicker } from '@/components/ui/date-picker';
import { getTeamCustomerLeads } from '@/lib/api';
import { Calendar } from '@/components/ui/calendar';

const TomorrowFollowupsContent = () => {
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

      const data = await getTeamCustomerLeads('tommorrow_follow', search, formattedStartDate, formattedEndDate); 
      setLeads(data.results);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [page, search, startDate, endDate]);

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
          <Link href={`/superadmin/lead-history?id=${row.original.id}`}>
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Date Pickers and Export Form */}
          <form className="flex flex-col gap-4 md:flex-row md:items-end w-full lg:w-auto">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
            <Button type="submit" className="h-9 w-full md:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </form>
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
export default function TomorrowFollowupsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TomorrowFollowupsContent />
    </Suspense>
  );
}
