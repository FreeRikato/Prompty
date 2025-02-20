import "./App.css";
import PopupButton from "./components/PopupButton";
import { handleClickPopup } from "./utils/handleClickPopup";
import { useSelectedText } from "./hooks/useSelectedText";
import { defaultPrompt, definitionPrompt } from "./utils/prompts";
import { getllm } from "./utils/llmDefinition";
import {useState, useEffect} from "react";

function App() {
  const { selectedText, surroundingText } = useSelectedText();
  const [definition, setDefinition] = useState<string | null>(null);


  useEffect(() => {
    const fetchDefinition = async () => {
      if (selectedText && selectedText.split(" ").length < 5) {
        const result = await directDefinition(selectedText, surroundingText);
        setDefinition(result);
      } else {
        setDefinition(null);
      }
    };
    fetchDefinition();
  }, [selectedText, surroundingText]);

  interface AiFunctionProps {
    task?: string;
    selectedText?: string;
  }

  const directDefinition = async (selectedText: string, surroundingText: string): Promise<string> => {
    const llm = await getllm();
    if (!llm) return "API key not set.";

    if (selectedText.split(" ").length < 3) {
      const chain = definitionPrompt.pipe(llm);
      const result = await chain.invoke({
        selected_text: selectedText,
        surrounding_text: surroundingText,
      });
      const definition = JSON.stringify(result.content);
      return definition;
    } else {
      return selectedText;
    }
  };

  const aiFunction = async ({ task, selectedText }: AiFunctionProps) => {
    const llm = await getllm();
    if (!llm) return "API key not set.";

    const chain = defaultPrompt.pipe(llm);
    const result = await chain.invoke({
      task: task,
      selected_text: selectedText,
    });
    if (selectedText) {
      console.log(JSON.stringify(result.content));
      handleClickPopup(surroundingText);
    } else {
      handleClickPopup("No text selected");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-6 shadow-2xl min-w-[300px] transition-all duration-300 flex flex-col gap-4">
      <div className="mb-2">
        {selectedText && selectedText.split(" ").length < 5 ? ( 
          <p className="text-sm">
            Definition: <b className="text-blue-400">{definition}</b>
          </p>
        ) : (
          <p className="text-sm">
            Selected Text: <b className="text-blue-400">{selectedText}</b>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <PopupButton
          text="Surrounding Text"
          onClick={() =>
            aiFunction({ task: "Surrounding Text", selectedText })
          }
        />
      </div>
    </div>
  );
}

export default App;
