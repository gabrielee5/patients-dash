# Medical Practice Manager

A modern, comprehensive patient management system designed for medical professionals. Built with React, TypeScript, and Tailwind CSS, this application provides an intuitive interface for managing patient records, recording visits, and maintaining medical histories.

## Features

### Patient Management
- **Complete Patient Profiles**: Store comprehensive patient information including demographics, contact details, medical history, insurance, and emergency contacts
- **Quick Search**: Fast, powerful search across all patient fields (name, email, phone, DOB)
- **Sortable Views**: Sort patients by name, date of birth, or last visit
- **Filter Options**: View patients with recent visits or all patients
- **Export Capabilities**: Export patient data to CSV or individual patient records to PDF

### Visit Recording
- **Streamlined Visit Entry**: Record patient visits in 3 clicks or less
- **Comprehensive Forms**: Capture chief complaints, vital signs, examination findings, diagnosis, treatment plans, prescriptions, lab orders, and follow-up notes
- **Visit Templates**: Pre-configured templates for common visit types (general check-up, follow-up, urgent care, specialist consultation)
- **Template Management**: Create, edit, and manage custom visit templates
- **Auto-save Date/Time**: Automatically timestamp each visit

### Patient History
- **Timeline View**: View complete visit history in chronological order
- **Expandable Details**: Click to expand visits for full clinical notes
- **Vital Signs Tracking**: Track and view vital signs across visits
- **Quick Edit**: Edit any past visit directly from the history view

### Dashboard & Analytics
- **Quick Stats**: View today's patient count, weekly activity, monthly trends, and total patients
- **Today's Visits**: See all visits recorded today at a glance
- **Recent Patients**: Quick access to recently viewed or updated patients
- **Visual Cards**: Color-coded summary cards for easy information scanning

### Data Management
- **PDF Export**: Generate professional PDF reports of patient records with complete visit history
- **CSV Export**: Export patient lists or individual patient visit histories to CSV
- **Bulk Operations**: Export entire patient database for backups
- **Print-Friendly**: Optimized layouts for printing patient summaries

### User Experience
- **Dark Mode**: Toggle between light and dark themes, with preference saved across sessions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Touch-Friendly**: Large touch targets for bedside use on tablets
- **Keyboard Shortcuts**: Power user shortcuts for common actions
- **Accessible**: WCAG-compliant design with proper contrast and navigation

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Patient | `Ctrl+N` (or `Cmd+N` on Mac) |
| New Visit | `Ctrl+V` (or `Cmd+V` on Mac) |
| Search / Go to Patients | `Ctrl+F` (or `Cmd+F` on Mac) |
| Go to Dashboard | `Ctrl+D` (or `Cmd+D` on Mac) |
| Go to Patients List | `Ctrl+P` (or `Cmd+P` on Mac) |
| Toggle Dark Mode | `Ctrl+Shift+T` (or `Cmd+Shift+T` on Mac) |

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: IndexedDB (via Dexie.js) for robust client-side storage
- **PDF Generation**: jsPDF
- **CSV Export**: PapaParse
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd medical-practice-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the URL shown in terminal)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Sample Data

The application automatically loads sample data on first run, including:
- 8 diverse patient profiles with complete demographics
- Multiple visits per patient with realistic medical data
- Pre-configured visit templates for common appointment types

This sample data helps you explore all features immediately without manual data entry.

## Data Persistence

All data is stored locally in your browser using IndexedDB, which provides:
- **Offline Functionality**: Works completely offline, no internet required
- **Large Storage Capacity**: Can store thousands of patient records
- **Fast Performance**: Optimized queries for quick data retrieval
- **Data Privacy**: All data stays on your device

**Note**: Data is stored in the browser's IndexedDB. Clearing browser data will remove all records. Regular backups via CSV export are recommended.

## Project Structure

```
medical-practice-manager/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── PatientList.tsx # Patient list view
│   │   ├── PatientDetail.tsx # Patient details & history
│   │   ├── PatientForm.tsx # Patient add/edit form
│   │   ├── VisitForm.tsx   # Visit recording form
│   │   ├── Templates.tsx   # Template management
│   │   └── Layout.tsx      # App layout & navigation
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx
│   ├── db/                 # Database setup
│   │   └── database.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useKeyboardShortcuts.tsx
│   ├── services/           # Business logic & data access
│   │   ├── patientService.ts
│   │   ├── visitService.ts
│   │   ├── templateService.ts
│   │   ├── exportService.ts
│   │   └── sampleDataService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Key Features Implementation

### 3-Click Visit Recording
1. Click "New Visit" button (or press Ctrl+V)
2. Select patient and fill in chief complaint
3. Click "Record Visit"

### Patient Search Workflow
- Press Ctrl+F to jump to patient list
- Type in search box to instantly filter results
- Click any patient to view their complete record

### Quick Template Usage
1. When recording a visit, select a template from dropdown
2. Template auto-populates relevant fields
3. Customize as needed and save

## Browser Compatibility

- Chrome/Edge (recommended): Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Optimized responsive design

## Future Enhancements

Potential features for future versions:
- Multi-user support with authentication
- Cloud synchronization
- Appointment scheduling
- Prescription printing
- Lab result integration
- Billing and insurance claims
- Advanced reporting and analytics
- Voice-to-text for visit notes

## License

This is a demonstration project created for educational purposes.

## Support

For issues, questions, or feature requests, please refer to the project repository.

---

Built with care for medical professionals. Streamline your practice management with modern, intuitive tools.
