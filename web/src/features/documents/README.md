# Documents Feature

## Overview

The **Documents** feature is a comprehensive visa document management and checklist system that helps users organize, track, and prepare all required visa documentation. It provides an interactive checklist interface with specialized widgets for different document types, file upload capabilities, and document generation tools.

### Purpose
- **Document Checklist**: Displays country/visa-type-specific document requirements
- **Document Tracking**: Tracks completion status (required vs. optional, checked vs. unchecked)
- **File Management**: Handles file uploads for submittable documents
- **Specialized Tools**: Provides embedded widgets for:
  - Photo specifications visualization
  - Visa application form generation & guidance
  - Travel itinerary generation
  - Cover letter generation
- **Document Export**: Bulk download of all uploaded files as ZIP

---

## Architecture

### High-Level Flow

```
User Navigates to Documents Page
           ↓
DocumentsContent (Container Component)
           ↓
┌─────────────────────────────────────────┐
│        useDocumentData Hook              │
│  - Loads requirements from repository    │
│  - Fetches visa type & itinerary data    │
│  - Maps to DocumentData shape            │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│   Left Panel (Checklist)                 │
│  - DocChecklistSidebar                       │
│  - Document categories & items          │
│  - Toggle completion status             │
└─────────────────────────────────────────┘
           ↓
    User Selects Document
           ↓
┌─────────────────────────────────────────┐
│   Right Panel (Focus Drawer)            │
│  - DocDetailPanel with selected doc        │
│  - DocHelper routes to correct widget   │
│  - Upload/Download/Generate options    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│   Special Widgets (conditional)         │
│  - PhotoSpecWidget                      │
│  - VisaFormWidget                       │
│  - ItineraryWidget                      │
│  - CoverLetterBuilder                    │
│  - UploadSlot (default)                 │
└─────────────────────────────────────────┘
           ↓
    User Downloads All Files (ZIP)
           ↓
        Exit Feature
```

### Component Hierarchy

```
DocumentsContent (Main Container)
  ├── DocumentsHeader (Title + Stats + Download Button)
  ├── StatStrip (Summary of required/optional/uploaded)
  ├── UploadProgressBanner (Upload progress indicator)
  ├── DocChecklistCompleteBanner (Required documents completion bar)
  └── Two-Panel Layout
      ├── LEFT: DocChecklistSidebar
      │    └── Category Groups
      │         └── DocChecklistRow items (clickable)
      └── RIGHT: DocDetailPanel (animated)
           ├── Drawer Header (with category badge)
           ├── DocHelper (routes to special widget or upload slot)
           │    ├── PhotoSpecWidget
           │    ├── VisaFormWidget
           │    ├── ItineraryWidget
           │    ├── CoverLetterBuilder
           │    └── UploadSlot (default)
           └── Drawer Footer (prev/next navigation)
```

---

## File Structure & Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| **DocumentsContent.tsx** | Main container component. Manages state (checked docs, uploads, active doc), orchestrates data loading, renders two-panel layout. Entry point for the feature. |
| **DocumentHelper.tsx** | Routes a single document to its appropriate widget based on `specialWidget` type (photo_spec, visa_form, itinerary, cover_letter, or default upload). |
| **PhotoSpecWidget.tsx** | Displays visual guidelines for passport photo dimensions (45×35mm) with interactive overlay. |
| **mapRequirements.ts** | Transforms raw `RequirementsData` from repository into `DocumentData` shape with categories, items, and metadata. Maps doc codes to special widget types. |

### Components (`/components`)

| File | Purpose |
|------|---------|
| **DocChecklistSidebar.tsx** | Left-side panel showing organized document categories and individual checklist items with toggle buttons and upload indicators. |
| **DocDetailPanel.tsx** | Right-side animated drawer displaying a single selected document with header, helper widget, and prev/next navigation. |
| **DocChecklistRow.tsx** | Individual document row in the checklist with status indicator, checkbox, upload icon, and optional badge. |
| **DocumentsHeader.tsx** | Hero section with title, visa details, overall progress, upload stats, and download-all button. |
| **DocChecklistStyles.tsx** | Global CSS styles injected into DOM for checklist styling. |
| **StatStrip.tsx** | Horizontal stats bar showing required/optional/uploaded counts. |
| **UploadProgressBanner.tsx** | Motivational banner showing file upload progress percentage. |
| **DocChecklistCompleteBanner.tsx** | Progress bar showing completion of required documents. |
| **DocLoadingStates.tsx** | Error and loading state UI components. |

### Hooks (`/hooks`)

| File | Purpose |
|------|---------|
| **useDocumentData.ts** | Fetches country requirements, visa type data, and itinerary data from repository. Maps requirements to DocumentData shape. Handles loading/error states. |
| **useDrawerAnimation.ts** | Manages DocDetailPanel animation state (opacity, slide). Returns `{visibleDocId, drawerOpacity, drawerTranslateY}`. |
| **useKeyboardNav.ts** | Keyboard navigation (arrow keys to move between documents). |

### Utilities (`/util`)

| File | Purpose |
|------|---------|
| **UploadSlot.tsx** | Default file upload interface with drag-drop support. Validates file and triggers `onUpload` callback. |
| **downloadAllFiles.ts** | Collects all uploaded files and creates a ZIP download with organized folder structure. |

### Feature Subdirectories

#### **cover_letter/** - Cover Letter Generation
Generates professional cover letters for visa applications.

| File | Purpose |
|------|---------|
| **CoverLetterBuilder.tsx** | Main widget container (embedded in DocHelper). |
| **LetterInputForm.tsx** | Form UI for collecting applicant info (name, qualifications, etc.). |
| **letterValidation.ts** | Business logic: templates, variable interpolation, validation. |
| **letterDocxExporter.ts** | DOCX file generation using document structure. |
| **coverLetterPreview.tsx** | Live preview of generated letter. |
| **LetterFormFields.tsx** | Reusable components (input fields, buttons, etc.). |
| **letterBoilerplate.ts** | Letter templates with placeholders. |
| **letterContentBuilder.ts** | Utility functions (formatting, validation). |
| **letterStyles.ts** | Styling module. |

#### **visa_form/** - Visa Application Form Assistant
Provides guidance and form-fill assistance for visa application forms.

| File | Purpose |
|------|---------|
| **VisaFormWidget.tsx** | Main widget container. Routes to form steps or displays download link. |
| **visaFormService.ts** | Form field definitions, step logic, field hints. |
| **useVisaFormState.ts** | Manages form state (current step, filled fields). |
| **FieldList.tsx** | Displays form fields for current step. |
| **FieldDetail.tsx** | Individual field UI with label, example, hint, warning. |
| **FormStepBanner.tsx** | Step progress indicator (e.g., "Step 3 of 5"). |
| **HelperHeader.tsx** | Header for the form widget. |
| **SectionIcon.tsx** | Icon component for form sections. |

#### **itinerary/** - Travel Itinerary Generation
Generates travel itineraries for visa-required countries like Japan, France.

| File | Purpose |
|------|---------|
| **ItineraryWidget.tsx** | Main widget container with interactive itinerary builder/preview. |
| **itineraryService.ts** | Itinerary logic: day-by-day activities, place recommendations, formatting. |
| **itineraryDocxService.ts** | Generates DOCX file from itinerary data. |

#### **visa_overview/** - Visa Information Panel
Displays visa-specific metadata when no document is selected.

| File | Purpose |
|------|---------|
| **VisaOverviewPanel.tsx** | Shows visa fees, processing time, required documents summary. |
| **useVisaOverviewData.ts** | Transforms visa type data for display. |
| **FeeBreakdown.tsx** | Fee structure visualization. |
| **PaymentInstructionCard.tsx** | Payment details and instructions. |
| **ProcessFlag.tsx** | Country/processing time indicator. |
| **EmptyState.tsx** | Placeholder when no document selected. |
| **icons.tsx** | Icon definitions. |
| **palette.ts** | Color scheme. |
| **primitives.tsx** | Base UI primitives. |
| **utils.ts** | Helper functions. |
| **index.ts** | Public exports. |

---

## Important Methods & Functions

### DocumentsContent.tsx

#### State Management
```typescript
const [checked, setChecked] = useState<Record<string, boolean>>({})
// Tracks which documents user has marked "done"

const [uploads, setUploads] = useState<UploadsMap>({})
// Maps docId → File for uploaded documents

const [activeDocId, setActiveDocId] = useState<string | null>(null)
// Currently selected/displayed document in drawer
```

#### Key Handlers

| Function | Purpose |
|----------|---------|
| `toggleDoc(id)` | Toggle document's completion status (checked/unchecked). |
| `toggleDocAndAdvance(id)` | Toggle status AND auto-advance to next incomplete required doc. |
| `handleUpload(docId, file)` | Store uploaded file in `uploads` state. |
| `handleRemove(docId)` | Delete uploaded file from `uploads` state. |
| `handleDownloadAll()` | Collects all uploads and triggers ZIP download. |
| `handleItineraryReady(docId, file)` | Stores generated itinerary file. |

#### Derived Values
```typescript
const allDocs = data?.categories.flatMap(c => c.documents) ?? []
// Flattened list of all documents

const requiredDocs = allDocs.filter(d => d.status === "required")
// Subset: required documents only

const totalDone = allDocs.filter(d => checked[d.id]).length
// Count of checked documents

const uploadCount = Object.keys(uploads).length
// Number of uploaded files

const overallPct = allDocs.length ? (totalDone / allDocs.length) * 100 : 0
// Completion percentage
```

### useDocumentData.ts

```typescript
export function useDocumentData({
  country, visaType, location, sponsorship,
  countryName, visaTypeName, locationName,
}): UseDocumentDataResult
```

**Purpose**: Orchestrates data loading.

**Steps**:
1. Validates required params (country, visaType, location)
2. Calls `Promise.all()` to fetch in parallel:
   - `getRequirementsData(country, visaType, location, sponsorship)`
   - `getItineraryPlaces(country)` (if applicable)
   - `getVisaType(country, visaType)` (if applicable)
3. Maps requirements via `mapRequirementsToDocumentData()`
4. Sets state: `data`, `itineraryData`, `visaTypeData`
5. Returns: `{ data, itineraryData, visaTypeData, loading, error }`

### mapRequirements.ts

```typescript
export function mapRequirementsToDocumentData(
  req: RequirementsData,
  countryName, visaTypeName, locationName, sponsorship
): DocumentData
```

**Purpose**: Transform raw requirements JSON into DocumentData shape.

**Logic**:
1. Filters requirement sections by sponsorship type
2. For each section, maps to `DocumentCategory` with icon/color metadata
3. For each document in section:
   - Assigns category
   - Checks `SPECIAL_WIDGETS` map to determine widget type
   - Checks `NO_UPLOAD_CODES` to set `noUpload` flag
   - Extracts status (required/optional), format, tips, etc.
4. Returns structured `DocumentData` ready for UI consumption

### downloadAllFiles.ts

```typescript
export async function downloadAllFiles(
  uploads: UploadsMap,
  allDocs: DocumentItem[]
): Promise<void>
```

**Purpose**: Bundle uploaded files into a ZIP and trigger browser download.

**Steps**:
1. Creates ZIP archive with folder structure (by category)
2. Iterates `uploads` map, finds doc metadata, organizes by category
3. Calls browser's download API
4. Cleans up memory

---

## Data Flow

### 1. **Entry Point**: DocumentsContent Component
- User navigates to `/documents` page
- `DocumentsContent` is rendered
- Props may be injected (embedded mode) or read from URL search params
- Initial state: all counters at 0, no uploads, no active doc

### 2. **Data Loading** (useDocumentData Hook)
```
country, visaType, location, sponsorship
           ↓
Promise.all([
  getRequirementsData(),
  getItineraryPlaces(),
  getVisaType()
])
           ↓
mapRequirementsToDocumentData()
           ↓
DocumentData { categories: [...], documents: [...] }
```

### 3. **Render Checklist** (DocChecklistSidebar)
```
categories (grouped by color/icon)
           ↓
For each category:
  render DocChecklistRow for each document
           ↓
DocChecklistRow displays:
- Checkbox (reflects checked state)
- Document name
- Status badge (required/optional)
- Upload indicator (if file uploaded)
- Description & tips (expandable)
```

### 4. **Select Document** (setActiveDocId)
```
User clicks DocChecklistRow or prev/next button
           ↓
setActiveDocId(docId)
           ↓
Triggers DocDetailPanel animation
           ↓
DocDetailPanel renders with visibleDoc
```

### 5. **Route to Widget** (DocHelper)
```
visibleDoc.specialWidget switch:
  ├─ "photo_spec"    → PhotoSpecWidget
  ├─ "visa_form"     → VisaFormWidget
  ├─ "itinerary"     → ItineraryWidget
  ├─ "cover_letter"  → CoverLetterBuilder
  └─ undefined       → UploadSlot (default)
```

### 6. **User Interaction**
**Option A: Check Document**
```
DocChecklistSidebar → toggleDoc() or toggleDocAndAdvance()
           ↓
setChecked({ ...prev, [id]: !prev[id] })
           ↓
UI updates: checkbox, progress bars refresh
           ↓
If toggleDocAndAdvance: auto-advance to next incomplete doc
```

**Option B: Upload File**
```
UploadSlot (or generated doc from widget) → onUpload(file)
           ↓
handleUpload(docId, file)
           ↓
setUploads({ ...prev, [docId]: file })
           ↓
UI updates: upload count, progress bars refresh
           ↓
File stored in state (not yet submitted)
```

**Option C: Generate Document**
```
CoverLetterBuilder/ItineraryWidget → onItineraryReady(file)
           ↓
handleItineraryReady(docId, file)
           ↓
setUploads({ ...prev, [docId]: file })
           ↓
File ready for download (or manual save)
```

### 7. **Exit Point**: Download & Leave

**Option A: Download All**
```
User clicks "Download All" button
           ↓
handleDownloadAll()
           ↓
downloadAllFiles(uploads, allDocs)
           ↓
Browser downloads ZIP
           ↓
User can close page or continue
```

**Option B: Go Back**
```
Click "Edit selections" back button OR
DocDetailPanel close button (embedded context)
           ↓
router.push("/wizard") OR close drawer
           ↓
Return to wizard for different country/visa/location
```

---

## Entry & Exit Points

### Entry Points

1. **Standalone Page**: User navigates to `/documents`
   - URL params: `?country=...&visaType=...&location=...&sponsorship=...`
   - `DocumentsContent` reads params and renders full page with back button

2. **Embedded in Wizard**: `DocumentsContent` rendered inside `WizardAccordion`
   - Props injected: `country`, `visaType`, `location`, `sponsorship`, `embedded=true`
   - No back button; animated accordion section
   - Drawer spans full accordion height

3. **Direct Props Injection**: For testing or custom integrations
   - Pass `DocumentsContentProps` directly
   - Props override URL params

### Exit Points

1. **"Edit Selections" Back Button**
   - Visible when: `!props.embedded` (standalone page mode)
   - Action: `router.push("/wizard")`
   - Flow: Return to wizard for different country/visa selection

2. **Close Drawer / Mobile Back**
   - Visible when: document is selected (`activeDocId !== null`)
   - Action: `setActiveDocId(null)` OR `setActiveDocId(prev)` for prev doc
   - Flow: Return to overview panel or previous document

3. **Download All Files**
   - User clicks "Download All" button
   - Action: `handleDownloadAll()` → triggers ZIP download
   - Flow: Files delivered to user; may close page or continue

4. **Auto-Exit on Completion** (Optional Business Logic)
   - Could be implemented: if `requiredDone === requiredTotal`, show completion modal with "Proceed to Submission" button
   - Currently: User must manually navigate away

---

## Key Concepts & Design Patterns

### 1. **Two-Panel Responsive Layout**
- **Desktop**: Checklist (left) + Drawer (right), both visible
- **Mobile**: Toggle between left (checklist) and right (drawer) with full-width overlay
- Controlled via `isMobile` state and conditional CSS

### 2. **Drawer Animation**
- `useDrawerAnimation` provides `drawerOpacity` and `drawerTranslateY` values
- Applied to DocDetailPanel for smooth entry/exit transitions
- Uses CSS `transition` for hardware-accelerated animation

### 3. **Special Widgets**
- Each document can have a "special widget" (photo_spec, visa_form, itinerary, cover_letter)
- Widgets are embedded in the DocHelper component
- Widgets can generate files (itinerary, cover letter DOCX) which are stored in `uploads`
- Default widget is `UploadSlot` (file upload input)

### 4. **State Management**
- Uses React `useState` (no Redux/Context overhead)
- Parent (`DocumentsContent`) owns state; passes callbacks to children
- State lives in component, not in global context
- UploadsMap is in-memory; files are not persisted to backend (by design)

### 5. **Data Mapping**
- Raw requirements JSON (from repository) → DocumentData (UI-ready)
- Mapping logic in `mapRequirements.ts` is pure and testable
- SPECIAL_WIDGETS and NO_UPLOAD_CODES maps are centralized for easy updates

### 6. **Responsive Design**
- Mobile-first CSS approach
- Conditional rendering based on `isMobile` state
- Full-screen overlay drawer on mobile; side-by-side on desktop
- Hidden checklist on mobile when drawer is open

---

## Integration Points

### With Other Features

| Feature | Integration | Location |
|---------|-----------|----------|
| **Wizard** | DocumentsContent embedded in WizardAccordion | `features/wizard/` |
| **Applicant Context** | Could consume applicant data for cover letter | `lib/context/ApplicantContext.tsx` |
| **Data Repository** | Fetches requirements, visa types, itineraries | `lib/data/repository.ts` |
| **Document Types** | Uses document type definitions | `src/types/document.ts` |

### External Dependencies

- **Next.js**: Navigation (`useRouter`, `useSearchParams`), client-side rendering
- **File API**: Blob, ZIP creation (via JSZip or native ZIP libs)
- **DOCX Generation**: For itinerary & cover letter exports (if using docx library)

---

## Common Customization Points

1. **Add New Special Widget**
   - Add type to `SpecialWidget` union in `types/document.ts`
   - Add entry to `SPECIAL_WIDGETS` map in `mapRequirements.ts`
   - Create new component in appropriate subdirectory
   - Add case to `DocHelper` switch statement

2. **Change Styling**
   - `DocChecklistStyles.tsx` injects global CSS
   - Component inline styles use `theme.ts` color tokens
   - Update `T` (theme) references for consistent theming

3. **Modify Checklist Layout**
   - `DocChecklistSidebar.tsx` controls category grouping and DocChecklistRow rendering
   - `DocChecklistRow.tsx` is the individual row component

4. **Extend File Upload**
   - Modify `UploadSlot.tsx` for additional validation
   - Update `downloadAllFiles.ts` for different archive structure

---

## Summary

The **Documents** feature is a sophisticated, modular system for visa document management. It combines a responsive checklist interface with specialized widgets for document generation, file uploads, and interactive guidance. The architecture prioritizes modularity (separate subdirectories for cover letter, visa form, itinerary, visa overview), clean data flow (requirements → DocumentData → UI), and extensibility (special widgets, customizable mappings).
