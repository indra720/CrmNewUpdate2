'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AddSellPage() {
  const userRole = "admin"; // Mock role: "admin" or "team_leader"
  const id = 0; // 0 for new record, non-zero for edit

  const [admins, setAdmins] = useState<any[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [form, setForm] = useState({
    admin: "",
    team_leader: "",
    staff: "",
    project_name: "",
    plot_number: "",
    date: "",
    size_in_gaj: "",
  });

  const { toast } = useToast();

  // Mock API — replace with your actual Django endpoints
  const API = {
    getAdmins: async () => [
      { id: 1, name: "Admin 1" },
      { id: 2, name: "Admin 2" },
    ],
    getTeamLeaders: async (adminId: string) => [
      { id: 1, name: `Team Leader for Admin ${adminId}` },
      { id: 2, name: "Another Leader" },
    ],
    getStaff: async (teamLeaderId: string) => [
      { id: 1, name: `Staff under TL ${teamLeaderId}` },
      { id: 2, name: "Second Staff" },
    ],
    submitForm: async (formData: any) => {
      // console.log("Submitting form:", formData);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: "Sell added successfully!" };
    },
  };

  useEffect(() => {
    if (userRole === "admin") {
      API.getAdmins().then(setAdmins);
    } else if (userRole === "team_leader") {
      API.getStaff('dummy-id').then(setStaffs);
    }
  }, [userRole]);

  useEffect(() => {
    if (form.admin) {
      API.getTeamLeaders(form.admin).then(setTeamLeaders);
      setForm(prev => ({...prev, team_leader: '', staff: ''}));
    } else {
      setTeamLeaders([]);
    }
  }, [form.admin]);

  useEffect(() => {
    if (form.team_leader) {
      API.getStaff(form.team_leader).then(setStaffs);
      setForm(prev => ({...prev, staff: ''}));
    } else {
      setStaffs([]);
    }
  }, [form.team_leader]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
      setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await API.submitForm(form);
    if (res.success) {
      toast({
        title: "Success!",
        description: res.message,
        className: 'bg-green-500 text-white',
      });
      setForm({
        admin: "",
        team_leader: "",
        staff: "",
        project_name: "",
        plot_number: "",
        date: "",
        size_in_gaj: "",
      });
    } else {
        toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive"
        });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Add Sell</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {userRole === "admin" && id === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="admin">Admin</Label>
                  <Select name="admin" value={form.admin} onValueChange={(value) => handleSelectChange('admin', value)} required>
                    <SelectTrigger id="admin">
                      <SelectValue placeholder="Select Admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {admins.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team_leader">Team Leader</Label>
                  <Select name="team_leader" value={form.team_leader} onValueChange={(value) => handleSelectChange('team_leader', value)} required disabled={!form.admin}>
                    <SelectTrigger id="team_leader">
                      <SelectValue placeholder="Select Team Leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamLeaders.map((tl) => (
                        <SelectItem key={tl.id} value={String(tl.id)}>
                          {tl.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff">Staff</Label>
                  <Select name="staff" value={form.staff} onValueChange={(value) => handleSelectChange('staff', value)} required disabled={!form.team_leader}>
                    <SelectTrigger id="staff">
                      <SelectValue placeholder="Select Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffs.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project_name">Project Name</Label>
                  <Input id="project_name" type="text" name="project_name" value={form.project_name} onChange={handleChange} placeholder="Enter project name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot_number">Plot Number</Label>
                  <Input id="plot_number" type="text" name="plot_number" value={form.plot_number} onChange={handleChange} placeholder="Enter plot number" required />
                </div>
              
                {id === 0 && (
                   <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" name="date" value={form.date} onChange={handleChange} required />
                  </div>
                )}
            </div>
            
            <div className="grid grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="size_in_gaj">Size(Gaj)</Label>
                  <Input id="size_in_gaj" type="text" name="size_in_gaj" value={form.size_in_gaj} onChange={handleChange} placeholder="Enter size in Gaj" required />
                </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
