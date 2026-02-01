/**
 * Mock documentation database
 * In production, this would query a real knowledge base or documentation system
 */
const MOCK_DOCS = [
  {
    topic: "password reset",
    keywords: ["password", "reset", "forgot", "change password", "login"],
    content: `To reset your password:
1. Go to the login page
2. Click "Forgot Password" below the login form
3. Enter your email address
4. Check your email for a reset link (valid for 24 hours)
5. Click the link and create a new password

If you don't receive the email within 5 minutes, check your spam folder or contact support.`,
  },
  {
    topic: "billing",
    keywords: ["billing", "payment", "invoice", "subscription", "upgrade", "downgrade"],
    content: `Billing & Subscription Management:
- View invoices: Go to Settings > Billing > Invoice History
- Update payment method: Settings > Billing > Payment Methods
- Upgrade/downgrade plan: Settings > Billing > Change Plan
- Cancel subscription: Settings > Billing > Cancel (takes effect at end of billing period)

Note: Enterprise customers should contact their account manager for billing changes.`,
  },
  {
    topic: "user management",
    keywords: ["add user", "invite", "remove user", "permissions", "roles", "team"],
    content: `User & Team Management:
- Invite users: Settings > Team > Invite Member
- Manage roles: Settings > Team > [User] > Change Role
- Remove users: Settings > Team > [User] > Remove (only admins/owners)
- Available roles: Owner (full access), Admin (manage users/settings), User (basic access)`,
  },
  {
    topic: "api access",
    keywords: ["api", "token", "key", "integration", "webhook"],
    content: `API & Integration:
- Generate API key: Settings > Developers > Create API Key
- View API documentation: https://docs.yourapp.com/api
- Webhook setup: Settings > Integrations > Webhooks
- Rate limits: Free (100/hr), Pro (1000/hr), Enterprise (custom)`,
  },
  {
    topic: "data export",
    keywords: ["export", "download", "backup", "data"],
    content: `Data Export:
- Export your data: Settings > Data & Privacy > Export Data
- Format: JSON or CSV
- Processing time: 1-24 hours depending on data size
- Download link expires after 7 days
- Enterprise: Contact support for bulk exports`,
  },
];

/**
 * Searches documentation based on query
 * Uses simple keyword matching - in production would use vector search or semantic search
 */
export async function searchDocs(query: string): Promise<string> {
  console.log(`Searching docs for: "${query}"`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const queryLower = query.toLowerCase();
  
  // Find matching documents
  const matches = MOCK_DOCS.filter(doc => 
    doc.keywords.some(keyword => queryLower.includes(keyword)) ||
    doc.topic.toLowerCase().includes(queryLower)
  );
  
  if (matches.length === 0) {
    return "No documentation found for your query. This might require creating a support ticket for further assistance.";
  }
  
  // Return the most relevant match (in production, would rank by relevance)
  const bestMatch = matches[0];
  console.log(`Found documentation: ${bestMatch?.topic}`);
  
  return `Documentation: ${bestMatch?.topic}\n\n${bestMatch?.content}`;
}
