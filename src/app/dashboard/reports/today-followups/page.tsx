'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, Phone, MessageSquare, History, Calendar as CalendarIcon, FileDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DatePicker } from '@/components/ui/date-picker';

// Mock data to replicate the API response structure from the provided code.
const mockLeadsData = {
    results: [
        { id: 1, name: 'Aarav Sharma', assigned_to: { name: 'Rohan' }, team_leader: { name: 'Priya' }, call: '9876543210', follow_up_date: '2024-08-15', follow_up_time: '14:30' },
        { id: 2, name: 'Saanvi Patel', assigned_to: { name: 'Anjali' }, team_leader: { name: 'Priya' }, call: '9876543211', follow_up_date: '2024-08-16', follow_up_time: '11:00' },
        { id: 3, name: 'Vihaan Singh', assigned_to: { name: 'Rohan' }, team_leader: { name: 'Priya' }, call: '9876543212', follow_up_date: null, updated_date: '2024-07-20' },
        { id: 4, name: 'Myra Reddy', assigned_to: { name: 'Anjali' }, team_leader: { name: 'Priya' }, call: '9876543213', follow_up_date: '2024-08-18', follow_up_time: '16:00' },
        { id: 5, name: 'Kabir Verma', assigned_to: { name: 'Rohan' }, team_leader: { name: 'Priya' }, call: '9876543214', follow_up_date: '2024-08-19', follow_up_time: '10:00' },
        { id: 6, name: 'Diya Gupta', assigned_to: { name: 'Anjali' }, team_leader: { name: 'Priya' }, call: '9876543215', follow_up_date: '2024-08-20', follow_up_time: '15:00' },
        { id: 7, name: 'Ishaan Kumar', assigned_to: { name: 'Rohan' }, team_leader: { name: 'Priya' }, call: '9876543216', follow_up_date: '2024-08-21', follow_up_time: '12:30' },
        { id: 8, name: 'Advika Joshi', assigned_to: { name: 'Anjali' }, team_leader: { name: 'Priya' }, call: '9876543217', follow_up_date: '2024-08-22', follow_up_time: '17:00' },
        { id: 9, name: 'Reyansh Mehra', assigned_to: { name: 'Rohan' }, team_leader: { name: 'Priya' }, call: '9876543218', follow_up_date: '2024-08-23', follow_up_time: '09:30' },
        { id: 10, name: 'Ananya Desai', assigned_to: { name: 'Anjali' }, team_leader: { name: 'Priya' }, call: '9876543219', follow_up_date: '2024-08-24', follow_up_time: '18:00' },
    ],
    page: 1,
    total_pages: 5,
};

const mockSingleLead = {
    id: 1,
    name: 'Aarav Sharma',
    status: 'Intrested',
    message: 'Client asked for a demo next week.',
    follow_up_date: '2024-08-15',
    follow_up_time: '14:30',
    call: '9876543210',
    assigned_to: { name: 'Rohan' },
    team_leader: { name: 'Priya' },
};


export default function TodayFollowupsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [statusValue, setStatusValue] = useState('Intrested');
  const [messageValue, setMessageValue] = useState('');
  const [followDate, setFollowDate] = useState('');
  const [followTime, setFollowTime] = useState('');
  const { toast } = useToast();

  async function fetchLeads() {
    setLoading(true);
    // In a real app, you would fetch from your API.
    // Simulating API call with mock data.
    await new Promise(resolve => setTimeout(resolve, 500));
    setLeads(mockLeadsData.results);
    setTotalPages(mockLeadsData.total_pages);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  async function openEditModal(id: number) {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const data = mockSingleLead;
    setEditingLead(data);
    setStatusValue(data.status || 'Intrested');
    setMessageValue(data.message || '');
    setFollowDate(data.follow_up_date || '');
    setFollowTime(data.follow_up_time || '');
    setShowModal(true);
  }

  async function saveChanges() {
    if (!editingLead) return;
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
        title: "Status Updated",
        description: `Follow-up for ${editingLead.name} has been updated.`,
        className: 'bg-green-500 text-white'
    });
    setShowModal(false);
    fetchLeads(); // Refresh leads
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today Followups</h1>
        <Link href="/dashboard/users/team-leader">
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
          <Button type="submit" className="w-full md:w-auto self-end">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </form>

        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search"
              className="pl-10 w-full"
            />
        </div>
      </div>


      <Card className="shadow-lg rounded-2xl flex-1 flex flex-col min-h-0">
        <CardContent className="p-0 flex-1 flex flex-col min-h-0">
          <div className="overflow-x-auto flex-1 min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background/95 z-5 shadow-sm">Name</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Team Leader</TableHead>
                  <TableHead>Call</TableHead>
                  <TableHead>Whatsapp</TableHead>
                  <TableHead>
                    <span className="lg:inline">Follow up </span>
                    <span className="inline lg:hidden">F.U. </span>
                    Date
                  </TableHead>
                  <TableHead>
                    <span className="lg:inline">Follow up </span>
                    <span className="inline lg:hidden">F.U. </span>
                    Time
                  </TableHead>
                  <TableHead>History</TableHead>
                  <TableHead className="text-center sticky right-0 bg-background/95 z-5 shadow-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium whitespace-nowrap sticky left-0 bg-background/95 z-5 text-base md:text-sm shadow-sm">{user.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-base md:text-sm">{user.assigned_to?.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-base md:text-sm">{user.team_leader?.name}</TableCell>
                      <TableCell className="text-base md:text-sm">
                        <a href={`tel:+91${user.call}`}><Phone className="h-4 w-4 text-green-500" /></a>
                      </TableCell>
                      <TableCell className="text-base md:text-sm">
                        <a href={`https://wa.me/+91${user.call}`} target="_blank" rel="noreferrer"><MessageSquare className="h-4 w-4 text-blue-500" /></a>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-base md:text-sm">{user.follow_up_date || 'N/A'}</TableCell>
                      <TableCell className="whitespace-nowrap text-base md:text-sm">{user.follow_up_time || 'N/A'}</TableCell>
                      <TableCell className="text-base md:text-sm">
                        <Link href={`/lead_history/${user.id}`}><History className="h-4 w-4 text-muted-foreground" /></Link>
                      </TableCell>
                      <TableCell className="text-center sticky right-0 bg-background/95 z-5">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(user.id)}>
                          <span className="hidden lg:inline">Follow Up</span>
                          <span className="inline lg:hidden">F.U.</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>
                        {page}
                    </PaginationLink>
                </PaginationItem>
                 <PaginationItem>
                  <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leads Update</DialogTitle>
            <DialogDescription>Update the status and follow-up details for this lead.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
               <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Intrested">Follow Up</SelectItem>
                    <SelectItem value="Lost">Discard</SelectItem>
                    <SelectItem value="Visit">Visit</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {statusValue === 'Intrested' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">
                    <span className="hidden sm:inline">Follow Up</span><span className="sm:hidden">F.U.</span> Date
                  </Label>
                  <Input id="followUpDate" type="date" value={followDate} onChange={(e) => setFollowDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="followUpTime">
                    <span className="hidden sm:inline">Follow Up</span><span className="sm:hidden">F.U.</span> Time
                  </Label>
                  <Input id="followUpTime" type="time" value={followTime} onChange={(e) => setFollowTime(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={messageValue} onChange={(e) => setMessageValue(e.target.value)} placeholder="Enter a message or notes..."/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={saveChanges}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}