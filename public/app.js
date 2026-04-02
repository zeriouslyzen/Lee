const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const thoughtContent = document.getElementById('thought-content');
const typingIndicator = document.getElementById('typing-indicator');
const cnsBar = document.querySelector('#cns-status .bar');
const chiBar = document.querySelector('#chi-status .bar');

let messageHistory = [];

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Add user message to UI
    appendMessage('user', text);
    userInput.value = '';
    messageHistory.push({ role: 'user', content: text });

    // Loading state
    thoughtContent.innerHTML = '<p class="pulse">Deconstructing neural patterns...</p>';
    typingIndicator.style.display = 'block';

    try {
        const response = await fetch('/v1/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messageHistory })
        });

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        messageHistory.push({ role: 'assistant', content: rawContent });

        parseAndDisplay(rawContent);
    } catch (error) {
        console.error('Transmission error:', error);
        appendMessage('system', 'Neural link severed. Connectivity error.');
    } finally {
        typingIndicator.style.display = 'none';
    }
}

function parseAndDisplay(rawContent) {
    // 1. Separate the Agents
    const forensicMatch = rawContent.match(/<forensic>([\s\S]*?)<\/forensic>/i);
    let personaResponse = rawContent.replace(/<forensic>[\s\S]*?<\/forensic>/i, '').trim();

    if (forensicMatch) {
       const forensicText = forensicMatch[1].trim();
       thoughtContent.innerHTML = `<p><strong>FORENSIC MICROSCOPE:</strong><br>${forensicText.replace(/\n/g, '<br>')}</p>`;
       thoughtContent.scrollTop = 0;

       // Reactive Vitals Logic (Demo Ready)
       updateVitals(forensicText);
    }

    // 2. Add Persona Response (Agent B - The Soul) to Chat
    if (personaResponse) {
        appendMessage('assistant', personaResponse);
    }
}

function updateVitals(forensicText) {
    // Dynamic bars based on keywords in the analyst's report
    let cns = 85; 
    let chi = 70;

    if (forensicText.toLowerCase().includes('tension') || forensicText.toLowerCase().includes('stiff')) cns -= 20;
    if (forensicText.toLowerCase().includes('efficiency') || forensicText.toLowerCase().includes('fluid')) cns += 10;
    if (forensicText.toLowerCase().includes('blockage') || forensicText.toLowerCase().includes('imbalance')) chi -= 15;
    if (forensicText.toLowerCase().includes('alignment') || forensicText.toLowerCase().includes('center')) chi += 15;

    // Clamp values
    cns = Math.max(10, Math.min(100, cns));
    chi = Math.max(10, Math.min(100, chi));

    cnsBar.style.width = `${cns}%`;
    chiBar.style.width = `${chi}%`;
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
