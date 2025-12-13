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
import { cn } from '@/lib/utils';
import { addAdminLead, fetchAdminTotalLeads, updateAdminLeadStatus } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';

import { useRouter } from 'next/navigation';

type Lead = any;

const TotalLeadsContent = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddLeadFormOpen, setIsAddLeadFormOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    status: '',
    email: '',
    mobile: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const LEAD_STATUS_OPTIONS = [
    'Leads',
    'Interested',
    'Not Interested',
    'Visit',
    'Not Picked',
    'Other Location',
    'Lost',
  ];

  const fetchData = async () => { // Extracted fetchData to be callable
    try {
      setLoading(true);
      const data = await fetchAdminTotalLeads();
      setLeads(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleAddLeadClick = () => {
    setNewLead({ name: '', status: '', email: '', mobile: '', description: '' });
    setIsAddLeadFormOpen(true);
  };

  const handleNewLeadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };

  const handleNewLeadStatusChange = (value: string) => {
    setNewLead(prev => ({ ...prev, status: value }));
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!newLead.name || !newLead.mobile) {
      toast({
        title: "Validation Error",
        description: "Name and Mobile are required.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await addAdminLead(newLead);
      toast({
        title: "Success",
        description: "Lead added successfully!",
        className: "bg-green-500 text-white",
      });
      setIsAddLeadFormOpen(false);
      setNewLead({ name: '', status: '', email: '', mobile: '', description: '' }); // Reset form
      fetchData(); // Refresh lead list
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add lead.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    const originalLeads = [...leads]; // Store original leads for potential rollback
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
      setLeads(originalLeads);
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
      meta: {
        className: 'hidden md:table-cell',
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
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
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
        </div>
      ),
      meta: {
        className: 'hidden md:table-cell',
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
        className: 'hidden md:table-cell',
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
        <h1 className="text-2xl font-bold">Total Leads</h1>
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
              <Button onClick={handleAddLeadClick} className="ml-4">
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add Lead</span>
              </Button>
            </div>

            <div className="w-full rounded-md border overflow-x-hidden md:overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className={`text-center p-2 md:p-4 ${header.column.columnDef.meta?.className || ''}`}>
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
                            <TableCell key={cell.id} className={`text-center p-2 md:p-4 ${cell.column.columnDef.meta?.className || ''}`}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                        {expandedRowId === row.original.id && (
                          <TableRow className="md:hidden">
                            <TableCell colSpan={table.getAllColumns().length} className="p-0">
                              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                                <div className="p-5 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                                  <div className="text-lg font-bold mb-4">{row.original.name}</div>
                                  <div className="grid grid-cols-1 gap-4 text-sm">
                                    <div className="flex items-center gap-2 border p-2 rounded-md">
                                      <a href={`https://wa.me/${row.original.call}?text=${encodeURIComponent('Hello ' + row.original.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 dark:text-green-500">
                                        <MessageSquare className="h-5 w-5" />
                                        <span>Whatsapp</span>
                                      </a>
                                    </div>
                                    <div className="flex items-center border p-2 rounded-md">
                                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/lead-history?leadId=${row.original.id}`)} className="flex flex-row items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                                        <History className="h-5 w-5" />
                                        <span>History</span>
                                      </Button>
                                    </div>
                                    <div>
                                      <Select
                                        value={row.original.status}
                                        onValueChange={(newStatus) => handleStatusChange(row.original.id, newStatus)}
                                      >
                                        <SelectTrigger className="w-full">
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
                        No leads found.
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

      <Dialog open={isAddLeadFormOpen} onOpenChange={setIsAddLeadFormOpen}>
        <DialogContent className="sm:max-w-[425px] w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Fill in the details for the new lead.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLeadSubmit} className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newLead.name}
                onChange={handleNewLeadChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newLead.email}
                onChange={handleNewLeadChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mobile">
                Mobile
              </Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                value={newLead.mobile}
                onChange={handleNewLeadChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">
                Status
              </Label>
              <Select
                name="status"
                value={newLead.status}
                onValueChange={handleNewLeadStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUS_OPTIONS.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newLead.description}
                onChange={handleNewLeadChange}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}




export default function TotalLeadsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TotalLeadsContent />
    </Suspense>
  );
}
