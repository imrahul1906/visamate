# Cover Letter Builder for Japan Visa Application

## Description

The **Cover Letter Builder** is a specialized feature that helps visa applicants generate, customize, and download professional cover letters for Japan Temporary Visitor Visa applications. The builder provides a guided two-step workflow:

1. **Step 1 (Inputs)**: Collects applicant information (travel details, employment/education, family ties, financial situation, sponsorship info)
2. **Step 2 (Preview & Edit)**: Generates a pre-filled cover letter with full inline editing capabilities

The generated letter is context-aware, automatically tailoring content based on applicant profile (employed, self-employed, student), sponsorship status, and family situation. Users can customize every paragraph and export the final document as a Word (.docx) file.

---

## Current Architecture

### Core Design Pattern

The module follows a **separation of concerns** architecture with distinct responsibility layers:

```
┌─────────────────────────────────────────────────────────────┐
│  CoverLetterWidget (Main Orchestrator)                      │
│  - State management (inputs, letter preview, validation)    │
│  - Step flow control (select → inputs → letter)             │
│  - Delegates to sub-components and services                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ coverLetterInputs│ │ coverLetterPreview│ │ coverLetterService
│ (React Component)│ │ (React Component) │ │ (Pure Logic)
│ - Form UI        │ │ - Letter display  │ │ - Validation
│ - Input handling │ │ - Inline editing  │ │ - Builders
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │                     │
        └─────────────────────┴─────────────────────┐
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌──────────────────────┐ ┌──────────────────────┐
        │ coverLetterDocx      │ │ coverLetterComponents
        │ (Export Logic)       │ │ (Reusable UI Blocks)
        │ - .docx generation   │ │ - InlineField
        └──────────────────────┘ │ - InlinePara
                                 │ - ContactRow
                    ┌────────────┴──────────────────┐
                    │                               │
                    ▼                               ▼
        ┌──────────────────────┐ ┌──────────────────────┐
        │ coverLetterTemplates │ │ coverLetterUtils
        │ (Static Defaults)    │ │ (Helpers & Seeding)
        │ - Section headings   │ │ - Date formatting
        │ - Default bullets    │ │ - State initialization
        └──────────────────────┘ └──────────────────────┘
                                         │
                                         ▼
                        ┌────────────────────────────┐
                        │ coverLetterStyles          │
                        │ (Injected CSS)             │
                        │ - Dark mode theming        │
                        │ - Form & preview styling   │
                        └────────────────────────────┘
```

### Key Concepts

- **No circular dependencies**: Exported types and utilities are organized to allow imports without creating loops
- **Pure business logic**: `coverLetterService.ts` contains all validation and paragraph-building logic—fully unit-testable
- **Inline editing**: All letter sections and paragraphs are editable directly in the preview (no separate edit mode)
- **Context-aware generation**: Content dynamically includes/excludes sections based on applicant profile and sponsorship
- **Template-driven**: Default text comes from a single `coverLetterTemplates.ts` source of truth

---

## File Information

### 1. **CoverLetterWidget.tsx** (Main Orchestrator)
**Role**: Top-level React component that orchestrates the entire workflow  
**Responsibilities**:
- Manages the multi-step flow: "select" → "inputs" → "letter"
- Holds all UI state (inputs, letter preview fields, validation errors)
- Bridges the ApplicantContext with form state
- Coordinates step transitions and generates initial letter content
- Handles export via `buildCoverLetterDocx`

**Key State**:
- `step`: Tracks current UI step
- `inputs`: Form data (travel, employment, family, etc.)
- `errors`: Validation messages
- `l*` prefixed states: Editable letter sections (lHeading, lIntro, lBullets, etc.)

**Imports From**: service, inputs component, preview component, templates, utils, docx builder

---

### 2. **coverLetterInputs.tsx** (Step 1: Data Collection)
**Role**: React component for the first wizard step  
**Responsibilities**:
- Renders form UI for collecting applicant information
- Groups fields into sections: Travel, Employment/Education, Sponsorship, Family, Contacts
- Shows/hides conditional fields (e.g., sponsor details only if sponsored)
- Displays validation errors if user attempts to proceed without required fields
- Calls `onProceed` callback to transition to Step 2

**Conditional Logic**:
- Shows "Company Name" only if `applicantProfile === "employed"`
- Shows "Institution Name" only if `applicantProfile === "student"`
- Shows "Sponsor Name/Rel" only if `sponsorshipType === "sponsored"`
- Emergency contacts section is always editable

**Imports From**: coverLetterComponents, coverLetterService (for profile checks)

---

### 3. **coverLetterPreview.tsx** (Step 2: Letter Editing)
**Role**: React component for viewing and editing the generated cover letter  
**Responsibilities**:
- Displays the complete cover letter layout
- Makes every paragraph, field, and section inline-editable
- Provides conditional sections based on sponsorship/profile
- Shows "Unfilled Required Fields" warning if download is attempted with missing data
- Handles download action

**Editable Elements**:
- Heading, recipient block, date, subject, salutation
- Introduction, bullet points
- All 10+ letter sections (purpose, immigration history, family ties, finance, etc.)
- Contact list (add/remove/edit contacts)
- Signature fields (name, passport number)
- Closing statement

**Imports From**: coverLetterComponents, coverLetterService (for profile checks)

---

### 4. **coverLetterService.ts** (Pure Business Logic)
**Role**: Core logic layer with no React dependencies  
**Responsibilities**:
- Defines TypeScript interfaces for inputs, validation, and context
- Provides validation functions for form data and letter preview completeness
- Implements profile check helpers: `isEmployed()`, `isStudent()`, `isSponsored()`
- Includes date formatting utilities: `fmtDate()`, `fmtDateEnd()`, `today()`
- Paragraph builders for dynamic content generation based on applicant profile

**Key Types**:
- `CoverLetterInputs`: User-provided form data
- `ApplicantContext`: From ApplicantContext (applicant name, travel dates, cities, visa type, etc.)
- `ValidationErrors`: Field-level error messages
- `LetterPreviewState`: Fields that must be non-empty before export

**Key Functions**:
- `validateCoverLetterInputs()`: Checks required fields in step 1
- `validateLetterPreview()`: Checks required fields before download
- `isEmployed()`, `isStudent()`, `isSponsored()`: Profile classification helpers
- `fmtDate()`, `fmtDateEnd()`: ISO date to "1 March 2025" format conversions
- Paragraph builders (internal): Generate section content based on inputs

**Imports From**: None (pure logic, no external dependencies)

---

### 5. **coverLetterDocx.ts** (Export Engine)
**Role**: Converts letter state to a Word document  
**Responsibilities**:
- Async builder function that generates a .docx file as a Blob
- Uses the `docx` npm package to create formatted Word documents
- Applies proper formatting: headings, bold text, numbered lists, contact tables
- Generates conditional sections based on sponsorship status
- Creates formatted contact table with 4-column layout (Name, Relation, Phone, Email)

**Main Export**:
- `buildCoverLetterDocx(data)`: Takes a `CoverLetterDocxData` object and returns a Promise<Blob>

**Imports From**: coverLetterComponents (Contact type), coverLetterService (isSponsored check), docx package

---

### 6. **coverLetterComponents.tsx** (Reusable UI Building Blocks)
**Role**: Presentational components with no business logic  
**Responsibilities**:
- Provides reusable input components for the builder
- Auto-resizing textarea for paragraph editing
- Inline field component for single-line text (with placeholder)
- Contact row component for managing emergency contact entries

**Components**:
- `InlineField`: Single-line editable field styled like letter text
- `InlinePara`: Multi-line auto-resizing textarea for paragraphs
- `ContactRow`: Editable row for contact entries (name, relation, phone, email)

**Imports From**: React hooks (useState, useRef, useEffect)

---

### 7. **coverLetterTemplates.ts** (Static Content Repository)
**Role**: Single source of truth for all default/template text  
**Responsibilities**:
- Exports `COVER_LETTER_TEMPLATES` object with all static strings
- Defines section headings (e.g., "The Purpose of my Visit")
- Defines section intros (explanatory text before editable content)
- Defines default bullet points and support documents
- Defines closing statement template

**Key Values**:
- `heading`: "COVER LETTER"
- `toBlock`: Recipient details (Embassy of Japan, Delhi)
- `salutation`: "To whom it may concern,"
- `closing`: Closing statement with signature block
- Section templates: `secDocs`, `secPurpose`, `secFinance`, `secSponsor`, etc.
- Intro texts for each section

**Imports From**: None

---

### 8. **coverLetterUtils.ts** (Helper Functions & State Seeding)
**Role**: Utility functions for initialization and formatting  
**Responsibilities**:
- Re-exports date and profile check helpers from `coverLetterService`
- Provides `seedLetterState()` function: generates initial letter preview state from inputs + context
- Builds context-aware default content for bullets and document rows

**Key Function: `seedLetterState(inputs, ctx)`**
- Takes `CoverLetterInputs` and `ApplicantContext`
- Returns an object mapping field names to initial values for all `l*` states
- Auto-generates bulleted intro (4 default + sponsor info if applicable + contacts)
- Auto-generates supporting documents list (tailored to profile)
- Creates subject line with applicant name
- Builds intro paragraph with cities visited, visa type, etc.
- Intelligently builds family ties description based on marital/parent/children status

**Imports From**: coverLetterService, coverLetterTemplates

---

### 9. **coverLetterStyles.ts** (Stylesheet)
**Role**: All CSS for the cover letter builder  
**Responsibilities**:
- Defines CSS variables for dark mode theming (colors, spacing, fonts)
- Styles for each component: select screen, input form, preview letter, buttons
- Responsive layout rules
- Inline field styling (transparent background until focused)
- Print-friendly styles for .docx export preview

**Key CSS Classes**:
- `.cl-select`: Initial selection screen
- `.cl-inputs-body`: Step 1 form layout
- `.cl-letter`: Step 2 letter container
- `.cl-inline-field`, `.cl-inline-para`: Editable content
- `.cl-topbar`, `.cl-section`, `.cl-field-row`: Layout scaffolding
- `.cl-step`, `.cl-step-line`: Progress indicator

**Injected Into**: CoverLetterWidget as a `<style>` tag

---

## Important Method Descriptions

### In `coverLetterService.ts`

#### `validateCoverLetterInputs(inputs: CoverLetterInputs): ValidationErrors`
Validates form data before allowing transition to step 2.
- Checks required fields: `departureCity`, `countries Visited`, `applicantProfile`, `purpose`, `bankBalance`
- Conditional checks: If employed, `companyName` is required; if student, `institutionName` is required
- If sponsored, `sponsorName`, `sponsorRel` are required
- Returns object where keys are field names and values are error messages (empty object = all valid)

#### `validateLetterPreview(state: LetterPreviewState): ValidationErrors`
Validates letter before download.
- Ensures 4 critical fields are non-empty: `lPurposeDetail`, `lFinance`, `lSigName`, `lSigPassport`
- Returns errors if any field is blank

#### `isEmployed(profile: string): boolean` / `isStudent()` / `isSponsored()`
Profile classification helpers. Used throughout to conditionally include/exclude content and form fields.

#### `fmtDate(iso: string): string`
Converts ISO date ("2025-03-01") to formatted string ("1 March 2025").
- Uses `en-GB` locale for consistent formatting
- Returns "[DATE]" placeholder if input is undefined

#### `fmtDateEnd(iso: string, days: number): string`
Converts ISO date + duration to end date formatted string.
- Adds `(days - 1)` to the start date, then formats
- Used to display trip end date ("15 May 2025") from start date and duration

### In `coverLetterUtils.ts`

#### `seedLetterState(inputs, ctx): Object`
The "brain" of content generation. Builds initial letter preview state by:
1. Extracting context data (cities, visa type, applicant name)
2. Building family description string based on married/parents/children flags
3. Creating context-aware document rows (NOC if employed, sponsor docs if sponsored, etc.)
4. Building bullet points (always 4 defaults + sponsor info if applicable + contacts)
5. Creating intro paragraph with applicant name and trip details
6. Generating subject line and other section intros

**Returns**: Object like `{ lHeading: "...", lToBlock: "...", lIntro: "...", ... }`

### In `coverLetterDocx.ts`

#### `buildCoverLetterDocx(data: CoverLetterDocxData): Promise<Blob>`
Async function that generates a .docx Blob.
- Dynamically imports the `docx` package (for code splitting)
- Builds document structure: heading, recipient block, date, subject, salutation, sections
- Creates numbered lists for bullets and documents
- Conditional sections: sponsor section only if sponsored
- Contact table with 4-column layout
- Returns Blob ready for download

### In `CoverLetterWidget.tsx`

#### `handleProceedToLetter()`
Triggered when user clicks "Preview Letter" in step 1.
- Validates inputs via `validateCoverLetterInputs()`
- If errors, sets `attempted = true` to show validation messages
- If valid, calls `seedLetterState()` to generate initial letter preview state
- Sets all `l*` states from seeded data
- Transitions to step 2

#### `handleDownload()`
Triggered when user clicks "Download" in step 2.
- Checks for unfilled required fields via `validateLetterPreview()`
- Shows warning if data is incomplete
- If valid, calls `buildCoverLetterDocx()` with all current `l*` states
- Downloads resulting Blob as file (named with applicant name + date)

---

## Entry Point

**Primary Entry**: `CoverLetterWidget` (default export from `CoverLetterWidget.tsx`)

**How It's Used**:
1. Imported by the parent Documents feature or via dynamic lazy loading
2. Expects `useApplicant()` context to be available (provides `ctx` and `update`)
3. Renders a self-contained widget that manages its own state and UI
4. Initial step is "select" (displays overview + "Build Letter" button)

**Required Context**:
- `ApplicantContext` (from `@/lib/context/ApplicantContext`) must be wrapping the component
- Provides: applicant name, passport number, travel start date, duration, cities, profile type, visa type, etc.

**Example Integration**:
```tsx
import CoverLetterWidget from "@/features/documents/cover_letter/CoverLetterWidget";

export default function DocumentsPage() {
  return (
    <ApplicantContextProvider>
      {/* Other document widgets */}
      <CoverLetterWidget />
    </ApplicantContextProvider>
  );
}
```

---

## Exit Point

**Primary Exit**: Browser file download via `buildCoverLetterDocx()` → Blob → download trigger

**Flow**:
1. User completes step 2 preview and clicks "Download"
2. Validation passes
3. `buildCoverLetterDocx()` is called with current letter state
4. Docx library generates a formatted Word document Blob
5. Browser triggers download dialog
6. File saved as: `{applicant_name}_Cover_Letter_{date}.docx`

**Secondary Exit**: User clicks "Back" button
- Returns to previous step (inputs → select, or preview → inputs)
- All state is retained (user can resume editing)

**Data Persistence**:
- Letter state is held in React component state only (not persisted to storage)
- When user leaves the page, draft is lost
- Applicant context data is preserved via `ApplicantContext`
- Suggestion: For phase 2, integrate localStorage or backend API to save drafts

---

## Design Decisions

### Why Pure Business Logic?
- `coverLetterService.ts` has no React dependencies, making it trivially unit-testable
- Validation, formatting, and paragraph building can be tested independently of UI
- Easy to reuse logic in other contexts (backend, CLI, etc.)

### Why Inline Editing?
- Users expect WYSIWYG editing (what you see is what you download)
- No separate edit/preview modes to confuse the UX
- Real-time visual feedback as users type

### Why Seed State?
- Initial letter content is intelligently generated from inputs + context
- Dramatically reduces blank-page friction
- Users see a complete, valid letter immediately—they refine, not write from scratch

### Why Conditional Sections?
- Cover letters vary significantly by applicant profile (employed vs. student vs. sponsored)
- Showing irrelevant sections confuses users
- Dynamic generation keeps the letter focused and concise