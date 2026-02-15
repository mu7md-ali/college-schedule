// =============================================
// DATA — loaded from data.json
// =============================================
let periodInfo = {};
let allSections = {};

async function loadData() {
    try {
        const response = await fetch('data.json');
        const json = await response.json();
        periodInfo = json.periodInfo;
        allSections = json.sections;
    } catch (err) {
        console.error('Failed to load data.json:', err);
        showToast('فشل تحميل البيانات، تأكد من اتصالك بالإنترنت', 'error');
    }
}

// =============================================
// STATE
// =============================================
let currentSection = "1";
let originalContent = '';
let isEditing = false;
let isGroupView = false;
let currentGroup = null;
let currentNoteSlot = null;
let hasCustomSection = false;

// =============================================
// THEME
// =============================================
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', next === 'dark' ? '#0a0f1c' : '#e8f0fe');
    }
    
    showToast(`تم التبديل إلى الوضع ${next === 'dark' ? 'الليلي' : 'النهاري'}`, 'info');
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// =============================================
// BINARY BACKGROUND
// =============================================
function initBinaryBackground() {
    const container = document.getElementById('binary-bg');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const col = document.createElement('div');
        col.className = 'binary-column';
        col.style.left = `${(i / 30) * 100}%`;
        col.style.animationDuration = `${15 + Math.random() * 10}s`;
        col.style.animationDelay = `${Math.random() * 5}s`;
        let txt = '';
        for (let j = 0; j < 40; j++) { txt += (Math.random() > 0.5 ? '1' : '0') + '<br>'; }
        col.innerHTML = txt;
        container.appendChild(col);
    }
}

// =============================================
// TOAST
// =============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { 
        success: '<i class="fas fa-check-circle"></i>', 
        error: '<i class="fas fa-exclamation-circle"></i>', 
        info: '<i class="fas fa-info-circle"></i>' 
    };
    toast.innerHTML = `${icons[type] || ''} ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// =============================================
// SECTION LOADING
// =============================================
function changeSection(sectionNum) {
    if (!sectionNum) return;
    
    // التحقق من وجود القسم
    if (!allSections[sectionNum]) {
        showToast('هذا القسم غير متوفر', 'error');
        return;
    }
    
    document.getElementById('skeletonLoader').classList.remove('hidden');
    document.getElementById('noticeBox').classList.add('hidden');
    document.getElementById('controlsArea').classList.remove('hidden');

    setTimeout(() => {
        currentSection = sectionNum;
        isGroupView = false;
        currentGroup = null;

        document.getElementById('sectionView').classList.remove('hidden');
        document.getElementById('groupView').classList.add('hidden');
        document.getElementById('skeletonLoader').classList.add('hidden');
        document.getElementById('groupABtn').classList.remove('hidden');
        document.getElementById('groupBBtn').classList.remove('hidden');
        document.getElementById('downloadBtn').classList.remove('hidden');
        document.getElementById('pdfBtn').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');

        const section = allSections[sectionNum];
        const displayName = sectionNum === 'custom' ? '🎨 My Custom Section' : `Section ${sectionNum}`;
        renderSectionTable(section.data, displayName);

        // تحديث قيم الـ selects
        document.getElementById('sectionSelect').value = sectionNum;
        document.getElementById('sectionSelectMain').value = sectionNum;

        showToast(`${displayName} Loaded`, 'success');
    }, 400);
}

// =============================================
// RENDER SECTION TABLE
// =============================================
function renderSectionTable(data, displayName) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    document.getElementById('tableTitle').innerText = displayName;

    // Load saved edited HTML if exists
    const savedHTML = localStorage.getItem(`edit-${currentSection}`);
    if (savedHTML && !isGroupView) {
        document.getElementById('captureArea').innerHTML = savedHTML;
        return;
    }

    days.forEach((day, index) => {
        const row = document.createElement('tr');
        row.className = 'day-row';
        row.style.animationDelay = `${index * 0.05}s`;
        
        // Day cell
        const dayCell = document.createElement('td');
        dayCell.className = 'font-black text-white/50 text-[8px] sm:text-[11px] pr-1 sm:pr-4 align-middle uppercase tracking-wider whitespace-nowrap day-label-text';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        periods.forEach((p, pIndex) => {
            if (pIndex === 2) {
                const breakTd = document.createElement('td');
                breakTd.innerHTML = `<div class="break-cell"><div class="break-line"></div><span class="break-icon">☕</span><span class="break-text">BREAK</span><div class="break-line"></div></div>`;
                row.appendChild(breakTd);
            }
            
            const cell = data[day] ? data[day][p] : null;
            const noteKey = `note-${currentSection}-${day}-${p}`;
            const hasNote = localStorage.getItem(noteKey);

            const td = document.createElement('td');
            
            if (cell) {
                const roomHtml = cell.r.replace(/AI/g, '<span class="ai-highlight">AI</span>');
                const isLecture = cell.t === 'L';
                td.innerHTML = `<div class="${isLecture ? 'lecture-card' : 'lab-card'}${hasNote ? ' has-note' : ''}" onclick="showDetails('${day}','${p}','${currentSection}')" oncontextmenu="openNoteModal('${day}','${p}','${currentSection}');return false;"><div class="card-subject">${cell.n}</div><div class="card-doctor">${cell.d}</div><div class="room-text">${roomHtml}</div></div>`;
            } else {
                td.innerHTML = `<div class="free-card" onclick="openNoteModal('${day}','${p}','${currentSection}')">FREE</div>`;
            }
            row.appendChild(td);
        });
        body.appendChild(row);
    });
}

// =============================================
// GROUP VIEW
// =============================================
function showGroupSchedule(group) {
   
