import { addMessage } from './messageUtils';
import { fetchMessages, sendMessage } from './api';
import { chatInput, sendButton, chatMessages } from './domElements';

document.addEventListener('DOMContentLoaded', () => {
    sendButton.addEventListener('click', async () => {
        const messageText = chatInput.value.trim();
        if (messageText !== '') {
            await sendMessage('User', messageText);
            chatInput.value = '';
            fetchMessages();
        }
    });

    chatInput.addEventListener('keypress', async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const messageText = chatInput.value.trim();
            if (messageText !== '') {
                await sendMessage('User', messageText);
                chatInput.value = '';
                fetchMessages();
            }
        }
    });

    setInterval(fetchMessages, 1000); // Polling every second
    fetchMessages(); // Initial fetch
});
