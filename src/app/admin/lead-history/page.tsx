'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
} from '@tanstack/react-table'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowUpDown, Search, Plus, Minus, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { fetchAdminDashboardLeadHistoryById } from '@/lib/api';


interface LeadHistory {
  id: number
  lead_id: number
  status: string
  name: string
  message: string
  created_date: string
}

const LeadHistoryContent = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>([])
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null)
  const [data, setData] = useState<LeadHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const leadId = searchParams.get('leadId')
  const router = useRouter()

  useEffect(() => {
    async function getLeadHistory() {
      if (leadId) {
        setLoading(true);
        setHistoryError(null); // Reset error on new fetch
        try {
          const result = await fetchAdminDashboardLeadHistoryById(leadId);
          setData(result || []);
        } catch (err: any) { // Type err as any for message property
          //console.error("Failed to fetch lead history:", err);
          setData([]);
          setHistoryError(err.message || 'Failed to fetch lead history.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setData([]);
        setHistoryError('No lead ID provided.'); // Set error if no leadId
      }
    }
    getLeadHistory();
  }, [leadId]);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId)
  }

  const columns: ColumnDef<LeadHistory>[] = [
    {
      id: 'sn_expander',
      header: 'S.N.',
      cell: ({ row }) => (
        <>
          <div className="md:hidden"> {/* Mobile: Only plus/minus icon, left-aligned */}
            <Button
              size="icon"
              variant="ghost"
              className="text-green-600"
              onClick={() => toggleRow(row.original.id)}
            >
              {expandedRowId === row.original.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          <div className="hidden md:block"> {/* Desktop: S.N. number */}
            {row.index + 1}
          </div>
        </>
      ),
      meta: {
        className: 'w-12', // Narrow column for S.N.
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-left justify-start" // Left-align header button on mobile
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium text-left">{row.getValue('name')}</div>, // Left-align cell
      meta: {
        className: '', // Show on mobile and desktop
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-left justify-start md:text-center md:justify-center" // Left-align on mobile, center on desktop
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize text-left md:text-center">{row.getValue('status')}</div>,
      meta: {
        className: '', // Show on mobile and desktop
      },
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue('message')}</div>,
      meta: {
        className: 'hidden md:table-cell', // Hide on mobile
      },
    },
    {
      accessorKey: 'created_date',
      header: 'Date',
      cell: ({ row }) => <div>{new Date(row.getValue('created_date')).toLocaleDateString()}</div>,
      meta: {
        className: 'hidden md:table-cell', // Hide on mobile
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFiltersState,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (historyError) {
    return (
      <div className="flex justify-center items-center h-32 text-red-500">
        <p>Error: {historyError}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h1 className="text-2xl font-bold">Lead History (ID: {leadId})</h1>
      </div>
      
      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-2 md:p-6 md:pt-0">
            
            <div className="flex items-center justify-between mb-4 px-2 pt-4 md:px-0">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('name')?.setFilterValue(event.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id}
                          className={cn(
                            'px-2 py-3', // Adjusted padding
                            header.column.columnDef.meta?.className,
                            'text-left md:text-center' // Left on mobile, center on desktop
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <>
                      {table.getRowModel().rows.map((row) => (
                        <React.Fragment key={row.id}>
                          <TableRow data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell 
                                key={cell.id}
                                className={cn(
                                  'px-2 py-4', // Adjusted padding
                                  cell.column.columnDef.meta?.className,
                                  'text-left md:text-center' // Left on mobile, center on desktop
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                          
                          {expandedRowId === row.original.id && (
                            <TableRow className="md:hidden transition-all duration-300 ease-in-out"> {/* Added slide animation */}
                              <TableCell colSpan={columns.length} className="p-0">
                                <div className="animate-slide-down"> {/* Custom animation class - add to globals.css if needed */}
                                  <div className="p-4 bg-muted/50 border-t border-b">
                                    {/* Mini Table for Full Details */}
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="border-b">
                                          <TableHead className="w-1/3 font-semibold">Field</TableHead>
                                          <TableHead className="w-2/3">Value</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell className="font-medium">Name</TableCell>
                                          <TableCell>{row.original.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Status</TableCell>
                                          <TableCell className="capitalize">{row.original.status}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Message</TableCell>
                                          <TableCell className="max-w-xs truncate">{row.original.message}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Date</TableCell>
                                          <TableCell>{new Date(row.original.created_date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



export default function LeadHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadHistoryContent />
    </Suspense>
  );
}


