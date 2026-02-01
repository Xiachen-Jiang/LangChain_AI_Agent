import type { UserContext, Priority } from "../types/user.js";

/**
 * Determines ticket priority based on user context and issue keywords
 */
export function determinePriority(
  userContext: UserContext,
  issueDescription: string
): Priority {
  const description = issueDescription.toLowerCase();
  
  // High-priority keywords
  const urgentKeywords = [
    "urgent",
    "critical",
    "blocked",
    "can't access",
    "cannot access",
    "down",
    "broken",
    "billing",
    "payment",
    "security",
  ];
  
  // Check if issue contains urgent keywords
  const isUrgent = urgentKeywords.some(keyword => 
    description.includes(keyword)
  );
  
  // Check user plan
  const isEnterprise = userContext.plan === "enterprise";
  const isPaid = userContext.plan === "pro" || isEnterprise;
  
  // Check for critical recent activity
  const hasCriticalActivity = userContext.recentActivity.some(activity =>
    activity.includes("billing_error") || 
    activity.includes("payment_failed") ||
    activity.includes("security_alert")
  );
  
  // Priority logic
  if (isEnterprise && (isUrgent || hasCriticalActivity)) {
    return "high";
  }
  
  if (isPaid && isUrgent) {
    return "high";
  }
  
  if (isPaid || (userContext.plan === "free" && isUrgent)) {
    return "medium";
  }
  
  return "low";
}

/**
 * Generates a priority explanation for logging/debugging
 */
export function explainPriority(
  userContext: UserContext,
  issueDescription: string,
  priority: Priority
): string {
  return `Priority: ${priority.toUpperCase()} - User: ${userContext.plan} plan, Issue contains urgent keywords: ${issueDescription.toLowerCase().includes("urgent") || issueDescription.toLowerCase().includes("blocked")}`;
}
