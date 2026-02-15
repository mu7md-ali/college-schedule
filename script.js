// ==================== البيانات ====================
let periodInfo = {};
let allSections = {};
let currentSection = "1";
let isGroupView = false;
let currentGroup = null;

// مفتاح Gemini API (مجاني)
const GEMINI_API_KEY = 'AIzaSyAPxZXZk1gO1YbBd_dh1O8FEPs8O7VvQmU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// ==================== تحميل البيانات ====================
async function loadData() {
    try {
        console.log('جاري تحميل البيانات...');
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        periodInfo = json.periodInfo || {};
        allSections = json.sections || {};
        
        console.log('✅ تم تحميل البيانات بنجاح');
        console.log('الأقسام المتوفرة:', Object.keys(allSections));
        
        return true;
    } catch (err) {
        console.error('❌ فشل تحميل البيانات:', err);
        showToast('فشل تحميل البيانات. تأكد من وجود ملف data.json', 'error');
        return false;
    }
}

// ==================== خلفية 010101 ====================
function initMatrixBackground() {
    const bg = document.getElementById('matrixBg');
    if (!bg) return;
    
    // تنظيف الخلفية أولاً
    bg.innerHTML = '';
    
    // إضافة الخطوط الثابتة
    const pattern = document.createElement('div');
    pattern.className = 'matrix-pattern';
    bg.appendChild(pattern);
    
    // إضافة الحروف المتحركة
    setInterval(() => {
        if (bg.children.length < 30) {
            const span = document.createElement('span');
            span.className = 'matrix-char';
            span.textContent = Math.random() > 0.5 ? '0' : '1';
            span.style.left = Math.random() * 100 + '%';
            span.style.animationDuration = 3 + Math.random() * 7 + 's';
            span.style.fontSize = 12 + Math.floor(Math.random() * 12) + 'px';
            span.style.opacity = 0.1 + Math.random() * 0.2;
            bg.appendChild(span);
            
            setTimeout(() => {
                if (span.parentNode === bg) {
                    span.remove();
                }
            }, 10000);
        }
    }, 200);
}

// ==================== إشعارات ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    toast.innerHTML = `${icons[type] || ''} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode === container) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// ==================== تغيير القسم ====================
function changeSection(sectionNum) {
    if (!sectionNum) return;
    
    if (!allSections[sectionNum]) {
        showToast('القسم غير متوفر', 'error');
        return;
    }
    
    currentSection = sectionNum;
    isGroupView = false;
    
    // إخفاء/إظهار العناصر
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('controlsPanel').classList.remove('hidden');
    document.getElementById('scheduleView').classList.remove('hidden');
    document.getElementById('groupView').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');
    
    // تحديث الجدول
    const sectionData = allSections[sectionNum].data;
    renderSection(sectionData);
    
    // تحديث عنوان القسم
    const displayName = sectionNum === 'custom' ? '⭐ My Custom Section' : `Section ${sectionNum}`;
    document.getElementById('sectionTitle').textContent = displayName;
    
    showToast(`تم تحميل ${displayName}`, 'success');
}

// ==================== عرض الجدول ====================
function renderSection(data) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    const thead = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');
    
    if (!thead || !tbody) return;
    
    // رسم رأس الجدول
    thead.innerHTML = `
        <tr>
            <th>Day</th>
            <th>
                <div class="period-num">1-2</div>
                <div class="period-time">9:15-10:45</div>
                <div class="period-duration">90 min</div>
            </th>
            <th>
                <div class="period-num">3-4</div>
                <div class="period-time">10:55-12:25</div>
                <div class="period-duration">90 min</div>
            </th>
            <th class="break-col">
                <div class="break-icon">☕</div>
                <div class="break-text">BREAK</div>
                <div class="break-time">20 min</div>
            </th>
            <th>
                <div class="period-num">5-6</div>
                <div class="period-time">12:45-2:10</div>
                <div class="period-duration">85 min</div>
            </th>
            <th>
                <div class="period-num">7-8</div>
                <div class="period-time">2:20-3:45</div>
                <div class="period-duration">85 min</div>
            </th>
        </tr>
    `;
    
    tbody.innerHTML = '';
    
    days.forEach(day => {
        const row = document.createElement('tr');
        
        // عمود اليوم
        const dayCell = document.createElement('td');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        row.appendChild(dayCell);
        
        // فترات المحاضرات
        periods.forEach((period, index) => {
            if (index === 2) {
                // عمود الاستراحة
                const breakCell = document.createElement('td');
                breakCell.className = 'break-cell';
                breakCell.innerHTML = `
                    <div class="break-content">
                        <span class="break-icon">☕</span>
                        <span class="break-text">BREAK</span>
                    </div>
                `;
                row.appendChild(breakCell);
            }
            
            const cellData = data[day]?.[period];
            const td = document.createElement('td');
            
            if (cellData) {
                const isLecture = cellData.t === 'L';
                const noteKey = `note-${currentSection}-${day}-${period}`;
                const hasNote = localStorage.getItem(noteKey);
                
                td.className = 'schedule-cell';
                td.innerHTML = `
                    <div class="${isLecture ? 'lecture-card' : 'lab-card'}${hasNote ? ' has-note' : ''}" 
                         onclick="showDetails('${cellData.n.replace(/'/g, "\\'")}', '${cellData.d.replace(/'/g, "\\'")}', '${cellData.r.replace(/'/g, "\\'")}')">
                        <div class="card-subject">${cellData.n}</div>
                        <div class="card-doctor">${cellData.d}</div>
                        <div class="room-text">${cellData.r}</div>
                    </div>
                `;
            } else {
                td.innerHTML = `
                    <div class="free-card">
                        <span>FREE</span>
                    </div>
                `;
            }
            
            if (index !== 2) row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
}

// ==================== عرض تفاصيل المادة ====================
function showDetails(name, doctor, room) {
    showToast(`${name} | ${doctor} | ${room}`, 'info');
}

// ==================== عرض المجموعات ====================
function showGroup(group) {
    isGroupView = true;
    currentGroup = group;
    
    document.getElementById('scheduleView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    document.getElementById('backBtn').classList.remove('hidden');
    document.getElementById('groupABtn').classList.add('hidden');
    document.getElementById('groupBBtn').classList.add('hidden');
    
    renderGroup(group);
    showToast(`Group ${group}`, 'success');
}

function renderGroup(group) {
    const sections = group === 'A' ? ['1','2','3','4','5','6','7','8'] : ['9','10','11','12','13','14','15','16'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    const table = document.getElementById('groupTable');
    
    if (!table) return;
    
    let html = '<thead><tr><th>SECTION</th>';
    days.forEach(day => {
        html += `<th>${day.substring(0,3)}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    sections.forEach(secNum => {
        const sec = allSections[secNum];
        if (!sec) return;
        
        html += '<tr>';
        html += `<th class="section-header ${sec.group === 'B' ? 'group-b' : ''}">SEC ${secNum.padStart(2, '0')}</th>`;
        
        days.forEach(day => {
            html += '<td class="group-cell">';
            periods.forEach(period => {
                const cell = sec.data[day]?.[period];
                if (cell) {
                    const isLab = cell.t === 'S';
                    html += `
                        <div class="mini-card ${isLab ? 'lab' : ''}" onclick="showDetails('${cell.n.replace(/'/g, "\\'")}', '${cell.d.replace(/'/g, "\\'")}', '${cell.r.replace(/'/g, "\\'")}')">
                            <div class="mini-time">${period}</div>
                            <div class="mini-subject">${cell.n}</div>
                            <div class="mini-doctor">${cell.d.split(' ').slice(0,2).join(' ')}</div>
                        </div>
                    `;
                } else {
                    html += `<div class="mini-free">${period}</div>`;
                }
            });
            html += '</td>';
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    table.innerHTML = html;
    document.getElementById('groupTitle').textContent = `Group ${group} Schedule`;
}

// ==================== رجوع للسكشن ====================
function backToSection() {
    isGroupView = false;
    
    document.getElementById('scheduleView').classList.remove('hidden');
    document.getElementById('groupView').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');
    document.getElementById('groupABtn').classList.remove('hidden');
    document.getElementById('groupBBtn').classList.remove('hidden');
}

// ==================== حفظ الصورة ====================
async function downloadImage() {
    const area = document.getElementById('captureArea');
    if (!area) return;
    
    showToast('جاري تحضير الصورة...', 'info');
    
    try {
        // إخفاء المساعد مؤقتاً
        const aiAssistant = document.getElementById('aiAssistant');
        const wasCollapsed = aiAssistant.classList.contains('collapsed');
        aiAssistant.classList.add('hidden');
        
        // التمرير لأعلى
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
        
        // التقاط الصورة
        const canvas = await html2canvas(area, {
            scale: 2,
            backgroundColor: '#0a0f1c',
            useCORS: true,
            allowTaint: false,
            logging: false
        });
        
        // إظهار المساعد
        aiAssistant.classList.remove('hidden');
        if (!wasCollapsed) {
            aiAssistant.classList.remove('collapsed');
        }
        
        // تحميل الصورة
        const link = document.createElement('a');
        link.download = `section_${currentSection}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('تم حفظ الصورة ✅', 'success');
    } catch (err) {
        console.error(err);
        showToast('فشل حفظ الصورة', 'error');
        document.getElementById('aiAssistant')?.classList.remove('hidden');
    }
}

// ==================== السكشن المخصص ====================
function loadCustomSection() {
    const saved = localStorage.getItem('custom-section');
    if (!saved) return;
    
    try {
        const customData = JSON.parse(saved);
        allSections.custom = {
            group: 'Custom',
            data: customData
        };
        
        // إضافة خيار للقوائم
        const selects = ['sectionSelect', 'sectionSelectMain'];
        selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            
            // التأكد من عدم وجود تكرار
            let exists = false;
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === 'custom') {
                    exists = true;
                    break;
                }
            }
            
            if (!exists) {
                const option = document.createElement('option');
                option.value = 'custom';
                option.textContent = '⭐ My Custom Section';
                select.appendChild(option);
            }
        });
    } catch (e) {
        console.log('خطأ في تحميل القسم المخصص');
    }
}

// ==================== المساعد الذكي ====================
let isAIThinking = false;

function toggleAI() {
    const ai = document.getElementById('aiAssistant');
    ai.classList.toggle('collapsed');
    
    if (!ai.classList.contains('collapsed')) {
        const messages = document.getElementById('aiMessages');
        messages.scrollTop = messages.scrollHeight;
    }
}

async function askAI() {
    const input = document.getElementById('aiQuestion');
    const question = input.value.trim();
    
    if (!question || isAIThinking) return;
    
    // عرض سؤال المستخدم
    addMessage(question, 'user');
    input.value = '';
    
    // بدء التفكير
    isAIThinking = true;
    updateAIStatus('جاري التفكير...');
    document.getElementById('aiSendBtn').disabled = true;
    
    // عرض مؤشر الكتابة
    showTypingIndicator();
    
    try {
        // استدعاء Gemini API
        const answer = await callGeminiAPI(question);
        
        // إزالة مؤشر الكتابة
        removeTypingIndicator();
        
        // عرض الإجابة
        addMessage(answer, 'bot');
    } catch (error) {
        console.error('خطأ في Gemini:', error);
        removeTypingIndicator();
        addMessage('آسف يا باشا، حصل خطأ. جرب تاني بعد شوية.', 'bot');
    } finally {
        isAIThinking = false;
        updateAIStatus('متصل • جاهز للرد');
        document.getElementById('aiSendBtn').disabled = false;
    }
}

async function callGeminiAPI(question) {
    const context = `أنت مساعد اسمك "الفهمان" لطلاب كلية الحاسبات والمعلومات في جامعة الشروق (Shorouk Academy).
    
معلومات عن الكلية:
- الأقسام: 1-8 في Group A، 9-16 في Group B
- المواد: Business Administration 💼 (د. سامح محمد), Data Structure 🌳 (د. أسامة شفيق), System Analysis 📊 (د. مجدي الهنواوي), Web Programming 🌐 (د. محمد مصطفى), Computer Network 🔌 (د. هشام أبو الفتوح), Human Rights ⚖️ (د. أحمد نعمان)
- مواعيد المحاضرات: 1-2 (9:15-10:45), 3-4 (10:55-12:25), 5-6 (12:45-2:10), 7-8 (2:20-3:45)

رد كمساعد مصري اسمه "الفهمان" رد باختصار وبالعامية المصرية وبكون لطيف ومتفائل.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${context}\n\nالسؤال: ${question}\n\nالإجابة:`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('إجابة غير صالحة');
    }
}

function addMessage(text, sender) {
    const messages = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    
    // تنسيق النص
    const formattedText = text.replace(/\n/g, '<br>');
    div.innerHTML = `<div class="message-content">${formattedText}</div>`;
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = 'message bot typing';
    div.id = 'typingIndicator';
    div.innerHTML = '<div class="message-content">الفهمان بيفكر<span class="dots">...</span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function updateAIStatus(text) {
    const status = document.getElementById('aiStatus');
    if (status) {
        status.innerHTML = `<span class="status-dot"></span><span>${text}</span>`;
    }
}

// ==================== دوال مساعدة ====================
window.changeSection = changeSection;
window.showGroup = showGroup;
window.backToSection = backToSection;
window.downloadImage = downloadImage;
window.toggleAI = toggleAI;
window.askAI = askAI;
window.showDetails = showDetails;
