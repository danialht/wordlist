class Word {
    text: string;
    meaning: string;

    constructor(text: string, meaning: string) {
        this.text = text; // The word itself
        this.meaning = meaning; // The meaning of the word
    }

    // Method to display the word and its meaning
    display(): string {
        return `${this.text}: ${this.meaning}`;
    }
}

// Create the context menu on extension installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addToWordList",
        title: "Add to word list",
        contexts: ["selection"]
    });
});

const injectedTabs = new Set<number>(); // Track tabs where the script is injected

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // If info and tab are valid, proceed
    if (!info || !tab || !info.selectionText) {
        console.warn('Context menu click without valid info or tab:', info, tab);
        return;
    }
    if (info.menuItemId === "addToWordList" && info.selectionText) {
        const spaceCount = (info.selectionText.match(/ /g) || []).length;

        if (info.selectionText.length > 35 || spaceCount > 3) {
            if (!injectedTabs.has(tab.id!)) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id! },
                    files: ["content.js"]
                }, () => {
                    injectedTabs.add(tab.id!); // Mark the tab as injected
                    chrome.tabs.sendMessage(tab.id!, {
                        type: "confirmAddToWordList",
                        text: info.selectionText
                    }, (response) => {
                        if (response && response.confirmed) {
                            if (typeof info.selectionText === 'string') {
                                saveToWordList(info.selectionText);
                            } else {
                                console.error('Selection text is not a string:', info.selectionText);
                            }
                        }
                    });
                });
            } else {
                chrome.tabs.sendMessage(tab.id!, {
                    type: "confirmAddToWordList",
                    text: info.selectionText
                }, (response) => {
                    if (response && response.confirmed) {
                        if (typeof info.selectionText === 'string') {
                            saveToWordList(info.selectionText);
                        } else {
                            console.error('Selection text is not a string:', info.selectionText);
                        }
                    }
                });
            }
            return; // Exit to wait for user confirmation
        }

        saveToWordList(info.selectionText);
    }
});

// Save a word to the word list
function saveToWordList(text: string): void {
    chrome.storage.local.get({ wordList: [] }, (result) => {
        const wordList: Word[] = result.wordList;
        const newWord = new Word(text, "No meaning available yet!"); // Create a new Word object
        wordList.push(newWord); // TODO: Get the meaning of the word from some API
        console.log('Saving word to list:', newWord);

        // Save the updated word list back to storage
        chrome.storage.local.set({ wordList }, () => {
            console.log('Word list updated:', wordList);
        });
    });
}

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in background script:', message);

    if (message.type === 'accountIconClick') {
        console.log('Handling accountIconClick message');
        sendResponse({ success: true });
    } else if (message.type === "closeQuizTab") {
        console.log('Closing quiz tab');
        chrome.tabs.query({ url: chrome.runtime.getURL("quiz.html") }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.remove(tab.id!, () => {
                    console.log('Quiz tab closed successfully.');
                });
            });
        });
        sendResponse({ success: true });
    } else {
        console.warn('Unknown message type:', message.type);
        sendResponse({ success: false });
    }

    return true; // Keep the message channel open for async responses
});