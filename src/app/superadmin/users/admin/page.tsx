"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Minus,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DetailsDialog } from "@/components/details-dialog";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { toggleUserActiveStatus } from "@/lib/api";



const kpiData = [
  {
    title: "Pending FollowUps",
    valueKey: "total_pending_followup",
    icon: Clock,
    color: "text-yellow-500",
    link: "/superadmin/reports/pending-followups?source=admin",
  },
  {
    title: "Tomorrow FollowUps",
    valueKey: "total_tomorrow_followup",
    icon: Phone,
    color: "text-blue-500",
    link: "/superadmin/reports/tomorrow-followups?source=admin",
  },
  {
    title: "Today FollowUps",
    valueKey: "total_today_followup",
    icon: Phone,
    color: "text-purple-500",
    link: "/superadmin/reports/today-followups?source=admin",
  },
  {
    title: "Upload Leads",
    valueKey: "total_upload_leads",
    icon: FileUp,
    color: "text-sky-500",
    link: "/superadmin/upload-leads?source=admin",
  },
  {
    title: "Remaining Leads",
    valueKey: "total_left_leads",
    icon: Users,
    color: "text-indigo-500",
    link: "/superadmin/reports/remaining-leads?source=admin",
  },
  {
    title: "Total Lead",
    valueKey: "total_assign_leads",
    icon: Users,
    color: "text-rose-500",
    link: "/superadmin/reports/total-leads?source=admin",
  },
  {
    title: "Total Visits",
    valueKey: "total_visits",
    icon: Eye,
    color: "text-green-500",
    link: "/superadmin/reports/visit?source=admin",
  },
  {
    title: "Interested",
    valueKey: "total_interested",
    icon: Check,
    color: "text-teal-500",
    link: "/superadmin/reports/interested?source=admin",
  },
  {
    title: "Not Interested",
    valueKey: "total_not_interested",
    icon: XCircle,
    color: "text-red-500",
    link: "/superadmin/reports/not-interested?source=admin",
  },
  {
    title: "Other Location",
    valueKey: "total_other_location",
    icon: MapPin,
    color: "text-orange-500",
    link: "/superadmin/reports/other-location?source=admin",
  },
  {
    title: "Not Picked",
    valueKey: "total_not_picked",
    icon: Phone,
    color: "text-slate-500",
    link: "/superadmin/reports/not-picked?source=admin",
  },
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
  pan_card: "",
  aadhar_card: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  upi_id: "",
  salary: "",
  referralCode: "",
  marksheets: "",
  profile_image: "",
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

const ReviewDetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | undefined | null;
  icon?: React.ElementType;
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border-b border-border-200 last:border-b-0 hover:bg-accent/50 transition-colors duration-200">
    <p className="text-sm font-medium text-muted-foreground flex items-center sm:w-1/2">
      {Icon && <Icon className="h-4 w-4 mr-2 text-primary" />}
      {label}
    </p>
    <p className="font-semibold text-foreground sm:w-1/2 sm:text-right mt-1 sm:mt-0">
      {value || "N/A"}
    </p>
  </div>
);

export default function AdminManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<any>(initialFormData);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();

  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  //  admin card data
  const [cardData, setcardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const fetchcardData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setcardData(data);
      const fetchedUsers = data.users.map((user: any) => ({
        ...user,
        self_user: { user_active: user.user.is_admin }, // Assuming is_admin determines active status for admin users
      }));
      setUsers(fetchedUsers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcardData();
  }, []);

  useEffect(() => {
    if (isSubmitting) {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 200);
      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isSubmitting]);

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
    setFormMode("add");
    setFormData(initialFormData);
    setActiveTab("personal");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (user: any) => {
    setFormMode("edit");
    setFormData(user);
    setActiveTab("personal");
    setIsFormOpen(true);
  };

  const handleOpenDetailsView = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.mobile
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please fill all required fields in the Personal Details tab.",
        variant: "destructive",
      });
      setActiveTab("personal");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    let response; // Define response here to be accessible in catch block

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/admin/add/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        // Throw response to be caught and parsed in the catch block
        throw response;
      }

      setProgress(100);
      toast({
        title: "Admin Added!",
        description: `${formData.name} has been added successfully.`,
        className: "bg-green-500 text-white",
        duration: 3000,
      });

      setTimeout(() => {
        handleCloseForm();
        fetchcardData();
      }, 500);
    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          errorMessage = JSON.stringify(errorData);
        } catch (jsonError) {
          errorMessage = `HTTP error! status: ${error.status} ${error.statusText}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error Adding Admin",
        description: `Details: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "profile_image" && formData[key] instanceof File) {
        data.append(key, formData[key]);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/admin/edit/${formData.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: data,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      setProgress(100);
      toast({
        title: "Admin Updated!",
        description: `${formData.name} has been updated successfully.`,
        className: "bg-green-500 text-white",
        duration: 3000,
      });
      setTimeout(() => {
        handleCloseForm();
        fetchcardData();
      }, 500);
    } catch (error: any) {
      //console.error("Failed to update admin:", error);
      toast({
        title: "Error",
        description: `Failed to update admin: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  useEffect(() => {
    // setUsers();
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    // 1. Optimistic UI Update
    const originalUsers = [...users];
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, self_user: { ...u.self_user, user_active: isActive } }
          : u
      )
    );

    try {
      await toggleUserActiveStatus(id, "admin", isActive);

      // 3. Success: Show toast
      toast({
        title: "Status Updated",
        description: `User status changed to ${
          isActive ? "Active" : "Inactive"
        }.`,
        className: "bg-blue-500 text-white",
        duration: 3000,
      });

      // Optional: Refetch in the background to ensure consistency
      // fetchcardData();
    } catch (error: any) {
      // 2. Failure: Revert state and show error
      setUsers(originalUsers);
      //console.error("Failed to update user status:", error);
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
      (val) =>
        val &&
        val.toString().toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const KpiCard = ({
    title,
    value,
    icon,
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
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 h-28 py-2 w-50 flex-shrink-0 sm:h-auto sm:w-auto">
        <CardContent className="p-3 flex flex-col  items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`text-3xl ${color} mb-1`}
          >
            {React.createElement(icon, { className: "h-6 w-6" })}
          </motion.div>
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
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin List</h1>
      {!loading && cardData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <CardTitle>Admin Users</CardTitle>
            <CardDescription className="hidden sm:block">
              View and manage admin users.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Admins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 sm:flex-initial pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Filter</span>
            </Button>
            <Button className="flex items-center" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Add Admin</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Mobile</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created Date
                  </TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="sm:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => toggleRow(user.id)}
                            >
                              {expandedRowId === user.id ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="hidden sm:block">{index + 1}</div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {user.mobile}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.created_date
                            ? new Date(user.created_date).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={user.self_user?.user_active}
                            onCheckedChange={(checked) =>
                              handleToggle(user.id, checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
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
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleOpenDetailsView(user)}
                                    className="h-8 w-8 md:hidden"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">
                                      View Details
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedRowId === user.id && (
                        <TableRow className="sm:hidden">
                          <TableCell colSpan={5} className="p-0">
                            <div className="p-4 bg-gray-50">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        user.profile_image ||
                                        `https://avatar.vercel.sh/${user.name}.png`
                                      }
                                      alt={user.name}
                                    />
                                    <AvatarFallback>
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-lg font-bold">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 space-y-4">
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-3 text-gray-500" />
                                    <span className="text-sm">
                                      {user.mobile}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                                    <span className="text-sm">
                                      Joined on{" "}
                                      {user.created_date
                                        ? new Date(
                                            user.created_date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-600">
                                      Active
                                    </div>
                                    <Switch
                                      checked={user.self_user?.user_active}
                                      onCheckedChange={(checked) =>
                                        handleToggle(user.id, checked)
                                      }
                                    />
                                  </div>
                                  <Button
                                    size="icon"
                                    onClick={() => handleOpenEditForm(user)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>{" "}
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[98vw] sm:max-w-3xl max-h-[90vh] p-4 rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">
              {formMode === "add" ? "Add New Admin" : "Edit Admin"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "add"
                ? "Fill in the details below."
                : `Update the details for ${formData.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={formMode === "add" ? handleAddSubmit : handleEditSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-6 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2">
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="account">Account Details</TabsTrigger>
                </TabsList>
              </div>
              <div className="p-6 overflow-y-auto flex-1 relative custom-scrollbar">
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
                          label="E-Mail Address"
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
                          label="Password"
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
                          id="pan_card"
                          label="Pan Card"
                          name="pan_card"
                          placeholder="ABCDE1234F"
                          icon={CreditCard}
                          value={formData.pan_card}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="aadhar_card"
                          label="Aadhar Card"
                          name="aadhar_card"
                          placeholder="1234 5678 9012"
                          icon={Fingerprint}
                          value={formData.aadhar_card}
                          onChange={handleAddFormChange}
                        />
                        <InputField
                          id="marksheets"
                          label="MarkSheets"
                          name="marksheets"
                          placeholder="e.g. B.Tech Marksheet"
                          icon={FileText}
                          value={formData.marksheets}
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
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("account");
                    }}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : isSubmitting ? (
                  <div className="w-full">
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm mt-2 text-muted-foreground">
                      Submitting...
                    </p>
                  </div>
                ) : (
                  <Button type="submit">
                    {formMode === "add" ? "Save Admin" : "Save Changes"}
                  </Button>
                )}
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <DetailsDialog
          title="User Details"
          description={`Essential details for ${selectedUser.name}.`}
          details={[
            { label: "Name", value: selectedUser.name, icon: User },
            { label: "Mobile No", value: selectedUser.mobile, icon: Phone },
            { label: "Email", value: selectedUser.email, icon: Mail },
            {
              label: "Created Date",
              value: selectedUser.created_date
                ? new Date(selectedUser.created_date).toLocaleDateString()
                : "N/A",
              icon: Calendar,
            },
            {
              label: "Active Status",
              type: "switch",
              switchChecked: selectedUser.self_user?.user_active,
              switchDisabled: true,
              value: undefined,
            },
          ]}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}












        
            
            
        
