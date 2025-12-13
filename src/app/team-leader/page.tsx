"use client";
import React, { useState, useEffect, Suspense } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Users,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  PhoneOff,
  Calendar,
  Search,
  PlusCircle,
  LogIn,
  LogOut,
  UserCheck,
  FileUp,
  Percent,
  Pencil,
  Mail,
  Lock,
  Filter,
  MoreVertical,
  ArrowLeft,
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
  Phone,
  Minus,
  Plus,
  RotateCw,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
  teamLeader: "",
  admin: "",
};

const KpiCard = ({
  title,
  value,
  icon: Icon,
  color,
  link,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  link?: string;
}) => {
  const cardContent = (
    <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 h-full bg-card">
      <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-1">
        <div className={cn("text-primary", color)}>
          <Icon className="h-8 w-8" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-lg font-bold text-muted-foreground">{value}</p>
      </CardContent>
    </Card>
  );

  if (link) {
    return <Link href={link}>{cardContent}</Link>;
  }

  return cardContent;
};

const InputField = ({
  id,
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  required,
  children,
  disabled,
}: {
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
  const inputElement = children ? (
    React.cloneElement(children, {
      id,
      name,
      value,
      onChange,
      required,
      placeholder,
      disabled,
    })
  ) : (
    <Input
      type={type}
      id={id}
      name={name}
      value={value as string}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="pl-10 pr-4 h-11"
      disabled={disabled}
    />
  );

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        )}
        {inputElement}
      </div>
    </div>
  );
};

const TeamLeaderDashboardContent = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    setUsers([]);
    setDashboardData(null);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/staff-dashboard/`;
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setDashboardData(data);
      const formattedUsers = data.staff_list.map((staff: any) => ({
        ...staff,
        name: staff.username,
        createdDate: new Date(staff.created_date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-"),
      }));
      setUsers(formattedUsers);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
    fetchData(formattedStartDate, formattedEndDate);
  };

  const handleRefresh = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    fetchData();
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const filteredStaff = users.filter(
    (staff) =>
      (staff.name &&
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (staff.email &&
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.files ? target.files[0] : null,
      });
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
  };

  const handleOpenEditForm = (user: any) => {
    setEditingUser({ ...user, name: user.username });
    setActiveTab("personal");
    setIsEditFormOpen(true);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setFormData(initialFormData);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/add-staff/`,
        {
          method: "POST",
          credentials: "include",
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add staff.");
      }

      toast({
        title: "Staff Added!",
        description: `${formData.name} has been added successfully.`,
        className: "bg-green-500 text-white",
      });
      handleCloseAddForm();
      fetchData(); // Refresh the staff list
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.id) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      // Append all form fields to FormData
      for (const key in editingUser) {
        if (editingUser[key] !== null && editingUser[key] !== undefined) {
          data.append(key, editingUser[key]);
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/staff/edit/${editingUser.id}/`, {
        method: 'PATCH',
        credentials: 'include',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update staff.');
      }

      toast({
        title: "Staff Updated!",
        description: `${editingUser.name} has been updated successfully.`,
        className: 'bg-green-500 text-white'
      });
      setIsEditFormOpen(false);
      setEditingUser(null);
      fetchData(); // Refresh the list
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

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingUser({ ...editingUser, [name]: value });
  };

  const tabAnimation = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const kpiData = dashboardData?.counts
    ? [
      {
        title: "Total Staff",
        value: dashboardData.counts.total_staff,
        icon: Users,
        color: "text-blue-500",
        link: "/team-leader/productivity/staff",
      },
      {
        title: "Login Staff",
        value: dashboardData.counts.logged_in_count,
        icon: LogIn,
        color: "text-green-500",
      },
      {
        title: "Log-out",
        value: dashboardData.counts.logged_out_count,
        icon: LogOut,
        color: "text-red-500",
      },
      {
        title: "Associate staff",
        value: dashboardData.counts.associate_staff,
        icon: UserCheck,
        color: "text-purple-500",
      },
      {
        title: "Total Upload Lead",
        value: dashboardData.counts.total_upload_leads,
        icon: FileUp,
        color: "text-sky-500",
        link: "/team-leader/upload-leads",
      },
      {
        title: "Lost Leads",
        value: dashboardData.counts.lost_leads,
        icon: Percent,
        color: "text-gray-500",
        link: "/team-leader/reports/total-leads",
      },
      {
        title: "Total Lead",
        value: dashboardData.counts.total_leads,
        icon: Users,
        color: "text-rose-500",
        link: "/team-leader/reports/total-leads",
      },
      {
        title: "Total Visits",
        value: dashboardData.counts.visits_leads,
        icon: Eye,
        color: "text-green-500",
        link: "/team-leader/reports/visit",
      },
      {
        title: "Interested",
        value: dashboardData.counts.total_interested_leads,
        icon: CheckCircle,
        color: "text-teal-500",
        link: "/team-leader/reports/interested",
      },
      {
        title: "Not Interested",
        value: dashboardData.counts.total_not_interested_leads,
        icon: XCircle,
        color: "text-red-500",
        link: "/team-leader/reports/not-interested",
      },
      {
        title: "Other Location",
        value: dashboardData.counts.other_location_leads,
        icon: MapPin,
        color: "text-orange-500",
        link: "/team-leader/reports/other-location",
      },
      {
        title: "Not Picked",
        value: dashboardData.counts.not_picked_leads,
        icon: PhoneOff,
        color: "text-slate-500",
        link: "/team-leader/reports/not-picked",
      },
    ]
    : Array(12).fill({});

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Staff Users</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading || !dashboardData
          ? Array(12)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-2xl" />
            ))
          : kpiData.map((item) => <KpiCard key={item.title} {...item} />)}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">
            <div className="space-y-2 w-full md:w-auto lg:w-52">
              <Label htmlFor="startDate" className="text-sm font-medium text-muted-foreground">Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="space-y-2 w-full md:w-auto lg:w-52">
              <Label htmlFor="endDate" className="text-sm font-medium text-muted-foreground">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
            <div className="flex gap-2 w-full md:w-auto"> {/* New wrapper for buttons */}
              <Button
                onClick={handleFilter}
                className="flex items-center flex-1" // Use flex-1 to distribute space
                disabled={loading}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>{loading ? "Filtering..." : "Filter"}</span>
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center flex-1" // Use flex-1 to distribute space
                disabled={loading}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Staff List</CardTitle>
              <CardDescription className="hidden sm:block">
                View and manage staff users.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className=" sm:w-auto" onClick={handleOpenAddForm}>
                <PlusCircle className="h-4 w-4 mr-2 hidden sm:inline" />
                <span className="hidden sm:inline">Add new staff</span>
                <PlusCircle className="h-4 w-4 sm:hidden" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S.N.</TableHead> {/* Always visible as "S.N." */}
                  <TableHead>Name</TableHead> {/* Always visible */}
                  <TableHead className="hidden md:table-cell">Email id</TableHead> {/* Visible md and up */}
                  <TableHead className="hidden md:table-cell">Mobile No</TableHead> {/* Visible md and up */}
                  <TableHead className="hidden lg:table-cell">Created Date</TableHead> {/* Visible lg and up */}
                  <TableHead className="hidden lg:table-cell">Duration</TableHead> {/* Visible lg and up */}
                  <TableHead className="hidden lg:table-cell">Leads</TableHead> {/* Visible lg and up */}
                  <TableHead className="text-right">Edit</TableHead> {/* Always visible */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={10}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No staff found for the selected date range.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff, index) => (
                    <React.Fragment key={staff.id}>
                      <TableRow
                        data-state={
                          expandedRowId === staff.id ? "selected" : undefined
                        }
                      >
                        {/* First Cell: S.N. (md/mobile = icon, lg = index) */}
                        <TableCell className="w-12">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleRow(staff.id)}
                              className="lg:hidden"
                            >
                              {expandedRowId === staff.id ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="hidden lg:block">{index + 1}.</span> {/* Show S.N. number only on lg */}
                          </div>
                        </TableCell>

                        {/* Name Cell: Always visible */}
                        <TableCell className="font-medium">
                          {staff.name}
                        </TableCell>

                        {/* Email Cell: Visible md and up */}
                        <TableCell className="hidden md:table-cell">{staff.email}</TableCell>

                        {/* Mobile No Cell: Visible md and up */}
                        <TableCell className="hidden md:table-cell">{staff.mobile}</TableCell>

                        {/* Created Date Cell: Visible lg and up */}
                        <TableCell className="hidden lg:table-cell">{staff.createdDate}</TableCell>

                        {/* Duration Cell: Visible lg and up */}
                        <TableCell className="hidden lg:table-cell">{staff.duration}</TableCell>

                        {/* Leads Cell: Visible lg and up */}
                        <TableCell className="hidden lg:table-cell">
                          <Link href={`/team-leader/leads/staff?id=${staff.id}`}>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-green-600"
                            >
                              View
                            </Button>
                          </Link>
                        </TableCell>

                        {/* Edit Cell: Always visible */}
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEditForm(staff)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRowId === staff.id && (
                        <TableRow>
                          <TableCell colSpan={9} className="p-0"> {/* Adjusted colSpan to 9 */}
                            <div className="p-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold">{staff.name}</div>
                                    <div className="text-sm text-gray-500">{staff.status}</div>
                                  </div>
                                </div>
                                <div className="overflow-hidden">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                    {/* Add S.N. to expanded row here */}
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">S.N.:</span>
                                      <span className="text-sm">{index + 1}.</span>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Email:</span>
                                      <span className="text-sm">{staff.email || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Mobile:</span>
                                      <span className="text-sm">{staff.mobile || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Created Date:</span>
                                      <span className="text-sm">{staff.createdDate || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Duration:</span>
                                      <span className="text-sm">{staff.duration || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Status:</span>
                                      <span className="text-sm">{staff.status || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Leads:</span>
                                      <Link href={`/team-leader/leads/staff?id=${staff.id}`}>
                                        <Button variant="link" size="sm" className="p-0 h-auto text-green-600">View</Button>
                                      </Link>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Incentives:</span>
                                      <Link href="/team-leader/incentives">
                                        <Button variant="link" size="sm" className="p-0 h-auto text-yellow-600">Incentives</Button>
                                      </Link>
                                    </div>
                                    <div className="p-3 border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                      <span className="text-sm font-medium">Earn:</span>
                                      <Link href="/team-leader/earn">
                                        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-3xl w-[calc(100vw-2rem)] max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">Add New Staff</DialogTitle>
            <DialogDescription>
              Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleAddSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
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
                    {activeTab === "personal" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField
                          id="name"
                          label="Name"
                          name="name"
                          placeholder="John Doe"
                          icon={User}
                          value={formData.name}
                          onChange={handleAddFormChange}
                          required
                        />
                        <InputField
                          id="email"
                          label="E-Mail Address *"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          icon={Mail}
                          value={formData.email}
                          onChange={handleAddFormChange}
                          required
                        />
                        <InputField
                          id="password"
                          label="Password *"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          icon={Lock}
                          value={formData.password}
                          onChange={handleAddFormChange}
                          required
                        />

                        <InputField
                          id="dob"
                          label="Date of Birth"
                          name="dob"
                          type="date"
                          icon={Calendar}
                          value={formData.dob}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="pancard"
                          label="Pan Card"
                          name="pancard"
                          placeholder="ABCDE1234F"
                          icon={CreditCard}
                          value={formData.pancard}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="aadharCard"
                          label="Aadhar Card"
                          name="aadharCard"
                          placeholder="1234 5678 9012"
                          icon={Fingerprint}
                          value={formData.aadharCard}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="degree"
                          label="Degree"
                          name="degree"
                          placeholder="B.Tech, M.Sc"
                          icon={GraduationCap}
                          value={formData.degree}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="city"
                          label="City"
                          name="city"
                          placeholder="e.g. Mumbai"
                          icon={Building2}
                          value={formData.city}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="state"
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleAddFormChange}
                        >
                          <Select
                            onValueChange={(value) =>
                              handleAddFormSelectChange("state", value)
                            }
                            name="state"
                            defaultValue={formData.state}
                          >
                            <SelectTrigger className="pl-10 pr-4 h-11">
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rajasthan">
                                Rajasthan
                              </SelectItem>
                              <SelectItem value="Maharashtra">
                                Maharashtra
                              </SelectItem>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                            </SelectContent>
                          </Select>
                        </InputField>
                        <InputField
                          id="mobile"
                          label="Mobile"
                          name="mobile"
                          type="tel"
                          placeholder="9876543210"
                          icon={Phone}
                          value={formData.mobile}
                          onChange={handleAddFormChange}
                          required
                        />
                        <InputField
                          id="salary"
                          label="Salary"
                          name="salary"
                          placeholder="e.g. 50000"
                          icon={Wallet}
                          value={formData.salary}
                          onChange={handleAddFormChange}
                        />
                      </div>
                    )}
                    {activeTab === "account" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField
                          id="account_number"
                          label="Account Number"
                          name="account_number"
                          placeholder="Your account number"
                          icon={Wallet}
                          value={formData.account_number}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="upi_id"
                          label="Add UPI"
                          name="upi_id"
                          placeholder="yourname@upi"
                          icon={Briefcase}
                          value={formData.upi_id}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="bank_name"
                          label="Bank Name"
                          name="bank_name"
                          placeholder="e.g. State Bank of India"
                          icon={Landmark}
                          value={formData.bank_name}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="ifsc_code"
                          label="IFSC Code"
                          name="ifsc_code"
                          placeholder="SBIN0001234"
                          icon={Hash}
                          value={formData.ifsc_code}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="pincode"
                          label="Pincode"
                          name="pincode"
                          placeholder="e.g. 110001"
                          icon={MapPin}
                          value={formData.pincode}
                          onChange={handleAddFormChange}
                        />
                        <div className="md:col-span-2">
                          <InputField
                            id="address"
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleAddFormChange}
                          >
                            <Textarea
                              className="pl-10 pr-4 min-h-[80px]"
                              placeholder="Enter full address"
                            />
                          </InputField>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <DialogFooter className="p-6 pt-4 border-t bg-muted/50 gap-2 flex justify-between w-full flex-shrink-0">
                {activeTab === "personal" ? (
                  <div></div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("personal")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                {activeTab === "personal" ? (
                  <Button
                    type="button"
                    onClick={() => setActiveTab("account")}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Staff"}
                  </Button>
                )}
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {editingUser && (
        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DialogContent className="sm:max-w-3xl w-[calc(100vw-2rem)] max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
            <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
              <DialogTitle className="text-xl font-bold">
                Edit Staff
              </DialogTitle>
              <DialogDescription>
                Update the details for {editingUser.name}.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleEditSubmit}
              className="flex-1 flex flex-col min-h-0"
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="px-6 pt-4 flex-shrink-0">
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
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
                      {activeTab === "personal" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                          <InputField
                            id="name"
                            label="Name"
                            name="name"
                            placeholder="John Doe"
                            icon={User}
                            value={editingUser.name}
                            onChange={handleEditFormChange}
                            required
                          />
                          <InputField
                            id="email"
                            label="E-Mail Address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            value={editingUser.email}
                            onChange={handleEditFormChange}
                            required
                          />
                          <InputField
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Leave unchanged"
                            icon={Lock}
                            value={editingUser.password}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="teamLeader"
                            label="Team Leader"
                            name="teamLeader"
                            value={editingUser.teamLeader}
                            onChange={handleEditFormChange}
                          >
                            <Select
                              onValueChange={(value) =>
                                handleEditSelectChange("teamLeader", value)
                              }
                              name="teamLeader"
                              defaultValue={editingUser.teamLeader}
                            >
                              <SelectTrigger className="pl-10 pr-4 h-11">
                                <SelectValue placeholder="Select Team Leader" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="teamlead">
                                  teamlead
                                </SelectItem>
                                <SelectItem value="teamlead2">
                                  teamlead2
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </InputField>
                          <InputField
                            id="dob"
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            icon={Calendar}
                            value={editingUser.dob}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="pancard"
                            label="Pan Card"
                            name="pancard"
                            placeholder="ABCDE1234F"
                            icon={CreditCard}
                            value={editingUser.pancard}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="aadharCard"
                            label="Aadhar Card"
                            name="aadharCard"
                            placeholder="1234 5678 9012"
                            icon={Fingerprint}
                            value={editingUser.aadharCard}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="degree"
                            label="Degree"
                            name="degree"
                            placeholder="B.Tech, M.Sc"
                            icon={GraduationCap}
                            value={editingUser.degree}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="city"
                            label="City"
                            name="city"
                            placeholder="e.g. Mumbai"
                            icon={Building2}
                            value={editingUser.city}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="state"
                            label="State"
                            name="state"
                            value={editingUser.state}
                            onChange={handleEditFormChange}
                          >
                            <Select
                              onValueChange={(value) =>
                                handleEditSelectChange("state", value)
                              }
                              name="state"
                              defaultValue={editingUser.state}
                            >
                              <SelectTrigger className="pl-10 pr-4 h-11">
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Rajasthan">
                                  Rajasthan
                                </SelectItem>
                                <SelectItem value="Maharashtra">
                                  Maharashtra
                                </SelectItem>
                                <SelectItem value="Gujarat">Gujarat</SelectItem>
                              </SelectContent>
                            </Select>
                          </InputField>
                          <InputField
                            id="mobile"
                            label="Mobile"
                            name="mobile"
                            type="tel"
                            placeholder="9876543210"
                            icon={Phone}
                            value={editingUser.mobile}
                            onChange={handleEditFormChange}
                            required
                          />
                          <InputField
                            id="salary"
                            label="Salary"
                            name="salary"
                            placeholder="e.g. 50000"
                            icon={Wallet}
                            value={editingUser.salary}
                            onChange={handleEditFormChange}
                          />
                        </div>
                      )}
                      {activeTab === "account" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                          <InputField
                            id="account_number"
                            label="Account Number"
                            name="account_number"
                            placeholder="Your account number"
                            icon={Wallet}
                            value={editingUser.account_number}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="upi_id"
                            label="Add UPI"
                            name="upi_id"
                            placeholder="yourname@upi"
                            icon={Briefcase}
                            value={editingUser.upi_id}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="bank_name"
                            label="Bank Name"
                            name="bank_name"
                            placeholder="e.g. State Bank of India"
                            icon={Landmark}
                            value={editingUser.bank_name}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="ifsc_code"
                            label="IFSC Code"
                            name="ifsc_code"
                            placeholder="SBIN0001234"
                            icon={Hash}
                            value={editingUser.ifsc_code}
                            onChange={handleEditFormChange}
                          />
                          <InputField
                            id="pincode"
                            label="Pincode"
                            name="pincode"
                            placeholder="e.g. 110001"
                            icon={MapPin}
                            value={editingUser.pincode}
                            onChange={handleEditFormChange}
                          />
                          <div className="md:col-span-2">
                            <InputField
                              id="address"
                              label="Address"
                              name="address"
                              value={editingUser.address}
                              onChange={handleEditFormChange}
                            >
                              <Textarea
                                className="pl-10 pr-4 min-h-[80px]"
                                placeholder="Enter full address"
                              />
                            </InputField>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <DialogFooter className="p-6 pt-4 border-t bg-muted/50 flex justify-between w-full flex-shrink-0">
                  {activeTab === "personal" ? (
                    <div></div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("personal")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  {activeTab === "personal" ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab("account")}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </DialogFooter>
              </Tabs>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function TeamLeaderDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamLeaderDashboardContent />
    </Suspense>
  );
}
