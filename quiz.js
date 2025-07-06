function displayRandomWord() {
    chrome.storage.local.get({ wordList: [] }, (result) => {
        let wordList = result.wordList;
        let numOKPressed = 0; // Counter for OK button presses
        const quizWordElement = document.getElementById('quiz-word');

        if (wordList.length === 0) {
            quizWordElement.textContent = 'No words available.';
        } else {
            const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
            quizWordElement.textContent = randomWord;
        }

        // Change the word when the OK button is clicked
        document.getElementById('quiz-submit').addEventListener('click', () => {
            // remove the randomWord from the word list local varaible
            wordList = wordList.filter(word => word !== quizWordElement.textContent);
            // Update the quizWordElement context with a new random word
            const newRandomWord = wordList[Math.floor(Math.random() * wordList.length)];
            quizWordElement.textContent = newRandomWord || 'No more words available.';
            numOKPressed++;
            if(numOKPressed == 3){
                // close the quiz tab after 3 OK presses
                chrome.runtime.sendMessage({ type: "closeQuizTab" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError);
                    } else {
                        console.log('Quiz tab closed successfully.');
                    }
                });
            }
        });

    });
}

// Initial display of a random word
displayRandomWord();


