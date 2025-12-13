
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Flag, Phone, Mail, MessageSquare } from "lucide-react";

export default function AddLeadPage() {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    mobile: "",
    email: "",
    description: "",
  });

  const { toast } = useToast();

  const statuses = [
    "Leads",
    "Interested",
    "Not Interested",
    "Other Location",
    "Not Picked",
    "Lost",
    "Visit",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("Form Submitted:", formData);
    toast({
        title: "Lead Added!",
        description: `${formData.name} has been successfully added.`,
        className: 'bg-green-500 text-white'
    });
    // Reset form
    setFormData({
        name: "",
        status: "",
        mobile: "",
        email: "",
        description: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create a New Lead</CardTitle>
          <CardDescription>Fill out the form below to add a new lead to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium"><User className="w-4 h-4" /> Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                maxLength={30}
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2 text-sm font-medium"><Flag className="w-4 h-4" /> Status</Label>
                <Select
                    value={formData.status}
                    onValueChange={handleSelectChange}
                    required
                >
                    <SelectTrigger id="status" className="h-11">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                         {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                            {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4" /> Mobile</Label>
              <Input
                type="number"
                id="mobile"
                name="mobile"
                placeholder="e.g. 9876543210"
                required
                value={formData.mobile}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4" /> Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="w-4 h-4" /> Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add any relevant notes or details here..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="resize-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="w-full md:w-auto text-base py-3 px-8 h-auto">
                Add Lead
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
