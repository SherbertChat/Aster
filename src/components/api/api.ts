import { addMessage } from './messageUtils';

const API_URL = '/messages';

export async function fetchMessages(): Promise<void> {
    const response = await fetch(API_URL);
    const messages: { user: string, text: string }[] = await response.json();
    const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
        addMessage(msg.user, msg.text);
    });
}

export async function sendMessage(user: string, text: string): Promise<void> {
    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, text })
    });
}
