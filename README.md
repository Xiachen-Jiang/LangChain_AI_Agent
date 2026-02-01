# AI Support Agent - Take-Home Challenge

An intelligent AI agent that assists internal support teams by understanding user intent, calling appropriate tools, and providing clear, actionable responses.

## 🎯 Overview

This project implements a production-oriented AI support agent for a SaaS product using Node.js, TypeScript, and LangChain. The agent can:

- ✅ Answer product questions from documentation
- ✅ Create support tickets for unresolved issues  
- ✅ Use user context to determine ticket priority
- ✅ Make intelligent decisions about when to use tools
- ✅ Handle errors gracefully

## 🏗️ Architecture

### Core Components

```
src/
├── agent/
│   ├── agent.ts          # Main agent implementation with ReAct pattern
│   └── prompt.ts         # System prompt with detailed instructions
├── tools/
│   ├── index.ts          # Tool definitions with LangChain integration
│   ├── searchDoc.ts      # Mock documentation search
│   ├── createTicket.ts   # Mock ticket creation
│   └── getUserContext.ts # Mock user context retrieval
├── services/
│   └── priorityService.ts # Priority determination logic
├── types/
│   └── user.ts           # TypeScript type definitions
├── config/
│   └── llmApi.ts         # LLM configuration (Google Gemini)
├── index.ts              # CLI interface
└── examples.ts           # Example scenario executions
```

### Design Decisions

#### 1. Agent Pattern: ReAct (Reasoning + Acting)

I chose LangChain's `createReactAgent` from `@langchain/langgraph/prebuilt` because:

- **Standard API**: The official way to build agents in LangChain v1
- **Simpler interface**: Cleaner API compared to the old `createReactAgent` from LangGraph
- **Built-in tool orchestration**: Handles tool calling, error recovery, and response generation automatically
- **Production-ready**: Well-tested and maintained by LangChain team
- **Extensible**: Supports middleware for advanced features (conversation summarization, human-in-the-loop, etc.)

**Trade-off**: Agent loop adds slight latency vs. direct function calling, but provides much better decision-making and flexibility.

#### 2. Tool Design: Focused and Well-Described

Each tool has:
- **Clear, specific descriptions** that help the LLM decide when to use them
- **Structured schemas** using Zod for type safety and validation
- **Realistic mock implementations** with delays and edge cases
- **Logging** for observability

**Trade-off**: More detailed descriptions increase token usage but significantly improve tool selection accuracy.

#### 3. Priority Logic: Rule-Based Service

Instead of letting the LLM decide priority entirely, I implemented a `priorityService` with clear rules:

```
HIGH: Enterprise users + (urgent keywords OR critical activity)
MEDIUM: Paid users with issues OR free users with urgent issues
LOW: Free users with non-urgent issues
```

**Why this matters**:
- **Consistency**: Same inputs always produce same priority
- **Explainability**: Can audit and explain priority decisions
- **Cost-effective**: Reduces LLM variability for business-critical decisions
- **Testable**: Easy to unit test priority logic

**Trade-off**: Less flexible than LLM-based priority, but more reliable and explainable.

#### 4. Error Handling: Defensive and User-Friendly

- Try-catch blocks around agent execution
- Validation in tool functions
- User-friendly error messages (not raw stack traces)
- Graceful degradation when tools fail

**Trade-off**: More code, but critical for production reliability.

#### 5. LLM Provider: Google Gemini

I configured Google Gemini (`gemini-2.5-flash`) because:
- **Free tier with generous limits**
- **Fast inference** (important for user-facing agents)
- **Strong reasoning capabilities**
- **Easy to swap** (abstracted in `llmApi.ts`)

**Trade-off**: Switching to OpenAI or Anthropic is a one-line config change.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (free at https://aistudio.google.com/app/apikey)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
# Add your GOOGLE_API_KEY to .env file
```

### Running the Agent

#### Option 1: Interactive CLI

```bash
# Run with a question
npm start -- "How do I reset my password?" user-pro

# Run with urgent issue
npm start -- "The app is crashing!" user-1
```

#### Option 2: Run All Examples

```bash
npm run examples
```

This runs 5 pre-configured scenarios demonstrating different agent behaviors.

## 📋 Example Scenarios

### Scenario 1: Documentation Question
**Input**: "How do I reset my password?"  
**Expected**: Agent searches docs, provides instructions, no ticket created  
**Tools Used**: `searchDocs`

### Scenario 2: Bug Report
**Input**: "The app keeps crashing after login"  
**Expected**: Agent gets user context, creates ticket with appropriate priority  
**Tools Used**: `getUserContext`, `createTicket`

### Scenario 3: Urgent Enterprise Issue
**Input**: "I'm blocked from billing and this is urgent"  
**Expected**: Agent recognizes enterprise user + urgency, creates HIGH priority ticket  
**Tools Used**: `getUserContext`, `createTicket`

### Scenario 4: Explicit Request
**Input**: "Create a support ticket for unable to export data"  
**Expected**: Agent creates ticket as requested  
**Tools Used**: `createTicket`

## 🧪 Tool Descriptions

### searchDocs(query: string)

Searches internal documentation for product guidance.

**When to use**: User asks "how to" questions or needs feature explanations  
**Mock implementation**: Returns relevant docs from a keyword-matched knowledge base  
**Production**: Would integrate with documentation system or vector database

### getUserContext(userId: string)

Retrieves user subscription plan, role, and recent activity.

**When to use**: Before creating tickets to assess priority, or to personalize responses  
**Mock implementation**: Returns data from mock user database  
**Production**: Would query user database or CRM

### createTicket(title: string, priority: "low" | "medium" | "high")

Creates a support ticket in the ticketing system.

**When to use**: 
- Bugs, errors, crashes that can't be resolved with docs
- User explicitly requests ticket
- Urgent or blocking issues

**Mock implementation**: Generates ticket ID and stores in memory  
**Production**: Would integrate with Zendesk, Jira, ServiceNow, etc.

## 🎓 Key Learnings & Trade-offs

### What Went Well

1. **Clear agent reasoning**: The ReAct pattern makes it easy to see why the agent made each decision
2. **Tool selection accuracy**: Well-crafted descriptions help the agent choose the right tools
3. **Priority consistency**: Rule-based priority logic is predictable and auditable
4. **Error handling**: Graceful failures prevent bad user experiences

### Trade-offs Made

| Decision | Pro | Con | Why I Chose It |
|----------|-----|-----|----------------|
| createAgent API | Standard, simple, extensible | Slower than direct calls | Official LangChain v1 standard |
| Rule-based priority | Consistent, explainable | Less flexible | Business-critical decisions need consistency |
| Detailed tool descriptions | Better accuracy | Higher token cost | Accuracy is more important than cost here |
| Mock integrations | Fast to implement | Not production-ready | Demonstrates design, real APIs easy to add |
| Google Gemini | Free, fast | May need migration later | Good for demo, easy to swap |

### What I Would Improve With More Time

1. **Add streaming responses** for real-time user feedback
2. **Implement conversation memory** to handle follow-up questions
3. **Add unit tests** for tools and priority service
4. **Create a simple web UI** instead of just CLI
5. **Add more sophisticated documentation search** (vector embeddings, semantic search)
6. **Implement retry logic** for failed tool calls
7. **Add metrics and monitoring** (tool usage, response times, error rates)
8. **Support multi-turn conversations** (currently stateless)

## 📊 Evaluation Criteria Coverage

✅ **Agent Loop**: Implemented using LangChain v1's standard `createAgent` API  
✅ **Tool Calling**: Intelligent tool selection based on intent  
✅ **Integration**: 3 mock tools with realistic implementations  
✅ **Error Handling**: Try-catch blocks, validation, user-friendly messages  
✅ **Trade-offs**: Documented in this README (see above)  
✅ **Communication**: Clear code, comments, and documentation  

## 🔧 Configuration

### Environment Variables

```bash
GOOGLE_API_KEY=your_api_key_here  # Required: Google Gemini API key
```

### Switching LLM Providers

To use OpenAI instead of Gemini, edit `src/config/llmApi.ts`:

```typescript
import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});
```

## 📝 Project Structure Rationale

- **`agent/`**: Core agent logic separated from tools for maintainability
- **`tools/`**: Each tool is independent, easy to test and swap implementations
- **`services/`**: Business logic (like priority) separated from agent/tools
- **`types/`**: Centralized type definitions for consistency
- **`config/`**: Configuration isolated for easy environment management

---

**Stack**: Node.js, TypeScript, LangChain, Google Gemini  
**Time**: ~6-8 hours
