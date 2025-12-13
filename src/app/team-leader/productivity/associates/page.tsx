"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductivityAssociatesPage = () => {
  // const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [AssociateData, setAssociateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssociateData = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    setError(null);
    // const adminResponse = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
    //   {
    //     headers: { Authorization: ` Token ${token}` },
    //   }
    // );
    // if (adminResponse.ok) {
    //   const adminData = await adminResponse.json();
    //   setAdmins(adminData.users || []);
    // } else {
    //   //console.error("filed to fetching admin failed");
    // }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/team-leader/freelancer-productivity/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAssociateData(data);
      // setAdmins(data.admins_filter_list || []);
      //console.log("Data fetched successfully", data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociateData();
  }, [selectedAdmin, startDate, endDate]);

  const handleAdminChange = (value: string) => {
    setSelectedAdmin(value);
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading team leader productivity data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8 text-lg text-red-500">
        Error: {error}
      </div>
    );
  }
  if (!AssociateData) {
    return (
      <div className="text-center py-8 text-lg">
        No team leader productivity data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Productivity Index</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <div className="space-y-2">
              <Label htmlFor="admin-select">Admin</Label>

            </div> */}

            <div className="space-y-2 md:w-48">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="md:pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hidden md:flex" />
              </div>
            </div>

            <div className="space-y-2 md:w-48">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="md:pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hidden md:flex" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Total Calls</TableHead>
                  <TableHead className="hidden md:table-cell">Interested</TableHead>
                  <TableHead className="hidden md:table-cell">Visit</TableHead>
                  <TableHead className="hidden lg:table-cell">Not Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Other Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Lost</TableHead>
                  <TableHead className="hidden lg:table-cell">Interested %</TableHead>
                  <TableHead className="text-right">Visit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AssociateData.staff_data && AssociateData.staff_data.map((row: any, i: number) => (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={expandedRowId === row.id && 'selected'}>
                      <TableCell>
                        <div className="lg:hidden">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-green-600"
                            onClick={() => toggleRow(row.id)}
                          >
                            {expandedRowId === row.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="hidden lg:block">
                          {i + 1}.
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.total_calls}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.interested}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.visit}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.not_interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.other_location}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.lost}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.interested_percentage}%</TableCell>
                      <TableCell className="text-right">{row.visit_percentage}%</TableCell>
                    </TableRow>
                    {expandedRowId === row.id && (
                      <TableRow className="lg:hidden">
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="text-lg font-bold">{row.name}</div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Total Calls:</span>
                                    <span className="text-sm capitalize ml-auto">{row.total_calls}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Interested:</span>
                                    <span className="text-sm ml-auto">{row.interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Not Interested:</span>
                                    <span className="text-sm ml-auto">{row.not_interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Other Location:</span>
                                    <span className="text-sm ml-auto">{row.other_location}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Lost:</span>
                                    <span className="text-sm ml-auto">{row.lost}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Visit:</span>
                                    <span className="text-sm ml-auto">{row.visit}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Interested %:</span>
                                    <span className="text-sm ml-auto">{row.interested_percentage}%</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Visit %:</span>
                                    <span className="text-sm ml-auto">{row.visit_percentage}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                {(!AssociateData.staff_data || AssociateData.staff_data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="hidden md:table-cell">{AssociateData.total_all_calls}</TableCell>
                  <TableCell className="hidden md:table-cell">{AssociateData.total_all_interested}</TableCell>
                  <TableCell className="hidden md:table-cell">{AssociateData.total_all_visit}</TableCell>
                  <TableCell className="hidden lg:table-cell">{AssociateData.total_all_not_interested}</TableCell>
                  <TableCell className="hidden lg:table-cell">{AssociateData.total_all_other_location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{AssociateData.total_all_lost}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {AssociateData.total_all_calls > 0 ? Math.round((AssociateData.total_all_interested / AssociateData.total_all_calls) * 100) : 0}%
                  </TableCell>
                  <TableCell className="text-right">
                    {AssociateData.total_all_calls > 0 ? Math.round((AssociateData.total_all_visit / AssociateData.total_all_calls) * 100) : 0}%
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityAssociatesPage;
