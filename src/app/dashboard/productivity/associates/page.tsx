'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Calendar } from 'lucide-react';

const ProductivityAssociatesPage = () => {
  const [admins] = useState([
    { id: '1', name: 'Admin 1' },
    { id: '2', name: 'Admin 2' },
  ]);
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<any[]>([]);

  // Fake data simulation (replace this with fetch)
  const fetchData = () => {
    setData([
      {
        id: 1,
        name: 'Ravi Sharma',
        total_calls: 120,
        interested: 35,
        not_interested: 20,
        other_location: 5,
        lost: 10,
        visit: 25,
        interested_percentage: 29,
        visit_percentage: 21,
      },
      {
        id: 2,
        name: 'Priya Verma',
        total_calls: 80,
        interested: 25,
        not_interested: 10,
        other_location: 3,
        lost: 5,
        visit: 15,
        interested_percentage: 31,
        visit_percentage: 19,
      },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [selectedAdmin, selectedLeader, startDate, endDate]);

  const handleAdminChange = (value: string) => {
    const isAdminDeselected = value === 'all-admins';
    setSelectedAdmin(isAdminDeselected ? '' : value);
    
    if (value && !isAdminDeselected) {
      setTeamLeaders([
        { id: '1', name: 'Leader A' },
        { id: '2', name: 'Leader B' },
      ]);
    } else {
      setTeamLeaders([]);
      setSelectedLeader('');
    }
  };
  
  const handleLeaderChange = (value: string) => {
    const isLeaderDeselected = value === 'all-leaders';
    setSelectedLeader(isLeaderDeselected ? '' : value);
  };

  // Calculate totals
  const total = data.reduce(
    (acc, row) => {
      acc.calls += row.total_calls;
      acc.interested += row.interested;
      acc.not_interested += row.not_interested;
      acc.other_location += row.other_location;
      acc.lost += row.lost;
      acc.visit += row.visit;
      return acc;
    },
    {
      calls: 0,
      interested: 0,
      not_interested: 0,
      other_location: 0,
      lost: 0,
      visit: 0,
    }
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Productivity Index</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="admin-select">Admin</Label>
              <Select value={selectedAdmin} onValueChange={handleAdminChange}>
                <SelectTrigger id="admin-select">
                  <SelectValue placeholder="Select Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-admins">All Admins</SelectItem>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leader-select">Team Leader</Label>
              <Select
                value={selectedLeader}
                onValueChange={handleLeaderChange}
                disabled={!teamLeaders.length}
              >
                <SelectTrigger id="leader-select">
                  <SelectValue placeholder="Select Team Leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-leaders">All Team Leaders</SelectItem>
                  {teamLeaders.map((tl) => (
                    <SelectItem key={tl.id} value={tl.id}>
                      {tl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
                <Table className="min-w-[800px] sm:min-w-full">
                <TableHeader>
                    <TableRow>
                    <TableHead>SN</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Total Calls</TableHead>
                    <TableHead className="text-center">Interested</TableHead>
                    <TableHead className="text-center">Not Interested</TableHead>
                    <TableHead className="text-center">Other Location</TableHead>
                    <TableHead className="text-center">Lost</TableHead>
                    <TableHead className="text-center">Visit</TableHead>
                    <TableHead className="text-center">Interested %</TableHead>
                    <TableHead className="text-center">Visit %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                    <TableRow key={row.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-center">{row.total_calls}</TableCell>
                        <TableCell className="text-center text-blue-600">{row.interested}</TableCell>
                        <TableCell className="text-center text-red-500">{row.not_interested}</TableCell>
                        <TableCell className="text-center">{row.other_location}</TableCell>
                        <TableCell className="text-center">{row.lost}</TableCell>
                        <TableCell className="text-center text-green-600">{row.visit}</TableCell>
                        <TableCell className="text-center font-medium">{row.interested_percentage}%</TableCell>
                        <TableCell className="text-center font-medium">{row.visit_percentage}%</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">{data.length}</TableCell>
                    <TableCell className="text-center">{total.calls}</TableCell>
                    <TableCell className="text-center">{total.interested}</TableCell>
                    <TableCell className="text-center">{total.not_interested}</TableCell>
                    <TableCell className="text-center">{total.other_location}</TableCell>
                    <TableCell className="text-center">{total.lost}</TableCell>
                    <TableCell className="text-center">{total.visit}</TableCell>
                    <TableCell className="text-center">
                        {total.calls > 0 ? Math.round((total.interested / total.calls) * 100) : 0}%
                    </TableCell>
                    <TableCell className="text-center">
                        {total.calls > 0 ? Math.round((total.visit / total.calls) * 100) : 0}%
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
