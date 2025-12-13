'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface Admin {
  id: number;
  name: string;
}

interface TeamLeader {
  id: number;
  name: string;
}

interface Staff {
  id: number;
  name: string;
}

export default function AddSellPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    admin: "",
    team_leader: "",
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
      
      // Fetch Admins from dashboard API (same as admin page)
      const adminResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`, {
        headers: { 'Authorization': ` Token ${token}` },
      });
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        setAdmins(adminData.users || []);
      }

      // Fetch Team Leaders (same as team-leader page)
      const teamLeaderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/get-team-leaders/`, {
        headers: { 'Authorization': ` Token ${token}` },
      });
      if (teamLeaderResponse.ok) {
        const teamLeaderData = await teamLeaderResponse.json();
        setTeamLeaders(teamLeaderData.results || []);
      }

      // Fetch Staff from staff-report API
      const staffResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/staff-report/`, {
        headers: { 'Authorization': ` Token ${token}` },
      });
      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        setStaffs(staffData.staff_list || []);
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
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/add-sell-freelancer/1/`, {
        method: 'POST',
        headers: {
          'Authorization': ` Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setForm({
          admin: "",
          team_leader: "",
          staff: "",
          project_name: "",
          plot_no: "",
          size_in_gaj: "",
          date: "",
        });
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
              <div className="space-y-2">
                <Label htmlFor="admin">Admin</Label>
                <Select name="admin" value={form.admin} onValueChange={(value) => handleSelectChange('admin', value)} required>
                  <SelectTrigger id="admin">
                    <SelectValue placeholder="Select Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={String(admin.id)}>
                        {admin.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team_leader">Team Leader</Label>
                <Select name="team_leader" value={form.team_leader} onValueChange={(value) => handleSelectChange('team_leader', value)} required>
                  <SelectTrigger id="team_leader">
                    <SelectValue placeholder="Select Team Leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamLeaders.map((teamLeader) => (
                      <SelectItem key={teamLeader.id} value={String(teamLeader.id)}>
                        {teamLeader.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff">Staff</Label>
                <Select name="staff" value={form.staff} onValueChange={(value) => handleSelectChange('staff', value)} required>
                  <SelectTrigger id="staff">
                    <SelectValue placeholder="Select Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffs.map((staff) => (
                      <SelectItem key={staff.id} value={String(staff.id)}>
                        {staff.name}
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
