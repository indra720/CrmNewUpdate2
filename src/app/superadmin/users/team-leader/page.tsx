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
  Plus,
  Minus,
  PlusCircle,
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { toggleUserActiveStatus, editTeamLeader } from "@/lib/api";

const kpiData = [
    { title: "Pending FollowUps", valueKey: "total_pending_followup", icon: Clock, color: "text-yellow-500", link: "/superadmin/reports/pending-followups?source=team-leader" },
    { title: "Tomorrow FollowUps", valueKey: "total_tomorrow_followup", icon: Clock, color: "text-blue-500", link: "/superadmin/reports/tomorrow-followups?source=team-leader" },
    { title: "Today FollowUps", valueKey: "total_today_followup", icon: Clock, color: "text-purple-500", link: "/superadmin/reports/today-followups?source=team-leader" },
    { title: "Total Leads", valueKey: "total_leads", icon: Users, color: "text-rose-500", link: "/superadmin/reports/total-leads?source=team-leader" },
    { title: "Total Visit", valueKey: "total_visit", icon: Eye, color: "text-green-500", link: "/superadmin/reports/visit?source=team-leader" },
    { title: "Interested", valueKey: "total_interested", icon: Check, color: "text-teal-500", link: "/superadmin/reports/interested?source=team-leader" },
    { title: "Not Interested", valueKey: "total_not_interested", icon: XCircle, color: "text-red-500", link: "/superadmin/reports/not-interested?source=team-leader" },
    { title: "Other Location", valueKey: "total_other_location", icon: MapPin, color: "text-orange-500", link: "/superadmin/reports/other-location?source=team-leader" },
    { title: "Not Picked", valueKey: "total_not_picked", icon: Phone, color: "text-slate-500", link: "/superadmin/reports/not-picked?source=team-leader" },
    { title: "Total Staff", valueKey: "total_staff", icon: Users, color: "text-indigo-500", link: "/superadmin/reports/total-staff?source=team-leader" },
    { title: "Active Staff", valueKey: "active_staff", icon: Users, color: "text-lime-500", link: "/superadmin/reports/active-staff?source=team-leader" },
];

const initialFormData = {
    id: null,
    user_id: null, // Added user_id
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
    pan_card: "",
    aadhar_card: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
    salary: "",
    referral_code: "",
    marksheets: "",
    admin_id: "",
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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border-b border-border-200 last:border-b-0 hover:bg-accent/50 transition-colors duration-200">
        <p className="text-sm font-medium text-muted-foreground sm:w-1/2">{label}</p>
        <p className="font-semibold text-foreground sm:w-1/2 sm:text-right mt-1 sm:mt-0">{value || 'N/A'}</p>
    </div>
);



export default function TeamLeaderManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>(initialFormData);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const { toast } = useToast();

  const [cardData, setcardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`, {
          headers: { Authorization: ` Token ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setcardData(data);
    } catch (err: any) {
      setError(err.message);
      setcardData(null);
    }
  };

  const fetchPageData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/team-leader-dashboard/`, {
          headers: { Authorization: ` Token ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.results || []);

    } catch (err: any) {
      setError(err.message);
      setUsers([]);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPageData();
    fetchAdmins(); // Call the new function to fetch admins
  }, []);

  const fetchAdmins = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`, {
          headers: { Authorization: ` Token ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Filter for users who are admins and then map to the required {id, name} structure.
      const fetchedAdmins = data.users
        .filter((user: any) => user.user && user.user.is_admin)
        .map((admin: any) => ({ id: admin.id, name: admin.name }));
      setAdmins(fetchedAdmins);
    } catch (err: any) {
      //console.error("Failed to fetch admins:", err);
      toast({
        title: "Error",
        description: "Failed to load admin list for the dropdown.",
        variant: "destructive",
      });
    }
  };


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
    setFormMode('add');
    setFormData(initialFormData);
    setActiveTab("personal");
    setIsFormOpen(true);
  }

  const handleOpenEditForm = (user: any) => {
    setFormMode('edit');
    // Set form data directly from the user object from the table to avoid a failing network call
    setFormData({
      id: user.id, // Team Leader Profile ID
      user_id: user.user?.id || user.user_id || null, // Base User ID
      name: user.name || '',
      email: user.user?.email || '',
      mobile: user.mobile || '',
      dob: user.dob || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      degree: user.degree || '',
      pan_card: user.pancard || '',
      aadhar_card: user.aadharCard || '',
      bank_name: user.bank_name || '',
      account_number: user.account_number || '',
      ifsc_code: user.ifsc_code || '',
      upi_id: user.upi_id || '',
      salary: user.salary || '',
      admin_id: user.admin?.id || '',
      password: '', // Always start with an empty password field
    });
    setActiveTab("personal");
    setIsFormOpen(true);
  }

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const data = new FormData();
    
    const submissionData = { ...formData };

    Object.keys(submissionData).forEach(key => {
        if (submissionData[key] !== null && submissionData[key] !== undefined) {
            data.append(key, submissionData[key]);
        }
    });

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/team-leader/add-new/`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
            },
            body: data,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(Object.entries(errorData).map(([key, value]) => `${key}: ${value}`).join(", ") || 'Failed to add team leader');
        }

        toast({
            title: "Team Leader Added!",
            description: `${formData.name} has been added successfully.`,
            className: 'bg-green-500 text-white'
        });
        handleCloseForm();
        fetchPageData();
    } catch (error: any) {
        console.error("Add Team Leader Error:", error);
        toast({
            title: "Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_id) {
        toast({ title: "Error", description: "User ID is missing for update.", variant: "destructive" });
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    
    // Create a mutable copy of formData to work with
    const submissionData = { ...formData };

    // If password is empty or null, don't include it in the submission
    if (!submissionData.password) {
        delete submissionData.password;
    }

    // Append all other fields to FormData
    Object.keys(submissionData).forEach(key => {
        if (submissionData[key] !== null && submissionData[key] !== undefined) {
            data.append(key, submissionData[key]);
        }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/team-leader/edit/${formData.user_id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Failed to update team leader.";
        if (errorData) {
          const errors: string[] = [];
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errors.push(`${key}: ${errorData[key].join(', ')}`);
            } else {
              errors.push(`${key}: ${errorData[key]}`);
            }
          });
          if (errors.length > 0) {
            errorMessage = errors.join('\n');
          }
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();

      setUsers(users.map(u => u.id === formData.id ? { ...u, ...updatedUser } : u));
      
      toast({
        title: "Team Leader Updated!",
        description: `${formData.name} has been updated successfully.`,
        className: 'bg-green-500 text-white'
      });
      
      handleCloseForm();
      fetchPageData(); 
    } catch (error: any) {
      console.error("Edit Team Leader Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update team leader.",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    // setUsers(mockUsers);
  }, []);



  // toggle active
  
  const handleToggle = async (id: number, isActive: boolean) => {
    const originalUsers = [...users];
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, user: { ...u.user, user_active: isActive } }
          : u
      )
    );

    try {
      await toggleUserActiveStatus(id, "teamlead", isActive);
      toast({
        title: "Status Updated",
        description: `User status changed to ${
          isActive ? "Active" : "Inactive"
        }.`,
        className: "bg-blue-500 text-white",
        duration: 3000,
      });
      fetchPageData();
    } catch (error: any) {
      setUsers(originalUsers);
      toast({
        title: "Error",
        description: `Failed to update user status: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    Object.values(u).some(
      (val: any) =>
        val &&
        (typeof val === 'string' || typeof val === 'number' || (typeof val === 'object' && val.name)) &&
        (val.name || val).toString().toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const KpiCard = ({ title, value, icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <div className={`text-3xl ${color} mb-1`}>
                {React.createElement(icon, { className: "h-6 w-6" })}
            </div>
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Team Leader List</h1>
      {loading ? (
        <p className="text-center text-muted-foreground">Loading dashboard...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : cardData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiData.map((card, index) => (
            <KpiCard
              key={index}
              title={card.title}
              value={cardData?.[card.valueKey] ?? 0}
              icon={card.icon}
              color={card.color}
              link={card.link}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No dashboard data available.</p>
      )}

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>Team Leaders</CardTitle>
                <CardDescription className="hidden sm:block">View and manage team leaders.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search Team Leaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:flex-initial sm:max-w-xs"
            />
             <Button variant="outline" size="icon" className="sm:hidden">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
             <Button variant="outline" className="hidden sm:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="icon" className="sm:hidden" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4" />
               <span className="sr-only">Add Team Leader</span>
            </Button>
            <Button className="hidden sm:flex" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Team Leader
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead className="text-right">Actions</TableHead>
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
                        {user.user?.created_date ? new Date(user.user.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : 'N/A'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                          <select className="form-select form-select-sm w-full bg-background border border-input rounded-md px-2 py-1 text-sm" onChange={(e) => e.target.value && window.location.assign(e.target.value)}>
                              <option value="">Select Type</option>
                              <option value={`/superadmin/reports/interested`}>Intrested</option>
                              <option value={`/superadmin/reports/not-interested`}>Not Interested</option>
                              <option value={`/superadmin/reports/other-location`}>Other Location</option>
                              <option value={`/superadmin/reports/total-leads`}>Lost</option>
                              <option value={`/superadmin/reports/visit`}>Visit</option>
                          </select>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        <Switch
                          checked={user.user?.user_active}
                          onCheckedChange={(checked) =>
                            handleToggle(user.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="hidden lg:flex items-center justify-end gap-2">
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
                        <div className="hidden md:flex lg:hidden items-center justify-end gap-2">
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
                         <div className="md:hidden">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenEditForm(user)}
                                className="h-8 w-8"
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
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
                                    <span className="text-sm capitalize ml-auto md:ml-0">{user.admin?.name || 'N/A'}</span>
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
                                        <option value={`/superadmin/reports/interested`}>Intrested</option>
                                        <option value={`/superadmin/reports/not-interested`}>Not Interested</option>
                                        <option value={`/superadmin/reports/other-location`}>Other Location</option>
                                        <option value={`/superadmin/reports/total-leads`}>Lost</option>
                                        <option value={`/superadmin/reports/visit`}>Visit</option>
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
                                        handleToggle(user.id, checked)
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
        </CardContent>
      </Card>

    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
            <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <DialogTitle className="text-xl font-bold">{formMode === 'add' ? 'Add New Team Leader' : 'Edit Team Leader'}</DialogTitle>
                <DialogDescription>
                    {formMode === 'add' ? 'Fill in the details below.' : `Update details for ${formData.name}`}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={formMode === 'add' ? handleAddSubmit : handleEditSubmit} className="flex-1 flex flex-col min-h-0">
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
                              <InputField id="admin_id" label="Admin" name="admin_id" value={formData.admin_id} onChange={(e) => handleAddFormSelectChange("admin_id", e.target.value)} required>
                                <Select onValueChange={(value) => handleAddFormSelectChange("admin_id", value)} name="admin_id" value={formData.admin_id?.toString()} required>
                                    <SelectTrigger className="pl-10 pr-4 h-11">
                                    <SelectValue placeholder="Select Admin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {admins.map(admin => (
                                        <SelectItem key={admin.id} value={admin.id.toString()}>{admin.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                </Select>
                              </InputField>
                              <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleAddFormChange} required />
                              <InputField id="email" label="E-Mail Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleAddFormChange} required />
                              <InputField id="password" label="Password" name="password" type="password" placeholder={formMode === 'edit' ? 'Leave blank to keep current password' : '••••••••'} icon={Lock} value={formData.password} onChange={handleAddFormChange} required />
                              <InputField id="dob" label="Date of Birth" name="dob" type="date" icon={Calendar} value={formData.dob} onChange={handleAddFormChange} required />
                              <InputField id="pan_card" label="Pan Card" name="pan_card" placeholder="ABCDE1234F" icon={CreditCard} value={formData.pan_card} onChange={handleAddFormChange} required />
                              <InputField id="aadhar_card" label="Aadhar Card" name="aadhar_card" placeholder="1234 5678 9012" icon={Fingerprint} value={formData.aadhar_card} onChange={handleAddFormChange} required />
                              <InputField id="marksheets" label="MarkSheets" name="marksheets" type="text" icon={FileText} onChange={handleAddFormChange} value={formData.marksheets} required />
                              <InputField id="degree" label="Degree" name="degree" placeholder="B.Tech, M.Sc" icon={GraduationCap} value={formData.degree} onChange={handleAddFormChange} required />
                              <InputField id="city" label="City" name="city" placeholder="e.g. Mumbai" icon={Building2} value={formData.city} onChange={handleAddFormChange} required />
                              <InputField id="state" label="State" name="state" value={formData.state} onChange={handleAddFormChange} required>
                                <Select onValueChange={(value) => handleAddFormSelectChange("state", value)} name="state" value={formData.state} required>
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
                              <InputField id="salary" label="Salary" name="salary" placeholder="e.g. 50000" icon={Wallet} value={formData.salary} onChange={handleAddFormChange} required />
                          </div>
                        )}
                        {activeTab === 'account' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                              <InputField id="account_number" label="Account Number" name="account_number" placeholder="Your account number" icon={Wallet} value={formData.account_number} onChange={handleAddFormChange} required />
                              <InputField id="upi_id" label="Add UPI" name="upi_id" placeholder="yourname@upi" icon={Briefcase} value={formData.upi_id} onChange={handleAddFormChange} required />
                              <InputField id="bank_name" label="Bank Name" name="bank_name" placeholder="e.g. State Bank of India" icon={Landmark} value={formData.bank_name} onChange={handleAddFormChange} required />
                              <InputField id="ifsc_code" label="IFSC Code" name="ifsc_code" placeholder="SBIN0001234" icon={Hash} value={formData.ifsc_code} onChange={handleAddFormChange} required />
                              <InputField id="pincode" label="Pincode" name="pincode" placeholder="e.g. 110001" icon={MapPin} value={formData.pincode} onChange={handleAddFormChange} required />
                              <div className="md:col-span-2">
                                <InputField id="address" label="Address" name="address" value={formData.address} onChange={handleAddFormChange} required>
                                   <Textarea className="pl-10 pr-4 min-h-[80px]" placeholder="Enter full address" />
                                </InputField>
                              </div>

                           </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                <DialogFooter className="p-6 pt-4 border-t bg-muted/50 flex justify-between w-full flex-shrink-0">
                  {activeTab === 'personal' ? (
                      <Button type="button" variant="outline" onClick={handleCloseForm}>Cancel</Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={(e) => { e.preventDefault(); setActiveTab('personal'); }}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    )}
                    {activeTab === 'account' ? (
                      <Button type="submit">{formMode === 'add' ? 'Save Team Leader' : 'Save Changes'}</Button>
                    ) : (
                      <Button type="button" onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                </DialogFooter>
              </Tabs>
            </form>
        </DialogContent>
    </Dialog>
      
    </div>
  );
};










// {
//     "users": [
//         {
//             "id": 1,
//             "user": {
//                 "id": 2,
//                 "email": "indra720@gmail.com",
//                 "name": "Indrajeet",
//                 "mobile": "7896758585",
//                 "profile_image": null,
//                 "is_admin": true,
//                 "is_team_leader": false,
//                 "is_staff_new": false,
//                 "created_date": "2025-12-12T07:00:41.340327Z",
//                 "user_active": false
//             },
//             "admin_id": "c7c4e760-9804-464e-84b9-449907728a27",
//             "name": "Indrajeet",
//             "email": "indra720@gmail.com",
//             "mobile": "7896758585",
//             "address": "123,purani chungi,sodala,jaipur",
//             "city": "Jaipur",
//             "pincode": "567890",
//             "state": "Rajasthan",
//             "dob": "2006-03-12",
//             "pancard": null,
//             "aadharCard": null,
//             "account_number": "56789098765",
//             "upi_id": "indra@123",
//             "bank_name": "SBI",
//             "ifsc_code": "SBIN0043",
//             "salary": "78965",
//             "achived_slab": "0",
//             "created_date": "2025-12-12T07:00:42.580848Z"
//         }
//     ],
//     "total_upload_leads": 0,
//     "total_assign_leads": 0,
//     "total_interested": 0,
//     "total_not_interested": 0,
//     "total_other_location": 0,
//     "total_not_picked": 0,
//     "total_lost": 0,
//     "total_visits": 0,
//     "total_left_leads": 0,
//     "total_pending_followup": 0,
//     "total_today_followup": 0,
//     "total_tomorrow_followup": 0
// }















    
    



        
        
    










































    
    



        
        
    
        










