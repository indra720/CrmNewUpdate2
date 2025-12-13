'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, CheckCircle, PlusCircle, Pencil } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const mockProjects = [
    { id: 1, name: "Project Alpha", message: "Lorem ipsum dolor sit amet", created_date: "2025-10-15" },
    { id: 2, name: "Beta Upgrade", message: "Consectetur adipiscing elit", created_date: "2025-10-16" },
    { id: 3, name: "Gamma API", message: "New backend integrations", created_date: "2025-10-17" },
];

export default function ProjectPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [search, setSearch] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setFilteredProjects(
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.message.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, projects]);

  const handleEditClick = () => {
    // In a real app, you would handle the edit logic here.
    // For now, we just show the success message.
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Project Edit</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 w-full"
              />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S.N.</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.message}</TableCell>
                      <TableCell>{project.created_date}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={handleEditClick}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Project</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No matching results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="items-center">
            <CheckCircle className="text-green-600 w-16 h-16" />
            <DialogTitle className="text-2xl font-bold text-green-700 pt-2">Oh Yeah!</DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground pb-4">
            Project updated successfully!
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setShowSuccessModal(false)}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
