chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addToWordList",
        title: "Add to word list",
        contexts: ["selection"]
    });
});

const injectedTabs = new Set(); // Track tabs where the script is injected

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToWordList" && info.selectionText) {
        console.log(`Adding to word list: ${info.selectionText}`);

        // Check if the selection is too long or has too many spaces
        const spaceCount = (info.selectionText.match(/ /g) || []).length;
        if (info.selectionText.length > 35 || spaceCount > 3) {
            if (!injectedTabs.has(tab.id)) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                }, () => {
                    injectedTabs.add(tab.id); // Mark the tab as injected
                    chrome.tabs.sendMessage(tab.id, {
                        type: "confirmAddToWordList",
                        text: info.selectionText
                    }, (response) => {
                        if (response && response.confirmed) {
                            saveToWordList(info.selectionText);
                        }
                    });
                });
            } else {
                chrome.tabs.sendMessage(tab.id, {
                    type: "confirmAddToWordList",
                    text: info.selectionText
                }, (response) => {
                    if (response && response.confirmed) {
                        saveToWordList(info.selectionText);
                    }
                });
            }
            return; // Exit to wait for user confirmation
        }

        saveToWordList(info.selectionText);
    }
});

function saveToWordList(text) {
    // Retrieve the existing word list from storage
    chrome.storage.local.get({ wordList: [] }, (result) => {
        const wordList = result.wordList;
        wordList.push(text); // Add the new word to the list

        // Save the updated word list back to storage
        chrome.storage.local.set({ wordList }, () => {
            console.log('Word list updated:', wordList);
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in background script:', message);
    if (message.type === 'accountIconClick') {
        console.log('Handling accountIconClick message');
        
    } else {
        console.warn('Unknown message type:', message.type);
    }
});


// receive the message to close the quiz tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "closeQuizTab") {
        console.log('Closing quiz tab');
        chrome.tabs.query({ url: chrome.runtime.getURL("quiz.html") }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.remove(tab.id, () => {
                    console.log('Quiz tab closed successfully.');
                });
            });
        });
        sendResponse({ success: true });
    }
});