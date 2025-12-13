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
  DollarSign,
  Minus,
  Plus,
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
import { fetchSuperuserStaffLeadsByTag, toggleUserActiveStatus, fetchTeamLeaders, fetchAdminsForSelection } from "@/lib/api";




const kpiData = [
  { title: "Total Leads", valueKey: "total_leads", icon: Users, color: "text-rose-500", link: "/superadmin/reports/total-leads?source=staff" },
  { title: "Total Visit", valueKey: "total_visits_leads", icon: Eye, color: "text-green-500", link: "/superadmin/reports/visit?source=staff" },
  { title: "Interested", valueKey: "total_interested_leads", icon: Check, color: "text-teal-500", link: "/superadmin/reports/interested?source=staff" },
  { title: "Not Interested", valueKey: "total_not_interested_leads", icon: XCircle, color: "text-red-500", link: "/superadmin/reports/not-interested?source=staff" },
  { title: "Other Location", valueKey: "total_other_location_leads", icon: MapPin, color: "text-orange-500", link: "/superadmin/reports/other-location?source=staff" },
  { title: "Not Picked", valueKey: "total_not_picked_leads", icon: Phone, color: "text-slate-500", link: "/superadmin/reports/not-picked?source=staff" },
  { title: "Total Earning", valueKey: "total_earning", icon: DollarSign, color: "text-yellow-500", link: "/superadmin/reports/total-earning?source=staff" },
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
  team_leader: "",
  admin: "",
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



export default function StaffManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>(initialFormData);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const { toast } = useToast();
  const [admins, setAdmins] = useState<any[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const [cardData, setcardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/staff-report/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setcardData(data.lead_counts);

      const staffUsers = data.staff_list.map((staff: any) => ({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        mobile: staff.mobile,
        staff_id: staff.staff_id,
        teamLeader: "N/A",
        created_date: new Date().toISOString(),
        self_user: { user_active: true },
      }));

      setUsers(staffUsers);
    } catch (err: any) {
      setError(err.message);
      setUsers([]);
      setcardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchPageData();
      try {
        const [adminsData, teamLeadersData] = await Promise.all([
          fetchAdminsForSelection(),
          fetchTeamLeaders(),
        ]);
        setAdmins(adminsData);
        setTeamLeaders(teamLeadersData);
      } catch (error) {
        setAdmins([]);
        setTeamLeaders([]);
        toast({
          title: "Warning",
          description: "Could not load admin and team leader data.",
          variant: "destructive",
        });
      }
    };
    fetchInitialData();
  }, [toast]);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.files ? target.files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAddForm = () => {
    setFormMode('add');
    setFormData(initialFormData);
    setActiveTab("personal");
    setIsFormOpen(true);
  }

  const handleOpenEditForm = async (user: any) => {
    setFormMode('edit');
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/edit/${user.id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const staffData = await response.json();
      
      setFormData({
        id: staffData.id,
        name: staffData.name || '',
        email: staffData.email || '',
        mobile: staffData.mobile || '',
        dob: staffData.dob || '',
        address: staffData.address || '',
        city: staffData.city || '',
        state: staffData.state || '',
        pincode: staffData.pincode || '',
        degree: staffData.degree || '',
        pancard: staffData.pancard || '',
        aadharCard: staffData.aadharCard || '',
        bank_name: staffData.bank_name || '',
        account_number: staffData.account_number || '',
        ifsc_code: staffData.ifsc_code || '',
        upi_id: staffData.upi_id || '',
        salary: staffData.salary || '',
        team_leader: staffData.team_leader || '',
        admin: staffData.admin || '',
        password: '', // Keep password blank for edit
      });
      setActiveTab("personal");
      setIsFormOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch staff data for editing.",
        variant: "destructive",
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email || !formData.password || !formData.teamLeader || !formData.admin) {
      toast({ title: "Validation Error", description: "Email, Password, Team Leader, and Admin are required fields.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
        if (key === "team_leader") {
          data.append("team_leader", parseInt(formData.team_leader));
        }
        else if (key === "admin") {
          data.append("admin", parseInt(formData.admin));
        }
        else {
          data.append(key, formData[key]);
        }
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/add/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Failed to add staff.";
        if (errorData) {
          const errors = [];
          if (errorData.team_leader) errors.push(`Team Leader: ${errorData.team_leader.join(', ')}`);
          if (errorData.email) errors.push(`Email: ${errorData.email.join(', ')}`);
          if (errorData.password) errors.push(`Password: ${errorData.password.join(', ')}`);
          if (errorData.admin) errors.push(`Admin: ${errorData.admin.join(', ')}`);
          if (errors.length > 0) errorMessage = errors.join('\n');
        }
        throw new Error(errorMessage);
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      toast({ title: "Staff Added!", description: `Staff has been added successfully.`, className: "bg-green-500 text-white" });
      handleCloseForm();
      fetchPageData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add staff.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const data = new FormData();
    const submissionData = {...formData};

    if(!submissionData.password) {
        delete submissionData.password;
    }
    
    Object.keys(submissionData).forEach(key => {
        if (submissionData[key] !== null && submissionData[key] !== undefined && submissionData[key] !== "") {
             if (key === 'team_leader') {
                data.append('team_leader', parseInt(submissionData[key]));
            } else if (key === 'admin') {
                data.append('admin', parseInt(submissionData[key]));
            } else {
                 data.append(key, submissionData[key]);
            }
        }
    });

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/edit/${formData.id}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`,
            },
            body: data,
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = "Failed to update staff.";
            if (errorData) {
                const errors: string[] = [];
                Object.keys(errorData).forEach(key => {
                    if (Array.isArray(errorData[key])) {
                        errors.push(`${key}: ${errorData[key].join(', ')}`);
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
        toast({ title: "Staff Updated!", description: `${formData.name} has been updated successfully.`, className: 'bg-green-500 text-white' });
        handleCloseForm();
        fetchPageData();
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to update staff.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };


  useEffect(() => {
    // side effects
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    const originalUsers = [...users];
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, self_user: { ...u.self_user, user_active: isActive } }
          : u
      )
    );

    try {
      await toggleUserActiveStatus(id, "staff", isActive);
      toast({
        title: "Status Updated",
        description: `User status changed to ${isActive ? "Active" : "Inactive"}.`,
        className: "bg-blue-500 text-white",
        duration: 3000,
      });
    } catch (error: any) {
      setUsers(originalUsers);
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    Object.values(u).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const KpiCard = ({ title, value, icon, color, link }: { title: string, value: string | number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-3 flex flex-col items-center justify-center text-center">
          <div className={`text-3xl ${color} mb-1`}>
            {React.createElement(icon, { className: "h-6 w-6" })}
          </div>
          <div className="font-semibold text-foreground text-sm">{title}</div>
          <div className="text-muted-foreground text-xs mt-1">{value}</div>
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
      <h1 className="text-2xl font-bold tracking-tight">Staff Users</h1>
      {!loading && cardData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        <p className="text-center text-muted-foreground">
          Loading dashboard...
        </p>
      )}

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Staff List</CardTitle>
            <CardDescription className="hidden sm:block">View and manage staff users.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 sm:flex-initial sm:max-w-xs pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button size="icon" className="sm:hidden" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add Staff</span>
            </Button>
            <Button className="hidden sm:flex" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add new staff
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
                  <TableHead className="hidden md:table-cell">Staff ID</TableHead>
                  <TableHead className="hidden md:table-cell">Mobile No</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Leads</TableHead>
                  <TableHead className="hidden lg:table-cell">Active/Non-Active</TableHead>
                  <TableHead className="hidden lg:table-cell">Earn</TableHead>
                  <TableHead className="hidden lg:table-cell">Incentives</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <TableRow data-state={expandedRowId === user.id && 'selected'}>
                      <TableCell>
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
                        <div className="hidden lg:block">{index + 1}.</div>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.staff_id}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
                      <TableCell className="hidden lg:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/staff/leads`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-green-600">View</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Switch
                          checked={user.self_user?.user_active}
                          onCheckedChange={(checked) => handleToggle(user.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/staff/earn`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/staff/incentives`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-yellow-600">Incentives</Button>
                        </Link>
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
                              <TooltipContent><p>Edit</p></TooltipContent>
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
                              <TooltipContent><p>Edit</p></TooltipContent>
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
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                  <div className="text-lg font-bold">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.self_user?.user_active ? 'Active' : 'Inactive'}</div>
                                </div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Staff ID:</span>
                                    <span className="text-sm">{user.staff_id || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Mobile:</span>
                                    <span className="text-sm">{user.mobile || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Email:</span>
                                    <span className="text-sm">{user.email || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Leads:</span>
                                    <Link href={`/superadmin/users/staff/leads`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-green-600">View</Button>
                                    </Link>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Active Status:</span>
                                    <Switch
                                      checked={user.self_user?.user_active}
                                      onCheckedChange={(checked) => handleToggle(user.id, checked)}
                                    />
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Earn:</span>
                                    <Link href={`/superadmin/users/staff/earn`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                                    </Link>
                                  </div>
                                  <div className="p-3 flex items-center justify-between">
                                    <span className="text-sm font-medium">Incentives:</span>
                                    <Link href={`/superadmin/users/staff/incentives`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-yellow-600">Incentives</Button>
                                    </Link>
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
                    <TableCell colSpan={10} className="h-24 text-center">
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
        <DialogContent className="sm:max-w-3xl w-[90vw] max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">{formMode === 'add' ? 'Add New Staff' : 'Edit Staff'}</DialogTitle>
            <DialogDescription>
              {formMode === 'add' ? 'Fill in the details below.' : `Update details for ${formData.name}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formMode === 'add' ? handleAddSubmit : handleEditSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4 flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <Label className="text-sm font-medium text-muted-foreground">Admin *</Label>
                <Select onValueChange={(value) => handleSelectChange("admin", value)} name="admin" value={formData.admin?.toString()} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={String(admin.id)}>
                        {admin.name || admin.user?.first_name || admin.user?.email || `Admin ${admin.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label className="text-sm font-medium text-muted-foreground">Team Leader *</Label>
                <Select onValueChange={(value) => handleSelectChange("team_leader", value)} name="team_leader" value={formData.team_leader?.toString()} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Team-Leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamLeaders.map((leader) => (
                      <SelectItem key={leader.id} value={String(leader.id)}>
                        {leader.name || leader.user?.first_name || leader.user?.email || `Team Leader ${leader.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <div className="px-6 pt-4 flex-shrink-0">
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
                        <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleFormChange} />
                        <InputField id="email" label="E-Mail Address *" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleFormChange} required />
                        <InputField id="password" label="Password *" name="password" type="password" placeholder={formMode === 'edit' ? 'Leave blank to keep current password' : '••••••••'} icon={Lock} value={formData.password} onChange={handleFormChange} required={formMode === 'add'} />
                        <InputField id="dob" label="Date of Birth" name="dob" type="date" icon={Calendar} value={formData.dob} onChange={handleFormChange} />
                        <InputField id="pancard" label="Pan Card" name="pancard" placeholder="ABCDE1234F" icon={CreditCard} value={formData.pancard} onChange={handleFormChange} />
                        <InputField id="aadharCard" label="Aadhar Card" name="aadharCard" placeholder="1234 5678 9012" icon={Fingerprint} value={formData.aadharCard} onChange={handleFormChange} />
                        <InputField id="degree" label="Degree" name="degree" placeholder="B.Tech, M.Sc" icon={GraduationCap} value={formData.degree} onChange={handleFormChange} />
                        <InputField id="city" label="City" name="city" placeholder="e.g. Mumbai" icon={Building2} value={formData.city} onChange={handleFormChange} />
                        <InputField id="state" label="State" name="state" value={formData.state} onChange={handleFormChange}>
                          <Select onValueChange={(value) => handleSelectChange("state", value)} name="state" value={formData.state}>
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
                        <InputField id="mobile" label="Mobile" name="mobile" type="tel" placeholder="9876543210" icon={Phone} value={formData.mobile} onChange={handleFormChange} />
                        <InputField id="salary" label="Salary" name="salary" placeholder="e.g. 50000" icon={Wallet} value={formData.salary} onChange={handleFormChange} />
                      </div>
                    )}
                    {activeTab === 'account' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField id="account_number" label="Account Number" name="account_number" placeholder="Your account number" icon={Wallet} value={formData.account_number} onChange={handleFormChange} />
                        <InputField id="upi_id" label="Add UPI" name="upi_id" placeholder="yourname@upi" icon={Briefcase} value={formData.upi_id} onChange={handleFormChange} />
                        <InputField id="bank_name" label="Bank Name" name="bank_name" placeholder="e.g. State Bank of India" icon={Landmark} value={formData.bank_name} onChange={handleFormChange} />
                        <InputField id="ifsc_code" label="IFSC Code" name="ifsc_code" placeholder="SBIN0001234" icon={Hash} value={formData.ifsc_code} onChange={handleFormChange} />
                        <InputField id="pincode" label="Pincode" name="pincode" placeholder="e.g. 110001" icon={MapPin} value={formData.pincode} onChange={handleFormChange} />
                        <div className="md:col-span-2">
                          <InputField id="address" label="Address" name="address" value={formData.address} onChange={handleFormChange}>
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
                  <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                {activeTab === 'personal' ? (
                  <Button type="button" onClick={() => setActiveTab('account')}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : (formMode === 'add' ? "Save Staff" : "Save Changes")}
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






        

        
        
           
        









//{
//     "counts": {
//         "pending_followups": 0,
//         "tomorrow_followups": 0,
//         "today_followups": 0,
//         "total_leads": 0,
//         "total_visit": 0,
//         "interested": 0,
//         "not_interested": 0,
//         "other_location": 0,
//         "not_picked": 0,
//         "total_staff": 0,
//         "active_staff": 0,
//         "total_lost": 0
//     },
//     "count": 1,
//     "next": null,
//     "previous": null,
//     "results": [
//         {
//             "id": 1,
//             "user_id": 3,
//             "admin": {
//                 "id": 1,
//                 "admin_id": "c7c4e760-9804-464e-84b9-449907728a27",
//                 "name": "Indrajeet",
//                 "email": "indra720@gmail.com",
//                 "mobile": "7896758585",
//                 "address": "123,purani chungi,sodala,jaipur",
//                 "city": "Jaipur",
//                 "pincode": "567890",
//                 "state": "Rajasthan",
//                 "dob": "2006-03-12",
//                 "pancard": null,
//                 "aadharCard": null,
//                 "marksheet": null,
//                 "degree": "BCA",
//                 "account_number": "56789098765",
//                 "upi_id": "indra@123",
//                 "bank_name": "SBI",
//                 "ifsc_code": "SBIN0043",
//                 "salary": "78965",
//                 "achived_slab": "0",
//                 "created_date": "2025-12-12T12:30:42.580848+05:30",
//                 "updated_date": "2025-12-12T12:30:42.580895+05:30",
//                 "user": 1,
//                 "self_user": 2
//             },
//             "user": {
//                 "id": 3,
//                 "password": "pbkdf2_sha256$1000000$ZFPPSnmqkV6yRswkDTVxHZ$ejRzTgfqnyFP1s7eH9hR7aUaJr4MEOluM+IkKn1hFss=",
//                 "last_login": null,
//                 "is_superuser": false,
//                 "username": "promod720@gmail.com",
//                 "first_name": "",
//                 "last_name": "",
//                 "is_staff": false,
//                 "date_joined": "2025-12-12T13:01:45+05:30",
//                 "name": "Promod Saini",
//                 "mobile": "9876543236",
//                 "email": "promod720@gmail.com",
//                 "is_admin": false,
//                 "is_team_leader": true,
//                 "is_staff_new": false,
//                 "is_freelancer": false,
//                 "is_it_staff": false,
//                 "is_super_user": false,
//                 "role": "team_leader",
//                 "login_time": "2025-12-12T13:01:45+05:30",
//                 "logout_time": null,
//                 "profile_image": null,
//                 "created_date": "2025-12-12T13:01:46.585309+05:30",
//                 "updated_date": "2025-12-12T13:33:12.844932+05:30",
//                 "user_active": true,
//                 "is_user_login": true,
//                 "groups": [],
//                 "user_permissions": []
//             },
//             "admin_name": "Indrajeet",
//             "name": "Promod Saini",
//             "email": "promod720@gmail.com",
//             "mobile": "9876543236",
//             "address": "140,santosh nagar,jaipur",
//             "city": "JAIPUR",
//             "state": "Rajasthan",
//             "pincode": "789650",
//             "dob": "2003-03-12",
//             "pancard": null,
//             "aadharCard": null,
//             "account_number": "7867564864",
//             "upi_id": "pro@123",
//             "bank_name": "SBI",
//             "ifsc_code": "SBIN0043",
//             "salary": "78906",
//             "achived_slab": "0",
//             "profile_image": null
//         }
//     ]
// }









// class SuperUserTeamLeaderDashboardAPIView(APIView):
//     """
//     API for Superuser's 'Team Leader List' dashboard (add_team_leader_admin_side).
//     Provides all card counts (at the top) and the paginated list of Team Leaders.
//     """
//     permission_classes = [IsAuthenticated, CustomIsSuperuser]
//     pagination_class = StandardResultsSetPagination

//     def get(self, request, format=None):
//         paginator = self.pagination_class()
        
//         # ---  Get Team Leader List (Paginated) ---
//         team_leaders_qs = Team_Leader.objects.all().order_by('name')
        
//         page = paginator.paginate_queryset(team_leaders_qs, request, view=self)
//         team_leaders_serializer = ProductivityTeamLeaderSerializer(page, many=True)

//         # ---  Calculate All Card Counts ---
//         active_staff_count = User.objects.filter(is_staff_new=True, is_user_login=True).count()
//         total_staff_count = User.objects.filter(is_staff_new=True).count()
//         total_leads = LeadUser.objects.filter(status="Leads").count()
//         total_interested = LeadUser.objects.filter(status="Intrested").count()
//         total_not_interested = LeadUser.objects.filter(status="Not Interested").count()
//         total_other_location = LeadUser.objects.filter(status="Other Location").count()
//         total_not_picked = LeadUser.objects.filter(status="Not Picked").count()
//         total_lost = LeadUser.objects.filter(status="Lost").count()
//         total_visits = LeadUser.objects.filter(status="Visit").count()

//         # ---  Calculate Followup Counts ---
//         today = timezone.now().date()
//         tomorrow = today + timedelta(days=1)
        
//         pending_followups = LeadUser.objects.filter(
//             Q(status='Intrested') & Q(follow_up_date__isnull=False)
//         ).count()
//         today_followups = LeadUser.objects.filter(
//             Q(status='Intrested') & Q(follow_up_date=today)
//         ).count()
//         tomorrow_followups = LeadUser.objects.filter(
//             Q(status='Intrested') & Q(follow_up_date=tomorrow)
//         ).count()
        
//         counts_data = {
//             'pending_followups': pending_followups,
//             'tomorrow_followups': tomorrow_followups,
//             'today_followups': today_followups,
//             'total_leads': total_leads,
//             'total_visit': total_visits,
//             'interested': total_interested,
//             'not_interested': total_not_interested,
//             'other_location': total_other_location,
//             'not_picked': total_not_picked,
//             'total_staff': total_staff_count,
//             'active_staff': active_staff_count,
//             'total_lost': total_lost, 
//         }

//         paginated_response = paginator.get_paginated_response(team_leaders_serializer.data)
        
//         final_data = {
//             "counts": counts_data,
//             "count": paginated_response.data['count'],
//             "next": paginated_response.data['next'],
//             "previous": paginated_response.data['previous'],
//             "results": paginated_response.data['results']
//         }
        
//         return Response(final_data, status=status.HTTP_200_OK)












// class StaffAddAPIView(APIView):
//     """
//     API endpoint for creating a new Staff user and their associated profile.
//     (Can be executed by Team Leader, Admin, or Superuser).
//     [FIXED] UnboundLocalError has been resolved.
//     """
    
//     permission_classes = [CustomIsSuperuser]
//     parser_classes = (MultiPartParser, FormParser)
//     def post(self, request, *args, **kwargs):
//         serializer = StaffCreateSerializer(data=request.data, context={'request': request})
        
//         if not serializer.is_valid():
//             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
//         try:
//             staff_instance = serializer.save()
//         except Exception as e:
//             return Response({"error": f"Failed to save serializer: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

//         try:
//             read_serializer = StaffProfileSerializer(staff_instance, context={'request': request})
//             return Response(read_serializer.data, status=status.HTTP_201_CREATED)
//         except Exception as e:
//             return Response(
//                 {"message": f"Staff created (ID: {staff_instance.id}) but response serialization failed: {e}"}, 
//                 status=status.HTTP_201_CREATED
//             )

        
        
           
        




// class StaffProfileSerializer(serializers.ModelSerializer):
//     user_id = serializers.IntegerField(source='user.id', read_only=True)

//     class Meta:
//         model = Staff
//         fields = [

//             'id' ,'user_id', 'name', 'email', 'mobile', 'address', 'city', 'pincode', 'state',
//             'dob', 'pancard', 'aadharCard', 'marksheet', 'degree', 'account_number',
//             'upi_id', 'bank_name', 'ifsc_code', 'salary', 'achived_slab',
//             'referral_code', 'join_referral', 'created_date', 'updated_date'
//         ]
//         read_only_fields = ['referral_code', 'created_date', 'updated_date']












// Bhai team_leader missing error 100% confirm two jagah se aa sakti hai:

// ✔ (1) Tum wrong field-name bhej rahe ho

// Backend chahta hai:

// ✅ team_leader

// NOT

// ❌ team_leader_id

// Tum apne code me POST kar rahe ho:

// data.append("team_leader_id", parseInt(formData.team_leader_id))


// 🔥 Backend isko reject karega
// Isliye error:
// “team_leader field is required”

// ✔ (2) Tum Select ke value ko wrong naam se store kar rahe ho

// Tum select me likh rahe ho:

// onValueChange={(value) => handleSelectChange("team_leader_id", value)}


// But backend chahta hai:

// team_leader

// 📌 YEH DONO FIX KARNE HONGE
// 🛠 FINAL CORRECT FIX
// ⭐ Step 1 — Change Select field name
// ❌ Wrong
// <Select onValueChange={(value) => handleSelectChange("team_leader_id", value)} ... />

// ✅ Correct
// <Select onValueChange={(value) => handleSelectChange("team_leader", value)} ... />

// ⭐ Step 2 — In FormData, send correct key
// ❌ Wrong
// data.append("team_leader_id", formData.team_leader_id);

// ✅ Correct
// data.append("team_leader", formData.team_leader);

// ⭐ Step 3 — FormData Setup Fully Corrected

// Replace your whole FormData code with this:

// const data = new FormData();

// Object.keys(formData).forEach((key) => {
//   if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
//     if (key === "team_leader") {
//       data.append("team_leader", parseInt(formData.team_leader));
//     } 
//     else if (key === "admin") {
//       data.append("admin", parseInt(formData.admin));
//     } 
//     else {
//       data.append(key, formData[key]);
//     }
//   }
// });