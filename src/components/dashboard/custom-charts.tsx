'use client';
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LabelList,
  Sector,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFA500', '#FF8042', '#AF19FF', '#FF1919'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background border border-border rounded-lg shadow-lg">
        <p className="text-lg font-bold text-foreground">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color }}>
            {pld.name}: {pld.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


export const BarChart = ({ data = [] }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={400}>
    <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: -20 }}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5att%" stopColor="#FFA500" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
      <XAxis 
        dataKey="name" 
        stroke="hsl(var(--muted-foreground))" 
        fontSize={12} 
        tickLine={false} 
        axisLine={false}
        angle={-45}
        tick={{ fill: 'hsl(var(--muted-foreground))',  textAnchor: 'end', }}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))" 
        fontSize={12} 
        tickLine={false} 
        axisLine={false}
        tick={{ fill: 'hsl(var(--muted-foreground))' }}
      />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
      <Legend 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ color: 'hsl(var(--foreground))', paddingTop: 50 }}      />
      <Bar dataKey="value" name="Productivity" fill="url(#colorUv)" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={false} />
    </RechartsBarChart>
  </ResponsiveContainer>
);

import { useIsMobile } from '@/hooks/use-mobile';

// ... (rest of the imports)

// ... (CustomTooltip and BarChart components remain the same)

const renderActiveShapeForDesktop = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name}: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const renderActiveShapeForMobile = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;

  return (
    <g>
      {/* Central Text Display */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        <tspan x={cx} dy="-1.2em" fontSize="16px" fontWeight="bold" fill={fill}>{payload.name}</tspan>
        <tspan x={cx} dy="1.5em" fontSize="14px" fill="#333">{`Value: ${value}`}</tspan>
        <tspan x={cx} dy="1.5em" fontSize="12px" fill="#999">{`(Rate: ${(percent * 100).toFixed(2)}%)`}</tspan>
      </text>

      {/* Original Sector for active slice pop-out */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Original Sector for outer ring */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* Original Path and Circle for the line effect */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
    </g>
  );
};

export const PieChart = ({ data = [] }: { data: any[] }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMobile = useIsMobile();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsPieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={isMobile ? renderActiveShapeForMobile : renderActiveShapeForDesktop}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export const FreelancerChart = ({ data = [] }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={400}>
    <RechartsBarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 40 }} barCategoryGap="20%">
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
      <XAxis 
        dataKey="name" 
        stroke="hsl(var(--muted-foreground))" 
        fontSize={12} 
        tickLine={false} 
        axisLine={false}
        angle={-45}
        tick={{ fill: 'hsl(var(--muted-foreground))', textAnchor: 'end' }}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))" 
        fontSize={12} 
        tickLine={false} 
        axisLine={false}
        tick={{ fill: 'hsl(var(--muted-foreground))' }}
      />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
      <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={COLORS[index % COLORS.length]} 
          />
        ))}
        <LabelList dataKey="value" position="top" fill="hsl(var(--foreground))" fontSize={12} fontWeight={600} />
      </Bar>
    </RechartsBarChart>
  </ResponsiveContainer>
);