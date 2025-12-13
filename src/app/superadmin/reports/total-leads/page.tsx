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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, MessageSquare, ArrowUpDown, Search, ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, PlusCircle, User, Flag, Mail, MoreVertical, Eye, Plus, Minus, Tag, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchLeadsForSuperuser } from '@/lib/api';

type Lead = any;

const TotalLeadsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const source = searchParams.get('source');
        const data = await fetchLeadsForSuperuser('total_leads', source);
        setLeads(data.results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leads.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const columns: ColumnDef<Lead>[] = [
    {
      id: "sn_expander",
      header: "S.N.",
      cell: ({ row }) => (
        <>
          <div className="md:hidden">
            {" "}
            {/* Mobile: Plus icon */}
            <Button
              size="icon"
              variant="ghost"
              className="text-green-600"
              onClick={() => toggleRow(row.original.id)}
            >
              {expandedRowId === row.original.id ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="hidden md:block">
            {" "}
            {/* Desktop: S.N. */}
            {row.index + 1}
          </div>
        </>
      ),
      meta: {
        className: 'w-1/3 md:w-1/6 text-center',
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      meta: {
        className: 'w-1/3 md:w-1/6',
      },
    },
    {
      accessorKey: "call",
      header: "Call",
      cell: ({ row }) => (
        <a
          href={`tel:${row.getValue("call")}`}
          className="inline-block hover:scale-110 transition-transform"
        >
          <Phone className="h-5 w-5 text-blue-500" />
        </a>
      ),
      meta: {
        className: 'w-1/3 md:w-1/6 text-center',
      },
    },
    {
      id: "whatsapp",
      header: "Whatsapp",
      cell: ({ row }) => (
        <a
          href={`https://wa.me/91${row.original.call}?text=Hello%20${row.original.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:scale-110 transition-transform"
        >
          <MessageSquare className="h-6 w-6 text-green-500" />
        </a>
      ),
      meta: {
        className: "hidden md:table-cell md:w-1/6 text-center",
      },
    },
    {
      accessorKey: "status",
      header: "Change Status",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {row.getValue("status")} ▼
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[
              "New",
              "Contacted",
              "Interested",
              "Not Interested",
              "Lost",
              "Visit",
            ].map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => console.log(`Changed to ${option}`)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: {
        className: "hidden md:table-cell md:w-1/6",
      },
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    status: "",
    mobile: "",
    email: "",
    description: "",
  });

  const statuses = [
    "Leads",
    "Interested",
    "Not Interested",
    "Other Location",
    "Not Picked",
    "Lost",
    "Visit",
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSelectChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("Form Submitted:", formData);
    const newLead: Lead = {
      ...formData,
      id: Date.now(),
      call: formData.mobile,
    };
    setLeads((prev) => [...prev, newLead]);
    toast({
      title: "Lead Added!",
      description: `${formData.name} has been successfully added.`,
      className: "bg-green-500 text-white",
    });
    // Reset form
    setFormData({
      name: "",
      status: "",
      mobile: "",
      email: "",
      description: "",
    });
    setAddLeadModalOpen(false);
  };

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
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/superadmin/users/admin")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Admin Page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-2xl font-bold">Leads</h1>
        </div>
        <div className="grid gap-4">
          <Card className="overflow-hidden">
            <CardContent className="p-2 md:p-6 md:pt-0">
              <div className="flex flex-row gap-4 my-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn("name")
                          ?.setFilterValue(event.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={() => setAddLeadModalOpen(true)}>
                  <PlusCircle className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Lead</span>
                </Button>
              </div>
              <div className="w-full overflow-x-auto">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead 
                              key={header.id} 
                              className={header.column.columnDef.meta?.className || ''}
                            >
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
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <React.Fragment key={row.id}>
                          <TableRow
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell 
                                key={cell.id}
                                className={cell.column.columnDef.meta?.className || ''}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                          {expandedRowId === row.original.id && (
                            <TableRow className="sm:hidden">
                              <TableCell colSpan={table.getAllColumns().length} className="p-0">
                                <div className="p-4">
                                  <Card className="border-0 shadow-sm">
                                    <CardHeader className="p-4 pb-2">
                                      <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                          <AvatarImage src={`https://avatar.vercel.sh/${row.original.name}.png`} alt={row.original.name} />
                                          <AvatarFallback className="bg-primary text-primary-foreground">{row.original.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <p className="text-lg font-semibold text-foreground">{row.original.name}</p>
                                          <p className="text-sm text-muted-foreground capitalize">{row.original.status}</p>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                      <div className="flex items-center gap-3 p-2 rounded-md bg-background">
                                        <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        <a href={`tel:${row.original.call}`} className="text-sm font-medium hover:underline">
                                          {row.original.call}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-3 p-2 rounded-md bg-background">
                                        <MessageSquare className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <a
                                          href={`https://wa.me/91${row.original.call}?text=${encodeURIComponent('Hello ' + row.original.name)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-medium hover:underline"
                                        >
                                          Message on WhatsApp
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-3 p-2 rounded-md bg-background">
                                        <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="flex-1">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="outline" size="sm" className="w-full justify-start h-8">
                                                {row.original.status}
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-48">
                                              {[
                                                "New",
                                                "Contacted",
                                                "Interested",
                                                "Not Interested",
                                                "Lost",
                                                "Visit",
                                              ].map((option) => (
                                                <DropdownMenuItem
                                                  key={option}
                                                  onSelect={() => console.log(`Changed to ${option}`)}
                                                  className="capitalize"
                                                >
                                                  {option}
                                                </DropdownMenuItem>
                                              ))}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>
                        {table.getState().pagination.pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={addLeadModalOpen} onOpenChange={setAddLeadModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Create a New Lead
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new lead to the system.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="w-4 h-4" /> Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  maxLength={30}
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Flag className="w-4 h-4" /> Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={handleFormSelectChange}
                  required
                >
                  <SelectTrigger id="status" className="h-11">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mobile"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" /> Mobile
                </Label>
                <Input
                  type="number"
                  id="mobile"
                  name="mobile"
                  placeholder="e.g. 9876543210"
                  required
                  value={formData.mobile}
                  onChange={handleFormChange}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g. john.doe@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="h-11"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" /> Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add any relevant notes or details here..."
                  rows={4}
                  value={formData.description}
                  onChange={handleFormChange}
                  className="resize-none"
                />
              </div>
              <DialogFooter className="md:col-span-2">
                <Button
                  variant="outline"
                  onClick={() => setAddLeadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Lead</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default function TotalLeadsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TotalLeadsContent />
    </Suspense>
  );
}
