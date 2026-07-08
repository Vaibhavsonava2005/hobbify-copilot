const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatContainer = document.getElementById('chat-container');
const sendBtn = document.getElementById('send-btn');

// Dummy vendor ID for the prototype
const VENDOR_ID = "v_12345_demo";
let currentConversationId = "thread_" + Date.now();

// Render Chart
document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById('utilizationChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Court Utilization (%)',
                    data: [45, 50, 60, 55, 75, 95, 90],
                    backgroundColor: '#10B981', // HobbyFi Green
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }
});

// Utility: Fill prompt from suggestion
function fillPrompt(text) {
    chatInput.value = text;
    chatInput.focus();
}

function clearChat() {
    chatContainer.innerHTML = `
        <div class="message ai">
            <div class="avatar bg-green-light text-primary"><i data-lucide="bot"></i></div>
            <div class="bubble">
                <p>Chat cleared. How can I help you next?</p>
            </div>
        </div>
    `;
    lucide.createIcons();
    currentConversationId = "thread_" + Date.now();
}
window.clearChat = clearChat;

// Render a user message
function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `
        <div class="avatar"><i data-lucide="user"></i></div>
        <div class="bubble"><p>${escapeHTML(text)}</p></div>
    `;
    chatContainer.appendChild(msgDiv);
    lucide.createIcons();
    scrollToBottom();
}

// Simple markdown to HTML converter
function renderMarkdown(text) {
    return text
        // Tables
        .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
            const headers = header.split('|').map(h => h.trim()).filter(Boolean);
            const headerHTML = headers.map(h => `<th>${h}</th>`).join('');
            const rowsHTML = rows.trim().split('\n').map(row => {
                const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
            }).join('');
            return `<table class="ai-table"><thead><tr>${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>`;
        })
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>');
}

// Render an AI message
function appendAIMessage(text, isHTML = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai';
    const rendered = isHTML ? text : renderMarkdown(text);
    msgDiv.innerHTML = `
        <div class="avatar bg-green-light text-primary"><i data-lucide="bot"></i></div>
        <div class="bubble">${rendered}</div>
    `;
    chatContainer.appendChild(msgDiv);
    lucide.createIcons();
    scrollToBottom();
}

// Show typing indicator
function showTyping() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai typing-message';
    msgDiv.id = 'typing-indicator';
    msgDiv.innerHTML = `
        <div class="avatar bg-green-light text-primary"><i data-lucide="bot"></i></div>
        <div class="bubble">
            <span>Thinking...</span>
        </div>
    `;
    chatContainer.appendChild(msgDiv);
    lucide.createIcons();
    scrollToBottom();
}

// Hide typing indicator
function hideTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

// Detect if a message looks like it requires an approval card
function checkForApprovalMock(text) {
    const writeKeywords = ["cancel", "update", "delete", "assign", "refund", "block", "create", "extend", "send"];
    const lowerText = text.toLowerCase();
    
    for (let word of writeKeywords) {
        if (lowerText.includes(word)) {
            return true;
        }
    }
    return false;
}

function renderApprovalCard(actionText) {
    const template = document.getElementById('approval-card-template').content.cloneNode(true);
    
    // Inject mock payload details
    const detailsContainer = template.querySelector('.approval-details');
    detailsContainer.innerHTML = `{
  "action": "WRITE_OPERATION",
  "resource": "HobbyFi Database",
  "intent": "${escapeHTML(actionText)}",
  "status": "PENDING_APPROVAL"
}`;
    
    return template.firstElementChild.outerHTML;
}

// Handle Mock Approval button click
window.handleApproval = function(btn, approved) {
    const card = btn.closest('.approval-card');
    if (approved) {
        card.innerHTML = `
            <div class="approval-header" style="color: var(--primary)">
                <i data-lucide="check-circle"></i>
                <h4>Action Approved & Executed</h4>
            </div>
            <p class="approval-desc" style="margin-bottom: 0;">Database updated successfully.</p>
        `;
    } else {
        card.innerHTML = `
            <div class="approval-header" style="color: var(--destructive)">
                <i data-lucide="x-circle"></i>
                <h4>Action Declined</h4>
            </div>
            <p class="approval-desc" style="margin-bottom: 0;">Operation cancelled by vendor.</p>
        `;
    }
    lucide.createIcons({ root: card });
}

// Handle Form Submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.value = '';
    sendBtn.disabled = true;

    appendUserMessage(message);
    showTyping();

    try {
        // Send request to the local Hono API
        const response = await fetch('/api/copilot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer local_dev_token'
            },
            body: JSON.stringify({
                vendorId: VENDOR_ID,
                message: message,
                conversationId: currentConversationId
            })
        });

        const data = await response.json();
        hideTyping();

        if (response.ok && data.success) {
            let aiText = data.data.text;
            
            if (checkForApprovalMock(message)) {
                aiText += `<br><br>I have prepared the transaction. Please review and approve:` + renderApprovalCard(message);
                appendAIMessage(aiText, true);
            } else {
                appendAIMessage(aiText);
            }
            
            currentConversationId = data.data.conversationId;
        } else {
            appendAIMessage(`⚠️ Error: ${data.error || 'Failed to connect to AI Engine'}`);
        }
    } catch (error) {
        hideTyping();
        console.error(error);
        
        // Fallback for UI demonstration
        setTimeout(() => {
            if (checkForApprovalMock(message)) {
                const mockAiText = `<p>I have prepared the action you requested. Please approve it before I execute it on the database.</p>` + renderApprovalCard(message);
                appendAIMessage(mockAiText, true);
            } else {
                appendAIMessage("I am currently experiencing connection issues to the local LLM. Make sure `ollama serve` is running. In the meantime, this is a mock response demonstrating the UI.");
            }
        }, 800);
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
});
