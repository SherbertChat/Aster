// Define types for the elements
interface ChatElements {
    chatInput: HTMLInputElement;
    sendButton: HTMLButtonElement;
    chatMessages: HTMLDivElement;
}

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve and type the elements from the DOM
    const elements: ChatElements = {
        chatInput: document.getElementById('chat-input') as HTMLInputElement,
        sendButton: document.getElementById('send-button') as HTMLButtonElement,
        chatMessages: document.getElementById('chat-messages') as HTMLDivElement
    };

    // Ensure all elements are present
    if (!elements.chatInput || !elements.sendButton || !elements.chatMessages) {
        console.error('One or more chat elements are missing from the DOM.');
        return;
    }

    // Function to add a message to the chat
    function addMessage(user: string, text: string): void {
        if (!text.trim()) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        const messageUser = document.createElement('div');
        messageUser.classList.add('message-user');
        messageUser.textContent = user;
        
        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.textContent = text;
        
        messageElement.appendChild(messageUser);
        messageElement.appendChild(messageText);
        elements.chatMessages.appendChild(messageElement);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    // Event listener for the send button
    elements.sendButton.addEventListener('click', () => {
        const messageText = elements.chatInput.value.trim();
        if (messageText !== '') {
            addMessage('User', messageText);
            elements.chatInput.value = '';
        }
    });

    // Event listener for the Enter key in the chat input
    elements.chatInput.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const messageText = elements.chatInput.value.trim();
            if (messageText !== '') {
                addMessage('User', messageText);
                elements.chatInput.value = '';
            }
            e.preventDefault(); // Prevent the default behavior of the Enter key
        }
    });
});
