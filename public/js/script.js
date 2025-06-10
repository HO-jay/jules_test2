// jshint esversion: 6

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Default tab activation is handled by HTML 'active' class.
    // JS below ensures dynamic switching.

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button
            button.classList.add('active');

            // Display the corresponding tab content
            const tabId = button.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId + '-content');
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // Character counter for text input area
    const textArea = document.getElementById('text-to-translate');
    const charCountDisplay = document.getElementById('char-count');
    const MAX_CHARS = 5000;

    if (textArea && charCountDisplay) {
        textArea.addEventListener('input', () => {
            const currentLength = textArea.value.length;
            charCountDisplay.textContent = `${currentLength} / ${MAX_CHARS}`;

            if (currentLength > MAX_CHARS) {
                charCountDisplay.style.color = 'red';
                // Optional: textArea.value = textArea.value.substring(0, MAX_CHARS);
            } else {
                charCountDisplay.style.color = '#555'; // Default color
            }
        });
    }
});
