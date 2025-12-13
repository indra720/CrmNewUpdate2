"use client";

import React, { useState,Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Phone,
  MessageSquare,
  User,
  Flag,
  Mail,
  Download,
  ArrowLeft,
  Plus,
  Minus,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Assuming Lead type is defined elsewhere or needs to be redefined here
// For now, let's use a basic type
type Lead = {
  id: number;
  name: string;
  call: string;
  status: string;
  email?: string; // Added for form
  description?: string; // Added for form
};

const ImportLeadContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

    const handleFormSubmit = async (e: React.FormEvent) => {

      e.preventDefault();

  

      if (!file) {

        toast({

          title: "Error",

          description: "Please select a CSV file to upload.",

          variant: "destructive",

        });

        return;

      }

  

      const token = localStorage.getItem("authToken");

      if (!token) {

        toast({

          title: "Error",

          description: "Authentication token not found. Please log in again.",

          variant: "destructive",

        });

        return;

      }

  

      const formData = new FormData();

      formData.append("excel_file", file);

  

      try {

              const response = await fetch(

                `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leads/upload-excel/`,

                {

            method: "POST",

            headers: {

              Authorization: `Token ${token}`,

            },

            body: formData,

          }

        );

  

        if (response.ok) {

          const result = await response.json();

          toast({

            title: "Success",

            description: "Leads imported successfully.",

            className: "bg-green-500 text-white",

          });

          // Reset form

          setFile(null);

          setSource("");

          setStatus("");

          setAssignee("");

        } else {

          const errorData = await response.json();

          toast({

            title: "Error",

            description: errorData.message || "Failed to import leads.",

            variant: "destructive",

          });

        }

      } catch (error) {

        //console.error("Error uploading file:", error);

        toast({

          title: "Error",

          description: "An unexpected error occurred.",

          variant: "destructive",

        });

      }

    };

  return (
    <>
      <div className="flex flex-col h-screen w-full p-2 sm:p-4">
        <div className="flex items-center gap-4 mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/superadmin/leads")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Leads Page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-2xl font-bold">Import Lead</h1>
        </div>

        <div className="flex-1 custom-scrollbar p-4 sm:p-6 border rounded-md bg-card text-card-foreground shadow-sm max-w-full md:max-w-2xl lg:max-w-6xl mx-auto">
          <div className="flex justify-start mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => {
                      const csvContent =
                        "Name,Call,Status\nAarav Sharma,9876543210,New\nSaanvi Patel,9876543211,Contacted";
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "sample_leads.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <span className="hidden sm:inline">Download Sample</span>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="sm:hidden" side="right">
                  <p>Download CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ul className="list-disc list-outside text-sm text-muted-foreground space-y-1 mt-2 pl-2 sm:pl-5 mb-4">
            <li>
              Your CSV data should be in the format below. The first line of
              your CSV file should be the column headers as in the table
              example. Also make sure that your file is UTF-8 to avoid
              unnecessary encoding problems.
            </li>
            <li>
              If the column you are trying to import is date make sure that is
              formatted in format Y-m-d (2024-09-06)
            </li>
            <li className="text-orange-500">
              Duplicate email rows wont be imported
            </li>
          </ul>

          <div className="mt-4 p-4 border rounded-md bg-muted/40 mb-4">
            <h3 className="text-md font-semibold mb-2">CSV Import Fields:</h3>
            <div className="block md:hidden">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="w-16">S.N.</TableHead>
                    <TableHead className="flex-1 min-w-0">Name</TableHead>
                    <TableHead className="w-24">City</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b">
                    <TableCell className="w-16 p-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-6 w-6 p-0 text-green-500"
                      >
                        {isExpanded ? (
                          <Minus className="h-3 w-3" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                        <span className="sr-only">Toggle details</span>
                      </Button>
                    </TableCell>
                    <TableCell className="min-w-0 truncate">John Doe</TableCell>
                    <TableCell className="w-24 truncate">Mumbai</TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={3} className="p-0">
                        <div className="w-full p-3 bg-card border-t border-border">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src="https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=JD"
                                alt="Profile"
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-200"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 rounded-full p-0.5 sm:p-1">
                                {/* <UserIcon className="h-2 w-2 sm:h-3 sm:w-3 text-white" /> */}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-sm sm:text-base truncate">
                                John Doe
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate flex items-center gap-1">
                                <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                john.doe@example.com
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs sm:text-sm divide-y divide-border">
                            <div className="pt-2 first:pt-0">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Ph. No:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate">
                                  9876543210
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  City:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate">
                                  Mumbai
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Zip:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate">
                                  400001
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Position:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate">
                                  Sales Manager
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Company:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate">
                                  ABC Corp
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  State:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate">
                                  Maharashtra
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Address:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate break-words">
                                  123 Main St
                                </span>
                              </div>
                            </div>
                            <div className="pt-2 pb-4">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Description:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate break-words">
                                  Interested in product X
                                </span>
                              </div>
                            </div>
                            <div className="pt-2 pb-4">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-medium min-w-0 truncate">
                                  Website:
                                </span>
                                <span className="text-muted-foreground min-w-0 truncate break-all">
                                  www.abccorp.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="border-r">S.N.</TableHead>
                    <TableHead className="border-r">Name</TableHead>
                    <TableHead className="border-r">Email</TableHead>
                    <TableHead className="border-r">Ph.NO</TableHead>
                    <TableHead className="border-r">City</TableHead>
                    <TableHead className="border-r">Zip</TableHead>
                    <TableHead className="border-r">Position</TableHead>
                    <TableHead className="border-r">Company</TableHead>
                    <TableHead className="border-r">State</TableHead>
                    <TableHead className="border-r">Address</TableHead>
                    <TableHead className="border-r">Description</TableHead>
                    <TableHead>Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b">
                    <TableCell className="border-r">1</TableCell>
                    <TableCell className="border-r">John Doe</TableCell>
                    <TableCell className="border-r">
                      john.doe@example.com
                    </TableCell>
                    <TableCell className="border-r">9876543210</TableCell>
                    <TableCell className="border-r">Mumbai</TableCell>
                    <TableCell className="border-r">400001</TableCell>
                    <TableCell className="border-r">Sales Manager</TableCell>
                    <TableCell className="border-r">ABC Corp</TableCell>
                    <TableCell className="border-r">Maharashtra</TableCell>
                    <TableCell className="border-r">123 Main St</TableCell>
                    <TableCell className="border-r">
                      Interested in product X
                    </TableCell>
                    <TableCell>www.abccorp.com</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6 pt-4"
          >
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="csv-file"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Choose CSV File
              </Label>
              <Input
                type="file"
                id="csv-file"
                name="csv-file"
                accept=".csv"
                onChange={handleFileChange}
                className="h-11   file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="source"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Source
              </Label>
              <Select required onValueChange={setSource} value={source}>
                <SelectTrigger id="source" className="h-11">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Team">IT Team</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="FaceBook">FaceBook</SelectItem>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Flag className="w-4 h-4" /> Status
              </Label>
              <Select required onValueChange={setStatus} value={status}>
                <SelectTrigger id="status" className="h-11">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot Leads">Hot Leads</SelectItem>
                  <SelectItem value="Lost Lead">Lost Lead</SelectItem>
                  <SelectItem value="Fresh Leads">Fresh Leads</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="FaceBook">FaceBook</SelectItem>
                  <SelectItem value="Follow Up">Follow Up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="assignee"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Responsible (Assignee)
              </Label>
              <Select required onValueChange={setAssignee} value={assignee}>
                <SelectTrigger id="assignee" className="h-11">
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nothing Selected">
                    Nothing Selected
                  </SelectItem>
                  <SelectItem value="FaceBook">FaceBook</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Uday Singh">Uday Singh</SelectItem>
                  <SelectItem value="Yogesh Chaudhary">
                    Yogesh Chaudhary
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <Button type="submit">Import</Button>
              <Button variant="outline">Simulate Import</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


export default function ImportLeadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImportLeadContent />
    </Suspense>
  );
}
