'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const EditTeamLeaderContent = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
        return;
      }
      try {
        // Assuming a detail endpoint exists, which might be different from the list dashboard
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/team-leader-dashboard/`, {
          headers: { "Authorization": `Token ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // Find the specific user from the list
          const user = data.find((u: any) => u.id.toString() === id);
          if (user) {
            setUserData({ username: user.username, email: user.email, password: '' });
          } else {
            toast({ title: "Error", description: "User not found.", variant: "destructive" });
          }
        } else {
          toast({ title: "Error", description: "Failed to fetch user data.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "An error occurred while fetching user data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    const payload: { [key: string]: any } = {
        username: userData.username,
        email: userData.email,
    };

    if (userData.password) {
      payload.password = userData.password;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/team-leader/edit/${id}/`, {
        method: 'PATCH', // Changed from POST to PATCH
        headers: { 
            "Authorization": `Token ${token}`,
            'Content-Type': 'application/json' // Added Content-Type for JSON
        },
        body: JSON.stringify(payload), // Changed body to JSON
      });

      if (response.ok) {
        toast({ title: "Success", description: "User updated successfully.", className: 'bg-green-500 text-white' });
        router.push('/superadmin/manage-users');
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.detail || "Failed to update user.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while updating the user.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Team Leader</CardTitle>
          <CardDescription>Update the details for {userData.username}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={userData.username} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" value={userData.password} onChange={handleInputChange} placeholder="Leave blank to keep current password" />
            </div>
            <Button type="submit" className="w-full">Update User</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditTeamLeaderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditTeamLeaderContent />
    </Suspense>
  );
}
