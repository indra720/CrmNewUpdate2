'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Plus, Minus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

const ProductivityAssociatesPage = () => {
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFiltered, setIsFiltered] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [associatesData, setAssociatesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamLeaders = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/team-leader-report/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Use team_leaders_list directly
      const teamLeadersList = data.team_leaders_list || [];
      setTeamLeaders(teamLeadersList);
      //console.log('Team Leaders fetched successfully', teamLeadersList);
    } catch (error: any) {
      //console.error('Error fetching team leaders:', error.message);
      // Do not set main error state for admin fetching failure
    }
  };

  const fetchAssociatesData = async (
    filterStartDate?: Date | undefined,
    filterEndDate?: Date | undefined
  ) => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError(null);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/productivity/freelancer-report/`;
      const params = new URLSearchParams();
      if (selectedTeamLeader && selectedTeamLeader !== 'all-team-leaders') {
        params.append('team_leader', selectedTeamLeader);
      }
      const formattedStartDate = filterStartDate ? format(filterStartDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = filterEndDate ? format(filterEndDate, 'yyyy-MM-dd') : undefined;

      if (formattedStartDate) params.append('start_date', formattedStartDate);
      if (formattedEndDate) params.append('end_date', formattedEndDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAssociatesData(data);
      //console.log('Data fetched successfully', data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamLeaders();
    fetchAssociatesData(startDate, endDate);
  }, [selectedTeamLeader, startDate, endDate]);


  const handleTeamLeaderChange = (value: string) => {
    setSelectedTeamLeader(value);
  };

  const handleFilterToggle = () => {
    if (isFiltered) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
    setIsFiltered(!isFiltered);
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading associates productivity data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8 text-lg text-red-500">
        Error: {error}
      </div>
    );
  }
  if (!associatesData) {
    return (
      <div className="text-center py-8 text-lg">
        No associates productivity data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Productivity Index</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-2 lg:w-48">
              <Label htmlFor="team-leader-select">Team Leader</Label>
              <Select value={selectedTeamLeader} onValueChange={handleTeamLeaderChange}>
                <SelectTrigger id="team-leader-select">
                  <SelectValue placeholder="Select Team Leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-team-leaders">All Team Leaders</SelectItem>
                  {teamLeaders.map((teamLeader) => (
                    <SelectItem key={teamLeader.id} value={teamLeader.id}>
                      {teamLeader.name || teamLeader.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 lg:w-48">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>

            <div className="space-y-2 lg:w-48">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>

            <div className="space-y-2">
              <Label>Filter</Label>
              <Button
                className="w-full bg-orange-400 text-white flex items-center gap-2"
                onClick={handleFilterToggle}
              >
                {isFiltered ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                {isFiltered ? 'Clear Filter' : 'Apply Filter'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Total Calls</TableHead>
                  <TableHead className="hidden md:table-cell">Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Not Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Lost</TableHead>
                  <TableHead className="hidden lg:table-cell">Visit</TableHead>
                  <TableHead className="hidden lg:table-cell">Interested %</TableHead>
                  <TableHead className="text-right">Visit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {associatesData.team_leader_data && associatesData.team_leader_data.map((row: any, i: number) => (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={expandedRowId === row.id && 'selected'}>
                      <TableCell>
                        
                          <div className="lg:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => toggleRow(row.id)}
                            >
                              {expandedRowId === row.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                          
                          <div className="hidden lg:block">
                            {i + 1}.
                          </div>
                        
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.total_calls}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.not_interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.lost}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.visit}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.interested_percentage}%</TableCell>
                      <TableCell className="text-right">{row.visit_percentage}%</TableCell>
                    </TableRow>
                    {expandedRowId === row.id && (
                      <TableRow className="lg:hidden">
                        <TableCell colSpan={9} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                  <div className="text-lg font-bold">{row.name}</div>
                                </div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Total Calls:</span>
                                    <span className="text-sm capitalize ml-auto">{row.total_calls}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Interested:</span>
                                    <span className="text-sm ml-auto">{row.interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Not Interested:</span>
                                    <span className="text-sm ml-auto">{row.not_interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Other Location:</span>
                                    <span className="text-sm ml-auto">{row.other_location}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Lost:</span>
                                    <span className="text-sm ml-auto">{row.lost}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Visit:</span>
                                    <span className="text-sm ml-auto">{row.visit}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Interested %:</span>
                                    <span className="text-sm ml-auto">{row.interested_percentage}%</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Visit %:</span>
                                    <span className="text-sm ml-auto">{row.visit_percentage}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                 {(!associatesData.team_leader_data || associatesData.team_leader_data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Data is not found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="hidden md:table-cell">{associatesData.counts?.total_all_calls || 0}</TableCell>
                  <TableCell className="hidden md:table-cell">{associatesData.counts?.total_all_interested || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{associatesData.counts?.total_all_not_interested || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{associatesData.counts?.total_all_lost || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{associatesData.counts?.total_all_visit || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {associatesData.counts?.total_all_calls > 0
                      ? Math.round((associatesData.counts.total_all_interested / associatesData.counts.total_all_calls) * 100)
                      : 0}
                    %
                  </TableCell>
                  <TableCell className="text-right">
                    {associatesData.counts?.total_all_calls > 0
                      ? Math.round((associatesData.counts.total_all_visit / associatesData.counts.total_all_calls) * 100)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityAssociatesPage;