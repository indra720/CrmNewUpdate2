'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchAdminsForSelection, fetchCurrentUserProfile, fetchUsers } from '@/lib/api';

const addMemberSchema = z.object({
  userId: z.number({ invalid_type_error: 'Please select a user.' }),
  role: z.enum(['super_user', 'admin', 'team_leader', 'staff', 'freelancer', 'it_staff'], {
    errorMap: () => ({ message: "Please select a valid role." })
  }),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

// Define the User interface specific to what fetchUsers() returns and what this component uses
interface User {
  id: number;
  name: string;
  role: string; // Add role for filtering
}

export function AddProjectMemberDialog({ projectId, onMemberAdded }: { projectId: string; onMemberAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true);

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userId: undefined,
      role: 'staff',
    },
  });

  // Fetch all users for selection
  useEffect(() => {
    if (!open) return;

    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        // Assuming fetchUsers() returns an array of User objects with a 'role' property
        const data: User[] = await fetchUsers(); // Cast to our local User interface
        
        // Filter users based on specified roles
        const allowedRoles = ['staff', 'it_staff', 'team_leader', 'freelancer'];
        const filteredUsers = data.filter((user: User) => allowedRoles.includes(user.role));
        
        setUsers(filteredUsers);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch users.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, [open]);


  // Fetch current logged-in user's ID
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        setIsLoadingCurrentUser(true);
        const profile = await fetchCurrentUserProfile();
        // Assuming profile object has an 'id' field
        if (profile && (profile as any).id) {
          setCurrentUserId((profile as any).id);
        } else {
          console.warn("Current user ID not found in profile:", profile);
        }
      } catch (error) {
        console.error("Failed to fetch current user profile:", error);
        toast({
          title: "Error",
          description: "Failed to identify logged-in user.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCurrentUser(false);
      }
    }
    loadCurrentUser();
  }, [toast]);

  const onSubmit = async (data: AddMemberFormValues) => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "Could not identify the current user. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const payload = {
        project: projectId,
        user: data.userId,
        role: data.role,

      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/project-members/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("BACKEND ERROR 👉", errorData); // ⭐ ADD THIS
        throw new Error(JSON.stringify(errorData));
      }


      toast({
        title: "Member Added",
        description: `User successfully assigned to project with role ${data.role}.`,
      });

      form.reset();
      setOpen(false);
      onMemberAdded(); // Callback to refresh project details
    } catch (error: any) {
      console.error("Failed to add project member:", error);
      toast({
        title: "Error",
        description: `Failed to add member: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-1rem)] sm:h-[60vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Invite a new member to collaborate on this project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()} disabled={isLoadingUsers}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="super_user">Super User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="team_leader">Team Leader</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="it_staff">IT Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoadingUsers || isLoadingCurrentUser}>Add Member</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}