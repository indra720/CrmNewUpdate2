'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

const initialData = {
  columns: {
    'new': {
      id: 'new',
      title: 'New',
      leads: [
        { id: 'lead-1', name: 'John Doe', priority: 'High', assignedTo: 'SA', avatar: 'https://picsum.photos/seed/1/40/40' },
        { id: 'lead-2', name: 'Alex Ray', priority: 'Low', assignedTo: 'SA', avatar: 'https://picsum.photos/seed/2/40/40' },
      ],
    },
    'contacted': {
      id: 'contacted',
      title: 'Contacted',
      leads: [
        { id: 'lead-3', name: 'Kate Williams', priority: 'Medium', assignedTo: 'SA', avatar: 'https://picsum.photos/seed/3/40/40' },
      ],
    },
    'interested': {
      id: 'interested',
      title: 'Interested',
      leads: [
        { id: 'lead-4', name: 'Mike Ross', priority: 'High', assignedTo: 'SA', avatar: 'https://picsum.photos/seed/4/40/40' },
        { id: 'lead-5', name: 'Rachel Zane', priority: 'High', assignedTo: 'SA', avatar: 'https://picsum.photos/seed/5/40/40' },
      ],
    },
    'lost': {
      id: 'lost',
      title: 'Lost',
      leads: [],
    },
  },
  columnOrder: ['new', 'contacted', 'interested', 'lost'],
};

const priorityColors: { [key: string]: string } = {
  High: 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Medium: 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Low: 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
};


const LeadCard = ({ lead }: { lead: any }) => (
  <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer rounded-lg">
    <CardContent className="p-3">
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm">{lead.name}</p>
        <Badge className={`text-xs ${priorityColors[lead.priority]}`}>
          {lead.priority}
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-4">
        <Avatar className="h-6 w-6">
          <AvatarImage src={lead.avatar} />
          <AvatarFallback>{lead.assignedTo}</AvatarFallback>
        </Avatar>
        {/* Placeholder for more actions */}
      </div>
    </CardContent>
  </Card>
);

const KanbanColumn = ({ column, leads }: { column: any; leads: any[] }) => (
  <div className="bg-muted/50 rounded-lg p-3 w-72 flex-shrink-0">
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-md">{column.title}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
        </Button>
    </div>
    <div className="h-[calc(100vh-20rem)] overflow-y-auto pr-2">
      {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    </div>
  </div>
);

export function KanbanBoard() {
  const data = initialData;

  // Note: Drag and Drop functionality is not implemented yet.
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {data.columnOrder.map(columnId => {
        const column = data.columns[columnId as keyof typeof data.columns];
        const leads = column.leads;
        return <KanbanColumn key={column.id} column={column} leads={leads} />;
      })}
    </div>
  );
}
