'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import DashboardLayout from "../dashboardlayout/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Mail, Phone, MapPin, Calendar, Briefcase, Building2, 
  GraduationCap, Edit2, Shield, Clock, User, Camera, Tag, Landmark, Hash, Users, Home, Link as LinkIcon, Wallet, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import React from 'react';

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
  staff_id: string;
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
      type={type}
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

const stats = [
  { label: "Total Leaves", value: "24", used: "8" },
  { label: "Sick Leave", value: "12", used: "2" },
  { label: "Casual Leave", value: "12", used: "6" },
];

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editableData, setEditableData] = useState<{
    staff_id: string;
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
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    panCard: File | null;
    aadharCardFile: File | null;
  }>({
    staff_id: "",
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
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    panCard: null,
    aadharCardFile: null,
  });

  useEffect(() => {
    if (profile) {
      setEditableData({
        staff_id: profile.staff_id,
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
        bankName: profile.bank_name,
        accountNumber: profile.account_number,
        ifscCode: profile.ifsc_code,
        upiId: profile.upi_id,
        profileImage: null,
        panCard: null,
        aadharCardFile: null,
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/profile/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProfileData = await response.json();
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
    return profile?.user.profile_image || "https://placehold.co/150x150/e2e8f0/a0aec0?text=Image";
  }, [editableData.profileImage, profile?.user.profile_image]);

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

    const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

    const formData = new FormData();
    Object.keys(editableData).forEach(key => {
      const value = editableData[key as keyof typeof editableData];
      const snakeCaseKey = toSnakeCase(key);
      
      if (value instanceof File) {
        formData.append(snakeCaseKey, value);
      } else if (value !== null && value !== undefined && value !== "") {
        if (snakeCaseKey !== 'staff_id') {
          formData.append(snakeCaseKey, String(value));
        }
      }
    });

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/profile/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully.",
          className: 'bg-green-500 text-white'
        });
        setIsEditDialogOpen(false);
        const fetchResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/profile/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          }
        );
        if (fetchResponse.ok) {
          const updatedData: ProfileData = await fetchResponse.json();
          setProfile(updatedData);
        }
      } else {
        let errorMessage = "An unexpected error occurred.";
        if (data && typeof data === 'object') {
            const errorDetails = Object.entries(data)
                .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
                .join('; ');
            if (errorDetails) {
                errorMessage = errorDetails;
            } else {
                errorMessage = JSON.stringify(data);
            }
        }
        toast({
          title: "Update Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      //console.error("Update API error:", error);
      toast({
        title: "Update Error",
        description: "Could not connect to the server. Please try again.",
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
  const designation = profile?.user.is_staff_new ? 'Staff' : 'N/A';
  const joiningDate = profile?.created_date ? new Date(profile.created_date).toLocaleDateString('en-IN') : 'N/A';
  const manager = profile?.join_referral || 'N/A';
  const location = profile?.city ? `${profile.city}, ${profile.state}` : 'N/A';
 const fullAddress = profile?.address ? `${profile.address},${profile.state}, ${profile.pincode}` : 'N/A';  const education = profile?.degree || 'N/A';
  // Skills are not in the API response, so we'll leave it empty for now
  const skills: string[] = [];

  const employeeId = profile?.staff_id || 'N/A';
  const phone = profile?.mobile || 'N/A';
  const department = 'N/A'; // Not in API response
  
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-muted/70 shadow-sm rounded-lg p-6">
        {/* Profile Header */}
        <div className="dashboard-card bg-gradient-to-r from-primary/5 via-card to-card bg-card shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                <AvatarImage src={profileImageUrl} alt={fullName} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                  {fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left ">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {employeeId}
                </span>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{designation}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-primary" />
                  {department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {fullAddress}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  Joined {joiningDate}
                </span>
              </div>
            </div>

            <Button variant="outline" className="hidden md:flex" onClick={() => setIsEditDialogOpen(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="dashboard-card bg-card shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 ">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reports To</p>
                  <p className="font-medium text-foreground">{manager}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Balance */}
          <div className="dashboard-card bg-card shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Leave Balance
            </h2>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">{parseInt(stat.value) - parseInt(stat.used)}</span>
                    <span className="text-muted-foreground text-sm"> / {stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="dashboard-card bg-card shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Skills & Education
            </h2>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Education</p>
              <p className="font-medium text-foreground">{education}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <TabsTrigger value="account">
                    Account Details
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
                      name="staff_id"
                      placeholder="Staff ID"
                      value={editableData.staff_id}
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

                <TabsContent value="account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="edit-bank-name"
                      label="Bank Name"
                      name="bankName"
                      placeholder="State Bank of India"
                      icon={Landmark}
                      value={editableData.bankName}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-account-number"
                      label="Account Number"
                      name="accountNumber"
                      placeholder="Your Bank Account Number"
                      icon={Wallet}
                      value={editableData.accountNumber}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-ifsc"
                      label="IFSC Code"
                      name="ifscCode"
                      placeholder="SBIN000000"
                      icon={Hash}
                      value={editableData.ifscCode}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-upi"
                      label="UPI ID (Optional)"
                      name="upiId"
                      placeholder="yourname@upi"
                      icon={LinkIcon}
                      value={editableData.upiId}
                      onChange={handleEditChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="review">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                      <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
                        <AvatarImage src={profileImageUrl} alt={editableData.name} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                          {editableData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                          value={editableData.staff_id}
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
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        Account Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewDetailItem
                          label="Bank Name"
                          value={editableData.bankName}
                        />
                        <ReviewDetailItem
                          label="Account No."
                          value={editableData.accountNumber}
                        />
                        <ReviewDetailItem
                          label="IFSC Code"
                          value={editableData.ifscCode}
                        />
                        <ReviewDetailItem
                          label="UPI ID"
                          value={editableData.upiId}
                        />
                      </div>
                    </div>
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
                    activeTab === "account"
                      ? setActiveTab("personal")
                      : activeTab === "review"
                        ? setActiveTab("account")
                        : setIsEditDialogOpen(false)
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
                        ? setActiveTab("account")
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
    </DashboardLayout>
  );
}
