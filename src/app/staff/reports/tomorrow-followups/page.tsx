'use client';

import React, { useEffect, useState } from 'react';
// Force re-save for DialogClose error
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
  DialogClose,
} from '@/components/ui/dialog';
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
import { Search, Loader2, Phone, MessageSquare, Calendar, FileDown, ArrowLeft, Briefcase, Users, Clock, Tag, MoreVertical, Plus, Minus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { fetchStaffLeadsReport, updateLeadStatusAndFollowUp } from '@/lib/api';
import { BackButton } from '@/components/ui/back-button';

export default function StaffTomorrowFollowupsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [statusValue, setStatusValue] = useState('Intrested');
  const [messageValue, setMessageValue] = useState('');
  const [followDate, setFollowDate] = useState('');
  const [followTime, setFollowTime] = useState('');
  const { toast } = useToast();

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  async function fetchLeads() {
    try {
      setLoading(true);
      const data = await fetchStaffLeadsReport('tomorrow_follow');
      setLeads(data.results);
      // You might need to adjust pagination based on the API response
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  async function openEditModal(lead: any) {
    setEditingLead(lead);
    setStatusValue(lead.status || 'Intrested');
    setMessageValue(lead.message || '');
    setFollowDate(lead.follow_up_date || '');
    setFollowTime(lead.follow_up_time || '');
    setShowModal(true);
  }

  async function saveChanges() {
    if (!editingLead) return;

    try {
      await updateLeadStatusAndFollowUp(
        editingLead.id,
        statusValue,
        messageValue,
        followDate,
        followTime
      );

      toast({
          title: "Status Updated",
          description: `Follow-up for ${editingLead.name} has been updated.`,
          className: 'bg-green-500 text-white'
      });
      setShowModal(false);
      fetchLeads(); // Refresh leads
    } catch (error: any) {
      //console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status.",
        variant: "destructive",
      });
    }
  }

  return (
    <TooltipProvider>
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <BackButton />
        {/* <h1 className="text-xl font-bold">Tomorrow Followups</h1> */}
      </div>

      <div className="space-y-4">
        <form className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" name="start_date" type="text" placeholder="mm/dd/yyyy" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => {if (!e.target.value) e.target.type = 'text'}} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" name="end_date" type="text" placeholder="mm/dd/yyyy" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => {if (!e.target.value) e.target.type = 'text'}} />
          </div>
          <Button type="submit" className="self-end">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search"
              className="pl-10 w-full"
            />
        </div>
        </form>

        
      </div>


      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-2 md:p-6 md:pt-0">
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center lg:hidden">S.N.</TableHead>
                    <TableHead className="px-2 py-1">Name</TableHead>
                    <TableHead className="px-2 py-1">Staff</TableHead>
                    <TableHead className="px-2 py-1">Team Leader</TableHead>
                    <TableHead className="px-2 py-1 hidden lg:table-cell">Call</TableHead>
                    <TableHead className="px-2 py-1 hidden lg:table-cell">Whatsapp</TableHead>
                    <TableHead className="px-2 py-1 hidden lg:table-cell">Date</TableHead>
                    <TableHead className="px-2 py-1 hidden lg:table-cell">Time</TableHead>

                    <TableHead className="px-2 py-1 text-center hidden md:table-cell">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead, index) => (
                      <React.Fragment key={lead.id}>
                        <TableRow className="hover:bg-muted/50 transition-colors">
                          <TableCell className="w-12 lg:hidden text-center px-2 py-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleRow(lead.id)}
                            >
                              {expandedRowId === lead.id ? <Minus className="h-4 w-4 text-green-400" /> : <Plus className="h-4 w-4 text-green-400" />}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium text-base md:text-sm px-2 py-1">{lead.name}</TableCell>
                          <TableCell className="text-base md:text-sm px-2 py-1">{lead.assigned_to?.name}</TableCell>
                          <TableCell className="text-base md:text-sm px-2 py-1">{lead.team_leader?.name}</TableCell>
                          <TableCell className="text-base md:text-sm hidden lg:table-cell px-2 py-1">{
                            <a href={`tel:+91${lead.call}`}><Phone className="h-4 w-4 text-green-500" /></a>
                          }</TableCell>
                          <TableCell className="whitespace-nowrap text-base md:text-sm hidden lg:table-cell px-2 py-1">
                            <a href={`https://wa.me/+91${lead.call}`} target="_blank" rel="noreferrer"><MessageSquare className="h-4 w-4 text-blue-500" /></a>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-base md:text-sm hidden lg:table-cell px-2 py-1">{lead.follow_up_date || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap text-base md:text-sm hidden lg:table-cell px-2 py-1">{lead.follow_up_time || 'N/A'}</TableCell>

                          <TableCell className="text-center hidden md:table-cell px-2 py-1">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <TooltipProvider>
                                  <Button variant="outline" size="sm" className="w-full text-center" onClick={() => openEditModal(lead)}>
                                    <span className="hidden lg:inline">Follow Up</span>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="inline lg:hidden">F.U.</span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Follow Up</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </Button>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRowId === lead.id && (
                          <TableRow className="lg:hidden">
                            <TableCell colSpan={5} className="p-0">
                              <div className="p-4 bg-gray-50">
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                    <Avatar>
                                      <AvatarImage src={`https://avatar.vercel.sh/${lead.name}.png`} alt={lead.name} />
                                      <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="text-lg font-bold">{lead.name}</div>
                                      <div className="text-sm text-gray-500">{lead.assigned_to?.name}</div> {/* Using assigned_to name as a secondary detail */}
                                    </div>
                                  </div>
                                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                      <Phone className="h-4 w-4 mr-3 text-gray-500" />
                                      <span className="text-sm">{lead.call}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <MessageSquare className="h-4 w-4 mr-3 text-gray-500" />
                                      <a href={`https://wa.me/+91${lead.call}`} target="_blank" rel="noreferrer" className="text-sm">Whatsapp</a>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                                      <span className="text-sm">Follow Up Date: {lead.follow_up_date || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-3 text-gray-500" />
                                      <span className="text-sm">Follow Up Time: {lead.follow_up_time || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                      <Button size="sm" onClick={() => openEditModal(lead)}>
                                        Follow Up
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
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
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal} >
        <DialogContent className="w-[95vw] sm:max-w-md p-4 max-h-[90vh] flex flex-col rounded-md">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Leads Update</DialogTitle>
            <DialogDescription>Update the status and follow-up details for this lead.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 p-4 overflow-y-auto flex-1 ">
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
                    <span className="hidden sm:inline"></span><span className="sm:hidden"></span> Date
                  </Label>
                  <Input id="followUpDate" type="date" value={followDate} onChange={(e) => setFollowDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="followUpTime">
                    <span className="hidden sm:inline"></span><span className="sm:hidden"></span> Time 
                  </Label>
                  <Input id="followUpTime" type="time" value={followTime} onChange={(e) => setFollowTime(e.target.value)} className='p-1' />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={messageValue} onChange={(e) => setMessageValue(e.target.value)} placeholder="Enter a message or notes..."/>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={saveChanges}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
