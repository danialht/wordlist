function createCustomConfirmDialog(message, callback) {
    // Create the modal elements
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';

    const dialog = document.createElement('div');
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    dialog.style.textAlign = 'center';

    const text = document.createElement('p');
    text.textContent = message;
    text.style.color = 'black'; // Set text color to black
    dialog.appendChild(text);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '20px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-around';

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.padding = '10px 20px';
    yesButton.style.backgroundColor = '#4CAF50';
    yesButton.style.color = 'white';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '5px';
    yesButton.style.cursor = 'pointer';
    yesButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        callback(true);
    });

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.padding = '10px 20px';
    noButton.style.backgroundColor = '#f44336';
    noButton.style.color = 'white';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '5px';
    noButton.style.cursor = 'pointer';
    noButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        callback(false);
    });

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);
    dialog.appendChild(buttonContainer);
    modal.appendChild(dialog);
    document.body.appendChild(modal);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "confirmAddToWordList") {
        createCustomConfirmDialog(
            `The selected text is long or contains many spaces. Are you sure you want to add it?\n\nText: "${message.text}"`,
            (userConfirmed) => {
                console.log(1);
                sendResponse({ confirmed: userConfirmed });
            }
        );
        return true; // Keep the message channel open for async response
    }
});

// recieve message of type 'updateWordlistTab' to update the word list
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateWordlistTab") {
        // Update the word list in the tab
        updateWordList();
    }
});
