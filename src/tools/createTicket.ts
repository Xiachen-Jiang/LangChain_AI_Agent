import type { Ticket, Priority } from "../types/user.js";

/**
 * Mock ticket storage
 * In production, this would integrate with a ticketing system (Zendesk, Jira, etc.)
 */
const tickets: Ticket[] = [];

/**
 * Creates a support ticket
 * Returns ticket ID and confirmation
 */
export async function createTicket(
  title: string,
  priority: Priority
): Promise<Ticket> {
  console.log(`Creating ticket: "${title}" with priority: ${priority}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Validate inputs
  if (!title || title.trim().length === 0) {
    throw new Error("Ticket title cannot be empty");
  }
  
  if (!["low", "medium", "high"].includes(priority)) {
    throw new Error("Invalid priority level");
  }
  
  const ticket: Ticket = {
    ticketId: `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: title.trim(),
    priority,
    createdAt: new Date(),
  };
  
  // Store ticket (in memory for this mock)
  tickets.push(ticket);
  
  console.log(`Ticket created: ${ticket.ticketId}`);
  
  return ticket;
}

/**
 * Retrieves all tickets (for testing/debugging)
 */
export function getAllTickets(): Ticket[] {
  return [...tickets];
}

/**
 * Clears all tickets (for testing)
 */
export function clearTickets(): void {
  tickets.length = 0;
}
