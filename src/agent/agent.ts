import { searchDocsTool, getUserContextTool, createTicketTool } from "../tools/index.js";
import { createAgent } from "langchain";
import { llm } from "../config/llmApi.js";
import { SYSTEM_PROMPT } from "./prompt.js";

// Create the agent with tools using the new LangChain v1 API
const agent = await createAgent({
  model: llm,
  tools: [searchDocsTool, getUserContextTool, createTicketTool],
  systemPrompt: SYSTEM_PROMPT,
});

export const execute = async (input: string, userId?: string) => {
  try {
    console.log(`\nProcessing request: "${input}"`);
    console.log(`User ID: ${userId || "unknown"}\n`);

    // Invoke the agent with the user's message
    const result = await agent.invoke({
      messages: [{ role: "user", content: input }],
    });

    // Extract the response - result is the final state with messages
    const messages = result.messages || [];
    const lastMessage = messages[messages.length - 1];
    
    // Get the content from the last message
    let responseContent = "No response generated";
    if (lastMessage && 'content' in lastMessage) {
      responseContent = typeof lastMessage.content === 'string'
        ? lastMessage.content
        : JSON.stringify(lastMessage.content);
    }

    return {
      success: true,
      response: responseContent,
      messages: messages,
    };
  } catch (error: any) {
    console.error("Agent execution failed:", error.message);
    return {
      success: false,
      error: error.message,
      response: "I apologize, but I encountered an error processing your request. Please try again or contact support.",
    };
  }
};