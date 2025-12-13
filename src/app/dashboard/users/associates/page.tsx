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
  Users,
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


// Mock User Data
const mockUsers = [
    {
        id: 1,
        name: "Ravi Sharma",
        teamLeader: "Pooja Mehta",
        mobile: "9876543210",
        created_date: "2025-10-10T12:00:00.000Z",
        self_user: { user_active: true },
        email: 'ravi.sharma@example.com',
        password: 'password123',
    },
    {
        id: 2,
        name: "Vikas Singh",
        teamLeader: "Anita Das",
        mobile: "9998887776",
        created_date: "2025-10-08T12:00:00.000Z",
        self_user: { user_active: false },
        email: 'vikas.singh@example.com',
        password: 'password456',
    },
    {
        id: 3,
        name: "Sneha Kapoor",
        teamLeader: "Rajiv Verma",
        mobile: "9123456789",
        created_date: "2025-10-02T12:00:00.000Z",
        self_user: { user_active: true },
        email: 'sneha.kapoor@example.com',
        password: 'password789',
    },
];

const kpiCounts = {
    total_visit: 230,
    interested: 75,
    not_interested: 40,
    other_location: 22,
    not_picked: 19,
    total_earning: "1,20,000.00"
};

const kpiData = [
    { title: "Total Visit", valueKey: "total_visit", icon: Eye, color: "text-blue-500", link: "/dashboard/reports/associates/visit" },
    { title: "Interested", valueKey: "interested", icon: Check, color: "text-green-500", link: "/dashboard/reports/associates/interested" },
    { title: "Not Interested", valueKey: "not_interested", icon: XCircle, color: "text-red-500", link: "/dashboard/reports/associates/not-interested" },
    { title: "Other Location", valueKey: "other_location", icon: MapPin, color: "text-yellow-500", link: "/dashboard/reports/associates/other-location" },
    { title: "Not Picked", valueKey: "not_picked", icon: Phone, color: "text-purple-500", link: "/dashboard/reports/associates/not-picked" },
    { title: "Total Earning", valueKey: "total_earning", icon: DollarSign, color: "text-emerald-500" },
];


const initialFormData = {
    id: null,
    name: "",
    email: "",
    password: "",
    mobile: "",
    teamLeader: "",
};

const UserDetailsDialog = ({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) => {
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
                    <div><p className="text-sm text-muted-foreground">Team Leader</p><p className="font-medium text-foreground">{user.teamLeader || 'N/A'}</p></div>
                    <div><p className="text-sm text-muted-foreground">Created Date</p><p className="font-medium text-foreground">{new Date(user.created_date).toLocaleDateString()}</p></div>
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

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toast } = useToast();

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

  const handleOpenEditForm = (user: any) => {
    setEditingUser({ ...user });
    setIsEditFormOpen(true);
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    toast({
        title: "Associate Updated!",
        description: `${editingUser.name} has been updated successfully.`,
        className: 'bg-green-500 text-white'
    });
    setIsEditFormOpen(false);
    setEditingUser(null);
  };


  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsers(users.map(u => u.id === id ? {...u, self_user: {...u.self_user, user_active: isActive}} : u));
       toast({
        title: 'Status Updated',
        description: `User status changed to ${isActive ? 'Active' : 'Inactive'}.`,
        className: 'bg-blue-500 text-white'
      });
    } catch (error) {
      //console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
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

  return (
    <div className="space-y-6 flex flex-col h-full">
        <h1 className="text-2xl font-bold tracking-tight">Associate Users</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {kpiData.map((card, index) => (
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
                  <TableHead className="text-base md:text-sm">SR. NO</TableHead>
                  <TableHead className="text-base md:text-sm">Name</TableHead>
                  <TableHead className="hidden sm:table-cell text-base md:text-sm">Team Lead</TableHead>
                  <TableHead className="hidden md:table-cell text-base md:text-sm">Mobile No</TableHead>
                  <TableHead className="hidden lg:table-cell text-base md:text-sm">Created Date</TableHead>
                  <TableHead className="text-base md:text-sm">Leads</TableHead>
                  <TableHead className="text-base md:text-sm">Active/Non-Active</TableHead>
                  <TableHead className="text-base md:text-sm">Earn</TableHead>
                  <TableHead className="text-base md:text-sm">Add Sell</TableHead>
                  <TableHead className="text-right text-base md:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-base md:text-sm">{index + 1}</TableCell>
                    <TableCell className="font-medium text-base md:text-sm">{user.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-base md:text-sm">{user.teamLeader}</TableCell>
                    <TableCell className="hidden md:table-cell text-base md:text-sm">{user.mobile}</TableCell>
                    <TableCell className="hidden lg:table-cell text-base md:text-sm">
                      {new Date(user.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-base md:text-sm">
                        <Button variant="link" size="sm" className="p-0 h-auto text-green-600">View</Button>
                    </TableCell>
                    <TableCell className="text-base md:text-sm">
                      <Switch
                        checked={user.self_user?.user_active}
                        onCheckedChange={(checked) =>
                          handleToggle(user.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-base md:text-sm">
                        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                    </TableCell>
                     <TableCell className="text-base md:text-sm">
                        <Button variant="link" size="sm" className="p-0 h-auto text-purple-600">Add Sell</Button>
                    </TableCell>
                    <TableCell className="text-right text-base md:text-sm">
                       <div className="flex items-center justify-end gap-2">
                            <div className="hidden sm:flex items-center gap-2">
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
                          

                        <div className="sm:hidden">
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setIsDetailsOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
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
        <DialogContent className="sm:max-w-md">
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
                        <SelectItem value="Pooja Mehta">Pooja Mehta</SelectItem>
                        <SelectItem value="Anita Das">Anita Das</SelectItem>
                        <SelectItem value="Rajiv Verma">Rajiv Verma</SelectItem>
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
        />
    )}
    </div>
  );
};
