export const handleClickPopup = async (displayText: string) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [displayText],
      func: (displayText: string) => {
          // Close existing popup if it exists
          const existingPopup = document.getElementById('popup-container');
          if (existingPopup) {
            document.body.removeChild(existingPopup);
          }

          const popupContainer = document.createElement('div');
          // Add an ID to the popup container
          popupContainer.id = 'popup-container';
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
          message.textContent = displayText;

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