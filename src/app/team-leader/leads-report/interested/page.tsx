'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, MessageSquare, ArrowUpDown, Search, Plus, Minus, Tag, Calendar as CalendarIcon, Loader2, Users, History } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Add this line
import { cn } from '@/lib/utils'
import { getTeamCustomersByTag, exportTeamLeaderLeads, Lead } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar } from '@/components/ui/calendar';

function InterestedLeadsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [exportStatus, setExportStatus] = useState('Intrested'); // Add this line
  const { toast } = useToast();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
        const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
        // NOTE: getTeamCustomersByTag in api.ts currently only accepts 'tag' and not startDate/endDate.
        // If you need filtering by date for data fetching, the API function in api.ts needs to be updated.
        const data = await getTeamCustomersByTag('interested', formattedStartDate, formattedEndDate);
        setLeads(data.leads || []); // Uses data.leads, consistent with other pages
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leads.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [startDate, endDate]); // Added startDate, endDate to dependencies

  const handleExport = async () => {
    try {
      const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

      const payload = {
        status: 'Intrested',
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        all_interested: '1', // Set to '1' for interested leads export
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

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

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
            {/* md to lg-1: only button (no number) */}
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'staff', // New Staff column
        header: 'Staff',
        cell: ({ row }) => <div className="capitalize">{row.original.assigned_to?.name || 'N/A'}</div>,
      },
      {
        accessorKey: 'teamLeader', // New Team Leader column
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
          <a href={`tel:${row.getValue('call')}`} className="inline-block hover:scale-110 transition-transform">
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
            href={`https://wa.me/${row.getValue('call')}?text=${encodeURIComponent('Hello ' + row.original.name)}`}
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
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+
        },
      },
      {
        accessorKey: 'created_date',
        header: 'Date',
        cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue('created_date'))}</div>,
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+
        },
      },
      {
        id: 'history',
        header: 'History',
        cell: ({ row }) => (
          <Link href={`/team-leader/lead-history/${row.original.id}/`}>
            <Button variant="ghost" size="icon">
              <History className="h-5 w-5 text-purple-500" />
            </Button>
          </Link>
        ),
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+ (replaced any actions)
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
    <div className="flex flex-col gap-6 ">
      <h1 className="text-2xl font-bold">Interested</h1>

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
                                    <div className="text-sm text-gray-500">{row.original.status}</div>
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
                                      <a href={`tel:${row.original.call}`} className="text-sm text-blue-500 hover:underline ml-auto md:ml-0">
                                        {row.original.call}
                                      </a>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <MessageSquare className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Whatsapp:</span>
                                      </div>
                                      <a
                                        href={`https://wa.me/${row.original.call}?text=${encodeURIComponent('Hello ' + row.original.name)}`}
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
                                      <span className="text-sm capitalize ml-auto md:ml-0">{row.original.status}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Staff:</span>
                                      </div>
                                      <span className="text-sm capitalize ml-auto md:ml-0">{row.original.assigned_to?.name || 'N/A'}</span>
                                    </div>
                                    {/* Row 3: Team Leader | Date */}
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Team Leader:</span>
                                      </div>
                                      <span className="text-sm capitalize ml-auto md:ml-0">{row.original.team_leader || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        {/* <Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" /> */}
                                        <span className="text-sm font-medium">Date:</span>
                                      </div>
                                      <span className="text-sm ml-auto md:ml-0">{formatDate(row.original.created_date)}</span>
                                    </div>
                                    {/* Row 4: History | Empty (for balance) */}
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-center md:justify-start">
                                      <div className="flex items-center gap-2">
                                        <History className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <Link
                                          href={`/team-leader/lead-history/${row.original.id}/`}
                                          className="text-sm text-purple-500 hover:underline"
                                        >
                                          View History
                                        </Link>
                                      </div>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-center md:justify-start">
                                      {/* Empty cell for balance, or add spacer if needed */}
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
                      No results.
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

  );

}

export default InterestedLeadsPage;






  // class TeamLeaderExportLeadsAPIView(APIView):
  //     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser]

  //     def post(self, request, format=None):
  //         try:
  //             staff_id = request.data.get('staff_id')
  //             status_val = request.data.get('status')
  //             start_date_str = request.data.get('start_date')
  //             end_date_str = request.data.get('end_date')
  //             all_interested = request.data.get('all_interested')

  //             tl_instance = Team_Leader.objects.get(user=request.user)

  //             # FILTER: ALL Interested Leads
  //             if all_interested == "1":
  //                 base_qs = LeadUser.objects.filter(team_leader=tl_instance, status="Intrested")
  //                 staff_name = "All_Staff"
  //             else:
  //                 staff = Staff.objects.get(id=staff_id)
  //                 if staff.team_leader != tl_instance:
  //                     return Response({"error": "Permission denied."}, status=403)

  //                 base_qs = LeadUser.objects.filter(assigned_to=staff, status=status_val)
  //                 staff_name = staff.name

  //             # DATE RANGE
  //             tz = get_current_timezone()
  //             start_date = make_aware(datetime.strptime(start_date_str, "%Y-%m-%d"), tz)
  //             end_date = make_aware(
  //                 datetime.strptime(end_date_str, "%Y-%m-%d") + timedelta(days=1) - timedelta(seconds=1), 
  //                 tz
  //             )

  //             leads = base_qs.filter(updated_date__range=[start_date, end_date])

  //             if not leads.exists():
  //                 return Response({"message": "No data found for export."}, status=404)

  //             # PREPARE DATA
  //             data = [{
  //                 'Name': l.name,
  //                 'Call': l.call,
  //                 'Status': l.status,
  //                 'Staff Name': l.assigned_to.name if l.assigned_to else "N/A",
  //                 'Message': l.message,
  //                 'Date': l.updated_date.astimezone(tz).strftime('%Y-%m-%d %H:%M:%S')
  //             } for l in leads]

  //             df = pd.DataFrame(data)

  //             response = HttpResponse(
  //                 content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //             )
  //             filename_status = "Intrested" if all_interested == "1" else status_val
  //             response['Content-Disposition'] = (
  //                 f'attachment; filename={staff_name}_{filename_status}_{start_date_str}_to_{end_date_str}.xlsx'
  //             )

  //             with pd.ExcelWriter(response, engine='xlsxwriter') as writer:
  //                 df.to_excel(writer, index=False, sheet_name='Leads')

  //             return response

  //         except Exception as e:
  //             return Response({
  //                 "error": "Failed to export leads.",
  //                 "details": str(e)
  //             }, status=500)
        