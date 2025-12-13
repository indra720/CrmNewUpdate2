

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
import { Phone, MessageSquare, PlusCircle, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateAdminLeadStatus } from '@/lib/api'; // Added import

const LeadsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leads/admin/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLeads(data.leads || []); // Assuming the API returns leads in a 'leads' array
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads.');
      toast({
        title: 'Error',
        description: `Failed to fetch leads: ${err.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (leads.length > 0) {
      setFilteredLeads(
        leads.filter((lead) =>
          lead.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredLeads([]);
    }
  }, [search, leads]);

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    const originalLeads = [...leads]; // Store original leads for potential rollback
    try {
      // Optimistically update the UI
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      setFilteredLeads(prevFilteredLeads =>
        prevFilteredLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      await updateAdminLeadStatus(leadId, newStatus);
      toast({
        title: 'Success',
        description: `Lead status updated to ${newStatus}.`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to update lead status: ${err.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      // Revert UI on error
      setLeads(originalLeads);
      setFilteredLeads(originalLeads.filter((lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
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
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 md:p-4">S.N.</TableHead>
                  <TableHead className="p-2 md:p-4">Name</TableHead>
                  <TableHead className="text-center p-2 md:p-4">Call</TableHead>
                  <TableHead className="text-center p-2 md:p-4">WhatsApp</TableHead>
                  <TableHead className="text-center p-2 md:p-4">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, index) => (
                    <TableRow key={lead.id}>
                      <TableCell className="p-2 md:p-4">{index + 1}</TableCell>
                      <TableCell className="font-medium p-2 md:p-4">{lead.name}</TableCell>
                      <TableCell className="text-center p-2 md:p-4">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`tel:${lead.call}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                        </Button>
                      </TableCell>
                      <TableCell className="text-center p-2 md:p-4">
                         <Button variant="ghost" size="icon" asChild>
                          <a href={`https://wa.me/91${lead.call}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="h-5 w-5 text-green-500" />
                          </a>
                        </Button>
                      </TableCell>
                      <TableCell className="flex items-center justify-center p-2 md:p-4">
                        <Select
                          value={lead.status}
                          onValueChange={(newStatus) => handleStatusChange(lead.id, newStatus)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No leads found.
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
};

export default LeadsPage;

    
