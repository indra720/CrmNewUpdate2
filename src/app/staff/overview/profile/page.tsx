import DashboardLayout from "../dashboardlayout/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Mail, Phone, MapPin, Calendar, Briefcase, Building2, 
  GraduationCap, Edit2, Shield, Clock
} from "lucide-react";

const profileData = {
  name: "Ajit Singh",
  employeeId: "VL12438",
  email: "ajit.singh@techcorp.com",
  phone: "+91 98765 43210",
  department: "Engineering",
  designation: "Technical Lead",
  joiningDate: "15 March 2021",
  manager: "Rajesh Gupta",
  location: "Noida, Uttar Pradesh",
  education: "B.Tech in Computer Science",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
};

const stats = [
  { label: "Total Leaves", value: "24", used: "8" },
  { label: "Sick Leave", value: "12", used: "2" },
  { label: "Casual Leave", value: "12", used: "6" },
];

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card shadow-sm rounded-lg p-6">
        {/* Profile Header */}
        <div className="dashboard-card bg-gradient-to-r from-primary/5 via-card to-card">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                <AvatarImage src="" alt={profileData.name} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                  AS
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{profileData.name}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {profileData.employeeId}
                </span>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{profileData.designation}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-primary" />
                  {profileData.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {profileData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  Joined {profileData.joiningDate}
                </span>
              </div>
            </div>

            <Button variant="outline" className="hidden md:flex">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{profileData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reports To</p>
                  <p className="font-medium text-foreground">{profileData.manager}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Balance */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Leave Balance
            </h2>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">{parseInt(stat.value) - parseInt(stat.used)}</span>
                    <span className="text-muted-foreground text-sm"> / {stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Skills & Education
            </h2>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Education</p>
              <p className="font-medium text-foreground">{profileData.education}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
