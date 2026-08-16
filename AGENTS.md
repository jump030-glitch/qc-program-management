# QC Management System — Agent Guide

## Project Overview

**QC Management System** (Inspection Console) is a quality-control inspection platform for managing QC records, testers, systems, and reports. It's a **single-file SPA** (app.js) with bilingual UI support (English/Thai) and in-memory state (no localStorage).

**Key use cases:**
- Dashboard: live overview of QC activity by system, status, month
- QC Records: create, review, route quality-control records
- Tester Management: manage QC personnel
- System/Program Status: configure test-status vocabulary
- QC Report: generate multi-sheet Excel exports
- Export/Import: move data in/out as Excel
- Backup/Restore: full database snapshots

## Technology Stack

| Layer | Tech | Notes |
|-------|------|-------|
| **Core** | Vanilla JS (strict mode) | Single-file SPA in `app.js` |
| **UI** | HTML5 + CSS custom properties | Responsive design, light/dark theme |
| **State** | In-memory only | Data persists via Export/Backup |
| **Backend** | Supabase (vendor/supabase.min.js) | Live sync & shared database |
| **Visualization** | Chart.js (vendor/chart.min.js) | Dashboard charts & trend analysis |
| **Export** | XLSX & ExcelJS (vendor/xlsx.min.js, vendor/exceljs.min.js) | Generate Excel reports |
| **i18n** | Custom I18N object | Thai + English dictionaries |

## Architecture & Patterns

### Single-File SPA Structure
- **app.js** contains the entire application in an IIFE
- Sections marked with `/* ---- SECTION ---- */` comments
- Global ICONS, I18N, and state objects
- No external build step or module system

### Theme & Styling
- CSS custom properties (`--primary`, `--accent`, `--bg`, `--text`, etc.)
- Dark/light mode via `data-theme="light"|"dark"` attribute on `<html>`
- Design tokens: colors, shadows, radius, fonts (IBM Plex, Inter, Noto Sans Thai)
- Responsive: sidebar width `--sidebar-w: 248px`

### Internationalization (i18n)
- Global `I18N` object with `en` and `th` dictionaries
- Helper function `t(key, lang)` to fetch translated strings
- Common keys: `appName`, `nav`, `titles`, `common`, `dash`, `records`, `form`, `detail`, `send`, `tester`, `systems`, `status`, `reports`, `backup`
- Date/month strings translated
- Email templates bilingual

### Icon System
- Inline SVG stored in `ICONS` object
- Used via `icon.ICONS.dashboard`, `ICONS.edit`, etc.
- Stroke-based, `currentColor` respects theme
- Examples: dashboard, records, testers, reports, backup, sun, moon, plus, edit, trash

### Data & State Management
- **No localStorage** — data exists only in memory
- **Persistence mechanisms**: Export (Excel), Backup (JSON snapshot), Restore
- **Live sync**: Supabase connection for shared/online data
- **In-preview limitation**: The artifact preview warns users to download the file for persistent auto-save

### Common UI Patterns
1. **Modal/Dialog**: form-based record creation/editing
2. **Filtering**: search box + multi-select filters (system, status, tester, month)
3. **Pagination**: "Showing X–Y of Z" with page controls
4. **Table view**: QC records with inline edit/delete/send actions
5. **Status badges**: color-coded (passed, failed, revision, pending, cancelled, testing, installed)
6. **Tab navigation**: nav menu with grouped tabs (Overview, QC Operations, System)

## Key Data Structures & Models

### QC Record
```
{
  id: "ProblemID-001",
  system: "Main System",
  subSystem: "Sub System",
  program: "Program Name",
  version: "v2.4",
  issueType: "Bug",
  status: "pending|passed|failed|revision|testing|installed|cancelled",
  tester: "John Doe",
  testDate: "2026-08-16",
  issueDescription: "...",
  responsiblePerson: "...",
  relatedApps: ["Web App", "API"],
  notes: "...",
  attachments: ["file_url_1", "file_url_2"],
  reportedTime: "14:30"
}
```

### Tester
```
{
  id: "...",
  name: "Tester Name",
  username: "employee_id",
  email: "tester@company.com",
  role: "QA Lead",
  department: "Quality Assurance",
  status: "active|inactive"
}
```

### System
```
{
  id: "...",
  name: "Main System",
  subSystems: ["Sub-System 1", "Sub-System 2"],
  status: "active|inactive"
}
```

### Program Status (Vocabulary)
```
{
  id: "passed",
  label: "Passed",
  color: "#0E9F6E",
  description: "QC test passed all checks"
}
```

## Common Tasks & Patterns

### Adding a New Form Field
1. Add key to `I18N.en.form` and `I18N.th.form`
2. Add input element with `name="fieldName"`
3. Collect value in form submission handler
4. Add to record object before save/export

### Adding a New Report/View
1. Add nav entry to `I18N.en.nav` and `I18N.th.nav`
2. Add menu button/tab in nav
3. Create view function (e.g., `renderReportsView()`)
4. Handle tab click to dispatch to view function
5. Use Chart.js for visualizations if needed

### Export to Excel
- Use vendor/xlsx.min.js + vendor/exceljs.min.js
- Group data by system/status if multi-sheet
- Include bilingual headers (EN/TH)
- Set column widths, freeze panes for usability

### Sending Email Notifications
- Compose email from I18N templates (bilingual EN/TH)
- Format: HTML table (rich) or plain text
- Include record details, tester info, action links
- Support copying to clipboard or opening email client

### Theming
- Toggle via button clicking `data-theme` attribute
- CSS auto-reflows all `var(--primary)`, `var(--bg)`, etc.
- Store preference in Supabase or offer download-to-persist option
- Dark palette: `--text: #E8EDF7`, `--bg: #0A1220`, `--surface: #111B2E`

## Development Notes

### Working with Supabase
- Initialize client from vendor/supabase.min.js
- Authenticate and sync QC records live
- Handle connection loss gracefully (fall back to export/restore)
- Provide visual indicator: "Live · shared with team" vs. "Auto-save on (this device only)"

### Bilingual String Keys
All user-facing strings go through `I18N`. Never hardcode text. Access via:
```javascript
const text = I18N[lang].nav.dashboard;  // "Dashboard" (en) or "แผงควบคุม" (th)
```

### CSS & Responsive Design
- Use CSS custom properties throughout (no magic numbers)
- Sidebar width is 248px; adjust `--sidebar-w` for mobile
- Font stack prioritizes Thai: `'IBM Plex Sans', 'Noto Sans Thai', sans-serif`
- All colors defined at :root; update for theme in `[data-theme="dark"]`

### Testing/QA Focus
- No build step — open index.html directly in browser
- Use browser DevTools console for debugging
- Export test data as Excel for validation
- Test bilingual strings by toggling language in UI

## Common Pitfalls

- **Data loss on page refresh**: Remind users to Export or Backup before closing
- **Attachment limits**: Enforced in form (MB size check)
- **Timezone handling**: Dates stored as strings (YYYY-MM-DD); clarify expected format
- **Performance**: Single-file SPA; refactor into modules only if app.js exceeds 5000 lines
- **Theme persistence**: Not saved to localStorage in preview mode; download file for auto-save

## File Organization

```
qc-management-system-dist/
├── index.html          # Entry point; loads vendor libs + app.js
├── app.js              # Entire SPA (10,000+ lines; IIFE, strict mode)
├── style.css           # Design tokens, responsive grid, theme
└── vendor/
    ├── supabase.min.js # Backend + real-time sync
    ├── chart.min.js    # Dashboard visualizations
    ├── xlsx.min.js     # Excel export
    └── exceljs.min.js  # Advanced Excel generation
```

## Links & References

- **Design System**: CSS custom properties in style.css (light & dark modes)
- **i18n Dictionaries**: See app.js `I18N` object for all text keys
- **Status Colors**: `--c-passed`, `--c-failed`, `--c-revision`, `--c-pending`, etc.
- **Supabase Docs**: https://supabase.com/docs (for real-time sync patterns)
- **Chart.js Docs**: https://www.chartjs.org/ (for dashboard updates)
