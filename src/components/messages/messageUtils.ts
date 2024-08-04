const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;

export function addMessage(user: string, text: string): void {
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
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
