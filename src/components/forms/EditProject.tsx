'use client';

import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
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
import { Project } from '@/types';

// These are the props the component will accept.
// It needs the `project` object to know what to edit.
interface EditProjectDialogProps {
  project: Project;
  onProjectUpdated: () => void;
  children: React.ReactNode;
}

// The component is renamed to reflect that it edits a project.
export function EditProjectDialog({ project, onProjectUpdated, children }: EditProjectDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // This state will hold the data from the form fields.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned',
    startDate: '',
    endDate: '',
  });

  // This `useEffect` hook runs when the dialog is opened.
  // It takes the data from the `project` prop and fills the form.
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        // The dates are formatted to 'YYYY-MM-DD' for the input field.
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [project, open]);

  // This function updates the state when you type in an input field.
  const handleChange = (name: string, value: string) => {
    setFormData((previousState) => ({ ...previousState, [name]: value }));
  };

  // This function runs when you click the "Save Changes" button.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation to make sure the name is not empty.
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Project Name cannot be empty.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Prepare the data for the API.
    const putData = {
      name: formData.name,
      description: formData.description,
      start_date: formData.startDate,
      end_date: formData.endDate || null,
      status: formData.status,
    };

    const token = localStorage.getItem('authToken');

    try {
      // Send the data to the API using a 'PUT' request to update the project.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/projects/${project.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(putData),
      });

      if (!response.ok) {
        throw new Error('Failed to update the project.');
      }

      toast({
        title: 'Project Updated',
        description: `'${formData.name}' has been updated successfully.`,
      });
      
      onProjectUpdated(); // Refresh data on the main page
      setOpen(false); // Close the dialog

    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: `Failed to update project: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {project.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <Input
              id="name"
              placeholder="Project name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              id="description"
              placeholder="Project description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
