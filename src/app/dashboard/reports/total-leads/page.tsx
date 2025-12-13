'use client';

import React, { useState } from 'react';
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
import { Phone, MessageSquare, ArrowUpDown, Search, ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


type Lead = {
  id: number;
  name: string;
  call: string;
  status: string;
};

const mockLeads: Lead[] = [
    { id: 1, name: 'Aarav Sharma', call: '9876543210', status: 'New' },
    { id: 2, name: 'Saanvi Patel', call: '9876543211', status: 'Contacted' },
    { id: 3, name: 'Vihaan Singh', call: '9876543212', status: 'Interested' },
    { id: 4, name: 'Myra Reddy', call: '9876543213', status: 'Not Interested' },
    { id: 5, name: 'Kabir Verma', call: '9876543214', status: 'New' },
    { id: 6, name: 'Diya Gupta', call: '9876543215', status: 'Remaining' },
    { id: 7, name: 'Ishaan Kumar', call: '9876543216', status: 'New' },
    { id: 8, name: 'Advika Joshi', call: '9876543217', status: 'Not Interested' },
    { id: 9, name: 'Reyansh Mehra', call: '9876543218', status: 'Interested' },
    { id: 10, name: 'Ananya Desai', call: '9876543219', status: 'New' },
    { id: 11, name: 'Aryan Mehta', call: '9876543220', status: 'Visit' },
    { id: 12, name: 'Kiara Sen', call: '9876543221', status: 'Visit' },
    { id: 13, name: 'Arjun Rao', call: '9876543222', status: 'Not Picked' },
    { id: 14, name: 'Zara Khan', call: '9876543223', status: 'Not Picked' },
    { id: 15, name: 'Samaira Iyer', call: '9876543224', status: 'Other Location' },
];

export const columns: ColumnDef<Lead>[] = [
    {
        id: 'sn',
        header: 'S.N.',
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
  {
    accessorKey: 'name',
    header: 'Name',
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
    id: 'whatsapp',
    header: 'Whatsapp',
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
  },
  {
    accessorKey: 'status',
    header: 'Change Status',
    cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">{row.getValue('status')} ▼</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {["New", "Contacted", "Interested", "Not Interested", "Lost", "Visit"].map(option => (
                <DropdownMenuItem key={option} onSelect={() => console.log(`Changed to ${option}`)}>
                    {option}
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];


const TotalLeadsPage = () => {
  const [data] = useState(mockLeads);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
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
      }
    },
  });

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Total Leads</h1>
        <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder="Search..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('name')?.setFilterValue(event.target.value)
                            }
                            className="w-full sm:w-auto"
                        />
                    </div>
                    <Button>
                        Import Lead
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="text-center">
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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                >
                                <ChevronsLeft className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                             <PaginationItem>
                                <PaginationLink isActive>
                                {table.getState().pagination.pageIndex + 1}
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                >
                                <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default TotalLeadsPage;