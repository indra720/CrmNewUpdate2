'use client';

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, Filter, Loader2 } from 'lucide-react';

const mockData = {
    sell_property: [
        { date: '2024-10-05', plot_no: 'A-12', size_in_gaj: 100, slab_amount: 5000, earn_amount: 500 },
        { date: '2024-10-12', plot_no: 'B-03', size_in_gaj: 150, slab_amount: 7500, earn_amount: 750 },
        { date: '2024-10-21', plot_no: 'C-34', size_in_gaj: 200, slab_amount: 10000, earn_amount: 1000 },
    ],
    slab: [
        { start_value: 0, end_value: 100, amount: 500 },
        { start_value: 101, end_value: 200, amount: 750 },
        { start_value: 201, end_value: 500, amount: 1000 },
    ],
    total_earn: 2250,
    user_type: true
};

export default function IncentiveDetailPage() {
  const [month, setMonth] = useState(String(new Date().getMonth()));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [sellProperty, setSellProperty] = useState<any[]>([]);
  const [slab, setSlab] = useState<any[]>([]);
  const [totalEarn, setTotalEarn] = useState(0);
  const [userType, setUserType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const monthsList = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app: const res = await fetch(`${apiUrl}?month=${month}&year=${year}`);
      // if (!res.ok) throw new Error("Failed to fetch data");
      // const data = await res.json();
      const data = mockData;
      setSellProperty(data.sell_property || []);
      setSlab(data.slab || []);
      setTotalEarn(data.total_earn || 0);
      setUserType(data.user_type ?? true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchData();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Incentive Detail</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
            <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
                <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                    {monthsList.map((name, idx) => (
                    <SelectItem key={idx} value={String(idx)}>{name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    {yearsList.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Filter className="mr-2 h-4 w-4"/>}
                    Filter
                </Button>
            </form>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Incentive Plan Detail</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Plot No</TableHead>
                                        <TableHead>Sale (Gaj)</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead className="text-right">Earning</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {sellProperty.map((data: any, idx) => (
                                        <TableRow key={idx}>
                                        <TableCell>{data.date}</TableCell>
                                        <TableCell>{data.plot_no}</TableCell>
                                        <TableCell>{data.size_in_gaj}</TableCell>
                                        <TableCell>₹{data.slab_amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">₹{data.earn_amount.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                         <Card>
                            <CardHeader>
                                <CardTitle>Incentive Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Slab</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {slab.map((data: any, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{data.start_value}-{data.end_value}</TableCell>
                                            <TableCell className="text-right">
                                            ₹{(userType ? data.amount : data.amount - 100).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>

      {!loading && !error && (
        <Card className="shadow-lg rounded-2xl bg-primary text-primary-foreground">
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <DollarSign className="h-8 w-8" />
                    <p className="text-xl font-bold">Total Incentive</p>
                </div>
                <p className="text-3xl font-extrabold">
                    ₹{totalEarn.toLocaleString()}/-
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
