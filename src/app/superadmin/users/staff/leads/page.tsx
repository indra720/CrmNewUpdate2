'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye, Phone, MessageCircle, Calendar, User, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Lead {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: string;
  location: string;
  created_date: string;
  updated_date: string;
  assigned_to: {
    id: number;
    name: string;
  };
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
  staff_id: number;
  status_tag: string;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'intrested', label: 'Interested' },
  { value: 'not interested', label: 'Not Interested' },
  { value: 'other location', label: 'Other Location' },
  { value: 'lost', label: 'Lost' },
  { value: 'visit', label: 'Visit' },
];

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'intrested':
      return 'bg-green-100 text-green-800';
    case 'not interested':
      return 'bg-red-100 text-red-800';
    case 'other location':
      return 'bg-orange-100 text-orange-800';
    case 'lost':
      return 'bg-gray-100 text-gray-800';
    case 'visit':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function StaffLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    count: 0,
    next: null,
    previous: null,
  });

  const { toast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // Default staff ID = 1 (you can make this dynamic later)
      const staffId = '1';

      //console.log("=== FETCHING STAFF LEADS ===");
      //console.log("Staff ID:", staffId);
      //console.log("Status Filter:", statusFilter);
      //console.log("Date Range:", startDate, "to", endDate);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leads/staff/${staffId}/${statusFilter}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      //console.log("API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      //console.log("API Response Data:", data);

      setLeads(data.results || []);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });

    } catch (err: any) {
      //console.error("=== API ERROR ===");
      //console.error("Error:", err);
      setError(err.message);
      setLeads([]);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = Object.values(lead).some((val) =>
      val && val.toString().toLowerCase().includes(search.toLowerCase())
    );
    
    let matchesDateRange = true;
    if (startDate && endDate) {
      const leadDate = new Date(lead.created_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDateRange = leadDate >= start && leadDate <= end;
    }
    
    return matchesSearch && matchesDateRange;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Leads</h1>
      
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Staff Leads Management</CardTitle>
          <CardDescription>
            View and manage staff leads data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={fetchLeads} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
              <Button onClick={fetchLeads} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            /* Leads Table */
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.N</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Call</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead, index) => (
                      <TableRow key={lead.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.assigned_to?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => window.open(`tel:${lead.mobile}`, '_self')}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => window.open(`https://wa.me/${lead.mobile}`, '_blank')}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(lead.created_date).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(lead.created_date).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No leads found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLeads.length} of {pagination.count} leads
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
