// ============================================
// DATA
// ============================================
let periodInfo = {};
let allSections = {};

async function loadData() {
    try {
        const res = await fetch('data.json');
        const json = await res.json();
        periodInfo = json.periodInfo;
        allSections = json.sections;
    } catch (e) {
        console.error('Failed to load data.json', e);
        showToast('Failed to load schedule data', 'error');
    }
}

// ============================================
// STATE
// ============================================
let currentSection = '';
let isEditing = false;
let isGroupView = false;
let currentGroup = null;
let originalContent = '';

// ============================================
// THEME
// ============================================
function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// ============================================
// BINARY BACKGROUND
// ============================================
function initBinaryBackground() {
    const container = document.getElementById('binary-bg');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const col = document.createElement('div');
        col.className = 'binary-column';
        col.style.left = `${(i / 25) * 100}%`;
        col.style.animationDuration = `${14 + Math.random() * 10}s`;
        col.style.animationDelay = `${Math.random() * 5}s`;
        let txt = '';
        for (let j = 0; j < 40; j++) txt += (Math.random() > 0.5 ? '1' : '0') + '<br>';
        col.innerHTML = txt;
        container.appendChild(col);
    }
}

// ============================================
// TOAST
// ============================================
function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${msg}`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2700);
}

// ============================================
// CHANGE SECTION
// ============================================
function changeSection(sectionNum) {
    if (!sectionNum) return;

    // Hide welcome, show skeleton
    document.getElementById('welcomeState').classList.add('hidden');
    document.getElementById('sectionView').classList.add('hidden');
    document.getElementById('groupView').classList.add('hidden');
    document.getElementById('skeletonLoader').classList.remove('hidden');

    // Reset button states
    document.getElementById('groupABtn').classList.remove('hidden');
    document.getElementById('groupBBtn').classList.remove('hidden');
    document.getElementById('downloadBtn').classList.remove('hidden');
    document.getElementById('pdfBtn').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');

    setTimeout(() => {
        currentSection = String(sectionNum);
        isGroupView = false;
        currentGroup = null;

        document.getElementById('skeletonLoader').classList.add('hidden');
        document.getElementById('sectionView').classList.remove('hidden');

        const section = allSections[currentSection];
        if (!section) {
            showToast('Section not found!', 'error');
            return;
        }
        const name = currentSection === '17' ? 'My Section ✏️' : `Section ${currentSection}`;
        renderSectionTable(section.data, name);

        document.getElementById('sectionSelectMain').value = currentSection;
        showToast(`${name} loaded`, 'success');
    }, 350);
}

// ============================================
// RENDER SECTION TABLE
// ============================================
function renderSectionTable(data, displayName) {
    document.getElementById('tableTitle').textContent = displayName;

    // Check for saved edit
    const saved = localStorage.getItem(`edit-${currentSection}`);
    if (saved) {
        document.getElementById('captureArea').innerHTML = saved;
        return;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    const body = document.getElementById('tableBody');
    body.innerHTML = '';

    days.forEach((day, di) => {
        const tr = document.createElement('tr');
        tr.className = 'day-row';
        tr.style.animationDelay = `${di * 0.06}s`;

        // Day label
        const tdDay = document.createElement('td');
        tdDay.className = 'day-label';
        tdDay.textContent = day.slice(0, 3).toUpperCase();
        tr.appendChild(tdDay);

        periods.forEach((p, pi) => {
            // Insert break column after period index 1 (after 3-4)
            if (pi === 2) {
                const tdBreak = document.createElement('td');
                tdBreak.innerHTML = `<div class="break-cell"><div class="break-line"></div><span class="break-icon">☕</span><span class="break-text">BREAK</span><div class="break-line"></div></div>`;
                tr.appendChild(tdBreak);
            }

            const cell = data[day] ? data[day][p] : null;
            const td = document.createElement('td');

            if (cell && cell.n) {
                const isLecture = cell.t === 'L';
                const roomHtml = cell.r ? cell.r.replace(/AI/g, '<span class="ai-highlight">AI</span>') : '';
                const div = document.createElement('div');
                div.className = isLecture ? 'lecture-card' : 'lab-card';
                div.onclick = () => showDetails(cell);
                div.innerHTML = `
                    <div class="card-subject">${cell.n}</div>
                    <div class="card-doctor">${cell.d || ''}</div>
                    <div class="room-text">${roomHtml}</div>`;
                td.appendChild(div);
            } else {
                const div = document.createElement('div');
                div.className = 'free-card';
                div.textContent = 'FREE';
                td.appendChild(div);
            }

            tr.appendChild(td);
        });

        body.appendChild(tr);
    });
}

// ============================================
// SHOW DETAILS
// ============================================
function showDetails(cell) {
    if (isEditing) return;
    showToast(`${cell.n} — ${cell.d || ''} — ${cell.r || ''}`, 'info');
}

// ============================================
// GROUP SCHEDULE
// ============================================
function showGroupSchedule(group) {
    isGroupView = true;
    currentGroup = group;

    document.getElementById('welcomeState').classList.add('hidden');
    document.getElementById('sectionView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    document.getElementById('groupABtn').classList.add('hidden');
    document.getElementById('groupBBtn').classList.add('hidden');
    document.getElementById('downloadBtn').classList.add('hidden');
    document.getElementById('pdfBtn').classList.remove('hidden');
    document.getElementById('backBtn').classList.remove('hidden');
    document.getElementById('sectionSelectMain').value = '';

    renderGroupTable(group);
    showToast(`Group ${group} loaded`, 'success');
}

function renderGroupTable(group) {
    const sections = group === 'A'
        ? ['1','2','3','4','5','6','7','8']
        : ['9','10','11','12','13','14','15','16'];
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday'];
    const periods = ['1-2','3-4','5-6','7-8'];

    document.getElementById('groupTitle').textContent = `Group ${group} Schedule`;
    const tbody = document.getElementById('groupTableBody');
    tbody.innerHTML = '';

    sections.forEach((secNum, si) => {
        const sec = allSections[secNum];
        if (!sec) return;
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${si * 0.05}s`;

        const th = document.createElement('th');
        th.className = `section-header${sec.group === 'B' ? ' group-b' : ''}`;
        th.textContent = `SEC ${secNum.padStart(2,'0')}`;
        tr.appendChild(th);

        days.forEach(day => {
            const td = document.createElement('td');
            td.className = 'period-cell';

            periods.forEach(p => {
                const cell = sec.data[day] && sec.data[day][p] ? sec.data[day][p] : null;
                const info = periodInfo[p] || {};
                if (cell && cell.n) {
                    const isLab = cell.t === 'S';
                    const div = document.createElement('div');
                    div.className = `mini-card${isLab ? ' lab' : ''}`;
                    div.innerHTML = `
                        <div class="mini-time">${p} | ${info.time || ''}</div>
                        <div class="mini-subject">${cell.n}</div>
                        <div class="mini-doctor">${cell.d || ''}</div>
                        <div class="mini-room">${(cell.r||'').replace(/AI/g,'<span style="color:#00ffff">AI</span>')}</div>`;
                    td.appendChild(div);
                } else {
                    const div = document.createElement('div');
                    div.className = 'mini-free';
                    div.innerHTML = `${p}<br>FREE`;
                    td.appendChild(div);
                }
            });

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function backToSection() {
    isGroupView = false;
    if (currentSection) {
        changeSection(currentSection);
    } else {
        document.getElementById('groupView').classList.add('hidden');
        document.getElementById('welcomeState').classList.remove('hidden');
        document.getElementById('groupABtn').classList.remove('hidden');
        document.getElementById('groupBBtn').classList.remove('hidden');
        document.getElementById('downloadBtn').classList.remove('hidden');
        document.getElementById('pdfBtn').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');
    }
}

// ============================================
// EDIT MODE
// ============================================
function enableEditing() {
    isEditing = true;
    const area = document.getElementById('captureArea');
    originalContent = area.innerHTML;
    area.contentEditable = 'true';
    area.style.outline = '2px dashed rgba(0,212,255,0.4)';
    document.getElementById('editModeBtn').classList.add('hidden');
    document.getElementById('confirmBtn').classList.remove('hidden');
    document.getElementById('cancelBtn').classList.remove('hidden');
    showToast('Edit mode — click any text to edit', 'info');
}

function disableEditing(save) {
    isEditing = false;
    const area = document.getElementById('captureArea');
    area.contentEditable = 'false';
    area.style.outline = '';
    if (save) {
        localStorage.setItem(`edit-${currentSection}`, area.innerHTML);
        showToast('Changes saved ✓', 'success');
    } else {
        area.innerHTML = originalContent;
        showToast('Changes discarded', 'info');
    }
    document.getElementById('editModeBtn').classList.remove('hidden');
    document.getElementById('confirmBtn').classList.add('hidden');
    document.getElementById('cancelBtn').classList.add('hidden');
}

// ============================================
// DOWNLOAD IMAGE
// ============================================
async function downloadTable() {
    const area = document.getElementById('captureArea');
    showToast('Generating image…', 'info');
    try {
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));

        const isMobile = window.innerWidth < 768;
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        const canvas = await html2canvas(area, {
            backgroundColor: isLight ? '#f8fafc' : '#0a0f1c',
            scale: isMobile ? 1.5 : 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            width: area.scrollWidth,
            height: area.scrollHeight,
            windowWidth: area.scrollWidth + 40,
        });

        const link = document.createElement('a');
        link.download = `CS_Section${currentSection}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', isMobile ? 0.78 : 0.88);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 100);
        showToast('Image saved! 📸', 'success');
    } catch (e) {
        console.error(e);
        showToast('Download failed', 'error');
    }
}

// ============================================
// DOWNLOAD PDF (Group)
// ============================================
function downloadGroupPDF() {
    if (!window.jspdf) { showToast('PDF library not loaded', 'error'); return; }
    const { jsPDF } = window.jspdf;
    showToast('Generating PDF…', 'info');
    const el = document.getElementById('groupView');
    const clone = el.cloneNode(true);
    clone.style.cssText = 'position:fixed;top:-9999px;left:0;width:1400px;background:#0a0f1c;';
    document.body.appendChild(clone);
    html2canvas(clone, { backgroundColor: '#0a0f1c', scale: 1.5, useCORS: true, width: 1400, windowWidth: 1400 })
        .then(canvas => {
            const pdf = new jsPDF('l','mm','a4');
            const pw = 297, ph = 210;
            const ih = (canvas.height * pw) / canvas.width;
            let hl = ih, pos = 0;
            pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,pos,pw,ih);
            hl -= ph;
            while (hl > 0) { pos = hl - ih; pdf.addPage(); pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,pos,pw,ih); hl -= ph; }
            pdf.save(`CS_Group_${currentGroup}.pdf`);
            document.body.removeChild(clone);
            showToast('PDF saved!', 'success');
        }).catch(e => { document.body.removeChild(clone); showToast('PDF failed','error'); });
}

// ============================================
// ACADEMIC CALENDAR
// ============================================
function showAcademicCalendar() {
    document.getElementById('calendarModal').classList.remove('hidden');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

// Close modal on backdrop click
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) e.target.classList.add('hidden');
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
    if (document.activeElement.isContentEditable) return;

    const k = e.key;
    if (!e.shiftKey && k >= '1' && k <= '9') { changeSection(k); return; }
    if (e.shiftKey && k >= '1' && k <= '7') { changeSection(String(parseInt(k) + 9)); return; }
    if (e.shiftKey && k === '8') { changeSection('17'); return; } // Shift+8 → Section 17

    switch (k.toLowerCase()) {
        case 'a': showGroupSchedule('A'); break;
        case 'b': showGroupSchedule('B'); break;
        case 'c': showAcademicCalendar(); break;
        case 't': toggleTheme(); break;
        case 'escape':
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            break;
    }
});

// ============================================
// PWA INSTALL BANNER
// ============================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (!localStorage.getItem('pwa-dismissed')) {
        setTimeout(showInstallBanner, 3000);
    }
});

function showInstallBanner() {
    if (!deferredPrompt || document.getElementById('installBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.className = 'install-banner';
    banner.innerHTML = `
        <span style="font-size:1.5rem;">📲</span>
        <div style="flex:1;">
            <div class="install-title">Install CS Schedule</div>
            <div class="install-sub">Works offline anytime</div>
        </div>
        <button onclick="installPWA()" class="install-btn">Install</button>
        <button onclick="dismissInstall()" class="install-close">✕</button>`;
    document.body.appendChild(banner);
}

async function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') showToast('App installed! 🎉', 'success');
    deferredPrompt = null;
    dismissInstall();
}

function dismissInstall() {
    localStorage.setItem('pwa-dismissed', '1');
    const b = document.getElementById('installBanner');
    if (b) b.remove();
}

window.addEventListener('appinstalled', () => {
    showToast('CS Schedule installed! 🎓', 'success');
    dismissInstall();
});

// Online/Offline
window.addEventListener('online', () => showToast('Back online ✅', 'success'));
window.addEventListener('offline', () => showToast('Offline — app still works 📴', 'info'));
