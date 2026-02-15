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
    const icons = { success: '<i class="fas fa-check-circle"></i>', error: '<i class="fas fa-exclamation-circle"></i>', info: '<i class="fas fa-info-circle"></i>' };
    toast.innerHTML = `${icons[type] || ''} ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// =============================================
// SECTION LOADING
// =============================================
function changeSection(sectionNum) {
    if (!sectionNum) return;
    document.getElementById('skeletonLoader').classList.remove('hidden');
    document.getElementById('controlsArea').classList.remove('hidden');

    setTimeout(() => {
        currentSection = sectionNum;
        isGroupView = false;
        currentGroup = null;

        // Hide welcome state, show schedule
        const welcome = document.getElementById('welcomeState');
        if (welcome) welcome.style.display = 'none';
        
        document.getElementById('sectionView').classList.remove('hidden');
        document.getElementById('groupView').classList.add('hidden');
        document.getElementById('skeletonLoader').classList.add('hidden');
        document.getElementById('groupABtn').classList.remove('hidden');
        document.getElementById('groupBBtn').classList.remove('hidden');
        document.getElementById('downloadBtn').classList.remove('hidden');
        document.getElementById('pdfBtn').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');

        const section = allSections[sectionNum];
        const displayName = sectionNum === '17' ? 'My Section ✏️' : `Section ${sectionNum}`;
        renderSectionTable(section.data, displayName);

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
        // Re-attach event listeners after loading saved HTML
        attachCardEvents();
        return;
    }

    days.forEach((day, index) => {
        const row = document.createElement('tr');
        row.className = 'day-row';
        row.style.animationDelay = `${index * 0.05}s`;
        row.innerHTML = `<td class="font-black text-white/50 text-[9px] sm:text-[11px] pr-1 sm:pr-4 align-middle uppercase tracking-wider whitespace-nowrap">${day}</td>`;

        periods.forEach((p, pIndex) => {
            if (pIndex === 2) {
                row.innerHTML += `<td><div class="break-cell"><div class="break-line"></div><span class="break-icon">☕</span><span class="break-text">BREAK</span><div class="break-line"></div></div></td>`;
            }
            const cell = data[day] ? data[day][p] : null;
            if (cell) {
                const roomHtml = cell.r.replace(/AI/g, '<span class="ai-highlight">AI</span>');
                const isLecture = cell.t === 'L';
                row.innerHTML += `<td><div class="${isLecture ? 'lecture-card' : 'lab-card'}" onclick="showDetails('${day}','${p}','${currentSection}')"><div class="font-black text-[8px] sm:text-[11px] mb-1 leading-tight text-white text-center">${cell.n}</div><div class="text-[6px] sm:text-[9px] font-bold text-white/60 mb-1 text-center">${cell.d}</div><div class="room-text">${roomHtml}</div></div></td>`;
            } else {
                row.innerHTML += `<td><div class="free-card" >FREE</div></td>`;
            }
        });
        body.appendChild(row);
    });
}

// =============================================
// GROUP VIEW
// =============================================
function showGroupSchedule(group) {
    isGroupView = true;
    currentGroup = group;
    document.getElementById('sectionView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    document.getElementById('controlsArea').classList.remove('hidden');
    document.getElementById('groupABtn').classList.add('hidden');
    document.getElementById('groupBBtn').classList.add('hidden');
    document.getElementById('downloadBtn').classList.add('hidden');
    document.getElementById('pdfBtn').classList.remove('hidden');
    document.getElementById('backBtn').classList.remove('hidden');
    document.getElementById('sectionSelect').value = "";
    document.getElementById('sectionSelectMain').value = "";
    renderGroupTable(group);
    showToast(`Group ${group} Schedule Loaded`, 'success');
}

function renderGroupTable(group) {
    const sections = group === 'A' ? ['1','2','3','4','5','6','7','8'] : ['9','10','11','12','13','14','15','16'];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    document.getElementById('groupTitle').innerText = `Group ${group} Schedule`;
    const tbody = document.getElementById('groupTableBody');
    tbody.innerHTML = '';
    sections.forEach((secNum, index) => {
        const sec = allSections[secNum];
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.05}s`;
        const th = document.createElement('th');
        th.className = `section-header${sec.group === 'B' ? ' group-b' : ''}`;
        th.innerText = `SEC ${secNum.padStart(2, '0')}`;
        tr.appendChild(th);
        days.forEach(day => {
            const td = document.createElement('td');
            td.className = 'period-cell';
            periods.forEach(period => {
                const cell = sec.data[day] && sec.data[day][period] ? sec.data[day][period] : null;
                const info = periodInfo[period];
                if (cell) {
                    const isLab = cell.t === 'S';
                    const miniCard = document.createElement('div');
                    miniCard.className = `mini-card${isLab ? ' lab' : ''}`;
                    miniCard.onclick = () => showDetails(day, period, secNum);
                    miniCard.innerHTML = `<div class="mini-time">${period} | ${info.time} | ${info.duration}</div><div class="mini-subject">${cell.n}</div><div class="mini-doctor">${cell.d}</div><div class="mini-room">${cell.r.replace(/AI/g, '<span style="color:#00ffff">AI</span>')}</div>`;
                    td.appendChild(miniCard);
                } else {
                    const freeDiv = document.createElement('div');
                    freeDiv.className = 'mini-free';
                    freeDiv.innerHTML = `${period} | ${info.time}<br>FREE`;
                    td.appendChild(freeDiv);
                }
            });
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function backToSection() { changeSection(currentSection); }

function showDetails(day, period, sectionNum) {
    if (isEditing) return;
    const cell = allSections[sectionNum]?.data?.[day]?.[period];
    if (cell) showToast(`${cell.n} | ${cell.d} | ${cell.r}`, 'info');
}

// =============================================
// EDIT MODE (saves to localStorage)
// =============================================
function enableEditing() {
    isEditing = true;
    const area = isGroupView ? document.getElementById('groupView') : document.getElementById('captureArea');
    originalContent = area.innerHTML;
    area.contentEditable = "true";
    document.getElementById('editModeBtn').classList.add('hidden');
    document.getElementById('confirmBtn').classList.remove('hidden');
    document.getElementById('cancelBtn').classList.remove('hidden');
    showToast('Edit Mode: Click any text to edit', 'info');
}

function disableEditing(save) {
    isEditing = false;
    const area = isGroupView ? document.getElementById('groupView') : document.getElementById('captureArea');
    if (save) {
        // Save edited HTML to localStorage
        if (!isGroupView) {
            localStorage.setItem(`edit-${currentSection}`, area.innerHTML);
        }
        showToast('Changes Saved! Will persist after refresh.', 'success');
    } else {
        area.innerHTML = originalContent;
        showToast('Changes Discarded', 'error');
    }
    area.contentEditable = "false";
    document.getElementById('editModeBtn').classList.remove('hidden');
    document.getElementById('confirmBtn').classList.add('hidden');
    document.getElementById('cancelBtn').classList.add('hidden');
}

// =============================================
// DOWNLOAD IMAGE (fixed cropping)
// =============================================
async function downloadTable() {
    const area = document.getElementById('captureArea');
    showToast('Generating image...', 'info');
    try {
        // Scroll to top first to avoid cropping
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 200));

        const canvas = await html2canvas(area, {
            backgroundColor: document.documentElement.getAttribute('data-theme') === 'light' ? '#e8f0fe' : '#0a0f1c',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: area.scrollWidth,
            width: area.scrollWidth,
            height: area.scrollHeight
        });

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `CS_Section${currentSection}_${date}_${time}.jpg`;

        if ('showSaveFilePicker' in window) {
            try {
                const handle = await showSaveFilePicker({ suggestedName: filename, types: [{ description: 'JPEG Image', accept: { 'image/jpeg': ['.jpg'] } }] });
                const writable = await handle.createWritable();
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                await writable.write(blob);
                await writable.close();
                showToast('Image saved!', 'success');
                return;
            } catch (e) { /* fallback */ }
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
        showToast('Image downloaded!', 'success');
    } catch (err) {
        console.error(err);
        showToast('Download failed', 'error');
    }
}

// =============================================
// DOWNLOAD PDF
// =============================================
function downloadGroupPDF() {
    const { jsPDF } = window.jspdf;
    showToast('Generating PDF...', 'info');
    const element = document.getElementById('groupView');
    const clone = element.cloneNode(true);
    clone.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1400px;';
    document.body.appendChild(clone);
    html2canvas(clone, { backgroundColor: '#0a0f1c', scale: 1.5, useCORS: true, allowTaint: true, width: 1400, windowWidth: 1400 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297, pageHeight = 210;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        let heightLeft = imgHeight, position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight); heightLeft -= pageHeight; }
        pdf.save(`CS_Schedule_Group_${currentGroup}.pdf`);
        document.body.removeChild(clone);
        showToast('PDF Downloaded!', 'success');
    }).catch(err => { document.body.removeChild(clone); showToast('PDF Failed', 'error'); console.error(err); });
}

// =============================================
// MODALS
// =============================================
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function showAcademicCalendar() { document.getElementById('calendarModal').classList.remove('hidden'); }

// =============================================
// NOTES
// =============================================


// =============================================
// TOUCH DRAG (Mobile Designer Support)
// =============================================
let touchGhost = null;
let touchDragSub = null;
let lastTouchTarget = null;

function addTouchDrag(card, sub) {
    card.addEventListener('touchstart', function(e) {
        touchDragSub = sub;
        const touch = e.touches[0];
        touchGhost = card.cloneNode(true);
        touchGhost.style.cssText = `position:fixed;left:${touch.clientX - 100}px;top:${touch.clientY - 30}px;opacity:0.7;transform:scale(1.05);z-index:9999;pointer-events:none;width:200px;box-shadow:0 10px 30px rgba(0,0,0,0.4);`;
        document.body.appendChild(touchGhost);
        e.preventDefault();
    }, { passive: false });

    card.addEventListener('touchmove', function(e) {
        if (!touchGhost) return;
        const touch = e.touches[0];
        touchGhost.style.left = (touch.clientX - 100) + 'px';
        touchGhost.style.top = (touch.clientY - 30) + 'px';
        touchGhost.style.display = 'none';
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        touchGhost.style.display = '';
        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));
        const slot = el ? el.closest('.drop-slot') : null;
        if (slot) { slot.classList.add('touch-over'); lastTouchTarget = slot; }
        else { lastTouchTarget = null; }
        e.preventDefault();
    }, { passive: false });

    card.addEventListener('touchend', function(e) {
        if (touchGhost) { touchGhost.remove(); touchGhost = null; }
        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));
        if (lastTouchTarget && touchDragSub) {
            const d = lastTouchTarget.dataset.day;
            const p = lastTouchTarget.dataset.period;
            if (!d || !p) { touchDragSub = null; lastTouchTarget = null; return; }
            showToast(`${touchDragSub.name} → ${d} ${p}`, 'info');
        }
        touchDragSub = null;
        lastTouchTarget = null;
    }, { passive: false });
}

// =============================================
// KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (document.activeElement.isContentEditable) return;

    const key = e.key;

    // Sections 1–9
    if (!e.shiftKey && key >= '1' && key <= '9') { changeSection(key); return; }

    // Sections 10–16 (Shift+1 to Shift+7)
    if (e.shiftKey && key >= '1' && key <= '7') { changeSection(String(parseInt(key) + 9)); return; }

    switch (key.toLowerCase()) {
        case 'a': if (document.getElementById('groupABtn') && !document.getElementById('groupABtn').classList.contains('hidden')) showGroupSchedule('A'); break;
        case 'b': if (document.getElementById('groupBBtn') && !document.getElementById('groupBBtn').classList.contains('hidden')) showGroupSchedule('B'); break;
        case 'c': showAcademicCalendar(); break;
        case 't': toggleTheme(); break;
        case '?': {
            const panel = document.getElementById('shortcutsPanel');
            panel.classList.toggle('visible');
            break;
        }
        case 'escape': {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            document.getElementById('shortcutsPanel')?.classList.remove('visible');
            break;
        }
    }
});

// =============================================
// CLOSE MODAL ON BACKDROP CLICK
// =============================================
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) e.target.classList.add('hidden');
};

// =============================================
// ONLINE / OFFLINE
// =============================================
window.addEventListener('online', () => showToast('Back online! ✅', 'success'));
window.addEventListener('offline', () => showToast('You are offline. App still works! 📴', 'info'));

// =============================================
// PWA INSTALL
// =============================================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

// =============================================
// ATTACH CARD EVENTS (after loading saved HTML)
// =============================================
function attachCardEvents() {
    // Re-bind click events on cards if needed after innerHTML restore
    document.querySelectorAll('.lecture-card, .lab-card').forEach(card => {
        // events already inline via onclick attr, nothing needed
    });
}

// =============================================
// PWA INSTALL PROMPT
// =============================================
let deferredPrompt = null;
let installBannerShown = false;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show install banner after 3 seconds if not dismissed
    if (!localStorage.getItem('pwa-dismissed') && !installBannerShown) {
        setTimeout(showInstallBanner, 3000);
    }
});

function showInstallBanner() {
    if (installBannerShown || !deferredPrompt) return;
    installBannerShown = true;
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1px solid rgba(0,212,255,0.4);
        border-radius: 16px; padding: 14px 20px;
        display: flex; align-items: center; gap: 14px;
        z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        max-width: 90vw; animation: slideUp 0.4s ease;
    `;
    banner.innerHTML = `
        <span style="font-size:1.6rem;">📲</span>
        <div>
            <div style="font-weight:800;font-size:0.85rem;color:#f0f8ff;margin-bottom:2px;">Install CS Schedule</div>
            <div style="font-size:0.72rem;color:#94a3b8;">Use offline anytime</div>
        </div>
        <button onclick="installPWA()" style="background:linear-gradient(135deg,#00d4ff,#2563eb);color:#000;border:none;padding:8px 16px;border-radius:8px;font-weight:800;font-size:0.78rem;cursor:pointer;white-space:nowrap;">Install</button>
        <button onclick="dismissInstall()" style="background:rgba(255,255,255,0.1);color:#94a3b8;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>
    `;
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
    const banner = document.getElementById('installBanner');
    if (banner) banner.remove();
}

window.addEventListener('appinstalled', () => {
    showToast('CS Schedule installed! 🎓', 'success');
    dismissInstall();
});
