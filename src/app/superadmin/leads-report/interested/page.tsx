'use client';

import React, { useState, useEffect } from 'react';
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
import { Phone, MessageSquare, ArrowUpDown, Search, Plus, Minus, Tag, Calendar, Loader2, Users, History } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'
import { fetchInterestedLeads, Lead } from '@/lib/api';

function InterestedLeadsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await fetchInterestedLeads();
        setLeads(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leads.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
          <Link href={`/superadmin/lead-history?id=${row.original.id}`}>
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
      
      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-2 md:p-6 md:pt-0">
            
            <div className="flex items-center justify-between mb-4 px-2 pt-4 md:px-0">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('name')?.setFilterValue(event.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full rounded-md border overflow-x-hidden md:overflow-x-auto">
              <Table className="table-auto min-w-full">
                <TableHeader className="min-w-full">
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
                                          <Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Date:</span>
                                        </div>
                                        <span className="text-sm ml-auto md:ml-0">{formatDate(row.original.created_date)}</span>
                                      </div>
                                      {/* Row 4: History | Empty (for balance) */}
                                      <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-center md:justify-start">
                                        <div className="flex items-center gap-2">
                                          <History className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                          <Link 
                                            href={`/superadmin/lead-history?id=${row.original.id}`}
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
    </div>
  );
}

export default InterestedLeadsPage;











// class SuperUserStaffLeadsAPIView(APIView):

//     permission_classes = [IsAuthenticated, CustomIsSuperuser]
//     pagination_class = StandardResultsSetPagination 

//     def get(self, request, tag, format=None):
//         paginator = self.pagination_class()
        
//         # Superuser ko saare leads milte hain
//         base_queryset = LeadUser.objects.all()

//         status_map = {
//             'total_lead': 'Leads',
//             'visits': 'Visit',
//             'interested': 'Intrested',
//             'not_interested': 'Not Interested',
//             'other_location': 'Other Location',
//             'not_picked': 'Not Picked',
//             'lost': 'Lost'
//         }

//         if tag in status_map:
//             queryset = base_queryset.filter(status=status_map[tag])
//         else:
//             return Response(
//                 {"error": f"Invalid tag: {tag}. Valid tags are: {list(status_map.keys())}"},
//                 status=status.HTTP_400_BAD_REQUEST
//             )

//         queryset = queryset.order_by('-updated_date')
        
//         page = paginator.paginate_queryset(queryset, request, view=self)
//         if page is not None:
//             serializer = ApiLeadUserSerializer(page, many=True)
//             return paginator.get_paginated_response(serializer.data)

//         serializer = ApiLeadUserSerializer(queryset, many=True)
//         return Response(serializer.data)
