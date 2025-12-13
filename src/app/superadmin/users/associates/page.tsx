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
import {
  Pencil,
  PlusCircle,
  Users,  // Changed from 'users' to 'Users'
  Check,
  Phone,
  MapPin,
  Eye,
  Mail,
  Lock,
  MoreVertical,
  XCircle,
  Briefcase,
  User,
  DollarSign,
  Minus,
  Plus,
} from 'lucide-react';
import { toast, useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { toggleUserActiveStatus, fetchTeamLeaders } from "@/lib/api";


const kpiData = [
    { title: "Total Visit", valueKey: "total_visit", icon: Eye, color: "text-blue-500", link: "/superadmin/reports/visit?source=associate" },
    { title: "Interested", valueKey: "interested", icon: Check, color: "text-green-500", link: "/superadmin/reports/interested?source=associate" },
    { title: "Not Interested", valueKey: "not_interested", icon: XCircle, color: "text-red-500", link: "/superadmin/reports/not-interested?source=associate" },
    { title: "Other Location", valueKey: "other_location", icon: MapPin, color: "text-yellow-500", link: "/superadmin/reports/other-location?source=associate" },
    { title: "Not Picked", valueKey: "not_picked", icon: Phone, color: "text-purple-500", link: "/superadmin/reports/not-picked?source=associate" },
    { title: "Total Earning", valueKey: "total_earning", icon: DollarSign, color: "text-emerald-500", link: "/superadmin/reports/total-earning?source=associate" },
];


const initialFormData = {
    id: null,
    name: "",
    email: "",
    password: "",
    mobile: "",
    teamLeader: "",
};

const UserDetailsDialog = ({ user, open, onOpenChange, getTeamLeaderName }: { user: any, open: boolean, onOpenChange: (open: boolean) => void, getTeamLeaderName: (id: number) => string }) => {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card shadow-2xl rounded-2xl p-0">
                <DialogHeader className="p-6 pb-4 text-center">
                    <DialogTitle className="text-xl">Associate Full Details</DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-0 grid grid-cols-1 gap-5 max-h-[60vh] overflow-y-auto">
                    <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium text-foreground">{user.name || 'N/A'}</p></div>
                    <div><p className="text-sm text-muted-foreground">Mobile No</p><p className="font-medium text-foreground">{user.mobile || 'N/A'}</p></div>
                    <div><p className="text-sm text-muted-foreground">Team Leader</p><p className="font-medium text-foreground">{getTeamLeaderName(user.team_leader)}</p></div>
                    <div><p className="text-sm text-muted-foreground">Created Date</p><p className="font-medium text-foreground">{user.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</p></div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Active Status</p>
                      <Switch
                        id={`active-status-modal-${user.id}`}
                        checked={user.self_user?.user_active}
                        disabled
                      />
                    </div>
                </div>
                <DialogFooter className="p-4 border-t bg-muted/50 rounded-b-2xl flex-row justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full text-foreground hover:bg-primary hover:text-primary-foreground">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AssociatesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);


  const [cardData, setcardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { toast } = useToast();

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }
      try {
        const [associatesData, teamLeadersData] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/associates/dashboard/`,
            {
              headers: {
                Authorization: ` Token ${token}`,
              },
            }
          ).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
          fetchTeamLeaders()
        ]);

        setcardData({
            total_visit: associatesData.total_visits_leads,
            interested: associatesData.total_interested_leads,
            not_interested: associatesData.total_not_interested_leads,
            other_location: associatesData.total_other_location_leads,
            not_picked: associatesData.total_not_picked_leads,
            total_earning: associatesData.total_earning,
        });
        
        const usersWithSelfUser = associatesData.my_staff?.map((user: any) => ({ ...user, self_user: user.self_user || { user_active: user.user_active !== false } })) || []; 
        setUsers(usersWithSelfUser);
        setTeamLeaders(teamLeadersData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTeamLeaderName = (id: number) => {
    const leader = teamLeaders.find(tl => tl.id === id);
    return leader ? leader.name : 'N/A';
  };


  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleAddFormSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleOpenAddForm = () => {
    setFormData(initialFormData);
    setIsAddFormOpen(true);
  }

  const handleOpenEditForm = async (user: any) => {
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
        
        headers: {
          
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const associateData = await response.json();
      
      setEditingUser({
        id: associateData.id,
        name: associateData.name || "",
        email: associateData.email || "",
        mobile: associateData.mobile || "",
        teamLeader: associateData.team_leader || "",
      });
      
      setIsEditFormOpen(true);
    } catch (error: any) {
      //console.error("Error fetching associate data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch associate data for editing.",
        variant: "destructive",
      });
    }
  }
  
  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setFormData(initialFormData);
  }
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {...formData, id: Date.now(), created_date: new Date().toISOString(), self_user: { user_active: true }};
    setUsers([...users, newUser]);
    toast({
        title: "Associate Added!",
        description: `${formData.name} has been added successfully.`,
        className: 'bg-green-500 text-white'
    });
    handleCloseAddForm();
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
        description: "Authentication token not found.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    if (editingUser.name) data.append("name", editingUser.name);
    if (editingUser.email) data.append("email", editingUser.email);
    if (editingUser.mobile) data.append("mobile", editingUser.mobile);
    if (editingUser.teamLeader) data.append("team_leader", editingUser.teamLeader);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/edit/${editingUser.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to update associate.");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u: any) => u.id === editingUser.id ? { ...u, ...updatedUser } : u));
      
      toast({
        title: "Associate Updated!",
        description: `${editingUser.name} has been updated successfully.`,
        className: "bg-green-500 text-white"
      });
      
      setIsEditFormOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update associate.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    // 1. Optimistic UI Update
    const originalUsers = [...users];
    setUsers(
      users.map((u: any) =>
        u.id === id
          ? { ...u, self_user: { ...u.self_user, user_active: isActive } }
          : u
      )
    );

    try {
      await toggleUserActiveStatus(id, "staff", isActive);

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
      // fetchData(); // Use fetchData for this component
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

  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const KpiCard = ({ title, value, icon, color, link }: { title: string, value: string | number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
       <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="py-3 flex flex-col items-center justify-center text-center">
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

  return (
    <div className="space-y-6 flex flex-col h-full">
        <h1 className="text-2xl font-bold tracking-tight">Associate users</h1>
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

      <Card className="shadow-lg rounded-2xl flex-1 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>Associate List</CardTitle>
                <CardDescription className="hidden sm:block">View and manage associate users.</CardDescription>
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
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <div className="overflow-x-auto h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Team Lead</TableHead>
                  <TableHead className="hidden md:table-cell">Mobile No</TableHead>
                  <TableHead className="hidden lg:table-cell">Created Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Leads</TableHead>
                  <TableHead className="hidden lg:table-cell">Active/Non-Active</TableHead>
                  <TableHead className="hidden lg:table-cell">Earn</TableHead>
                  <TableHead className="hidden lg:table-cell">Add Sell</TableHead>
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
                        <div className="hidden lg:block">{index + 1}</div>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{getTeamLeaderName(user.team_leader)}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/associates/view?associate_id=${user.id}`}>
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
                        <Link href={`/superadmin/users/associates/earn?associate_id=${user.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/associates/add-sell?associate_id=${user.id}`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-purple-600">Add Sell</Button>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => handleOpenEditForm(user)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                                    <span className="text-sm font-medium">Team Lead:</span>
                                    <span className="text-sm">{getTeamLeaderName(user.team_leader)}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Mobile:</span>
                                    <span className="text-sm">{user.mobile || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Created Date:</span>
                                    <span className="text-sm">{user.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Leads:</span>
                                    <Link href={`/superadmin/users/associates/view?associate_id=${user.id}`}>
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
                                    <Link href={`/superadmin/users/associates/earn?associate_id=${user.id}`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                                    </Link>
                                  </div>
                                  <div className="p-3 flex items-center justify-between">
                                    <span className="text-sm font-medium">Add Sell:</span>
                                    <Link href={`/superadmin/users/associates/add-sell?associate_id=${user.id}`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-purple-600">Add Sell</Button>
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

    <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add New Associate</DialogTitle>
                <DialogDescription>Fill in the details for the new associate.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="add-name">Name</Label>
                    <Input id="add-name" name="name" value={formData.name} onChange={handleAddFormChange} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="add-email">Email</Label>
                    <Input id="add-email" name="email" type="email" value={formData.email} onChange={handleAddFormChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="add-password">Password</Label>
                    <Input id="add-password" name="password" type="password" value={formData.password} onChange={handleAddFormChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="add-mobile">Mobile</Label>
                    <Input id="add-mobile" name="mobile" value={formData.mobile} onChange={handleAddFormChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="add-teamLeader">Team Leader</Label>
                    <Select onValueChange={(value) => handleAddFormSelectChange("teamLeader", value)} name="teamLeader" defaultValue={formData.teamLeader}>
                        <SelectTrigger id="add-teamLeader">
                            <SelectValue placeholder="Select Team Leader" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pooja Mehta">Pooja Mehta</SelectItem>
                            <SelectItem value="Anita Das">Anita Das</SelectItem>
                            <SelectItem value="Rajiv Verma">Rajiv Verma</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCloseAddForm}>Cancel</Button>
                    <Button type="submit">Save Associate</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>

    {editingUser && (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[80vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle>Edit Associate</DialogTitle>
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
                <Label htmlFor="edit-teamLeader">Team Leader</Label>
                <Select onValueChange={(value) => handleEditSelectChange("teamLeader", value)} name="teamLeader" defaultValue={editingUser.teamLeader}>
                    <SelectTrigger id="edit-teamLeader">
                        <SelectValue placeholder="Select Team Leader" />
                    </SelectTrigger>
                    <SelectContent>
                        {teamLeaders.map((leader) => (
                            <SelectItem key={leader.id} value={String(leader.id)}>
                                {leader.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (optional)</Label>
              <Input id="edit-password" name="password" type="password" placeholder="Leave blank to keep current password" onChange={handleEditFormChange} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditFormOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )}
      
    {selectedUser && (
        <UserDetailsDialog 
            user={selectedUser} 
            open={isDetailsOpen} 
            onOpenChange={setIsDetailsOpen}
            getTeamLeaderName={getTeamLeaderName}
        />
    )}
    </div>
  );
}