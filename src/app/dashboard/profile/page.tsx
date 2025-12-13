
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Mail, Phone, Briefcase } from "lucide-react";

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal and account details.</p>
      </div>

      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-muted/30 p-8 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">Super Admin</h2>
                <p className="text-muted-foreground">admin@nexus.com</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Super Administrator</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
                </div>
            </div>
            <div className="md:ml-auto">
                <Button>Update Profile</Button>
            </div>
        </div>

        <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <Label className="text-sm">Full Name</Label>
                    <p className="font-medium">Super Admin</p>
                </div>
                 <div className="space-y-1">
                    <Label className="text-sm">Role</Label>
                    <p className="font-medium">Super Administrator</p>
                </div>
                <div className="space-y-1">
                    <Label className="text-sm">Email Address</Label>
                    <p className="font-medium">admin@nexus.com</p>
                </div>
                <div className="space-y-1">
                    <Label className="text-sm">Phone Number</Label>
                    <p className="font-medium">(123) 456-7890</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                    <Label className="text-sm">Address</Label>
                    <p className="font-medium">123 Market St, San Francisco, CA 94103</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
