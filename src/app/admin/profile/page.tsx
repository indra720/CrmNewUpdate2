'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Phone, Briefcase, Calendar, Shield, CreditCard, Landmark, Hash, Anchor } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import { EditProfileDialog } from "./edit-profile-dialog";

// Define the structure of the profile data
interface ProfileData {
  admin_id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dob: string;
  pancard: string;
  aadharCard: string;
  account_number: string;
  upi_id: string;
  bank_name: string;
  ifsc_code: string;
  user?: {
    profile_image?: string | null;
  };
}


export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/profile/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const result = await response.json();
      setProfile(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p>Loading profile...</p></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center mt-8">No profile data found.</div>;
  }
  
  return (
    <>
      <div className="flex flex-col gap-8 p-4 sm:p-6 md:p-8">
        <Card className="shadow-lg rounded-2xl overflow-hidden border">
          <div className="bg-muted/30 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                  <AvatarImage src={profile.user?.profile_image || userAvatar?.imageUrl} alt={profile.name} />
                  <AvatarFallback>{profile.name?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-grow">
                  <h2 className="text-3xl font-bold text-primary">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap justify-center md:justify-start">
                      <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Administrator</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {`${profile.city}, ${profile.state}`}</span>
                  </div>
              </div>
              <div className="md:ml-auto">
                  <Button onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
              </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-md rounded-xl border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Details about your personal identity.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
              <InfoField icon={<Phone className="h-5 w-5 text-muted-foreground" />} label="Phone Number" value={profile.mobile} />
              <InfoField icon={<Calendar className="h-5 w-5 text-muted-foreground" />} label="Date of Birth" value={profile.dob} />
              <div className="sm:col-span-2">
                <InfoField icon={<MapPin className="h-5 w-5 text-muted-foreground" />} label="Address" value={`${profile.address}, ${profile.city}, ${profile.state} - ${profile.pincode}`} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md rounded-xl border">
             <CardHeader>
              <CardTitle>Identity & Verification</CardTitle>
               <CardDescription>Your official identification details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <InfoField icon={<Shield className="h-5 w-5 text-muted-foreground" />} label="Aadhar Card" value={profile.aadharCard} />
              <InfoField icon={<CreditCard className="h-5 w-5 text-muted-foreground" />} label="PAN Card" value={profile.pancard} />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md rounded-xl border">
          <CardHeader>
            <CardTitle>Bank Account Details</CardTitle>
             <CardDescription>Your financial information for transactions.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <InfoField icon={<Landmark className="h-5 w-5 text-muted-foreground" />} label="Bank Name" value={profile.bank_name} />
              <InfoField icon={<Hash className="h-5 w-5 text-muted-foreground" />} label="Account Number" value={profile.account_number} />
              <InfoField icon={<CreditCard className="h-5 w-5 text-muted-foreground" />} label="IFSC Code" value={profile.ifsc_code} />
              <InfoField icon={<Anchor className="h-5 w-5 text-muted-foreground" />} label="UPI ID" value={profile.upi_id} />
          </CardContent>
        </Card>
      </div>
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
    </>
  );
}

// Helper component for displaying info fields
const InfoField = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => (
    <div className="flex items-start gap-4 border rounded-md p-4">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div>
            <Label className="text-sm font-normal text-muted-foreground">{label}</Label>
            <p className="font-semibold text-base">{value || 'N/A'}</p>
        </div>
    </div>
);



// {
//     "id": 2,
//     "user": {
//         "id": 13,
//         "email": "gaurav720@gmail.com",
//         "name": "Gaurav Verma",
//         "mobile": "5676554334",
//         "profile_image": null,
//         "is_admin": true,
//         "is_team_leader": false,
//         "is_staff_new": false,
//         "created_date": "2025-11-26T11:53:52.249590Z",
//         "user_active": true
//     },
//     "admin_id": "fc73087d-00db-42a3-aed4-89f8456934fb",
//     "name": "Gaurav Verma",
//     "email": "gaurav720@gmail.com",
//     "mobile": "5676554334",
//     "address": "Jaipur,rajasthan",
//     "city": "Jaipur",
//     "pincode": "345677",
//     "state": "Rajasthan",
//     "dob": "2000-07-26",
//     "pancard": "ABCDE7978FHG",
//     "aadharCard": "789098762343",
//     "account_number": "34567890897",
//     "upi_id": "gaurav@123",
//     "bank_name": "sbi",
//     "ifsc_code": "SBIN005467",
//     "created_date": "2025-11-26T11:53:53.638533Z"
// }


// class AdminProfileViewAPIView(APIView):
//     """
//     API endpoint for 'admin_view_profile' (Admin Dashboard).
//     GET: Fetches logged-in Admin's profile.
//     PATCH: Updates logged-in Admin's profile.
//     ONLY ADMIN (is_admin=True) can access this.
//     """
//     permission_classes = [IsAuthenticated, IsCustomAdminUser]
//     parser_classes = [MultiPartParser, FormParser]

//     def get_admin_object(self, request):
//         try:
//             # Using email as per your view logic, but self_user is safer if linked correctly
//             return Admin.objects.get(email=request.user.email)
//         except Admin.DoesNotExist:
//             return None

//     def get(self, request, format=None):
//         admin_instance = self.get_admin_object(request)
//         if not admin_instance:
//             return Response({"error": "Admin profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
//         serializer = AdminProfileSerializer(admin_instance)
//         return Response(serializer.data, status=status.HTTP_200_OK)

//     def patch(self, request, format=None):
//         admin_instance = self.get_admin_object(request)
//         if not admin_instance:
//             return Response({"error": "Admin profile not found."}, status=status.HTTP_404_NOT_FOUND)

//         # Use existing update serializer which handles User + Admin model update
//         serializer = AdminUpdateSerializer(instance=admin_instance, data=request.data, partial=True)
        
//         if serializer.is_valid():
//             updated_instance = serializer.save()
//             return Response({
//                 "message": "Profile updated successfully",
//                 "data": AdminProfileSerializer(updated_instance).data
//             }, status=status.HTTP_200_OK)
        
//         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
//     def post(self, request, format=None):
//         return self.patch(request, format)