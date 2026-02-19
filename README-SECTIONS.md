# CS Shorouk - Sections Schedule Documentation

## Files Modified/Created:

### 1. **index.html** (Modified)
- Added "Sections" button in header next to Telegram button
- Links to sections-schedule.html

### 2. **style.css** (Modified)  
- Added `.sections-link` style for the new Sections button
- Green gradient with hover effects

### 3. **sections-schedule.html** (New)
- Main page for sections schedule
- Displays instructor schedule  
- Shows 16 section cards (Group A: 1-8, Group B: 9-16)
- Each section has a "View Students" button
- Modal popup to display student list

### 4. **sections-style.css** (New)
- Complete styling for sections page
- Section cards with group-specific colors
- Modal styles for student list
- Search functionality styles
- **Special student highlight** with golden glow animation
- Responsive design

### 5. **sections-script.js** (New)
- Generates section cards dynamically
- Handles modal open/close
- Search/filter functionality
- Special student detection (محمد على السيد على سالم شرف الدين)

### 6. **sections-data.js** (Partial - Needs Completion)
- Currently contains Sections 1-2 as template
- **ACTION REQUIRED**: Add remaining sections 3-16

## How to Complete sections-data.js:

The file needs data for all 16 sections. Currently only sections 1-2 are included as examples.

### Format for each section:
```javascript
{
  section: NUMBER,
  students: [
    {rank: 1, name: "الاسم الكامل"},
    {rank: 2, name: "الاسم الكامل"},
    // ... continue for all students
  ]
}
```

### Steps to complete:

1. Open `sections-data.js`
2. Add sections 3-16 following the same format
3. Make sure to include the comma between sections
4. Close the array with `];` at the end

### Example structure:
```javascript
const sectionsData = [
  {section:1, students:[...]},  // ✅ Already included
  {section:2, students:[...]},  // ✅ Already included
  {section:3, students:[...]},  // ⚠️ ADD THIS
  {section:4, students:[...]},  // ⚠️ ADD THIS
  // ... continue for 5-16
  {section:16, students:[...]}  // ⚠️ ADD THIS (no comma after last one)
];
```

## Special Features:

### 🌟 Special Student Highlight
- Student: **محمد على السيد على سالم شرف الدين**
- Section: 12, Rank: 15
- Automatically styled with:
  - Golden gradient background
  - Glowing animation
  - Rotating star icon
  - Enhanced text shadow

### 🎨 Group Colors
- **Group A (Sections 1-8)**: Green theme (#00ff88)
- **Group B (Sections 9-16)**: Orange theme (#ff6b00)

### 📱 Responsive Design
- Desktop: Grid layout with multiple columns
- Tablet: Adjusted grid
- Mobile: Single column, optimized buttons

### 🔍 Search Functionality
- Real-time search in student names
- Shows count of visible/total students
- Case-insensitive Arabic text search

### ⌨️ Keyboard Shortcuts
- `ESC`: Close modal
- Click outside modal: Close modal

## File Dependencies:

```
sections-schedule.html
├── style.css (base styles from main site)
├── sections-style.css (section-specific styles)
├── sections-data.js (student data - NEEDS COMPLETION)
└── sections-script.js (functionality)
```

## Installation:

1. Place all files in your website root directory
2. Complete `sections-data.js` with all 16 sections
3. Access via the "Sections" button in main header
4. Or directly: `/sections-schedule.html`

## Notes:

- All styling matches the main website theme (dark/light mode support)
- Binary background animation included
- Theme toggle works across all pages
- Modal uses smooth animations
- Special student highlight is automatic (no configuration needed)

## Data Source:

Student data should be copied from the provided JSON documents:
- Group A: Sections 1-8
- Group B: Sections 9-16

Each section contains approximately 36-37 students with:
- student_rank → rank
- name → name (keep Arabic text as-is)

---

**Status**: 🟡 Partially Complete - Waiting for full student data in sections-data.js
