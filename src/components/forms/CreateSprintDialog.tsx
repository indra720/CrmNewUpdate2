  'use client';

  import React, { useState, useEffect, useMemo } from 'react';
  import {
    Plus,
    Calendar,
    Users,
    Target,
    Settings2,
    Loader2, // Added Loader2 icon for loading state
  } from 'lucide-react';
  import { format, addWeeks } from 'date-fns';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import { Badge } from '@/components/ui/badge';
  import { Checkbox } from '@/components/ui/checkbox';
  import { Textarea } from '@/components/ui/textarea';

  // --- Centralized Types ---
  import { User, Project } from '@/types';
import { Sprint, SprintType } from '@/components/pms/sprint-types';

  // --- Centralized Mock Data ---
  import { mockUsers } from '@/components/pms/sprint-mock-data';
  import { createSprint, fetchProjectMembersForProjectCard, fetchProjects, fetchUsers } from '@/lib/api'; // Import the new API function

  interface CreateSprintDialogProps {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (open: boolean) => void;
    onSaveSprint: (sprintData: Partial<Sprint>) => Promise<void>;
    sprintsLength: number;
    allSprints: Sprint[];
  }

  export function CreateSprintDialog({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    onSaveSprint,
    sprintsLength,
    allSprints,
  }: CreateSprintDialogProps) {
    // INTERNAL STATE FOR THE FORM AND ITS VALIDATION
    const [newSprint, setNewSprint] = useState<Partial<Sprint>>({
      sprint_type: 'development',
      duration_weeks: 2,
      working_days: [1, 2, 3, 4, 5],
      status: 'Draft',
      settings: {
        allowTaskOverflow: false,
        autoClose: true,
        allowScopeChange: false,
        freezeWhenActive: true
      },
      teamMembers: [],
      capacity: {},
      sprint_number: '' // Initialize sprint_number
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [apiError, setApiError] = useState<string | null>(null); // New API error state


    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
      const loadProjects = async () => {
        setProjectsLoading(true);
        setProjectsError(null);

        try {
          const data = await fetchProjects();
          setProjects(data);
        } catch (error: any) {
          setProjectsError((error as Error).message || "Failed to load projects");
        } finally {
          setProjectsLoading(false);
        }
      };

      // Dialog open hone par fetch karo (best practice)
      if (isCreateDialogOpen) {
        loadProjects();
      }
    }, [isCreateDialogOpen]);


    

    useEffect(() => {

      if (!isCreateDialogOpen || !newSprint.projectId) { // Add newSprint.projectId check
        setUsers([]); // Clear users if no project selected or dialog closed
        return;
      };

      const loadUsers = async () => {
        try {
          const data = await fetchProjectMembersForProjectCard(newSprint.projectId);
          // Map ProjectMember to User interface
                      const mappedUsers: User[] = data.map(member => ({
                      id: member.id, // Assign the ProjectMember's UUID as the User's ID for local use
                      backendId: member.user, // Assign the numeric user ID from ProjectMember for backend calls
                      name: member.user_name,
                      role: member.role,
                      is_team_leader: member.role === 'team_leader',
                      is_it_staff: member.role === 'it_staff',
                      is_admin: member.role === 'admin',
                      is_superuser: member.role === 'super_user',
                      is_staff_new: member.role === 'staff' || member.role === 'it_staff' || member.role === 'team_leader',
                      avatar: undefined
                    }));          setUsers(mappedUsers);
        } catch (error) {
          console.error("Failed to load project members:", error);
          setUsers([]); // Clear users on error
        }
      };

      loadUsers();

    }, [isCreateDialogOpen, newSprint.projectId]); // Add newSprint.projectId to dependencies

    // for scrmMaster dropdown
    const scrumMasters = useMemo(() => {
      const allowedRoles = ['it_staff', 'staff', 'team_leader'];
      return users.filter(user =>
        allowedRoles.includes(user.role)
      );
    }, [users]);

    //  for productOwner dropdown
    const productOwners = useMemo(() => {
      const allowedRoles = ['super_user', 'admin'];
      return users.filter(user =>
        allowedRoles.includes(user.role)
      );
    }, [users]);






    // Derived Values
    const totalCapacity = useMemo(() => {
      return Object.values(newSprint.capacity || {}).reduce((sum, val) => sum + (val || 0), 0);
    }, [newSprint.capacity]);

    // Date Calculation logic (using internal newSprint state)
    useEffect(() => {
      if (newSprint.start_date && newSprint.duration_weeks) {
        const end = addWeeks(new Date(newSprint.start_date), newSprint.duration_weeks);
        setNewSprint(prev => ({ ...prev, end_date: format(end, 'yyyy-MM-dd') }));
      }
    }, [newSprint.start_date, newSprint.duration_weeks]);

    // Reset form and errors when dialog opens/closes
    useEffect(() => {
      if (isCreateDialogOpen) {
        setNewSprint({
          sprint_type: 'development',
          duration_weeks: 2,
          working_days: [1, 2, 3, 4, 5],
          status: 'Draft',
          settings: {
            allowTaskOverflow: false,
            autoClose: true,
            allowScopeChange: false,
            freezeWhenActive: true
          },
          teamMembers: [],
          capacity: {},
          sprint_number: '' // Initialize sprint_number on reset
        });
        setErrors({}); // Clear validation errors
        setApiError(null); // Clear API errors
      }
    }, [isCreateDialogOpen]);


    // INTERNAL VALIDATION FUNCTION FOR THIS FORM
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      if (!newSprint.projectId) newErrors.projectId = "Project is required";
      if (!newSprint.name) newErrors.name = "Sprint name is required";
      if (!newSprint.sprint_number?.trim()) newErrors.sprint_number = "Sprint number is required and cannot be blank"; // Added validation
      if (!newSprint.start_date) newErrors.start_date = "Start date is required";
      if (!newSprint.teamMembers?.length) newErrors.teamMembers = "At least one team member required";

      // Check for overlapping active sprints (uses allSprints from props)
      const activeExists = allSprints.some(s => s.status === 'Active' && s.projectId === newSprint.projectId);
      if (activeExists && newSprint.status === 'Active') { // If the new sprint is intended to be 'Active'
        newErrors.status = "Only one active sprint allowed per project";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // HANDLER FOR FORM SUBMISSION WITHIN THE DIALOG
    const handleDialogSubmit = async () => { // Made async
      setApiError(null); // Clear any previous API errors
      if (!validateForm()) {
        return; // Stop if validation fails
      }

      setIsLoading(true); // Set loading state
      try {
        const sprintToCreate = {
          ...newSprint,
          // Default to Planned status, parent can change this later
          status: newSprint.status || 'Planned',
          totalCapacity: totalCapacity,
          // `number` for API payload - pass `sprintsLength` for dynamic generation in API
          sprintsLength: sprintsLength, // Pass sprintsLength so API helper can construct 'sprint_number'
        };

        // Call the API function
        const createdSprint = await createSprint(sprintToCreate, users);

        // If API call is successful, then inform the parent and close
        onSaveSprint(createdSprint); // Pass the API response
        setIsCreateDialogOpen(false); // Close dialog

      } catch (error: any) {
        console.error("Failed to create sprint via API:", error);
        setApiError((error as Error).message || "An unexpected error occurred during sprint creation."); // Display API error
      } finally {
        setIsLoading(false); // Always reset loading state
      }
    };

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Sprint
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl w-[95vw]  h-[95vh] overflow-y-auto rounded-xl hide-scrollbar">
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogDescription>
              Define the timeline, team, and capacity for your next iteration.
            </DialogDescription>
          </DialogHeader>
          {apiError && ( // Display API error message if present
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">API Error!</strong>
              <span className="block sm:inline"> {apiError}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* A. Sprint Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                <Target className="w-4 h-4" /> Sprint Info
              </h3>
              <div className="space-y-2">
                <Label className={errors.projectId ? "text-red-500" : ""}>Parent Project</Label>
                <Select
                  value={newSprint.projectId || ''}
                  onValueChange={(v) => setNewSprint({ ...newSprint, projectId: v })}
                >
                  <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
                    <SelectValue
                      placeholder={
                        projectsLoading
                          ? "Loading projects..."
                          : projectsError
                            ? "Failed to load"
                            : "Select Project"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {projectsLoading && (
                      <div className="flex items-center gap-2 px-3 py-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    )}

                    {projectsError && (
                      <div className="px-3 py-2 text-sm text-red-500">
                        {projectsError}
                      </div>
                    )}

                    {!projectsLoading && !projectsError && projects.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.projectId && <p className="text-[10px] text-red-500">{errors.projectId}</p>}
              </div>
              <div className="space-y-2">
                <Label className={errors.name ? "text-red-500" : ""}>Sprint Name</Label>
                <Input
                  placeholder="e.g. Q1 Mobile Enhancements"
                  className={errors.name ? "border-red-500" : ""}
                  value={newSprint.name || ''}
                  onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                />
                {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={errors.sprint_number ? "text-red-500" : ""}>Sprint Number</Label>
                  <Input
                    placeholder="e.g. SP-001"
                    className={errors.sprint_number ? "border-red-500" : ""}
                    value={newSprint.sprint_number || ''}
                    onChange={(e) => setNewSprint({ ...newSprint, sprint_number: e.target.value })}
                  />
                  {errors.sprint_number && <p className="text-[10px] text-red-500">{errors.sprint_number}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Sprint Type</Label>
                  <Select
                    value={newSprint.sprint_type}
                    onValueChange={(v: SprintType) => setNewSprint({ ...newSprint, sprint_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="bugfix">Bugfix</SelectItem>
                      <SelectItem value="release">Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sprint Goal</Label>
                <Textarea
                  placeholder="What are we trying to achieve?"
                  value={newSprint.goal || ''}
                  onChange={(e) => setNewSprint({ ...newSprint, goal: e.target.value })}
                />
              </div>
            </div>

            {/* B. Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> Timeline
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (Weeks)</Label>
                  <Select
                    value={newSprint.duration_weeks?.toString()}
                    onValueChange={(v) => setNewSprint({ ...newSprint, duration_weeks: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Week</SelectItem>
                      <SelectItem value="2">2 Weeks</SelectItem>
                      <SelectItem value="3">3 Weeks</SelectItem>
                      <SelectItem value="4">4 Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={errors.start_date ? "text-red-500" : ""}>Start Date</Label>
                  <Input
                    type="date"
                    className={errors.start_date ? "border-red-500" : ""}
                    value={newSprint.start_date || ''}
                    onChange={(e) => setNewSprint({ ...newSprint, start_date: e.target.value })}
                  />
                  {errors.start_date && <p className="text-[10px] text-red-500">{errors.start_date}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Date (Auto)</Label>
                  <Input type="date" disabled value={newSprint.end_date || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Story Points Target</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={newSprint.story_points_target || ''}
                    onChange={(e) => setNewSprint({ ...newSprint, story_points_target: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} className="flex items-center gap-2">
                      <Checkbox
                        id={`day-${idx}`}
                        checked={newSprint.working_days?.includes(idx + 1)}
                        onCheckedChange={(checked) => {
                          const days = newSprint.working_days || [];
                          if (checked) setNewSprint({ ...newSprint, working_days: [...days, idx + 1] });
                          else setNewSprint({ ...newSprint, working_days: days.filter(d => d !== idx + 1) });
                        }}
                      />
                      <Label htmlFor={`day-${idx}`} className="text-xs">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* C. Team & Capacity */}
            <div className="md:col-span-2 space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                <Users className="w-4 h-4" /> Team & Capacity
                {errors.teamMembers && <Badge variant="destructive" className="ml-2 text-[8px] h-4">{errors.teamMembers}</Badge>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Scrum Master</Label>
                  <Select
                    value={newSprint.scrumMaster?.toString() || ''} // Ensure value is string for Select
                    onValueChange={(v) => {
                      const newScrumMasterId = v;
                      setNewSprint(prev => {
                        const newTeamMembers = new Set(prev.teamMembers || []);
                        // Remove previous scrumMaster if exists and is not the new one
                        if (prev.scrumMaster && prev.scrumMaster !== newScrumMasterId) {
                          newTeamMembers.delete(prev.scrumMaster);
                        }
                        // Add new scrumMaster
                        newTeamMembers.add(newScrumMasterId);

                        return {
                          ...prev,
                          scrumMaster: newScrumMasterId,
                          teamMembers: Array.from(newTeamMembers)
                        };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SM" />
                    </SelectTrigger>
                    <SelectContent>
                      {scrumMasters.map(u => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name}
                        </SelectItem>
                      ))}

                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product Owner</Label>
                  <Select
                    value={newSprint.productOwner?.toString() || ''} // Ensure value is string for Select
                    onValueChange={(v) => {
                      const newProductOwnerId = v;
                      setNewSprint(prev => {
                        const newTeamMembers = new Set(prev.teamMembers || []);
                        // Remove previous productOwner if exists and is not the new one
                        if (prev.productOwner && prev.productOwner !== newProductOwnerId) {
                          newTeamMembers.delete(prev.productOwner);
                        }
                        // Add new productOwner
                        newTeamMembers.add(newProductOwnerId);

                        return {
                          ...prev,
                          productOwner: newProductOwnerId,
                          teamMembers: Array.from(newTeamMembers)
                        };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {productOwners.map(u => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name}
                        </SelectItem>
                      ))}

                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Sprint Capacity</Label>
                  <div className="h-10 px-3 flex items-center bg-slate-100 rounded-md font-bold text-primary">
                    {totalCapacity} Hours
                  </div>
                </div>
              </div>
              <div className="border rounded-lg">
                {/* Responsive Header */}
                <div className="hidden md:flex bg-slate-50 border-b p-3 text-sm font-medium">
                  <div className="flex-1">Team Member</div>
                  <div className="flex-1">Role</div>
                  <div className="flex-1">Capacity (Hours)</div>
                </div>
                {/* Responsive Rows */}
                <div className="divide-y">
                  {users.map((u) => (
                    <div key={u.id} className="flex flex-col md:flex-row p-3 items-start md:items-center space-y-2 md:space-y-0">
                      <div className="w-full md:flex-1">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`member-${u.id}`}
                            checked={newSprint.teamMembers?.includes(u.id)}
                            disabled={u.id === newSprint.scrumMaster || u.id === newSprint.productOwner}
                            onCheckedChange={(checked) => {
                              const currentTeamMembers = new Set(newSprint.teamMembers || []);
                              if (checked) {
                                currentTeamMembers.add(u.id);
                                setNewSprint(prev => ({
                                  ...prev,
                                  teamMembers: Array.from(currentTeamMembers)
                                }));
                              } else {
                                currentTeamMembers.delete(u.id);
                                const updatedCapacity = { ...newSprint.capacity };
                                delete updatedCapacity[u.id];
                                setNewSprint(prev => ({
                                  ...prev,
                                  teamMembers: Array.from(currentTeamMembers),
                                  capacity: updatedCapacity
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={`member-${u.id}`} className="font-medium">{u.name}</Label>
                        </div>
                      </div>
                      <div className="w-full md:flex-1 pl-7 md:pl-0">
                        <span className="md:hidden font-semibold text-xs text-muted-foreground">Role: </span>
                        <span className="text-muted-foreground text-sm">
                          {u.id === newSprint.scrumMaster ? 'Scrum Master' :
                          u.id === newSprint.productOwner ? 'Product Owner' :
                          u.role}
                        </span>
                      </div>
                      <div className="w-full md:flex-1 pl-7 md:pl-0">
                        <span className="md:hidden font-semibold text-xs text-muted-foreground">Capacity: </span>
                        <Input
                          type="number"
                          className="h-8 w-24"
                          placeholder="0"
                          disabled={!newSprint.teamMembers?.includes(u.id)}
                          value={newSprint.capacity?.[u.id] || ''}
                          onChange={(e) => {
                            const cap = { ...newSprint.capacity };
                            cap[u.id] = parseInt(e.target.value) || 0;
                            setNewSprint({ ...newSprint, capacity: cap });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* D. Sprint Settings */}
            <div className="md:col-span-2 space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                <Settings2 className="w-4 h-4" /> Sprint Settings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="overflow" checked={newSprint.settings?.allowTaskOverflow} onCheckedChange={(v) => setNewSprint({ ...newSprint, settings: { ...newSprint.settings!, allowTaskOverflow: !!v } })} />
                  <Label htmlFor="overflow" className="text-xs leading-none">Task Overflow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="autoclose" checked={newSprint.settings?.autoClose} onCheckedChange={(v) => setNewSprint({ ...newSprint, settings: { ...newSprint.settings!, autoClose: !!v } })} />
                  <Label htmlFor="autoclose" className="text-xs leading-none">Auto Close</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="scope" checked={newSprint.settings?.allowScopeChange} onCheckedChange={(v) => setNewSprint({ ...newSprint, settings: { ...newSprint.settings!, allowScopeChange: !!v } })} />
                  <Label htmlFor="scope" className="text-xs leading-none">Scope Change</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="freeze" checked={newSprint.settings?.freezeWhenActive} onCheckedChange={(v) => setNewSprint({ ...newSprint, settings: { ...newSprint.settings!, freezeWhenActive: !!v } })} />
                  <Label htmlFor="freeze" className="text-xs leading-none">Freeze Active</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleDialogSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Show spinner if loading */}
              Create Sprint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }








  // {
  // project*	string($uuid)
  // title: Project
  // name*	string
  // title: Name
  // maxLength: 255
  // minLength: 1
  // sprint_number*	string
  // title: Sprint number
  // maxLength: 50
  // minLength: 1
  // sprint_type*	string
  // title: Sprint type
  // Enum:
  // [ development, bugfix, release ]
  // goal	string
  // title: Goal
  // start_date*	string($date)
  // title: Start date
  // duration_weeks	integer
  // title: Duration weeks
  // maximum: 9223372036854776000
  // minimum: 0
  // working_days	Working days{
  
  // }
  // story_points_target	integer
  // title: Story points target
  // maximum: 9223372036854776000
  // minimum: 0
  // allow_task_overflow	boolean
  // title: Allow task overflow
  // auto_close	boolean
  // title: Auto close
  // allow_scope_change	boolean
  // title: Allow scope change
  // freeze_when_active	boolean
  // title: Freeze when active
  // members*	[SprintMemberCreate{
  // user*	integer
  // title: User
  // role*	string
  // title: Role
  // Enum:
  // [ scrum_master, product_owner, developer, qa ]
  // capacity_hours	integer
  // title: Capacity hours
  // maximum: 9223372036854776000
  // minimum: 0
  
  // }]
  
  // }