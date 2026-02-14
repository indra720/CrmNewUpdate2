import { ReactNode } from "react";
import { TaskViewTask } from "@/types"; // Import TaskViewTask

// Define a mapping for frontend display names to backend API names
const taskStatusFrontendToBackendMap: { [key: string]: string } = {
  "To Do": "to_do",
  "In Progress": "in_progress",
  Review: "review", // Added
  Done: "done",
  Blocked: "blocked", // Added
};

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
import { Project, Milestone, Task } from "@/types";
import { Sprint, SprintHistoryEntry } from "@/components/pms/sprint-types";

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

// Placeholder for fetching users
export async function fetchUsers(): Promise<any[]> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  // This is a placeholder. Implement actual API call to fetch users.
  console.warn("fetchUsers: This is a placeholder function.");
  return []; // Return an empty array for now
}

// Placeholder for creating a sprint
export async function createSprint(sprintData: any): Promise<any> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  // This is a placeholder. Implement actual API call to create a sprint.
  console.warn("createSprint: This is a placeholder function.");
  console.log("Attempting to create sprint with data:", sprintData);
  return { success: true, message: "Sprint created (placeholder)" };
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

export async function fetchMilestones(
  projectId?: string,
): Promise<Milestone[]> {
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
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in_progress" | "review" | "done" | "blocked";
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
        errorData.message ||
          errorData.detail ||
          `HTTP error! status: ${response.status}`,
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
  priority: "low" | "medium" | "high" | "critical";
  due_date: string; // YYYY-MM-DD
  owner: number | null; // User ID
  status: "not_started" | "in_progress" | "blocked" | "completed";
  criteria: Array<{ title: string; is_completed: boolean }>;
}

export async function createMilestone(
  milestoneData: MilestonePayload,
): Promise<any> {
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
        errorData.message ||
          errorData.detail ||
          `HTTP error! status: ${response.status}`,
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

export async function moveTaskApi(
  taskId: string,
  newStatus: TaskViewTask["status"],
): Promise<void> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Authentication token not found.");
    throw new Error("Authentication token not found. Please log in again.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not defined.");
    throw new Error(
      "API Base URL is not defined. Please check environment variables.",
    );
  }

  let cleanId = taskId;
  if (taskId && taskId.includes("-")) {
    const parts = taskId.split("-");
    const lastPart = parts[parts.length - 1];
    if (!isNaN(Number(lastPart))) {
      cleanId = lastPart;
    }
  }

  // Translate the frontend status to the backend's expected format
  const backendStatus = taskStatusFrontendToBackendMap[newStatus];
  if (!backendStatus) {
    console.error(
      `Invalid frontend status provided: ${newStatus}. No mapping found.`,
    );
    throw new Error(`Invalid task status: ${newStatus}.`);
  }

  const url = `${apiBaseUrl}/api/projects/tasks/${cleanId}/move/`;
  console.log(
    `Attempting PATCH request to URL: ${url} for task ID: ${taskId} (Clean ID: ${cleanId}) with new status: ${backendStatus}`,
  );

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ status: backendStatus }), // Send the translated status
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail =
          errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorDetail = await response.text();
      }
      const errorMessage = `Failed to move task ${taskId}: ${errorDetail}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    console.log(
      `Task ${taskId} moved successfully to ${backendStatus}. Response status: ${response.status}`,
    );
  } catch (error: any) {
    const errorMessage = `Network or unexpected error moving task ${taskId}: ${error.message || "Unknown error"}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Function to post a new comment for a task
export async function createTaskComment(
  taskId: string,
  commentText: string,
): Promise<Comment> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error(
      "API Base URL is not defined. Please check environment variables.",
    );
  }

  const url = `${apiBaseUrl}/api/projects/task-comments/`; // Provided by user

  const requestBody = {
    comment: commentText,
    task: taskId,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail =
          errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorDetail = await response.text();
      }
      const errorMessage = `Failed to add comment to task ${taskId}: ${errorDetail}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const newComment: Comment = await response.json();
    console.log(
      `Comment added successfully for task ${taskId}. Response:`,
      newComment,
    );
    return newComment;
  } catch (error: any) {
    const errorMessage = `Network or unexpected error adding comment to task ${taskId}: ${error.message || "Unknown error"}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Function to fetch comments for a specific task
export async function getTaskComments(taskId: string): Promise<Comment[]> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error(
      "API Base URL is not defined. Please check environment variables.",
    );
  }

  // Assuming the API supports filtering by task ID using a query parameter
  const url = `${apiBaseUrl}/api/projects/task-comments/?task=${taskId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail =
          errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorDetail = await response.text();
      }
      const errorMessage = `Failed to fetch comments for task ${taskId}: ${errorDetail}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const rawResponse = await response.json(); // Capture raw response
    // Assuming the API returns a paginated response with a 'results' array
    if (rawResponse && Array.isArray(rawResponse.results)) {
      const comments: Comment[] = rawResponse.results;
      console.log(
        `Comments fetched successfully for task ${taskId}. Response:`,
        comments,
      );
      return comments;
    } else if (Array.isArray(rawResponse)) {
      // Fallback if the API directly returns an array without pagination
      const comments: Comment[] = rawResponse;
      console.log(
        `Comments fetched successfully for task ${taskId}. Response:`,
        comments,
      );
      return comments;
    } else {
      console.warn(
        `getTaskComments: Unexpected API response structure for task ${taskId}:`,
        rawResponse,
      );
      return []; // Return empty array for unexpected structure
    }
  } catch (error: any) {
    const errorMessage = `Network or unexpected error fetching comments for task ${taskId}: ${error.message || "Unknown error"}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Function to update a specific comment for a task
export async function updateTaskComment(
  commentId: string,
  taskId: string,
  commentText: string,
): Promise<Comment> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error(
      "API Base URL is not defined. Please check environment variables.",
    );
  }

  // User provided endpoint: http://18.138.124.3/api/projects/task-comments/{id}
  const url = `${apiBaseUrl}/api/projects/task-comments/${commentId}/`;

  const requestBody = {
    comment: commentText,
    task: taskId, // User indicated 'task' is a required field for PUT
  };

  try {
    const response = await fetch(url, {
      method: "PUT", // User specified PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Read response body once
    let responseBody = await response.text();
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(responseBody);
    } catch (e) {
      parsedBody = responseBody; // Not JSON, keep as text
    }

    if (!response.ok) {
      const errorDetail =
        parsedBody?.detail || parsedBody?.message || responseBody;
      const errorMessage = `Failed to update comment ${commentId} for task ${taskId}: ${errorDetail}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const updatedComment: Comment = parsedBody; // Use the already parsed body for success
    console.log(
      `Comment ${commentId} updated successfully. Response:`,
      updatedComment,
    );
    return updatedComment;
  } catch (error: any) {
    const errorMessage = `Network or unexpected error updating comment ${commentId} for task ${taskId}: ${error.message || "Unknown error"}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Function to delete a specific comment for a task
export async function deleteTaskComment(commentId: string): Promise<void> {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error(
      "API Base URL is not defined. Please check environment variables.",
    );
  }

  const url = `${apiBaseUrl}/api/projects/task-comments/${commentId}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    // DELETE usually returns 204 (No Content)
    if (!response.ok) {
      let errorMessage = `Failed to delete comment ${commentId}`;

      try {
        const errorData = await response.json();
        errorMessage =
          errorData?.detail || errorData?.message || JSON.stringify(errorData);
      } catch {
        errorMessage = await response.text();
      }

      throw new Error(errorMessage);
    }

    console.log(`Comment ${commentId} deleted successfully.`);
  } catch (error: any) {
    throw new Error(
      `Network or unexpected error deleting comment ${commentId}: ${
        error.message || "Unknown error"
      }`,
    );
  }
}

// New function to fetch project backlog tasks
export async function fetchProjectBacklogTasks(
  projectId: string,
): Promise<Task[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/projects/${projectId}/backlog/`;

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
    // The API response is directly an array of tasks, not nested under 'results' or 'count'
    return data;
  } catch (error: any) {
    console.error(
      `Failed to fetch project backlog tasks for project ${projectId}:`,
      error,
    );
    throw new Error(
      `Failed to fetch project backlog tasks: ${error.message || "Unknown error"}`,
    );
  }
}

// New function to fetch sprint history
export async function fetchSprintHistory(
  sprintId: string,
): Promise<SprintHistoryEntry[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/sprints/${sprintId}/history`;
    console.log("Fetching sprint history from:", url); // Temporary debug log

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
    return data; // Assuming the API returns an array directly
  } catch (error: any) {
    console.error(
      `Failed to fetch sprint history for sprint ${sprintId}:`,
      error,
    );
    throw new Error(
      `Failed to fetch sprint history: ${error.message || "Unknown error"}`,
    );
  }
}




export async function fetchSprintBurndownData(
  sprintId: string,
): Promise<{ dates: string[]; remaining_tasks: number[] }> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/sprints/${sprintId}/burndown/`;
    console.log(`Fetching burndown data for sprint ${sprintId}:`, url);

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
    console.error(
      `Failed to fetch burndown data for sprint ${sprintId}:`,
      error,
    );
    throw new Error(
      `Failed to fetch burndown data: ${error.message || "Unknown error"}`,
    );
  }
}

// Interfaces for Sprint Capacity and Velocity
interface SprintMemberCapacity {
  user: string;
  role: string;
  capacity_hours: number;
}

interface SprintCapacity {
  total_hours: number;
  members: SprintMemberCapacity[];
}

interface SprintVelocity {
  completed_tasks: number;
  total_tasks: number;
  completion_rate: number;
}

export interface SprintCapacityVelocityResponse {
  sprint_id: string;
  capacity: SprintCapacity;
  velocity: SprintVelocity;
  status: string; // e.g., "at_risk"
}

export async function fetchSprintCapacityVelocity(
  sprintId: string,
): Promise<SprintCapacityVelocityResponse> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/sprints/${sprintId}/capacity-velocity/`;
    console.log(`Fetching capacity and velocity data for sprint ${sprintId}:`, url);

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
    console.error(
      `Failed to fetch capacity and velocity data for sprint ${sprintId}:`,
      error,
    );
    throw new Error(
      `Failed to fetch capacity and velocity data: ${error.message || "Unknown error"}`,
    );
  }
}

// Interface for active dashboard tasks
export interface DashboardTask {
  description: any;
  id: string;
  title: string;
  status: string; // e.g., "review", "in_progress", "todo", "done"
  priority: string; // e.g., "low", "medium", "high"
  project_name: string;
  deadline?: string; // Optional, as not present in all mock/api data
  assigneeId?: string; // Optional, as not present in all mock/api data
  projectId?: string; // Optional, as not present in all mock/api data
}

export async function fetchActiveDashboardTasks(): Promise<DashboardTask[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/dashboard/active-tasks/`;
    console.log(`Fetching active dashboard tasks from:`, url);

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
    console.error(`Failed to fetch active dashboard tasks:`, error);
    throw new Error(
      `Failed to fetch active dashboard tasks: ${error.message || "Unknown error"}`,
    );
  }
}




// NEW FUNCTION FETCHING FOR STATUS OVERVIEW 

// Task Status Overview types
export interface TaskStatusOverview {
  total_tasks: number;
  todo: {
    count: number;
    percentage: number;
  };
  in_progress: {
    count: number;
    percentage: number;
  };
  done: {
    count: number;
    percentage: number;
  };
}

export async function fetchTaskStatusOverview(): Promise<TaskStatusOverview> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/dashboard/task-status-overview/`;

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
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return await response.json();
}

// fetch upcoming deadlines interface and fuction

// Upcoming Deadlines Interface
export interface UpcomingDeadline {
  id: string;
  title: string;
  due_date: string;
  days_left: number;
  project_name: string;
}

export async function fetchUpcomingDeadlines(): Promise<UpcomingDeadline[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/dashboard/upcoming-deadlines/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch upcoming deadlines");
  }

  const data = await response.json();

  // ⭐ Map response → clean frontend object
  return data.map((task: any) => ({
    id: task.id,
    title: task.title,
    due_date: task.due_date,
    days_left: task.days_left,
    project_name: task.project_name,
  }));
}


// fetch teamworkload 

export interface TeamWorkload {
  user_id: number;
  name: string;
  role: string;
  task_count: number;
  workload_percent: number;
}

export async function fetchTeamWorkload(): Promise<TeamWorkload[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/dashboard/team-workload/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch team workload");
  }

  const data: TeamWorkload[] = await response.json();

  // ⭐ VERY IMPORTANT — REMOVE DUPLICATES (API me duplicates aa rahe hain)
  const uniqueUsers: TeamWorkload[] = Array.from(
    new Map<number, TeamWorkload>(data.map((item) => [item.user_id, item])).values()
  );

  return uniqueUsers;
}
