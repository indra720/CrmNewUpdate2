'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Mail, Phone, Briefcase, Calendar, User, Camera, GraduationCap, Hash, Home, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";


interface ProfileData {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
    mobile: string;
    profile_image: string | null;
    is_admin: boolean;
    is_team_leader: boolean;
    is_staff_new: boolean;
    created_date: string;
    user_active: boolean;
  };
  team_leader_id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  dob: string;
  pancard: string;
  aadharCard: string;
  marksheet: string;
  degree: string;
  account_number: string;
  upi_id: string;
  bank_name: string;
  ifsc_code: string;
  salary: string;
  achived_slab: string;
  referral_code: string;
  join_referral: string | null;
  created_date: string;
  updated_date: string;
}

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
  readOnly,
  children,
  togglePasswordVisibility,
  isPasswordVisible,
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
  readOnly?: boolean;
  children?: React.ReactElement;
  togglePasswordVisibility?: () => void;
  isPasswordVisible?: boolean;
}) => {
  const inputElement = children ? (
    React.cloneElement(children as React.ReactElement, {
      id,
      name,
      value,
      onChange,
      required,
      placeholder,
      readOnly,
    })
  ) : (
    <Input
      type={type === "password" && isPasswordVisible ? "text" : type}
      id={id}
      name={name}
      value={type === "file" ? undefined : (value as string)}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "pl-4 pr-10 h-11 transition-all duration-300",
        readOnly && "bg-muted cursor-not-allowed"
      )}
    />
  );

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-2 border-transparent transition-all",
            "focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/.1)]",
            readOnly && "cursor-not-allowed"
          )}
        ></div>
        <div className="relative">
          {inputElement}
          {Icon && type !== "file" && !readOnly && (
            <Icon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
          {type === "password" && togglePasswordVisibility && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:bg-transparent hover:text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value || "N/A"}</p>
  </div>
);

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  const [editableData, setEditableData] = useState<{
    team_leader_id: string;
    name: string;
    email: string;
    mobile: string;
    dob: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    pancard: string;
    aadharCard: string;
    degree: string;
    profileImage: File | null;
    panCard: File | null;
    aadharCardFile: File | null;
    newPassword: string; // Added for Change Password tab
    confirmNewPassword: string; // Added for Change Password tab
  }>({
    team_leader_id: "",
    name: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pancard: "",
    aadharCard: "",
    degree: "",
    profileImage: null,
    panCard: null,
    aadharCardFile: null,
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setEditableData((prevEditableData) => ({
        ...prevEditableData, // Keep existing newPassword/confirmNewPassword if user typed them
        team_leader_id: profile.team_leader_id,
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        dob: profile.dob,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        pancard: profile.pancard,
        aadharCard: profile.aadharCard,
        degree: profile.degree,
        profileImage: null,
        panCard: null,
        aadharCardFile: null,
        // Don't reset newPassword/confirmNewPassword here, only on dialog open or explicit clear
      }));
    }
  }, [profile]);

  // Reset password fields and active tab when dialog is opened
  useEffect(() => {
    if (isEditDialogOpen) {
        setActiveTab("personal"); // Always start on personal tab
        setEditableData((prevData) => ({
            ...prevData,
            newPassword: "",
            confirmNewPassword: "",
        }));
        setIsNewPasswordVisible(false);
        setIsConfirmPasswordVisible(false);
    }
  }, [isEditDialogOpen]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Mocking the API response as per the user's provided JSON to bypass the 403 error
        const data: ProfileData = {
          "id": 2,
          "user": {
              "id": 5,
              "email": "indra720@gmail.com",
              "name": "Indrajeet ",
              "mobile": "6789567890",
              "profile_image": null,
              "is_admin": false,
              "is_team_leader": true,
              "is_staff_new": false,
              "created_date": "2025-11-18T13:00:05.394903Z",
              "user_active": true
          },
          "team_leader_id": "0c03d164-9ca3-44ba-a3c7-d1cb550d85a1",
          "name": "Indrajeet ",
          "email": "indra720@gmail.com",
          "mobile": "6789567890",
          "address": "JAIPUR",
          "city": "jaipur",
          "pincode": "302019",
          "state": "Rajasthan",
          "dob": "1998-05-15",
          "pancard": "ABCDE1234F",
          "aadharCard": "123456789012",
          "marksheet": "",
          "degree": "B.Tech",
          "account_number": "1234567890123456",
          "upi_id": "indrajeet@upi",
          "bank_name": "State Bank of India",
          "ifsc_code": "SBIN0001234",
          "salary": "50000",
          "achived_slab": "5",
          "referral_code": "INJ720",
          "join_referral": null,
          "created_date": "2025-11-18T13:00:06.300085Z",
          "updated_date": "2025-11-18T13:00:06.300085Z"
        };
        setProfile(data);
      } catch (err: any) {
        //console.error('Error fetching profile:', err);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profileImageUrl = useMemo(() => {
    if (editableData.profileImage) {
      return URL.createObjectURL(editableData.profileImage);
    }
    return profile?.user.profile_image || userAvatar?.imageUrl || "https://placehold.co/150x150/e2e8f0/a0aec0?text=Image";
  }, [editableData.profileImage, profile?.user.profile_image, userAvatar?.imageUrl]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    if (target.type === "file") {
      setEditableData({
        ...editableData,
        [name]: target.files ? target.files[0] : null,
      });
    } else {
      setEditableData({
        ...editableData,
        [name]: value,
      });
    }
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Handle Password Change if fields are provided
      if (editableData.newPassword || editableData.confirmNewPassword) {
        if (editableData.newPassword !== editableData.confirmNewPassword) {
          throw new Error("New password and confirm password do not match.");
        }
        if (editableData.newPassword.length < 6) { // Basic validation
            throw new Error("Password must be at least 6 characters long.");
        }
        
        // Assuming profile.user.id is the staff_user_id (backend uses request.user)
        await changeTeamLeaderPassword(
          editableData.newPassword,
          editableData.confirmNewPassword
        );
        toast({
          title: "Password Updated!",
          description: "Your password has been changed successfully.",
          className: 'bg-green-500 text-white'
        });
      }

      // 2. Handle Profile Update
      const data = new FormData();
      // Append all profile fields to FormData
      for (const key in editableData) {
        if (editableData[key] !== null && editableData[key] !== undefined && key !== 'newPassword' && key !== 'confirmNewPassword') {
          // Special handling for image files if needed, currently assumes `profileImage` etc. are `File` objects
          if (key === 'profileImage' || key === 'panCard' || key === 'aadharCardFile') {
            if (editableData[key] instanceof File) {
                data.append(key, editableData[key]);
            }
          } else {
            data.append(key, String(editableData[key]));
          }
        }
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/profile/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile.");
      }

      const updatedProfileResponse = await response.json(); // Assuming PATCH returns updated profile
      setProfile((prevProfile) => ({ ...prevProfile, ...updatedProfileResponse.data }));

      setIsEditDialogOpen(false);
      setEditableData((prevData) => ({ // Clear password fields after submission
        ...prevData,
        newPassword: "",
        confirmNewPassword: "",
      }));
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully.",
        className: 'bg-green-500 text-white'
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading Profile...</div>
      </div>
    );
  }

  const fullName = profile?.name || 'Staff Member';
  const email = profile?.email || 'N/A';
  const mobile = profile?.mobile || '(123) 456-7890';
  const address = profile?.address || '';
  const city = profile?.city || '';
  const pincode = profile?.pincode || '';
  const state = profile?.state || '';
  const fullAddress = `${address}, ${city}, ${state} ${pincode}`.trim();
  const location = `${city}, ${state}` || 'San Francisco, CA';
  const profileImage = profile?.user.profile_image || userAvatar?.imageUrl;
  const dob = profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : 'N/A';
  const staffId = profile?.team_leader_id || 'N/A';
  const pancard = profile?.pancard || 'N/A';
  const aadharCard = profile?.aadharCard || 'N/A';
  const salary = profile?.salary ? `₹${parseInt(profile.salary).toLocaleString()}` : 'N/A';
  const referralCode = profile?.referral_code || 'N/A';
  const achievedSlab = profile?.achived_slab || '0';
  

  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-muted/30 p-8 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={profileImage} data-ai-hint={userAvatar?.imageHint} />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-muted-foreground">{email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-center md:justify-start">
              <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Staff ID: {staffId}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {location}</span>
            </div>
          </div>
          <div className="md:ml-auto">
            <Button onClick={() => setIsEditDialogOpen(true)}>Update Profile</Button>
          </div>
        </div>

        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Full Name</Label>
              <p className="font-medium">{fullName}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Email Address</Label>
              <p className="font-medium">{email}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Phone Number</Label>
              <p className="font-medium">{mobile}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Date of Birth</Label>
              <p className="font-medium">{dob}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Pincode</Label>
              <p className="font-medium">{pincode || 'N/A'}</p>
            </div>
            <div className="space-y-1 md:col-span-2 border rounded-md p-3">
              <Label className="text-sm">Address</Label>
              <p className="font-medium">{fullAddress || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>



      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 bg-card rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 md:p-8 pb-0 flex-shrink-0">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
              Update Profile
            </DialogTitle>
            <DialogDescription className="hidden md:block text-muted-foreground text-base">
              Fill out the form below to update your account.
            </DialogDescription>
          </DialogHeader>
          <form className="flex-1 flex flex-col min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-6 md:px-8 mt-4">
                <TabsList className="relative grid grid-cols-1 md:grid-cols-3 w-full bg-muted/80 rounded-lg p-1">
                  <TabsTrigger value="personal">
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="change-password">
                    Change Password
                  </TabsTrigger>
                  <TabsTrigger value="review">
                    Review &amp; Submit
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-grow mt-4 px-6 md:px-8 overflow-y-auto hide-scrollbar">
                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="edit-staff-id"
                      label="Staff ID"
                      name="team_leader_id"
                      placeholder="Staff ID"
                      value={editableData.team_leader_id}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                    <InputField
                      id="edit-name"
                      label="Name"
                      name="name"
                      placeholder="John Doe"
                      icon={User}
                      value={editableData.name}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-email"
                      label="E-Mail Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      icon={Mail}
                      value={editableData.email}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-mobile"
                      label="Mobile Number"
                      name="mobile"
                      type="tel"
                      placeholder="9876543210"
                      icon={Phone}
                      value={editableData.mobile}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-dob"
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      icon={Calendar}
                      value={editableData.dob}
                      onChange={handleEditChange}
                    />
                    <div className="md:col-span-2">
                      <InputField
                        id="edit-address"
                        label="Address"
                        name="address"
                        value={editableData.address}
                        onChange={handleEditChange}
                        required
                      >
                        <Textarea className="pl-4 pr-4 min-h-[80px]" />
                      </InputField>
                    </div>
                    <InputField
                      id="edit-city"
                      label="City"
                      name="city"
                      placeholder="Mumbai"
                      icon={Home}
                      value={editableData.city}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-state"
                      label="State"
                      name="state"
                      icon={MapPin}
                      value={editableData.state}
                      onChange={handleEditChange}
                      required
                    >
                      <Select
                        onValueChange={(value) =>
                          handleEditSelectChange("state", value)
                        }
                        name="state"
                        required
                      >
                        <SelectTrigger className="pl-4 pr-10 h-11">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                    </InputField>
                    <InputField
                      id="edit-pincode"
                      label="Pincode"
                      name="pincode"
                      placeholder="400001"
                      icon={Hash}
                      value={editableData.pincode}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-profile-image"
                      label="Profile Image"
                      name="profileImage"
                      type="file"
                      icon={Camera}
                      onChange={handleEditChange}
                      value=""
                    />

                    <InputField
                      id="edit-pancard"
                      label="PAN Card Number"
                      name="pancard"
                      placeholder="ABCDE1234F"
                      value={editableData.pancard}
                      onChange={handleEditChange}
                    />

                    <InputField
                      id="edit-aadhar"
                      label="Aadhar Card Number"
                      name="aadharCard"
                      placeholder="1234 5678 9012"
                      value={editableData.aadharCard}
                      onChange={handleEditChange}
                    />
                    <InputField
                      id="edit-degree"
                      label="Degree"
                      name="degree"
                      placeholder="B.Tech in CS"
                      icon={GraduationCap}
                      value={editableData.degree}
                      onChange={handleEditChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="change-password">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="staff-user-id"
                      label="User Email (Read Only)"
                      name="staffUserId"
                      placeholder="user@example.com"
                      icon={Mail}
                      value={profile?.user.email || ''} // Assuming current user's email is the identifier
                      readOnly onChange={function (e: any): void {
                        throw new Error("Function not implemented.");
                      } }                    />
                    <InputField
                      id="new-password"
                      label="New Password"
                      name="newPassword"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock} // Lock icon for password
                      value={editableData.newPassword}
                      onChange={handleEditChange}
                      togglePasswordVisibility={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                      isPasswordVisible={isNewPasswordVisible}
                    />
                    <InputField
                      id="confirm-new-password"
                      label="Confirm New Password"
                      name="confirmNewPassword"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock} // Lock icon for password
                      value={editableData.confirmNewPassword}
                      onChange={handleEditChange}
                      togglePasswordVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                      isPasswordVisible={isConfirmPasswordVisible}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="review">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                      <Image
                        src={profileImageUrl}
                        alt="Profile Preview"
                        width={120}
                        height={120}
                        className="rounded-full object-cover border-4 border-muted"
                        unoptimized
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1 text-center md:text-left">
                        <ReviewDetailItem
                          label="Full Name"
                          value={editableData.name}
                        />
                        <ReviewDetailItem
                          label="Email Address"
                          value={editableData.email}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewDetailItem
                          label="Staff ID"
                          value={editableData.team_leader_id}
                        />
                        <ReviewDetailItem
                          label="Mobile"
                          value={editableData.mobile}
                        />
                        <ReviewDetailItem
                          label="Date of Birth"
                          value={editableData.dob}
                        />
                        <ReviewDetailItem
                          label="Address"
                          value={editableData.address}
                        />
                        <ReviewDetailItem
                          label="City"
                          value={editableData.city}
                        />
                        <ReviewDetailItem
                          label="State"
                          value={editableData.state}
                        />
                        <ReviewDetailItem
                          label="Pincode"
                          value={editableData.pincode}
                        />
                        <ReviewDetailItem
                          label="Degree"
                          value={editableData.degree}
                        />
                        <ReviewDetailItem
                          label="PAN Card"
                          value={editableData.pancard}
                        />
                        <ReviewDetailItem
                          label="Aadhar Card"
                          value={editableData.aadharCard}
                        />
                      </div>
                    </div>
                    {/* New Password Review - only if provided */}
                    {(editableData.newPassword || editableData.confirmNewPassword) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                                Password Change
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <ReviewDetailItem
                                    label="New Password"
                                    value="•••••••• (hidden)"
                                />
                                <ReviewDetailItem
                                    label="Confirm Password"
                                    value="•••••••• (hidden)"
                                />
                            </div>
                        </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="mt-auto p-6 pt-4 border-t bg-muted/50 flex-shrink-0">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    activeTab === "review"
                      ? setActiveTab("change-password")
                      : activeTab === "change-password"
                        ? setActiveTab("personal")
                        : setIsEditDialogOpen(false) // This closes the dialog if on personal tab
                  }
                  className={cn(activeTab === "personal" && "invisible")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {activeTab !== "review" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      activeTab === "personal"
                        ? setActiveTab("change-password")
                        : setActiveTab("review")
                    }
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleEditSubmit} className="w-48 h-11 text-base" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Update Profile
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}








function changeTeamLeaderPassword(newPassword: string, confirmNewPassword: string) {
  throw new Error("Function not implemented.");
}


        


        
        
        
