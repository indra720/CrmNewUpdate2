import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'increase' | 'decrease';
  changeText?: string;
  subtext?: string;
}

export function StatCard({ title, value, icon: Icon, change, changeType, subtext, changeText = "than last month" }: StatCardProps) {
  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <div className='flex justify-between items-center'>
            <CardTitle className="text-base font-semibold text-muted-foreground">{title}</CardTitle>
             {/* <select className="text-sm border-none bg-transparent">
                <option>This month</option>
            </select> */}
        </div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardHeader>
      <CardContent className="p-6 pt-0">
          <div className="text-3xl font-bold mb-4">${value}</div>
            <p className={`text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {changeType === 'increase' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {change} {changeText}
            </p>

            <Button variant="link" className="p-0 mt-4 text-primary">
                View report
                <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
      </CardContent>
    </Card>
  );
}
