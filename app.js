// ═══════════════════════════════════════════════════════════════
// HOBBYFI COPILOT — PRODUCTION AI CRM FRONTEND ENGINE
// Designed & Authored by Vaibhav Sonava | July 2026
// ═══════════════════════════════════════════════════════════════

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatContainer = document.getElementById('chat-container');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const viewTitle = document.getElementById('view-title');

// ─── HIGH FIDELITY DETERMINISTIC DATA GENERATORS ──────────────
// Generates realistic Indian datasets matching HobbyFi database sizes
function generateUsers(count = 550) {
    const firstNames = ["Rahul", "Priya", "Arjun", "Neha", "Vikram", "Anita", "Karan", "Sneha", "Amit", "Rajesh", "Meera", "Sanjay", "Deepak", "Aishwarya", "Anjali", "Rohan", "Kabir", "Aditi", "Vijay", "Divya"];
    const lastNames = ["Verma", "Singh", "Kumar", "Gupta", "Joshi", "Desai", "Mehta", "Iyer", "Patel", "Sharma", "Nair", "Rao", "Mishra", "Pillai", "Reddy", "Choudhury", "Bose", "Saxena", "Kapoor", "Sen"];
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hobbyfi.in"];
    const cities = ["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad"];
    
    const list = [];
    for (let i = 1; i <= count; i++) {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[(i * 3) % lastNames.length];
        const name = `${fn} ${ln}`;
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${domains[i % domains.length]}`;
        const phone = `+91 ${90000 + (i * 7) % 9999} ${10000 + (i * 13) % 89999}`;
        const isActive = (i % 12 !== 0); // 90% active
        const city = cities[i % cities.length];
        list.push({ id: `usr_${1000 + i}`, name, email, phone, isActive, city });
    }
    return list;
}

function generateMemberships(usersList) {
    const plans = ["Gold Monthly", "Silver Monthly", "Platinum"];
    const statuses = ["Active", "Active", "Active", "Active", "Expiring", "Inactive"];
    const list = [];
    usersList.forEach((user, idx) => {
        if (idx < 500) { // 500 memberships
            const plan = plans[idx % plans.length];
            const status = statuses[idx % statuses.length];
            list.push({
                id: `mem_${2000 + idx}`,
                userId: user.id,
                userName: user.name,
                plan,
                status,
                startDate: new Date(2026, 0, 1 + (idx % 28)).toISOString().split('T')[0],
                endDate: new Date(2026, idx % 2 === 0 ? 6 : 7, 1 + (idx % 28)).toISOString().split('T')[0]
            });
        }
    });
    return list;
}

function generateBookings(usersList, count = 1020) {
    const courts = ["Court 1", "Court 2", "Court 3", "Turf A"];
    const sports = ["Badminton", "Badminton", "Tennis", "Football"];
    const times = ["06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM"];
    const statuses = ["Confirmed", "Confirmed", "Confirmed", "Confirmed", "Pending", "Cancelled"];
    
    const list = [];
    for (let i = 1; i <= count; i++) {
        const user = usersList[i % usersList.length];
        const courtIdx = i % courts.length;
        list.push({
            id: `BK-${2000 + i}`,
            member: user.name,
            facility: courts[courtIdx],
            sport: sports[courtIdx],
            time: times[i % times.length],
            status: statuses[i % statuses.length],
            date: new Date(2026, 6, 1 + (i % 10)).toISOString().split('T')[0]
        });
    }
    return list;
}

// Instantiate state data
const usersData = generateUsers();
const membershipsData = generateMemberships(usersData);
const bookingsData = generateBookings(usersData);

const DATA = {
    members: membershipsData,
    bookings: bookingsData,
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

// Pagination & Filtering state
let currentPage = 1;
const rowsPerPage = 10;
let currentSortCol = '';
let currentSortAsc = true;
let currentConversationId = "thread_" + Date.now();

// ─── Render View Data Dynamically with Pagination, Search, Filter & Sort ────
function renderMembers() {
    const list = document.getElementById('members-list');
    if (!list) return;
    const search = document.getElementById('member-search').value.toLowerCase();
    const filter = document.getElementById('member-plan-filter').value;
    
    let filtered = DATA.members.filter(member => {
        const matchesSearch = member.userName.toLowerCase().includes(search) || 
                              member.userId.toLowerCase().includes(search);
        const matchesFilter = filter === 'all' || member.plan === filter;
        return matchesSearch && matchesFilter;
    });

    if (currentSortCol) {
        filtered.sort((a, b) => {
            const valA = a[currentSortCol].toString().toLowerCase();
            const valB = b[currentSortCol].toString().toLowerCase();
            return currentSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
    }

    list.innerHTML = '';
    if (filtered.length === 0) {
        list.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No members match your criteria.</td></tr>`;
        return;
    }

    // Paginated subset
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    paginated.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${escapeHTML(member.userName)}</strong></td>
            <td><code>${escapeHTML(member.userId)}</code></td>
            <td>${escapeHTML(member.startDate)}</td>
            <td>${escapeHTML(member.plan)}</td>
            <td><span class="status-badge ${member.status.toLowerCase()}">${member.status}</span></td>
        `;
        list.appendChild(row);
    });

    renderPaginationControls(filtered.length, 'member-pagination');
}

function renderBookings() {
    const list = document.getElementById('bookings-list');
    if (!list) return;
    const search = document.getElementById('booking-search').value.toLowerCase();
    const filter = document.getElementById('booking-status-filter').value;
    
    let filtered = DATA.bookings.filter(booking => {
        const matchesSearch = booking.member.toLowerCase().includes(search) || 
                              booking.facility.toLowerCase().includes(search);
        const matchesFilter = filter === 'all' || booking.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (currentSortCol) {
        filtered.sort((a, b) => {
            const valA = a[currentSortCol].toString().toLowerCase();
            const valB = b[currentSortCol].toString().toLowerCase();
            return currentSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
    }

    list.innerHTML = '';
    if (filtered.length === 0) {
        list.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No bookings match your criteria.</td></tr>`;
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    paginated.forEach(booking => {
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
    });

    renderPaginationControls(filtered.length, 'booking-pagination');
}

function renderPaginationControls(totalItems, targetId) {
    let container = document.getElementById(targetId);
    if (!container) {
        const parent = document.querySelector('.table-wrapper');
        container = document.createElement('div');
        container.id = targetId;
        container.className = 'pagination-controls';
        parent.after(container);
    }
    
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    container.innerHTML = `
        <button class="btn-ghost" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(-1, '${targetId}')"><i data-lucide="chevron-left"></i> Prev</button>
        <span>Page ${currentPage} of ${totalPages} (${totalItems} items)</span>
        <button class="btn-ghost" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(1, '${targetId}')">Next <i data-lucide="chevron-right"></i></button>
    `;
    lucide.createIcons({ root: container });
}

window.changePage = function(delta, targetId) {
    currentPage += delta;
    if (targetId.includes('member')) {
        renderMembers();
    } else {
        renderBookings();
    }
};

window.sortCol = function(column, tableType) {
    if (currentSortCol === column) {
        currentSortAsc = !currentSortAsc;
    } else {
        currentSortCol = column;
        currentSortAsc = true;
    }
    currentPage = 1;
    if (tableType === 'members') {
        renderMembers();
    } else {
        renderBookings();
    }
};

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
    // Reset paging sorting parameters
    currentPage = 1;
    currentSortCol = '';
    currentSortAsc = true;

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
document.getElementById('member-search').addEventListener('input', () => { currentPage = 1; renderMembers(); });
document.getElementById('member-plan-filter').addEventListener('change', () => { currentPage = 1; renderMembers(); });
document.getElementById('booking-search').addEventListener('input', () => { currentPage = 1; renderBookings(); });
document.getElementById('booking-status-filter').addEventListener('change', () => { currentPage = 1; renderBookings(); });

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
    
    // Calculate dynamic court utilization based on mock data length
    const baseVal = Math.min(100, Math.floor(DATA.bookings.length / 12));
    const dynamicData = [
        Math.max(10, baseVal - 30),
        Math.max(10, baseVal - 20),
        Math.max(10, baseVal - 10),
        Math.max(10, baseVal - 15),
        Math.min(100, baseVal + 5),
        Math.min(100, baseVal + 25),
        Math.min(100, baseVal + 20)
    ];

    utilizationChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Court Utilization (%)',
                data: dynamicData,
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
        
        // Calculate dynamic distribution
        let b = 0, f = 0, t = 0;
        DATA.bookings.forEach(bk => {
            if (bk.sport === 'Badminton') b++;
            if (bk.sport === 'Football') f++;
            if (bk.sport === 'Tennis') t++;
        });
        const total = b + f + t || 1;
        
        revenueChartInstance = new Chart(revCtx, {
            type: 'doughnut',
            data: {
                labels: ['Badminton', 'Football', 'Tennis', 'Pass Check-ins'],
                datasets: [{
                    data: [Math.round((b/total)*80), Math.round((f/total)*80), Math.round((t/total)*80), 20],
                    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const peakCtx = document.getElementById('peakHourChart');
    if (peakCtx) {
        if (peakChartInstance) peakChartInstance.destroy();
        
        // Dynamic peak hours
        const activeUsers = DATA.members.filter(m => m.status === 'Active').length;
        const multiplier = activeUsers / 500;
        
        peakChartInstance = new Chart(peakCtx, {
            type: 'line',
            data: {
                labels: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'],
                datasets: [{
                    label: 'Hourly Visitors',
                    data: [
                        Math.round(45 * multiplier), 
                        Math.round(20 * multiplier), 
                        Math.round(15 * multiplier), 
                        Math.round(30 * multiplier), 
                        Math.round(85 * multiplier), 
                        Math.round(90 * multiplier)
                    ],
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

function appendAIMessageWithDetails(text, details, isHTML = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai';
    const rendered = isHTML ? text : renderMarkdown(text);
    
    // Quick Actions HTML
    const quickActions = `
        <div class="quick-actions" style="display: flex; gap: 0.5rem; margin-top: 0.75rem; opacity: 0; transition: opacity 0.3s; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
            <button class="btn-ghost" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" onclick="navigator.clipboard.writeText('${text.replace(/'/g, "\\'").replace(/\n/g, " ")}'); alert('Copied to clipboard!')"><i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copy</button>
            <button class="btn-ghost" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" onclick="alert('Report generated and downloaded successfully.')"><i data-lucide="download" style="width: 12px; height: 12px;"></i> Export</button>
        </div>
    `;
    
    msgDiv.innerHTML = `
        <div class="avatar bg-green-light text-primary"><i data-lucide="bot"></i></div>
        <div class="bubble">
            <div class="observability-accordion" onclick="toggleDetails(this)">
                <span class="observability-tag"><i data-lucide="cpu"></i> AI Observability & Reasoning</span>
                <i data-lucide="chevron-down" class="accordion-arrow"></i>
            </div>
            <div class="observability-details">
                <div class="detail-row"><span>Pipeline Trace:</span> <code>Intent Detection -> Planner -> Memory -> Retriever -> Tool Selection -> Policy Check</code></div>
                <div class="detail-row"><span>Executed Tools:</span> <code>${details.tools}</code></div>
                <div class="detail-row"><span>Confidence Score:</span> <span>${details.confidence}</span></div>
                <div class="detail-row"><span>Trace Latency:</span> <span>${details.latency}</span></div>
                <div class="detail-row"><span>LLM Tokens:</span> <span>${details.tokens}</span></div>
                <div class="detail-row"><span>Memory Hits:</span> <span>${details.memory}</span></div>
                <div class="detail-row"><span>Audit Log Ref:</span> <span>${details.auditRef}</span></div>
            </div>
            <div class="ai-content-body mt-2"></div>
            ${quickActions}
        </div>
    `;
    chatContainer.appendChild(msgDiv);
    lucide.createIcons({ root: msgDiv });
    scrollToBottom();

    // Streaming effect
    const bodyContainer = msgDiv.querySelector('.ai-content-body');
    const actionsContainer = msgDiv.querySelector('.quick-actions');
    
    if (isHTML) {
        bodyContainer.innerHTML = rendered;
        actionsContainer.style.opacity = '1';
        lucide.createIcons({ root: bodyContainer });
        scrollToBottom();
    } else {
        // Stream it block by block
        let i = 0;
        const chunkSize = 3;
        const streamInterval = setInterval(() => {
            i += chunkSize;
            if (i > rendered.length) {
                bodyContainer.innerHTML = rendered;
                actionsContainer.style.opacity = '1';
                lucide.createIcons({ root: bodyContainer });
                clearInterval(streamInterval);
            } else {
                bodyContainer.innerHTML = rendered.substring(0, i) + '<span style="border-right: 2px solid var(--primary); display: inline-block; width: 2px;"></span>';
            }
            scrollToBottom();
        }, 15);
    }
}

window.toggleDetails = function(header) {
    const details = header.nextElementSibling;
    const arrow = header.querySelector('.accordion-arrow');
    const isExpanded = details.style.display === 'block';
    details.style.display = isExpanded ? 'none' : 'block';
    arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
};

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
    
    // Estimate financial impact
    let financialImpact = "₹0 (Neutral)";
    let businessImpact = "General operational update.";
    let affected = "1 record";
    
    const lowerText = actionText.toLowerCase();
    if (lowerText.includes("coupon") || lowerText.includes("discount")) {
        financialImpact = "- ₹12,500 (Marketing cost)";
        businessImpact = "Generate a new campaign to increase occupancy by 15%.";
        affected = "discount_coupons";
    } else if (lowerText.includes("cancel") || lowerText.includes("refund")) {
        financialImpact = "- ₹1,800 (Immediate debit)";
        businessImpact = "Booking cancellation and automated refund process initiation.";
        affected = "bookings, payments";
    } else if (lowerText.includes("membership") || lowerText.includes("renew")) {
        financialImpact = "+ ₹2,500 (Immediate credit)";
        businessImpact = "Update subscription pass validity and reset check-in limits.";
        affected = "memberships";
    }

    detailsContainer.innerHTML = `{
  "action": "WRITE_OPERATION",
  "resource": "HobbyFi Database",
  "affected_records": "${affected}",
  "intent": "${escapeHTML(actionText)}",
  "business_impact": "${businessImpact}",
  "estimated_revenue_impact": "${financialImpact}",
  "validation_status": "PASSED (Policy Rule #201)",
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
            <p class="approval-desc" style="margin-bottom: 0.5rem;">Database updated successfully.</p>
            <div class="sql-preview-container">
                <div class="sql-accordion" onclick="toggleDetails(this)">
                    <span><i data-lucide="database"></i> SQL Transaction History Log</span>
                    <i data-lucide="chevron-down" class="accordion-arrow"></i>
                </div>
                <div class="observability-details font-mono" style="padding: 0.5rem; background: #E5E7EB; margin-top: 0.25rem;">
                    <code>BEGIN TRANSACTION;<br>UPDATE db_records SET status='executed' WHERE id='txn_91823';<br>COMMIT;</code>
                </div>
            </div>
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
                vendorId: "v_12345_demo",
                message: message,
                conversationId: currentConversationId
            })
        });

        const data = await response.json();
        hideTyping();

        if (response.ok && data.success) {
            let aiText = data.data.text;
            
            // Build mock dynamic reasoning details based on the query
            const lowerMsg = message.toLowerCase();
            let tools = "none";
            if (lowerMsg.includes("revenue") || lowerMsg.includes("sale") || lowerMsg.includes("earn")) tools = "getRevenue()";
            else if (lowerMsg.includes("booking") || lowerMsg.includes("court")) tools = "getBookings()";
            else if (lowerMsg.includes("member") || lowerMsg.includes("user")) tools = "getMembers()";
            else if (lowerMsg.includes("coach") || lowerMsg.includes("trainer")) tools = "getCoaches()";
            else if (lowerMsg.includes("coupon") || lowerMsg.includes("discount")) tools = "createCoupon()";
            
            const details = {
                tools,
                confidence: "98.4%",
                latency: "230ms",
                tokens: "312 tokens",
                memory: "Yes (Vendor preferences loaded)",
                auditRef: `log_audit_${Math.floor(100000 + Math.random() * 900000)}`
            };

            if (checkForApprovalMock(message)) {
                aiText += `<br><br>I have prepared the transaction. Please review and approve:` + renderApprovalCard(message);
                appendAIMessageWithDetails(aiText, details, true);
            } else {
                appendAIMessageWithDetails(aiText, details);
            }
            currentConversationId = data.data.conversationId;
        } else {
            appendAIMessage(`⚠️ Error: ${data.error || 'Failed to connect to AI Engine'}`);
        }
    } catch (error) {
        hideTyping();
        console.error(error);
        
        setTimeout(() => {
            const details = {
                tools: "none (offline mode)",
                confidence: "95.0%",
                latency: "250ms",
                tokens: "0 tokens (local simulation)",
                memory: "Fallback loaded",
                auditRef: `log_mock_999283`
            };

            if (checkForApprovalMock(message)) {
                const mockAiText = `<p>I have prepared the action you requested. Please approve it before I execute it on the database.</p>` + renderApprovalCard(message);
                appendAIMessageWithDetails(mockAiText, details, true);
            } else {
                appendAIMessageWithDetails("I am currently experiencing connection issues to the local LLM. Make sure your server is online. In the meantime, this is a mock response demonstrating the UI.", details);
            }
        }, 800);
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
});

// ─── Interactive KPI Dashboard Cards ─────────────────────────
window.triggerKPICall = function(cardType) {
    if (cardType === 'revenue') {
        fillPrompt("Show me today's revenue, weekly trend, monthly report or sport-wise breakdown?");
    } else if (cardType === 'bookings') {
        switchView('bookings');
    } else if (cardType === 'attendance') {
        switchView('analytics');
    } else if (cardType === 'renewals') {
        fillPrompt("Show me the 12 pending renewals or run a churn risk analysis");
    }
};
