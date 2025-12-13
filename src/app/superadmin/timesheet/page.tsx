'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Minus, User, Mail, User as UserIcon, Calendar, MapPin } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ActivityLog {
  id: number;
  name: string | null;
  description: string;
  email: string;
  user_type: string;
  activity_type: string;
  ip_address: string;
  created_date: string;
  updated_date: string;
  user: number | null;
  admin: number | null;
  team_leader: number | null;
  staff: number | null;
}

const TimeSheetPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const itemsPerPage = 8;

  // Fetch activity logs from API with pagination
  const fetchActivityLogs = async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/activitylogs/?page=${page}`, {
        headers: {
          'Authorization': ` Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / itemsPerPage));
      }
    } catch (error) {
      //console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs(currentPage);
  }, [currentPage]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const filteredLogs = search 
    ? logs.filter((log) =>
        Object.values(log)
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : logs;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Time Sheet</h1>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <p>Loading activity logs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Time Sheet</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-row items-center justify-between gap-2 px-2 md:px-0 md:gap-4">
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">User Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Activity Type</TableHead>
                  <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                  <TableHead className="text-right">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <TableRow data-state={expandedRowId === log.id && 'selected'}>
                        <TableCell>
                          <div className="lg:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => toggleRow(log.id)}
                            >
                              {expandedRowId === log.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                          <div className="hidden lg:block">
                            {((currentPage - 1) * itemsPerPage) + index + 1}.
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{log.name || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{log.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{log.user_type}</TableCell>
                        <TableCell className="hidden lg:table-cell">{log.activity_type}</TableCell>
                        <TableCell className="hidden lg:table-cell">{log.ip_address}</TableCell>
                        <TableCell className="text-right">{formatDate(log.created_date)}</TableCell>
                      </TableRow>
                      {expandedRowId === log.id && (
                        <TableRow className="lg:hidden">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="text-lg font-bold">{log.name || 'N/A'}</div>
                                </div>
                                <div className="overflow-hidden">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Email:</span>
                                      <span className="text-sm capitalize ml-auto">{log.email}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">User Type:</span>
                                      <span className="text-sm ml-auto">{log.user_type}</span>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Activity Type:</span>
                                      <span className="text-sm ml-auto">{log.activity_type}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">IP Address:</span>
                                      <span className="text-sm ml-auto">{log.ip_address}</span>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Created Date:</span>
                                      <span className="text-sm ml-auto">{formatDate(log.created_date)}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:col-span-2">
                                      <span className="text-sm font-medium">Description:</span>
                                      <p className="text-sm text-right ml-4">{log.description}</p>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No records found.
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