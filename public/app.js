const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const pulseTicker = document.getElementById('pulse-ticker');
const providerToggle = document.getElementById('neural-provider-toggle');
const activeProviderLabel = document.getElementById('active-provider');

// Performance HUD elements
const stats = {
    latency: document.getElementById('duel-latency'),
    tokens: document.getElementById('duel-tokens'),
    cost: document.getElementById('duel-cost')
};

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
 * Toggle Neural Link
 */
providerToggle.addEventListener('change', () => {
    const isCloud = providerToggle.checked;
    activeProviderLabel.innerText = isCloud ? 'DEEPSEEK ACTIVE' : 'OLLAMA ACTIVE';
    activeProviderLabel.style.color = isCloud ? '#00ffcc' : '#FFD700';
});

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

    const provider = providerToggle.checked ? 'deepseek' : 'local';

    try {
        const response = await fetch('/v1/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messageHistory, provider })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalContent = '';
        let isFinal = false;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('PULSE:')) {
                    const pulse = JSON.parse(line.substring(6));
                    handlePulse(pulse);
                } else if (line.startsWith('FINAL:')) {
                    isFinal = true;
                    finalContent += line.substring(6) + '\n';
                } else if (isFinal) {
                    finalContent += line + '\n';
                }
            }
        }

        if (finalContent) {
            parseAndRouteSignals(finalContent);
        }
    } catch (error) {
        console.error('Transmission error:', error);
        appendMessage('system', 'Neural link severed. Connectivity error.');
    }
}

function handlePulse(pulse) {
    const div = document.createElement('div');
    div.className = 'pulse-line agent';
    div.innerText = `> [${pulse.agent.toUpperCase()}]: ${pulse.message}`;
    pulseTicker.prepend(div);

    if (pulse.stats) {
        updateStats(pulse.stats);
    }
}

function updateStats(data) {
    stats.latency.innerText = `${data.latencyMs}ms`;
    stats.tokens.innerText = data.tokens;
    
    // Estimate cost: $0.28 per 1M tokens for DeepSeek, $0 for local
    const costPerToken = data.provider === 'deepseek' ? 0.00000028 : 0;
    const estimatedCost = (data.tokens * costPerToken).toFixed(4);
    stats.cost.innerText = `$${estimatedCost}`;
}

function parseAndRouteSignals(rawContent) {
    const soulMatch = rawContent.match(/<soul>([\s\S]*?)<\/soul>/i);
    if (soulMatch) {
        appendMessage('assistant', soulMatch[1].trim());
    }

    const biomechMatch = rawContent.match(/<biomech>([\s\S]*?)<\/biomech>/i);
    const tacticalMatch = rawContent.match(/<tactical>([\s\S]*?)<\/tactical>/i);
    const alchemicalMatch = rawContent.match(/<alchemical>([\s\S]*?)<\/alchemical>/i);

    if (biomechMatch) updateDrawer('left', 'biomech-content', biomechMatch[1].trim(), 'phy');
    if (tacticalMatch) updateDrawer('right', 'tactical-content', tacticalMatch[1].trim(), 'tac');
    if (alchemicalMatch) updateDrawer('bottom', 'alchemical-content', alchemicalMatch[1].trim(), 'alc');
}

function updateDrawer(side, contentId, text, vitalKey) {
    const el = document.getElementById(contentId);
    el.innerHTML = `<div class="scan-result">${text.replace(/\n/g, '<br>')}</div>`;
    const score = Math.min(100, Math.max(20, text.length / 10));
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
