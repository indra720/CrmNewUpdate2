

'use client';





import { useEffect, useState } from "react";


import { Badge } from "@/components/ui/badge"


import { Button } from "@/components/ui/button"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


import { MoreHorizontal, PlusCircle } from "lucide-react"


import Link from "next/link"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { useToast } from "@/hooks/use-toast";





const roleColors: { [key: string]: string } = {


    SuperAdmin: "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400",


    Admin: "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",


    "Team Leader": "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",


    Staff: "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",


}





export default function ManageUsersPage() {


    const [users, setUsers] = useState<any[]>([]);


    const { toast } = useToast();





    useEffect(() => {


        const fetchUsers = async () => {


            const token = localStorage.getItem('authToken');


            if (!token) {


                toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });


                return;


            }





            try {


                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/team-leader-dashboard/`, {


                    method: "GET",


                    headers: {


                        "Authorization": `Token ${token}`,


                        "Content-Type": "application/json",


                    },


                });





                if (response.ok) {


                    const data = await response.json();


                    setUsers(data);


                } else {


                    toast({ title: "Error", description: "Failed to fetch users.", variant: "destructive" });


                }


            } catch (error) {


                toast({ title: "Error", description: "An error occurred while fetching users.", variant: "destructive" });


            }


        };





        fetchUsers();


    }, [toast]);



  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Link href="/superadmin/manage-users/add">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View, edit, or delete users from the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) && users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {/* Assuming no avatar in API response for now */}
                        <AvatarFallback>{user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {user.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors["Team Leader"]}>
                        Team Leader
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400'}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/superadmin/manage-users/team-leader/${user.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
