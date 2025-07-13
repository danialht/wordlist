// Define the Word type
interface Word {
    text: string;
    meaning: string;
}

// Fetch the word list from chrome.storage.local and display it
chrome.storage.local.get({ wordList: [] }, (result) => {
    const wordList: Word[] = result.wordList;
    const wordListElement = document.getElementById('word-list') as HTMLUListElement;

    if (wordList.length === 0) {
        wordListElement.innerHTML = '<li>No words added yet.</li>';
    } else {
        wordList.forEach((word: Word) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${word.text}: ${word.meaning}`; // Display the word and its meaning

            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = '✖';
            deleteIcon.className = 'delete-icon';
            listItem.appendChild(deleteIcon);

            // Add event listener to delete icon
            deleteIcon.addEventListener('click', () => {
                // Get the word list again because it might have changed
                chrome.storage.local.get({ wordList: [] }, (result) => {
                    const updatedWordList = (result.wordList as Word[]).filter(item => item.text !== word.text);
                    chrome.storage.local.set({ wordList: updatedWordList }, () => {
                        listItem.remove();
                    });
                    console.log(`Word list updated after deleting '${word.text}':`, updatedWordList);
                });
            });

            wordListElement.appendChild(listItem);
        });
    }
});