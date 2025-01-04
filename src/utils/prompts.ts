import { ChatPromptTemplate } from "@langchain/core/prompts";

export const defaultPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that specialized in {task}, Perform it in the provided text",
  ],
  ["human", "{selected_text}"],
]);

export const definitionPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that specialized in definitions, Define the provided word or phrase in the provided text within 10 words",
  ],
  ["human", "Definition of {selected_text} in the context of {surrounding_text}"],
]);
