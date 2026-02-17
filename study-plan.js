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

// Render Flowchart Plan (like the image)
function renderFlowchartPlan() {
    const content = document.getElementById('studyPlanContent');
    if (!content || !studyPlanData) return;

    // Create SVG container for arrows
    let html = '<svg class="arrows-svg" id="arrowsSvg"></svg>';
    
    html += '<div class="flowchart-container">';
    
    // Level 1
    html += renderFlowchartLevel('المستوى_الأول', 'Level 1', 1);
    
    // Level 2
    html += renderFlowchartLevel('المستوى_الثاني', 'Level 2', 2);
    
    // Level 3
    html += renderFlowchartLevel('المستوى_الثالث', 'Level 3', 3);
    
    // Level 4
    html += renderFlowchartLevel('المستوى_الرابع', 'Level 4', 4);
    
    html += '</div>';

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
        drawArrows();
        setupCourseInteractions();
    }, 100);
}

// Render Single Level as Flowchart Row
function renderFlowchartLevel(levelKey, levelTitle, levelNum) {
    const levelData = studyPlanData[levelKey];
    if (!levelData) return '';

    let html = `<div class="flowchart-level" id="level-${levelNum}" data-level="${levelNum}">`;
    html += `<div class="level-label">${levelTitle}</div>`;
    html += `<div class="level-courses">`;

    // Combine both terms
    const allLevelCourses = [
        ...levelData.الترم_الأول,
        ...levelData.الترم_الثاني
    ];

    allLevelCourses.forEach(course => {
        html += renderFlowchartCourse(course);
    });

    html += `</div></div>`;
    return html;
}

// Render Course Node
function renderFlowchartCourse(course) {
    const prereq = course.prerequisite_id ? findCourse(course.prerequisite_id) : null;
    const prereqText = prereq ? `📌 Requires: ${prereq.name}` : '✅ No prerequisite';
    
    return `
        <div class="course-node chain-${course.chain}" 
             data-id="${course.id}" 
             data-chain="${course.chain}"
             data-prereq="${course.prerequisite_id || ''}"
             title="${prereqText}">
            <div class="course-name">${course.name}</div>
            <div class="course-id">ID: ${course.id}</div>
            <div class="course-glow"></div>
        </div>
    `;
}

// Find Course by ID
function findCourse(id) {
    return allCourses.find(c => c.id === id);
}

// Draw SVG Arrows between courses
function drawArrows() {
    const svg = document.getElementById('arrowsSvg');
    if (!svg) return;
    
    const container = document.querySelector('.flowchart-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    let svgContent = '';
    
    allCourses.forEach(course => {
        if (course.prerequisite_id) {
            const fromNode = document.querySelector(`[data-id="${course.prerequisite_id}"]`);
            const toNode = document.querySelector(`[data-id="${course.id}"]`);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                
                // Calculate positions relative to container
                const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
                const y1 = fromRect.bottom - containerRect.top;
                const x2 = toRect.left + toRect.width / 2 - containerRect.left;
                const y2 = toRect.top - containerRect.top;
                
                // Create curved path
                const midY = (y1 + y2) / 2;
                const pathId = `arrow-${course.prerequisite_id}-${course.id}`;
                
                svgContent += `
                    <path id="${pathId}" 
                          class="arrow-path" 
                          d="M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}"
                          data-from="${course.prerequisite_id}"
                          data-to="${course.id}" />
                    <circle class="arrow-head" cx="${x2}" cy="${y2}" r="3" 
                            data-from="${course.prerequisite_id}" data-to="${course.id}" />
                `;
            }
        }
    });
    
    svg.innerHTML = svgContent;
    svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
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

// Light Up Chain - Main Feature with flowing animation
function lightUpChain(courseId) {
    // Clear previous lighting
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

    // Light up prerequisites (dimmer)
    prereqs.forEach((c, i) => {
        const node = document.querySelector(`[data-id="${c.id}"]`);
        if (node) {
            node.classList.add('lit', 'lit-prereq');
            node.style.animationDelay = `${i * 0.1}s`;
        }
    });

    // Light up current course (brightest)
    const currentNode = document.querySelector(`[data-id="${courseId}"]`);
    if (currentNode) {
        currentNode.classList.add('lit', 'lit-current');
    }

    // Light up dependents (bright, different color)
    dependents.forEach((c, i) => {
        const node = document.querySelector(`[data-id="${c.id}"]`);
        if (node) {
            node.classList.add('lit', 'lit-next');
            node.style.animationDelay = `${i * 0.15}s`;
        }
    });

    // Light up arrows
    document.querySelectorAll('.arrow-path').forEach(path => {
        const from = parseInt(path.dataset.from);
        const to = parseInt(path.dataset.to);
        
        // Arrow is in chain if it connects lit nodes
        const fromNode = document.querySelector(`[data-id="${from}"]`);
        const toNode = document.querySelector(`[data-id="${to}"]`);
        
        if (fromNode?.classList.contains('lit') && toNode?.classList.contains('lit')) {
            path.classList.add('lit', 'lit-flow');
        }
    });

    // Show info
    showChainInfo(course, prereqs, dependents);
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
