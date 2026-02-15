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

    const savedHTML = localStorage.getItem(`edit-${currentSection}`);
    if (savedHTML && !isGroupView) {
        document.getElementById('captureArea').innerHTML = savedHTML;
        return;
    }

    days.forEach((day, index) => {
        const row = document.createElement('tr');
        row.className = 'day-row';
        row.style.animationDelay = `${index * 0.05}s`;
        
        const dayCell = document.createElement('td');
        dayCell.className = 'font-black text-white/50 text-[8px] sm:text-[11px] pr-1 sm:pr-4 align-middle uppercase tracking-wider whitespace-nowrap';
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
// EDIT MODE
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
        if (!isGroupView) {
            localStorage.setItem(`edit-${currentSection}`, area.innerHTML);
        }
        showToast('Changes Saved!', 'success');
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
// DOWNLOAD IMAGE - طريقة محسنة وجودة عالية
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
        window.scrollTo(0, 0);
        
        // انتظار قليل
        await new Promise(r => setTimeout(r, 500));
        
        // حساب الأبعاد بدقة
        const rect = area.getBoundingClientRect();
        
        // استخدام scale عالي جدًا للجودة
        const scale = 3; // جودة عالية
        
        const canvas = await html2canvas(area, {
            scale: scale,
            backgroundColor: '#0a0f1c',
            useCORS: true,
            allowTaint: false,
            logging: false,
            windowWidth: area.scrollWidth,
            windowHeight: area.scrollHeight,
            onclone: (clonedDoc) => {
                const clonedArea = clonedDoc.getElementById('captureArea');
                if (clonedArea) {
                    clonedArea.style.width = `${area.scrollWidth}px`;
                }
            }
        });

        // إظهار العناصر المخفية
        document.querySelectorAll('.ai-bot, .shortcuts-panel, .toast-container').forEach(el => {
            if (el) el.style.opacity = '1';
        });

        // حفظ الصورة بصيغة PNG للجودة العالية
        const link = document.createElement('a');
        link.download = `CS_Section${currentSection}_${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('تم حفظ الصورة بنجاح! 📸', 'success');
    } catch (err) {
        console.error('Download error:', err);
        showToast('فشل حفظ الصورة، حاول مرة أخرى', 'error');
        
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
    
    const clone = element.cloneNode(true);
    clone.style.cssText = 'position:fixed; top:0; left:0; width:1400px; background: #0a0f1c; z-index: -9999;';
    document.body.appendChild(clone);
    
    html2canvas(clone, { 
        backgroundColor: '#0a0f1c', 
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
    
    localStorage.removeItem(`edit-${currentSection}`);
    if (currentSection === section) renderSectionTable(allSections[currentSection].data, `Section ${currentSection}`);
}

// =============================================
// DESIGNER MODE
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

        addTouchDragSupport(card, sub);
        container.appendChild(card);
    });
}

// Touch drag support
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
        
        touchDragState.ghost = card.cloneNode(true);
        touchDragState.ghost.className = card.className + ' touch-dragging';
        touchDragState.ghost.style.left = (touch.clientX - 100) + 'px';
        touchDragState.ghost.style.top = (touch.clientY - 30) + 'px';
        document.body.appendChild(touchDragState.ghost);
        
        card.style.opacity = '0.5';
    }, { passive: false });

    card.addEventListener('touchmove', function(e) {
        if (!touchDragState.active || !touchDragState.ghost) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        
        touchDragState.ghost.style.left = (touch.clientX - 100) + 'px';
        touchDragState.ghost.style.top = (touch.clientY - 30) + 'px';

        touchDragState.ghost.style.display = 'none';
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        touchDragState.ghost.style.display = '';

        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));

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
        
        if (touchDragState.ghost) {
            touchDragState.ghost.remove();
            touchDragState.ghost = null;
        }
        
        card.style.opacity = '1';
        
        document.querySelectorAll('.drop-slot.touch-over').forEach(s => s.classList.remove('touch-over'));

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
        
        touchDragState.active = false;
        touchDragState.subject = null;
        touchDragState.targetSlot = null;
        
    }, { passive: false });
    
    card.addEventListener('touchcancel', function(e) {
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
    const scheduleData = JSON.parse(JSON.stringify(designerSchedule));
    
    allSections.custom = { 
        group: 'Custom', 
        data: scheduleData 
    };

    localStorage.setItem('designer-custom', JSON.stringify(scheduleData));
    
    if (!hasCustomSection) {
        ['sectionSelect', 'sectionSelectMain'].forEach(id => {
            const sel = document.getElementById(id);
            if (!sel) return;
            
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
    
    setTimeout(() => {
        changeSection('custom');
    }, 100);
    
    showToast('تم حفظ الجدول المخصص! 🎉', 'success');
}

function loadSavedDesigner() {
    const saved = localStorage.getItem('designer-custom');
    if (!saved) return;
    
    try {
        const scheduleData = JSON.parse(saved);
        allSections.custom = { 
            group: 'Custom', 
            data: scheduleData 
        };
        
        if (!hasCustomSection) {
            ['sectionSelect', 'sectionSelectMain'].forEach(id => {
                const sel = document.getElementById(id);
                if (!sel) return;
                
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
// AI ASSISTANT - الفهمان لمساعدة الإنسان
// =============================================
let aiMessages = [
    {
        role: 'system',
        content: `أنت مساعد اسمه "الفهمان" ومهمتك مساعدة طلاب كلية الحاسبات والمعلومات في جامعة الشروق.
        أنت مصري جداً وبترد بالعامية المصرية وبتحب تضحك وتكون لطيف مع المستخدمين.
        عندك كل المعلومات عن:
        - الأقسام من 1 لـ 16
        - المجموعة A (أقسام 1-8) والمجموعة B (أقسام 9-16)
        - المواد: Business Administration, Data Structure, System Analysis, Web Programming, Computer Network, Human Rights
        - الدكاترة والمعيدين
        - مواعيد المحاضرات
        - التقويم الدراسي
        
        ردودك تكون قصيرة ومفيدة ومتفائلة. استخدم العامية المصرية.`
    }
];

function toggleAIBot() {
    const bot = document.getElementById('aiBot');
    bot.classList.toggle('collapsed');
    
    if (!bot.classList.contains('collapsed')) {
        const messages = document.getElementById('aiMessages');
        messages.scrollTop = messages.scrollHeight;
    }
}

function askAI() {
    const input = document.getElementById('aiInput');
    const question = input.value.trim();
    
    if (!question) return;
    
    addAIMessage(question, 'user');
    input.value = '';
    
    showAITyping();
    
    setTimeout(() => {
        removeAITyping();
        const answer = generateAIResponse(question);
        addAIMessage(answer, 'bot');
    }, 1000);
}

function addAIMessage(text, sender) {
    const messages = document.getElementById('aiMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${text}</p>`;
    
    messageDiv.appendChild(content);
    messages.appendChild(messageDiv);
    
    messages.scrollTop = messages.scrollHeight;
}

function showAITyping() {
    const messages = document.getElementById('aiMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message bot typing-indicator';
    typingDiv.id = 'aiTyping';
    typingDiv.innerHTML = '<div class="message-content"><p>الفهمان بيفكر<span class="dots">...</span></p></div>';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

function removeAITyping() {
    const typing = document.getElementById('aiTyping');
    if (typing) typing.remove();
}

function generateAIResponse(question) {
    const q = question.toLowerCase();
    
    // تحيات
    if (q.includes('السلام عليكم') || q.includes('اهلاً') || q.includes('hello') || q.includes('hi')) {
        return "وعليكم السلام يا باشا! 🌟 أنا الفهمان، تحت أمرك. عايز تعرف حاجة عن الجدول ولا المواد ولا الأقسام؟";
    }
    
    if (q.includes('صباح') || q.includes('مساء')) {
        return "صباح/مساء النور والفل يا صديقي! ☀️ عامل إيه النهاردة؟";
    }
    
    if (q.includes('كيف حالك') || q.includes('عامل ايه')) {
        return "الحمد لله تمام يا عم، وانت عامل إيه؟ مستعد للمذاكرة ولا لسه؟ 😄";
    }
    
    // الأقسام
    if (q.includes('قسم') && q.match(/\d+/)) {
        const match = q.match(/\d+/);
        const secNum = match[0];
        if (allSections[secNum]) {
            return `القسم ${secNum} موجود طبعاً! ده من ${parseInt(secNum) <= 8 ? 'المجموعة A' : 'المجموعة B'}. عايز تعرف حاجة معينة فيه؟`;
        } else {
            return `معلهش يا صاحبي، القسم ${secNum} مش موجود. الأقسام عندنا من 1 لـ 16 بس.`;
        }
    }
    
    if (q.includes('group a') || q.includes('المجموعة أ')) {
        return "المجموعة A ياعم الحاج! الأقسام: 1, 2, 3, 4, 5, 6, 7, 8. ناس شطار 😎";
    }
    
    if (q.includes('group b') || q.includes('المجموعة ب')) {
        return "المجموعة B يا معلم! الأقسام: 9, 10, 11, 12, 13, 14, 15, 16. ناس محترمين برضه 💪";
    }
    
    // المواد
    if (q.includes('data structure') || q.includes('هياكل')) {
        return "Data Structure أو هياكل البيانات: المحاضرات مع دكتور أسامة شفيق في مدرج 5 إعلام، والمعامل مع Asmaa Hassan و Yoser و Nadeen. مادة حلوة 😉";
    }
    
    if (q.includes('web') || q.includes('ويب')) {
        return "Web Programming برمجة ويب: المحاضرات مع دكتور محمد مصطفى في مدرج 5 إعلام، والمعامل مع Karen و Asmaa Ghoniem و Salma Ayman. هتبقا ويب ديزاينر محترف إن شاء الله! 🌐";
    }
    
    if (q.includes('network') || q.includes('شبكات')) {
        return "Computer Network أو شبكات: المحاضرات مع دكتور هشام أبو الفتوح في مدرج 5 إعلام، والمعامل مع Esraa Safwat و Rowyda و Reham و Nadeen. موضوع مهم جداً 🔌";
    }
    
    if (q.includes('system analysis') || q.includes('تحليل')) {
        return "System Analysis أو تحليل نظم: المحاضرات مع دكتور مجدي الهنواوي في مدرج 7 علوم حاسب، والمعامل مع Esraa Ezzat و Ethar و Layla و Howida. مادة الفهم والتحليل 📊";
    }
    
    if (q.includes('business') || q.includes('إدارة')) {
        return "Business Administration أو إدارة أعمال: المحاضرات مع دكتور سامح محمد في مدرج 1 إعلام. مادة مفيدة جداً للبزنس 💼";
    }
    
    if (q.includes('human rights') || q.includes('حقوق')) {
        return "Human Rights أو حقوق إنسان: المحاضرات مع دكتور أحمد نعمان في مدرج 5 إعلام. عشان نعرف حقوقنا وواجباتنا ⚖️";
    }
    
    // المواعيد
    if (q.includes('موعد') || q.includes('وقت') || q.includes('الساعة')) {
        return "أوقات المحاضرات:\n• 1-2: 9:15 صباحاً لـ 10:45 (90 دقيقة)\n• 3-4: 10:55 لـ 12:25 (90 دقيقة)\n• 5-6: 12:45 لـ 2:10 (85 دقيقة)\n• 7-8: 2:20 لـ 3:45 (85 دقيقة)\n\nالراحة 20 دقيقة بين 4 و5 ☕";
    }
    
    // التقويم
    if (q.includes('تقويم') || q.includes('امتحانات') || q.includes('calendar')) {
        return "التقويم الدراسي:\n• بداية الترم الأول: 20 سبتمبر 2025\n• امتحانات نصف الترم: 9-13 نوفمبر 2025\n• امتحانات final الترم الأول: 3-22 يناير 2026\n• إجازة نص السنة: 24 يناير - 5 فبراير 2026\n• بداية الترم الثاني: 7 فبراير 2026\n• امتحانات final الترم الثاني: 16 مايو - 18 يونيو 2026\n\nعايز تفاصيل أكتر؟";
    }
    
    // المصمم
    if (q.includes('designer') || q.includes('مصمم') || q.includes('تصميم')) {
        return "ميزة Designer Mode يا باشا! تقدر تصمم جدولك بنفسك بالسحب والإفلات. بس خلي بالك: لازم يكون 6 محاضرات بالظبط و 4 معامل بالظبط. جربها من زرار Design 🎨";
    }
    
    // الصور
    if (q.includes('صور') || q.includes('download') || q.includes('تحميل')) {
        return "تقدر تحمل الجدول كصورة من زرار Download. لو حابب الجودة العالية، استخدم PNG أحسن من JPG. الصورة هتنزل بكامل الجدول إن شاء الله 📸";
    }
    
    // المساعدة
    if (q.includes('مساعدة') || q.includes('help') || q.includes('بتعمل')) {
        return "أنا الفهمان يا معلم، أساعدك في:\n• معلومات عن الأقسام (1-16)\n• تفاصيل المواد والدكاترة\n• مواعيد المحاضرات\n• التقويم الدراسي\n• ميزة تصميم الجدول\n• تحميل الصور\n\nكلمني بالعربي أو بالإنجليزي، أنا فاهمك 😉";
    }
    
    // الشكر
    if (q.includes('شكر') || q.includes('thanks')) {
        return "العفو يا باشا، دايماً تحت أمرك! لو محتاج حاجة تانية أنا هنا 🤍";
    }
    
    // الوداع
    if (q.includes('مع السلامة') || q.includes('bye')) {
        return "مع السلامة ياصاحبي، ربنا يوفقك ويكتبلك النجاح! 👋 لو احتجت حاجة ارجعلي";
    }
    
    // أي استفسار تاني
    return "معلش يا معلم، أنا مش فهمتك أوي. جرب تسألني عن:\n- الأقسام (مثلاً: 'القسم 5')\n- المواد (مثلاً: 'web programming')\n- المواعيد (مثلاً: 'مواعيد المحاضرات')\n- التقويم الدراسي\n\nأنا معاك، اسأل براحتك! 😊";
}

// =============================================
// KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (document.activeElement.isContentEditable) return;

    const key = e.key;

    if (e.ctrlKey && key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleAIBot();
        return;
    }

    if (!e.shiftKey && key >= '1' && key <= '9') { 
        changeSection(key); 
        return; 
    }

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
        case '?': {
            const panel = document.getElementById('shortcutsPanel');
            panel.classList.toggle('visible');
            break;
        }
        case 'escape': {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            document.getElementById('shortcutsPanel')?.classList.remove('visible');
            
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
});

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    loadSavedDesigner();
    initBinaryBackground();
    
    // إزالة أي أثر للوضع النهاري
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
});
