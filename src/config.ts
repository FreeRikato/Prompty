chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender)
  if (request.message === "getSelectedText") {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : "";
    sendResponse({ selectedText: selectedText });
  }
  return true;
});