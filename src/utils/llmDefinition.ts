import { ChatGroq } from "@langchain/groq";

export const getllm = async () => {
  const { apiKey } = await chrome.storage.sync.get("apiKey");

  if (!apiKey) {
    console.error("API key not set. Please set it in the extension options.");
    return null;
  }

  return new ChatGroq({
    model: "llama-3.3-70b-specdec",
    maxRetries: 2,
    apiKey: apiKey,
    maxTokens: 1000,
  });
};