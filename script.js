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
        const response = await fetch('data.json');
        const json = await response.json();
        periodInfo = json.periodInfo;
        allSections = json.sections;
        console.log('✅ تم تحميل البيانات');
        return true;
    } catch (err) {
        console.error('❌ فشل تحميل البيانات:', err);
        showToast('فشل تحميل البيانات', 'error');
        return false;
    }
}

// ==================== خلفية 010101 ====================
function initMatrixBackground() {
    const bg = document.getElementById('matrixBg');
    if (!bg) return;
    
    // حروف متحركة
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
            
            setTimeout(() => span.remove(), 10000);
        }
    }, 200);
}

// ==================== إشعارات ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ==================== تغيير القسم ====================
function changeSection(sectionNum) {
    if (!sectionNum || !allSections[sectionNum]) {
        showToast('القسم غير متوفر', 'error');
        return;
    }
    
    currentSection = sectionNum;
    isGroupView = false;
    
    document.getElementById('sectionSelector').classList.add('hidden');
    document.getElementById('controls').classList.remove('hidden');
    document.getElementById('scheduleView').classList.remove('hidden');
    document.getElementById('groupView').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');
    
    renderSection(allSections[sectionNum].data);
    showToast(`القسم ${sectionNum}`, 'success');
}

// ==================== عرض الجدول ====================
function renderSection(data) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    const thead = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');
    
    // رسم رأس الجدول
    thead.innerHTML = `
        <tr>
            <th>Day</th>
            <th>1-2<br><small>9:15-10:45</small></th>
            <th>3-4<br><small>10:55-12:25</small></th>
            <th class="break">☕ BREAK</th>
            <th>5-6<br><small>12:45-2:10</small></th>
            <th>7-8<br><small>2:20-3:45</small></th>
        </tr>
    `;
    
    tbody.innerHTML = '';
    
    days.forEach(day => {
        const row = document.createElement('tr');
        
        // يوم
        const dayCell = document.createElement('td');
        dayCell.textContent = day;
        dayCell.style.fontWeight = '600';
        row.appendChild(dayCell);
        
        // فترات
        periods.forEach((period, index) => {
            if (index === 2) {
                const breakCell = document.createElement('td');
                breakCell.innerHTML = '<div class="break-cell" style="text-align:center; padding:1rem;"><span style="font-size:1.5rem;">☕</span><br><small>BREAK</small></div>';
                row.appendChild(breakCell);
            }
            
            const cell = data[day]?.[period];
            const td = document.createElement('td');
            
            if (cell) {
                const isLecture = cell.t === 'L';
                const roomHtml = cell.r.replace(/AI/g, '<span class="ai-highlight">AI</span>');
                td.innerHTML = `
                    <div class="${isLecture ? 'lecture-card' : 'lab-card'}" onclick="showDetails('${cell.n.replace(/'/g, "\\'")}', '${cell.d.replace(/'/g, "\\'")}', '${cell.r.replace(/'/g, "\\'")}')">
                        <div class="card-subject">${cell.n}</div>
                        <div class="card-doctor">${cell.d}</div>
                        <div class="room-text">${roomHtml}</div>
                    </div>
                `;
            } else {
                td.innerHTML = '<div class="free-card">FREE</div>';
            }
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    document.getElementById('sectionTitle').textContent = `Section ${currentSection}`;
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
    
    renderGroup(group);
    showToast(`Group ${group}`, 'success');
}

function renderGroup(group) {
    const sections = group === 'A' ? ['1','2','3','4','5','6','7','8'] : ['9','10','11','12','13','14','15','16'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    
    let html = '<thead><tr><th>SECTION</th><th>SUNDAY</th><th>MONDAY</th><th>TUESDAY</th><th>WEDNESDAY</th><th>THURSDAY</th></tr></thead><tbody>';
    
    sections.forEach(secNum => {
        const sec = allSections[secNum];
        html += '<tr>';
        html += `<th>SEC ${secNum.padStart(2, '0')}</th>`;
        
        days.forEach(day => {
            html += '<td>';
            periods.forEach(period => {
                const cell = sec.data[day]?.[period];
                if (cell) {
                    const isLab = cell.t === 'S';
                    html += `
                        <div class="mini-card ${isLab ? 'lab' : ''}" onclick="showDetails('${cell.n.replace(/'/g, "\\'")}', '${cell.d.replace(/'/g, "\\'")}', '${cell.r.replace(/'/g, "\\'")}')">
                            <div class="mini-time">${period} | ${periodInfo[period]?.time || ''}</div>
                            <div class="mini-subject">${cell.n}</div>
                            <div class="mini-doctor">${cell.d}</div>
                            <div class="mini-room">${cell.r}</div>
                        </div>
                    `;
                } else {
                    html += `<div class="mini-free">${period}<br>FREE</div>`;
                }
            });
            html += '</td>';
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    document.getElementById('groupTable').innerHTML = html;
    document.getElementById('groupTitle').textContent = `Group ${group}`;
}

// ==================== رجوع ====================
function backToSection() {
    changeSection(currentSection);
}

// ==================== حفظ الصورة - جودة عالية ====================
async function downloadImage() {
    const area = document.getElementById('captureArea');
    showToast('جاري تحضير الصورة...', 'info');
    
    try {
        // التمرير لأعلى
        window.scrollTo(0, 0);
        
        // إخفاء المساعد مؤقتاً
        const aiAssistant = document.querySelector('.ai-assistant');
        const wasCollapsed = aiAssistant.classList.contains('collapsed');
        aiAssistant.classList.add('hidden');
        
        // انتظار قليل
        await new Promise(r => setTimeout(r, 300));
        
        // التقاط الصورة بجودة عالية
        const canvas = await html2canvas(area, {
            scale: 3,
            backgroundColor: '#0a0f1c',
            useCORS: true,
            allowTaint: false,
            logging: false,
            windowWidth: area.scrollWidth,
            windowHeight: area.scrollHeight
        });
        
        // إظهار المساعد تاني
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
        document.querySelector('.ai-assistant')?.classList.remove('hidden');
    }
}

// ==================== السكشن المخصص ====================
function loadCustomSection() {
    const saved = localStorage.getItem('custom-section');
    if (saved) {
        try {
            const customData = JSON.parse(saved);
            allSections.custom = {
                group: 'Custom',
                data: customData
            };
            
            // إضافة خيار للقائمة
            const selects = document.querySelectorAll('select[id^="sectionSelect"]');
            selects.forEach(select => {
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
                    option.textContent = '⭐ My Section';
                    select.appendChild(option);
                }
            });
        } catch (e) {
            console.log('خطأ في تحميل القسم المخصص');
        }
    }
}

// ==================== المساعد الذكي - الفهمان (Gemini API) ====================
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
        updateAIStatus('');
    }
}

async function callGeminiAPI(question) {
    // بناء السياق للذكاء الاصطناعي
    const context = buildAIContext();
    
    const prompt = `${context}\n\nالسؤال: ${question}\n\nرد كمساعد مصري اسمه "الفهمان" رد باختصار وبالعامية المصرية وبكون لطيف ومتفائل.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('إجابة غير صالحة');
    }
}

function buildAIContext() {
    // بناء معلومات عن الجدول
    let context = `أنت مساعد اسمك "الفهمان" لطلاب كلية الحاسبات والمعلومات في جامعة الشروق. عندك المعلومات التالية:\n\n`;
    
    // معلومات الأقسام والمجموعات
    context += `الأقسام: 1-8 في Group A، 9-16 في Group B\n\n`;
    
    // معلومات المواد
    const subjects = [
        'Business Administration 💼 (د. سامح محمد - مدرج 1 إعلام)',
        'Data Structure 🌳 (د. أسامة شفيق - مدرج 5 إعلام)',
        'System Analysis 📊 (د. مجدي الهنواوي - مدرج 7 علوم حاسب)',
        'Web Programming 🌐 (د. محمد مصطفى - مدرج 5 إعلام)',
        'Computer Network 🔌 (د. هشام أبو الفتوح - مدرج 5 إعلام)',
        'Human Rights ⚖️ (د. أحمد نعمان - مدرج 5 إعلام)'
    ];
    
    context += `المواد:\n${subjects.map(s => `- ${s}`).join('\n')}\n\n`;
    
    // مواعيد
    context += `مواعيد المحاضرات:\n`;
    context += `1-2: 9:15-10:45 (90 دقيقة)\n`;
    context += `3-4: 10:55-12:25 (90 دقيقة)\n`;
    context += `5-6: 12:45-2:10 (85 دقيقة)\n`;
    context += `7-8: 2:20-3:45 (85 دقيقة)\n\n`;
    
    return context;
}

function addMessage(text, sender) {
    const messages = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    
    // تنسيق النص (تحويل الأسطر الجديدة)
    const formattedText = text.replace(/\n/g, '<br>');
    div.innerHTML = `<p>${formattedText}</p>`;
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = 'message bot typing';
    div.id = 'typingIndicator';
    div.innerHTML = '<p>الفهمان بيفكر <span class="dots">...</span></p>';
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
        status.textContent = text;
    }
}

// ==================== تهيئة الصفحة ====================
document.addEventListener('DOMContentLoaded', async () => {
    const loaded = await loadData();
    if (loaded) {
        initMatrixBackground();
        loadCustomSection();
        
        // إضافة خيارات القسم للقائمة الرئيسية
        const mainSelect = document.getElementById('sectionSelectMain');
        if (mainSelect) {
            for (let i = 1; i <= 16; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Section ${i}`;
                mainSelect.appendChild(option);
            }
        }
    }
});
