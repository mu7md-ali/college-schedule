// Sections Schedule Script
const SPECIAL_STUDENT = "محمد على السيد على سالم شرف الدين";

// Binary Background Animation
function createBinaryBackground() {
    const bg = document.getElementById('binary-bg');
    if (!bg) return;
    
    for (let i = 0; i < 50; i++) {
        const binary = document.createElement('div');
        binary.className = 'binary-text';
        binary.textContent = Math.random() > 0.5 ? '1' : '0';
        binary.style.left = Math.random() * 100 + '%';
        binary.style.animationDuration = (Math.random() * 10 + 10) + 's';
        binary.style.animationDelay = Math.random() * 5 + 's';
        bg.appendChild(binary);
    }
}

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('themeIcon');
    icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Load Theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Generate Section Cards
function generateSectionCards() {
    if (typeof sectionsData === 'undefined') {
        console.error('sectionsData is not loaded!');
        return;
    }
    
    const groupAContainer = document.getElementById('groupA');
    const groupBContainer = document.getElementById('groupB');
    
    // Generate Group A (Sections 1-8)
    for (let i = 1; i <= 8; i++) {
        const sectionData = sectionsData.find(s => s.section === i);
        if (sectionData) {
            const card = createSectionCard(sectionData, 'group-a');
            groupAContainer.appendChild(card);
        }
    }
    
    // Generate Group B (Sections 9-16)
    for (let i = 9; i <= 16; i++) {
        const sectionData = sectionsData.find(s => s.section === i);
        if (sectionData) {
            const card = createSectionCard(sectionData, 'group-b');
            groupBContainer.appendChild(card);
        }
    }
}

// Create Section Card
function createSectionCard(sectionData, groupClass) {
    const card = document.createElement('div');
    card.className = `section-card ${groupClass}`;
    
    const studentCount = sectionData.students.length;
    const groupLetter = groupClass === 'group-a' ? 'A' : 'B';
    
    card.innerHTML = `
        <div class="section-number">${sectionData.section}</div>
        <div class="section-label">Section ${sectionData.section} - Group ${groupLetter}</div>
        <div class="section-info">
            <i class="fas fa-users"></i>
            <span>${studentCount} Students</span>
        </div>
        <button class="view-students-btn" onclick="showStudents(${sectionData.section})">
            <i class="fas fa-list"></i>
            <span>View Students</span>
        </button>
    `;
    
    return card;
}

// Show Students Modal
function showStudents(sectionNumber) {
    const sectionData = sectionsData.find(s => s.section === sectionNumber);
    if (!sectionData) {
        console.error('Section not found:', sectionNumber);
        return;
    }
    
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const studentCount = document.getElementById('studentCount');
    const tableBody = document.getElementById('studentsTableBody');
    
    // Update modal title
    const groupLetter = sectionNumber <= 8 ? 'A' : 'B';
    modalTitle.textContent = `Section ${sectionNumber} - Group ${groupLetter}`;
    
    // Update student count
    studentCount.textContent = `Total Students: ${sectionData.students.length}`;
    
    // Clear previous data
    tableBody.innerHTML = '';
    
    // Populate table
    sectionData.students.forEach(student => {
        const row = document.createElement('tr');
        
        // Check if this is the special student
        const isSpecial = student.name === SPECIAL_STUDENT;
        if (isSpecial) {
            row.className = 'special-student';
        }
        
        row.innerHTML = `
            <td>${student.rank}</td>
            <td>${student.name}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Show modal
    modal.classList.add('show');
    
    // Clear search
    document.getElementById('searchInput').value = '';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('studentModal');
    modal.classList.remove('show');
}

// Filter Students
function filterStudents() {
    const searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
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
    const studentCount = document.getElementById('studentCount');
    if (searchValue) {
        studentCount.textContent = `Showing ${visibleCount} of ${totalCount} students`;
    } else {
        studentCount.textContent = `Total Students: ${totalCount}`;
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal on background click
document.getElementById('studentModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'studentModal') {
        closeModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    createBinaryBackground();
    generateSectionCards();
});
