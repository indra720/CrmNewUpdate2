'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, CheckCircle, PlusCircle, Pencil, Plus, Minus, User, MessageSquare, Youtube, Calendar } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  id: number;
  name: string;
  message: string;
  youtube_link: string;
  media_file: string;
  created_date: string;
  updated_date: string;
  user: number;
  admin: number | null;
  team_leader: number | null;
  staff: number | null;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    message: '', 
    youtube_link: '', 
    media_file: null as File | null 
  });
  const [editProject, setEditProject] = useState({ 
    name: '', 
    message: '', 
    youtube_link: '', 
    media_file: null as File | null 
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/projects/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      //console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setFilteredProjects(
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.message.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, projects]);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setEditProject({
      name: project.name,
      message: project.message,
      youtube_link: project.youtube_link,
      media_file: null
    });
    setIsEditFormOpen(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', editProject.name);
      formData.append('message', editProject.message);
      formData.append('youtube_link', editProject.youtube_link);
      if (editProject.media_file) {
        formData.append('media_file', editProject.media_file);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/project/edit/${editingProject.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        setIsEditFormOpen(false);
        setEditingProject(null);
        setShowSuccessModal(true);
        fetchProjects(); // Refresh data after update
      }
    } catch (error) {
      //console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', newProject.name);
      formData.append('message', newProject.message);
      formData.append('youtube_link', newProject.youtube_link);
      if (newProject.media_file) {
        formData.append('media_file', newProject.media_file);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/projects/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProjects([...projects, data]);
        setNewProject({ name: '', message: '', youtube_link: '', media_file: null });
        setIsAddFormOpen(false);
        setShowSuccessModal(true);
        fetchProjects(); // Refresh data after add
      }
    } catch (error) {
      //console.error('Error adding project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Project Edit</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-row items-center justify-between gap-2 px-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 w-full md:w-64 lg:w-80"
              />
            </div>
            <Button 
              onClick={() => setIsAddFormOpen(true)}
              className="flex-shrink-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Add Project</span>
              <span className="inline md:hidden">Add</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg rounded-2xl ">
        <CardContent>
          <div className="rounded-md border my-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">S.N.</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Message</TableHead>
                  <TableHead className="hidden md:table-cell w-1/4">YouTube Link</TableHead>
                  <TableHead className="hidden sm:table-cell w-32 text-center">Created Date</TableHead>
                  <TableHead className="w-16 text-center">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableCell className="text-center">
                          <div className="sm:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600 h-8 w-8"
                              onClick={() => toggleRow(project.id)}
                            >
                              {expandedRowId === project.id ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="hidden sm:block">{index + 1}</div>
                        </TableCell>
                        <TableCell className="font-medium max-w-md truncate">
                          {project.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell max-w-md truncate">
                          {project.message}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-md truncate">
                          <a href={project.youtube_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block truncate">
                            {project.youtube_link}
                          </a>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center">
                          {new Date(project.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(project)}>
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

                      {expandedRowId === project.id && (
                        <TableRow className="sm:hidden">
                          <TableCell colSpan={6} className="p-0">
                            <div className="p-4">
                              <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {project.media_file ? (
                                      <img 
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/${project.media_file}`} 
                                        alt="Project" 
                                        className="w-full h-full object-cover rounded-full" 
                                      />
                                    ) : (
                                      <PlusCircle className="h-5 w-5 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-base">{project.name}</h3>
                                  </div>
                                </div>
                                <div className="p-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <p className="text-sm text-foreground leading-relaxed">{project.message}</p>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Youtube className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <a 
                                      href={project.youtube_link} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm text-blue-600 hover:underline break-words"
                                    >
                                      {project.youtube_link}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-foreground">{new Date(project.created_date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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
            <div className="animate-bounce">
              <CheckCircle className="text-green-600 w-16 h-16" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700 pt-2 animate-pulse">Fantastic!</DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground pb-4 animate-fade-in">
            Project saved successfully!
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
              onClick={() => setShowSuccessModal(false)}
            >
              Amazing!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newProject.message}
                onChange={(e) => setNewProject({ ...newProject, message: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="youtubeLink">YouTube Link</Label>
              <Input
                id="youtubeLink"
                type="url"
                value={newProject.youtube_link}
                onChange={(e) => setNewProject({ ...newProject, youtube_link: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mediaFile">Media File</Label>
              <Input
                id="mediaFile"
                type="file"
                accept="image/*"
                onChange={(e) => setNewProject({ ...newProject, media_file: e.target.files?.[0] || null })}
              />
            </div>
            <DialogFooter className='gap-2'>
              <Button type="button" variant="outline" onClick={() => setIsAddFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProject} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editProjectName">Project Name</Label>
              <Input
                id="editProjectName"
                value={editProject.name}
                onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editMessage">Message</Label>
              <Textarea
                id="editMessage"
                value={editProject.message}
                onChange={(e) => setEditProject({ ...editProject, message: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editYoutubeLink">YouTube Link</Label>
              <Input
                id="editYoutubeLink"
                type="url"
                value={editProject.youtube_link}
                onChange={(e) => setEditProject({ ...editProject, youtube_link: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editMediaFile">Media File</Label>
              <Input
                id="editMediaFile"
                type="file"
                accept="image/*"
                onChange={(e) => setEditProject({ ...editProject, media_file: e.target.files?.[0] || null })}
              />
            </div>
            <DialogFooter className='gap-2'>
              <Button type="button" variant="outline" onClick={() => setIsEditFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}