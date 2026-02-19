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
    isGroupView = true;
    currentGroup = group;
    document.getElementById('sectionView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    document.getElementById('noticeBox').classList.add('hidden');
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
// DOWNLOAD IMAGE (مصلحة بالكامل - مش مقصوصة)
// =============================================
async function downloadTable() {
    const area = document.getElementById('captureArea');
    showToast('جاري تحضير الصورة...', 'info');
    
    try {
        // إخفاء العناصر المؤقتة
        document.querySelectorAll('.ai-bot, .shortcuts-panel, .toast-container').forEach(el => {
            if (el) el.style.opacity = '0';
        });
        
        // التمرير لأعلى الصفحة
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
        
        // انتظار قليل للتمرير
        await new Promise(r => setTimeout(r, 500));
        
        // حساب الأبعاد بدقة
        const rect = area.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        const isMobile = window.innerWidth <= 768;
        const scale = isMobile ? 2 : 2.5; // زيادة الدقة
        const bgColor = document.documentElement.getAttribute('data-theme') === 'light' ? '#f0f7ff' : '#0a0f1c';

        const canvas = await html2canvas(area, {
            backgroundColor: bgColor,
            scale: scale,
            useCORS: true,
            allowTaint: false,
            logging: false,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
            x: window.scrollX,
            y: window.scrollY,
            width: area.scrollWidth,
            height: area.scrollHeight,
            onclone: (clonedDoc) => {
                // تطبيق نفس الثيم على النسخة المستنسخة
                const clonedArea = clonedDoc.getElementById('captureArea');
                if (clonedArea) {
                    clonedArea.style.transform = 'none';
                    clonedArea.style.width = `${area.scrollWidth}px`;
                }
            }
        });

        // إظهار العناصر المخفية
        document.querySelectorAll('.ai-bot, .shortcuts-panel, .toast-container').forEach(el => {
            if (el) el.style.opacity = '1';
        });

        // حفظ الصورة بجودة عالية
        const quality = 0.95;
        const filename = `CS_Section${currentSection}_${new Date().toISOString().slice(0,10)}.png`;
        
        // استخدام PNG للحصول على أفضل جودة
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('تم حفظ الصورة بنجاح! 📸', 'success');
    } catch (err) {
        console.error('Download error:', err);
        showToast('فشل حفظ الصورة، حاول مرة أخرى', 'error');
        
        // إظهار العناصر المخفية في حالة الخطأ
        document.querySelectorAll('.ai-bot, .shortcuts-panel, .toast-container').forEach(el => {
            if (el) el.style.opacity = '1';
        });
    }
}

// =============================================
// DOWNLOAD PDF
// =============================================
function downloadGroupPDF() {
    const { jsPDF } = window.jspdf;
    showToast('جاري تحضير PDF...', 'info');
    
    const element = document.getElementById('groupView');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // إنشاء نسخة للطباعة
    const clone = element.cloneNode(true);
    clone.style.cssText = 'position:fixed; top:0; left:0; width:1400px; background: var(--bg-primary); z-index: -9999;';
    document.body.appendChild(clone);
    
    // تطبيق الثيم على النسخة
    const theme = document.documentElement.getAttribute('data-theme');
    clone.setAttribute('data-theme', theme);
    
    html2canvas(clone, { 
        backgroundColor: theme === 'light' ? '#f0f7ff' : '#0a0f1c', 
        scale: 2, 
        useCORS: true, 
        allowTaint: false,
        width: 1400, 
        windowWidth: 1400,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        
        // حساب الأبعاد المناسبة
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`CS_Schedule_Group_${currentGroup}.pdf`);
        
        document.body.removeChild(clone);
        document.body.style.overflow = originalOverflow;
        showToast('تم حفظ PDF بنجاح!', 'success');
    }).catch(err => { 
        document.body.removeChild(clone);
        document.body.style.overflow = originalOverflow;
        showToast('فشل حفظ PDF', 'error'); 
        console.error(err); 
    });
}

// =============================================
// MODALS
// =============================================
function closeModal(id) { 
    document.getElementById(id).classList.add('hidden');
    
    // Reset current note slot if closing notes modal
    if (id === 'notesModal') {
        currentNoteSlot = null;
    }
}

function showAcademicCalendar() { 
    document.getElementById('calendarModal').classList.remove('hidden'); 
}

// =============================================
// NOTES
// =============================================
function openNoteModal(day, period, section) {
    currentNoteSlot = { day, period, section };
    const noteKey = `note-${section}-${day}-${period}`;
    document.getElementById('noteText').value = localStorage.getItem(noteKey) || '';
    document.getElementById('notesModal').classList.remove('hidden');
}

function saveNote() {
    if (!currentNoteSlot) return;
    
    const { section, day, period } = currentNoteSlot;
    const noteKey = `note-${section}-${day}-${period}`;
    const text = document.getElementById('noteText').value;
    
    if (text.trim()) { 
        localStorage.setItem(noteKey, text); 
        showToast('تم حفظ الملاحظة!', 'success'); 
    } else { 
        localStorage.removeItem(noteKey); 
        showToast('تم إزالة الملاحظة', 'info'); 
    }
    
    closeModal('notesModal');
    currentNoteSlot = null;
    
    // Clear saved edit HTML so notes re-render
    localStorage.removeItem(`edit-${currentSection}`);
    if (currentSection === section) renderSectionTable(allSections[currentSection].data, `Section ${currentSection}`);
}

// =============================================
// DESIGNER MODE (مصلح بالكامل)
// =============================================
let draggedSubject = null;
let designerSchedule = {};

const designerSubjects = [
    { code: "BA", name: "Business Administration 💼", type: "L", doctor: "Dr. Sameh Mohamed", room: "مدرج 1 إعلام" },
    { code: "DS", name: "Data Structure 🌳", type: "L", doctor: "Dr. Osama Shafik", room: "مدرج 5 إعلام" },
    { code: "DS_LAB", name: "Data Structure Lab 🌳", type: "S", doctor: "T.A Various", room: "Lab" },
    { code: "SA", name: "System Analysis 📊", type: "L", doctor: "Dr. Magdy Elhenawy", room: "مدرج 7 علوم حاسب" },
    { code: "SA_LAB", name: "System Analysis Lab 📊", type: "S", doctor: "T.A Various", room: "Lab" },
    { code: "WP", name: "Web Programming 🌐", type: "L", doctor: "Dr. Mohamed Mostafa", room: "مدرج 5 إعلام" },
    { code: "WP_LAB", name: "Web Programming Lab 🌐", type: "S", doctor: "T.A Various", room: "Lab" },
    { code: "CN", name: "Computer Network 🔌", type: "L", doctor: "Dr. Hesham Abo el-fotoh", room: "مدرج 5 إعلام" },
    { code: "CN_LAB", name: "Computer Network Lab 🔌", type: "S", doctor: "T.A Various", room: "Lab" },
    { code: "HR", name: "Human Rights ⚖️", type: "L", doctor: "Dr. Ahmed Noaman", room: "مدرج 5 إعلام" }
];

function openDesignerMode() {
    document.getElementById('designerModal').classList.remove('hidden');
    initDesigner();
}

function initDesigner() {
    designerSchedule = {};
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    days.forEach(day => { 
        designerSchedule[day] = {}; 
        periods.forEach(p => { 
            designerSchedule[day][p] = null; 
        }); 
    });
    
    renderSubjectCards();
    renderDesignerTable();
}

function countSubjects() {
    let lectures = 0, labs = 0;
    Object.values(designerSchedule).forEach(day => {
        Object.values(day).forEach(sub => { 
            if (sub) { 
                if (sub.type === 'L') lectures++; 
                else labs++; 
            } 
        });
    });
    return { lectures, labs };
}

function isSubjectUsedOnDay(day, code) {
    return Object.values(designerSchedule[day]).some(s => s && s.code === code);
}

function checkConflicts() {
    const conflicts = [];
    Object.entries(designerSchedule).forEach(([day, slots]) => {
        const used = new Set();
        Object.values(slots).forEach(sub => {
            if (sub) { 
                if (used.has(sub.code)) conflicts.push(`${sub.name} appears twice on ${day}`); 
                used.add(sub.code); 
            }
        });
    });
    
    const warn = document.getElementById('conflictWarning');
    const txt = document.getElementById('conflictText');
    
    if (conflicts.length > 0) { 
        warn.classList.remove('hidden'); 
        txt.innerText = conflicts.join(' | '); 
    } else { 
        warn.classList.add('hidden'); 
    }
    
    return conflicts.length === 0;
}

function updateValidation() {
    const { lectures, labs } = countSubjects();
    const isValid = lectures === 6 && labs === 4;
    
    let div = document.getElementById('designerValidation');
    if (!div) {
        div = document.createElement('div');
        div.id = 'designerValidation';
        const body = document.querySelector('#designerModal .modal-body');
        body.insertBefore(div, body.children[3]);
    }
    
    div.className = isValid ? 'designer-validation valid' : 'designer-validation';
    div.innerHTML = `<i class="fas fa-${isValid ? 'check-circle' : 'info-circle'}"></i> Lectures: ${lectures}/6 &nbsp;|&nbsp; Labs: ${labs}/4 ${isValid ? '— Ready to save! ✅' : ''}`;
    
    return isValid;
}

function renderSubjectCards() {
    const container = document.getElementById('subjectCards');
    container.innerHTML = '';
    
    designerSubjects.forEach(sub => {
        const card = document.createElement('div');
        card.className = `subject-card ${sub.type === 'L' ? 'lecture' : 'lab'}`;
        card.draggable = true;
        card.dataset.code = sub.code;
        card.innerHTML = `<div class="subject-card-name">${sub.name}</div><div class="subject-card-type">${sub.type === 'L' ? 'Lecture' : 'Lab'} — ${sub.doctor}</div>`;

        // Desktop drag
        card.addEventListener('dragstart', function(e) {
            draggedSubject = designerSubjects.find(s => s.code === this.dataset.code);
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', sub.code);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        card.addEventListener('dragend', function() { 
            this.classList.remove('dragging'); 
            draggedSubject = null;
        });

        // Mobile touch drag - محسنة
        addTouchDragSupport(card, sub);

        container.appendChild(card);
    });
}

// Touch drag support محسنة
let touchDragState = {
    active: false,
    subject: null,
    ghost: null,
    startX: 0,
    startY: 0,
    targetSlot: null
};

function addTouchDragSupport(card, sub) {
    card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        
        touchDragState.active = true;
        touchDragState.subject = sub;
        touchDragState.startX = touch.clientX;
        touchDragState.startY = touch.clientY;
        
        // Create ghost element
        touchDragState.ghost = card.cloneNode(true);
        touchDragState.ghost.className = card.className + ' touch-dragging';
        touchDragState.ghost.style.left = (touch.clientX - 100) + 'px';
        touchDragState.ghost.style.top = (touch.clientY - 30) + 'px';
        document.body.appendChild(touchDragState.ghost);
        
        // Add visual feedback
        card.style.opacity = '0.5';
    }, { passive: false });

    card.addEventListener('touchmove', function(e) {
        if (!touchDragState.active || !touchDragState.ghost) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        
        // Move ghost
        touchDragState.ghost.style.left = (touch.clientX - 100) + 'px';
        touchDragState.ghost.style.top = (touch.clientY - 30) + 'px';

        // Find drop target
        touchDragState.ghost.style.display = 'none';
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        touchDragState.ghost.style.display = '';

        // Remove previous highlights
        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));

        // Find closest drop slot
        const slot = element ? element.closest('.drop-slot') : null;
        if (slot) { 
            slot.classList.add('touch-over'); 
            touchDragState.targetSlot = slot; 
        } else { 
            touchDragState.targetSlot = null; 
        }
        
    }, { passive: false });

    card.addEventListener('touchend', function(e) {
        if (!touchDragState.active) return;
        e.preventDefault();
        
        // Clean up ghost
        if (touchDragState.ghost) {
            touchDragState.ghost.remove();
            touchDragState.ghost = null;
        }
        
        // Reset card opacity
        card.style.opacity = '1';
        
        // Remove highlights
        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));

        // Process drop if target exists
        if (touchDragState.targetSlot && touchDragState.subject) {
            const day = touchDragState.targetSlot.dataset.day;
            const period = touchDragState.targetSlot.dataset.period;
            
            if (day && period) {
                if (designerSchedule[day][period]) {
                    showToast('الخلية مشغولة! امسحها أولاً', 'error');
                } else if (isSubjectUsedOnDay(day, touchDragState.subject.code)) {
                    showToast(`المادة موجودة بالفعل في ${day}!`, 'error');
                } else {
                    designerSchedule[day][period] = touchDragState.subject;
                    renderDesignerTable();
                    if (updateValidation()) checkConflicts();
                    showToast(`تمت الإضافة إلى ${day} ${period} ✅`, 'success');
                }
            }
        }
        
        // Reset state
        touchDragState.active = false;
        touchDragState.subject = null;
        touchDragState.targetSlot = null;
        
    }, { passive: false });
    
    card.addEventListener('touchcancel', function(e) {
        // Clean up on cancel
        if (touchDragState.ghost) {
            touchDragState.ghost.remove();
            touchDragState.ghost = null;
        }
        card.style.opacity = '1';
        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));
        touchDragState.active = false;
    });
}

function renderDesignerTable() {
    const tbody = document.getElementById('designerTableBody');
    tbody.innerHTML = '';
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    
    days.forEach(day => {
        const row = document.createElement('tr');
        
        // Day cell
        const dayTd = document.createElement('td');
        dayTd.textContent = day.substring(0, 3);
        row.appendChild(dayTd);
        
        periods.forEach((period, idx) => {
            if (idx === 2) {
                const breakTd = document.createElement('td');
                breakTd.innerHTML = '<div class="break-cell"><span class="break-icon">☕</span><span class="break-text">BREAK</span></div>';
                row.appendChild(breakTd);
                return;
            }
            
            const td = document.createElement('td');
            const slot = document.createElement('div');
            slot.className = 'drop-slot';
            slot.dataset.day = day;
            slot.dataset.period = period;
            
            const sub = designerSchedule[day][period];
            if (sub) {
                slot.classList.add('occupied', sub.type === 'L' ? 'lecture' : 'lab');
                slot.innerHTML = `<div class="drop-slot-content">
                    <div class="drop-slot-subject">${sub.name}</div>
                    <span class="drop-slot-remove" onclick="removeFromSlot('${day}','${period}')">
                        <i class="fas fa-times"></i> Remove
                    </span>
                </div>`;
            } else {
                slot.innerHTML = '<span class="drop-slot-placeholder">Drop here</span>';
            }
            
            // Drag and drop events
            slot.addEventListener('dragover', function(e) { 
                e.preventDefault(); 
                e.dataTransfer.dropEffect = 'copy'; 
                this.classList.add('drag-over'); 
            });
            
            slot.addEventListener('dragleave', function() { 
                this.classList.remove('drag-over'); 
            });
            
            slot.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                if (!draggedSubject) return;
                
                const d = this.dataset.day;
                const p = this.dataset.period;
                
                if (designerSchedule[d][p]) { 
                    showToast('الخلية مشغولة! امسحها أولاً', 'error'); 
                    return; 
                }
                
                if (isSubjectUsedOnDay(d, draggedSubject.code)) { 
                    showToast(`${draggedSubject.name} موجودة بالفعل في ${d}!`, 'error'); 
                    return; 
                }
                
                designerSchedule[d][p] = draggedSubject;
                renderDesignerTable();
                if (updateValidation()) checkConflicts();
                showToast(`تمت الإضافة إلى ${d} ${p}`, 'success');
            });
            
            td.appendChild(slot);
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    updateValidation();
    checkConflicts();
}

function removeFromSlot(day, period) {
    designerSchedule[day][period] = null;
    renderDesignerTable();
    updateValidation();
    checkConflicts();
    showToast('تم إزالة المادة', 'info');
}

function clearDesignerSchedule() {
    Object.keys(designerSchedule).forEach(day => {
        Object.keys(designerSchedule[day]).forEach(p => { 
            designerSchedule[day][p] = null; 
        });
    });
    renderDesignerTable();
    showToast('تم مسح الجدول', 'info');
}

// Confirm before saving
function confirmSaveDesigner() {
    const { lectures, labs } = countSubjects();
    
    if (lectures !== 6 || labs !== 4) { 
        showToast(`يجب أن يكون بالضبط 6 محاضرات و 4 معامل. الحالي: ${lectures}L / ${labs}Lab`, 'error'); 
        return; 
    }
    
    if (!checkConflicts()) { 
        showToast('يوجد تعارض! قم بحله أولاً', 'error'); 
        return; 
    }

    // Build summary
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    let summary = '';
    
    days.forEach(day => {
        const slots = periods.map(p => designerSchedule[day][p]).filter(Boolean);
        if (slots.length) {
            summary += `<strong style="color:var(--color-lecture)">${day}:</strong> ${slots.map(s => s.name.split(' ')[0]).join(', ')}<br>`;
        }
    });

    document.getElementById('confirmSummary').innerHTML = summary || 'جدول فارغ';
    document.getElementById('designerConfirmModal').classList.remove('hidden');
}

function doSaveDesigner() {
    // عمل نسخة عميقة من الجدول
    const scheduleData = JSON.parse(JSON.stringify(designerSchedule));
    
    // حفظ في allSections
    allSections.custom = { 
        group: 'Custom', 
        data: scheduleData 
    };

    // حفظ في localStorage
    localStorage.setItem('designer-custom', JSON.stringify(scheduleData));
    
    // إضافة خيار Custom Section إذا لم يكن موجوداً
    if (!hasCustomSection) {
        ['sectionSelect', 'sectionSelectMain'].forEach(id => {
            const sel = document.getElementById(id);
            if (!sel) return;
            
            // التأكد من عدم وجود خيار مكرر
            let exists = false;
            for (let i = 0; i < sel.options.length; i++) {
                if (sel.options[i].value === 'custom') {
                    exists = true;
                    break;
                }
            }
            
            if (!exists) {
                const opt = document.createElement('option');
                opt.value = 'custom';
                opt.textContent = '🎨 My Custom Section';
                sel.appendChild(opt);
            }
        });
        hasCustomSection = true;
    }

    closeModal('designerConfirmModal');
    closeModal('designerModal');
    
    // تغيير إلى القسم المخصص
    setTimeout(() => {
        changeSection('custom');
    }, 100);
    
    showToast('تم حفظ الجدول المخصص! 🎉', 'success');
}

// Load saved designer schedule on startup
function loadSavedDesigner() {
    const saved = localStorage.getItem('designer-custom');
    if (!saved) return;
    
    try {
        const scheduleData = JSON.parse(saved);
        allSections.custom = { 
            group: 'Custom', 
            data: scheduleData 
        };
        
        // إضافة خيار Custom Section إذا لم يكن موجوداً
        if (!hasCustomSection) {
            ['sectionSelect', 'sectionSelectMain'].forEach(id => {
                const sel = document.getElementById(id);
                if (!sel) return;
                
                // التأكد من عدم وجود خيار مكرر
                let exists = false;
                for (let i = 0; i < sel.options.length; i++) {
                    if (sel.options[i].value === 'custom') {
                        exists = true;
                        break;
                    }
                }
                
                if (!exists) {
                    const opt = document.createElement('option');
                    opt.value = 'custom';
                    opt.textContent = '🎨 My Custom Section';
                    sel.appendChild(opt);
                }
            });
            hasCustomSection = true;
        }
    } catch(e) { 
        console.error('Failed to load designer:', e); 
    }
}

// =============================================



// =============================================
// KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (document.activeElement.isContentEditable) return;

    const key = e.key;

    // Ctrl+M for AI Bot
    if (e.ctrlKey && key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleAIBot();
        return;
    }

    // Sections 1–9
    if (!e.shiftKey && key >= '1' && key <= '9') { 
        changeSection(key); 
        return; 
    }

    // Sections 10–16 (Shift+1 to Shift+7)
    if (e.shiftKey && key >= '1' && key <= '7') { 
        changeSection(String(parseInt(key) + 9)); 
        return; 
    }

    switch (key.toLowerCase()) {
        case 'a': 
            if (document.getElementById('groupABtn') && !document.getElementById('groupABtn').classList.contains('hidden')) 
                showGroupSchedule('A'); 
            break;
        case 'b': 
            if (document.getElementById('groupBBtn') && !document.getElementById('groupBBtn').classList.contains('hidden')) 
                showGroupSchedule('B'); 
            break;
        case 'd': 
            openDesignerMode(); 
            break;
        case 'c': 
            showAcademicCalendar(); 
            break;
        case 't': 
            toggleTheme(); 
            break;
        case '?': {
            const panel = document.getElementById('shortcutsPanel');
            panel.classList.toggle('visible');
            break;
        }
        case 'escape': {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            document.getElementById('shortcutsPanel')?.classList.remove('visible');
            
            // Close AI bot if open
            const aiBot = document.getElementById('aiBot');
            if (!aiBot.classList.contains('collapsed')) {
                aiBot.classList.add('collapsed');
            }
            break;
        }
    }
});

// =============================================
// CLOSE MODAL ON BACKDROP CLICK
// =============================================
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
        
        // Reset current note slot if closing notes modal
        if (e.target.id === 'notesModal') {
            currentNoteSlot = null;
        }
    }
};

// =============================================
// ONLINE / OFFLINE
// =============================================
window.addEventListener('online', () => showToast('تم الاتصال بالإنترنت! ✅', 'success'));
window.addEventListener('offline', () => showToast('أنت الآن غير متصل. التطبيق لا يزال يعمل! 📴', 'info'));

// =============================================
// PWA INSTALL
// =============================================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or prompt
    setTimeout(() => {
        showToast('يمكنك تثبيت هذا التطبيق على جهازك! 📱', 'info');
    }, 5000);
});

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', savedTheme === 'dark' ? '#0a0f1c' : '#e8f0fe');
    }
});
