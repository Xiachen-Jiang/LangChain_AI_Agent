import type { UserContext } from "../types/user.js";

/**
 * Mock user database
 * In production, this would query a real user database
 */
const MOCK_USERS: Record<string, UserContext> = {
  "user-1": {
    userId: "user-1",
    plan: "enterprise",
    role: "admin",
    recentActivity: ["billing_error", "login_issue", "api_call"],
  },
  "user-pro": {
    userId: "user-pro",
    plan: "pro",
    role: "user",
    recentActivity: ["page_view", "feature_usage"],
  },
  "user-free": {
    userId: "user-free",
    plan: "free",
    role: "user",
    recentActivity: ["signup", "tutorial_completed"],
  },
  "user-enterprise": {
    userId: "user-enterprise",
    plan: "enterprise",
    role: "owner",
    recentActivity: ["dashboard_view", "report_generated", "user_invited"],
  },
  "user-blocked": {
    userId: "user-enterprise-blocked",
    plan: "enterprise",
    role: "admin",
    recentActivity: ["billing_error", "payment_failed", "access_blocked"],
  },
};

/**
 * Retrieves user context information
 * Used to determine priority and personalize responses
 */
export async function getUserContext(userId: string): Promise<UserContext> {
  console.log(`Fetching context for user: ${userId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return mock user or default
  const user = MOCK_USERS[userId] || {
    userId,
    plan: "free" as const,
    role: "user" as const,
    recentActivity: ["unknown"],
  };
  
  console.log(`User context: ${user.plan} plan, ${user.role} role`);
  
  return user;
}
