'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Helper function to get icon colors based on title
const getIconColors = (title: string) => {
  switch (title) {
    case 'Completed Projects':
      return { bg: 'bg-blue-500', text: 'text-white' };
    case 'Active Projects':
      return { bg: 'bg-green-500', text: 'text-white' };
    case 'Planned Projects':
      return { bg: 'bg-gray-500', text: 'text-white' };
    case 'Total Projects':
      return { bg: 'bg-orange-500', text: 'text-white' };
    default:
      return { bg: 'bg-gray-400', text: 'text-white' }; // Default color
  }
};

export const StatsCard = ({ title, value, icon: Icon, trend }) => {
  const { bg, text } = getIconColors(title); // Get colors based on card title

  return (
    <Card className='hover:scale-105 duration-500 shadow-md'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={cn("p-3 rounded-full shadow-md", bg, text)}> {/* Dynamic styling */}
            <Icon className="h-5 w-5" /> {/* Slightly larger icon */}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-2"> {/* New flex container */}
          <div className="text-2xl font-bold">{value}</div> {/* Counting */}
          {trend && (
            <p className={cn(
              "flex items-center text-sm font-medium", // Adjusted text size, aligned
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              {trend.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />} {/* Adjusted icon size */}
              {trend.value}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
