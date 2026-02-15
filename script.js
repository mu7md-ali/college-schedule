// ==================== البيانات ====================
let periodInfo = {};
let allSections = {};
let currentSection = "1";
let isGroupView = false;

// تحميل البيانات
async function loadData() {
    try {
        const response = await fetch('data.json');
        const json = await response.json();
        periodInfo = json.periodInfo;
        allSections = json.sections;
        showToast('تم تحميل البيانات بنجاح ✅');
        return true;
    } catch (err) {
        console.error('خطأ في تحميل البيانات:', err);
        showToast('فشل تحميل البيانات', 'error');
        return false;
    }
}

// تهيئة الخلفية
function initMatrix() {
    // مش محتاج حاجة
}

// إظهار الإشعارات
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// تبديل المساعد الذكي
function toggleAI() {
    const ai = document.getElementById('aiAssistant');
    ai.classList.toggle('collapsed');
}

// سؤال المساعد الذكي
async function askAI() {
    const input = document.getElementById('aiInput');
    const question = input.value.trim();
    if (!question) return;
    
    const messages = document.getElementById('aiMessages');
    
    // إضافة سؤال المستخدم
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `<p>${question}</p>`;
    messages.appendChild(userMsg);
    
    input.value = '';
    
    // إضافة مؤشر الكتابة
    const typing = document.createElement('div');
    typing.className = 'message bot';
    typing.id = 'typing';
    typing.innerHTML = '<p>جاري التفكير...</p>';
    messages.appendChild(typing);
    
    setTimeout(() => {
        // إزالة مؤشر الكتابة
        document.getElementById('typing')?.remove();
        
        // إضافة الرد
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.innerHTML = `<p>${getAIResponse(question)}</p>`;
        messages.appendChild(botMsg);
        
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
}

// توليد ردود المساعد
function getAIResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('السلام عليكم') || q.includes('اهلاً')) {
        return 'وعليكم السلام يا باشا! ازيك عامل ايه؟';
    }
    
    if (q.includes('قسم') && q.match(/\d+/)) {
        const num = q.match(/\d+/)[0];
        return `القسم ${num} ${num <= 8 ? 'في المجموعة A' : 'في المجموعة B'}`;
    }
    
    if (q.includes('group a') || q.includes('المجموعة أ')) {
        return 'المجموعة A: الأقسام 1، 2، 3، 4، 5، 6، 7، 8';
    }
    
    if (q.includes('group b') || q.includes('المجموعة ب')) {
        return 'المجموعة B: الأقسام 9، 10، 11، 12، 13، 14، 15، 16';
    }
    
    if (q.includes('data') || q.includes('هياكل')) {
        return 'Data Structure: د. أسامة شفيق';
    }
    
    if (q.includes('web') || q.includes('ويب')) {
        return 'Web Programming: د. محمد مصطفى';
    }
    
    if (q.includes('network') || q.includes('شبكات')) {
        return 'Computer Network: د. هشام أبو الفتوح';
    }
    
    if (q.includes('موعد') || q.includes('وقت')) {
        return 'مواعيد المحاضرات: 1-2 (9:15-10:45)، 3-4 (10:55-12:25)، 5-6 (12:45-2:10)، 7-8 (2:20-3:45)';
    }
    
    if (q.includes('شكر')) {
        return 'العفو يا باشا، تحت أمرك في أي وقت 🤍';
    }
    
    if (q.includes('مع السلامة') || q.includes('bye')) {
        return 'مع السلامة ياباشا، ربنا يوفقك 👋';
    }
    
    return 'اسألني عن الأقسام أو المواد أو المواعيد وأنا أرد عليك';
}

// تغيير القسم
function changeSection(sectionNum) {
    if (!sectionNum || !allSections[sectionNum]) {
        showToast('القسم مش موجود', 'error');
        return;
    }
    
    currentSection = sectionNum;
    isGroupView = false;
    
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('controls').classList.remove('hidden');
    document.getElementById('scheduleView').classList.remove('hidden');
    document.getElementById('groupView').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');
    
    renderSection(allSections[sectionNum].data);
    document.getElementById('sectionTitle').textContent = `Section ${sectionNum}`;
    showToast(`تم تحميل القسم ${sectionNum}`);
}

// عرض الجدول
function renderSection(data) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    const thead = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');
    
    thead.innerHTML = `
        <tr>
            <th>اليوم</th>
            <th>1-2<br><small>9:15-10:45</small></th>
            <th>3-4<br><small>10:55-12:25</small></th>
            <th>استراحة</th>
            <th>5-6<br><small>12:45-2:10</small></th>
            <th>7-8<br><small>2:20-3:45</small></th>
        </tr>
    `;
    
    tbody.innerHTML = '';
    
    days.forEach(day => {
        const row = document.createElement('tr');
        
        const dayCell = document.createElement('td');
        dayCell.textContent = day;
        row.appendChild(dayCell);
        
        periods.forEach((period, index) => {
            if (index === 2) {
                const breakCell = document.createElement('td');
                breakCell.innerHTML = '☕';
                row.appendChild(breakCell);
            }
            
            const cell = data[day]?.[period];
            const td = document.createElement('td');
            
            if (cell) {
                const isLecture = cell.t === 'L';
                td.innerHTML = `
                    <div class="${isLecture ? 'lecture-card' : 'lab-card'}" onclick="showDetails('${cell.n}', '${cell.d}', '${cell.r}')">
                        <div class="card-subject">${cell.n}</div>
                        <div class="card-doctor">${cell.d}</div>
                        <div class="room-text">${cell.r}</div>
                    </div>
                `;
            } else {
                td.innerHTML = '<div class="free-card">فاضي</div>';
            }
            
            if (index !== 2) row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
}

// عرض تفاصيل المادة
function showDetails(name, doctor, room) {
    showToast(`${name} | ${doctor} | ${room}`, 'info');
}

// عرض المجموعات
function showGroup(group) {
    isGroupView = true;
    currentGroup = group;
    
    document.getElementById('scheduleView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    document.getElementById('backBtn').classList.remove('hidden');
    
    const sections = group === 'A' ? ['1','2','3','4','5','6','7','8'] : ['9','10','11','12','13','14','15','16'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = ['1-2', '3-4', '5-6', '7-8'];
    
    let html = '<thead><tr><th>القسم</th><th>الأحد</th><th>الإثنين</th><th>الثلاثاء</th><th>الأربعاء</th><th>الخميس</th></tr></thead><tbody>';
    
    sections.forEach(secNum => {
        const sec = allSections[secNum];
        html += '<tr>';
        html += `<th>SEC ${secNum}</th>`;
        
        days.forEach(day => {
            html += '<td>';
            periods.forEach(period => {
                const cell = sec.data[day]?.[period];
                if (cell) {
                    html += `
                        <div class="mini-card" onclick="showDetails('${cell.n}', '${cell.d}', '${cell.r}')">
                            ${cell.n}<br><small>${cell.d}</small>
                        </div>
                    `;
                } else {
                    html += '<div class="mini-free">فاضي</div>';
                }
            });
            html += '</td>';
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    document.getElementById('groupTable').innerHTML = html;
    document.getElementById('groupTitle').textContent = `المجموعة ${group}`;
}

// رجوع
function backToSection() {
    changeSection(currentSection);
}

// حفظ الصورة
async function downloadTable() {
    const area = document.getElementById('tableWrapper');
    
    try {
        const canvas = await html2canvas(area, {
            scale: 2,
            backgroundColor: '#0a0f1c'
        });
        
        const link = document.createElement('a');
        link.download = `section_${currentSection}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('تم حفظ الصورة ✅');
    } catch (err) {
        showToast('فشل حفظ الصورة', 'error');
    }
}
