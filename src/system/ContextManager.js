// contextManager.js

class ContextManager {
  constructor() {
    this.messages = []; // Stores all messages
    this.summaries = {
      recent: [], // Summaries of the last 5 messages
      rolling: "", // Rolling summary of messages 6-10
      longTerm: "", // Long-term summary of messages older than 10
    };
  }

  // Method to add a new message and its summary
  addMessage(message) {
    // Summarize the message
    const summary = this.summarizeMessage(message);

    // Add to messages array
    this.messages.push({ message, summary });

    // Update summaries
    this.updateSummaries();
  }

  // Simple summarization method (placeholder)
  summarizeMessage(message) {
    // For simplicity, let's assume the summary is the first sentence.
    return message.split(". ")[0] + ".";
  }

  // Method to update the rolling and long-term summaries
  updateSummaries() {
    const totalMessages = this.messages.length;

    // Update recent summaries (last 5 messages)
    const recentMessages = this.messages.slice(-5);
    this.summaries.recent = recentMessages.map((msg) => msg.summary);

    // Update rolling summary (messages 6-10)
    if (totalMessages > 5) {
      const rollingMessages = this.messages.slice(-10, -5);
      this.summaries.rolling = this.generateRollingSummary(rollingMessages);
    }

    // Update long-term summary (messages older than 10)
    if (totalMessages > 10) {
      const longTermMessages = this.messages.slice(0, -10);
      this.summaries.longTerm = this.generateLongTermSummary(longTermMessages);
    }
  }

  // Method to generate rolling summary
  generateRollingSummary(messages) {
    // Combine summaries into one string
    return messages.map((msg) => msg.summary).join(" ");
  }

  // Method to generate long-term summary
  generateLongTermSummary(messages) {
    // For simplicity, let's concatenate summaries
    return messages.map((msg) => msg.summary).join(" ");
  }

  // Method to get the current context for API calls
  getContext() {
    let context = "";

    // Include long-term summary if it exists
    if (this.summaries.longTerm) {
      context += `Long-term Summary:\n${this.summaries.longTerm}\n\n`;
    }

    // Include rolling summary if it exists
    if (this.summaries.rolling) {
      context += `Earlier Summary:\n${this.summaries.rolling}\n\n`;
    }

    // Include recent summaries
    context += "Recent Messages:\n";
    this.summaries.recent.forEach((summary, index) => {
      context += `${index + 1}. ${summary}\n`;
    });

    return context;
  }
}

module.exports = ContextManager;
