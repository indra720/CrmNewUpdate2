
'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageSquare, PlusCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LeadsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Mock data, replace with actual API call
    setLeads([
      { id: 1, name: 'Ravi Sharma', call: '9876543210', status: 'Interested', message: 'Follow up next week.' },
      { id: 2, name: 'Priya Verma', call: '9876543222', status: 'Not Interested', message: 'Budget issues.' },
      { id: 3, name: 'Amit Gupta', call: '9876543233', status: 'New', message: '' },
      { id: 4, name: 'Sunita Singh', call: '9876543244', status: 'Visit', message: 'Scheduled a visit for Friday.' },
      { id: 5, name: 'Rajesh Kumar', call: '9876543255', status: 'Lost', message: 'Went with a competitor.' },
    ]);
  }, []);

  useEffect(() => {
    setFilteredLeads(
      leads.filter((lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, leads]);

  const handleSaveStatus = () => {
    if (!selectedLead) return;
    const updatedLeads = leads.map((l) =>
      l.id === selectedLead.id ? { ...l, status, message } : l
    );
    setLeads(updatedLeads);
    setModalOpen(false);
    toast({
      title: 'Status Updated',
      description: `Lead status for ${selectedLead.name} has been updated to ${status}.`,
    });
  };

  const openModal = (lead: any, newStatus?: string) => {
    setSelectedLead(lead);
    setStatus(newStatus || lead.status);
    setMessage(lead.message);
    setModalOpen(true);
  };
  
  const statusOptions = ["New", "Interested", "Not Interested", "Other Location", "Not Picked", "Lost", "Visit"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Staff Leads</h1>
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Lead
            </Button>
          </div>
      </div>
      
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your leads view.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger><SelectValue placeholder="Assigned By" /></SelectTrigger>
              <SelectContent><SelectItem value="admin1">Admin 1</SelectItem></SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Team Leader" /></SelectTrigger>
              <SelectContent><SelectItem value="team1">Team A</SelectItem></SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Call</TableHead>
                  <TableHead className="text-center">WhatsApp</TableHead>
                  <TableHead className="text-center">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={lead.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`tel:${lead.call}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                       <Button variant="ghost" size="icon" asChild>
                        <a href={`https://wa.me/91${lead.call}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">{lead.status} ▼</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           {statusOptions.map(option => (
                            <DropdownMenuItem key={option} onSelect={() => openModal(lead, option)}>
                              {option}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
            <DialogDescription>
              Update status and add notes for {selectedLead?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                   {statusOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message / Notes</Label>
              <Textarea
                id="message"
                placeholder="Add a message or notes for this lead..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;

    