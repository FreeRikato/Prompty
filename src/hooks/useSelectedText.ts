import { useState, useEffect } from "react";

export const useSelectedText = () => {
  const [selectedText, setSelectedText] = useState("");
  const [surroundingText, setSurroundingText] = useState("");

  useEffect(() => {
    const getSelectedTextFromTab = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.id) {
        try {
          const response = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const selection = window.getSelection();
              let selectedText = selection ? selection.toString() : "";

              let surroundingText = "";
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const textContent =
                  range.commonAncestorContainer.textContent || "";

                // Find word boundaries for selected text
                let start = range.startOffset;
                let end = range.endOffset;
                while (start > 0 && textContent[start - 1] !== " ") {
                  start--;
                }
                while (end < textContent.length && textContent[end] !== " ") {
                  end++;
                }
                selectedText = textContent.substring(start, end);

                // Find word boundaries for surrounding text
                let surroundingStart = start;
                let surroundingEnd = end;
                let wordsBefore = 0;
                const maxWordsBefore = 50;
                while (surroundingStart > 0 && wordsBefore < maxWordsBefore) {
                  surroundingStart--;
                  if (textContent[surroundingStart] === " ") {
                    wordsBefore++;
                  }
                }
                let wordsAfter = 0;
                const maxWordsAfter = 50;
                while (surroundingEnd < textContent.length && wordsAfter < maxWordsAfter) {
                  surroundingEnd++;
                  if (textContent[surroundingEnd] === " ") {
                    wordsAfter++;
                  }
                }

                // Adjust to start of the word
                while (surroundingStart > 0 && textContent[surroundingStart - 1] !== " ") {
                  surroundingStart--;
                }

                // Adjust to end of the word
                while (surroundingEnd < textContent.length && textContent[surroundingEnd] !== " ") {
                  surroundingEnd++;
                }

                surroundingText = textContent.substring(surroundingStart, surroundingEnd);
              }

              return { selectedText, surroundingText };
            },
          });
          if (response[0]?.result) {
            setSelectedText(response[0].result.selectedText);
            setSurroundingText(response[0].result.surroundingText);
          }
        } catch (error) {
          console.error("Could not inject script:", error);
          setSelectedText("Error fetching selected text.");
        }
      }
    };

    getSelectedTextFromTab();
  }, []);

  return { selectedText, surroundingText };
};
