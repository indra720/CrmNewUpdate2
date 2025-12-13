'use client';

import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  PlusCircle,
  Plus,
  Minus,
  Users,
  Check,
  Phone,
  MapPin,
  Eye,
  Mail,
  Lock,
  Calendar,
  Filter,
  MoreVertical,
  ArrowLeft,
  XCircle,
  Clock,
  Briefcase,
  User,
  CreditCard,
  Fingerprint,
  FileText,
  GraduationCap,
  Landmark,
  Hash,
  Wallet,
  Building2,
  ArrowRight,
  FileUp,
  Search,
  X,
  DollarSign,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { fetchAdminTeamLeaders } from '@/lib/api';
import { DatePicker } from "@/components/ui/date-picker";


const kpiData = [
  { title: "Total Leads", valueKey: "total_leads", icon: Users, color: "text-rose-500", link: "/admin/reports/total-leads?source=team-leader" },
  { title: "Total Visit", valueKey: "total_visits_leads", icon: Eye, color: "text-green-500", link: "/admin/reports/visit?source=team-leader" },
  { title: "Interested", valueKey: "total_interested_leads", icon: Check, color: "text-teal-500", link: "/admin/reports/interested?source=team-leader" },
  { title: "Not Interested", valueKey: "total_not_interested_leads", icon: XCircle, color: "text-red-500", link: "/admin/reports/not-interested?source=team-leader" },
  { title: "Other Location", valueKey: "total_other_location_leads", icon: MapPin, color: "text-orange-500", link: "/admin/reports/other-location?source=team-leader" },
  { title: "Not Picked", valueKey: "total_not_picked_leads", icon: Phone, color: "text-slate-500", link: "/admin/reports/not-picked?source=team-leader" },

];


const initialFormData = {
  id: null,
  name: "",
  email: "",
  password: "",
  mobile: "",
  dob: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  degree: "",
  pancard: "",
  aadharCard: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  upi_id: "",
  salary: "",
  referralCode: "",
  marksheets: null,
};

const InputField = ({ id, label, name, type = 'text', placeholder, icon: Icon, value, onChange, required, children, disabled }: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  value: string | number;
  onChange: (e: any) => void;
  required?: boolean;
  children?: React.ReactElement;
  disabled?: boolean;
}) => {
  const inputElement = children ?
    React.cloneElement(children, { id, name, value, onChange, required, placeholder, disabled }) :
    <Input type={type} id={id} name={name} value={value as string} onChange={onChange} required={required} placeholder={placeholder} className="pl-10 pr-4 h-11" disabled={disabled} />;

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />}
        {inputElement}
      </div>
    </div>
  );
};

const ReviewDetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value || 'N/A'}</p>
  </div>
);

export default function TeamLeaderManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [kpiCounts, setKpiCounts] = useState<any>({
    total_leads: 0,
    total_interested_leads: 0,
    total_not_interested_leads: 0,
    total_other_location_leads: 0,
    total_not_picked_leads: 0,
    total_lost_leads: 0,
    total_visits_leads: 0,
  });
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("personal");
  const [editActiveTab, setEditActiveTab] = useState("personal");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const { toast } = useToast();

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.files ? target.files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddFormSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAddForm = () => {
    setFormData(initialFormData);
    setActiveTab("personal");
    setIsAddFormOpen(true);
  }

  const handleOpenEditForm = (user: any) => {
    setEditingUser({ ...user });
    setEditActiveTab("personal");
    setIsEditFormOpen(true);
  }

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setFormData(initialFormData);
  }

  const loadTeamLeaders = async (start?: string, end?: string) => {
    setIsLoading(true);
    try {
      const reportData = await fetchAdminTeamLeaders(start, end);
      setUsers(reportData.team_leaders_list || []);
      setKpiCounts(reportData.counts || {});
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch team leaders or KPI data: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = () => {
    if (isFilterActive) {
      setStartDate(undefined);
      setEndDate(undefined);
      setIsFilterActive(false);
      loadTeamLeaders();
    } else {
      if (startDate && endDate) {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        loadTeamLeaders(formattedStartDate, formattedEndDate);
        setIsFilterActive(true);
      } else {
        toast({
          title: "Incomplete Date Range",
          description: "Please select both a start and end date to apply the filter.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    // Append all form data. If a value is null, append it as an empty string.
    for (const key in formData) {
      data.append(key, formData[key] ?? '');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/add-team-leader/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        if (response.status === 415) {
             throw new Error('Unsupported Media Type: The server rejected the request format. This is an unexpected error.');
        }
        const errorData = await response.json();
        const errorMessages = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        throw new Error(errorMessages || 'Failed to add team leader.');
      }

      toast({
        title: "Team Leader Added!",
        description: `${formData.name} has been added successfully.`,
        className: 'bg-green-500 text-white'
      });

      handleCloseAddForm();
      loadTeamLeaders();

    } catch (error: any) {
      toast({
        title: 'Error Adding Team Leader',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append('name', editingUser.name);
    data.append('email', editingUser.email);
    data.append('mobile', editingUser.mobile);
    if (editingUser.password) {
      data.append('password', editingUser.password);
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/team-leader/edit/${editingUser.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        throw new Error(errorMessages || 'Failed to update team leader.');
      }

      toast({
        title: "Team Leader Updated!",
        description: `${editingUser.name} has been updated successfully.`,
        className: 'bg-green-500 text-white'
      });

      setIsEditFormOpen(false);
      setEditingUser(null);
      loadTeamLeaders(); // Reload the list

    } catch (error: any) {
      toast({
        title: 'Error Updating Team Leader',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  useEffect(() => {
    loadTeamLeaders();
  }, []); 


  const handleToggle = async (userId: number, userTLId: number, newIsActive: boolean) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive" });
      return;
    }

    // Optimistic UI update first
    setUsers(prevUsers => prevUsers.map(u => u.id === userTLId ? { ...u, user: { ...u.user, user_active: newIsActive } } : u));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/toggle-status/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update status.');
      }
      
      // The API's final state should match newIsActive. If not, this syncs it.
      // This is a safety check to ensure UI is in sync with backend, even if toggle logic is reversed
      setUsers(prevUsers => prevUsers.map(u => u.id === userTLId ? { ...u, user: { ...u.user, user_active: result.user_active } } : u));

      toast({
        title: 'Status Updated',
        description: `User is now ${result.user_active ? 'Active' : 'Inactive'}.`,
        className: 'bg-green-500 text-white'
      });

    } catch (error: any) {
      // If API call fails, revert the optimistic update
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === userTLId) {
          return { ...u, user: { ...u.user, user_active: !newIsActive } };
        }
        return u;
      }));
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user status.',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.mobile?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const KpiCard = ({ title, value, icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-3 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className={`text-3xl ${color} mb-1`}>
            {React.createElement(icon, { className: "h-6 w-6" })}
          </motion.div>
          <div className="font-semibold text-foreground text-sm">{title}</div>
          <div className="text-muted-foreground text-xs mt-1">
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

  const tabAnimation = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Team Leader List</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {kpiData.map((card, index) => (
            <KpiCard
              key={index}
              title={card.title}
              value={kpiCounts[card.valueKey as keyof typeof kpiCounts] || 0}
              icon={card.icon}
              color={card.color}
              link={card.link} />
          ))}
        </div>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                <div className="grid flex-shrink-0 grid-cols-1 sm:grid-cols-2 gap-2">
                  <DatePicker date={startDate} setDate={setStartDate} />
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
                <div className="relative w-full md:w-auto md:flex-1 lg:flex-none lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2 self-end lg:self-center">
                <Button variant={isFilterActive ? "destructive" : "outline"} onClick={handleFilterClick}>
                  {isFilterActive ? <X className="h-4 w-4 md:mr-2" /> : <Filter className="h-4 w-4 md:mr-2" />}
                  <span className="hidden md:inline">{isFilterActive ? "Clear" : "Filter"}</span>
                </Button>
                <Button onClick={handleOpenAddForm}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">Add Team Leader</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading team leaders...</div>
            ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.N.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Admin</TableHead>
                    <TableHead className="hidden md:table-cell">Mobile No</TableHead>
                    <TableHead className="hidden lg:table-cell">Created Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Leads Report</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">Active/Non-Active</TableHead>
                    <TableHead className="text-right">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <TableRow data-state={expandedRowId === user.id && 'selected'}>
                        <TableCell>
                          <>
                            <div className="lg:hidden">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-green-600"
                                onClick={() => toggleRow(user.id)}
                              >
                                {expandedRowId === user.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                              </Button>
                            </div>
                            <div className="hidden lg:block">
                              {index + 1}.
                            </div>
                          </>
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.admin?.name || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(user.user?.created_date || user.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <select className="form-select form-select-sm w-full bg-background border border-input rounded-md px-2 py-1 text-sm" onChange={(e) => e.target.value && window.location.assign(e.target.value)}>
                              <option value="">Select Type</option>
                              <option value={`/admin/reports/interested`}>Interested</option>
                              <option value={`/admin/reports/not-interested`}>Not Interested</option>
                              <option value={`/admin/reports/other-location`}>Other Location</option>
                              <option value={`/admin/reports/total-leads`}>Lost</option>
                              <option value={`/admin/reports/visit`}>Visit</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <Switch
                            checked={user.user?.user_active}
                            onCheckedChange={(checked) =>
                              handleToggle(user.user.id, user.id, checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleOpenEditForm(user)}
                                          className="h-8 w-8"
                                      >
                                          <Pencil className="h-4 w-4" />
                                          <span className="sr-only">Edit</span>
                                      </Button>
                                   </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRowId === user.id && (
                        <TableRow className="lg:hidden">
                          <TableCell colSpan={8} className="p-0">
                            <div className="p-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.user?.user_active ? 'Active' : 'Inactive'}</div>
                                  </div>
                                </div>
                                <div className="overflow-hidden">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Admin:</span>
                                      </div>
                                      <span className="text-sm capitalize  ml-5 md:ml-0">{user.admin?.name || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Mobile:</span>
                                      </div>
                                      <span className="text-sm ml-auto md:ml-0">{user.mobile || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Created Date:</span>
                                      </div>
                                      <span className="text-sm ml-auto md:ml-0">{user.user?.created_date ? new Date(user.user.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Leads Report:</span>
                                      </div>
                                      <select className="text-sm w-full bg-background border border-input rounded-md px-2 py-1" onChange={(e) => e.target.value && window.location.assign(e.target.value)}>
                                          <option value="">Select Type</option>
                                          <option value={`/admin/reports/interested`}>Interested</option>
                                          <option value={`/admin/reports/not-interested`}>Not Interested</option>
                                          <option value={`/admin/reports/other-location`}>Other Location</option>
                                          <option value={`/admin/reports/total-leads`}>Lost</option>
                                          <option value={`/admin/reports/visit`}>Visit</option>
                                      </select>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Check className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Active Status:</span>
                                      </div>
                                      <Switch
                                        checked={user.user?.user_active}
                                        onCheckedChange={(checked) =>
                                          handleToggle(user.user.id, user.id, checked)
                                        }
                                        className="ml-auto md:ml-0"
                                      />
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-center md:justify-end">
                                      <Button size="sm" onClick={() => handleOpenEditForm(user)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                      </Button>
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
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No matching records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-3xl w-[calc(100vw-2rem)]  max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">Add New Team Leader</DialogTitle>
            <DialogDescription>
              Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="flex-1 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <div className="px-6 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="account">Account Details</TabsTrigger>
                </TabsList>
              </div>
              <div className="p-6 overflow-y-auto flex-1 relative hide-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={tabAnimation.initial}
                    animate={tabAnimation.animate}
                    exit={tabAnimation.exit}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {activeTab === 'personal' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleAddFormChange} required />
                        <InputField id="email" label="E-Mail Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleAddFormChange} required />
                        <InputField id="password" label="Password" name="password" type="password" placeholder="••••••••" icon={Lock} value={formData.password} onChange={handleAddFormChange} required />
                        <InputField id="dob" label="Date of Birth" name="dob" type="date" icon={Calendar} value={formData.dob} onChange={handleAddFormChange} />
                        <InputField id="pancard" label="Pan Card" name="pancard" placeholder="ABCDE1234F" icon={CreditCard} value={formData.pancard} onChange={handleAddFormChange} />
                        <InputField id="aadharCard" label="Aadhar Card" name="aadharCard" placeholder="1234 5678 9012" icon={Fingerprint} value={formData.aadharCard} onChange={handleAddFormChange} />
                        <InputField id="marksheets" label="MarkSheets" name="marksheets" type="file" icon={FileText} onChange={handleAddFormChange} value={''} />
                        <InputField id="degree" label="Degree" name="degree" placeholder="B.Tech, M.Sc" icon={GraduationCap} value={formData.degree} onChange={handleAddFormChange} />
                        <InputField id="city" label="City" name="city" placeholder="e.g. Mumbai" icon={Building2} value={formData.city} onChange={handleAddFormChange} />
                        <InputField id="state" label="State" name="state" value={formData.state} onChange={handleAddFormChange}>
                          <Select onValueChange={(value) => handleAddFormSelectChange("state", value)} name="state" defaultValue={formData.state}>
                            <SelectTrigger className="pl-10 pr-4 h-11">
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                            </SelectContent>
                          </Select>
                        </InputField>
                        <InputField id="mobile" label="Mobile" name="mobile" type="tel" placeholder="9876543210" icon={Phone} value={formData.mobile} onChange={handleAddFormChange} required />
                        <InputField id="salary" label="Salary" name="salary" placeholder="e.g. 50000" icon={Wallet} value={formData.salary} onChange={handleAddFormChange} />
                      </div>
                    )}
                    {activeTab === 'account' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField id="account_number" label="Account Number" name="account_number" placeholder="Your account number" icon={Wallet} value={formData.account_number} onChange={handleAddFormChange} />
                        <InputField id="upi_id" label="Add UPI" name="upi_id" placeholder="yourname@upi" icon={Briefcase} value={formData.upi_id} onChange={handleAddFormChange} />
                        <InputField id="bank_name" label="Bank Name" name="bank_name" placeholder="e.g. State Bank of India" icon={Landmark} value={formData.bank_name} onChange={handleAddFormChange} />
                        <InputField id="ifsc_code" label="IFSC Code" name="ifsc_code" placeholder="SBIN0001234" icon={Hash} value={formData.ifsc_code} onChange={handleAddFormChange} />
                        <InputField id="pincode" label="Pincode" name="pincode" placeholder="e.g. 110001" icon={MapPin} value={formData.pincode} onChange={handleAddFormChange} />
                        <div className="md:col-span-2">
                          <InputField id="address" label="Address" name="address" value={formData.address} onChange={handleAddFormChange}>
                            <Textarea className="pl-10 pr-4 min-h-[80px]" placeholder="Enter full address" />
                          </InputField>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <DialogFooter className="p-6 pt-4 border-t gap-2 bg-muted/50 flex justify-between w-full flex-shrink-0">
                {activeTab === 'personal' ? (
                  <div></div>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                {activeTab === 'personal' ? (
                  <Button type="button" onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">Save Team Leader</Button>
                )}
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {editingUser && (
        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DialogContent className="sm:max-w-md w-[calc(100vw-2rem)] ">
            <DialogHeader>
              <DialogTitle>Edit Team Leader</DialogTitle>
              <DialogDescription>
                Update the details for {editingUser.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" value={editingUser.name} onChange={handleEditFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" value={editingUser.email} onChange={handleEditFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mobile">Mobile</Label>
                <Input id="edit-mobile" name="mobile" value={editingUser.mobile} onChange={handleEditFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <Input id="edit-password" name="password" type="password" placeholder="Leave blank to keep current password" onChange={handleEditFormChange} />
              </div>
              <DialogFooter className='gap-2'>
                <Button type="button" variant="outline" onClick={() => setIsEditFormOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
