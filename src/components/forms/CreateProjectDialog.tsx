'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function CreateProjectDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  // State to manage loading status during API call
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned',
    startDate: '',
    endDate: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // The function is now 'async' to allow using 'await' for the API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Disable button and show loading text

    // --- Validation Section ---
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Project Name cannot be empty.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    if (!formData.startDate) {
      toast({
        title: "Error",
        description: "Start Date is required.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // --- API Integration Section ---
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const API_ENDPOINT = `${API_BASE_URL}/api/projects/projects/`;

    // Prepare the data in the format the API expects
    const postData = {
      name: formData.name,
      description: formData.description || null,
      start_date: formData.startDate,
      end_date: formData.endDate || null,
      status: formData.status,
      is_deleted: false,
      is_active: true,
    };

    const token = localStorage.getItem('authToken');


    try {
      // Use 'fetch' to send the POST request
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If your API requires a token, add it here like this:
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(postData), // Convert JS object to JSON string
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Backend 400 Error:", errorData);

        throw new Error(
          Object.values(errorData).flat().join(" ")
        );
      }


      const result = await response.json();
      console.log('Project created successfully:', result);

      toast({
        title: 'Project Created',
        description: `${formData.name} created successfully.`,
      });

      // Reset form and close the modal on success
      setFormData({
        name: '',
        description: '',
        status: 'planned',
        startDate: '',
        endDate: '',
      });
      setOpen(false);

    } catch (error: any) {
      // Handle any errors that occurred during the fetch
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: `Failed to create project: ${error.message || 'Something went wrong.'}`,
        variant: 'destructive',
      });
    } finally {
      // This will run whether the request succeeded or failed
      setIsLoading(false); // Re-enable the button
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Project name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          <Textarea
            placeholder="Project description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <Select
            value={formData.status}
            onValueChange={(v) => handleChange('status', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
            />

            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            {/* Disable button and change text when loading */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
