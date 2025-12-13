"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Pencil,
  Search,
  Plus,
  Minus,
  MoreVertical,
} from "lucide-react";
import { AttendanceDialog } from "./attendance-dialog";
import { toggleUserActiveStatus } from "@/lib/api";
import { toast, useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function ItStaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const { toast } = useToast();

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleOpenEditForm = (user: any) => {
    setEditingUser(user);
    setIsEditFormOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/it-staff/edit/${editingUser.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            name: editingUser.name,
            mobile: editingUser.mobile,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update IT staff.");
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...updatedUser } : u))
      );
      toast({
        title: "Success",
        description: "IT Staff updated successfully.",
        className: "bg-green-500 text-white",
      });
      setIsEditFormOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update IT staff.",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/it-staff/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        //console.error("Failed to fetch IT staff", response.status);
        return;
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      //console.error("Error fetching IT staff:", error);
    }
  };

  useEffect(() => {
    // setUsers(mockUsers);
    fetchUsers();
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    // 1. Optimistic UI Update
    const originalUsers = [...users];
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: isActive } : user
      )
    );

    try {
      await toggleUserActiveStatus(id, "staff", isActive);

      // 3. Success: Show toast (assuming useToast is available)
      toast({
        title: "Status Updated",
        description: `User status changed to ${
          isActive ? "Active" : "Inactive"
        }.`,
        className: "bg-blue-500 text-white",
        duration: 3000,
      });

      // Optional: Refetch in the background to ensure consistency
      // fetchUsers();
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search)
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold tracking-tight">IT Staff Users</h1>

      <Card className="shadow-lg rounded-2xl flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className=" hidden md:flex">All IT Staff</CardTitle>
              <CardDescription className="hidden md:flex">Manage IT staff members.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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
                  <TableHead className="hidden md:table-cell">Mobile No</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Active / Non-Active</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Attendance</TableHead>
                  <TableHead className="text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <TableRow data-state={expandedRowId === user.id && "selected"}>
                        <TableCell>
                          <div className="md:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => toggleRow(user.id)}
                            >
                              {expandedRowId === user.id ? <Minus /> : <Plus />}
                            </Button>
                          </div>
                          <div className="hidden md:block">{index + 1}</div>
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
                        <TableCell className="hidden md:table-cell text-center">
                          <Switch
                            checked={user.active}
                            onCheckedChange={(checked) => handleToggle(user.id, checked)}
                            aria-label={`Toggle status for ${user.name}`}
                          />
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setSelectedUserEmail(user.email);
                              setIsAttendanceDialogOpen(true);
                            }}
                          >
                            Attendance
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
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
                        </TableCell>
                      </TableRow>
                      {expandedRowId === user.id && (
                        <TableRow className="md:hidden">
                          <TableCell colSpan={6} className="p-0">
                            <div className="p-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="text-lg font-bold">{user.name}</div>
                                </div>
                                <div className="grid grid-cols-1 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Mobile No:</span>
                                    <span className="text-sm">{user.mobile}</span>
                                  </div>
                                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Active Status:</span>
                                    <Switch
                                      checked={user.active}
                                      onCheckedChange={(checked) => handleToggle(user.id, checked)}
                                      aria-label={`Toggle status for ${user.name}`}
                                    />
                                  </div>
                                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Attendance:</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUserId(user.id);
                                        setSelectedUserEmail(user.email);
                                        setIsAttendanceDialogOpen(true);
                                      }}
                                    >
                                      View
                                    </Button>
                                  </div>
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
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[80vh] overflow-y-auto hide-scrollbar">
            <DialogHeader>
              <DialogTitle>Edit IT Staff</DialogTitle>
              <DialogDescription>
                Update the details for {editingUser.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingUser.name}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="edit-mobile">Mobile</Label>
                <Input
                  id="edit-mobile"
                  name="mobile"
                  value={editingUser.mobile}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <AttendanceDialog
        userId={selectedUserId}
        userEmail={selectedUserEmail} // ✅ YE ADD KARO
        isOpen={isAttendanceDialogOpen}
        onClose={() => setIsAttendanceDialogOpen(false)}
      />
    </div>
  );
}
