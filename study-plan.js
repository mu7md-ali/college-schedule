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
            renderFlowchartPlan();
        });
    } else {
        document.getElementById('studyPlanModal').classList.remove('hidden');
        renderFlowchartPlan();
    }
}

// Render Flowchart Plan
function renderFlowchartPlan() {
    const content = document.getElementById('studyPlanContent');
    if (!content || !studyPlanData) return;

    let html = '<div class="flowchart-wrapper">';
    
    // SVG layer for arrows (on top)
    html += '<svg class="arrows-svg" id="arrowsSvg"></svg>';
    
    html += '<div class="flowchart-container" id="flowchartContainer">';

    // Level 1
    html += renderFlowchartLevel('المستوى_الأول', 'Level 1', 1);
    
    // Level 2
    html += renderFlowchartLevel('المستوى_الثاني', 'Level 2', 2);
    
    // Level 3
    html += renderFlowchartLevel('المستوى_الثالث', 'Level 3', 3);
    
    // Level 4
    html += renderFlowchartLevel('المستوى_الرابع', 'Level 4', 4);
    
    html += '</div></div>';

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

    // Draw arrows after DOM is ready
    setTimeout(() => {
        drawRealArrows();
        setupCourseInteractions();
    }, 200);
}

// Render Single Level with Term Separation
function renderFlowchartLevel(levelKey, levelTitle, levelNum) {
    const levelData = studyPlanData[levelKey];
    if (!levelData) return '';

    let html = `<div class="flowchart-level" id="level-${levelNum}" data-level="${levelNum}">`;
    html += `<div class="level-title">${levelTitle}</div>`;
    
    // Term 1
    html += `<div class="term-section">`;
    html += `<div class="term-label">Term 1</div>`;
    html += `<div class="term-courses">`;
    levelData.الترم_الأول.forEach(course => {
        html += renderFlowchartCourse(course);
    });
    html += `</div></div>`;
    
    // Separator
    html += `<div class="term-separator"></div>`;
    
    // Term 2
    html += `<div class="term-section">`;
    html += `<div class="term-label">Term 2</div>`;
    html += `<div class="term-courses">`;
    levelData.الترم_الثاني.forEach(course => {
        html += renderFlowchartCourse(course);
    });
    html += `</div></div>`;
    
    html += `</div>`;
    return html;
}

// Render Course Node (without ID)
function renderFlowchartCourse(course) {
    const prereq = course.prerequisite_id ? findCourse(course.prerequisite_id) : null;
    const prereqText = prereq ? `📌 Requires: ${prereq.name}` : '✅ No prerequisite';
    
    return `
        <div class="course-node chain-${course.chain}" 
             id="course-${course.id}"
             data-id="${course.id}" 
             data-chain="${course.chain}"
             data-prereq="${course.prerequisite_id || ''}"
             title="${prereqText}">
            <div class="course-name">${course.name}</div>
            <div class="course-glow"></div>
        </div>
    `;
}

// Find Course by ID
function findCourse(id) {
    return allCourses.find(c => c.id === id);
}

// Draw REAL Arrows connecting courses
function drawRealArrows() {
    const svg = document.getElementById('arrowsSvg');
    const container = document.getElementById('flowchartContainer');
    if (!svg || !container) return;
    
    // Clear existing
    svg.innerHTML = '';
    
    // Set SVG size to match container
    const containerRect = container.getBoundingClientRect();
    svg.style.width = containerRect.width + 'px';
    svg.style.height = containerRect.height + 'px';
    
    let svgContent = '';
    const arrows = [];
    
    allCourses.forEach(course => {
        if (course.prerequisite_id) {
            const fromNode = document.getElementById(`course-${course.prerequisite_id}`);
            const toNode = document.getElementById(`course-${course.id}`);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                
                // Calculate positions relative to container
                const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
                const y1 = fromRect.bottom - containerRect.top;
                const x2 = toRect.left + toRect.width / 2 - containerRect.left;
                const y2 = toRect.top - containerRect.top;
                
                arrows.push({
                    from: course.prerequisite_id,
                    to: course.id,
                    x1, y1, x2, y2,
                    pathId: `arrow-${course.prerequisite_id}-${course.id}`
                });
            }
        }
    });
    
    // Draw arrows
    arrows.forEach(arrow => {
        const { x1, y1, x2, y2, pathId } = arrow;
        
        // Control points for smooth curve
        const c1x = x1;
        const c1y = y1 + (y2 - y1) * 0.5;
        const c2x = x2;
        const c2y = y2 - (y2 - y1) * 0.5;
        
        svgContent += `
            <path id="${pathId}" 
                  class="arrow-path" 
                  d="M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}"
                  data-from="${arrow.from}"
                  data-to="${arrow.to}" />
            <polygon class="arrow-head" 
                     points="${x2-4},${y2-8} ${x2+4},${y2-8} ${x2},${y2}"
                     data-from="${arrow.from}"
                     data-to="${arrow.to}" />
        `;
    });
    
    svg.innerHTML = svgContent;
}

// Setup click interactions
function setupCourseInteractions() {
    document.querySelectorAll('.course-node').forEach(node => {
        node.addEventListener('click', () => {
            const courseId = parseInt(node.dataset.id);
            lightUpChain(courseId);
        });
    });
}

// Light Up Chain with flowing effect
function lightUpChain(courseId) {
    // Clear previous
    document.querySelectorAll('.course-node').forEach(node => {
        node.classList.remove('lit', 'lit-prereq', 'lit-current', 'lit-next');
    });
    document.querySelectorAll('.arrow-path').forEach(path => {
        path.classList.remove('lit', 'lit-flow');
    });
    document.querySelectorAll('.arrow-head').forEach(head => {
        head.classList.remove('lit');
    });

    const course = findCourse(courseId);
    if (!course) return;
    currentLitCourse = course;

    // Get chains
    const prereqs = getPrerequisiteChain(courseId);
    const dependents = getDependentChain(courseId);

    // Light up prerequisites (ancestors)
    prereqs.forEach((c, i) => {
        const node = document.getElementById(`course-${c.id}`);
        if (node) {
            node.classList.add('lit', 'lit-prereq');
            node.style.animationDelay = `${(prereqs.length - i) * 0.1}s`;
        }
        // Light arrow from prereq to next
        const arrow = document.getElementById(`arrow-${c.id}-${course.prerequisite_id === c.id ? courseId : findNextInChain(c.id, courseId)}`);
        if (arrow) arrow.classList.add('lit', 'lit-flow');
    });

    // Light up current course
    const currentNode = document.getElementById(`course-${courseId}`);
    if (currentNode) {
        currentNode.classList.add('lit', 'lit-current');
    }

    // Light up dependents (descendants)
    dependents.forEach((c, i) => {
        const node = document.getElementById(`course-${c.id}`);
        if (node) {
            node.classList.add('lit', 'lit-next');
            node.style.animationDelay = `${i * 0.15}s`;
        }
        // Light arrows
        const arrow = document.getElementById(`arrow-${courseId}-${c.id}`) || 
                      document.getElementById(`arrow-${findPrereqFor(c.id)}-${c.id}`);
        if (arrow) arrow.classList.add('lit', 'lit-flow');
    });

    // Light all arrows in the chain
    lightChainArrows(prereqs, courseId, dependents);

    showChainInfo(course, prereqs, dependents);
}

function findNextInChain(fromId, toId) {
    // Find which course has fromId as prereq and is in path to toId
    const course = allCourses.find(c => c.prerequisite_id === fromId && isInPath(c.id, toId));
    return course ? course.id : toId;
}

function isInPath(fromId, toId) {
    // Check if fromId leads to toId
    let current = findCourse(fromId);
    const visited = new Set();
    while (current && !visited.has(current.id)) {
        visited.add(current.id);
        if (current.id === toId) return true;
        // Find next
        const next = allCourses.find(c => c.prerequisite_id === current.id);
        if (!next) break;
        current = next;
    }
    return false;
}

function findPrereqFor(courseId) {
    const course = findCourse(courseId);
    return course ? course.prerequisite_id : null;
}

function lightChainArrows(prereqs, currentId, dependents) {
    // Light arrows connecting the chain
    [...prereqs, {id: currentId}, ...dependents].forEach((course, i, arr) => {
        if (i < arr.length - 1) {
            const next = arr[i + 1];
            const arrow = document.getElementById(`arrow-${course.id}-${next.id}`);
            if (arrow) {
                arrow.classList.add('lit', 'lit-flow');
            }
        }
    });
}

// Get Prerequisite Chain (backward)
function getPrerequisiteChain(courseId) {
    const chain = [];
    let current = findCourse(courseId);
    
    while (current && current.prerequisite_id) {
        const prereq = findCourse(current.prerequisite_id);
        if (prereq && !chain.find(c => c.id === prereq.id)) {
            chain.unshift(prereq);
            current = prereq;
        } else {
            break;
        }
    }
    
    return chain;
}

// Get Dependent Chain (forward)
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

// Show Chain Info
function showChainInfo(course, prereqs, dependents) {
    let msg = `🎓 **${course.name}**\n\n`;
    
    if (prereqs.length > 0) {
        msg += `📚 **Prerequisites:**\n`;
        prereqs.forEach((p, i) => {
            msg += `   ${i + 1}. ${p.name}\n`;
        });
        msg += '\n';
    } else {
        msg += `✅ No prerequisites\n\n`;
    }

    if (dependents.length > 0) {
        msg += `🚀 **Unlocks:**\n`;
        dependents.forEach((d, i) => {
            msg += `   ${i + 1}. ${d.name}\n`;
        });
    } else {
        msg += `🏁 Terminal course`;
    }

    showToast(msg, 'info');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadStudyPlan();
});
