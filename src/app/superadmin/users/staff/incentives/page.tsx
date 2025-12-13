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
import { Filter, Loader2, Plus, Minus, DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SellProperty {
  size_in_gaj: string;
  id: number;
  property_name: string;
  earn_amount: number;
  created_date: string;
  updated_date: string;
  plot_no: string;
  sale_gaj: number;
  amount: number;
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

const ExpandedSlabDetails = ({ slab, currentSlab }: { slab: Slab; currentSlab: Slab | null }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold">{slab.slab_name}</div>
        {currentSlab?.id === slab.id && (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Current
          </Badge>
        )}
      </div>
    </div>
    <div className="p-3">
      <div className="flex items-center gap-4">
        <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
        <span className="text-sm font-medium">Min:</span>
        <span className="text-sm font-bold text-green-600">
          ₹{slab.min_amount?.toLocaleString() || '0'}
        </span>
      </div>
       <div className="p-3">
      <div className="flex items-center gap-4">
        <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
        <span className="text-sm font-medium">Max:</span>
        <span className="text-sm font-bold text-green-600">
          {slab.max_amount === 0 ? 'No Limit' : `₹${slab.max_amount?.toLocaleString() || 'N/A'}`}
        </span>
      </div>
    </div>
       <div className="p-3">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Percentage:</span>
        <span className="text-sm font-bold text-green-600">
          {slab.incentive_percentage}%
        </span>
      </div>
    </div>
    </div>
  </div>
);

const ExpandedPropertyDetails = ({ property }: { property: SellProperty }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 flex items-center gap-4 border-b border-gray-200">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-lg font-bold">{property.property_name}</div>
      </div>
    </div>
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
        {/* Row 1: Plot No - only on mobile */}
        <div className="p-3 border-b border-r md:border-r-0 border-gray-200 block md:hidden">
          <div className="flex items-center gap-4">
            {/* <Hash className="h-4 w-4 text-gray-500 flex-shrink-0" /> */}
            <span className="text-sm">Plot No. - {property.plot_no || 'N/A'}</span>
          </div>
        </div>
        {/* Row 1: Amount */}
        <div className="p-3 border-b border-l md:border-l-0 border-gray-200 md:border-b-0">
          <div className="flex items-center gap-4">
            <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm font-medium">Amount:</span>
            <span className="text-sm font-semibold text-green-600">
              ₹{(property.amount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
        {/* Row 2: Earning */}
        <div className="p-3 border-b md:col-span-2 flex items-center gap-4 border-t pt-2">
          <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span className="text-sm font-medium">Earning:</span>
          <span className="text-sm font-bold text-green-600">
            ₹{(property.earn_amount ?? 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default function StaffIncentivesPage() {
  const [sellProperties, setSellProperties] = useState<SellProperty[]>([]);
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [totalEarn, setTotalEarn] = useState(0);
  const [currentSlab, setCurrentSlab] = useState<Slab | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [staffId, setStaffId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [userType, setUserType] = useState(false);
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [notFound, setNotFound] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null); // For sellProperties (not slabs)
    const [expandedSlabId, setExpandedSlabId] = useState<number | null>(null); // For slabs
  
  
    const { toast } = useToast();
  
    const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);
  
    const toggleRow = (rowId: number) => {
      setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };
  
    const toggleSlab = (slabId: number) => {
      setExpandedSlabId(expandedSlabId === slabId ? null : slabId);
    };

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
    if (!staffId) return;

    setLoading(true);
    setError('');
    setNotFound(false);
    
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
        return;
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notFound ? (
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
              <div>
                <h3 className="text-lg font-semibold mb-4">Incentive Slabs</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Slab Name</TableHead>
                        <TableHead className="w-1/2 md:w-1/3">Min - Max</TableHead>
                        <TableHead className="w-1/3 hidden md:table-cell">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slabs.length > 0 ? (
                        slabs.map((slab) => (
                          <React.Fragment key={slab.id}>
                            <TableRow 
                              data-state={expandedSlabId === slab.id && 'selected'}
                              className={`${currentSlab?.id === slab.id ? 'bg-green-50' : ''}`}
                            >
                              <TableCell className="w-1/2 md:w-1/3 font-medium">
                                <>
                                  <div className="md:hidden flex items-center justify-between w-full">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="text-green-600 h-6 w-6 p-0"
                                      onClick={() => toggleSlab(slab.id)}
                                    >
                                      {expandedSlabId === slab.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    </Button>
                                    {currentSlab?.id === slab.id && (
                                      <Badge className="bg-green-100 text-green-800 border-green-300">
                                        Current
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="hidden md:block">
                                    <div className="flex items-center gap-2">
                                      {slab.slab_name}
                                      {currentSlab?.id === slab.id && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </>
                              </TableCell>
                              <TableCell className="w-1/2 md:w-1/3">
                                ₹{slab.min_amount?.toLocaleString() || '0'} - {' '}
                                {slab.max_amount === 0 
                                  ? "No Limit" 
                                  : `₹${slab.max_amount?.toLocaleString() || 'N/A'}`}
                              </TableCell>
                              <TableCell className="w-1/3 hidden md:table-cell font-semibold text-green-600">
                                {slab.incentive_percentage != null ? `${slab.incentive_percentage}%` : '0%'}
                              </TableCell>
                            </TableRow>
                            {expandedSlabId === slab.id && (
                              <TableRow className="md:hidden">
                                <TableCell colSpan={3} className="p-0">
                                  <ExpandedSlabDetails slab={slab} currentSlab={currentSlab} />
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No slabs available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Incentive Plan Details ({sellProperties.length})</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">S.N.</TableHead>
                        <TableHead className="w-auto md:w-1/4 lg:w-1/6">Date</TableHead>
                        <TableHead className="hidden md:table-cell w-auto md:w-1/4 lg:w-1/6">Plot No</TableHead>
                        <TableHead className="w-auto md:w-1/4 lg:w-1/6">Sale (gaj)</TableHead>
                        <TableHead className="hidden lg:table-cell w-auto lg:w-1/6">Amount</TableHead>
                        <TableHead className="hidden lg:table-cell w-1/6 text-right">Earning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellProperties.map((property, index) => (
                        <React.Fragment key={property.id}>
                          <TableRow data-state={expandedRowId === property.id && 'selected'}>
                            <TableCell className="w-[60px]">
                              <>
                                <div className="lg:hidden flex items-center">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-green-600 h-6 w-6 p-0"
                                    onClick={() => toggleRow(property.id)}
                                  >
                                    {expandedRowId === property.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <div className="hidden lg:block">
                                  {index + 1}.
                                </div>
                              </>
                            </TableCell>
                            <TableCell className="w-auto md:w-1/4 lg:w-1/6 font-medium">
                              {new Date(property.created_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell w-auto md:w-1/4 lg:w-1/6">
                              {property.plot_no || 'N/A'}
                            </TableCell>
                            <TableCell className="w-auto md:w-1/4 lg:w-1/6">
                              {property.size_in_gaj || 'N/A'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell w-auto lg:w-1/6">
                              ₹{(property.amount ?? 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell w-1/6 text-right font-semibold text-green-600">
                              ₹{(property.earn_amount ?? 0).toLocaleString()}
                            </TableCell>
                          </TableRow>
                          {expandedRowId === property.id && (
                            <>
                              {/* Mobile Expanded Row */}
                              <TableRow className="md:hidden">
                                <TableCell colSpan={6} className="p-0">
                                  <ExpandedPropertyDetails property={property} />
                                </TableCell>
                              </TableRow>
                              {/* Tablet Expanded Row */}
                              <TableRow className="hidden md:table-row lg:hidden">
                                <TableCell colSpan={6} className="p-0">
                                  <ExpandedPropertyDetails property={property} />
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                      {sellProperties.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
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