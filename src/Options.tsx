import React, { useState, useEffect } from "react";

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    // Load the API key from storage when the page loads
    chrome.storage.sync.get("apiKey").then((result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSave = () => {
    // Save the API key to storage
    chrome.storage.sync.set({ apiKey: apiKey }).then(() => {
      alert("API key saved successfully!");
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prompty Options</h1>
      <div className="mb-4">
        <label htmlFor="apiKey" className="block mb-2">
          API Key:
        </label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={handleInputChange}
          className="border border-gray-400 px-3 py-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Options; 