// 'use client';
// import React, { useEffect, useState, Suspense } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Search, Phone, MessageSquare, PlusCircle, User, Flag, Mail, Filter, Plus, Minus, FileText } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DatePicker } from "@/components/ui/date-picker"; // Added DatePicker import
// import { useToast } from "@/hooks/use-toast";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { STAFF_DASHBOARD_KPI_DATA } from "@/lib/constants";

// interface Lead {
//   id: number;
//   name: string;
//   call: string;
//   status: string;
//   project: number | null;
//   message?: string;
// }

// interface Project {
//   id: number;
//   name: string;
// }

// const ExpandedLeadDetails = ({ lead, projects, openEditModal, handleProjectChange }: { lead: Lead; projects: Project[]; openEditModal: (lead: Lead) => void; handleProjectChange: (leadId: number, projectId: number) => void; }) => (
//   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//     <div className="p-4 flex items-center gap-4 border-b border-gray-200">
//       <div className="flex items-center gap-4 flex-1">
//         <div className="text-lg font-bold">{lead.name}</div>
//         <div className="text-sm text-gray-500">{lead.status}</div>
//       </div>
//     </div>
//     <div className="overflow-hidden">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
//         {/* Row 1: Call | WhatsApp */}
//         <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
//           <div className="flex items-center">
//             <Phone className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
//             <span className="text-sm font-medium">Call:</span>
//           </div>
//           <a href={`tel:+91${lead.call}`} className="text-blue-600 ml-auto md:ml-0">
//             <Phone className="h-4 w-4" />
//           </a>
//         </div>
//         <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
//           <div className="flex items-center">
//             <MessageSquare className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
//             <span className="text-sm font-medium">WhatsApp:</span>
//           </div>
//           <a
//             href={`https://wa.me/+91${lead.call}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-green-600 ml-auto md:ml-0"
//           >
//             <MessageSquare className="h-4 w-4" />
//           </a>
//         </div>
//         {/* Row 2: Project */}
//         <div className="p-3 border-b md:col-span-2 flex items-center justify-between md:justify-start md:gap-4">
//           <div className="flex items-center">
//             <FileText className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
//             <span className="text-sm font-medium">Project:</span>
//           </div>
//           <Select
//             value={lead.project?.toString() ?? ""}
//             onValueChange={(newProjectId) => handleProjectChange(lead.id, parseInt(newProjectId))}
//           >
//             <SelectTrigger className="ml-auto md:ml-0 w-full md:w-48">
//               <SelectValue placeholder="Select Project">
//                 {projects.find(p => p.id === lead.project)?.name}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               {projects.map((p) => (
//                 <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         {/* Row 3: Change Status */}
//         <div className="p-3 border-b md:col-span-2 flex items-center justify-between">
//           <div className="flex items-center">
//             <Flag className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
//             <span className="text-sm font-medium">Change Status:</span>
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => openEditModal(lead)}
//             className="ml-auto md:ml-4"
//           >
//             {lead.status}
//           </Button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const KpiCard = ({ title, value, icon: Icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
//   const cardContent = (
//     <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
//       <CardContent className="p-3 lg:p-2 flex flex-col items-center justify-center text-center gap-1">
//         <div className={`text-3xl ${color}`}>
//           <Icon className="h-8 w-8" />
//         </div>
//         <div className="font-semibold text-foreground text-sm">{title}</div>
//         <div className="text-muted-foreground text-lg font-bold">
//           {value}
//         </div>
//       </CardContent>
//     </Card>
//   );

//   if (link) {
//     return <Link href={link}>{cardContent}</Link>;
//   }

//   return cardContent;
// };


// export default function StaffDashboardPage() {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [search, setSearch] = useState("");
//   const [startDate, setStartDate] = useState<Date | undefined>(undefined); // Changed to Date | undefined
//   const [endDate, setEndDate] = useState<Date | undefined>(undefined);     // Changed to Date | undefined
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
//   const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
//   const [kpiCounts, setKpiCounts] = useState({
//     total_lead: 15,
//     total_visits: 2,
//     interested: 2,
//     not_interested: 2,
//     other_location: 1,
//     not_picked: 2,
//   });

//   const toggleRow = (rowId: number) => {
//     setExpandedRowId(expandedRowId === rowId ? null : rowId);
//   };

//   const [formData, setFormData] = useState({
//     name: "",
//     status: "",
//     mobile: "",
//     email: "",
//     description: "",
//   });

//   const statuses = [
//     "Leads",
//     "Intrested",
//     "Not Interested",
//     "Other Location",
//     "Not Picked",
//     "Lost",
//     "Visit",
//   ];

//   const { toast } = useToast();

//   useEffect(() => {
//     fetchStaffDashboardData();
//   }, []);

//   const fetchStaffDashboardData = async (startDate?: string, endDate?: string) => {
//     //console.log("Fetching staff dashboard data...");
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/dashboard/`;

//     if (startDate && endDate) {
//       const params = new URLSearchParams({
//         start_date: startDate,
//         end_date: endDate,
//       });
//       url += `?${params.toString()}`;
//     }

//     try {
//       //console.log("API URL for staff dashboard:", url);
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Authorization": `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         //console.log("API Response status:", response.status);
//         //console.log("API Response data:", data);

//         if (data.results) {
//           const formattedLeads = data.results.map((lead: any) => ({
//             id: lead.id,
//             name: lead.name,
//             call: lead.call,
//             status: lead.status,
//             project: lead.project,
//           }));
//           setLeads(formattedLeads);
//           //console.log("Leads after setLeads:", formattedLeads);
//         }

//         if (data.projects) {
//           setProjects(data.projects);
//           //console.log("Projects after setProjects:", data.projects);
//         }

//         if (data.counts) {
//           setKpiCounts({
//             total_lead: data.counts.total_leads,
//             total_visits: data.counts.total_visits_leads,
//             interested: data.counts.total_interested_leads,
//             not_interested: data.counts.total_not_interested_leads,
//             other_location: data.counts.total_other_location_leads,
//             not_picked: data.counts.total_not_picked_leads,
//           });
//         }

//         if (startDate && endDate) {
//           setSearch(""); // Clear search field on successful filter
//         }
//       } else {
//         toast({ title: "Error", description: "Failed to fetch dashboard data.", variant: "destructive" });
//       }
//     } catch (error) {
//       //console.error("Error fetching dashboard data:", error);
//       toast({ title: "Error", description: "An error occurred while fetching data.", variant: "destructive" });
//     }
//   };

//   const handleFilterClick = () => {
//     if (!startDate || !endDate) {
//       toast({
//         title: "Missing Dates",
//         description: "Please select both a start and end date to filter.",
//         variant: "destructive",
//       });
//       return;
//     }
//     const formattedStartDate = format(startDate, 'yyyy-MM-dd');
//     const formattedEndDate = format(endDate, 'yyyy-MM-dd');
//     fetchStaffDashboardData(formattedStartDate, formattedEndDate);
//     setStartDate(undefined); // Clear start date
//     setEndDate(undefined);   // Clear end date
//   };

//   const filteredLeads = leads.filter((lead) =>
//     lead.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleStatusChange = async (id: number, status: string, message?: string) => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     const data = new FormData();
//     data.append('status', status);
//     if (message) {
//       data.append('message', message);
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/update-lead/${id}/`, {
//         method: 'POST',
//         headers: { 'Authorization': `Token ${token}` },
//         body: data,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to update status');
//       }

//       // Refetch data to show the update from the server
//       fetchStaffDashboardData();
//       toast({ title: "Status Updated", description: "Lead status has been successfully updated." });

//     } catch (error: any) {
//       //console.error("Error updating lead status:", error);
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const handleModalSave = () => {
//     if (selectedLead) {
//       handleStatusChange(selectedLead.id, selectedLead.status, selectedLead.message);
//     }
//     setModalOpen(false);
//   }



//   // Handle project change
//   const handleProjectChange = async (leadId: number, projectId: number) => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/update-lead-project/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Token ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           lead_id: leadId,
//           project_id: projectId,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to update project');
//       }

//       fetchStaffDashboardData();
//       toast({ title: "Project Updated", description: "Lead project has been successfully updated." });

//     } catch (error: any) {
//       //console.error("Error updating lead project:", error);
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const openEditModal = (lead: Lead) => {
//     setSelectedLead(lead);
//     setModalOpen(true);
//   };



//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (name === "mobile" && value.length > 10) return;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFormSelectChange = (value: string) => {
//     setFormData({ ...formData, status: value });
//   };

//   const handleFormSubmit = async (e: React.FormEvent) => {


//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('mobile', formData.mobile);
//     data.append('status', formData.status || 'Leads');
//     if (formData.email) data.append('email', formData.email);
//     if (formData.description) data.append('message', formData.description);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/add-self-lead/`, {
//         method: "POST",
//         headers: { "Authorization": `Token ${token}` },
//         body: data,
//       });

//       if (response.ok) {

//         fetchStaffDashboardData();
//         toast({
//           title: "Lead Added!",
//           description: `${formData.name} has been successfully added.`,
//           className: 'bg-green-500 text-white'
//         });
//         setFormData({
//           name: "",
//           status: "",
//           mobile: "",
//           email: "",
//           description: "",
//         });
//         setAddLeadModalOpen(false);
//       } else {
//         const errorData = await response.json();
//         toast({
//           title: "Error Adding Lead",
//           description: errorData.message || "Failed to add lead",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       //console.error("Error adding lead:", error);
//       toast({
//         title: "Error",
//         description: "Failed to add lead. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAutoAssign = async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/auto-assign-leads/`, {
//         method: "POST",
//         headers: { "Authorization": `Token ${token}` },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast({
//           title: "Leads Assigned!",
//           description: data.message || "New leads have been assigned to you.",
//           className: 'bg-green-500 text-white'
//         });
//         fetchStaffDashboardData(); // Refresh the dashboard
//       } else {
//         toast({
//           title: "Assignment Failed",
//           description: data.error || "Could not assign leads.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       //console.error("Error auto-assigning leads:", error);
//       toast({
//         title: "Error",
//         description: "An error occurred during auto-assignment.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl: gap-4">
//         {STAFF_DASHBOARD_KPI_DATA.map((card, index) => (
//           <KpiCard
//             key={index}
//             title={card.title}
//             value={kpiCounts[card.valueKey as keyof typeof kpiCounts]}
//             icon={card.icon}
//             color={card.color}
//             link={card.link}
//           />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-4  " >
//         <Card>

//           <CardContent className="p-6">

//             <div className="flex flex-wrap gap-4 justify-start items-end">

//               <div className="flex flex-wrap md:flex-row  gap-4 md:items-end">

//                 <div className="space-y-2">

//                   <Label htmlFor="start_date">Start Date</Label>

//                   <DatePicker date={startDate} setDate={setStartDate} />

//                 </div>

//                 <div className="space-y-2">

//                   <Label htmlFor="end_date">End Date</Label>

//                   <DatePicker date={endDate} setDate={setEndDate} />

//                 </div>

//               </div>

//               <Button onClick={handleFilterClick}>

//                 <Filter className="h-4 w-4" />

//                 <span>Filter</span>

//               </Button>

//             </div>

//           </CardContent>

//         </Card>


//       </div>



//       <Card>
//         <CardContent className="p-6">
//           <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
//             <div className="relative w-full sm:w-72">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <div className="flex gap-2">
//               <Button onClick={() => setAddLeadModalOpen(true)}>
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Add New Lead
//               </Button>
//               {kpiCounts.total_lead === 0 && (
//                 <Button variant="outline" onClick={handleAutoAssign}>Auto Assign</Button>
//               )}
//             </div>
//           </div>
//           <div className="overflow-x-auto rounded-lg border">
//             <Table className="w-full table-fixed">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-auto md:w-1/4 lg:w-1/6">S.N.</TableHead>
//                   <TableHead className="w-auto md:w-1/4 lg:w-1/6">Name</TableHead>
//                   <TableHead className="w-auto md:table-cell md:w-1/4 lg:w-1/6">Call</TableHead>
//                   <TableHead className="hidden md:table-cell w-1/4 lg:w-1/6">WhatsApp</TableHead>
//                   <TableHead className="hidden lg:table-cell w-1/6">Project</TableHead>
//                   <TableHead className="hidden lg:table-cell w-1/6 text-right">Change Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredLeads.map((lead, index) => (
//                   <React.Fragment key={lead.id}>
//                     <TableRow data-state={expandedRowId === lead.id && 'selected'}>
//                       <TableCell className="w-auto md:w-1/4 lg:w-1/6">
//                         <>
//                           <div className="lg:hidden">
//                             <Button
//                               size="icon"
//                               variant="ghost"
//                               className="text-green-600"
//                               onClick={() => toggleRow(lead.id)}
//                             >
//                               {expandedRowId === lead.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
//                             </Button>
//                           </div>
//                           {/* lg+: only number */}
//                           <div className="hidden lg:block">
//                             {index + 1}.
//                           </div>
//                         </>
//                       </TableCell>
//                       <TableCell className="w-auto md:w-1/4 lg:w-1/6 font-medium">{lead.name}</TableCell>
//                       <TableCell className="w-auto md:table-cell md:w-1/4 lg:w-1/6">
//                         <a href={`tel:+91${lead.call}`} className="text-blue-600">
//                           <Phone />
//                         </a>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell w-1/4 lg:w-1/6">
//                         <a
//                           href={`https://wa.me/+91${lead.call}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-green-600"
//                         >
//                           <MessageSquare />
//                         </a>
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell w-1/6">
//                         <Select
//                           value={lead.project?.toString() ?? ""}
//                           onValueChange={(newProjectId) => handleProjectChange(lead.id, parseInt(newProjectId))}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select Project">
//                               {projects.find(p => p.id === lead.project)?.name}
//                             </SelectValue>
//                           </SelectTrigger>
//                           <SelectContent>
//                             {projects.map((p) => (
//                               <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell w-1/6 text-right">
//                         <Button
//                           variant="outline"
//                           onClick={() => openEditModal(lead)}
//                         >
//                           {lead.status}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                     {expandedRowId === lead.id && (
//                       <>
//                         {/* Mobile Expanded Row */}
//                         <TableRow className="md:hidden">
//                           <TableCell colSpan={3} className="p-0">
//                             <ExpandedLeadDetails lead={lead} projects={projects} openEditModal={openEditModal} handleProjectChange={handleProjectChange} />
//                           </TableCell>
//                         </TableRow>
//                         {/* Tablet Expanded Row */}
//                         <TableRow className="hidden md:table-row lg:hidden">
//                           <TableCell colSpan={4} className="p-0">
//                             <ExpandedLeadDetails lead={lead} projects={projects} openEditModal={openEditModal} handleProjectChange={handleProjectChange} />
//                           </TableCell>
//                         </TableRow>
//                       </>
//                     )}
//                   </React.Fragment>
//                 ))}
//                 {filteredLeads.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={6} className="h-24 text-center">
//                       {kpiCounts.total_lead === 0 ? (
//                         <span>
//                           No leads assigned. Click the <strong>Auto Assign</strong> button to get new leads.
//                         </span>
//                       ) : (
//                         "No matching records found"
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={modalOpen} onOpenChange={setModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Update Lead Status</DialogTitle>
//           </DialogHeader>
//           {selectedLead && (
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <Select
//                   value={selectedLead.status}
//                   onValueChange={(value) =>
//                     setSelectedLead({ ...selectedLead, status: value })
//                   }
//                 >
//                   <SelectTrigger id="status">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Leads">Leads</SelectItem>
//                     <SelectItem value="Intrested">Interested</SelectItem>
//                     <SelectItem value="Not Interested">Not Interested</SelectItem>
//                     <SelectItem value="Not Picked">Not Picked</SelectItem>
//                     <SelectItem value="Other Location">Other Location</SelectItem>
//                     <SelectItem value="Lost">Lost</SelectItem>
//                     <SelectItem value="Visit">Visit</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="message">Message</Label>
//                 <Textarea
//                   id="message"
//                   placeholder="Enter message..."
//                   defaultValue={selectedLead.message}
//                   onChange={(e) =>
//                     setSelectedLead({ ...selectedLead, message: e.target.value })
//                   }
//                 />
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
//                 <Button onClick={handleModalSave}>
//                   Update
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={addLeadModalOpen} onOpenChange={setAddLeadModalOpen}>
//         <DialogContent className="max-w-[95vw] mx-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">Create a New Lead</DialogTitle>
//             <DialogDescription>Fill out the form below to add a new lead to the system.</DialogDescription>
//           </DialogHeader>
//           <form
//             onSubmit={handleFormSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4"
//           >
//             <div className="space-y-2">
//               <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium"><User className="w-4 h-4" /> Name</Label>
//               <Input
//                 type="text"
//                 id="name"
//                 name="name"
//                 maxLength={30}
//                 required
//                 placeholder="e.g. John Doe"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 className="h-11"

//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="status" className="flex items-center gap-2 text-sm font-medium"><Flag className="w-4 h-4" /> Status</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={handleFormSelectChange}
//                 required
//               >
//                 <SelectTrigger id="status" className="h-11">
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {statuses.map((status) => (
//                     <SelectItem key={status} value={status === 'interested' ? 'interested' : status}>
//                       {status}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4" /> Mobile</Label>
//               <Input
//                 type="number"
//                 id="mobile"
//                 name="mobile"
//                 placeholder="e.g. 9876543210"
//                 required
//                 value={formData.mobile}
//                 onChange={handleFormChange}
//                 className="h-11"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4" /> Email</Label>
//               <Input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="e.g. john.doe@example.com"
//                 value={formData.email}
//                 onChange={handleFormChange}
//                 className="h-11"
//               />
//             </div>

//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="w-4 h-4" /> Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 placeholder="Add any relevant notes or details here..."
//                 rows={4}
//                 value={formData.description}
//                 onChange={handleFormChange}
//                 className="resize-none"
//               />
//             </div>
//             <DialogFooter className="md:col-span-2 gap-2">
//               <Button variant="outline" onClick={() => setAddLeadModalOpen(false)}>Cancel</Button>
//               <Button type="submit">Add Lead</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }












'use client';
import React, { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Phone, MessageSquare, PlusCircle, User, Flag, Mail, Filter, Plus, Minus, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker"; // Added DatePicker import
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { STAFF_DASHBOARD_KPI_DATA } from "@/lib/constants";
import { format } from 'date-fns'; // Added import for date formatting

interface Lead {
  id: number;
  name: string;
  call: string;
  status: string;
  project: number | null;
  message?: string;
}

interface Project {
  id: number;
  name: string;
}

const ExpandedLeadDetails = ({ lead, projects, openEditModal, handleProjectChange }: { lead: Lead; projects: Project[]; openEditModal: (lead: Lead) => void; handleProjectChange: (leadId: number, projectId: number) => void; }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 flex items-center gap-4 border-b border-gray-200">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-lg font-bold">{lead.name}</div>
        <div className="text-sm text-gray-500">{lead.status}</div>
      </div>
    </div>
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
        {/* Row 1: Call | WhatsApp */}
        <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium">Call:</span>
          </div>
          <a href={`tel:+91${lead.call}`} className="text-blue-600 ml-auto md:ml-0">
            <Phone className="h-4 w-4" />
          </a>
        </div>
        <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium">WhatsApp:</span>
          </div>
          <a
            href={`https://wa.me/+91${lead.call}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 ml-auto md:ml-0"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
        </div>
        {/* Row 2: Project */}
        <div className="p-3 border-b md:col-span-2 flex items-center justify-between md:justify-start md:gap-4">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium">Project:</span>
          </div>
          <Select
            value={lead.project?.toString() ?? ""}
            onValueChange={(newProjectId) => handleProjectChange(lead.id, parseInt(newProjectId))}
          >
            <SelectTrigger className="ml-auto md:ml-0 w-full md:w-48">
              <SelectValue placeholder="Select Project">
                {projects.find(p => p.id === lead.project)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Row 3: Change Status */}
        <div className="p-3 border-b md:col-span-2 flex items-center justify-between">
          <div className="flex items-center">
            <Flag className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium">Change Status:</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(lead)}
            className="ml-auto md:ml-4"
          >
            {lead.status}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const KpiCard = ({ title, value, icon: Icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
  const cardContent = (
    <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-3 lg:p-2 flex flex-col items-center justify-center text-center gap-1">
        <div className={`text-3xl ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="font-semibold text-foreground text-sm">{title}</div>
        <div className="text-muted-foreground text-lg font-bold">
          {value}
        </div>
      </CardContent>
    </Card>
  );

  if (link) {
    return <Link href={link}>{cardContent}</Link>;
  }

  return cardContent;
};


export default function StaffDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined); // Changed to Date | undefined
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);     // Changed to Date | undefined
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [kpiCounts, setKpiCounts] = useState({
    total_lead: 15,
    total_visits: 2,
    interested: 2,
    not_interested: 2,
    other_location: 1,
    not_picked: 2,
  });

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const [formData, setFormData] = useState({
    name: "",
    status: "",
    mobile: "",
    email: "",
    description: "",
  });

  const statuses = [
    "Leads",
    "Intrested",
    "Not Interested",
    "Other Location",
    "Not Picked",
    "Lost",
    "Visit",
  ];

  const { toast } = useToast();

  useEffect(() => {
    fetchStaffDashboardData();
  }, []);

  const fetchStaffDashboardData = async (startDate?: string, endDate?: string) => {
    //console.log("Fetching staff dashboard data...");
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/dashboard/`;

    if (startDate && endDate) {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      url += `?${params.toString()}`;
    }

    try {
      //console.log("API URL for staff dashboard:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        //console.log("API Response status:", response.status);
        //console.log("API Response data:", data);

        if (data.results) {
          const formattedLeads = data.results.map((lead: any) => ({
            id: lead.id,
            name: lead.name,
            call: lead.call,
            status: lead.status,
            project: lead.project,
          }));
          setLeads(formattedLeads);
          //console.log("Leads after setLeads:", formattedLeads);
        }

        if (data.projects) {
          setProjects(data.projects);
          //console.log("Projects after setProjects:", data.projects);
        }

        if (data.counts) {
          setKpiCounts({
            total_lead: data.counts.total_leads,
            total_visits: data.counts.total_visits_leads,
            interested: data.counts.total_interested_leads,
            not_interested: data.counts.total_not_interested_leads,
            other_location: data.counts.total_other_location_leads,
            not_picked: data.counts.total_not_picked_leads,
          });
        }

        if (startDate && endDate) {
          setSearch(""); // Clear search field on successful filter
        }
      } else {
        toast({ title: "Error", description: "Failed to fetch dashboard data.", variant: "destructive" });
      }
    } catch (error) {
      //console.error("Error fetching dashboard data:", error);
      toast({ title: "Error", description: "An error occurred while fetching data.", variant: "destructive" });
    }
  };

  const handleFilterClick = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both a start and end date to filter.",
        variant: "destructive",
      });
      return;
    }
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    fetchStaffDashboardData(formattedStartDate, formattedEndDate);
    setStartDate(undefined); // Clear start date
    setEndDate(undefined);   // Clear end date
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (id: number, status: string, message?: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    const data = new FormData();
    data.append('status', status);
    if (message) {
      data.append('message', message);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/update-lead/${id}/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status');
      }

      // Refetch data to show the update from the server
      fetchStaffDashboardData();
      toast({ title: "Status Updated", description: "Lead status has been successfully updated." });

    } catch (error: any) {
      //console.error("Error updating lead status:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleModalSave = () => {
    if (selectedLead) {
      handleStatusChange(selectedLead.id, selectedLead.status, selectedLead.message);
    }
    setModalOpen(false);
  }



  // Handle project change
  const handleProjectChange = async (leadId: number, projectId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/update-lead-project/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: leadId,
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      fetchStaffDashboardData();
      toast({ title: "Project Updated", description: "Lead project has been successfully updated." });

    } catch (error: any) {
      //console.error("Error updating lead project:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };



  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSelectChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {


    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('mobile', formData.mobile);
    data.append('status', formData.status || 'Leads');
    if (formData.email) data.append('email', formData.email);
    if (formData.description) data.append('message', formData.description);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/add-self-lead/`, {
        method: "POST",
        headers: { "Authorization": `Token ${token}` },
        body: data,
      });

      if (response.ok) {

        fetchStaffDashboardData();
        toast({
          title: "Lead Added!",
          description: `${formData.name} has been successfully added.`,
          className: 'bg-green-500 text-white'
        });
        setFormData({
          name: "",
          status: "",
          mobile: "",
          email: "",
          description: "",
        });
        setAddLeadModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error Adding Lead",
          description: errorData.message || "Failed to add lead",
          variant: "destructive",
        });
      }
    } catch (error) {
      //console.error("Error adding lead:", error);
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAutoAssign = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/auto-assign-leads/`, {
        method: "POST",
        headers: { "Authorization": `Token ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Leads Assigned!",
          description: data.message || "New leads have been assigned to you.",
          className: 'bg-green-500 text-white'
        });
        fetchStaffDashboardData(); // Refresh the dashboard
      } else {
        toast({
          title: "Assignment Failed",
          description: data.error || "Could not assign leads.",
          variant: "destructive",
        });
      }
    } catch (error) {
      //console.error("Error auto-assigning leads:", error);
      toast({
        title: "Error",
        description: "An error occurred during auto-assignment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl: gap-4">
        {STAFF_DASHBOARD_KPI_DATA.map((card, index) => (
          <KpiCard
            key={index}
            title={card.title}
            value={kpiCounts[card.valueKey as keyof typeof kpiCounts]}
            icon={card.icon}
            color={card.color}
            link={card.link}
          />
        ))}
      </div>

      {/* Filter Card - Responsive: Mobile stacked, md+ in one line */}
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            {/* Date Pickers Group - Stacked on mobile, row on md+ */}
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
              <div className="space-y-2 flex-1 min-w-0">
                <Label htmlFor="start_date" className="text-sm">Start Date</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <Label htmlFor="end_date" className="text-sm">End Date</Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
            {/* Filter Button - Full width on mobile, auto on md+ */}
            <Button 
              onClick={handleFilterClick}
              className="w-full md:w-auto flex items-center gap-2 px-4 py-2 text-sm md:text-base"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setAddLeadModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Lead
              </Button>
              {kpiCounts.total_lead === 0 && (
                <Button variant="outline" onClick={handleAutoAssign}>Auto Assign</Button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto md:w-1/4 lg:w-1/6">S.N.</TableHead>
                  <TableHead className="w-auto md:w-1/4 lg:w-1/6">Name</TableHead>
                  <TableHead className="w-auto md:table-cell md:w-1/4 lg:w-1/6">Call</TableHead>
                  <TableHead className="hidden md:table-cell w-1/4 lg:w-1/6">WhatsApp</TableHead>
                  <TableHead className="hidden lg:table-cell w-1/6">Project</TableHead>
                  <TableHead className="hidden lg:table-cell w-1/6 text-right">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <React.Fragment key={lead.id}>
                    <TableRow data-state={expandedRowId === lead.id && 'selected'}>
                      <TableCell className="w-auto md:w-1/4 lg:w-1/6">
                        <>
                          <div className="lg:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => toggleRow(lead.id)}
                            >
                              {expandedRowId === lead.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                          {/* lg+: only number */}
                          <div className="hidden lg:block">
                            {index + 1}.
                          </div>
                        </>
                      </TableCell>
                      <TableCell className="w-auto md:w-1/4 lg:w-1/6 font-medium">{lead.name}</TableCell>
                      <TableCell className="w-auto md:table-cell md:w-1/4 lg:w-1/6">
                        <a href={`tel:+91${lead.call}`} className="text-blue-600">
                          <Phone />
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell w-1/4 lg:w-1/6">
                        <a
                          href={`https://wa.me/+91${lead.call}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600"
                        >
                          <MessageSquare />
                        </a>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell w-1/6">
                        <Select
                          value={lead.project?.toString() ?? ""}
                          onValueChange={(newProjectId) => handleProjectChange(lead.id, parseInt(newProjectId))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Project">
                              {projects.find(p => p.id === lead.project)?.name}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell w-1/6 text-right">
                        <Button
                          variant="outline"
                          onClick={() => openEditModal(lead)}
                        >
                          {lead.status}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRowId === lead.id && (
                      <>
                        {/* Mobile Expanded Row */}
                        <TableRow className="md:hidden">
                          <TableCell colSpan={3} className="p-0">
                            <ExpandedLeadDetails lead={lead} projects={projects} openEditModal={openEditModal} handleProjectChange={handleProjectChange} />
                          </TableCell>
                        </TableRow>
                        {/* Tablet Expanded Row */}
                        <TableRow className="hidden md:table-row lg:hidden">
                          <TableCell colSpan={4} className="p-0">
                            <ExpandedLeadDetails lead={lead} projects={projects} openEditModal={openEditModal} handleProjectChange={handleProjectChange} />
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </React.Fragment>
                ))}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {kpiCounts.total_lead === 0 ? (
                        <span>
                          No leads assigned. Click the <strong>Auto Assign</strong> button to get new leads.
                        </span>
                      ) : (
                        "No matching records found"
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedLead.status}
                  onValueChange={(value) =>
                    setSelectedLead({ ...selectedLead, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leads">Leads</SelectItem>
                    <SelectItem value="Intrested">Interested</SelectItem>
                    <SelectItem value="Not Interested">Not Interested</SelectItem>
                    <SelectItem value="Not Picked">Not Picked</SelectItem>
                    <SelectItem value="Other Location">Other Location</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Visit">Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter message..."
                  defaultValue={selectedLead.message}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, message: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleModalSave}>
                  Update
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addLeadModalOpen} onOpenChange={setAddLeadModalOpen}>
        <DialogContent className="max-w-[95vw] mx-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create a New Lead</DialogTitle>
            <DialogDescription>Fill out the form below to add a new lead to the system.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium"><User className="w-4 h-4" /> Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                maxLength={30}
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleFormChange}
                className="h-11"

              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2 text-sm font-medium"><Flag className="w-4 h-4" /> Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleFormSelectChange}
                required
              >
                <SelectTrigger id="status" className="h-11">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status === 'interested' ? 'interested' : status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4" /> Mobile</Label>
              <Input
                type="number"
                id="mobile"
                name="mobile"
                placeholder="e.g. 9876543210"
                required
                value={formData.mobile}
                onChange={handleFormChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4" /> Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. john.doe@example.com"
                value={formData.email}
                onChange={handleFormChange}
                className="h-11"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="w-4 h-4" /> Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add any relevant notes or details here..."
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                className="resize-none"
              />
            </div>
            <DialogFooter className="md:col-span-2 gap-2">
              <Button variant="outline" onClick={() => setAddLeadModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}