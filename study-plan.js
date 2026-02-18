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
            renderHorizontalFlowchart();
        });
    } else {
        document.getElementById('studyPlanModal').classList.remove('hidden');
        renderHorizontalFlowchart();
    }
}

// Render Horizontal Flowchart - 4 columns side by side
function renderHorizontalFlowchart() {
    const content = document.getElementById('studyPlanContent');
    if (!content || !studyPlanData) return;

    let html = '<div class="horizontal-flowchart">';
    
    // SVG for arrows
    html += '<svg class="h-arrows" id="arrowsSvg"></svg>';
    
    // 4 Levels in one row
    html += '<div class="h-levels" id="hLevels">';
    
    html += renderHLevel('المستوى_الأول', 'Level 1', 1);
    html += renderHLevel('المستوى_الثاني', 'Level 2', 2);
    html += renderHLevel('المستوى_الثالث', 'Level 3', 3);
    html += renderHLevel('المستوى_الرابع', 'Level 4', 4);
    
    html += '</div></div>';

    // Legend
    html += `
    <div class="h-legend">
        <span class="h-legend-item"><span class="h-dot" style="background:#00d4ff;box-shadow:0 0 8px #00d4ff"></span>Prog</span>
        <span class="h-legend-item"><span class="h-dot" style="background:#9370db;box-shadow:0 0 8px #9370db"></span>Math</span>
        <span class="h-legend-item"><span class="h-dot" style="background:#32cd32;box-shadow:0 0 8px #32cd32"></span>Sys</span>
        <span class="h-legend-item"><span class="h-dot" style="background:#ff8c00;box-shadow:0 0 8px #ff8c00"></span>HW</span>
        <span class="h-legend-item"><span class="h-dot" style="background:#e67e22;box-shadow:0 0 8px #e67e22"></span>Net</span>
        <span class="h-legend-item"><span class="h-dot" style="background:#ffd700;box-shadow:0 0 8px #ffd700"></span>AI</span>
        <span class="h-legend-item"><span class="h-dot" style="background:#ff69b4;box-shadow:0 0 8px #ff69b4"></span>Gfx</span>
    </div>
    `;

    content.innerHTML = html;

    setTimeout(() => {
        drawHorizontalArrows();
        setupHInteractions();
    }, 150);
}

// Render Horizontal Level - Two rows (Term 1 top, Term 2 bottom)
function renderHLevel(levelKey, title, levelNum) {
    const levelData = studyPlanData[levelKey];
    if (!levelData) return '';

    let html = `<div class="h-level" id="level-${levelNum}">`;
    
    // Title
    html += `<div class="h-title">${title}</div>`;
    
    // Courses container
    html += `<div class="h-courses">`;
    
    // Term 1 (Top row)
    html += `<div class="h-term-row">`;
    levelData.الترم_الأول.forEach(course => {
        html += renderHCourse(course);
    });
    html += `</div>`;
    
    // Term separator line
    html += `<div class="h-term-line"></div>`;
    
    // Term 2 (Bottom row)
    html += `<div class="h-term-row">`;
    levelData.الترم_الثاني.forEach(course => {
        html += renderHCourse(course);
    });
    html += `</div>`;
    
    html += `</div></div>`;
    return html;
}

// Render Course
function renderHCourse(course) {
    return `
        <div class="h-course chain-${course.chain}" 
             id="course-${course.id}"
             data-id="${course.id}" 
             data-prereq="${course.prerequisite_id || ''}">
            ${course.name}
        </div>
    `;
}

// Find Course
function findCourse(id) {
    return allCourses.find(c => c.id === id);
}

// Draw Horizontal Arrows between levels
function drawHorizontalArrows() {
    const svg = document.getElementById('arrowsSvg');
    const container = document.getElementById('hLevels');
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
                
                // From right of source to left of target (horizontal)
                const x1 = fromRect.right - containerRect.left;
                const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
                const x2 = toRect.left - containerRect.left;
                const y2 = toRect.top + toRect.height / 2 - containerRect.top;
                
                // Curve control points
                const midX = (x1 + x2) / 2;
                
                svgContent += `
                    <path id="arr-${course.prerequisite_id}-${course.id}" 
                          class="h-arrow" 
                          d="M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}"
                          data-from="${course.prerequisite_id}"
                          data-to="${course.id}" />
                `;
            }
        }
    });
    
    svg.innerHTML = svgContent;
}

// Setup clicks
function setupHInteractions() {
    document.querySelectorAll('.h-course').forEach(node => {
        node.addEventListener('click', () => {
            lightUpHChain(parseInt(node.dataset.id));
        });
    });
}

// Light up chain
function lightUpHChain(courseId) {
    document.querySelectorAll('.h-course').forEach(n => {
        n.classList.remove('h-lit', 'h-prereq', 'h-current', 'h-next');
    });
    document.querySelectorAll('.h-arrow').forEach(a => {
        a.classList.remove('h-lit', 'h-flow');
    });

    const course = findCourse(courseId);
    if (!course) return;

    const prereqs = getPrereqChain(courseId);
    const nexts = getNextChain(courseId);

    // Prerequisites
    prereqs.forEach(c => {
        const n = document.getElementById(`course-${c.id}`);
        if (n) n.classList.add('h-lit', 'h-prereq');
    });

    // Current
    const cur = document.getElementById(`course-${courseId}`);
    if (cur) cur.classList.add('h-lit', 'h-current');

    // Next
    nexts.forEach(c => {
        const n = document.getElementById(`course-${c.id}`);
        if (n) n.classList.add('h-lit', 'h-next');
    });

    // Arrows
    document.querySelectorAll('.h-arrow').forEach(arr => {
        const from = parseInt(arr.dataset.from);
        const to = parseInt(arr.dataset.to);
        const fromNode = document.getElementById(`course-${from}`);
        const toNode = document.getElementById(`course-${to}`);
        
        if (fromNode?.classList.contains('h-lit') && toNode?.classList.contains('h-lit')) {
            arr.classList.add('h-lit', 'h-flow');
        }
    });

    showHInfo(course, prereqs, nexts);
}

function getPrereqChain(id) {
    const chain = [];
    let cur = findCourse(id);
    while (cur?.prerequisite_id) {
        const p = findCourse(cur.prerequisite_id);
        if (p && !chain.find(c => c.id === p.id)) {
            chain.unshift(p);
            cur = p;
        } else break;
    }
    return chain;
}

function getNextChain(id) {
    const chain = [];
    const queue = [id];
    const visited = new Set();
    while (queue.length) {
        const curId = queue.shift();
        if (visited.has(curId)) continue;
        visited.add(curId);
        allCourses.forEach(c => {
            if (c.prerequisite_id === curId && !visited.has(c.id)) {
                chain.push(c);
                queue.push(c.id);
            }
        });
    }
    return chain;
}

function showHInfo(course, prereqs, nexts) {
    let msg = `🎓 ${course.name}\n`;
    if (prereqs.length) msg += `📚 ${prereqs.map(p => p.name).join(' → ')}\n`;
    if (nexts.length) msg += `🚀 ${nexts.map(n => n.name).join(', ')}`;
    showToast(msg, 'info');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadStudyPlan();
});
