'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Mail, Phone, Briefcase } from "lucide-react";
import { useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }).optional().or(z.literal('')),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function formatPhone(rawPhone: string): string {
  if (rawPhone.length !== 10) return '(123) 456-7890';
  return `(${rawPhone.slice(0,3)}) ${rawPhone.slice(3,6)}-${rawPhone.slice(6)}`;
}

export default function ProfilePage() {
  const defaultAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');
  const [fullName, setFullName] = useState('Super Admin');
  const [email, setEmail] = useState('loading...');
  const [rawPhone, setRawPhone] = useState('1234567890');
  const [formattedPhone, setFormattedPhone] = useState('(123) 456-7890');
  const [address, setAddress] = useState("123 Market St, San Francisco, CA 94103");
  const [profileImage, setProfileImage] = useState(defaultAvatar?.imageUrl);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
        const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/profile/`,{
           method: 'GET',
           headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          //console.log("Superadmin Profile API Response data:", data); // Add this line
          const admin = data.admin;
          if (admin) {
            setFullName(admin.name || 'Super Admin');
            setEmail(admin.email || 'loading...');
            const mobile = admin.mobile || '1234567890';
            setRawPhone(mobile);
            setFormattedPhone(formatPhone(mobile));
            setAddress(admin.address || "N/A"); // Updated to fetch address, with "N/A" fallback
            if (admin.profile_image) {
              setProfileImage(admin.profile_image);
            }
          }
        }
      } catch (error) {
        //console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName,
      email,
      phoneNumber: rawPhone,
      address,
    },
    mode: "onChange",
  });

  // Update form defaults when profile data changes
  useEffect(() => {
    form.reset({
      fullName,
      email,
      phoneNumber: rawPhone,
      address,
    });
  }, [fullName, email, rawPhone, address, form]);

  function onSubmit(values: ProfileFormValues) {
    // //console.log("Profile update form submitted:", values); // Keep for debugging if needed

    async function submitUpdate() {
        const token = localStorage.getItem("authToken");
        if (!token) {
            //console.error("Authentication token not found.");
            // Optionally show a toast for auth error
            return;
        }

        const formData = new FormData();
        formData.append('name', values.fullName);
        formData.append('email', values.email);
        formData.append('mobile', values.phoneNumber.replace(/\D/g, '')); // Clean phone number
        formData.append('address', values.address || ''); // Add address

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/profile/`, {
                method: 'POST', // Backend's POST method calls PATCH
                headers: {
                    'Authorization': `Token ${token}`,
                    // DO NOT set 'Content-Type': 'multipart/form-data' here; browser handles it
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const updatedAdmin = data.admin; // Assuming API returns updated admin object
                
                if (updatedAdmin) {
                    setFullName(updatedAdmin.name || values.fullName);
                    setEmail(updatedAdmin.email || values.email);
                    const mobile = updatedAdmin.mobile || values.phoneNumber.replace(/\D/g, '');
                    setRawPhone(mobile);
                    setFormattedPhone(formatPhone(mobile));
                    setAddress(updatedAdmin.address || values.address || "N/A");
                    if (updatedAdmin.profile_image) {
                        setProfileImage(updatedAdmin.profile_image);
                    }
                }

                // Show success toast
                toast({
                    title: "Profile Updated",
                    description: "Your profile has been successfully updated.",
                    className: 'bg-green-500 text-white'
                });
                setIsDialogOpen(false); // Close dialog on success
            } else {
                const errorData = await response.json();
                //console.error("Profile update failed:", errorData);
                // Show error toast
                toast({
                    title: "Update Failed",
                    description: errorData.detail || "Failed to update profile.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            //console.error("Error updating profile:", error);
            // Show generic error toast
            toast({
                title: "Update Failed",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }
    submitUpdate();
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-muted/30 p-8 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={profileImage} />
                <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">{email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Super Administrator</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
                </div>
            </div>
            <div className="md:ml-auto">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Update Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Full Name</Label>
                    <p className="font-medium">{fullName}</p>
                </div>
                 <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Role</Label>
                    <p className="font-medium">Super Administrator</p>
                </div>
                <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Email Address</Label>
                    <p className="font-medium">{email}</p>
                </div>
                <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Phone Number</Label>
                    <p className="font-medium">{formattedPhone}</p>
                </div>
                <div className="space-y-1 md:col-span-2 border rounded-md p-3">
                    <Label className="text-sm">Address</Label>
                    <p className="font-medium">{address}</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}











// {
//     "admin": {
//         "id": 1,
//         "name": null,
//         "email": "ak@gmail.com",
//         "mobile": "9087654321",
//         "profile_image": null,
//         "username": "ak@gmail.com"
//     },
//     "setting": null
// }







// class SuperUserProfileAPIView(APIView):
//     """
//     API endpoint for Superuser 'view_profile' function.
//     GET: Fetches Superuser profile and System Settings (Logo).
//     PATCH: Updates Profile (Name, Email, Image) or Settings (Logo).
//     ONLY SUPERUSER can access this.
//     """
//     permission_classes = [IsAuthenticated, CustomIsSuperuser]
//     parser_classes = [MultiPartParser, FormParser] # To handle image/logo uploads

//     def get(self, request, format=None):
//         # 1. Serialize User Data
//         user_serializer = SuperUserProfileSerializer(request.user)
        
//         # 2. Serialize Settings Data (Logo)
//         setting = Settings.objects.last()
//         setting_data = DashboardSettingsSerializer(setting).data if setting else None
        
//         return Response({
//             'admin': user_serializer.data,
//             'setting': setting_data
//         }, status=status.HTTP_200_OK)

//     def patch(self, request, format=None):
//         user = request.user
//         data = request.data
        
//         # --- 1. Handle Logo Update (if 'tag' is logo or 'logo' file is present) ---
//         if data.get('tag') == 'logo' or 'logo' in request.FILES:
//             logo = request.FILES.get('logo')
//             if logo:
//                 setting = Settings.objects.last()
//                 if setting:
//                     setting.logo = logo
//                     setting.save()
//                 else:
//                     # Create new settings if not exists
//                     setting = Settings.objects.create(logo=logo)
                
//                 return Response({
//                     "message": "Logo updated successfully",
//                     "setting": DashboardSettingsSerializer(setting).data
//                 }, status=status.HTTP_200_OK)

//         # --- 2. Handle Profile Update ---
        
//         # Check for Email Duplication
//         new_email = data.get('email')
//         if new_email and new_email != user.email:
//             if User.objects.filter(email=new_email).exclude(id=user.id).exists():
//                 return Response({"error": "Email Already Exists"}, status=status.HTTP_400_BAD_REQUEST)
        
//         # Update User fields
//         serializer = SuperUserProfileSerializer(instance=user, data=data, partial=True)
        
//         if serializer.is_valid():
//             updated_user = serializer.save()
            
//             # Sync username with email (as per your view logic)
//             if new_email:
//                 updated_user.username = new_email
//                 updated_user.save()
                
//             return Response({
//                 "message": "Profile updated successfully",
//                 "admin": SuperUserProfileSerializer(updated_user).data
//             }, status=status.HTTP_200_OK)
            
//         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

//     def post(self, request, format=None):
//         # Handle POST requests as PATCH
//         return self.patch(request, format)