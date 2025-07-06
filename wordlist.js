// Fetch the word list from chrome.storage.local and display it
chrome.storage.local.get({ wordList: [] }, (result) => {
    let wordList = result.wordList;
    const wordListElement = document.getElementById('word-list');

    if (wordList.length === 0) {
        wordListElement.innerHTML = '<li>No words added yet.</li>';
    } else {
        wordList.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;

            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = '✖';
            deleteIcon.className = 'delete-icon';
            listItem.appendChild(deleteIcon);

            // Add event listener to delete icon
            deleteIcon.addEventListener('click', () => {
                // get the wordlist again because it might have changed
                // when the user has deleted a word
                chrome.storage.local.get({ wordList: [] }, (result) => {
                    wordList = result.wordList;
                    const updatedWordList = wordList.filter(item => item !== word);
                    chrome.storage.local.set({ wordList: updatedWordList }, () => {
                        listItem.remove();
                    });
                    // Notify other tabs to update their word list using the console log
                    console.log(`Word list updated after deleting '${word}':`, updatedWordList);
                });
                
            });

            wordListElement.appendChild(listItem);
        });
    }
});
