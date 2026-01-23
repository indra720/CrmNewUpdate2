'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Users,
  CheckSquare,
  BarChart3,
  Flag,
  Eye,
  Edit,
  Trash2,
  Clock,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock Data for Milestones History (based on Create Milestone fields)
const mockMilestones = [
  {
    id: 'm1',
    name: 'User Authentication Complete',
    code: 'PROJ-2024-001-M-482',
    project: 'PROJ-2024-001',
    sprint: 'Sprint 1: Auth Module',
    description: 'Implement and test complete user authentication flow including login, signup, and password reset.',
    type: 'Feature Release',
    priority: 'High',
    category: 'Frontend',
    targetDate: '2026-01-25',
    estimatedDuration: '3 days',
    owner: { value: 'alice', label: 'Alice Johnson' },
    completionPercent: 100,
    status: 'Completed',
    createdAt: '2026-01-20',
    successCriteria: [
      { id: 'c1', text: 'All core functionality implemented', checked: true },
      { id: 'c2', text: 'QA testing completed for login and signup', checked: true },
      { id: 'c3', text: 'Performance benchmarks met', checked: true },
    ],
  },
  {
    id: 'm2',
    name: 'API Integration Milestone',
    code: 'PROJ-2024-001-M-483',
    project: 'PROJ-2024-001',
    sprint: 'Sprint 2: UI Enhancements',
    description: 'Integrate third-party APIs for payment processing and user analytics.',
    type: 'Integration',
    priority: 'Medium',
    category: 'Backend',
    targetDate: '2026-02-02',
    estimatedDuration: '5 days',
    owner: { value: 'bob', label: 'Bob Smith' },
    completionPercent: 75,
    status: 'In Progress',
    createdAt: '2026-01-29',
    successCriteria: [
      { id: 'c4', text: 'Payment API endpoints fully functional', checked: true },
      { id: 'c5', text: 'Analytics dashboard connected', checked: true },
      { id: 'c6', text: 'Error handling for API failures', checked: false },
    ],
  },
  {
    id: 'm3',
    name: 'Database Migration Complete',
    code: 'PROJ-2024-002-M-101',
    project: 'PROJ-2024-002',
    sprint: 'Sprint 1: Backend Setup',
    description: 'Migrate legacy database to new schema with zero downtime.',
    type: 'Technical Debt',
    priority: 'Critical',
    category: 'Backend',
    targetDate: '2026-02-07',
    estimatedDuration: '4 days',
    owner: { value: 'charlie', label: 'Charlie Lee' },
    completionPercent: 40,
    status: 'Blocked',
    createdAt: '2026-02-01',
    successCriteria: [
      { id: 'c7', text: 'Schema migration script executed', checked: true },
      { id: 'c8', text: 'Data integrity verified post-migration', checked: false },
      { id: 'c9', text: 'Rollback plan tested', checked: false },
    ],
  },
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

type Milestone = {
  id: string;
  name: string;
  code: string;
  project: string;
  sprint: string;
  description: string;
  type: string;
  priority: string;
  category: string;
  targetDate: string;
  estimatedDuration: string;
  owner: { value: string; label: string };
  completionPercent: number;
  status: string;
  createdAt: string;
  successCriteria: SuccessCriterion[];
};

const statusColors: Record<string, string> = {
  'Not Started': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Blocked': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
};

const priorityColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-blue-100 text-blue-800',
  High: 'bg-yellow-100 text-yellow-800',
  Critical: 'bg-red-100 text-red-800',
};

export default function MilestoneHistoryPage() {
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>(mockMilestones);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOwner, setFilterOwner] = useState('All');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, filterStatus, filterOwner);
  };

  const handleFilterStatus = (status: string) => {
    setFilterStatus(status);
    applyFilters(searchTerm, status, filterOwner);
  };

  const handleFilterOwner = (owner: string) => {
    setFilterOwner(owner);
    applyFilters(searchTerm, filterStatus, owner);
  };

  const applyFilters = (search: string, status: string, owner: string) => {
    let results = mockMilestones;

    if (search) {
      results = results.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'All') {
      results = results.filter(m => m.status === status);
    }

    if (owner !== 'All') {
      results = results.filter(m => m.owner.value === owner);
    }

    setFilteredMilestones(results);
  };

  const handleViewDetails = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsDialogOpen(true);
  };

  const handleEdit = (milestone: Milestone) => {
    console.log('Edit milestone:', milestone.id);
    // Navigate to edit page or open edit dialog
  };

  const handleDelete = (milestone: Milestone) => {
    if (confirm(`Delete ${milestone.name}?`)) {
      console.log('Delete milestone:', milestone.id);
      // Remove from mock data or API call
    }
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
            <span className="font-medium text-foreground">Milestone History</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Milestone History</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search milestones..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={handleFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterOwner} onValueChange={handleFilterOwner}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Owners</SelectItem>
              {mockOwners.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Milestones Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Milestones Overview ({filteredMilestones.length})</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Advanced Filters
              </Button>
            </div>
          </CardTitle>
          <CardDescription>View and manage historical milestones across projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Project / Sprint</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMilestones.map((milestone) => (
                  <TableRow key={milestone.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-xs">{milestone.code}</TableCell>
                    <TableCell className="font-medium">{milestone.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{milestone.project}</div>
                        <div className="text-xs text-muted-foreground">{milestone.sprint}</div>
                      </div>
                    </TableCell>
                    <TableCell>{milestone.owner.label}</TableCell>
                    <TableCell>
                      <Badge className={priorityColors[milestone.priority]}>
                        {milestone.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(milestone.targetDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[milestone.status]}>
                        {milestone.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <Progress value={milestone.completionPercent} className="h-2" />
                        <div className="text-xs text-right mt-1">{milestone.completionPercent}%</div>
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(milestone)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(milestone)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(milestone)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMilestones.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">No milestones found</h3>
                <p className="mt-1">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[calc(100%-2rem)] max-h-[95vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>{selectedMilestone?.name}</DialogTitle>
            <DialogDescription>
              Detailed view of milestone {selectedMilestone?.code} from {selectedMilestone?.project}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Project</Label>
                    <p className="text-sm">{selectedMilestone?.project}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Sprint</Label>
                    <p className="text-sm">{selectedMilestone?.sprint}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{selectedMilestone?.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm">{selectedMilestone?.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm">{selectedMilestone?.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Estimated Duration</Label>
                    <p className="text-sm">{selectedMilestone?.estimatedDuration}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Ownership & Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Owner</Label>
                      <p className="text-sm">{selectedMilestone?.owner.label}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Target Date</Label>
                      <p className="text-sm">{new Date(selectedMilestone?.targetDate || '').toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Created</Label>
                      <p className="text-sm">{new Date(selectedMilestone?.createdAt || '').toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Progress & Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge className={priorityColors[selectedMilestone?.priority || '']}>
                        {selectedMilestone?.priority}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={statusColors[selectedMilestone?.status || '']}>
                        {selectedMilestone?.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Completion</Label>
                      <div className="mt-1">
                        <Progress value={selectedMilestone?.completionPercent || 0} />
                        <p className="text-xs text-right mt-1">
                          {selectedMilestone?.completionPercent}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  Success Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {selectedMilestone?.successCriteria.map((criterion) => (
                      <Collapsible key={criterion.id}>
                        <div className="flex items-start gap-3 p-3 border rounded-md">
                          <Checkbox
                            id={criterion.id}
                            checked={criterion.checked}
                            disabled
                          />
                          <div className="flex-1 space-y-1">
                            <CollapsibleTrigger asChild>
                              <Label
                                htmlFor={criterion.id}
                                className="cursor-pointer text-sm font-medium hover:underline"
                              >
                                {criterion.text}
                              </Label>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="text-sm text-muted-foreground pl-6 mt-1">
                              {criterion.checked ? '✓ Achieved' : '○ Pending'}
                            </CollapsibleContent>
                          </div>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedMilestone) handleEdit(selectedMilestone);
                setIsDialogOpen(false);
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}