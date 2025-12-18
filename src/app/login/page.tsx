'use client';

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { useRouter, useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';
import Image from "next/image";
import loginImage from "@/assests/login2.gif";
import loginimage2 from "@/assests/login4.png"
import {
  User,
  Mail,
  Lock,
  Calendar,
  CreditCard,
  Fingerprint,
  Building2,
  Map,
  Phone,
  GraduationCap,
  Tag,
  Camera,
  Landmark,
  Hash,
  MapPin,
  Users,
  Home,
  Link as LinkIcon,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
      <div className="flex items-center space-x-2">
        <motion.div
          className="h-4 w-4 bg-primary rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-4 w-4 bg-primary rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="h-4 w-4 bg-primary rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
      <p className="mt-4 text-lg font-medium text-primary">Authenticating...</p>
    </div>
  );
};


const InputField = ({
  id,
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  required,
  children,
}: {
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
}) => {
  const inputElement = children ? (
    React.cloneElement(children, {
      id,
      name,
      value,
      onChange,
      required,
      placeholder,
    })
  ) : (
    <Input
      type={type}
      id={id}
      name={name}
      value={value as string}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="pl-4 pr-10 h-11 transition-all duration-300"
    />
  );

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-2 border-transparent transition-all",
            "focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/.1)]"
          )}
        ></div>
        <div className="relative">
          {inputElement}
          {Icon && (
            <Icon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};

const LoginContent = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showUnauthenticatedModal, setShowUnauthenticatedModal] = useState(false); // New state for modal
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

    if (error === 'unauthenticated' || error === 'unauthorized') {
      // If there's an error, we must show the modal.
      // Invalidate the local session because the middleware has deemed it invalid.
      if (typeof window !== 'undefined') {
        Cookies.remove('authToken');
        Cookies.remove('userRole');
        Cookies.remove('userId');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
      }
      // Show the modal.
      setShowUnauthenticatedModal(true);
    } else if (storedRole) {
      // ONLY if there is no error, and the user is still logged in, redirect them.
      setIsAuthenticated(true);
      handleRedirect(storedRole);
    }
  }, [searchParams]);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [registerData, setRegisterData] = useState<{
    name: string;
    email: string;
    password: string;
    dob: string;
    city: string;
    state: string;
    mobile: string;
    degree: string;
    referralCode: string;
    profileImage: File | null;
    panCard: File | null;
    aadharCard: File | null;
    accountNumber: string;
    upiId: string;
    bankName: string;
    ifscCode: string;
    pincode: string;
    userType: string;
    address: string;
  }>({
    name: "",
    email: "",
    password: "",
    dob: "",
    city: "",
    state: "",
    mobile: "",
    degree: "",
    referralCode: "",
    profileImage: null,
    panCard: null,
    aadharCard: null,
    accountNumber: "",
    upiId: "",
    bankName: "",
    ifscCode: "",
    pincode: "",
    userType: "",
    address: "",
  });

  useEffect(() => {
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (storedRole) {
      setIsAuthenticated(true);
      handleRedirect(storedRole);
    }
  }, []);

  const profileImageUrl = useMemo(() => {
    if (registerData.profileImage) {
      return URL.createObjectURL(registerData.profileImage);
    }
    return "https://placehold.co/150x150/e2e8f0/a0aec0?text=Image";
  }, [registerData.profileImage]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    if (target.type === "file") {
      setRegisterData({
        ...registerData,
        [name]: target.files ? target.files[0] : null,
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
    }
  };

  const handleRegisterSelectChange = (name: string, value: string) => {
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleRedirect = (role: string) => {
    switch (role) {
      case "superadmin":
        router.push('/superadmin/dashboard');
        break;
      case "admin":
        router.push('/admin/users/team-leader');
        break;
      case "team-leader":
        router.push('/team-leader/');
        break;
      case "staff":
        router.push('/staff/dashboard');
        break;
      case "freelancer":
        router.push('/freelancer/dashboard'); // Assuming /freelancer/dashboard for freelancer
        break;
      default:
        router.push('/login');
        break;
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


    try {
      const response = await fetch(`${API_BASE_URL}/accounts/apilogin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (data.status) {
        if (typeof window !== 'undefined') {
          const token = data.data.token_detail;
          const userEmail = data.data.email;
          const userId = data.data.id;

          // Determine role from API response
          let userRole = 'superadmin'; // Default to superadmin if no other role matches
          if (data.data.is_admin) {
            userRole = 'admin';
          } else if (data.data.is_team_leader) {
            userRole = 'team-leader';
          } else if (data.data.is_staff_new) {
            userRole = 'staff';
          } else if (data.data.is_freelancer) {
            userRole = 'freelancer';
          }

          // console.log('Login API response data:', data.data); // Added for debugging
          // console.log('Determined userRole:', userRole); // Added for debugging

          // Set localStorage for client-side usage
          localStorage.setItem('authToken', token);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', data.data.name);

          // Set cookies for server-side middleware
          Cookies.set('authToken', token, { expires: 7, path: '/' });
          Cookies.set('userRole', userRole, { expires: 7, path: '/' });
          Cookies.set('userId', String(userId), { expires: 7, path: '/' });

          setIsAuthenticated(true);
          handleRedirect(userRole);
        }
        toast({
          title: "Login Successful!",
          description: data.message,
          className: 'bg-green-500 text-white'
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login API error:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(registerData).forEach(key => {
      const value = registerData[key as keyof typeof registerData];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const REGISTER_API_URL = `${API_BASE_URL}/accounts/register/`;

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        toast({
          title: "Registration Successful!",
          description: data.message,
          className: 'bg-green-500 text-white'
        });
        setIsRegisterOpen(false);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      //console.error("Registration API error:", error);
      toast({
        title: "Registration Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Reset",
      description: "If an account with that email exists, a reset link has been sent.",
    });
  }

  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.223 0-9.64-3.657-11.303-8.62H6.306C9.656 35.663 16.318 44 24 44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.244 44 30.028 44 24c0-1.341-.138-2.65-.389-3.917z"
      ></path>
    </svg>
  );

  const ReviewDetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined | null;
  }) => (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || "N/A"}</p>
    </div>
  );

  return (
    <>
      {(isLoading || isAuthenticated) && <LoadingOverlay />}

      {/* Unauthenticated Access Dialog */}
      <Dialog open={showUnauthenticatedModal} onOpenChange={setShowUnauthenticatedModal}>
        <DialogContent className="sm:max-w-md w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Please Login</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <Image src={loginImage} alt="Please Login" style={{ height: 150, width: 150 }} className="rounded-full" />
            <p className="mt-4 text-center text-muted-foreground">
              You need to be logged in to access this page.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Registration Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        {!isAuthenticated && (
          <section className="min-h-screen w-full flex items-center justify-center bg-card p-4">
            <Card className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden bg-background backdrop-blur-sm border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mt-1 text-foreground">
                      Welcome back!
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Enter your login credentials
                    </p>
                  </div>

                  <form id="login-form" onSubmit={handleLoginSubmit}>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          type="email"
                          id="username"
                          name="username"
                          placeholder="you@example.com"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          required
                          className="h-11 rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password">Password</Label>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm font-medium text-primary"
                              >
                                Forget password?
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90vw]" >
                              <DialogHeader>
                                <DialogTitle>Forgot Password</DialogTitle>
                                <DialogDescription>
                                  Enter your email to receive a password reset link.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="forgot-email">Email</Label>
                                  <Input id="forgot-email" type="email" placeholder="you@example.com" required />
                                </div>
                                <DialogFooter className="gap-2">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button type="submit">Send Reset Link</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            className="h-11 rounded-lg pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </Button>
                        </div>
                      </div>



                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onCheckedChange={(checked) =>
                            setLoginData({ ...loginData, rememberMe: !!checked })
                          }
                        />
                        <Label
                          htmlFor="rememberMe"
                          className="font-normal text-sm text-muted-foreground"
                        >
                          Remember for 30 days
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 h-auto text-base rounded-lg"
                        disabled={isLoading}
                      >
                        Login
                      </Button>
                    </div>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="w-full h-11 rounded-lg">
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Sign in with Google
                    </Button>
                  </div>
                  
                  {/*
                  <div className="text-center mt-6 text-sm">
                    <span className="text-muted-foreground">Not Registered?</span>{" "}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsRegisterOpen(true)}
                      className="p-0 h-auto font-medium text-primary hover:underline"
                    >
                      Create an account
                    </Button>
                  </div>
                  */}

                </div>
                <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-background rounded-l-3xl m-4 ml-0">
                  <Image
                    src={loginimage2}
                    alt="Login illustration"
                    width={800}
                    height={600}
                    className="rounded-2xl object-cover"
                    data-ai-hint="office team"
                  />
                </div>
              </div>
            </Card>
          </section>
        )}
        <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 bg-card rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 md:p-8 pb-0 flex-shrink-0">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
              Freelancer Registration
            </DialogTitle>
            <DialogDescription className="hidden md:block text-muted-foreground text-base">
              Fill out the form below to create your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="flex-1 flex flex-col min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-6 md:px-8 mt-4">
                <TabsList className="relative grid grid-cols-1 md:grid-cols-3 w-full bg-muted/80 rounded-lg p-1">
                  <TabsTrigger value="personal">
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="account">
                    Account Details
                  </TabsTrigger>
                  <TabsTrigger value="review">
                    Review &amp; Submit
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-grow mt-4 px-6 md:px-8 overflow-y-auto hide-scrollbar">
                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="reg-name"
                      label="Name"
                      name="name"
                      placeholder="John Doe"
                      icon={User}
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-email"
                      label="E-Mail Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      icon={Mail}
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                    <div className="relative flex flex-col space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••••••"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          className="pl-4 pr-10 h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                        >
                          {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                    </div>
                    <InputField
                      id="reg-mobile"
                      label="Mobile Number"
                      name="mobile"
                      type="tel"
                      placeholder="9876543210"
                      icon={Phone}
                      value={registerData.mobile}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-dob"
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      icon={Calendar}
                      value={registerData.dob}
                      onChange={handleRegisterChange}
                    />
                    <div className="md:col-span-2">
                      <InputField
                        id="reg-address"
                        label="Address"
                        name="address"
                        value={registerData.address}
                        onChange={handleRegisterChange}
                        required
                      >
                        <Textarea className="pl-4 pr-4 min-h-[80px]" />
                      </InputField>
                    </div>
                    <InputField
                      id="reg-city"
                      label="City"
                      name="city"
                      placeholder="Mumbai"
                      icon={Building2}
                      value={registerData.city}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-state"
                      label="State"
                      name="state"
                      icon={Map}
                      value={registerData.state}
                      onChange={handleRegisterChange}
                      required
                    >
                      <Select
                        onValueChange={(value) =>
                          handleRegisterSelectChange("state", value)
                        }
                        name="state"
                        required
                      >
                        <SelectTrigger className="pl-4 pr-10 h-11">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                    </InputField>
                    <InputField
                      id="reg-pincode"
                      label="Pincode"
                      name="pincode"
                      placeholder="400001"
                      icon={MapPin}
                      value={registerData.pincode}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-profile-image"
                      label="Profile Image"
                      name="profileImage"
                      type="file"
                      icon={Camera}
                      onChange={handleRegisterChange} value={""} />
                    <InputField
                      id="reg-degree"
                      label="Degree"
                      name="degree"
                      placeholder="B.Tech in CS"
                      icon={GraduationCap}
                      value={registerData.degree}
                      onChange={handleRegisterChange}
                    />
                    <InputField
                      id="reg-referral"
                      label="Referral Code"
                      name="referralCode"
                      placeholder="REF123"
                      icon={Tag}
                      value={registerData.referralCode}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="reg-bank-name"
                      label="Bank Name"
                      name="bankName"
                      placeholder="State Bank of India"
                      icon={Landmark}
                      value={registerData.bankName}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-account-number"
                      label="Account Number"
                      name="accountNumber"
                      placeholder="Your Bank Account Number"
                      icon={Wallet}
                      value={registerData.accountNumber}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-ifsc"
                      label="IFSC Code"
                      name="ifscCode"
                      placeholder="SBIN000000"
                      icon={Hash}
                      value={registerData.ifscCode}
                      onChange={handleRegisterChange}
                      required
                    />
                    <InputField
                      id="reg-upi"
                      label="UPI ID (Optional)"
                      name="upiId"
                      placeholder="yourname@upi"
                      icon={LinkIcon}
                      value={registerData.upiId}
                      onChange={handleRegisterChange}
                    />
                    <InputField
                      id="reg-user-type"
                      label="User Type"
                      name="userType"
                      icon={Users}
                      value={registerData.userType}
                      onChange={handleRegisterChange}
                      required
                    >
                      <Select
                        onValueChange={(value) =>
                          handleRegisterSelectChange("userType", value)
                        }
                        name="userType"
                        required
                      >
                        <SelectTrigger className="pl-4 pr-10 h-11">
                          <SelectValue placeholder="Select a User Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Freelancer">Freelancer</SelectItem>
                          <SelectItem value="Employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </InputField>
                  </div>
                </TabsContent>

                <TabsContent value="review">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                      <Image
                        src={profileImageUrl}
                        alt="Profile Preview"
                        width={120}
                        height={120}
                        className="rounded-full object-cover border-4 border-muted"
                        unoptimized
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1 text-center md:text-left">
                        <ReviewDetailItem
                          label="Full Name"
                          value={registerData.name}
                        />
                        <ReviewDetailItem
                          label="Email Address"
                          value={registerData.email}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewDetailItem
                          label="Mobile"
                          value={registerData.mobile}
                        />
                        <ReviewDetailItem
                          label="Date of Birth"
                          value={registerData.dob}
                        />
                        <ReviewDetailItem
                          label="Address"
                          value={registerData.address}
                        />
                        <ReviewDetailItem
                          label="City"
                          value={registerData.city}
                        />
                        <ReviewDetailItem
                          label="State"
                          value={registerData.state}
                        />
                        <ReviewDetailItem
                          label="Pincode"
                          value={registerData.pincode}
                        />
                        <ReviewDetailItem
                          label="Degree"
                          value={registerData.degree}
                        />
                        <ReviewDetailItem
                          label="Referral"
                          value={registerData.referralCode}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        Account Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewDetailItem
                          label="Bank Name"
                          value={registerData.bankName}
                        />
                        <ReviewDetailItem
                          label="Account No."
                          value={registerData.accountNumber}
                        />
                        <ReviewDetailItem
                          label="IFSC Code"
                          value={registerData.ifscCode}
                        />
                        <ReviewDetailItem
                          label="UPI ID"
                          value={registerData.upiId}
                        />
                        <ReviewDetailItem
                          label="User Type"
                          value={registerData.userType}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="mt-auto p-6 pt-4 border-t bg-muted/50 flex-shrink-0">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    activeTab === "account"
                      ? setActiveTab("personal")
                      : activeTab === "review"
                        ? setActiveTab("account")
                        : setActiveTab("personal")
                  }
                  className={cn(activeTab === "personal" && "invisible")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {activeTab !== "review" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      activeTab === "personal"
                        ? setActiveTab("account")
                        : activeTab === "review"
                    }
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="w-48 h-11 text-base" disabled={isLoading}>
                    Create Account
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
