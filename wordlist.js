// Fetch the word list from chrome.storage.local and display it
chrome.storage.local.get({ wordList: [] }, function (result) {
    var wordList = result.wordList;
    var wordListElement = document.getElementById('word-list');
    if (wordList.length === 0) {
        wordListElement.innerHTML = '<li>No words added yet.</li>';
    }
    else {
        wordList.forEach(function (word) {
            var listItem = document.createElement('li');
            listItem.textContent = "".concat(word.text, ": ").concat(word.meaning); // Display the word and its meaning
            var deleteIcon = document.createElement('span');
            deleteIcon.textContent = '✖';
            deleteIcon.className = 'delete-icon';
            listItem.appendChild(deleteIcon);
            // Add event listener to delete icon
            deleteIcon.addEventListener('click', function () {
                // Get the word list again because it might have changed
                chrome.storage.local.get({ wordList: [] }, function (result) {
                    var updatedWordList = result.wordList.filter(function (item) { return item.text !== word.text; });
                    chrome.storage.local.set({ wordList: updatedWordList }, function () {
                        listItem.remove();
                    });
                    console.log("Word list updated after deleting '".concat(word.text, "':"), updatedWordList);
                });
            });
            wordListElement.appendChild(listItem);
        });
    }
});
