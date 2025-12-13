'use client';

import React, { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useSearchParams } from 'next/navigation';

const AddSellForAssociateContent = () => {
  const searchParams = useSearchParams();
  const associateId = searchParams.get('associate_id');

  const [form, setForm] = useState({
    project_name: "",
    plot_number: "",
    date: "",
    size_in_gaj: "",
  });

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!associateId) {
      toast({
        title: "Error!",
        description: "Associate ID not found.",
        variant: "destructive",
      });
      return;
    }
    const token = localStorage.getItem("authToken")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/add-sell-freelancer/${associateId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          date: form.date,
          // Add other form fields here as needed by the API
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add sell');
      }

      toast({
        title: "Success!",
        description: "Sell added successfully for the associate.",
        className: 'bg-green-500 text-white',
      });
      setForm({
        project_name: "",
        plot_number: "",
        date: "",
        size_in_gaj: "",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to add sell.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Add Sell for Associate</h1>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/superadmin/users/associates">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Back</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>


      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project_name">Project Name</Label>
                  <Input id="project_name" type="text" name="project_name" value={form.project_name} onChange={handleChange} placeholder="Enter project name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot_number">Plot Number</Label>
                  <Input id="plot_number" type="text" name="plot_number" value={form.plot_number} onChange={handleChange} placeholder="Enter plot number" required />
                </div>
              
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size_in_gaj">Size(Gaj)</Label>
                  <Input id="size_in_gaj" type="text" name="size_in_gaj" value={form.size_in_gaj} onChange={handleChange} placeholder="Enter size in Gaj" required />
                </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddSellForAssociatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddSellForAssociateContent />
    </Suspense>
  );
}
