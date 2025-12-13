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
import { Phone, MessageSquare, ArrowUpDown, Search, Plus, Minus, Tag, Loader2, History as HistoryIcon, Calendar, Users, Eye } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'
import { Lead } from '@/lib/api';
import { DetailsDialog } from '@/components/details-dialog';

function VisitLeadsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/visits/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeads(data.items || []);
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

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
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
          className: 'hidden lg:table-cell', // Hide below md (mobile), show md+
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
        header: 'Time and Date',
        cell: ({ row }) => {
          const date = new Date(row.getValue('created_date'));
          const dateString = date.toLocaleDateString('en-GB').replace(/\//g, '-');
          const timeString = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return (
            <div className="flex flex-col">
              <span>{dateString}</span>
              <span className="text-muted-foreground text-xs">{timeString}</span>
            </div>
          );
        },
        meta: {
          className: 'hidden sm:table-cell',
        },
      },
      {
        id: 'history',
        header: 'History',
        cell: ({ row }) => (
          <Link href={`/team-leader/lead-history?id=${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <HistoryIcon className="h-5 w-5 text-purple-500" />
            </Button>
          </Link>
        ),
        meta: {
          className: 'hidden lg:table-cell', // Hide below lg (mobile + md), show lg+
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
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Visit Leads</h1>
      
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
                                          <Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                          <span className="text-sm font-medium">Date:</span>
                                        </div>
                                        <span className="text-sm ml-auto md:ml-0">{row.original.created_date}</span>
                                      </div>
                                      {/* Row 4: History | Empty (for balance) */}
                                      <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-center md:justify-start">
                                        <div className="flex items-center gap-2">
                                          <HistoryIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
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
      {selectedLead && (
        <DetailsDialog
          title="Lead Details"
          description="Complete information about the lead."
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          details={[
            { label: 'Name', value: selectedLead.name, icon: Users },
            { label: 'Phone', value: selectedLead.call, icon: Phone },
            { label: 'Status', value: selectedLead.status, icon: Tag },
            { label: 'Staff', value: selectedLead.assigned_to?.name, icon: Users },
            { label: 'Team Leader', value: selectedLead.team_leader?.name, icon: Users },
            { label: 'Date & Time', value: selectedLead.dateTime, icon: Calendar },
          ]}
        />
      )}
    </div>
  );
}

export default VisitLeadsPage;




// {
//     "items": [
//         {
//             "id": 8,
//             "name": "Nishu Verma",
//             "email": "nishu720@gmail.com",
//             "call": "67807543467",
//             "send": null,
//             "status": "Visit",
//             "message": "Hello,Nishu",
//             "team_leader": "Indrajeet ",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-21T07:59:58.972610Z",
//             "assigned_to": null,
//             "project_id": null,
//             "project": null
//         },
//         {
//             "id": 5,
//             "name": "Pranav soni",
//             "email": "pranav720@gamil.com",
//             "call": "5678907856",
//             "send": null,
//             "status": "Visit",
//             "message": null,
//             "team_leader": "Indrajeet ",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-19T06:26:10.533145Z",
//             "assigned_to": {
//                 "id": 2,
//                 "name": "Ayush Sharma",
//                 "staff_id": "VRI315",
//                 "email": "ayush720@gmail.com",
//                 "mobile": "7865431249"
//             },
//             "project_id": null,
//             "project": null
//         }
//     ],
//     "total_items": 2,
//     "page": 1,
//     "page_size": 50,
//     "total_pages": 1,
//     "page_range": [
//         1
//     ],
//     "reference_image": "/mnt/data/c2dc665d-9d54-40ab-a57d-08f450e93be3.png"
// }