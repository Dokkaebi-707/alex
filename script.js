document.addEventListener('DOMContentLoaded', function() {
    const imessageContainer = document.querySelector('.imessage');
    const typingElement = document.getElementById('typing-text');

    const initialTexts = [
        "Happy Birthday, [Her Name]!",
        "I hope you have a fantastic day!"
    ];

    const finalTexts = [
        "Thank you for everything.",
        "You mean the world to me.",
        "Forever yours."
    ];

    let i = 0;
    let j = 0;
    const typingSpeed = 100; // Speed of typing
    const deletingSpeed = 50; // Speed of deleting
    const delayBeforeDeleting = 3000; // Delay before starting to delete (3 seconds)
    const delayBetweenLines = 1000; // Delay between deleting one line and starting the next
    const finalMessageDelay = 2000; // Delay before displaying final "I love you more" message
    const fadeOutDuration = 1000; // Duration of the fade-out effect

    function typeText(textArray, callback) {
        if (i < textArray.length) {
            if (j < textArray[i].length) {
                typingElement.innerHTML += textArray[i].charAt(j);
                j++;
                setTimeout(() => typeText(textArray, callback), typingSpeed);
            } else {
                setTimeout(() => deleteText(textArray, callback), delayBeforeDeleting);
            }
        } else {
            callback();
        }
    }

    function deleteText(textArray, callback) {
        if (j >= 0) {
            typingElement.innerHTML = textArray[i].substring(0, j);
            j--;
            setTimeout(() => deleteText(textArray, callback), deletingSpeed);
        } else {
            i++;
            j = 0;
            setTimeout(() => typeText(textArray, callback), delayBetweenLines);
        }
    }

    function displayFinalMessages() {
        addMessage('I love you', 'from-me');
        setTimeout(() => {
            addMessage('I love you more', 'from-them');
            setTimeout(clearMessages, delayBeforeDeleting + finalMessageDelay); // Clear messages after delay
        }, finalMessageDelay);
    }

    function clearMessages() {
        imessageContainer.classList.add('fade-out'); // Add fade-out class
        setTimeout(() => {
            imessageContainer.innerHTML = ''; // Clear all iMessage styled messages
            imessageContainer.classList.remove('fade-out'); // Remove fade-out class
            i = 0;
            j = 0;
            typeText(finalTexts, () => {}); // Start typing the final texts
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
            playSound('./audio/fm.ogg');
        } else if (fromClass === 'from-them') {
            playSound('./audio/ft.ogg');
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

    // Start typing the first text
    setTimeout(() => typeText(initialTexts, displayFinalMessages), 1000);
});
