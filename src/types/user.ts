export interface UserContext {
  userId: string;
  plan: "free" | "pro" | "enterprise";
  role: "user" | "admin" | "owner";
  recentActivity: string[];
}

export interface Ticket {
  ticketId: string;
  title: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export interface AgentResponse {
  success: boolean;
  response: string;
  toolCalls?: any[];
  messages?: any[];
  error?: string;
}

export type Priority = "low" | "medium" | "high";
