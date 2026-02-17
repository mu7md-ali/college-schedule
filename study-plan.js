// Study Plan System
let studyPlanData = null;
let allCourses = [];
let currentLitCourse = null;

// Load Study Plan
async function loadStudyPlan() {
    try {
        const res = await fetch('study-plan.json');
        studyPlanData = await res.json();
        buildCoursesArray();
    } catch (err) {
        console.error('Failed to load study plan:', err);
    }
}

// Build flat courses array
function buildCoursesArray() {
    allCourses = [];
    for (const level in studyPlanData) {
        for (const term in studyPlanData[level]) {
            studyPlanData[level][term].forEach(course => {
                allCourses.push(course);
            });
        }
    }
}

// Show Study Plan Modal
function showStudyPlan() {
    if (!studyPlanData) {
        showToast('Loading study plan...', 'info');
        loadStudyPlan().then(() => {
            document.getElementById('studyPlanModal').classList.remove('hidden');
            renderFullPlan();
        });
    } else {
        document.getElementById('studyPlanModal').classList.remove('hidden');
        renderFullPlan();
    }
}

// Render Full Plan (all levels in one page)
function renderFullPlan() {
    const content = document.getElementById('studyPlanContent');
    if (!content || !studyPlanData) return;

    let html = '';

    // Level 1
    html += renderLevel('المستوى_الأول', 'Level 1 - المستوى الأول', 1);
    
    // Level 2
    html += renderLevel('المستوى_الثاني', 'Level 2 - المستوى الثاني', 2);
    
    // Level 3
    html += renderLevel('المستوى_الثالث', 'Level 3 - المستوى الثالث', 3);
    
    // Level 4
    html += renderLevel('المستوى_الرابع', 'Level 4 - المستوى الرابع', 4);

    // Legend
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
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', () => {
                lightUpChain(parseInt(card.dataset.id));
            });
        });
    }, 100);
}

// Render Single Level
function renderLevel(levelKey, levelTitle, levelNum) {
    const levelData = studyPlanData[levelKey];
    if (!levelData) return '';

    let html = `<div class="level-section" id="level-${levelNum}">`;
    html += `<div class="level-title">${levelTitle}</div>`;
    html += `<div class="level-grid">`;

    // Combine both terms in one grid
    const allLevelCourses = [
        ...levelData.الترم_الأول,
        ...levelData.الترم_الثاني
    ];

    allLevelCourses.forEach(course => {
        html += renderCourseCard(course);
    });

    html += `</div></div>`;
    return html;
}

// Render Course Card
function renderCourseCard(course) {
    const prereq = course.prerequisite_id ? findCourse(course.prerequisite_id) : null;
    const prereqText = prereq ? `📌 Requires: ${prereq.name}` : '✅ No prerequisite';
    
    return `
        <div class="course-card chain-${course.chain}" 
             data-id="${course.id}" 
             data-chain="${course.chain}"
             title="${prereqText}">
            <div class="course-name">${course.name}</div>
            <div class="course-id">ID: ${course.id}</div>
        </div>
    `;
}

// Find Course by ID
function findCourse(id) {
    return allCourses.find(c => c.id === id);
}

// Light Up Chain - Main Feature
function lightUpChain(courseId) {
    // Clear previous lighting
    document.querySelectorAll('.course-card').forEach(card => {
        card.classList.remove('lit');
    });

    const course = findCourse(courseId);
    if (!course) return;

    currentLitCourse = course;

    // Get full chain
    const chain = getFullChain(courseId);
    
    // Light up all courses in chain
    chain.forEach(c => {
        const card = document.querySelector(`[data-id="${c.id}"]`);
        if (card) {
            card.classList.add('lit');
        }
    });

    // Show info
    showChainInfo(course, chain);
}

// Get Full Chain (prerequisites + what it opens)
function getFullChain(courseId) {
    const chain = [];
    const visited = new Set();

    // Get prerequisites (backward)
    const prereqs = getPrerequisiteChain(courseId);
    chain.push(...prereqs);

    // Add current course
    const current = findCourse(courseId);
    if (current) chain.push(current);

    // Get dependents (forward)
    const dependents = getDependentChain(courseId);
    chain.push(...dependents);

    return chain;
}

// Get Prerequisite Chain (recursive backward)
function getPrerequisiteChain(courseId) {
    const chain = [];
    let current = findCourse(courseId);
    
    while (current && current.prerequisite_id) {
        const prereq = findCourse(current.prerequisite_id);
        if (prereq && !chain.find(c => c.id === prereq.id)) {
            chain.unshift(prereq); // Add to beginning
            current = prereq;
        } else {
            break;
        }
    }
    
    return chain;
}

// Get Dependent Chain (recursive forward)
function getDependentChain(courseId) {
    const chain = [];
    const toProcess = [courseId];
    const visited = new Set();

    while (toProcess.length > 0) {
        const currentId = toProcess.shift();
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        // Find all courses that depend on this one
        allCourses.forEach(course => {
            if (course.prerequisite_id === currentId && !visited.has(course.id)) {
                chain.push(course);
                toProcess.push(course.id);
            }
        });
    }

    return chain;
}

// Show Chain Info
function showChainInfo(course, chain) {
    const prereqs = chain.filter(c => isPrerequisiteOf(c.id, course.id));
    const opens = chain.filter(c => isPrerequisiteOf(course.id, c.id));

    let msg = `🎓 **${course.name}** (ID: ${course.id})\n\n`;
    
    if (prereqs.length > 0) {
        msg += `📌 **Prerequisites Chain:**\n`;
        prereqs.forEach((p, i) => {
            msg += `   ${i + 1}. ${p.name}\n`;
        });
        msg += '\n';
    } else {
        msg += `✅ No prerequisites\n\n`;
    }

    if (opens.length > 0) {
        msg += `🔓 **Opens These Courses:**\n`;
        opens.forEach((o, i) => {
            msg += `   ${i + 1}. ${o.name}\n`;
        });
    } else {
        msg += `🏁 Terminal course (doesn't unlock others)`;
    }

    showToast(msg, 'info');
}

// Check if courseA is prerequisite of courseB
function isPrerequisiteOf(courseAId, courseBId) {
    let current = findCourse(courseBId);
    while (current && current.prerequisite_id) {
        if (current.prerequisite_id === courseAId) return true;
        current = findCourse(current.prerequisite_id);
    }
    return false;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadStudyPlan();
});
