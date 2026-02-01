import "dotenv/config";
import { execute } from "./agent/agent.js";

// Simple CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Usage: npm start -- \"<your question>\" [userId]");
    console.log("\nExamples:");
    console.log('  npm start -- "How do I reset my password?" user-pro');
    console.log('  npm start -- "The app is crashing" user-1');
    process.exit(0);
  }
  
  const input = args[0];
  const userId = args[1] || "user-1";
  
  console.log("\nAI Support Agent");
  console.log("=".repeat(60));
  
  const result = await execute(input || "", userId || "");
  
  if (result.success) {
    console.log(`\n${result.response}\n`);
  } else {
    console.error(`\nError: ${result.error}\n`);
  }

  console.log("=".repeat(60));
}

main().catch(console.error);
