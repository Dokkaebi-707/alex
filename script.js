document.addEventListener('DOMContentLoaded', function() {
    const imessageContainer = document.querySelector('.imessage');
    const typingElement = document.getElementById('typing-text');
    const videoContainer = document.getElementById('video-container');
    const introVideo = document.getElementById('intro-video');

    const initialMessage = "Turn the volume up a little, and tap when you're ready c:";

    const introTexts = [
        "Happy Birthday my love!",
        "I miss you so much.",
        "I know I can't be there now.",
        "But this'll do! You're going to enjoy today c:",
        "I love you, you are so beautiful",
        "This day is your day, but every day...",
        "You are the most special woman in the universe",
        "And next birthday, it's just us two",
        "Me and you :3"
    ];

    const initialTexts = [
        "And one day,",
        "A day not very far away,",
    ];

    const finalTexts = [
        "Happy birthday lovey.",
        "I love you, forever mine and forever yours.",
        "See you soon c:",
        "<3"
    ];

    const messagesToAdd = [
        () => addMessage('Hey, I miss you', 'from-me'),
        () => addMessage('I miss you too baby, come to my new place?', 'from-them'),
        () => addMessage('I would love to', 'from-me'),
        () => addMessage('Dinner will be ready, just drive safely :)', 'from-them'),
        () => addMessage('Okie! See you soon lovey', 'from-me'),
        () => addMessage('See you soon c:', 'from-them')
    ];

    let i = 0;
    let j = 0;
    let typingInitialMessage = true; // Flag to track if typing initial message
    const typingSpeed = 55; // Speed of typing
    const deletingSpeed = 30; // Speed of deleting
    const delayBeforeDeleting = 2000; // Delay before starting to delete (3 seconds)
    const delayBetweenLines = 1000; // Delay between deleting one line and starting the next
    const finalMessageDelay = 2000; // Delay before displaying final "I love you more" message
    const fadeOutDuration = 1000; // Duration of the fade-out effect

    // Adjust this value to set the desired volume level (0.0 to 1.0)
    const videoVolume = 0.10; // Example: Set the volume to 10%

    function typeText(textArray, callback) {
        if (i < textArray.length) {
            if (j < textArray[i].length) {
                typingElement.textContent += textArray[i].charAt(j);
                j++;
                // Check if text exceeds client width, if so, add line break
                if (typingElement.scrollWidth > typingElement.clientWidth) {
                    typingElement.innerHTML = typingElement.textContent + '<br>';
                }
                setTimeout(() => typeText(textArray, callback), typingSpeed);
            } else {
                setTimeout(() => deleteText(textArray, callback), delayBeforeDeleting);
            }
        } else {
            i = 0;
            callback();
        }
    }

    function deleteText(textArray, callback) {
        if (j >= 0) {
            typingElement.textContent = textArray[i].substring(0, j);
            j--;
            setTimeout(() => deleteText(textArray, callback), deletingSpeed);
        } else {
            i++;
            j = 0;
            setTimeout(() => typeText(textArray, callback), delayBetweenLines);
        }
    }

    function displayFinalMessages() {
        runMessagesSequentially(messagesToAdd, 0, () => {
            setTimeout(clearMessagesAndCloseTab, finalMessageDelay); // Clear messages after delay and close tab
        });
    }

    function clearMessagesAndCloseTab() {
        imessageContainer.classList.add('fade-out'); // Add fade-out class
        setTimeout(() => {
            imessageContainer.innerHTML = ''; // Clear all iMessage styled messages
            imessageContainer.classList.remove('fade-out'); // Remove fade-out class
            i = 0;
            j = 0;
            typeText(finalTexts, () => {
                // Close the tab/window
                if (isSafeToCloseTab()) {
                    window.close();
                }
            });
        }, fadeOutDuration);
    }

    // Function to play sound
    function playSound(soundFile) {
        const audio = new Audio(soundFile);
        audio.play();
    }

    // Function to add a new message with animation
    function addMessage(text, fromClass) {
        const p = document.createElement('p');
        p.classList.add(fromClass);
        p.textContent = text;

        // Insert the new message at the end and trigger the sound
        imessageContainer.appendChild(p);
        if (fromClass === 'from-me') {
            playSound('./audio/fm.mp3');
        } else if (fromClass === 'from-them') {
            playSound('./audio/ft.mp3');
        }

        // Add slide animation to new message
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        setTimeout(() => {
            p.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }, 50);
    }

    // MutationObserver to watch for changes in .imessage
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.classList.contains('from-me') || node.classList.contains('from-them')) {
                    node.style.animation = 'slideUp 0.5s ease forwards';
                }
            });
        });
    });

    observer.observe(imessageContainer, { childList: true });

    // Function to start typing the initial message
    function startInitialMessage() {
        typingInitialMessage = true;
        typeText([initialMessage], () => {
            typingInitialMessage = false;
        });
    }

    // Function to handle tap event and start initial messages
    function tapHandler() {
        if (!typingInitialMessage) {
            document.removeEventListener('click', tapHandler); // Remove tap event listener
            setTimeout(() => {
                playSound("./audio/bg2.mp3");
                typeText(introTexts, () => {
                    
                    // Show video with fade-in effect
                    videoContainer.classList.add('fade-in');
                    videoContainer.style.display = 'block'; // Show the video container
                    introVideo.volume = videoVolume;
                    introVideo.muted = true; // Ensure video is muted for autoplay compliance

                    // Attempt to autoplay the video
                    introVideo.play()
                        .then(() => {
                            // Video started playing
                        })
                        .catch((error) => {
                            // Autoplay failed, handle it here
                            console.error('Autoplay failed:', error);
                            // Show a play button or message to manually start the video
                            videoContainer.addEventListener('click', () => {
                                introVideo.muted = false; // Unmute on user interaction
                                introVideo.play();
                            });
                        });

                    introVideo.onended = () => {
                        // Fade out video and start initial texts
                        videoContainer.classList.add('fade-out');
                        setTimeout(() => {
                            videoContainer.style.display = 'none';
                            typeText(initialTexts, displayFinalMessages);
                        }, fadeOutDuration);
                    };
                });
            }, 500); // Adjust delay as needed
        }
    }

    // Start with typing the initial message
    startInitialMessage();

    // Listen for tap events anywhere on the document
    document.addEventListener('click', tapHandler);

    // Function to run messages sequentially with delay between each
    function runMessagesSequentially(messageArray, index, callback) {
        if (index < messageArray.length) {
            messageArray[index]();
            setTimeout(() => runMessagesSequentially(messageArray, index + 1, callback), 1000); // Adjust delay between messages
        } else {
            callback();
        }
    }

    // Function to check if it's safe to close the tab/window
    function isSafeToCloseTab() {
        // Add any conditions here to check if the user interaction is complete
        return true; // Example condition: always return true for demonstration
    }
});
