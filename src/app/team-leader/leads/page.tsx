'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
  } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Phone, MessageSquare, Plus, Minus, Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fetchTeamLeaderLeadsPageData } from '@/lib/api';
import Link from 'next/link';

interface Lead {
  id: number;
  name: string;
  phone: string;
  status: string;
  sn: number;
}

const initialNewLeadData = {
    name: "",
    status: "",
    mobile: "",
    email: "",
    description: "",
};

const ExpandedLeadDetails = ({ lead, index }: { lead: Lead; index: number }) => (
    <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="text-lg font-bold">{lead.name}</div>
                    <div className="text-sm text-gray-500">
                      <Badge variant="secondary">{lead.status}</Badge>
                    </div>
                </div>
            </div>
            <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium">Mobile:</span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600" asChild disabled={!lead.phone}>
                            <a href={`tel:${lead.phone}`}>{lead.phone || 'N/A'}</a>
                        </Button>
                    </div>
                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{'N/A'}</span>
                    </div>
                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium">Whatsapp:</span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-green-600" asChild disabled={!lead.phone}>
                            <a href={`httpshttps://wa.me/91${lead.phone}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                                Chat
                            </a>
                        </Button>
                    </div>
                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium">S.N.:</span>
                        <span className="text-sm">{index + 1}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const LeadsContent = () => {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [staffList, setStaffList] = useState<{ id: number; name: string }[]>([]);
    const [aggregates, setAggregates] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
    const [newLeadData, setNewLeadData] = useState(initialNewLeadData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleRow = (rowId: number) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    const fetchLeads = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTeamLeaderLeadsPageData();
            setLeads(data.staff_name || []);
            setStaffList(data.staff_list || []);
            setAggregates(data.aggregates || {});
        } catch (err: any) {
            setError(err.message);
            toast({
                title: "Error",
                description: err.message || "Failed to fetch leads.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleTypeNavChange = (value: string) => {
        if (!value) return;
        router.push(value);
    };
    
    const getStatusBadgeVariant = (status: string) => {
        const lowerCaseStatus = status.toLowerCase();
        if (lowerCaseStatus.includes('interested')) return 'default';
        if (lowerCaseStatus.includes('not interested')) return 'destructive';
        if (lowerCaseStatus.includes('visit')) return 'secondary';
        return 'outline';
    };

    const handleAddLeadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLeadData({ ...newLeadData, [name]: value });
    };

    const handleAddLeadSelectChange = (name: string, value: string) => {
        setNewLeadData({ ...newLeadData, [name]: value });
    };

    const handleAddLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLeadData.name) {
            toast({
                title: "Name is required",
                description: "Please enter a name for the lead.",
                variant: "destructive",
            });
            return;
        }
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/leads/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(newLeadData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add lead.');
            }
            
            toast({
                title: "Lead Added!",
                description: `${newLeadData.name} has been added successfully.`,
                className: 'bg-green-500 text-white'
            });
            setIsAddLeadOpen(false);
            setNewLeadData(initialNewLeadData);
            fetchLeads(); // Refresh leads list
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Leads</h1>

       <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
             <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Filter</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Assigned" /></SelectTrigger>
                        <SelectContent>
                            {staffList.map(staff => (
                                <SelectItem key={staff.id} value={String(staff.id)}>{staff.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Interested" /></SelectTrigger>
                        <SelectContent>
                            {aggregates.total_interested_leads > 0 && (
                                <SelectItem value="interested">
                                    Interested Leads ({aggregates.total_interested_leads})
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="IT-Team" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="team-a">Team A</SelectItem>
                            <SelectItem value="team-b">Team B</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger><SelectValue placeholder="Lost" /></SelectTrigger>
                        <SelectContent>
                            {aggregates.total_lost_leads > 0 && (
                                <SelectItem value="lost">
                                    Lost Leads ({aggregates.total_lost_leads})
                                </SelectItem>
                            )}
                             {aggregates.total_lost_leads === 0 && (
                                <SelectItem value="no-lost" disabled>No Lost Leads</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>


      <Card className="shadow-lg rounded-2xl">
         <CardHeader>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Search leads..."
                        className="pl-10"
                        />
                    </div>
                    <Button onClick={() => setIsAddLeadOpen(true)} className="sm:w-auto p-2 sm:px-4 sm:py-2">
                        <PlusCircle className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add New Lead</span>
                    </Button>
                </div>
                 <div className="w-full sm:w-auto">
                     <Select onValueChange={handleTypeNavChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="/team-leader/reports/interested">Interested</SelectItem>
                            <SelectItem value="/team-leader/reports/not-interested">Not Interested</SelectItem>
                            <SelectItem value="/team-leader/reports/other-location">Other Location</SelectItem>
                            <SelectItem value="/team-leader/reports/total-leads">Lost</SelectItem>
                            <SelectItem value="/team-leader/reports/visit">Visit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="overflow-x-auto rounded-lg border">
            <Table className="table-fixed w-full lg:table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 text-center">S.N.</TableHead>
                  <TableHead className="w-1/3 text-left lg:w-auto">Name</TableHead>
                  <TableHead className="hidden md:table-cell w-1/3 text-left lg:w-auto">Status</TableHead>
                  <TableHead className="text-center w-1/3 lg:w-auto">Call</TableHead>
                  <TableHead className="text-center hidden lg:table-cell w-1/3">Whatsapp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array(5).fill(0).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell colSpan={5}>
                                <Skeleton className="h-8 w-full" />
                            </TableCell>
                        </TableRow>
                    ))
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-red-500">
                           {error}
                        </TableCell>
                    </TableRow>
                ) : leads.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No leads found.
                        </TableCell>
                    </TableRow>
                ) : (
                    leads.map((lead, index) => (
                    <React.Fragment key={lead.id}>
                        <TableRow data-state={expandedRowId === lead.id ? "selected" : undefined}>
                            <TableCell className="w-12">
                              <div className="hidden lg:flex justify-center">
                                <span>{index + 1}.</span>
                              </div>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => toggleRow(lead.id)}
                                className="lg:hidden"
                              >
                                {expandedRowId === lead.id ? (
                                <Minus className="h-4 w-4" />
                                ) : (
                                <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="ghost" size="icon" asChild disabled={!lead.phone}>
                                    <a href={`tel:${lead.phone}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                                </Button>
                            </TableCell>
                            <TableCell className="text-center hidden lg:table-cell">
                                <Button variant="ghost" size="icon" asChild disabled={!lead.phone}>
                                    <a href={`https://wa.me/91${lead.phone}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                                        <MessageSquare className="h-5 w-5 text-green-500" />
                                    </a>
                                </Button>
                            </TableCell>
                        </TableRow>
                        {expandedRowId === lead.id && (
                            <TableRow className="lg:hidden">
                                <TableCell colSpan={5} className="p-0">
                                    <ExpandedLeadDetails lead={lead} index={index} />
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-sm w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto hide-scrollbar">
            <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                    Fill in the details below to create a new lead.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLeadSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={newLeadData.name} onChange={handleAddLeadChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" onValueChange={(value) => handleAddLeadSelectChange("status", value)} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Interested">Interested</SelectItem>
                            <SelectItem value="Not Interested">Not Interested</SelectItem>
                            <SelectItem value="Visit">Visit</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                            <SelectItem value="Other Location">Other Location</SelectItem>
                            <SelectItem value="Not Picked">Not Picked</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input id="mobile" name="mobile" type="tel" value={newLeadData.mobile} onChange={handleAddLeadChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={newLeadData.email} onChange={handleAddLeadChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={newLeadData.description} onChange={handleAddLeadChange} />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationNext href="#" />
            </PaginationItem>
        </PaginationContent>
        </Pagination>
    </div>
  );
}






export default function LeadsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsContent />
    </Suspense>
  );
}
