// Students Names Modal Management

let studentsData = null;
let currentSection = null;
const SPECIAL_STUDENT = "محمد على السيد على سالم شرف الدين";

// Load Students Data
async function loadStudentsData() {
    try {
        // Load the JS file that contains sectionsData
        if (typeof sectionsData === 'undefined') {
            const script = document.createElement('script');
            script.src = 'students-names-data.js';
            script.onload = () => {
                studentsData = sectionsData;
                console.log('✅ Students data loaded:', studentsData.length, 'sections');
            };
            script.onerror = () => {
                console.error('❌ Error loading students data');
            };
            document.head.appendChild(script);
        } else {
            studentsData = sectionsData;
            console.log('✅ Students data already loaded');
        }
    } catch (error) {
        console.error('❌ Error loading students data:', error);
    }
}

// Open Students Names Modal
function openStudentsNames() {
    if (!studentsData) {
        showToast('Loading data...', 'info');
        loadStudentsData();
        setTimeout(() => {
            if (studentsData) {
                displayStudentsModal();
            }
        }, 500);
    } else {
        displayStudentsModal();
    }
}

// Display Students Modal
function displayStudentsModal() {
    const modal = document.getElementById('studentsNamesModal');
    if (!modal) {
        console.error('Students Names modal not found');
        return;
    }
    
    // Generate section buttons
    generateSectionButtons();
    
    // Show first section by default
    if (!currentSection && studentsData && studentsData.length > 0) {
        showStudentsBySection(1);
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Generate Section Buttons
function generateSectionButtons() {
    const container = document.getElementById('sectionButtonsContainer');
    if (!container || !studentsData) return;
    
    container.innerHTML = '';
    
    studentsData.forEach(section => {
        const btn = document.createElement('button');
        btn.className = `section-btn ${section.section <= 8 ? 'group-a' : 'group-b'}`;
        btn.textContent = `Section ${section.section}`;
        btn.onclick = () => showStudentsBySection(section.section);
        container.appendChild(btn);
    });
}

// Show Students by Section
function showStudentsBySection(sectionNumber) {
    currentSection = sectionNumber;
    
    const sectionData = studentsData.find(s => s.section === sectionNumber);
    if (!sectionData) {
        console.error('Section not found:', sectionNumber);
        return;
    }
    
    // Update active button
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === `Section ${sectionNumber}`) {
            btn.classList.add('active');
        }
    });
    
    // Update title
    const groupLetter = sectionNumber <= 8 ? 'A' : 'B';
    const titleEl = document.getElementById('currentSectionTitle');
    if (titleEl) {
        titleEl.textContent = `Section ${sectionNumber} - Group ${groupLetter}`;
    }
    
    // Update student count
    const countEl = document.getElementById('studentCount');
    if (countEl) {
        countEl.textContent = `Total Students: ${sectionData.students.length}`;
    }
    
    // Display students
    displayStudentsTable(sectionData.students);
    
    // Clear search
    const searchInput = document.getElementById('studentsSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Display Students Table
function displayStudentsTable(students) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const tr = document.createElement('tr');
        
        // Check if this is the special student
        if (student.name === SPECIAL_STUDENT) {
            tr.classList.add('special-student');
        }
        
        tr.innerHTML = `
            <td>${student.rank}</td>
            <td>${student.name}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Search/Filter Students
function filterStudents() {
    const searchInput = document.getElementById('studentsSearchInput');
    if (!searchInput) return;
    
    const searchValue = searchInput.value.trim().toLowerCase();
    const rows = document.querySelectorAll('#studentsTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const name = row.querySelector('td:last-child').textContent.toLowerCase();
        if (name.includes(searchValue)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update count
    const totalCount = rows.length;
    const countEl = document.getElementById('studentCount');
    if (countEl) {
        if (searchValue) {
            countEl.textContent = `Showing ${visibleCount} of ${totalCount} students`;
        } else {
            countEl.textContent = `Total Students: ${totalCount}`;
        }
    }
}

// Close Students Names Modal
function closeStudentsNames() {
    const modal = document.getElementById('studentsNamesModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentSection = null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudentsData();
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeStudentsNames();
        }
    });
    
    // Close on background click
    const modal = document.getElementById('studentsNamesModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'studentsNamesModal') {
                closeStudentsNames();
            }
        });
    }
});
