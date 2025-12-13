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
import { Calendar as CalendarIcon, Plus, Minus, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchAdminTeamLeaders } from '../../../../lib/api';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

const ProductivityStaffPage = () => {
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [teamLeaderData, setTeamLeaderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamLeadersList = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTeamLeaders();
      setTeamLeaders(data.team_leaders_list || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamLeaderData = async (filterTeamLeader?: string, filterStartDate?: Date | undefined, filterEndDate?: Date | undefined) => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      // Use filter values if provided, otherwise use state values
      const currentSelectedTeamLeader = filterTeamLeader !== undefined ? filterTeamLeader : selectedTeamLeader;
      const formattedStartDate = filterStartDate ? format(filterStartDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = filterEndDate ? format(filterEndDate, 'yyyy-MM-dd') : undefined;

      if (currentSelectedTeamLeader && currentSelectedTeamLeader !== 'all-team-leaders') {
        params.append('team_leader_id', currentSelectedTeamLeader);
      }
      if (formattedStartDate) {
        params.append('start_date', formattedStartDate);
      }
      if (formattedEndDate) {
        params.append('end_date', formattedEndDate);
      }
      const queryString = params.toString();
      const url = queryString
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/productivity-report/?${queryString}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/productivity-report/`;

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

      const transformedStaffData = (data.staff_list || []).map((staff: any) => ({
        id: staff.id,
        name: staff.name,
        total_calls: staff.total_leads || 0,
        interested: staff.interested || 0,
        visit: staff.visit || 0,
        not_interested: staff.not_interested || 0,
        other_location: staff.other_location || 0,
        lost: staff.lost || 0,
        interested_percentage: staff.total_leads > 0 ? Math.round((staff.interested / staff.total_leads) * 100) : 0,
        visit_percentage: staff.total_leads > 0 ? Math.round((staff.visit / staff.total_leads) * 100) : 0,
      }));

      const transformedData = {
        ...data,
        staff_data: transformedStaffData,
        total_all_calls: data.counts?.total_leads || 0,
        total_all_interested: data.counts?.interested || 0,
        total_all_visit: data.counts?.total_visit || 0,
        total_all_not_interested: data.counts?.not_interested || 0,
        total_all_other_location: data.counts?.other_location || 0,
        total_all_lost: data.counts?.lost_leads || 0,
      };

      setTeamLeaderData(transformedData);
      //console.log('Data fetched successfully', transformedData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on component mount
    fetchTeamLeadersList();
    fetchTeamLeaderData(selectedTeamLeader, startDate, endDate);
  }, [selectedTeamLeader, startDate, endDate]); // Empty dependency array means this runs once on mount

  const handleFilter = () => {
    fetchTeamLeaderData(selectedTeamLeader, startDate, endDate);
    setIsFiltered(true);
  };

  const handleTeamLeaderChange = (value: string) => {
    setSelectedTeamLeader(value);
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedTeamLeader(''); // Clear selected team leader
    fetchTeamLeaderData('', undefined, undefined); // Fetch data without filters
    setIsFiltered(false);
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading staff productivity data...
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
  if (!teamLeaderData) {
    return (
      <div className="text-center py-8 text-lg">
        No staff productivity data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Productivity Index</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="team-leader-select">Team Leader</Label>
              <Select value={selectedTeamLeader} onValueChange={handleTeamLeaderChange}>
                <SelectTrigger id="team-leader-select">
                  <SelectValue placeholder="Select Team Leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-team-leaders">All Team Leaders</SelectItem>
                  {teamLeaders.map((teamLeader) => (
                    <SelectItem key={teamLeader.id} value={teamLeader.id}>
                      {teamLeader.user.name || teamLeader.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
            <div className="flex gap-2">
              <Button
                className="w-full flex items-center gap-2"
                onClick={handleFilter}
              >
                <Filter className="h-4 w-4" />
                Apply Filter
              </Button>
               <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleClearFilter}
              >
                <X className="h-4 w-4" />
                Clear
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
                  <TableHead className="hidden md:table-cell">Visit</TableHead>
                  <TableHead className="hidden lg:table-cell">Not Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Other Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Lost</TableHead>
                  <TableHead className="hidden lg:table-cell">Interested %</TableHead>
                  <TableHead className="text-right">Visit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLeaderData.staff_data && teamLeaderData.staff_data.map((row: any, i: number) => (
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
                      <TableCell className="text-[13px] font-semibold md:font-medium">{row.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.total_calls}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.interested}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.visit}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.not_interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.other_location}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.lost}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.interested_percentage}%</TableCell>
                      <TableCell className="text-right">{row.visit_percentage}%</TableCell>
                    </TableRow>
                    {expandedRowId === row.id && (
                      <TableRow className="lg:hidden">
                        <TableCell colSpan={10} className="p-0">
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
                {(!teamLeaderData.staff_data || teamLeaderData.staff_data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.total_all_calls || 0}</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.total_all_interested || 0}</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.total_all_visit || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.total_all_not_interested || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.total_all_other_location || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.total_all_lost || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {teamLeaderData.total_all_calls > 0
                      ? Math.round((teamLeaderData.total_all_interested / teamLeaderData.total_all_calls) * 100)
                      : 0}
                    %
                  </TableCell>
                  <TableCell className="text-right">
                    {teamLeaderData.total_all_calls > 0
                      ? Math.round((teamLeaderData.total_all_visit / teamLeaderData.total_all_calls) * 100)
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

export default ProductivityStaffPage;