'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface Staff {
  id: number;
  username: string;
}

export default function AddSellPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    staff: "",
    project_name: "",
    plot_no: "",
    size_in_gaj: "",
    date: "",
  });

  // Fetch data from existing APIs used in other pages
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        //console.error("Authentication token not found");
        return;
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const url = new URL('/accounts/api/team-leader/staff-dashboard/', baseUrl);

      const staffResponse = await fetch(url.toString(), {
        headers: { 'Authorization': ` Token ${token}` },
      });

      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        //console.log("Add Sell Page - Staff API Response:", staffData);
        setStaffs(staffData.staff_list || []);
      } else {
        //console.error("Add Sell Page - Staff API failed with status:", staffResponse.status);
      }
    } catch (error) {
      //console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.staff) {
      //console.error("Please select a staff member.");
      return;
    }
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const { staff, ...sellData } = form; 

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      const url = new URL(`/accounts/api/v2/add_sell_freelancer/${form.staff}/`, baseUrl);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': ` Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellData),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setForm({
          staff: "",
          project_name: "",
          plot_no: "",
          size_in_gaj: "",
          date: "",
        });
      } else {
        const errorData = await response.json();
        //console.error('Error submitting form:', errorData);
      }
    } catch (error) {
      //console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Add Sell</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="staff">Staff</Label>
                <Select name="staff" value={form.staff} onValueChange={(value) => handleSelectChange('staff', value)} required>
                  <SelectTrigger id="staff">
                    <SelectValue placeholder="Select Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffs.map((staff) => (
                      <SelectItem key={staff.id} value={String(staff.id)}>
                        {staff.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name</Label>
                <Input 
                  id="project_name" 
                  name="project_name" 
                  value={form.project_name} 
                  onChange={handleChange} 
                  placeholder="Enter project name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Create Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  name="date" 
                  value={form.date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="plot_no">Plot Number</Label>
                <Input 
                  id="plot_no" 
                  name="plot_no" 
                  value={form.plot_no} 
                  onChange={handleChange} 
                  placeholder="Enter plot number" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size_in_gaj">Size (Gaj)</Label>
                <Input 
                  id="size_in_gaj" 
                  name="size_in_gaj" 
                  value={form.size_in_gaj} 
                  onChange={handleChange} 
                  placeholder="Enter size in Gaj" 
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="items-center">
            <div className="animate-bounce">
              <CheckCircle className="text-green-600 w-16 h-16" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700 pt-2 animate-pulse">Fantastic!</DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground pb-4 animate-fade-in">
            Sell record added successfully!
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
              onClick={() => setShowSuccessModal(false)}
            >
              Amazing!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}






// class AddSellFreelancerV2APIView(APIView):
//     """
//     POST-only API for Team Leader to create Sell_plot for staff/freelancer.
//     URL pattern: /accounts/api/v2/add_sell_freelancer/<int:id>/   (id = staff id or 0)
//     Permission: only team-leader users (IsTeamLeaderOnly)
//     """
//     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser ]

//     def post(self, request, id, format=None):
//         """
//         POST payload (JSON) example:
//         {
//           "project_name": "Project X",
//           "project_location": "Site A",
//           "description": "Sold plot",
//           "size_in_gaj": "10",
//           "plot_no": "P-123",
//           "date": "2025-11-21",
//           "staff_id": 21    # only required if URL id == 0
//         }
//         """
//         # verify team leader profile exists
//         team_leader = Team_Leader.objects.filter(email=request.user.email).last()
//         if not team_leader:
//             return Response({"detail": "Team leader profile not found."}, status=status.HTTP_404_NOT_FOUND)

//         # Pass context so serializer can access request + view kwargs (id)
//         serializer = SellPlotCreateSerializer(data=request.data, context={"request": request, "view": self})
//         if not serializer.is_valid():
//             return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

//         # Additional ownership check: ensure staff belongs to this team leader
//         # Get staff id used by serializer: prefer URL id unless it's 0
//         used_staff_id = id if int(id) != 0 else request.data.get("staff_id")
//         try:
//             used_staff_id = int(used_staff_id)
//         except Exception:
//             return Response({"detail": "staff_id must be provided (integer) when url id is 0."}, status=status.HTTP_400_BAD_REQUEST)

//         staff_instance = Staff.objects.filter(id=used_staff_id).last()
//         if not staff_instance:
//             return Response({"detail": f"Staff not found with id {used_staff_id}."}, status=status.HTTP_404_NOT_FOUND)

//         if staff_instance.team_leader is None or staff_instance.team_leader.id != team_leader.id:
//             return Response({"detail": "You can only create sell records for staff belonging to your own team."}, status=status.HTTP_403_FORBIDDEN)

//         # create and return
//         try:
//             sell = serializer.save()
//         except Exception as exc:
//             return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

//         out = SellPlotSerializer(sell)
//         return Response({"message": "Sell created", "sell": out.data}, status=status.HTTP_201_CREATED)
    
