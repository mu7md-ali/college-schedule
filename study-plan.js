// Study Plan Data
let studyPlanData = null;
let currentLevel = 1;
let selectedCourse = null;

// Load Study Plan
async function loadStudyPlan() {
    try {
        const res = await fetch('study-plan.json');
        studyPlanData = await res.json();
    } catch (err) {
        console.error('Failed to load study plan:', err);
    }
}

// Show Study Plan Modal
function showStudyPlan() {
    if (!studyPlanData) {
        showToast('Loading study plan...', 'info');
        loadStudyPlan().then(() => {
            document.getElementById('studyPlanModal').classList.remove('hidden');
            renderStudyPlan(1);
        });
    } else {
        document.getElementById('studyPlanModal').classList.remove('hidden');
        renderStudyPlan(currentLevel);
    }
}

// Show Level
function showLevel(level) {
    currentLevel = level;
    // Update tabs
    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`levelBtn${i}`);
        if (btn) {
            if (i === level) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    }
    renderStudyPlan(level);
}

// Render Study Plan
function renderStudyPlan(level) {
    const content = document.getElementById('studyPlanContent');
    if (!content || !studyPlanData) return;

    const levelKey = `المستوى_${level === 1 ? 'الأول' : level === 2 ? 'الثاني' : level === 3 ? 'الثالث' : 'الرابع'}`;
    const levelData = studyPlanData[levelKey];

    if (!levelData) return;

    // Build HTML
    let html = '';
    
    // Term 1
    html += '<div class="semester-column">';
    html += '<div class="semester-title">🌙 الترم الأول</div>';
    html += '<div class="courses-container">';
    levelData.الترم_الأول.forEach(course => {
        html += renderCourseNode(course);
    });
    html += '</div></div>';

    // Term 2
    html += '<div class="semester-column">';
    html += '<div class="semester-title">☀️ الترم الثاني</div>';
    html += '<div class="courses-container">';
    levelData.الترم_الثاني.forEach(course => {
        html += renderCourseNode(course);
    });
    html += '</div></div>';

    // Add legend
    html += `
    <div class="plan-legend">
        <div class="legend-item">
            <div class="legend-color" style="border-color: #00d4ff; background: rgba(0,212,255,0.1);"></div>
            <span>Programming</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border-color: #9370db; background: rgba(147,112,219,0.1);"></div>
            <span>Math</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border-color: #32cd32; background: rgba(50,205,50,0.1);"></div>
            <span>Systems</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border-color: #ff8c00; background: rgba(255,140,0,0.1);"></div>
            <span>Hardware</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border-color: #e67e22; background: rgba(230,126,34,0.1);"></div>
            <span>Networks</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border-color: #ffd700; background: rgba(255,215,0,0.1);"></div>
            <span>AI</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="border-color: #ff69b4; background: rgba(255,105,180,0.1);"></div>
            <span>Graphics</span>
        </div>
    </div>
    `;

    content.innerHTML = html;

    // Add click handlers
    setTimeout(() => {
        document.querySelectorAll('.course-node').forEach(node => {
            node.addEventListener('click', () => selectCourse(parseInt(node.dataset.id)));
        });
    }, 100);
}

// Render Course Node
function renderCourseNode(course) {
    const prereq = course.prerequisite_id ? findCourseById(course.prerequisite_id) : null;
    const prereqText = prereq ? `📌 Requires: ${prereq.name}` : '✅ No prerequisite';
    
    return `
        <div class="course-node chain-${course.chain}" data-id="${course.id}" title="${prereqText}">
            <div class="course-name">${course.name}</div>
            <div class="course-id">ID: ${course.id}</div>
        </div>
    `;
}

// Find Course by ID
function findCourseById(id) {
    for (const level in studyPlanData) {
        for (const term in studyPlanData[level]) {
            const course = studyPlanData[level][term].find(c => c.id === id);
            if (course) return course;
        }
    }
    return null;
}

// Select Course
function selectCourse(id) {
    // Remove previous selection
    document.querySelectorAll('.course-node').forEach(n => n.classList.remove('selected'));
    
    const course = findCourseById(id);
    if (!course) return;

    selectedCourse = course;

    // Highlight selected
    document.querySelector(`[data-id="${id}"]`)?.classList.add('selected');

    // Show prerequisites chain
    const prereqs = getPrerequisiteChain(id);
    const opens = getWhatItOpens(id);

    let msg = `📚 **${course.name}**\n\n`;
    
    if (prereqs.length > 0) {
        msg += `📌 **Requires:**\n`;
        prereqs.forEach(p => {
            msg += `   → ${p.name}\n`;
        });
        msg += '\n';
    } else {
        msg += `✅ No prerequisites\n\n`;
    }

    if (opens.length > 0) {
        msg += `🔓 **Opens:**\n`;
        opens.forEach(o => {
            msg += `   → ${o.name}\n`;
        });
    }

    showToast(msg, 'info');
}

// Get Prerequisite Chain
function getPrerequisiteChain(id) {
    const chain = [];
    let current = findCourseById(id);
    
    while (current && current.prerequisite_id) {
        const prereq = findCourseById(current.prerequisite_id);
        if (prereq) {
            chain.push(prereq);
            current = prereq;
        } else {
            break;
        }
    }
    
    return chain;
}

// Get What It Opens
function getWhatItOpens(id) {
    const opens = [];
    
    for (const level in studyPlanData) {
        for (const term in studyPlanData[level]) {
            studyPlanData[level][term].forEach(course => {
                if (course.prerequisite_id === id) {
                    opens.push(course);
                }
            });
        }
    }
    
    return opens;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudyPlan();
});
