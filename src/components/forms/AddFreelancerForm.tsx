"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Lock,
  Calendar,
  CreditCard,
  Fingerprint,
  GraduationCap,
  Building2,
  Phone,
  Wallet,
  Briefcase,
  Landmark,
  Hash,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Eye, // Added
  EyeOff, // Added
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const InputField = ({ id, label, name, type = 'text', placeholder, icon: Icon, value, onChange, required, children, disabled }: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  value: string | number;
  onChange: (e: any) => void;
  required?: boolean;
  children?: React.ReactElement;
  disabled?: boolean;
}) => {
  const inputElement = children ?
    React.cloneElement(children, { id, name, value, onChange, required, placeholder, disabled }) :
    <Input type={type} id={id} name={name} value={value as string} onChange={onChange} required={required} placeholder={placeholder} className="pl-10 pr-4 h-11" disabled={disabled} />;

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />}
        {inputElement}
      </div>
    </div>
  );
};

interface AddFreelancerFormProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'freelancer' | 'it_staff';
  onSuccess: () => void;
  teamLeaders: any[];
  admins: any[]; // Added admins prop
}

const initialFormData = {
  name: "",
  email: "",
  password: "",
  mobile: "",
  dob: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  degree: "",
  pancard: "",
  aadharCard: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  upi_id: "",
  referral_code: "",
  user_type: "",
  team_leader: "",
  admin: "", // Added admin to initialFormData
};

export default function AddFreelancerForm({ isOpen, onClose, userType, onSuccess, teamLeaders, admins }: AddFreelancerFormProps) {
  const [formData, setFormData] = useState({ ...initialFormData, user_type: userType });
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- Add state for password visibility
  const { toast } = useToast();

  useEffect(() => {
    setFormData({ ...initialFormData, user_type: userType });
    setShowPassword(false); // Reset on open
  }, [isOpen, userType]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== null && value !== undefined && value !== '') {
            data.append(key, value);
        }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/add-freelancer/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = Object.entries(errorData).map(([key, value]) => {
          const formattedValue = Array.isArray(value) ? value.join(', ') : value;
          return `${key}: ${formattedValue}`;
        }).join('\n');
        throw new Error(errorMessages || `Failed to add ${userType}.`);
      }

      await response.json();
      toast({ title: "Success!", description: `The ${userType === 'freelancer' ? 'Associate' : 'IT Staff'} has been added successfully.`, className: "bg-green-500 text-white" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const tabAnimation = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[90vw] max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-bold">Add New {userType === 'freelancer' ? 'Associate' : 'IT Staff'}</DialogTitle>
          <DialogDescription>Fill in the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="account">Account Details</TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6 overflow-y-auto flex-1 relative hide-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={tabAnimation.initial}
                  animate={tabAnimation.animate}
                  exit={tabAnimation.exit}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {activeTab === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleFormChange} required/>
                      <InputField id="email" label="E-Mail Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleFormChange} required />
                      <div className="relative">
                        <InputField
                          id="password"
                          label="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          icon={Lock}
                          value={formData.password}
                          onChange={handleFormChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-9 h-8 w-8 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                      <InputField id="mobile" label="Mobile" name="mobile" type="tel" placeholder="9876543210" icon={Phone} value={formData.mobile} onChange={handleFormChange} required />
                      {(userType === 'freelancer' || userType === 'it_staff') && ( // Only show team leader and admin for freelancers (associates) and IT Staff
                        <>
                          <div className="relative flex flex-col space-y-2">
                            <Label htmlFor="team_leader_id" className="text-sm font-medium text-muted-foreground">Team Leader</Label>
                            <Select onValueChange={(value) => handleSelectChange("team_leader_id", value)} name="team_leader_id" value={formData.team_leader_id}>
                              <SelectTrigger id="team_leader_id" className="pl-3 pr-4 h-11">
                                <Briefcase className="absolute left-1 top-10 h-5 w-5 text-muted-foreground text-gray-400 pointer-events-none" />
                                <SelectValue placeholder="Select Team Leader" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamLeaders.map((leader) => (
                                  <SelectItem key={leader.id} value={String(leader.id)}>
                                    {leader.name || leader.email}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="relative flex flex-col space-y-2">
                            <Label htmlFor="admin_id" className="text-sm font-medium text-muted-foreground">Admin</Label>
                            <Select onValueChange={(value) => handleSelectChange("admin_id", value)} name="admin_id" value={formData.admin_id}>
                              <SelectTrigger id="admin_id" className="pl-3 pr-4 h-11">
                                <User className="absolute left-1 top-10 h-5 w-5  text-gray-400 pointer-events-none" />
                                <SelectValue placeholder="Select Admin" />
                              </SelectTrigger>
                              <SelectContent>
                                {admins.map((admin) => (
                                  <SelectItem key={admin.id} value={String(admin.id)}>
                                    {admin.name || admin.email}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      <InputField id="pancard" label="Pan Card" name="pancard" placeholder="ABCDE1234F" icon={CreditCard} value={formData.pancard} onChange={handleFormChange} required />
                      <InputField id="aadharCard" label="Aadhar Card" name="aadharCard" placeholder="1234 5678 9012" icon={Fingerprint} value={formData.aadharCard} onChange={handleFormChange} required />
                      <InputField id="degree" label="Degree" name="degree" placeholder="B.Tech, M.Sc" icon={GraduationCap} value={formData.degree} onChange={handleFormChange} />
                      <InputField id="city" label="City" name="city" placeholder="e.g. Mumbai" icon={Building2} value={formData.city} onChange={handleFormChange} />
                      <InputField id="state" label="State" name="state" value={formData.state} onChange={handleFormChange}>
                        <Select onValueChange={(value) => handleSelectChange("state", value)} name="state" value={formData.state}>
                          <SelectTrigger className="pl-10 pr-4 h-11">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                          </SelectContent>
                        </Select>
                      </InputField>
                       <InputField id="pincode" label="Pincode" name="pincode" placeholder="e.g. 110001" icon={MapPin} value={formData.pincode} onChange={handleFormChange} />
                       <div className="md:col-span-2">
                          <InputField id="address" label="Address" name="address" value={formData.address} onChange={handleFormChange}>
                            <Textarea className="pl-10 pr-4 min-h-[80px]" placeholder="Enter full address" />
                          </InputField>
                        </div>
                    </div>
                  )}
                  {activeTab === 'account' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <InputField id="account_number" label="Account Number" name="account_number" placeholder="Your account number" icon={Wallet} value={formData.account_number} onChange={handleFormChange} />
                      <InputField id="upi_id" label="UPI ID" name="upi_id" placeholder="yourname@upi" icon={Briefcase} value={formData.upi_id} onChange={handleFormChange} />
                      <InputField id="bank_name" label="Bank Name" name="bank_name" placeholder="e.g. State Bank of India" icon={Landmark} value={formData.bank_name} onChange={handleFormChange} />
                      <InputField id="ifsc_code" label="IFSC Code" name="ifsc_code" placeholder="SBIN0001234" icon={Hash} value={formData.ifsc_code} onChange={handleFormChange} />
                      <InputField id="referral_code" label="Referral Code" name="referral_code" placeholder="Optional" icon={User} value={formData.referral_code} onChange={handleFormChange} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <DialogFooter className="p-6 pt-4 border-t bg-muted/50 flex justify-between w-full flex-shrink-0">
              {activeTab === 'personal' ? (
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}> 
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              {activeTab === 'personal' ? (
                <Button type="button" onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}> 
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}> 
                  {isSubmitting ? 'Submitting...' : 'Save'}
                </Button>
              )}
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}










// class AddFreelancerAPIView(APIView):
//     """
//     API to add Freelancer or IT Staff.
//     Access:
//     - Superuser → selects admin → auto team leader
//     - Admin → selects team leader
//     - Team Leader → auto assigned
//     """
//     permission_classes = [IsSuperuserOrAdminOrTeamLeader]
//     parser_classes = [MultiPartParser, FormParser]

//     def post(self, request, format=None):
//         serializer = AddFreelancerSerializer(
//             data=request.data,
//             context={'request': request}
//         )

//         if serializer.is_valid():
//             staff_instance = serializer.save()

//             # -------- Activity Log --------
//             try:
//                 if request.user.is_superuser:
//                     user_type = "Super User"
//                 elif getattr(request.user, "is_admin", False):
//                     user_type = "Admin User"
//                 else:
//                     user_type = "Team Leader"

//                 ip = request.META.get(
//                     'HTTP_X_FORWARDED_FOR',
//                     request.META.get('REMOTE_ADDR')
//                 )

//                 admin_log = None
//                 if getattr(request.user, "is_admin", False):
//                     admin_log = Admin.objects.filter(
//                         self_user=request.user
//                     ).last()

//                 ActivityLog.objects.create(
//                     admin=admin_log,
//                     user=request.user if request.user.is_superuser else None,
//                     description=f"New Freelancer/Staff ({staff_instance.name}) added by {user_type}",
//                     ip_address=ip,
//                     email=request.user.email,
//                     user_type=user_type,
//                     activity_type="Freelancer Created",
//                     name=request.user.name
//                 )
//             except Exception:
//                 pass

//             return Response(
//                 {
//                     "message": "Profile created successfully. Please wait for review.",
//                     "data": StaffProfileSerializer(staff_instance).data
//                 },
//                 status=status.HTTP_201_CREATED
//             )

//         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)








// class AddFreelancerSerializer(serializers.ModelSerializer):
//     password = serializers.CharField(write_only=True, required=True)
//     user_type = serializers.ChoiceField(
//         choices=['freelancer', 'it_staff'],
//         write_only=True
//     )
//     profile_image = serializers.FileField(required=False, allow_null=True)

//     # ONLY for SUPERUSER
//     admin_id = serializers.IntegerField(required=False, write_only=True)

//     # ONLY for ADMIN
//     team_leader_id = serializers.IntegerField(required=False, write_only=True)

//     referral_code = serializers.CharField(
//         source='join_referral',
//         required=False,
//         allow_blank=True
//     )

//     class Meta:
//         model = Staff
//         fields = [
//             'name', 'email', 'mobile', 'password', 'user_type', 'profile_image',
//             'admin_id', 'team_leader_id',
//             'address', 'city', 'state', 'pincode',
//             'referral_code', 'dob', 'pancard', 'aadharCard', 'degree',
//             'account_number', 'upi_id', 'bank_name', 'ifsc_code'
//         ]

//     # ---------------- CREATE ---------------- #

//     def create(self, validated_data):
//         request = self.context.get("request")

//         password = validated_data.pop("password")
//         user_type = validated_data.pop("user_type")
//         profile_image = validated_data.pop("profile_image", None)

//         admin_id = validated_data.pop("admin_id", None)
//         team_leader_id = validated_data.pop("team_leader_id", None)

//         # ---------------- USER FLAGS ---------------- #
//         is_freelancer = user_type == "freelancer"
//         is_it_staff = user_type == "it_staff"

//         # ---------------- CREATE USER ---------------- #
//         user = User.objects.create_user(
//             username=validated_data["email"],
//             email=validated_data["email"],
//             password=password,
//             name=validated_data.get("name"),
//             mobile=validated_data.get("mobile"),
//             profile_image=profile_image,
//             is_staff_new=True,
//             is_freelancer=is_freelancer,
//             is_it_staff=is_it_staff
//         )

//         # ---------------- ASSIGN TEAM LEADER ---------------- #
//         team_leader = None

//         # CASE 1️⃣ SUPERUSER
//         if request.user.is_superuser:
//             if not admin_id:
//                 raise serializers.ValidationError(
//                     {"admin_id": "Admin selection is required for superuser"}
//                 )

//             admin = Admin.objects.filter(id=admin_id).first()
//             if not admin:
//                 raise serializers.ValidationError(
//                     {"admin_id": "Invalid admin selected"}
//                 )

//             team_leader = Team_Leader.objects.filter(admin=admin).last()
//             if not team_leader:
//                 raise serializers.ValidationError(
//                     {"team_leader": "No team leader found for this admin"}
//                 )

//         # CASE 2️⃣ ADMIN
//         elif getattr(request.user, "is_admin", False):
//             if not team_leader_id:
//                 raise serializers.ValidationError(
//                     {"team_leader_id": "Team leader selection is required"}
//                 )

//             team_leader = Team_Leader.objects.filter(
//                 id=team_leader_id,
//                 admin__self_user=request.user
//             ).first()

//             if not team_leader:
//                 raise serializers.ValidationError(
//                     {"team_leader_id": "Invalid team leader selected"}
//                 )

//         # CASE 3️⃣ TEAM LEADER
//         elif getattr(request.user, "is_team_leader", False):
//             team_leader = Team_Leader.objects.filter(
//                 self_user=request.user
//             ).first()

//             if not team_leader:
//                 raise serializers.ValidationError(
//                     "Team leader profile not found"
//                 )

//         else:
//             raise serializers.ValidationError("Unauthorized role")

//         # ---------------- CREATE STAFF ---------------- #
//         staff = Staff.objects.create(
//             user=user,
//             team_leader=team_leader,
//             **validated_data
//         )

//         return staff

