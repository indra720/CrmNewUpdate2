'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';

// Mock IT Staff Data
const mockUsers = [
  {
    id: 1,
    name: 'Amit Kumar',
    mobile: '9876543210',
    active: true,
  },
  {
    id: 2,
    name: 'Sunita Sharma',
    mobile: '8765432109',
    active: false,
  },
  {
    id: 3,
    name: 'Rajesh Singh',
    mobile: '9123456780',
    active: true,
  },
];

export default function ItStaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleToggle = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search)
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold tracking-tight">IT Staff Users</h1>

      <Card className="shadow-lg rounded-2xl flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All IT Staff</CardTitle>
              <CardDescription>Manage IT staff members.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <div className="overflow-x-auto h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base md:text-sm">SR. NO</TableHead>
                  <TableHead className="text-base md:text-sm">Name</TableHead>
                  <TableHead className="text-base md:text-sm">Mobile No</TableHead>
                  <TableHead className="text-center text-base md:text-sm">Active / Non-Active</TableHead>
                  <TableHead className="text-center text-base md:text-sm">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-base md:text-sm">{index + 1}</TableCell>
                      <TableCell className="font-medium text-base md:text-sm">{user.name}</TableCell>
                      <TableCell className="text-base md:text-sm">{user.mobile}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={user.active}
                          onCheckedChange={() => handleToggle(user.id)}
                          aria-label={`Toggle status for ${user.name}`}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-base md:text-sm"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
