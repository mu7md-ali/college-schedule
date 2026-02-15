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
    } catch (err) {
        console.error('Failed to load data.json:', err);
        showToast('فشل تحميل البيانات', 'error');
    }
}

// ============================================
// STATE
// ============================================
let currentSection = "1";
let isGroupView = false;
let currentGroup = null;

// ============================================
// THEME
// ============================================
function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    showToast(next === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️', 'info');
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// ============================================
// BINARY BACKGROUND
// ============================================
function initBinaryBackground() {
    const c = document.getElementById('binary-bg');
    if (!c) return;
    c.innerHTML = '';
    for (let i = 0; i < 28; i++) {
        const col = document.createElement('div');
        col.className = 'binary-column';
        col.style.left = `${(i / 28) * 100}%`;
        col.style.animationDuration = `${14 + Math.random() * 10}s`;
        col.style.animationDelay = `-${Math.random() * 14}s`;
        let txt = '';
        for (let j = 0; j < 38; j++) txt += (Math.random() > .5 ? '1' : '0') + '<br>';
        col.innerHTML = txt;
        c.appendChild(col);
    }
}

// ============================================
// TOAST
// ============================================
function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    t.innerHTML = `<span>${icons[type]||''}</span><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}

// ============================================
// SECTION LOADING
// ============================================
function changeSection(num) {
    if (!num) return;
    if (!allSections[num]) { showToast('هذا القسم غير متوفر', 'error'); return; }

    currentSection = num;
    isGroupView = false;
    currentGroup = null;

    document.getElementById('noticeBox').classList.add('hidden');
    document.getElementById('controlsArea').classList.remove('hidden');
    document.getElementById('sectionView').classList.remove('hidden');
    document.getElementById('groupView').classList.add('hidden');
    document.getElementById('notesSection').classList.remove('hidden');

    document.getElementById('groupABtn').classList.remove('hidden');
    document.getElementById('groupBBtn').classList.remove('hidden');
    document.getElementById('downloadBtn').classList.remove('hidden');
    document.getElementById('pdfBtn').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');

    // sync selects
    ['sectionSelect','sectionSelectMain'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = num;
    });

    const sec = allSections[num];
    const displayName = num === '17' ? '✏️ Custom Schedule' : `Section ${num}`;
    renderSectionTable(sec.data, displayName);
    showToast(`${displayName} Loaded ✅`, 'success');
}

// ============================================
// RENDER SECTION TABLE
// ============================================
function renderSectionTable(data, displayName) {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
    const periods = ["1-2","3-4","5-6","7-8"];
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    document.getElementById('tableTitle').innerText = displayName;

    days.forEach((day, di) => {
        const row = document.createElement('tr');
        row.className = 'day-row';
        row.style.animationDelay = `${di * 0.06}s`;

        // Day label
        const dayTd = document.createElement('td');
        dayTd.className = 'day-lbl';
        dayTd.textContent = day;
        row.appendChild(dayTd);

        periods.forEach((p, pi) => {
            // Insert break after period index 1 (before 5-6)
            if (pi === 2) {
                const brk = document.createElement('td');
                brk.innerHTML = `<div class="brk-cell">
                    <div class="brk-line"></div>
                    <span class="brk-icon">☕</span>
                    <span class="brk-lbl">BREAK</span>
                    <div class="brk-line"></div>
                </div>`;
                row.appendChild(brk);
            }

            const cell = data[day]?.[p] ?? null;  // null for empty/section-17 slots
            const td = document.createElement('td');

            if (cell) {
                const roomHtml = (cell.r || '').replace(/AI/g, '<span class="ai-tag">AI</span>');
                const isLec = cell.t === 'L';
                td.innerHTML = `<div class="${isLec ? 'lec-card' : 'lab-card'}" onclick="showDetails('${day}','${p}','${currentSection}')">
                    <div class="card-subj">${cell.n}</div>
                    <div class="card-doc">${cell.d}</div>
                    <div class="card-room">${roomHtml}</div>
                </div>`;
            } else {
                td.innerHTML = `<div class="free-card">FREE</div>`;
            }
            row.appendChild(td);
        });
        body.appendChild(row);
    });
}

// ============================================
// GROUP VIEW
// ============================================
function showGroupSchedule(group) {
    isGroupView = true;
    currentGroup = group;

    document.getElementById('noticeBox').classList.add('hidden');
    document.getElementById('controlsArea').classList.remove('hidden');
    document.getElementById('sectionView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    document.getElementById('notesSection').classList.remove('hidden');

    document.getElementById('groupABtn').classList.add('hidden');
    document.getElementById('groupBBtn').classList.add('hidden');
    document.getElementById('downloadBtn').classList.add('hidden');
    document.getElementById('pdfBtn').classList.remove('hidden');
    document.getElementById('backBtn').classList.remove('hidden');

    ['sectionSelect','sectionSelectMain'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    renderGroupTable(group);
    showToast(`Group ${group} Loaded ✅`, 'success');
}

function renderGroupTable(group) {
    const sections = group === 'A'
        ? ['1','2','3','4','5','6','7','8']
        : ['9','10','11','12','13','14','15','16'];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
    const periods = ["1-2","3-4","5-6","7-8"];

    document.getElementById('groupTitle').innerText = `Group ${group} Schedule`;
    const tbody = document.getElementById('groupTableBody');
    tbody.innerHTML = '';

    sections.forEach((secNum, idx) => {
        const sec = allSections[secNum];
        if (!sec) return;

        const tr = document.createElement('tr');
        tr.style.animationDelay = `${idx * 0.05}s`;

        const th = document.createElement('th');
        th.className = `grp-sec-th${sec.group === 'B' ? ' gb' : ''}`;
        th.innerText = `SEC ${secNum.padStart(2,'0')}`;
        tr.appendChild(th);

        days.forEach(day => {
            const td = document.createElement('td');
            td.className = 'period-cell';
            periods.forEach(period => {
                const cell = sec.data[day]?.[period] || null;
                const info = periodInfo[period];
                if (cell) {
                    const mini = document.createElement('div');
                    mini.className = `mini-card${cell.t === 'S' ? ' lab' : ''}`;
                    mini.onclick = () => showDetails(day, period, secNum);
                    mini.innerHTML = `<div class="mini-t">${period} | ${info.time}</div>
                        <div class="mini-s">${cell.n}</div>
                        <div class="mini-d">${cell.d}</div>
                        <div class="mini-r">${(cell.r||'').replace(/AI/g,'<span style="color:#00ffff">AI</span>')}</div>`;
                    td.appendChild(mini);
                } else {
                    const fr = document.createElement('div');
                    fr.className = 'mini-free';
                    fr.innerHTML = `${period} | ${info.time}<br>FREE`;
                    td.appendChild(fr);
                }
            });
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function backToSection() { changeSection(currentSection); }

function showDetails(day, period, secNum) {
    const cell = allSections[secNum]?.data?.[day]?.[period];
    if (cell) showToast(`${cell.n} | ${cell.d} | ${cell.r}`, 'info');
}

// ============================================
// DOWNLOAD IMAGE — محسن بالكامل
// ============================================
async function downloadTable() {
    const area = document.getElementById('captureArea');
    if (!area) return;

    const btn = document.getElementById('downloadBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }
    showToast('جاري تحضير الصورة...', 'info');

    try {
        // Scroll to top to capture full area
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));

        const theme = document.documentElement.getAttribute('data-theme');
        const bgColor = theme === 'light' ? '#dbeafe' : '#080d1a';

        // Get actual rendered dimensions
        const areaRect = area.getBoundingClientRect();
        const areaWidth  = area.scrollWidth;
        const areaHeight = area.scrollHeight;
        const scale = window.devicePixelRatio >= 2 ? 2 : 2.5;

        const canvas = await html2canvas(area, {
            backgroundColor: bgColor,
            scale: scale,
            useCORS: true,
            allowTaint: false,
            logging: false,
            width: areaWidth,
            height: areaHeight,
            scrollX: 0,
            scrollY: 0,
            windowWidth: areaWidth,
            windowHeight: areaHeight,
            onclone: (cloneDoc) => {
                // make cloned element fully visible
                const el = cloneDoc.getElementById('captureArea');
                if (el) {
                    el.style.width  = areaWidth  + 'px';
                    el.style.height = 'auto';
                    el.style.overflow = 'visible';
                    el.style.transform = 'none';
                    el.style.position = 'static';
                }
            }
        });

        const filename = `CS_Section${currentSection}_${new Date().toISOString().slice(0,10)}.png`;
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('تم حفظ الصورة بنجاح! 📸', 'success');
    } catch (err) {
        console.error('Download error:', err);
        showToast('فشل حفظ الصورة، جرب تاني', 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i><span>Download</span>'; }
    }
}

// ============================================
// DOWNLOAD GROUP PDF
// ============================================
function downloadGroupPDF() {
    const { jsPDF } = window.jspdf;
    const btn = document.getElementById('pdfBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }
    showToast('جاري تحضير PDF...', 'info');

    const el = document.getElementById('groupView');
    const theme = document.documentElement.getAttribute('data-theme');
    const bgColor = theme === 'light' ? '#dbeafe' : '#080d1a';

    // Clone and fix dimensions
    const clone = el.cloneNode(true);
    clone.style.cssText = `
        position:fixed; top:0; left:0;
        width:1400px; height:auto;
        background:${bgColor};
        z-index:-9999; overflow:visible;
    `;
    document.body.appendChild(clone);

    html2canvas(clone, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: 1400,
        height: clone.scrollHeight,
        windowWidth: 1400,
        windowHeight: clone.scrollHeight,
    }).then(canvas => {
        document.body.removeChild(clone);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pgW = 297;
        const pgH = (canvas.height * pgW) / canvas.width;

        if (pgH <= 210) {
            pdf.addImage(imgData, 'PNG', 0, 0, pgW, pgH);
        } else {
            // Multi-page if too tall
            let yPos = 0;
            let remaining = pgH;
            let page = 0;
            while (remaining > 0) {
                if (page > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, -page * 210, pgW, pgH);
                remaining -= 210;
                page++;
            }
        }

        pdf.save(`CS_Group${currentGroup}_Schedule.pdf`);
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-pdf"></i><span>Save PDF</span>'; }
        showToast('تم حفظ PDF! 📄', 'success');
    }).catch(err => {
        if (document.body.contains(clone)) document.body.removeChild(clone);
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-pdf"></i><span>Save PDF</span>'; }
        showToast('فشل حفظ PDF', 'error');
        console.error(err);
    });
}

// ============================================
// MODALS
// ============================================
function closeModal(id) {
    document.getElementById(id)?.classList.add('hidden');
}

function showAcademicCalendar() {
    document.getElementById('calendarModal')?.classList.remove('hidden');
}

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) e.target.classList.add('hidden');
};

// ============================================
// FREE NOTES
// ============================================
let notesTimer = null;

function autoSaveNotes() {
    const ta = document.getElementById('freeNotesArea');
    const saved = document.getElementById('notesSaved');
    const count = document.getElementById('notesCount');

    if (count) count.textContent = `${ta.value.length} characters`;

    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
        localStorage.setItem('free-notes', ta.value);
        if (saved) {
            saved.classList.add('visible');
            setTimeout(() => saved.classList.remove('visible'), 2000);
        }
    }, 600);
}

function updateNotesCount() {
    const ta = document.getElementById('freeNotesArea');
    const count = document.getElementById('notesCount');
    if (ta && count) count.textContent = `${ta.value.length} characters`;
}

function clearAllNotes() {
    const ta = document.getElementById('freeNotesArea');
    if (!ta) return;
    if (confirm('هتمسح كل الملاحظات؟ / Clear all notes?')) {
        ta.value = '';
        localStorage.removeItem('free-notes');
        updateNotesCount();
        showToast('تم مسح الملاحظات', 'info');
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
    if (document.activeElement.isContentEditable) return;

    const k = e.key;

    // Sections 1–9
    if (!e.shiftKey && k >= '1' && k <= '9') { changeSection(k); return; }
    // Sections 10–16 (Shift+1–7)
    if (e.shiftKey && k >= '1' && k <= '7') { changeSection(String(parseInt(k)+9)); return; }

    switch (k.toLowerCase()) {
        case 'a':
            if (!document.getElementById('groupABtn')?.classList.contains('hidden')) showGroupSchedule('A');
            break;
        case 'b':
            if (!document.getElementById('groupBBtn')?.classList.contains('hidden')) showGroupSchedule('B');
            break;
        case 'c':
            showAcademicCalendar();
            break;
        case 't':
            toggleTheme();
            break;
        case 'escape':
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            break;
    }
});

// ============================================
// ONLINE / OFFLINE
// ============================================
window.addEventListener('online',  () => showToast('متصل بالإنترنت ✅', 'success'));
window.addEventListener('offline', () => showToast('غير متصل — التطبيق لا يزال يعمل 📴', 'info'));
