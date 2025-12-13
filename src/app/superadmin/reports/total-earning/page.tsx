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
import { Phone, MessageSquare, ArrowUpDown, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'

import { useSearchParams } from 'next/navigation';
import { fetchLeadsForSuperuser } from '@/lib/api';

type Lead = any;

const TotalEarningContent = () => {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const source = searchParams.get('source');
        const data = await fetchLeadsForSuperuser('total_earning', source);
        setLeads(data.results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leads.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  const columns: ColumnDef<Lead>[] = [
    {
      id: 'sn',
      header: 'S.N.',
      cell: ({ row }) => (
          <div className="hidden md:block"> {/* Desktop: S.N. */}
            {row.index + 1}
          </div>
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
          href={`https://wa.me/${row.original.call}?text=${encodeURIComponent('Hello ' + row.original.name)}`}
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
      cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
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
      <h1 className="text-2xl font-bold">Total Earnings</h1>
      
      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-2 md:p-6 md:pt-0">
            
            <div className="flex items-center justify-between mb-4 px-2 pt-4 md:px-0">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by staff name..."
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


export default function TotalEarningPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TotalEarningContent />
    </Suspense>
  );
}
