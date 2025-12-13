'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const TimeSheetPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fakeLogs = [
        { id: 1, name: 'admin', activity_type: 'Log-out', user_type: 'Admin User', created_date: 'Oct. 16, 2025, 7:07 a.m.' },
        { id: 2, name: 'admin', activity_type: 'Log-In', user_type: 'Admin User', created_date: 'Oct. 16, 2025, 7:03 a.m.' },
        { id: 3, name: 'teamlead', activity_type: 'Log-In', user_type: 'Team leader User', created_date: 'Oct. 11, 2025, 8:57 a.m.' },
        { id: 4, name: 'admin', activity_type: 'Log-In', user_type: 'Admin User', created_date: 'Oct. 11, 2025, 7:06 a.m.' },
        { id: 5, name: 'admin', activity_type: 'Log-In', user_type: 'Admin User', created_date: 'Oct. 11, 2025, 6:32 a.m.' },
        { id: 6, name: 'staff', activity_type: 'Log-out', user_type: 'Staff User', created_date: 'Oct. 11, 2025, 6:31 a.m.' },
        { id: 7, name: 'staff', activity_type: 'Log-In', user_type: 'Staff User', created_date: 'Oct. 11, 2025, 6:29 a.m.' },
        { id: 8, name: 'teamlead', activity_type: 'Log-out', user_type: 'Team leader User', created_date: 'Oct. 11, 2025, 6:28 a.m.' },
        { id: 9, name: 'Priya Verma', activity_type: 'Data Entry', user_type: 'Staff', created_date: 'Oct. 15, 2025, 10:00 a.m.' },
        { id: 10, name: 'Anjali Singh', activity_type: 'Call Follow-up', user_type: 'Staff', created_date: 'Oct. 11, 2025, 4:00 p.m.' },
    ];
    setLogs(fakeLogs);
  }, []);

  const filteredLogs = logs.filter((log) =>
    Object.values(log)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Time Sheet</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-10"
                />
            </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.name}</TableCell>
                      <TableCell>{log.activity_type}</TableCell>
                      <TableCell>{log.user_type}</TableCell>
                      <TableCell>{log.created_date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => goToPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TimeSheetPage;
