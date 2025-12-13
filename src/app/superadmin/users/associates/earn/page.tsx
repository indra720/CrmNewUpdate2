'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Filter, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SellProperty {
  size_in_gaj: string;
  id: number;
  property_name: string;
  earn_amount: number;
  created_date: string;
  updated_date: string;
  plot_no: string; // Assumed field
  sale_gaj: number; // Assumed field
  amount: number; // Assumed field
  staff: {
    id: number;
    name: string;
    email: string;
  };
}

interface Slab {
  id: number;
  slab_name: string;
  min_amount: number;
  max_amount: number;
  incentive_percentage: number;
  is_active: boolean;
}

interface ApiResponse {
  sell_property: SellProperty[];
  slab: Slab[];
  total_earn: number;
  year: number;
  month: number;
  months_list: [number, string][];
  user_type: boolean;
}

interface StaffMember {
  id: number;
  name: string;
}

export default function StaffIncentivesPage() {
  const [sellProperties, setSellProperties] = useState<SellProperty[]>([]);
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [totalEarn, setTotalEarn] = useState(0);
  const [currentSlab, setCurrentSlab] = useState<Slab | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [staffId, setStaffId] = useState(''); // Default staff ID
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [userType, setUserType] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [notFound, setNotFound] = useState(false); // New state for 404


  const { toast } = useToast();

  const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/staff-report/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch staff list");

      const data = await response.json();
      const staff = data.staff_list.map((s: any) => ({ id: s.id, name: s.name }));
      setStaffList(staff);

      // Set initial staffId to the first staff member if list is not empty
      if (staff.length > 0) {
        setStaffId(String(staff[0].id));
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load staff list.",
        variant: "destructive",
      });
    }
  };

  const fetchIncentiveData = async () => {
    if (!staffId) return; // Don't fetch if no staffId is selected

    setLoading(true);
    setError('');
    setNotFound(false); // Reset 404 state on new fetch
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/report/incentive-slab/${staffId}/?year=${year}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 404) {
        setNotFound(true);
        setSellProperties([]);
        setSlabs([]);
        setTotalEarn(0);
        setIncentiveAmount(0);
        setCurrentSlab(null);
        return; // Exit function, as we're handling this specific case
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      setSellProperties(data.sell_property || []);
      setSlabs(data.slab || []);
      setTotalEarn(data.total_earn || 0);
      setMonthsList(data.months_list || []);
      setUserType(data.user_type || false);

      const activeSlab = data.slab.find(slab => 
        slab.is_active && 
        data.total_earn >= slab.min_amount && 
        (slab.max_amount === 0 || data.total_earn <= slab.max_amount)
      );
      
      setCurrentSlab(activeSlab || null);
      
      if (activeSlab) {
        const incentive = (data.total_earn * activeSlab.incentive_percentage) / 100;
        setIncentiveAmount(incentive);
      } else {
        setIncentiveAmount(0);
      }

    } catch (err: any) {
      setError(err.message);
      setSellProperties([]);
      setSlabs([]);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch incentive data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);


  useEffect(() => {
    fetchIncentiveData();
  }, [staffId, year, month]);

  const getSlabBadgeColor = (slab: Slab) => {
    if (currentSlab?.id === slab.id) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return slab.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Incentives</h1>
      
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Incentive Management</CardTitle>
          <CardDescription>
            View staff incentive slabs and earnings data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Staff</Label>
              <Select value={staffId} onValueChange={setStaffId} disabled={staffList.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((staff) => (
                    <SelectItem key={staff.id} value={String(staff.id)}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Month</Label>
              <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthsList.map(([monthNum, monthName]) => (
                    <SelectItem key={monthNum} value={String(monthNum)}>{monthName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Year</Label>
              <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearsList.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchIncentiveData} disabled={loading || !staffId} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notFound ? ( // New condition for 404
            <div className="text-center text-gray-500 py-10">
              <p>No incentive data found for the selected staff member.</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
              <Button onClick={fetchIncentiveData} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Incentive Slabs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Incentive Slabs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slabs.map((slab) => (
                    <Card key={slab.id} className={`${currentSlab?.id === slab.id ? 'ring-2 ring-green-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{slab.slab_name}</h4>
                          <Badge className={getSlabBadgeColor(slab)}>
                            {currentSlab?.id === slab.id ? 'Current' : slab.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>Min: ₹{slab.min_amount.toLocaleString()}</p>
                          <p>Max: {slab.max_amount === 0 ? 'No Limit' : `₹${slab.max_amount.toLocaleString()}`}</p>
                          <p className="font-medium text-green-600">{slab.incentive_percentage}% Incentive</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Incentive Plan Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Incentive Plan Details ({sellProperties.length})</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plot No</TableHead>
                        <TableHead>Sale (gaj)</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Earning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellProperties.length > 0 ? (
                        sellProperties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell>
                              {new Date(property.created_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{property.plot_no || 'N/A'}</TableCell>
                            <TableCell>{property.size_in_gaj || 'N/A'}</TableCell>
                            <TableCell>₹{property.amount?.toLocaleString() || 'N/A'}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ₹{property.earn_amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No properties sold in this period
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end items-center mt-4 pr-4">
                  <h3 className="text-lg font-bold">Total Incentive:</h3>
                  <p className="text-xl font-bold ml-4 text-green-600">₹{incentiveAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
