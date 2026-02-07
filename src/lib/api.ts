import { ReactNode } from "react";

export async function toggleUserActiveStatus(
  userId: number,
  userType: string,
  isActive: boolean,
): Promise<void> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const requestData = {
    user_id: userId,
    user_type: userType,
    is_active: isActive,
  };
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/toggle-active/`;
    // console.log("TOGGLE API: URL -", apiUrl);
    // console.log("TOGGLE API: Request Body -", requestData);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    // console.log("TOGGLE API: Response Status -", response.status);
    // console.log("TOGGLE API: Response OK -", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("TOGGLE API: Error Response Data -", errorData);
      throw new Error(
        errorData.message ||
          errorData.detail ||
          `HTTP error! status: ${response.status}`,
      );
    } else {
      const successData = await response.json();
      //console.log("TOGGLE API: Success Response Data -", successData);
    }

    //console.log("=== TOGGLE API SUCCESS ===");
    // No need to return anything specific, just resolve if successful
  } catch (error: any) {
    //console.error("TOGGLE API: Caught Error -", error);
    throw new Error(
      `Failed to toggle user status: ${error.message || "Unknown error"}`,
    );
  }
}

// Funtion to fetch admin leads by tag because it's a same api call as the one used in the AdminLeadTable component.
export async function fetchAdminLeadsByTag(
  tag: string,
): Promise<{ staff_leads: any[]; team_leads: any[] }> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/admin-leads/${tag}/`;
    //console.log("Fetching URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch leads for tag ${tag}:`, error);
    throw new Error(
      `Failed to fetch leads: ${error.message || "Unknown error"}`,
    );
  }
}

export async function updateLeadStatusAndFollowUp(
  leadId: number,
  status: string,
  message: string,
  followUpDate: string,
  followUpTime: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/update-lead-status/${leadId}/`,
      {
        method: "PATCH", // Assuming PATCH for partial update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          status: status,
          message: message,
          follow_up_date: followUpDate,
          follow_up_time: followUpTime,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(
    //   `Failed to update lead ${leadId} status and follow-up:`,
    //   error
    // );
    throw new Error(
      `Failed to update lead status and follow-up: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

//  Funciton to fethch all admins cards
export async function fetchAdmins(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.users || [];
  } catch (error: any) {
    console.error("Failed to fetch admins:", error);
    throw new Error(
      `Failed to fetch admins: ${error.message || "Unknown error"}`,
    );
  }
}

//  function to fetch superuser staff leads by tag.
export async function fetchSuperuserStaffLeadsByTag(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/superuser/staff-leads/${tag}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch superuser staff leads for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch superuser staff leads: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// function to fetch teamleader edit api call.
export async function editTeamLeader(id: number, formData: any): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/team-leader/edit/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Failed to edit team leader:", error);
    throw new Error(
      `Failed to edit team leader: ${error.message || "Unknown error"}`,
    );
  }
}

export async function fetchSuperuserTeamLeaderLeadsByTag(
  tag: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/team-leader-leads/${tag}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch superuser team leader leads for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch superuser team leader leads: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

export async function fetchSuperuserFreelancerLeadsByTag(
  tag: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/freelancer-leads/${tag}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch superuser freelancer leads for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch superuser freelancer leads: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

export async function fetchAdminsForSelection(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error: any) {
    console.error("Failed to fetch admins:", error);
    throw new Error(
      `Failed to fetch admins: ${error.message || "Unknown error"}`,
    );
  }
}

export async function fetchTeamLeaders(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/team-leader-dashboard/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    console.error("Failed to fetch team leaders:", error);
    throw new Error(
      `Failed to fetch team leaders: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Admin to fetch staff report data
export async function fetchAdminStaffReport(
  startDate?: string,
  endDate?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/staff-dashboard/`;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    //console.log(`Fetching Admin Staff Report:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.detail ||
          "Failed to fetch admin staff report data.",
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Admin Staff Report Data:`, error);
    throw new Error(
      `Failed to fetch Admin Staff Report Data: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Team Leader to fetch their own staff list
export async function fetchTeamLeaderStaffList(): Promise<any[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/staff-dashboard/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.staff_list || []; // Assuming staff_list contains the staff data
  } catch (error: any) {
    //console.error("Failed to fetch Team Leader's staff list:", error);
    throw new Error(
      `Failed to fetch Team Leader's staff list: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// Function to fetch interested leads
export async function fetchInterestedLeads(search?: string): Promise<Lead[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/superuser/staff-leads/interested/`;
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(
      url, // CORRECTED URL
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.results || []; // Adjusted for paginated response from backend snippet
  } catch (error: any) {
    //console.error("Failed to fetch interested leads:", error);
    throw new Error(
      `Failed to fetch interested leads: ${error.message || "Unknown error"}`,
    );
  }
}

interface AssignedTo {
  id: number;
  name: string;
  staff_id: string;
  email: string;
  mobile: string;
}

export interface Lead {
  dateTime: ReactNode;
  team_leader: any;
  id: number;
  name: string;
  email: string;
  call: string;
  send: string | null;
  status: string;
  message: string;
  follow_up_date: string | null;
  follow_up_time: string | null;
  created_date: string;
  assigned_to: AssignedTo;
}

// lead histor api call. for leads-report/interested page
interface InterestedLeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

export interface LeadHistoryEntry {
  id: number;
  lead_id: number;
  status: string;
  message: string;
  created_date: string;
  updated_date: string;
  leads: number;
}

export async function fetchLeadHistory(
  leadId: string,
): Promise<LeadHistoryEntry[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leads-history/?lead_id=${leadId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result = await response.json();
    if (result.status && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch lead history.");
    }
  } catch (error: any) {
    //console.error(`Failed to fetch history for lead ${leadId}:`, error);
    throw new Error(
      `Failed to fetch lead history: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Admin to fetch lead history by ID
export async function fetchAdminLeadHistoryById(leadId: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/lead-history/${leadId}/`;

    //console.log(`Fetching Admin Lead History for Lead ID ${leadId}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Admin Lead History for Lead ID ${leadId}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Admin Lead History: ${error.message || "Unknown error"}`,
    );
  }
}

// users ke pages ke card ke liye api

export async function fetchLeadsForSuperuser(
  tag: string,
  source: string | null,
  startDate?: string,
  endDate?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  let endpoint = "";

  switch (source) {
    case "admin":
      endpoint = `/accounts/api/admin-leads/${tag}/`;

      break;

    case "team-leader":
      endpoint = `/accounts/api/superuser/team-leader-leads/${tag}/`;

      break;

    case "staff":
      endpoint = `/accounts/superuser/staff-leads/${tag}/`;

      break;

    case "associate":
      endpoint = `/accounts/api/superuser/freelancer-leads/${tag}/`;

      break;

    default:
      // Fallback or error

      throw new Error(`Invalid source for fetching leads: ${source}`);
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch leads for tag ${tag} and source ${source}:`,
    //   error
    // );

    throw new Error(
      `Failed to fetch leads: ${error.message || "Unknown error"}`,
    );
  }
}

// pending,today and tomorrow  and interested ka page

export async function fetchLeadsForStaff(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const endpoint = `/accounts/staff/leads/${tag}/`;

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

    //console.log(`Fetching URL for staff leads:`, url);

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch leads for tag ${tag} for staff:`, error);

    throw new Error(
      `Failed to fetch leads: ${error.message || "Unknown error"}`,
    );
  }
}

// peding,today,tomorrow and interested api

export async function fetchStaffLeadsReport(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/interested-leads/${tag}/`;

    //console.log(`Fetching staff leads report for tag ${tag}:`, url);

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch staff leads report for tag ${tag}:`, error);

    throw new Error(
      `Failed to fetch staff leads report: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Team Leader interested leads report
export async function fetchTeamLeaderInterestedLeadsReport(
  tag: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/interested-leads/${tag}/`;

    //console.log(
    //   `Fetching Team Leader interested leads report for tag ${tag}:`,
    //   url
    // );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Team Leader interested leads report for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Team Leader interested leads report: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Team Leader lost leads report
export async function fetchTeamLeaderLostLeadsReport(
  tag: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/lost-leads/${tag}/`;

    // console.log(`Fetching Team Leader lost leads report for tag ${tag}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Team Leader lost leads report for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Team Leader lost leads report: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New common function for Team Leader staff leads reports by tag
export async function fetchTeamLeaderStaffLeadsReportByTag(
  staffId: number,
  tag: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/staff-leads/${staffId}/${tag}/`;

    // console.log(
    //   `Fetching Team Leader staff leads report for staff ${staffId} with tag ${tag}:`,
    //   url
    // );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Team Leader staff leads report for staff ${staffId} with tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Team Leader staff leads report: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Admin to fetch staff leads by tag
export async function fetchAdminStaffLeadsByTag(
  staffId: number,
  tag: string,
  formattedStartDate: string | undefined,
  formattedEndDate: string | undefined,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/staff-leads/by-staff/${staffId}/${tag}/`;

    // console.log(
    //   `Fetching Admin staff leads for staff ${staffId} with tag ${tag}:`,
    //   url
    // );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Admin staff leads for staff ${staffId} with tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Admin staff leads: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Team Leader to fetch their own customer data by tag
export async function getTeamCustomersByTag(
  tag: string,
  formattedStartDate: string | undefined,
  formattedEndDate: string | undefined,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/teamcustomer/${tag}/`;

    // NO DATE PARAMETERS HERE
    // const params = new URLSearchParams();
    // if (startDate) params.append("start_date", startDate);
    // if (endDate) params.append("end_date", endDate);
    // if (params.toString()) {
    //   url += `?${params.toString()}`;
    // }

    //console.log(`Fetching Team Leader customers for tag ${tag}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Team Leader customers for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Team Leader customers: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Superuser to fetch team customer leads by tag
export async function getTeamCustomerLeads(
  tag: string,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-customer/${tag}/`;
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    //console.log(`Fetching Team Customer leads for tag ${tag}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Team Customer leads for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Team Customer leads: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Team Leader to fetch their own visit leads data
export async function fetchTeamLeaderVisitLeads(): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/visits/`;

    //console.log(`Fetching Team Leader visit leads:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Team Leader visit leads:`, error);
    throw new Error(
      `Failed to fetch Team Leader visit leads: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Team Leader to fetch their main leads page data
export async function fetchTeamLeaderLeadsPageData(): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/leads/`;

    //console.log(`Fetching Team Leader leads page data:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Team Leader leads page data:`, error);
    throw new Error(
      `Failed to fetch Team Leader leads page data: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New common function for Team Leader to fetch all leads by tag for report pages
export async function fetchTeamLeaderAllLeadsByTag(tag: string): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/all-leads/${tag}/`;

    //console.log(`Fetching Team Leader all leads report for tag ${tag}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(
    //   `Failed to fetch Team Leader all leads report for tag ${tag}:`,
    //   error
    // );
    throw new Error(
      `Failed to fetch Team Leader all leads report: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function to export Team Leader leads
export async function exportTeamLeaderLeads(payload: {
  status: string;
  start_date?: string;
  end_date?: string;
  staff_id?: string; // Optional staff_id
  all_interested?: string; // '1' or '0'
}): Promise<void> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/export-leads/`; // Corrected URL
    // console.log("Attempting to export from URL:", url);
    // console.log("Request body:", JSON.stringify(payload)); // Log the payload

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Try to parse error response as JSON
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Failed to export leads.",
        );
      } catch (e) {
        // If not JSON, use status text
        throw new Error(response.statusText || "Failed to export leads.");
      }
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    // Extract filename from content-disposition header
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `${payload.status}_leads.xlsx`; // Use payload.status for filename
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error: any) {
    //console.error(`Failed to export leads for status ${payload.status}:`, error);
    throw new Error(
      `Failed to export leads: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Admin to fetch Team Leader Report Data
export async function fetchAdminTeamLeaderReportData(
  startDate?: string,
  endDate?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/team-leader-report/`;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    //console.log(`Fetching Admin Team Leaders:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Admin Team Leaders:`, error);
    throw new Error(
      `Failed to fetch Admin Team Leaders: ${error.message || "Unknown error"}`,
    );
  }
}

// users ke teamleader ke page me data fetching
export async function fetchAdminTeamLeaders(
  startDate?: string,
  endDate?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/team-leader-report/`;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    //console.log(`Fetching Admin Team Leaders:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Admin Team Leaders:`, error);
    throw new Error(
      `Failed to fetch Admin Team Leaders: ${error.message || "Unknown error"}`,
    );
  }
}

// users ke staff ke page me data fetching
export async function fetchAdminStaffs(
  startDate?: string,
  endDate?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/staff-report/`;

    const params = new URLSearchParams();

    if (startDate) params.append("start_date", startDate);

    if (endDate) params.append("end_date", endDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    //console.log(`Fetching Admin Staffs:`, url);

    const response = await fetch(
      url,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Admin Staffs:`, error);

    throw new Error(
      `Failed to fetch Admin Staffs: ${error.message || "Unknown error"}`,
    );
  }
}

//staff incentive page api
export async function fetchAdminStaffIncentive(
  staffId: number,
  year: number,
  month: number,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/staff-incentive/${staffId}/?year=${year}&month=${month}`;

    // //console.log(
    //   `Fetching Admin staff incentive for staff ${staffId} with year ${year} and month ${month}:`,

    //   url
    // );

    const response = await fetch(url, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    // console.error(  `Failed to fetch Admin staff incentive for staff ${staffId}:`,error );

    throw new Error(
      `Failed to fetch Admin staff incentive: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Admin to fetch staff leads Kpi counts by tag
export async function fetchAdminStaffLeadsKpiCountByTag(
  tag: string,
  startDate?: string,
  endDate?: string,
): Promise<number> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/staff-leads/${tag}/`;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    // console.log(`Fetching Admin staff leads KPI count for tag ${tag}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    // Special handling for 'total_earning' until backend clarifies
    if (tag === "total_earning") {
      // If the API for 'total_earning' is supposed to return an actual sum,
      // it's not reflected in the provided backend code.
      // Returning 0 for now as the backend logic returns a paginated list of leads.
      return 0;
    }

    return data.count !== undefined
      ? data.count
      : data.results
        ? data.results.length
        : 0;
  } catch (error: any) {
    //console.error(`Failed to fetch Admin staff leads KPI count for tag ${tag}:`,error );
    throw new Error(
      `Failed to fetch Admin staff leads KPI count: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Admin to fetch staff leads Kpi counts by tag for /accounts/api/adminn/staff-leads/<str:tag>/
export async function fetchAdminnStaffLeadsKpiCountByTag(
  tag: string,
  startDate?: string,
  endDate?: string,
): Promise<number> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/adminn/staff-leads/${tag}/`;
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    // console.log(`Fetching Admin (new) staff leads KPI count for tag ${tag}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    // Assuming the API returns a paginated response with a 'count' field for leads
    // The backend code in comment returns a list of leads, not a sum.
    // So, we'll try to get the count of items.
    return data.count !== undefined
      ? data.count
      : data.results
        ? data.results.length
        : 0;
  } catch (error: any) {
    //console.error(`Failed to fetch Admin (new) staff leads KPI count for tag ${tag}:`, error);
    throw new Error(
      `Failed to fetch Admin (new) staff leads KPI count: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function for Admin to fetch total leads
export async function fetchAdminTotalLeads(): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/total-leads/`;

    //console.log(`Fetching Admin Total Leads:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Admin Total Leads:`, error);
    throw new Error(
      `Failed to fetch Admin Total Leads: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Admin to add a lead
export async function addAdminLead(leadData: {
  name: string;
  status: string;
  email?: string;
  mobile: string;
  description?: string;
}): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leads/admin/add/`;

    // console.log(`Adding Admin Lead to:`, url);
    // console.log(`Lead Data:`, leadData);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to add Admin Lead:`, error);
    throw new Error(
      `Failed to add Admin Lead: ${error.message || "Unknown error"}`,
    );
  }
}

// New function for Admin to fetch lead history by ID
export async function fetchAdminDashboardLeadHistoryById(
  leadId: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/lead-history/${leadId}/`;

    //console.log(`Fetching Admin Lead History for Lead ID ${leadId}:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch Admin Lead History for Lead ID ${leadId}:`,error);
    throw new Error(
      `Failed to fetch Admin Lead History: ${error.message || "Unknown error"}`,
    );
  }
}

// leads report pages leads update api
export async function updateAdminLeadStatus(
  leadId: number,
  status: string,
  message?: string,
  followUpDate?: string,
  followUpTime?: string,
): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const requestBody: {
    status: string;
    message?: string;
    followDate?: string;
    followTime?: string;
  } = {
    status: status,
  };

  if (message) requestBody.message = message;
  if (followUpDate) requestBody.followDate = followUpDate;
  if (followUpTime) requestBody.followTime = followUpTime;

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/change-lead-status/${leadId}/`;
    // console.log(`Updating Admin Lead Status for Lead ID ${leadId}:`, url);
    // console.log(`Request Body:`, requestBody);

    const response = await fetch(url, {
      method: "POST", // Changed to POST as per user's instruction
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      //console.error("API Error Response:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to update Admin Lead Status for Lead ID ${leadId}:`,error);
    throw new Error(
      `Failed to update Admin Lead Status: ${error.message || "Unknown error"}`,
    );
  }
}

// Function to fetch current logged-in user's profile
export async function fetchCurrentUserProfile(): Promise<{
  name: string;
  email: string; /* ... other profile fields */
}> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/profile/`; // Assuming this endpoint exists
    //console.log(`Fetching current user profile from:`, url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    //console.error(`Failed to fetch current user profile:`, error);
    throw new Error(
      `Failed to fetch user profile: ${error.message || "Unknown error"}`,
    );
  }
}

// new function to fetch projects
import { Project, Sprint, Milestone, Task } from "@/types";

// Map for converting numeric day representation (1=Mon, 7=Sun) to backend's expected string abbreviation
const DAYS_OF_WEEK_MAP: { [key: number]: string } = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun",
};

// Map for converting string day abbreviation to numeric day representation
const DAYS_OF_WEEK_REVERSE_MAP: { [key: string]: number } = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
};

export async function fetchProjects(): Promise<Project[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/projects/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    const projectsFromApi = Array.isArray(data) ? data : data.results || [];

    // Fetch members for all projects concurrently
    const projectsWithMembersPromises = projectsFromApi.map(
      async (project: any) => {
        try {
          const members = await fetchProjectMembersForProjectCard(project.id);
          return {
            ...project,
            startDate: project.start_date,
            endDate: project.end_date,
            members: members.map((member) => ({
              name: member.user_name,
              role: member.role,
            })), // Map to { name: string, role: string }
          };
        } catch (memberError) {
          console.error(
            `Error fetching members for project ${project.id}:`,
            memberError,
          );
          return {
            ...project,
            startDate: project.start_date,
            endDate: project.end_date,
            members: [], // Return empty array if fetching members fails
          };
        }
      },
    );

    const transformedProjects = await Promise.all(projectsWithMembersPromises);

    return transformedProjects;
  } catch (error: any) {
    console.error("Failed to fetch projects:", error);
    throw new Error(
      `Failed to fetch projects: ${error.message || "Unknown error"}`,
    );
  }
}

// Define the interface for a project member as received from the API
interface ProjectMember {
  id: string; // ProjectMember ID (UUID)
  user_name: string;
  project_name: string;
  role: string;
  user: number; // Numeric user ID for the backend API
  // Add other fields from the API response if needed
}

export async function fetchProjectMembersForProjectCard(
  projectId: string,
): Promise<ProjectMember[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/project-members/?project=${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    console.error("Failed to fetch project members:", error);
    throw new Error(
      `Failed to fetch project members: ${error.message || "Unknown error"}`,
    );
  }
}

export async function fetchSprints(projectId?: string): Promise<Sprint[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/sprints/`;
    if (projectId) {
      url += `?project=${projectId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    console.error("Failed to fetch sprints:", error);
    throw new Error(
      `Failed to fetch sprints: ${error.message || "Unknown error"}`,
    );
  }
}

export async function fetchMilestones(projectId?: string): Promise<Milestone[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/milestones/`;
    if (projectId) {
      url += `?project=${projectId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.results || [];
  } catch (error: any) {
    console.error("Failed to fetch milestones:", error);
    throw new Error(
      `Failed to fetch milestones: ${error.message || "Unknown error"}`,
    );
  }
}

interface TaskPayload {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
  due_date: string; // YYYY-MM-DD
  project: string; // UUID
  assigned_to?: number; // User ID
  sprint?: string; // UUID
  milestone?: string; // UUID
  // Optional fields not in form
  position?: number;
  estimated_hours?: number;
}

export async function createTask(taskData: TaskPayload): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/tasks/`;
    console.log("Creating task with payload:", taskData); // Log payload

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Create task API error:", errorData);
      throw new Error(
        errorData.message || errorData.detail || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Failed to create task:", error);
    throw new Error(
      `Failed to create task: ${error.message || "Unknown error"}`,
    );
  }
}

export interface MilestonePayload {
  project: string; // UUID
  sprint: string | null; // UUID
  title: string;
  code: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date: string; // YYYY-MM-DD
  owner: number | null; // User ID
  status: 'not_started' | 'in_progress' | 'blocked' | 'completed';
  criteria: Array<{ title: string; is_completed: boolean; }>;
}

export async function createMilestone(milestoneData: MilestonePayload): Promise<any> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/milestones/`;
    console.log("Creating milestone with payload:", milestoneData);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(milestoneData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Create milestone API error:", errorData);
      throw new Error(
        errorData.message || errorData.detail || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Failed to create milestone:", error);
    throw new Error(
      `Failed to create milestone: ${error.message || "Unknown error"}`,
    );
  }
}