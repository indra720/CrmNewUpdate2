'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

interface LeadHistory {
  id: number
  lead_id: number
  status: string
  name: string
  message: string
  created_date: string
}

const LeadHistoryContent = ({ params }: { params: { id: string } }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>([])
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null)
  const [data, setData] = useState<LeadHistory[]>([])
  const [loading, setLoading] = useState(true)
  const leadId = params.id
  const router = useRouter()

  useEffect(() => {
    if (leadId) {
      const token = localStorage.getItem('authToken')
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/lead-history/${leadId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(result => {
          setData(result.results || [])
          setLoading(false)
        })
        .catch(() => {
          setData([])
          setLoading(false)
        })
    }
  }, [leadId])

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
          <div className="hidden md:block text-left"> {/* Desktop: S.N. number, left-aligned */}
            {row.index + 1}
          </div>
        </>
      ),
      meta: {
        className: 'w-16 text-left', // Fixed width and left alignment for consistent gap
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-left justify-start" // Left-align header button
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium text-left">{row.getValue('name')}</div>, // Left-align cell
      meta: {
        className: 'w-52 text-left', // Fixed width and left alignment for consistent gap
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-left justify-start" // Left-align on all screens
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize text-left">{row.getValue('status')}</div>,
      meta: {
        className: 'w-32 text-left', // Fixed width and left alignment for consistent gap
      },
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <div className="max-w-xs truncate text-left">{row.getValue('message')}</div>,
      meta: {
        className: 'hidden md:table-cell w-72 text-left', // Fixed width and left alignment for consistent gap
      },
    },
    {
      accessorKey: 'created_date',
      header: 'Date',
      cell: ({ row }) => <div className="text-left">{new Date(row.getValue('created_date')).toLocaleDateString()}</div>,
      meta: {
        className: 'hidden md:table-cell w-32 text-left', // Fixed width and left alignment for consistent gap
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => router.push('/team-leader/leads-report/visit')}>
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
                            'px-4 py-3', // Adjusted padding
                            header.column.columnDef.meta?.className
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
                                  'px-4 py-4', // Adjusted padding
                                  cell.column.columnDef.meta?.className
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



// class TeamLeaderLeadHistoryAPIView(APIView):
//     """
//     API endpoint for 'LeadHistory' function (Team Leader Dashboard).
//     GET: Fetches history of a specific lead.
//     ONLY TEAM LEADER can access this.
//     """
//     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser]
//     pagination_class = StandardResultsSetPagination

//     def get(self, request, id, format=None):
//         # 1. Verify Team Leader
//         try:
//             tl_instance = Team_Leader.objects.get(user=request.user)
//         except Team_Leader.DoesNotExist:
//             return Response({"error": "Team Leader profile not found."}, status=status.HTTP_404_NOT_FOUND)

//         # 2. Verify Lead Access
//         # Check karo ki ye lead is TL ke kisi staff ki hai, ya TL ki khud ki hai
//         try:
//             lead = LeadUser.objects.get(id=id)
//             is_authorized = False
            
//             # Case A: Lead is assigned to a staff under this TL
//             if lead.assigned_to and lead.assigned_to.team_leader == tl_instance:
//                 is_authorized = True
//             # Case B: Lead is directly under this TL (rare but possible)
//             elif lead.team_leader == tl_instance:
//                 is_authorized = True
                
//             if not is_authorized:
//                 return Response({"error": "Permission denied. This lead does not belong to your team."}, status=status.HTTP_403_FORBIDDEN)

//         except LeadUser.DoesNotExist:
//             # Agar lead LeadUser me nahi hai, toh shayad wo Team_LeadData (uploaded) me ho?
//             # History usually LeadUser ki hi hoti hai. Agar nahi mili to 404.
//             return Response({"error": "Lead not found."}, status=status.HTTP_404_NOT_FOUND)

//         # 3. Get History
//         history_qs = Leads_history.objects.filter(lead_id=id).order_by('-updated_date')

//         # 4. Paginate & Serialize
//         paginator = self.pagination_class()
//         page = paginator.paginate_queryset(history_qs, request, view=self)
        
//         if page is not None:
//             serializer = LeadsHistorySerializer(page, many=True)
//             return paginator.get_paginated_response(serializer.data)

//         serializer = LeadsHistorySerializer(history_qs, many=True)
//         return Response(serializer.data)
    














// {
//     "count": 1,
//     "next": null,
//     "previous": null,
//     "results": [
//         {
//             "id": 7,
//             "lead_id": 7,
//             "status": "Intrested",
//             "name": "Nikhil saini",
//             "message": null,
//             "created_date": "2025-11-19T12:38:59.147456Z",
//             "updated_date": "2025-11-19T12:38:59.147456Z",
//             "leads": 7
//         }
//     ]
// }
    





export default function LeadHistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadHistoryContent />
    </Suspense>
  );
}
