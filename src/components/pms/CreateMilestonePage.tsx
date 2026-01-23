'use client';

import { useState, useEffect } from 'react';
import {
  PlusCircle,
  LayoutGrid,
  ChevronRight,
  History,
  Info,
  Tags,
  Calendar,
  CheckSquare,
  Users,
  Link as LinkIcon,
  BarChart3,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MilestoneHistoryPage from './MileStponeHistory';


// Mock Data (should be replaced with actual data fetching)
const mockSprints = [
  { id: '1', name: 'Sprint 1: Auth Module', project: 'PROJ-2024-001', start: '2026-01-22', end: '2026-01-28' },
  { id: '2', name: 'Sprint 2: UI Enhancements', project: 'PROJ-2024-001', start: '2026-01-29', end: '2026-02-04' },
  { id: '3', name: 'Sprint 1: Backend Setup', project: 'PROJ-2024-002', start: '2026-02-01', end: '2026-02-07' },
];

const mockOwners = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Lee' },
  { value: 'diana', label: 'Diana Patel' },
];

type SuccessCriterion = {
  id: string;
  text: string;
  checked: boolean;
};

export default function CreateMilestonePage() {
  const [formData, setFormData] = useState({
    parentSprint: '1',
    parentProject: 'PROJ-2024-001',
    milestoneName: '',
    milestoneCode: 'PROJ-2024-001-M-482',
    description: '',
    milestoneType: 'Feature Release',
    priority: 'Medium',
    category: 'Frontend',
    targetDate: '2026-01-25',
    estimatedDuration: '3',
    milestoneOwner: 'bob',
    completionPercent: 0,
    status: 'Not Started',
  });

  const [successCriteria, setSuccessCriteria] = useState<SuccessCriterion[]>([
    { id: 'c1', text: 'All core functionality implemented', checked: false },
    { id: 'c2', text: 'QA testing completed for login and signup', checked: false },
    { id: 'c3', text: 'Performance benchmarks met', checked: false },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
   

  const handleopenhistoryPange=()=>{
      <MilestoneHistoryPage/>
  }

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    handleInputChange(name, value);
    if (name === 'parentSprint') {
      const sprint = mockSprints.find(s => s.id === value);
      if (sprint) {
        handleInputChange('parentProject', sprint.project);
        handleInputChange('milestoneCode', `${sprint.project}-M-${Math.floor(Math.random() * 900) + 100}`);
        handleInputChange('targetDate', sprint.start);
      }
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSuccessCriteria(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };
  
  const handleSubmit = () => {
    // Add validation logic here
    console.log('Form Submitted', { ...formData, successCriteria });
    setIsDialogOpen(false);
    // You would typically show a toast notification here
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 bg-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Projects</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground">Milestone</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Milestone Management</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleopenhistoryPange}>
            <History className="w-4 h-4" />
            Milestone History
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                <PlusCircle className="w-4 h-4" />
                Create Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[calc(100%-2rem)]  max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl hide-scrollbar">
              <DialogHeader className=''>
                <DialogTitle className=''>Create New Milestone</DialogTitle>
                <DialogDescription>
                  Define a new milestone to track progress towards your project goals.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parentSprint">Parent Sprint</Label>
                          <Select name="parentSprint" value={formData.parentSprint} onValueChange={(value) => handleSelectChange('parentSprint', value)}>
                            <SelectTrigger id="parentSprint"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {mockSprints.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.project})</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="parentProject">Parent Project</Label>
                          <Input id="parentProject" value={formData.parentProject} readOnly className="bg-slate-100" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="milestoneName">Milestone Name</Label>
                        <Input id="milestoneName" name="milestoneName" value={formData.milestoneName} onChange={(e) => handleInputChange('milestoneName', e.target.value)} placeholder="e.g., User Authentication Complete" />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Describe the purpose of this milestone" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-primary" /> Success Criteria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {successCriteria.map(criterion => (
                          <div key={criterion.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50">
                            <Checkbox id={criterion.id} checked={criterion.checked} onCheckedChange={() => handleCheckboxChange(criterion.id)} />
                            <Input
                              value={criterion.text}
                              onChange={(e) => setSuccessCriteria(prev => prev.map(c => c.id === criterion.id ? { ...c, text: e.target.value } : c))}
                              className="text-sm border-none bg-transparent focus-visible:ring-0"
                            />
                          </div>
                        ))}
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setSuccessCriteria(prev => [...prev, { id: `c-${Date.now()}`, text: 'New Criterion', checked: false }])}>
                        <PlusCircle className="w-4 h-4" /> Add Criterion
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                {/* Right Column */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Tags className="w-5 h-5 text-primary" /> Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="milestoneCode">Milestone Code</Label>
                        <Input id="milestoneCode" value={formData.milestoneCode} readOnly className="bg-slate-100 font-mono text-xs" />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                          <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="targetDate">Target Date</Label>
                        <Input id="targetDate" name="targetDate" type="date" value={formData.targetDate} onChange={(e) => handleInputChange('targetDate', e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Ownership</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Label htmlFor="milestoneOwner">Milestone Owner</Label>
                      <Select name="milestoneOwner" value={formData.milestoneOwner} onValueChange={(value) => handleSelectChange('milestoneOwner', value)}>
                        <SelectTrigger id="milestoneOwner"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {mockOwners.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                          <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Blocked">Blocked</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Completion: {formData.completionPercent}%</Label>
                        <Progress value={formData.completionPercent} className="mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                  <Flag className="w-4 h-4 mr-2" /> Save Milestone
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* This is where you would display the list of existing milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Milestones</CardTitle>
          <CardDescription>A list of milestones for the selected project will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Milestone list view coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}