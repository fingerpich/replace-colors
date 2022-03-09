
let activeTab;
export function onExtensionLoaded(callback) {
  document.addEventListener('DOMContentLoaded', async function(event) {
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTab = tabs[0]
    callback()
  })
}
export function getActiveTabID() {
  activeTab.id
}

export function runFunctionInPage(func, args) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: func,
      args
    }, (injectionResults) => {
      for (const frameResult of injectionResults) {
        return resolve(frameResult.result)
      }
    })
  })
}