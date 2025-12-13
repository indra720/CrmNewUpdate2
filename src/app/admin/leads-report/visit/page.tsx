'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
import { Phone, MessageSquare, ArrowUpDown, Search, Plus, Minus, Tag, Calendar, Loader2, History } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { updateAdminLeadStatus } from '@/lib/api';

import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type Lead = any;

const LEAD_STATUS_OPTIONS = [
  'Leads',
  'Interested',
  'Not Interested',
  'Visit',
  'Not Picked',
  'Other Location',
  'Lost',
];

const VisitLeadsContent = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(false);
    setLeads([]);
  }, []);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      // Optimistically update the UI
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      await updateAdminLeadStatus(leadId, newStatus);
      toast({
        title: 'Success',
        description: `Lead status updated to ${newStatus}.`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to update lead status: ${err.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      // Revert UI on error (optional, but good for UX)
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: lead.status } : lead
        )
      );
    }
  };


  const columns: ColumnDef<Lead>[] = [
    {
      id: 'sn_expander',
      header: 'S.N.',
      cell: ({ row }) => (
        <>
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
          <div className="hidden md:block">
            {row.index + 1}
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
      accessorKey: 'call',
      header: 'Call',
      cell: ({ row }) => (
        <a href={`tel:${row.getValue('call')}`} className="inline-block hover:scale-110 transition-transform">
          <Phone className="h-5 w-5 text-blue-500" />
        </a>
      ),
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
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(newStatus) => handleStatusChange(row.original.id, newStatus)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUS_OPTIONS.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {statusOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      meta: {
        className: 'hidden sm:table-cell',
      },
    },
    {
      id: 'history_action', // Use a unique ID for action columns
      header: 'History',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/lead-history?leadId=${row.original.id}`)}>
          <History className="h-5 w-5 text-gray-500" />
        </Button>
      ),
      meta: {
        className: 'hidden sm:table-cell',
      },
    },
  ];
  const table = useReactTable({
    data: leads,
    columns,
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
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Visit Leads</h1>
      </div>

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
                          <TableHead key={header.id} className={`text-center px-1 ${header.column.columnDef.meta?.className || ''}`}>
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
                            <TableCell key={cell.id} className={`text-center px-1 ${cell.column.columnDef.meta?.className || ''}`}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                        {expandedRowId === row.original.id && (
                          <TableRow className="sm:hidden">
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
                                  <div className="p-4 grid grid-cols-1 gap-4">
                                    <div className="flex items-center">
                                      <Phone className="h-4 w-4 mr-3 text-gray-500" />
                                      <span className="text-sm">{row.original.call}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <MessageSquare className="h-4 w-4 mr-3 text-gray-500" />
                                      <a 
                                        href={`https://wa.me/${row.original.call}?text=${encodeURIComponent('Hello ' + row.original.name)}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-sm"
                                      >
                                        Whatsapp
                                      </a>
                                    </div>
                                    <div className="flex items-center">
                                      <Tag className="h-4 w-4 mr-3 text-gray-500" />
                                      <span className="text-sm">Status: {row.original.status}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                                      <span className="text-sm">{new Date(row.original.created_date).toLocaleDateString('en-GB').replace(/\//g, '-')} time {new Date(row.original.created_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
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
                        No visit leads found.
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

export default function VisitLeadsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitLeadsContent />
    </Suspense>
  );
}
