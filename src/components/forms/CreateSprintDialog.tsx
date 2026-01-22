'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Calendar, 
  Users, 
  Target, 
  Settings2, 
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
import { Sprint, Project, User, SprintType } from '@/components/pms/sprint-types';

// --- Centralized Mock Data ---
import { mockProjects, mockUsers } from '@/components/pms/sprint-mock-data';

interface CreateSprintDialogProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  handleCreateSprint: () => void;
  newSprint: Partial<Sprint>;
  setNewSprint: React.Dispatch<React.SetStateAction<Partial<Sprint>>>;
  errors: Record<string, string>;
  sprintsLength: number; // To calculate new sprint ID
  allSprints: Sprint[]; // For active sprint validation
}

export function CreateSprintDialog({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  handleCreateSprint,
  newSprint,
  setNewSprint,
  errors,
  sprintsLength,
  allSprints,
}: CreateSprintDialogProps) {

  // Derived Values
  const totalCapacity = useMemo(() => {
    return Object.values(newSprint.capacity || {}).reduce((sum, val) => sum + (val || 0), 0);
  }, [newSprint.capacity]);

  // Date Calculation logic
  useEffect(() => {
    if (newSprint.startDate && newSprint.durationWeeks) {
      const end = addWeeks(new Date(newSprint.startDate), newSprint.durationWeeks);
      setNewSprint(prev => ({ ...prev, endDate: format(end, 'yyyy-MM-dd') }));
    }
  }, [newSprint.startDate, newSprint.durationWeeks]);


  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Sprint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto rounded-xl hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Define the timeline, team, and capacity for your next iteration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          {/* A. Sprint Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
              <Target className="w-4 h-4" /> Sprint Info
            </h3>
            <div className="space-y-2">
              <Label className={errors.projectId ? "text-red-500" : ""}>Parent Project</Label>
              <Select onValueChange={(v) => setNewSprint({ ...newSprint, projectId: v })}>
                <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })} 
              />
              {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sprint Number</Label>
                <Input disabled value={`SP-0${sprintsLength + 1}`} />
              </div>
              <div className="space-y-2">
                <Label>Sprint Type</Label>
                <Select defaultValue="Development" onValueChange={(v: SprintType) => setNewSprint({ ...newSprint, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Release">Release</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sprint Goal</Label>
              <Textarea placeholder="What are we trying to achieve?" onChange={(e) => setNewSprint({ ...newSprint, goal: e.target.value })} />
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
                <Select defaultValue="2" onValueChange={(v) => setNewSprint({ ...newSprint, durationWeeks: parseInt(v) })}>
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
                <Label className={errors.startDate ? "text-red-500" : ""}>Start Date</Label>
                <Input 
                  type="date" 
                  className={errors.startDate ? "border-red-500" : ""}
                  onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })} 
                />
                {errors.startDate && <p className="text-[10px] text-red-500">{errors.startDate}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End Date (Auto)</Label>
                <Input type="date" disabled value={newSprint.endDate || ''} />
              </div>
              <div className="space-y-2">
                <Label>Story Points Target</Label>
                <Input type="number" placeholder="20" onChange={(e) => setNewSprint({ ...newSprint, storyPointsTarget: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={day} className="flex items-center gap-2">
                    <Checkbox 
                      id={`day-${idx}`} 
                      checked={newSprint.workingDays?.includes(idx + 1)} 
                      onCheckedChange={(checked) => {
                        const days = newSprint.workingDays || [];
                        if (checked) setNewSprint({ ...newSprint, workingDays: [...days, idx + 1] });
                        else setNewSprint({ ...newSprint, workingDays: days.filter(d => d !== idx + 1) });
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
                <Select onValueChange={(v) => setNewSprint({ ...newSprint, scrumMaster: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SM" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product Owner</Label>
                <Select onValueChange={(v) => setNewSprint({ ...newSprint, productOwner: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
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
                {mockUsers.map((u) => (
                  <div key={u.id} className="flex flex-col md:flex-row p-3 items-start md:items-center space-y-2 md:space-y-0">
                    <div className="w-full md:flex-1">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={`member-${u.id}`}
                          checked={newSprint.teamMembers?.includes(u.id)}
                          onCheckedChange={(checked) => {
                            const members = newSprint.teamMembers || [];
                            if (checked) setNewSprint({ ...newSprint, teamMembers: [...members, u.id] });
                            else setNewSprint({ ...newSprint, teamMembers: members.filter(m => m !== u.id) });
                          }}
                        />
                        <Label htmlFor={`member-${u.id}`} className="font-medium">{u.name}</Label>
                      </div>
                    </div>
                    <div className="w-full md:flex-1 pl-7 md:pl-0">
                      <span className="md:hidden font-semibold text-xs text-muted-foreground">Role: </span>
                      <span className="text-muted-foreground text-sm">{u.role}</span>
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
                <Checkbox id="overflow" checked={newSprint.settings?.allowTaskOverflow} onCheckedChange={(v) => setNewSprint({...newSprint, settings: {...newSprint.settings!, allowTaskOverflow: !!v}})} />
                <Label htmlFor="overflow" className="text-xs leading-none">Task Overflow</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="autoclose" checked={newSprint.settings?.autoClose} onCheckedChange={(v) => setNewSprint({...newSprint, settings: {...newSprint.settings!, autoClose: !!v}})} />
                <Label htmlFor="autoclose" className="text-xs leading-none">Auto Close</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="scope" checked={newSprint.settings?.allowScopeChange} onCheckedChange={(v) => setNewSprint({...newSprint, settings: {...newSprint.settings!, allowScopeChange: !!v}})} />
                <Label htmlFor="scope" className="text-xs leading-none">Scope Change</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="freeze" checked={newSprint.settings?.freezeWhenActive} onCheckedChange={(v) => setNewSprint({...newSprint, settings: {...newSprint.settings!, freezeWhenActive: !!v}})} />
                <Label htmlFor="freeze" className="text-xs leading-none">Freeze Active</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSprint}>Create Sprint</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
