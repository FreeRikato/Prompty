import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [selectedText, setSelectedText] = useState('')

  useEffect(() => {
    const getSelectedTextFromTab = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (tab && tab.id) {
        try {
          const response = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const selection = window.getSelection();
              return selection ? selection.toString() : '';
            },
          })
          setSelectedText(response[0].result as string)
        } catch (error) {
          console.error("Could not inject script:", error)
          setSelectedText("Error fetching selected text.")
        }
      }
    }

    getSelectedTextFromTab()
  }, [])

  const handleSurpriseClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const popupContainer = document.createElement('div');
          popupContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          `;

          const popupContent = document.createElement('div');
          popupContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          `;

          const message = document.createElement('p');
          message.style.cssText = `
            color: #333;
            margin-bottom: 15px;
          `;
          message.textContent = 'Hello World';

          const closeButton = document.createElement('button');
          closeButton.style.cssText = `
            padding: 8px 16px;
            background: #4F46E5;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          `;
          closeButton.textContent = 'Close';
          closeButton.onclick = () => {
            document.body.removeChild(popupContainer);
          };

          popupContent.appendChild(message);
          popupContent.appendChild(closeButton);
          popupContainer.appendChild(popupContent);
          document.body.appendChild(popupContainer);
        },
      });
    }
  }

  return (
    <div className="bg-gray-800 text-white p-6 shadow-xl min-w-[300px] transition-all duration-300">
      <div className="mb-4">
        <p className="text-sm">
          Selected Text: <b className="text-blue-300">{selectedText}</b>
        </p>
      </div>
      <button 
        onClick={handleSurpriseClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Surprise
      </button>
    </div>
  )
}

export default App
