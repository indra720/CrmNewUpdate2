'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Calendar, Home, Hash, Key, Camera } from "lucide-react";
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Define the structure of the profile data, adding admin_id
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
  user?: {
    profile_image?: string | null;
  };
}

// Add profile_image to the editable data for file uploads
interface EditableProfileData {
    admin_id?: string;
    name?: string;
    email?: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    dob?: string;
    profile_image?: File | null;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  onProfileUpdate: () => void;
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
        "pl-10 pr-4 h-11 transition-all duration-300",
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
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        </div>
        {inputElement}
      </div>
    </div>
  );
};


export function EditProfileDialog({ isOpen, onClose, profile, onProfileUpdate }: EditProfileDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editableData, setEditableData] = useState<EditableProfileData>({});

    useEffect(() => {
        //console.log('Dialog received profile:', profile);
        if (profile) {
            setEditableData({
                admin_id: profile.admin_id || '',
                name: profile.name || '',
                email: profile.email || '',
                mobile: profile.mobile || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                pincode: profile.pincode || '',
                dob: profile.dob || '',
                profile_image: null,
            });
        }
    }, [profile, isOpen]);


    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        if (type === "file") {
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

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        Object.keys(editableData).forEach(key => {
            const value = editableData[key as keyof EditableProfileData];
            // Do not append admin_id to the form data as it's used in the URL, not the body
            if (key === 'admin_id') return;

            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Profile Updated!",
                    description: data.message || "Your profile has been updated successfully.",
                    className: 'bg-green-500 text-white'
                });
                onProfileUpdate(); // Refetch profile data
                onClose(); // Close the dialog
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
    
    if (!profile) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-[calc(100vw-2rem)] p-0 bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-4 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold text-foreground">Edit Profile</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update your personal information below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField
                            id="edit-admin-id"
                            label="Admin ID"
                            name="admin_id"
                            placeholder="Admin ID"
                            icon={Key}
                            value={editableData.admin_id || ''}
                            onChange={() => {}}
                            readOnly
                        />
                         <InputField
                            id="edit-profile-image"
                            label="Profile Image"
                            name="profile_image"
                            type="file"
                            icon={Camera}
                            onChange={handleEditChange}
                            value={""}
                        />
                        <InputField
                            id="edit-name"
                            label="Name"
                            name="name"
                            placeholder="John Doe"
                            icon={User}
                            value={editableData.name || ''}
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
                            value={editableData.email || ''}
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
                            value={editableData.mobile || ''}
                            onChange={handleEditChange}
                            required
                        />
                         <InputField
                            id="edit-dob"
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            icon={Calendar}
                            value={editableData.dob || ''}
                            onChange={handleEditChange}
                        />
                        <div className="md:col-span-2">
                           <InputField
                                id="edit-address"
                                label="Address"
                                name="address"
                                value={editableData.address || ''}
                                onChange={handleEditChange}
                                required
                            >
                                <Textarea className="pl-10 pr-4 min-h-[80px]" />
                            </InputField>
                        </div>
                        <InputField
                            id="edit-city"
                            label="City"
                            name="city"
                            placeholder="Mumbai"
                            icon={Home}
                            value={editableData.city || ''}
                            onChange={handleEditChange}
                            required
                        />
                        <InputField
                            id="edit-state"
                            label="State"
                            name="state"
                            icon={MapPin}
                            value={editableData.state || ''}
                            onChange={handleEditChange}
                            required
                        />
                        <InputField
                            id="edit-pincode"
                            label="Pincode"
                            name="pincode"
                            placeholder="400001"
                            icon={Hash}
                            value={editableData.pincode || ''}
                            onChange={handleEditChange}
                            required
                        />
                    </div>
                     <DialogFooter className="mt-8 pt-4 border-t flex-shrink-0 gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}