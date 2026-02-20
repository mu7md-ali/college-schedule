// English Schedule Modal Management

let englishScheduleData = null;

// Load English Schedule Data
async function loadEnglishScheduleData() {
    try {
        const response = await fetch('english-schedule-data.json');
        englishScheduleData = await response.json();
        console.log('✅ English Schedule data loaded');
    } catch (error) {
        console.error('❌ Error loading English Schedule data:', error);
    }
}

// Open English Schedule Modal
function openEnglishSchedule() {
    if (!englishScheduleData) {
        showToast('Loading data...', 'info');
        loadEnglishScheduleData().then(() => {
            if (englishScheduleData) {
                displayEnglishSchedule();
            }
        });
    } else {
        displayEnglishSchedule();
    }
}

// Display English Schedule
function displayEnglishSchedule() {
    const modal = document.getElementById('englishScheduleModal');
    const body = document.getElementById('englishScheduleBody');
    
    if (!modal || !body) {
        console.error('English Schedule modal elements not found');
        return;
    }
    
    // Clear previous content
    body.innerHTML = '';
    
    // Generate schedule tables
    englishScheduleData.sections.forEach(section => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'schedule-category';
        
        categoryDiv.innerHTML = `
            <h3 class="category-title">
                <i class="fas fa-graduation-cap"></i> ${section.category}
            </h3>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th><i class="fas fa-layer-group"></i> Level</th>
                        <th><i class="fas fa-calendar-day"></i> Day</th>
                        <th><i class="fas fa-clock"></i> Period</th>
                        <th><i class="fas fa-map-marker-alt"></i> Location</th>
                        <th><i class="fas fa-user-tie"></i> Instructor</th>
                    </tr>
                </thead>
                <tbody>
                    ${section.schedule.map(item => `
                        <tr>
                            <td><span class="level-badge">Level ${item.level}</span></td>
                            <td><span class="day-badge">${item.day}</span></td>
                            <td><span class="period-badge">${item.period}</span></td>
                            <td><span class="location-badge">${item.location}</span></td>
                            <td><span class="instructor-name">${item.instructor}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        body.appendChild(categoryDiv);
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close English Schedule Modal
function closeEnglishSchedule() {
    const modal = document.getElementById('englishScheduleModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEnglishScheduleData();
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEnglishSchedule();
        }
    });
    
    // Close on background click
    const modal = document.getElementById('englishScheduleModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'englishScheduleModal') {
                closeEnglishSchedule();
            }
        });
    }
});
