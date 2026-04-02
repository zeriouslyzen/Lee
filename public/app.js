const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// Drawers
const drawerContents = {
    left: document.getElementById('biomech-content'),
    right: document.getElementById('tactical-content'),
    bottom: document.getElementById('alchemical-content')
};

const vitals = {
    phy: document.querySelector('#cns-status .bar'),
    alc: document.querySelector('#chi-status .bar'),
    tac: document.querySelector('#tac-status .bar')
};

let messageHistory = [];

/**
 * Toggle Drawer: Kinetic Sliding Mechanism
 */
window.toggleDrawer = function(side) {
    const selector = side === 'left' ? '#microscope' : 
                     side === 'right' ? '#expansion-zone' : 
                     '#alchemical-lab';
    const drawer = document.querySelector(selector);
    drawer.classList.toggle('open');
};

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';
    messageHistory.push({ role: 'user', content: text });

    typingIndicator.style.display = 'block';

    try {
        const response = await fetch('/v1/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messageHistory })
        });

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        
        parseAndRouteSignals(rawContent);
    } catch (error) {
        console.error('Transmission error:', error);
        appendMessage('system', 'Neural link severed. Connectivity error.');
    } finally {
        typingIndicator.style.display = 'none';
    }
}

/**
 * Signal Multi-Plexing: Routing XML to Drawers
 */
function parseAndRouteSignals(rawContent) {
    // 1. Extract Soul (Master Response)
    const soulMatch = rawContent.match(/<soul>([\s\S]*?)<\/soul>/i);
    if (soulMatch) {
        appendMessage('assistant', soulMatch[1].trim());
    }

    // 2. Extract Signals (Forensic Deep Scans)
    const biomechMatch = rawContent.match(/<biomech>([\s\S]*?)<\/biomech>/i);
    const tacticalMatch = rawContent.match(/<tactical>([\s\S]*?)<\/tactical>/i);
    const alchemicalMatch = rawContent.match(/<alchemical>([\s\S]*?)<\/alchemical>/i);

    if (biomechMatch) {
        updateDrawer('left', 'biomech-content', biomechMatch[1].trim(), 'phy');
    }
    if (tacticalMatch) {
        updateDrawer('right', 'tactical-content', tacticalMatch[1].trim(), 'tac');
    }
    if (alchemicalMatch) {
        updateDrawer('bottom', 'alchemical-content', alchemicalMatch[1].trim(), 'alc');
    }
}

function updateDrawer(side, contentId, text, vitalKey) {
    const el = document.getElementById(contentId);
    el.innerHTML = `<div class="scan-result">${text.replace(/\n/g, '<br>')}</div>`;
    
    // Nudge visual (Pulse the vital header)
    const vital = document.getElementById(`${vitalKey === 'phy' ? 'cns' : vitalKey === 'alc' ? 'chi' : 'tac'}-status`);
    vital.classList.add('pulse');
    setTimeout(() => vital.classList.remove('pulse'), 3000);

    // Update Bars based on content density
    const score = Math.min(100, Math.max(20, text.length / 10)); // Simple density heuristic for pilot
    vitals[vitalKey].style.width = `${score}%`;
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
