document.addEventListener('DOMContentLoaded', () => {
    const accountIcon = document.getElementById('account-icon');
    const showWordlistButton = document.getElementById('show-wordlist');
    const quizMeButton = document.getElementById('quiz-me');

    accountIcon.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'accountIconClick' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
                alert('Failed to communicate with background script.');
            } else if (response) {
                // do something with the respond regarding the acount icon click
            } else {
                alert('No response from background script.');
            }
        });
    });

    showWordlistButton.addEventListener('click', () => {
        console.log("Show Wordlist button clicked");
        // Open a new tab with the word list
        chrome.tabs.create({ url: 'wordlist.html' }, (tab) => {
            console.log('Wordlist tab opened:', tab);
        });
    });

    quizMeButton.addEventListener('click', () => {
        // Create a new tab for the quiz
        chrome.tabs.create({ url: 'quiz.html' }, (tab) => {
            console.log('Quiz tab opened:', tab);
        });
        
    });
});
