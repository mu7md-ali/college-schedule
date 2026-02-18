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
            renderCompactFlowchart();
        });
    } else {
        document.getElementById('studyPlanModal').classList.remove('hidden');
        renderCompactFlowchart();
    }
}

// Render Compact Flowchart - All in one screen
function renderCompactFlowchart() {
    const content = document.getElementById('studyPlanContent');
    if (!content || !studyPlanData) return;

    let html = '<div class="compact-flowchart">';
    
    // SVG for arrows
    html += '<svg class="compact-arrows" id="arrowsSvg"></svg>';
    
    // All levels in one row
    html += '<div class="levels-row" id="levelsRow">';
    
    // Level 1
    html += renderCompactLevel('المستوى_الأول', 'L1', 1);
    
    // Level 2
    html += renderCompactLevel('المستوى_الثاني', 'L2', 2);
    
    // Level 3
    html += renderCompactLevel('المستوى_الثالث', 'L3', 3);
    
    // Level 4
    html += renderCompactLevel('المستوى_الرابع', 'L4', 4);
    
    html += '</div></div>';

    // Bottom legend
    html += `
    <div class="compact-legend">
        <div class="legend-dot" style="background:#00d4ff;box-shadow:0 0 10px #00d4ff"></div><span>Prog</span>
        <div class="legend-dot" style="background:#9370db;box-shadow:0 0 10px #9370db"></div><span>Math</span>
        <div class="legend-dot" style="background:#32cd32;box-shadow:0 0 10px #32cd32"></div><span>Sys</span>
        <div class="legend-dot" style="background:#ff8c00;box-shadow:0 0 10px #ff8c00"></div><span>HW</span>
        <div class="legend-dot" style="background:#e67e22;box-shadow:0 0 10px #e67e22"></div><span>Net</span>
        <div class="legend-dot" style="background:#ffd700;box-shadow:0 0 10px #ffd700"></div><span>AI</span>
        <div class="legend-dot" style="background:#ff69b4;box-shadow:0 0 10px #ff69b4"></div><span>Gfx</span>
    </div>
    `;

    content.innerHTML = html;

    setTimeout(() => {
        drawCompactArrows();
        setupCompactInteractions();
    }, 100);
}

// Render Compact Level - Horizontal layout
function renderCompactLevel(levelKey, shortTitle, levelNum) {
    const levelData = studyPlanData[levelKey];
    if (!levelData) return '';

    let html = `<div class="compact-level" id="level-${levelNum}" data-level="${levelNum}">`;
    
    // Level header
    html += `<div class="compact-level-title">${shortTitle}</div>`;
    
    // Term 1
    html += `<div class="compact-term">`;
    levelData.الترم_الأول.forEach(course => {
        html += renderCompactCourse(course);
    });
    html += `</div>`;
    
    // Term separator
    html += `<div class="compact-separator">•</div>`;
    
    // Term 2
    html += `<div class="compact-term">`;
    levelData.الترم_الثاني.forEach(course => {
        html += renderCompactCourse(course);
    });
    html += `</div>`;
    
    html += `</div>`;
    return html;
}

// Render Compact Course
function renderCompactCourse(course) {
    return `
        <div class="compact-course chain-${course.chain}" 
             id="course-${course.id}"
             data-id="${course.id}" 
             data-chain="${course.chain}"
             data-prereq="${course.prerequisite_id || ''}"
             title="${course.name}">
            ${course.name}
        </div>
    `;
}

// Find Course by ID
function findCourse(id) {
    return allCourses.find(c => c.id === id);
}

// Draw Arrows for compact layout
function drawCompactArrows() {
    const svg = document.getElementById('arrowsSvg');
    const container = document.getElementById('levelsRow');
    if (!svg || !container) return;
    
    const containerRect = container.getBoundingClientRect();
    svg.style.width = containerRect.width + 'px';
    svg.style.height = containerRect.height + 'px';
    
    let svgContent = '';
    
    allCourses.forEach(course => {
        if (course.prerequisite_id) {
            const fromNode = document.getElementById(`course-${course.prerequisite_id}`);
            const toNode = document.getElementById(`course-${course.id}`);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                
                const x1 = fromRect.right - containerRect.left;
                const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
                const x2 = toRect.left - containerRect.left;
                const y2 = toRect.top + toRect.height / 2 - containerRect.top;
                
                // Horizontal curve
                const midX = (x1 + x2) / 2;
                
                svgContent += `
                    <path id="arrow-${course.prerequisite_id}-${course.id}" 
                          class="arrow-line" 
                          d="M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}"
                          data-from="${course.prerequisite_id}"
                          data-to="${course.id}" />
                `;
            }
        }
    });
    
    svg.innerHTML = svgContent;
}

// Setup interactions
function setupCompactInteractions() {
    document.querySelectorAll('.compact-course').forEach(node => {
        node.addEventListener('click', () => {
            const courseId = parseInt(node.dataset.id);
            lightUpCompactChain(courseId);
        });
    });
}

// Light up chain
function lightUpCompactChain(courseId) {
    document.querySelectorAll('.compact-course').forEach(node => {
        node.classList.remove('lit', 'lit-prereq', 'lit-current', 'lit-next');
    });
    document.querySelectorAll('.arrow-line').forEach(path => {
        path.classList.remove('lit', 'flow');
    });

    const course = findCourse(courseId);
    if (!course) return;

    const prereqs = getPrerequisiteChain(courseId);
    const dependents = getDependentChain(courseId);

    // Prerequisites
    prereqs.forEach((c, i) => {
        const node = document.getElementById(`course-${c.id}`);
        if (node) node.classList.add('lit', 'lit-prereq');
    });

    // Current
    const currentNode = document.getElementById(`course-${courseId}`);
    if (currentNode) currentNode.classList.add('lit', 'lit-current');

    // Dependents
    dependents.forEach((c, i) => {
        const node = document.getElementById(`course-${c.id}`);
        if (node) node.classList.add('lit', 'lit-next');
    });

    // Arrows
    document.querySelectorAll('.arrow-line').forEach(arrow => {
        const from = parseInt(arrow.dataset.from);
        const to = parseInt(arrow.dataset.to);
        const fromNode = document.getElementById(`course-${from}`);
        const toNode = document.getElementById(`course-${to}`);
        
        if (fromNode?.classList.contains('lit') && toNode?.classList.contains('lit')) {
            arrow.classList.add('lit', 'flow');
        }
    });

    showCompactInfo(course, prereqs, dependents);
}

function getPrerequisiteChain(courseId) {
    const chain = [];
    let current = findCourse(courseId);
    while (current && current.prerequisite_id) {
        const prereq = findCourse(current.prerequisite_id);
        if (prereq && !chain.find(c => c.id === prereq.id)) {
            chain.unshift(prereq);
            current = prereq;
        } else break;
    }
    return chain;
}

function getDependentChain(courseId) {
    const chain = [];
    const toProcess = [courseId];
    const visited = new Set();
    while (toProcess.length > 0) {
        const currentId = toProcess.shift();
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        allCourses.forEach(course => {
            if (course.prerequisite_id === currentId && !visited.has(course.id)) {
                chain.push(course);
                toProcess.push(course.id);
            }
        });
    }
    return chain;
}

function showCompactInfo(course, prereqs, dependents) {
    let msg = `🎓 ${course.name}\n`;
    if (prereqs.length > 0) msg += `📚 Needs: ${prereqs.map(p => p.name).join(' → ')}\n`;
    if (dependents.length > 0) msg += `🚀 Unlocks: ${dependents.map(d => d.name).join(', ')}`;
    showToast(msg, 'info');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudyPlan();
});
