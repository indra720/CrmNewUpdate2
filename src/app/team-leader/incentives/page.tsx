'use client';

import React, { ReactNode, useEffect, useState } from 'react';
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
import { Filter, Loader2, Plus, Minus, Hash, DollarSign } from 'lucide-react';
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
  start_value: string; // API se string aa raha hai
  end_value: string; // API se string aa raha hai
  amount: string; // API se string aa raha hai
  flat_percent: string; // API se string aa raha hai
  created_date: string;
  updated_date: string;
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

interface StaffListItem {
  id: number;
  username: string;
  email?: string;
  mobile?: string;
}

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

const ExpandedSlabDetails = ({ slab, currentSlab }: { slab: Slab; currentSlab: Slab | null }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold">Slab {slab.id}</div>
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
        <span className="text-sm font-medium">Amount:</span>
        <span className="text-sm font-bold text-green-600">
          ₹{parseFloat(slab.amount).toLocaleString()}
        </span>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [notFound, setNotFound] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [expandedSlabId, setExpandedSlabId] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<string>('');
  const [staffList, setStaffList] = useState<StaffListItem[]>([]);

  const { toast } = useToast();

  const yearsList = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const toggleSlab = (slabId: number) => {
    setExpandedSlabId(expandedSlabId === slabId ? null : slabId);
  };
  
  async function fetchStaffList() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");
      
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const url = new URL('/accounts/api/team-leader/staff-dashboard/', baseUrl);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Staff list HTTP error: ${res.status}`);
      const json = await res.json();
      //console.log("fetchStaffList response:", json); // Added log
      const list: StaffListItem[] = json.staff_list || [];
      setStaffList(list);
      if (list.length > 0 && !staffId) {
        setStaffId(String(list[0].id));
        //console.log("Setting initial staffId:", list[0].id); // Added log
      } else if (list.length === 0) {
        //console.log("fetchStaffList returned an empty list."); // Added log
      }
    } catch (err: any) {
      //console.error("fetchStaffList error:", err); // Added log
      toast({
        title: "Error",
        description: err.message || "Failed to fetch staff list",
        variant: "destructive",
      });
    }
  }

  const fetchIncentiveData = async () => {
    if (!staffId) {
        setError("No staff selected");
        return;
    }
    setLoading(true);
    setError('');
    setNotFound(false);
    //console.log("Fetching incentive data for staffId:", staffId, "year:", year, "month:", month); // Added log

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        //console.error("Authentication token not found."); // Added log
        throw new Error("Authentication token not found.");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const url = new URL(`/accounts/api/team-leader/staff-incentive/${staffId}/`, baseUrl);
      url.searchParams.append('year', String(year));
      url.searchParams.append('month', String(month));

      const response = await fetch(url.toString(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      //console.log("Incentive API response status:", response.status); // Added log

      if (response.status === 404) {
        setNotFound(true);
        setSellProperties([]);
        setSlabs([]);
        setTotalEarn(0);
        setIncentiveAmount(0);
        setCurrentSlab(null);
        setMonthsList([]);
        //console.log("No incentive data found (404)."); // Added log
        return;
      }

      if (!response.ok) {
        const errorText = await response.text(); // Get raw error text
        //console.error(`HTTP error! status: ${response.status}, details: ${errorText}`); // Added log
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      //console.log("Incentive API data:", data); // Added log

      setSellProperties(data.sell_property || []);
      setSlabs(data.slab || []);
      setTotalEarn(data.total_earn || 0);
      setMonthsList(data.months_list || []);

      // Current slab calculate karna - API me is_active field nahi hai
      const activeSlab = data.slab.find(slab => {
        const startValue = parseFloat(slab.start_value);
        const endValue = parseFloat(slab.end_value);
        const totalEarnValue = data.total_earn;
        
        return totalEarnValue >= startValue && 
               (endValue === 0 || totalEarnValue <= endValue);
      });

      setCurrentSlab(activeSlab || null);

      if (activeSlab) {
        // flat_percent use karke incentive calculate karna
        const incentive = parseFloat(activeSlab.flat_percent);
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
    if(staffId) fetchIncentiveData();
  }, [year, month, staffId]);

  const getSlabBadgeColor = (slab: Slab) => {
    if (currentSlab?.id === slab.id) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Incentives</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Incentive Management</CardTitle>
          <CardDescription>
            View your incentive slabs and earnings data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Staff</Label>
              <Select value={staffId} onValueChange={(val) => setStaffId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.username}
                    </SelectItem>
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
                  {monthsList.length > 0 ? (
                    monthsList.map(([monthNum, monthName]) => (
                      <SelectItem key={monthNum} value={String(monthNum)}>{monthName}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value={String(new Date().getMonth() + 1)} disabled>
                      {new Date().toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  )}
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
              <Button onClick={fetchIncentiveData} disabled={loading} className="w-full">
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
              {/* Incentive Slabs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Incentive Slabs</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Slab</TableHead>
                        <TableHead className="w-1/2 md:w-1/3">Min - Max</TableHead>
                        <TableHead className="w-1/3 hidden md:table-cell">Amount</TableHead>
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
                                      {slab.id}
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
                                ₹{parseFloat(slab.start_value).toLocaleString()} - {' '}
                                {parseFloat(slab.end_value) === 0 
                                  ? "No Limit" 
                                  : `₹${parseFloat(slab.end_value).toLocaleString()}`}
                              </TableCell>
                              <TableCell className="w-1/3 hidden md:table-cell font-semibold text-green-600">
                                ₹{parseFloat(slab.amount).toLocaleString()}
                              </TableCell>
                            </TableRow>
                            {expandedSlabId === slab.id && (
                              <TableRow className="md:hidden">
                                <TableCell colSpan={2} className="p-0">
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

              {/* Incentive Plan Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Incentive Plan Details ({sellProperties.length})
                </h3>
                <div className="overflow-x-auto rounded-lg border">
                  <Table className="w-full table-fixed">
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
                                <TableCell colSpan={3} className="p-0">
                                  <ExpandedPropertyDetails property={property} />
                                </TableCell>
                              </TableRow>
                              {/* Tablet Expanded Row */}
                              <TableRow className="hidden md:table-row lg:hidden">
                                <TableCell colSpan={4} className="p-0">
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
                  <p className="text-xl font-bold ml-4 text-green-600">
                    ₹{incentiveAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}







// class TeamLeaderStaffIncentiveAPIView(APIView):
//     """
//     API endpoint for 'incentive_slap_staff' (Team Leader Dashboard).
//     GET: Allows Team Leader to view incentives of a specific staff member.
//     ONLY TEAM LEADER (is_team_leader=True) can access this.
//     """
    
//     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser]

//     def get(self, request, staff_id, format=None):
//         # 1. Get Team Leader Profile
//         try:
//             tl_instance = Team_Leader.objects.get(user=request.user)
//         except Team_Leader.DoesNotExist:
//             return Response({"error": "Team Leader profile not found."}, status=status.HTTP_404_NOT_FOUND)

//         # 2. Get Staff and Check Permission
//         try:
//             staff = Staff.objects.get(id=staff_id)
//             # Check: Kya ye staff is Team Leader ke under hai?
//             if staff.team_leader != tl_instance:
//                 return Response({"error": "You do not have permission to view this staff's incentives."}, status=status.HTTP_403_FORBIDDEN)
//         except Staff.DoesNotExist:
//             return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)

//         # 3. Get Filters (Month/Year)
//         months_list = [(i, calendar.month_name[i]) for i in range(1, 13)]
//         year = int(request.query_params.get('year', datetime.now().year))
//         month = int(request.query_params.get('month', datetime.now().month))

//         # 4. Get User Type (Freelancer or Not)
//         user_type = staff.user.is_freelancer

//         # 5. Get Slab Data & Adjust Amount logic
//         slab_qs = Slab.objects.all()
//         slab_data = SlabSerializer(slab_qs, many=True).data
        
//         # Logic: Agar user Staff hai (Freelancer nahi), to Amount me se 100 minus karo
//         # (Bilkul waisa jaise humne Staff API me kiya tha)
//         if not user_type:
//             for slab_item in slab_data:
//                 try:
//                     original_amount = int(slab_item.get('amount', 0))
//                     slab_item['amount'] = str(original_amount - 100) 
//                 except (ValueError, TypeError):
//                     pass

//         # 6. Get Sell Data (Earning History)
//         sell_property_qs = Sell_plot.objects.filter(
//             staff=staff, 
//             updated_date__year=year,
//             updated_date__month=month,
//         ).order_by('-created_date')

//         total_earn_amount = sell_property_qs.aggregate(total_earn=Sum('earn_amount'))
//         total_earn = total_earn_amount.get('total_earn') or 0

//         # 7. Final Response
//         response_data = {
//             'slab': slab_data,
//             'sell_property': SellPlotSerializer(sell_property_qs, many=True).data,
//             'total_earn': total_earn,
//             'year': year,
//             'month': month,
//             'months_list': months_list,
//             'user_type': user_type, # True if Freelancer, False if Staff
//             'staff_name': staff.name
//         }
        
//         return Response(response_data, status=status.HTTP_200_OK)
