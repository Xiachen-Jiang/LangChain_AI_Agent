import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { searchDocs } from "./searchDoc.js";
import { createTicket } from "./createTicket.js";
import { getUserContext } from "./getUserContext.js";

export const searchDocsTool = new DynamicStructuredTool({
  name: "searchDocs",
  description: `Search internal product documentation to answer user questions about how to use features, resolve issues, or understand functionality. Use this when users ask "how to" questions or need product guidance. Returns relevant documentation snippets.`,
  schema: z.object({
    query: z.string().describe("The search query - be specific about what you're looking for")
  }),
  func: async ({ query }) => {
    const result = await searchDocs(query);
    return JSON.stringify(result);
  }
});

export const createTicketTool = new DynamicStructuredTool({
  name: "createTicket",
  description: `Create a support ticket for issues that cannot be resolved through documentation, such as bugs, errors, feature requests, or when users explicitly request ticket creation. Returns ticket ID and confirmation.`,
  schema: z.object({
    title: z.string().describe("Clear, concise title describing the issue"),
    priority: z.enum(["low", "medium", "high"]).describe("Ticket priority: low (minor issues, free users), medium (paid users, moderate issues), high (enterprise/critical/blocking issues)")
  }),
  func: async ({ title, priority }) => {
    const result = await createTicket(title, priority);
    return JSON.stringify(result);
  }
});

export const getUserContextTool = new DynamicStructuredTool({
  name: "getUserContext",
  description: `Retrieve user account information including subscription plan (free/pro/enterprise), role (user/admin/owner), and recent activity. Use this to assess priority when creating tickets or to personalize responses. Call this BEFORE creating tickets if priority assessment is needed.`,
  schema: z.object({
    userId: z.string().describe("The unique identifier for the user")
  }),
  func: async ({ userId }) => {
    const result = await getUserContext(userId);
    return JSON.stringify(result);
  }
});
