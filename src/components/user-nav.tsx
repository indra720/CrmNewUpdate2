'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";


export function UserNav() {
  //console.log('UserNav: Component function called.'); // Added log
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName');
      const storedUserEmail = localStorage.getItem('userEmail');
      const storedUserRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');

      // console.log('UserNav: Data from localStorage:', {
      //   storedUserName,
      //   storedUserEmail,
      //   storedUserRole,
      //   storedUserId,
      // });

      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
      setUserRole(storedUserRole);
      setUserId(storedUserId);
    }
  }, []);

  if (!isMounted || !userName || !userEmail || !userRole) {
    //console.log('UserNav: Not rendering due to missing data or not mounted.', {
    //   isMounted,
    //   userName,
    //   userEmail,
    //   userRole,
    // });
    return null; // Don't render if not mounted or user data is missing
  }

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');

    // Clear authentication cookies (critical for middleware)
    Cookies.remove('authToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    Cookies.remove('userId', { path: '/' });

    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        className: 'bg-green-500 text-white'
    });

    router.push('/login');
  };

  // Function to get profile link based on role
  const getUserProfileLink = (role: string | null) => {
    switch (role) {
      case 'superadmin':
        return '/superadmin/profile';
      case 'admin':
        // Assuming admin has a profile page under /admin/profile, adjust if needed
        return '/admin/profile'; 
      case 'team-leader':
        return '/team-leader/profile';
      case 'staff':
        return '/staff/overview';
      default:
        return '/profile'; // Generic profile or login if no role
    }
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            {/* Display first letter of userName as fallback if no image */}
            <AvatarFallback>{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(getUserProfileLink(userRole))}>
            Profile
            <DropdownMenuShortcut>P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}> {/* Prevent DropdownMenu from closing */}
                    Log out
                    <DropdownMenuShortcut>Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will log you out of your account.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}