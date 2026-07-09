// ═══════════════════════════════════════════════════════════════
// HOBBYFI COPILOT — FRONTEND INTERACTIVITY & ROUTING
// Designed & Authored by Vaibhav Sonava
// ═══════════════════════════════════════════════════════════════

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatContainer = document.getElementById('chat-container');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const viewTitle = document.getElementById('view-title');

// Mock Data representing HobbyFi's play, pass, swipe, and community features
const DATA = {
    members: [
        { name: "Rahul Verma", email: "rahul.verma@gmail.com", phone: "+91 98765 43210", plan: "Gold Monthly", status: "Active" },
        { name: "Priya Singh", email: "priya.singh@gmail.com", phone: "+91 98765 43211", plan: "Silver Monthly", status: "Active" },
        { name: "Arjun Kumar", email: "arjun.kumar@gmail.com", phone: "+91 98765 43212", plan: "Gold Monthly", status: "Expiring" },
        { name: "Neha Gupta", email: "neha.gupta@gmail.com", phone: "+91 98765 43213", plan: "Platinum", status: "Active" },
        { name: "Vikram Joshi", email: "vikram.j@gmail.com", phone: "+91 98765 43214", plan: "Gold Monthly", status: "Inactive" },
        { name: "Anita Desai", email: "anita.desai@gmail.com", phone: "+91 98765 43215", plan: "Silver Monthly", status: "Inactive" },
        { name: "Karan Mehta", email: "karan.mehta@gmail.com", phone: "+91 98765 43216", plan: "Platinum", status: "Active" },
        { name: "Sneha Iyer", email: "sneha.iyer@gmail.com", phone: "+91 98765 43217", plan: "Silver Monthly", status: "Active" }
    ],
    bookings: [
        { id: "BK-1001", member: "Rahul Verma", facility: "Court 1", sport: "Badminton", time: "06:00 AM - 07:00 AM", status: "Confirmed" },
        { id: "BK-1002", member: "Priya Singh", facility: "Court 2", sport: "Badminton", time: "07:00 AM - 08:00 AM", status: "Confirmed" },
        { id: "BK-1003", member: "Arjun Kumar", facility: "Turf A", sport: "Football", time: "08:00 AM - 09:00 AM", status: "Confirmed" },
        { id: "BK-1004", member: "Neha Gupta", facility: "Court 1", sport: "Badminton", time: "09:00 AM - 10:00 AM", status: "Pending" },
        { id: "BK-1005", member: "Vikram Joshi", facility: "Court 3", sport: "Tennis", time: "04:00 PM - 05:00 PM", status: "Cancelled" },
        { id: "BK-1006", member: "Karan Mehta", facility: "Court 2", sport: "Badminton", time: "06:00 PM - 07:00 PM", status: "Confirmed" }
    ],
    passes: [
        { name: "Gold Monthly Pass", price: "₹2,500/mo", checkins: "15 Check-ins remaining", plan: "Gold Plan", code: "H-PASS-GOLD" },
        { name: "Silver Monthly Pass", price: "₹1,800/mo", checkins: "8 Check-ins remaining", plan: "Silver Plan", code: "H-PASS-SLVR" },
        { name: "Platinum Pass", price: "₹4,000/mo", checkins: "Unlimited Check-ins", plan: "Platinum Plan", code: "H-PASS-PLAT" }
    ],
    courts: [
        { name: "Court 1", sport: "Badminton", utilization: "85%", status: "Active" },
        { name: "Court 2", sport: "Badminton", utilization: "72%", status: "Active" },
        { name: "Court 3", sport: "Tennis", utilization: "45%", status: "Active" },
        { name: "Turf A", sport: "Football", utilization: "90%", status: "Active" }
    ],
    coaches: [
        { name: "Rajesh Sharma", specialty: "Badminton Coach", rating: "⭐ 4.8", students: "32 active students" },
        { name: "Meera Nair", specialty: "Swimming Coach", rating: "⭐ 4.9", students: "28 active students" },
        { name: "Amit Patel", specialty: "Tennis Coach", rating: "⭐ 4.6", students: "24 active students" }
    ],
    community: {
        groups: [
            { name: "Smash Badminton Club", desc: "For advanced badminton matchups and tournament schedules.", members: "84 active members" },
            { name: "Indiranagar Footballers", desc: "Weekend 5v5 and 7v7 matches on Turf A.", members: "112 active members" },
            { name: "Early Morning Yoga Circle", desc: "Mindfulness and daily flow starting 6:00 AM.", members: "42 active members" }
        ],
        matches: [
            { userA: "Rahul Verma", userB: "Vikram Joshi", status: "Matched", type: "Badminton Buddy" },
            { userA: "Priya Singh", userB: "Neha Gupta", status: "Matched", type: "Tennis Buddy" },
            { userA: "Arjun Kumar", userB: "Karan Mehta", status: "Pending", type: "Football Match" }
        ]
    }
};

let currentConversationId = "thread_" + Date.now();

// ─── Render View Data Dynamically ─────────────────────────────
function renderMembers() {
    const list = document.getElementById('members-list');
    const search = document.getElementById('member-search').value.toLowerCase();
    const filter = document.getElementById('member-plan-filter').value;
    
    list.innerHTML = '';
    DATA.members.forEach(member => {
        const matchesSearch = member.name.toLowerCase().includes(search) || 
                              member.email.toLowerCase().includes(search) || 
                              member.phone.includes(search);
        const matchesFilter = filter === 'all' || member.plan === filter;
        
        if (matchesSearch && matchesFilter) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${escapeHTML(member.name)}</strong></td>
                <td>${escapeHTML(member.email)}</td>
                <td>${escapeHTML(member.phone)}</td>
                <td>${escapeHTML(member.plan)}</td>
                <td><span class="status-badge ${member.status.toLowerCase()}">${member.status}</span></td>
            `;
            list.appendChild(row);
        }
    });
}

function renderBookings() {
    const list = document.getElementById('bookings-list');
    const search = document.getElementById('booking-search').value.toLowerCase();
    const filter = document.getElementById('booking-status-filter').value;
    
    list.innerHTML = '';
    DATA.bookings.forEach(booking => {
        const matchesSearch = booking.member.toLowerCase().includes(search) || 
                              booking.facility.toLowerCase().includes(search);
        const matchesFilter = filter === 'all' || booking.status === filter;
        
        if (matchesSearch && matchesFilter) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><code>${booking.id}</code></td>
                <td><strong>${escapeHTML(booking.member)}</strong></td>
                <td>${escapeHTML(booking.facility)}</td>
                <td>${escapeHTML(booking.sport)}</td>
                <td>${escapeHTML(booking.time)}</td>
                <td><span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span></td>
            `;
            list.appendChild(row);
        }
    });
}

function renderPasses() {
    const container = document.getElementById('passes-container');
    container.innerHTML = '';
    DATA.passes.forEach(pass => {
        const card = document.createElement('div');
        card.className = 'pass-card';
        card.innerHTML = `
            <div class="card-top">
                <div class="card-title">
                    <h4>${escapeHTML(pass.name)}</h4>
                    <p>${escapeHTML(pass.plan)}</p>
                </div>
                <span class="status-badge active">Active</span>
            </div>
            <div class="qr-code-mock">
                <code>${pass.code}</code>
            </div>
            <div class="card-footer">
                <span>Value: ${pass.price}</span>
                <span>${pass.checkins}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderCourts() {
    const container = document.getElementById('courts-container');
    container.innerHTML = '';
    DATA.courts.forEach(court => {
        const card = document.createElement('div');
        card.className = 'court-card';
        card.innerHTML = `
            <div class="card-top">
                <div class="card-title">
                    <h4>${escapeHTML(court.name)}</h4>
                    <p>Sport: ${escapeHTML(court.sport)}</p>
                </div>
                <span class="status-badge active">${court.status}</span>
            </div>
            <div>
                <p style="font-size: 0.875rem; color: var(--text-muted);">Current Utilization Rate:</p>
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem;">${court.utilization}</h3>
            </div>
            <div class="card-footer">
                <span>Contactless QR Check-in enabled</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderCoaches() {
    const container = document.getElementById('coaches-container');
    container.innerHTML = '';
    DATA.coaches.forEach(coach => {
        const card = document.createElement('div');
        card.className = 'coach-card';
        card.innerHTML = `
            <div class="card-top">
                <div class="card-title">
                    <h4>${escapeHTML(coach.name)}</h4>
                    <p>${escapeHTML(coach.specialty)}</p>
                </div>
                <span style="font-size: 0.875rem; font-weight: 600; color: var(--warning);">${coach.rating}</span>
            </div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">
                <i data-lucide="users" style="width: 14px; height: 14px; vertical-align: middle;"></i>
                <span style="vertical-align: middle; margin-left: 0.25rem;">${coach.students}</span>
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons({ root: container });
}

function renderCommunity() {
    const groupsContainer = document.getElementById('community-groups-container');
    groupsContainer.innerHTML = '';
    DATA.community.groups.forEach(group => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-avatar bg-blue-light text-secondary"><i data-lucide="message-square"></i></div>
            <div class="activity-text">
                <p><strong>${escapeHTML(group.name)}</strong></p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">${escapeHTML(group.desc)}</p>
                <span>${group.members}</span>
            </div>
        `;
        groupsContainer.appendChild(item);
    });
    lucide.createIcons({ root: groupsContainer });

    const swipeContainer = document.getElementById('swipe-matches-container');
    swipeContainer.innerHTML = '';
    DATA.community.matches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-avatar bg-orange-light text-warning"><i data-lucide="user-check"></i></div>
            <div class="activity-text">
                <p><strong>${escapeHTML(match.userA)}</strong> matched with <strong>${escapeHTML(match.userB)}</strong></p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Match type: ${escapeHTML(match.type)}</p>
                <span class="status-badge ${match.status.toLowerCase()}">${match.status}</span>
            </div>
        `;
        swipeContainer.appendChild(item);
    });
    lucide.createIcons({ root: swipeContainer });
}

// ─── Tab-based Navigation Router ──────────────────────────────
function switchView(viewName) {
    // Update active navbar state
    document.querySelectorAll('#sidebar-nav .nav-item').forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update View Title
    const formattedTitle = viewName.charAt(0).toUpperCase() + viewName.slice(1);
    viewTitle.textContent = viewName === 'dashboard' ? 'Overview Dashboard' : `${formattedTitle} Directory`;

    // Toggle Section Visibility
    document.querySelectorAll('.view-section').forEach(section => {
        if (section.id === `view-${viewName}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Refresh charts if entering Dashboard or Analytics views
    if (viewName === 'dashboard') {
        renderMainCharts();
    } else if (viewName === 'analytics') {
        renderAnalyticsCharts();
    }

    // Populate data depending on view
    switch(viewName) {
        case 'members':
            renderMembers();
            break;
        case 'bookings':
            renderBookings();
            break;
        case 'passes':
            renderPasses();
            break;
        case 'courts':
            renderCourts();
            break;
        case 'coaches':
            renderCoaches();
            break;
        case 'community':
            renderCommunity();
            break;
    }
}
window.switchView = switchView;

// Attach click listeners to nav items
document.querySelectorAll('#sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) switchView(view);
    });
});

// Setup dynamic filter listeners
document.getElementById('member-search').addEventListener('input', renderMembers);
document.getElementById('member-plan-filter').addEventListener('change', renderMembers);
document.getElementById('booking-search').addEventListener('input', renderBookings);
document.getElementById('booking-status-filter').addEventListener('change', renderBookings);

// ─── Theme Toggle ─────────────────────────────────────────────
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    themeToggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    lucide.createIcons({ root: themeToggle });
});

// ─── Chart Implementations ────────────────────────────────────
let utilizationChartInstance = null;
let revenueChartInstance = null;
let peakChartInstance = null;

function renderMainCharts() {
    const ctx = document.getElementById('utilizationChart');
    if (!ctx) return;
    
    if (utilizationChartInstance) utilizationChartInstance.destroy();
    
    utilizationChartInstance = new Chart(ctx, {
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
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}

function renderAnalyticsCharts() {
    const revCtx = document.getElementById('revenueDistributionChart');
    if (revCtx) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(revCtx, {
            type: 'doughnut',
            data: {
                labels: ['Badminton', 'Football', 'Tennis', 'Pass Check-ins'],
                datasets: [{
                    data: [68, 15, 10, 7],
                    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const peakCtx = document.getElementById('peakHourChart');
    if (peakCtx) {
        if (peakChartInstance) peakChartInstance.destroy();
        peakChartInstance = new Chart(peakCtx, {
            type: 'line',
            data: {
                labels: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'],
                datasets: [{
                    label: 'Hourly Visitors',
                    data: [45, 20, 15, 30, 85, 90],
                    borderColor: '#3B82F6',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.05)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

// Initialise Dashboard components
document.addEventListener("DOMContentLoaded", () => {
    renderMainCharts();
});

// ─── AI Copilot Functionality ──────────────────────────────────
function fillPrompt(text) {
    chatInput.value = text;
    chatInput.focus();
}
window.fillPrompt = fillPrompt;

function clearChat() {
    chatContainer.innerHTML = `
        <div class="message ai">
            <div class="avatar bg-green-light text-primary"><i data-lucide="bot"></i></div>
            <div class="bubble">
                <p>Chat cleared. How can I help you next?</p>
            </div>
        </div>
    `;
    const newMsg = chatContainer.firstElementChild;
    lucide.createIcons({ root: newMsg });
    currentConversationId = "thread_" + Date.now();
}
window.clearChat = clearChat;

function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `
        <div class="avatar"><i data-lucide="user"></i></div>
        <div class="bubble"><p>${escapeHTML(text)}</p></div>
    `;
    chatContainer.appendChild(msgDiv);
    lucide.createIcons({ root: msgDiv });
    scrollToBottom();
}

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

function appendAIMessage(text, isHTML = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai';
    const rendered = isHTML ? text : renderMarkdown(text);
    msgDiv.innerHTML = `
        <div class="avatar bg-green-light text-primary"><i data-lucide="bot"></i></div>
        <div class="bubble">${rendered}</div>
    `;
    chatContainer.appendChild(msgDiv);
    lucide.createIcons({ root: msgDiv });
    scrollToBottom();
}

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
    lucide.createIcons({ root: msgDiv });
    scrollToBottom();
}

function hideTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
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

function checkForApprovalMock(text) {
    const writeKeywords = ["cancel", "update", "delete", "assign", "refund", "block", "create", "extend", "send"];
    const lowerText = text.toLowerCase();
    return writeKeywords.some(word => lowerText.includes(word));
}

function renderApprovalCard(actionText) {
    const template = document.getElementById('approval-card-template').content.cloneNode(true);
    const detailsContainer = template.querySelector('.approval-details');
    detailsContainer.innerHTML = `{
  "action": "WRITE_OPERATION",
  "resource": "HobbyFi Database",
  "intent": "${escapeHTML(actionText)}",
  "status": "PENDING_APPROVAL"
}`;
    return template.firstElementChild.outerHTML;
}

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

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.value = '';
    sendBtn.disabled = true;

    appendUserMessage(message);
    showTyping();

    try {
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
        
        setTimeout(() => {
            if (checkForApprovalMock(message)) {
                const mockAiText = `<p>I have prepared the action you requested. Please approve it before I execute it on the database.</p>` + renderApprovalCard(message);
                appendAIMessage(mockAiText, true);
            } else {
                appendAIMessage("I am currently experiencing connection issues to the local LLM. Make sure your server is online. In the meantime, this is a mock response demonstrating the UI.");
            }
        }, 800);
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
});
