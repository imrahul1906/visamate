# Visa Assistant Platform – Technical Documentation

**Version:** 2.0 | **Last Updated:** 2026-04-24

---

## 1. Project Overview

A web-based platform that helps users in India prepare for visa applications without relying on agents. The system provides step-by-step guidance, personalized document requirements, and generates supporting documents (cover letter, itinerary, checklist), enabling users to confidently complete official visa applications.

**Core Philosophy:** "Prepare the user perfectly before they visit official sites."

**Target Market:** India-based visa applicants (initially)

---

## 2. Problem Statement

### User Pain Points:
- Don't understand visa requirements clearly (fragmented info across websites)
- Get confused by multiple official portals
- Make mistakes in forms and documents
- Unknowingly miss requirements
- **Pay agents ₹20,000-50,000 to help with what should be self-service**

### Market Opportunity:
- ~5 million Indians apply for visas annually
- ~60% use agents (unnecessary cost)
- High demand from middle-class professionals

---

## 3. Solution Overview

A **guided visa preparation platform** that:
- ✅ Simplifies requirements (country → visa type → checklist)
- ✅ Provides step-by-step form assistance
- ✅ Generates ready-to-use documents
- ✅ Prepares users before official submission
- ✅ Works offline (low-bandwidth friendly)
- ✅ No permanent data storage (privacy-first)

---

## 4. Core Features (MVP)

### 4.1 Visa Selection Flow (Entry Point)

**User selects:**
1. Destination country (dropdown/search)
2. Visa type (e.g., Work, Tourist, Student, Medical)
3. Applicant scenario:
   - Self (single applicant)
   - Spouse (couple applying together)
   - Family (multiple family members)
   - Business (for business visas)

**Output:** Personalized requirements dashboard

---

### 4.2 Personalized Requirements Engine

**Displays for selected country + visa type + scenario:**

```
┌─────────────────────────────────────────┐
│ JAPAN - WORK VISA (Self)                │
├─────────────────────────────────────────┤
│ Processing Time: 15-20 business days    │
│ Application Fee: ₹8,000                 │
│ Validity: 5 years (after approval)      │
├─────────────────────────────────────────┤
│ REQUIRED DOCUMENTS (7 total)            │
│                                         │
│ ✓ Passport (Original, 6+ months valid) │
│ ✓ Certificate of Employment            │
│ ✓ Salary Slip (Last 3 months)          │
│ ✓ Bank Statement (Last 6 months)       │
│ ✓ Job Offer Letter                     │
│ ⊘ Cover Letter (Optional, recommended) │
│ ✓ Company Registration Certificate     │
├─────────────────────────────────────────┤
│ PHOTO SPECIFICATIONS                    │
│ • Size: 35mm × 45mm                    │
│ • Background: White                    │
│ • Color: Yes                           │
│ • Digital copy: Yes (200 DPI)          │
├─────────────────────────────────────────┤
│ [Start Guided Form]  [Download as PDF] │
└─────────────────────────────────────────┘
```

**Data sources:** Manual database (from VFS websites, embassy portals)

**Updated via:** Change detection system (alerts on updates)

---

### 4.3 Guided Form Flow (Core Value Add)

**Step-by-step form wizard** (not dropdown help):

```
Step 1: Personal Information
├── Full name (as in passport)
├── Date of birth
├── Nationality
├── Gender
└── Marital status

Step 2: Passport Details
├── Passport number
├── Issue date
├── Expiry date
├── Country of issue
└── [Warning if < 6 months validity]

Step 3: Travel Information
├── Planned arrival date
├── Planned departure date
├── Cities/regions visiting
├── Purpose of visit
└── [Warning if dates exceed visa validity]

Step 4: Employment Details (if applicable)
├── Current employer
├── Job title
├── Salary (annual)
├── Employment type (permanent/contract)
└── [Prefill if resume uploaded]

Step 5: Accommodation
├── Where you'll stay
├── Booking reference
└── [Connect to itinerary feature]

Step 6: Financial Information
├── Monthly income
├── Bank balance
├── Source of funds
└── [Alert if below minimum requirement]

Step 7: Review & Generate
└── Summary of all answers
```

**Key Features:**
- Auto-save to browser (IndexedDB) after each step
- Progress bar showing completion
- "Back" button to edit previous answers
- "Save Progress" downloads JSON file
- "Import Progress" to restore from file

**Output:** Structured JSON data ready to fill official forms

---

### 4.4 Application Form Assistance

**Three different methods based on country:**

#### **Method 1: PDF Download + Guided Fill** (Japan, Korea, Germany)

```
Scenario: Form is a downloadable PDF

Flow:
1. System shows: "Japan requires official form VFS-JPN-001"
2. Provides: Download link to VFS website
3. User downloads PDF locally
4. System shows: Field-by-field mapping guide

Guide shows:
┌──────────────────────────────────────────────────┐
│ PDF FORM FIELD → YOUR ANSWER                    │
├──────────────────────────────────────────────────┤
│ Field 1: "Full Name"                            │
│ → Your answer: John Doe                         │
│ → Format: UPPERCASE preferred                   │
│ → [Copy to clipboard]                           │
│                                                  ���
│ Field 2: "Passport Number"                      │
│ → Your answer: N1234567                         │
│ → Note: Match exactly from passport            │
│ → [Copy to clipboard]                           │
│                                                  │
│ Field 3: "Date of Birth"                        │
│ → Your answer: 15-JAN-1990                      │
│ → Format: DD-MMM-YYYY                           │
│ → [Copy to clipboard]                           │
└──────────────────────────────────────────────────┘

5. User fills PDF locally (Acrobat/Preview)
6. User prints and submits to VFS
```

**Advantages:** No ToS violation, stays within legal boundaries

---

#### **Method 2: Online Portal Navigation** (Some countries with web portals)

```
Scenario: VFS has online application portal

Flow:
1. System detects: "Korea uses online VFS portal"
2. Provides: Direct link to official portal
3. User visits VFS portal in one tab
4. Your system in another tab shows guidance

Parallel guidance:
┌────────────���────────────────────────────────────┐
│ OFFICIAL PORTAL              │ YOUR GUIDANCE    │
├───────────────���──────────────┼──────────────────┤
│ [VFS Portal]                 │                  │
│ Question: Passport No?       │ → Enter:         │
│ [__________]                 │   N1234567       │
│                              │ → Tip: Check     │
│                              │   passport bio   │
│                              │   page           │
│                              │                  │
│ Question: Employment Status? │ → Select:        │
│ [Dropdown ▼]                 │   "Employed"     │
│ - Employed                   │ → Note: Choose   │
│ - Unemployed                 │   your current   │
│ - Student                    │   status         │
└──────────────────────────────┴──────────────────┘

5. User fills portal with guidance from you
6. User submits on official site
```

**Your role:** Guide only, never touch their data

---

#### **Method 3: Form Pre-generation** (Future, if applicable)

```
Scenario: Official form has fillable PDF template (rare initially)

Flow:
1. User fills your guided form
2. Your system auto-generates official form
3. Pre-filled with user answers
4. User downloads ready-to-submit form
5. User prints and submits to VFS

⚠️ NOTE: Only for countries where:
├── Form is standardized digital template
├── Forms have data bindings
└── You have explicit permission from VFS

Action for MVP: Research and implement only if clearly applicable
```

---

### 4.5 Document Generator

#### **a) Cover Letter Generator**

```
Input from user:
├── Visa type (Work, Tourist, Student, etc.)
├── Country destination
├── Purpose (brief reason)
├── Duration (how long stay)
└── Employment/study details (if applicable)

Template variants by:
├── Visa type
├── Country cultural norms
└── Applicant scenario (self/family)

Example output (Work Visa to Japan):
┌────────────────────────────────────────┐
│ COVER LETTER - JAPAN WORK VISA         │
├────────────────────────────────────────┤
│                                        │
│ Date: 24-04-2026                       │
│                                        │
│ To the Embassy of Japan,               │
│ New Delhi, India                       │
│                                        │
│ Dear Sir/Madam,                        │
│                                        │
│ I am writing to request a work visa... │
│ [Auto-generated content based on:      │
│  - User's job title & salary]          │
│ [Auto-generated content based on:      │
│  - User's experience level]            │
│ [Auto-generated content based on:      │
│  - Planned stay dates]                 │
│                                        │
│ Yours sincerely,                       │
│ John Doe                               │
│                                        │
└────────────────��───────────────────────┘

Output formats:
├── DOCX (Microsoft Word) → User can edit
├── PDF (finalized version)
└── Plain text (copy-paste option)
```

---

#### **b) Itinerary Generator**

```
Input from user:
├── Travel dates (arrival - departure)
├── Cities to visit
├── Accommodation details
├── Purpose (business/tourism/study)
└── Special requirements (visa limits)

Smart features:
├── Detects visa duration limits
│   └── Example: "Max 30-day stay" → warns if itinerary is 35 days
├── Suggests logical routing
│   └── Example: "Delhi → Mumbai → Goa" vs "Delhi → Goa → Mumbai"
├── Adds buffer days (if applicable)
├── Includes accommodation details
└── Calculates total days

Output (Day-by-day):
┌─────────────────────────────────┐
│ JAPAN TRAVEL ITINERARY          │
├─────────────────────────────────┤
│ Duration: 10-20 April 2026 (10 days) │
│ Visa Type: Work Visa (max 90 days) ✅ │
├─────────────────────────────────┤
│                                 │
│ Day 1-2: Tokyo                  │
│ ├─ Arrive: 10 April, 2:00 PM    │
│ ├─ Hotel: Shinjuku Inn          │
│ ├─ Activities: Office visit     │
│ └─ Depart: 12 April             │
│                                 │
│ Day 3-5: Osaka                  │
│ ├─ Travel: Shinkansen           │
│ ├─ Hotel: Business Hotel        │
│ ├─ Activities: Company tour     │
│ └─ Depart: 14 April             │
│                                 │
│ Day 6-10: Kyoto                 │
│ ├─ Travel: Local train          │
│ ├─ Hotel: Traditional Ryokan    │
│ ├─ Activities: Sightseeing      │
│ └─ Depart: 20 April (Return)    │
│                                 │
└─────────────────────────────────┘

Output formats:
├── PDF (formatted itinerary)
├── DOCX (editable version)
└── Text file (simple list)
```

---

#### **c) Checklist Generator**

```
Generated based on: Country + Visa Type + Scenario

Example (Japan Work Visa - Self):
┌────────────────────────────────────────┐
│ JAPAN WORK VISA CHECKLIST              │
├────────────────────────────────────────┤
│                                        │
│ BEFORE APPLYING (2-3 weeks)            │
│ ☐ Get police clearance certificate    │
│   └─ Apply at: Local police station   │
│   └─ Takes: 10 days                   │
│                                        │
│ ☐ Get medical report (if required)    │
│   └─ Visit: Government hospital       │
│   └─ Cost: ₹500-1000                 │
│                                        │
│ DOCUMENTS TO GATHER                    │
│ ☐ Passport (original + copy)          │
│   └─ Check: Valid for 6+ months       │
│   └─ Pages needed: 2+ blank pages     │
│                                        │
│ ☐ Employment certificate              │
│   └─ Get from: HR department          │
│   └─ Format: Signed, on letterhead    │
│                                        │
│ ☐ Salary slips (last 3 months)        │
│   └─ Get from: Payroll                │
│   └─ Must include: Gross salary       │
│                                        │
│ ☐ Bank statement (last 6 months)      │
│   └─ From: Your bank                  │
│   └─ Minimum balance: ¥1,000,000      │
│                                        │
│ FORMS & DOCUMENTS TO GENERATE          │
│ ☐ Cover letter                        │
│   └─ Generated by system              │
│   └─ Download: PDF format             │
│                                        │
│ ☐ Itinerary                           │
│   └─ Generated by system              │
│   └─ Download: PDF format             │
│                                        │
│ BEFORE SUBMISSION                      │
│ ☐ Print all documents                 │
│ ☐ Get documents notarized (if needed) │
│ ☐ Make copies of originals            │
│ ☐ Organize in correct order           │
│ ☐ Fill official form (with guidance)  │
│                                        │
│ SUBMISSION CHECKLIST                   │
│ ☐ All documents present               │
│ ☐ All signatures in place             │
│ ☐ All copies included                 │
│ ☐ Payment processed                   │
│ ☐ Ready to submit to VFS              │
│                                        │
│ TIMELINE                               │
│ Today: Start gathering documents      │
│ Day 10: Submit to VFS                 │
│ Day 25: Visa decision expected        │
│                                        │
└────────────────────────────────────────┘

Interactive features:
├── Check off items as you complete them
├── Expandable sections (click for more details)
└── Estimated timelines per task
```

---

### 4.6 Visa Kit Download (ZIP Bundle)

**After user completes flow:**

```
Generate & offer download:

Visa_Application_Kit_Japan_WorkVisa.zip
├── 01_Cover_Letter.pdf
├── 02_Itinerary.pdf
├── 03_Checklist.pdf
├── 04_Form_Field_Guide.pdf
│   └── (Field-by-field mapping for official form)
├── 05_Document_Summary.txt
│   └── (Quick reference: what's required)
├── 06_Timeline.txt
│   └── (Important dates & deadlines)
├── 07_VFS_Contact_Info.txt
│   └── (Embassy, VFS office addresses)
└── README.txt
    └── "How to use this kit" instructions

Total size: ~2-3 MB
Time to generate: < 3 seconds
Storage: User's device only (not on server)
```

---

### 4.7 Session & Progress Management

#### **Storage Strategy:**

**Option A: Browser-Only (MVP - Recommended)**
```
Storage location: Browser IndexedDB
├── Automatically saves after each step
├── Survives browser refresh
├── Lost if browser cache cleared
├── No server-side data

Progress saved:
{
  "country": "Japan",
  "visaType": "Work Visa",
  "scenario": "self",
  "step": 3,
  "formData": {
    "fullName": "John Doe",
    "passportNumber": "N1234567",
    "dob": "1990-01-15",
    ...
  },
  "lastSaved": "2026-04-24T10:30:00Z",
  "expiresAt": "2026-05-01T10:30:00Z"
}
```

**Option B: Export/Import (Always Offered)**
```
User can manually:
├── Download progress as JSON file
├── Keep personal backup
├── Import on different device
├── Restore if browser cleared

File format: `visa_progress_2026_04_24.json`
Size: < 50KB
User controls all data
```

---

#### **Session Lifecycle:**

```
Session Creation:
├── User selects country/visa
└── Session starts, auto-saves enabled

Active Session:
├── Auto-save after each step (500ms debounce)
├── Progress bar shows completion
├── "Download Progress" button visible
└── Session ID generated (browser-local)

Session Expiry:
├── 7 days of inactivity → Session expires
├── 30 days of data creation → Auto-delete
├── User warning: "Session expires in 2 days"
├── Option to extend or download

Session Recovery:
├── User imports JSON file
├── Continues from last saved step
└── Can switch devices
```

---

### 4.8 Smart Assist Mode

**For countries with online portals:**

```
While user fills official VFS portal:

Your system provides:
├── Field-by-field guidance (sidebar)
├── Copy-ready answers (one-click copy)
├── Format reminders (uppercase, date format, etc.)
├── Validation tips (required fields)
└── Real-time warnings (invalid dates, short passport validity)

Example scenario:
┌──────────────────────────────────────────────────┐
│ USER FILLING KOREA ONLINE PORTAL                │
├──────────────────────────────────────────────────┤
│                                                  │
│ [VFS Portal - Tab 1]     [Your System - Tab 2]  │
│                          │                      │
│ Field: Full Name?        │ Your answer:        │
│ [_____________]          │ John Doe            │
│                          │ [Copy]              │
│                          │ Tip: Match passport │
│                          │                      │
│ Field: Passport #?       │ Your answer:        │
│ [_____________]          │ N1234567            │
│                          │ [Copy]              │
│                          │ Tip: No spaces      │
│                          │                      │
│ Field: DOB?              │ Your answer:        │
│ [_____________]          │ 15-01-1990          │
│                          │ [Copy]              │
│                          │ ⚠️ Format:          │
│                          │    DD-MM-YYYY       │
│                          │                      │
└──────────────────────────────────────────────────┘
```

---

## 5. Data Strategy

### 5.1 Initial Data Collection

**MVP Launch Countries: 2-3**
```
Tier 1 (High demand, well-documented):
├── Japan (Work, Tourist, Student visas)
├── Korea (Work, Tourist, Student visas)
└── USA (Tourist, Work visa - if applicable)
```

**Data sources:**
- VFS Global official websites
- Embassy official websites
- Official visa portals
- Government immigration websites

**Effort:** ~30 mins per country/visa type

**Timeline:** 1 week for 2-3 countries

---

### 5.2 Data Structure

**Database Schema (PostgreSQL):**

```
Countries Table:
├── id (primary key)
├── code (e.g., "JP", "KR")
├── name (e.g., "Japan", "Korea")
├── vfs_portal_url
├── embassy_website
├── created_at
└── updated_at

Visa Types Table:
├── id
├── country_id (foreign key)
├── name (e.g., "Work Visa", "Tourist Visa")
├── description
├── processing_days
├── fee_inr (application fee in Indian rupees)
├── form_download_url (official VFS link)
├── application_method (enum: "pdf_download", "online_portal", "auto_generate")
├── max_stay_days (e.g., 90, 180)
├── validity_years (how long visa is valid)
├── scraped_at (last update from VFS)
└── created_at

Document Requirements Table:
├── id
├── visa_type_id (foreign key)
├── doc_name (e.g., "Passport", "Certificate of Employment")
├── is_required (boolean)
├── description (detailed requirement)
├── accepted_formats (e.g., "PDF, JPG, PNG")
├── min_validity (e.g., "6 months" for passport)
├── notes (special considerations)
├── example_image_url (optional reference image)
└── scraped_at

Scenarios Table:
├── id
├── visa_type_id
├── scenario_name (e.g., "self", "spouse", "family")
├── additional_docs (extra docs for this scenario)
└── special_requirements

Change Tracking Table:
├── id
├── country_id
├── visa_type_id
├── vfs_url
├── last_hash (MD5 hash of page content)
├── last_checked
├── status (enum: "checked", "changed", "error")
├── change_notes (what changed)
└── checked_at

Scraper Logs Table:
├── id
├── country_code
├── visa_type
├── status (success, failed, partial)
├── documents_found
├── error_message
├── run_at
└── duration_seconds
```

---

### 5.3 Change Detection System

#### **Monitoring Strategy:**

**Level 1: HTML Content Hash**
```
Daily task:
1. Fetch VFS page for each country/visa combo
2. Calculate MD5 hash of HTML content
3. Compare with hash stored in DB
4. If different → Alert

Example:
├── Japan Work Visa page
├── Previous hash: a1b2c3d4e5f6...
├── New hash: z9y8x7w6v5u4...
├── Status: ❌ CHANGED
└── Alert sent to admin
```

**Level 2: PDF Metadata Hash**
```
Check PDF files:
1. Download official form PDF
2. Check PDF modification date + header hash
3. Compare with previous version
4. If different → Alert

Example:
├── Japan Form VFS-JPN-001.pdf
├── Last modified: 2026-04-15
├── New modified: 2026-04-24
├── Status: ⚠️ Updated
└── Alert sent to admin
```

**Level 3: Keyword Monitoring**
```
Search for critical keywords:
├── "Required" vs "Optional"
├── "Fee" amounts
├── "Processing time"
├── "Documents"
├── "Expiry"

If keyword text changes significantly:
├── Flag for review
├── Alert admin
└── Don't auto-update (manual review needed)
```

---

#### **Alert Process:**

```
Step 1: Script detects change (2 AM daily)
        ↓
Step 2: Send alert notification
        ├── Slack: "⚠️ Japan Work Visa page changed"
        ├── Email: Change summary
        └── Dashboard: Shows pending changes
        ↓
Step 3: Admin manually reviews change
        ├── Visits VFS page
        ├── Reads full requirements
        ├── Notes what changed
        └── Categorizes severity
        ↓
Step 4: Categorize change
        ├── "Minor" (formatting, typo)
        │   └── Log and skip update
        ├── "Important" (new doc, fee change)
        │   └── Update DB + test
        └── "Structural" (form redesign)
            └── Deep review + test required
        ↓
Step 5: Update database
        ├── Modify affected records
        ├── Update timestamp
        ├── Test changes in frontend
        └── Document change in logs
        ↓
Step 6: Notify users (optional)
        └── "Japan requirements updated, review here"
```

---

#### **Automation Script (Pseudo-code):**

```python
Run daily at 2 AM UTC:

for each (country, visa_type):
    url = get_vfs_url(country, visa_type)
    
    # Fetch current page
    current_html = fetch_page(url)
    current_hash = md5(current_html)
    
    # Get previous hash from DB
    previous_hash = db.get_last_hash(country, visa_type)
    
    # Compare
    if current_hash != previous_hash:
        alert_admin(
            title=f"{country} {visa_type} page changed",
            url=url,
            previous_hash=previous_hash,
            current_hash=current_hash
        )
        db.update_status(country, visa_type, "changed")
    else:
        db.update_status(country, visa_type, "checked")
    
    # Log the check
    db.insert_log(
        country=country,
        visa_type=visa_type,
        status="success",
        run_at=now()
    )

# Alert if scraper itself fails
if any_failed_checks:
    alert_admin("Scraper failed for some countries")
```

---

### 5.4 Tiered Coverage Plan

**Phase 1 (MVP Launch) - Tier 1:**
```
High-demand countries, well-documented:
├── Japan (2-3 visa types)
├── Korea (2-3 visa types)
└── 1 other (based on research)

Time to add: ~5 hours
Launch: Week 6 (MVP)
```

**Phase 2 (2-3 months after launch) - Tier 2:**
```
Add popular destinations:
├── USA
├── UK
├── Canada
├── Australia
├── Germany
├── Singapore
└── UAE

Time to add: ~1 hour per country
```

**Phase 3 (6 months after launch) - Tier 3:**
```
Expand coverage:
├── All major destinations (50+ countries)
├── Multiple visa types per country
└── Scenario variants (self, spouse, family)

Note: Later countries may have basic info only
(requirements + form links, without full generation)
```

---

## 6. Technical Architecture

### 6.1 Frontend Architecture

**Framework:** Next.js 14+ (React)

**Why:** 
- Server-side rendering for initial load
- Static generation for country/visa data
- Built-in API routes (no separate backend needed initially)
- Great developer experience
- Easy deployment (Vercel)

**Key Libraries:**
```
├── React Hook Form (form handling)
├── Zod (form validation)
├── TailwindCSS (styling)
├── Zustand (state management)
├── pdfkit or jsPDF (PDF generation, client-side)
├── docx.js (DOCX generation)
├── IndexedDB wrapper (local storage)
└── Next.js (framework)
```

**Folder Structure:**
```
frontend/
├── app/
│   ├── (wizard)/
│   │   ├── page.tsx (entry point)
│   │   ├── country/page.tsx
│   │   ├── visa-type/page.tsx
│   │   ├── scenario/page.tsx
│   │   ├── requirements/page.tsx
│   │   └── form/[step]/page.tsx
│   ├── api/
│   │   ├── countries/route.ts
│   │   ├── visa-types/route.ts
│   │   ├── requirements/route.ts
│   │   └── generate/[docType]/route.ts
│   └── layout.tsx
├── components/
│   ├── WizardHeader.tsx
│   ├── ProgressBar.tsx
│   ├── FormStep.tsx
│   ├── DocumentPreview.tsx
│   └── ...
├── lib/
│   ├── db/
│   │   ├── indexeddb.ts (IndexedDB wrapper)
│   │   └── migrations.ts
│   ├── generators/
│   │   ├── coverLetter.ts
│   │   ├── itinerary.ts
│   │   ├── checklist.ts
│   │   └── zipBundle.ts
│   ├── api.ts (API calls to backend)
│   └── utils.ts
├── hooks/
│   ├── useWizardState.ts
│   ├── useFormProgress.ts
│   └── useSessionStorage.ts
└── public/
    ├── templates/
    │   ├── coverLetterTemplate.txt
    │   ├── itineraryTemplate.txt
    │   └── ...
    └── ...
```

---

### 6.2 Backend Architecture

**Framework:** Node.js/Express or FastAPI

**For MVP:** Minimal backend needed
- Just serve country/visa data
- Handle document generation (CPU intensive)
- Store change detection logs

**Key Libraries (Node.js):**
```
├── Express.js (web framework)
├── PostgreSQL + node-postgres (database)
├── node-cron (change detection scheduler)
├── pino (logging)
├── joi or zod (validation)
├── dotenv (env variables)
└── axios (HTTP requests for change detection)
```

**API Endpoints:**
```
GET /api/countries
  ├── Returns: List of all countries
  └── Cache: 1 day

GET /api/countries/:countryId/visa-types
  ├── Returns: Visa types for country
  └── Cache: 1 day

GET /api/visa-types/:visaTypeId/requirements
  ├── Returns: Document requirements, fees, timeline
  └── Cache: 1 day (or on change detection)

GET /api/requirements/:visaTypeId/scenarios/:scenario
  ├── Returns: Scenario-specific requirements
  └── Cache: 1 day

POST /api/generate/cover-letter
  ├── Input: User data from form
  ├── Output: PDF cover letter
  ├── Execution time: < 2 seconds
  └── No storage

POST /api/generate/itinerary
  ├── Input: Travel dates, cities
  ├── Output: PDF itinerary
  ├── Execution time: < 2 seconds
  └── No storage

POST /api/generate/checklist
  ├── Input: Country, visa type, scenario
  ├── Output: PDF checklist
  ├── Execution time: < 1 second
  └── No storage

POST /api/generate/visa-kit
  ├── Input: All user data
  ├── Output: ZIP bundle with all documents
  ├── Execution time: < 5 seconds
  └── Auto-delete from server after 1 hour

GET /api/health
  ├── Returns: Service status
  ├── Includes: Last change detection run
  └── Cache: None
```

---

### 6.3 Database

**Choice:** PostgreSQL (managed service)

**Hosting Options:**
```
Option 1: Supabase (Recommended for MVP)
├── Pricing: Free tier (500MB) → $25/mo (10GB)
├── Features: Auto backups, REST API, real-time
├── Easy setup: 5 minutes
└── Good for: Hobby → Production

Option 2: Railway.app
├── Pricing: Pay-as-you-go ($0.25/GB/mo)
├── Free tier: $5 credit/month
└── Good for: Experimentation

Option 3: DigitalOcean Database
├── Pricing: $15/month (managed)
├── Good for: Production use
└── Combined with Droplet ($6/mo) for scraper

Option 4: Self-hosted on VPS
├── Pricing: $5-10/month
├── Maintenance: You handle backups
└── Good for: Long-term cost reduction
```

**Recommendation for MVP:** Supabase Free Tier

**Schema:** (See section 5.2)

---

### 6.4 Change Detection Service

**Runs on:** GitHub Actions (free) OR Simple cron job

**Option A: GitHub Actions (Free)**
```
.github/workflows/change-detection.yml

Runs: Daily at 2 AM UTC
Execution: < 1 minute for 5 countries
Cost: Free (well within limits)
Maintenance: Zero

Steps:
1. Fetch VFS pages
2. Calculate hashes
3. Compare with DB
4. Send alerts if different
5. Log results
```

**Option B: Scheduled cron on VPS**
```
VPS with PostgreSQL

Cron job: 0 2 * * * /usr/bin/python3 /app/change_detection.py

Cost: Included in VPS ($5-10/mo)
Maintenance: Check logs weekly
```

**Recommendation:** GitHub Actions for MVP

---

### 6.5 Document Generation

**Method:** Client-side + Server-side

**Client-side (Browser):**
- Fast response
- No server load
- User data never leaves browser
- Good for: Checklists, simple documents

**Server-side (Backend):**
- Better control over formatting
- Can use advanced templates
- Good for: Professional-looking PDFs, complex layouts
- Generates on-demand, deleted after 1 hour

**Specific Approach:**
```
Cover Letter:
├── Server generates (better formatting)
├── Uses template + user data
├── Returns PDF in < 2 seconds
└── User downloads immediately

Itinerary:
├── Server generates (complex layout)
├── Calendar + day-by-day planning
├── Returns PDF in < 2 seconds
└── User downloads immediately

Checklist:
├── Client-side preferred (simple HTML → PDF)
├── Or server-side for branded version
├── Returns PDF in < 1 second
└── User downloads immediately

Visa Kit ZIP:
├── Server generates
├── Combines all documents
├── Returns ZIP in < 5 seconds
├── Auto-deleted from server after 1 hour
└── User downloads immediately
```

**PDF Libraries:**
```
Node.js:
├── pdfkit (low-level, good control)
├── puppeteer + HTML (render HTML to PDF)
└── reportlab (simple, fast)

JavaScript (Browser):
├── jsPDF (lightweight)
├── pdfkit.js
└── pdf-lib (manipulate existing PDFs)
```

---

### 6.6 Deployment Architecture

**Frontend Deployment:**
```
Option 1: Vercel (Recommended for Next.js)
├── Cost: Free tier included
├── Auto-deploy: On every GitHub push
├── CDN: Global
├── Performance: Excellent
└── Setup: 2 minutes

Option 2: Netlify
├── Cost: Free tier included
├── Setup: 2 minutes
└── Performance: Good

Option 3: Self-hosted
├── Cost: $10+/month
├── Setup: 30 minutes
└── Maintenance: You manage
```

**Backend Deployment:**
```
Option 1: Render.com or Fly.io
├── Cost: Free tier available ($5/mo paid)
├── Auto-deploy: On GitHub push
├── Good for: APIs + cron jobs

Option 2: DigitalOcean Droplet
├── Cost: $6/month basic
├── Setup: 30 minutes
├── Can combine with change detection job

Option 3: Heroku
├── Cost: $7+/month (paid only)
├── Setup: 5 minutes
└── Slower than alternatives
```

**Database Deployment:**
```
Supabase (Recommended for MVP)
├── Cost: Free tier, scales with usage
├── Auto-backups: Yes
├── Easy integration: Yes
└── Setup: 2 minutes
```

**Complete Stack (MVP Cost):**
```
Frontend: Vercel (Free)
Backend: Render.com (Free tier or $5/mo)
Database: Supabase (Free tier or $25/mo)
Domain: Namecheap (~$10/year)
─────────────────────────────────
Total: ~$10/year (free tier) or ~$40/month (production)
```

---

## 7. Privacy & Data Handling

### 7.1 Data Security

**Security Measures:**
```
├── HTTPS everywhere (SSL certificate, free from Let's Encrypt)
├── Form data encrypted in transit
├── No sensitive data in logs
├── No cookies for tracking (privacy-first)
├── No third-party analytics (no Google Analytics)
├── GDPR/India DPDP compliant
└── Regular security audits
```

---

### 7.2 Data Minimization

**What we DON'T store:**
```
✗ Personal identifiable information (PII)
✗ Passport numbers
✗ Financial information
✗ Medical records
✗ Government IDs
✗ Biometric data
```

**What we DO store (temporarily):**
```
✓ Form responses (temporary, in browser only)
✓ Temporary files for document generation
  └─ Auto-deleted after 60 minutes
✓ Change detection logs (non-PII)
✓ Error logs (no sensitive data)
```

---

### 7.3 Data Retention

**User Session Data:**
```
Browser Storage (IndexedDB):
├── Created: When user starts
├── Deleted: Manually by user OR after 7 days (auto-cleanup)
└── Never synced to server

Server-side Files:
├── Generated documents: Deleted after 1 hour
├── Session logs: Deleted after 30 days
└── Error logs: Deleted after 90 days
```

---

### 7.4 Privacy Policy

**Key Points to Document:**
```
We DO:
├── Collect only necessary form data
├── Store data temporarily in browser
├── Never sell user data
├── Comply with Indian data protection laws (DPDP Act)
└── Delete data automatically

We DON'T:
├── Store personal identifiable information
├── Share data with third parties
├── Use cookies for tracking
├── Have ads or analytics
└── Collect more than needed

User Rights:
├── Access their data (export as JSON)
├── Delete their data (clear browser storage)
├── Understand what we collect (transparent)
└── Contact us with concerns
```

---

### 7.5 Compliance

**Legal/Regulatory:**
```
✓ India DPDP Act (Data Protection)
✓ Privacy by Design (not storing PII)
✓ Clear Terms of Service
✓ Disclaimer: "Not legal advice"
✓ Clear: "Always verify with official sites"
└── Regular policy reviews (quarterly)
```

---

## 8. User Journey (Detailed Flow)

```
┌─────────────────────────────────────────┐
│ USER STARTS ON HOMEPAGE                 │
├─────────────────────────────────────────┤
│ "Prepare your visa application          │
│  without paying agents"                 │
│                                         │
│ [Start Your Visa Journey]               │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 1: SELECT COUNTRY                  │
├─────────────────────────────────────────┤
│ Where do you want to apply?             │
│                                         │
│ [Search or Select...]                   │
│ ├─ Japan                                │
│ ├─ Korea                                │
│ ├─ USA                                  │
│ └─ [More countries...]                  │
│                                         │
│ [Next] [Skip]                           │
└────────────────────────────────────────���┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 2: SELECT VISA TYPE                │
├─────────────────────────────────────────┤
│ What type of visa do you need?          │
│                                         │
│ ○ Work Visa                             │
│ ○ Tourist Visa                          │
│ ○ Student Visa                          │
│ ○ Medical Visa                          │
│ ○ Business Visa                         │
│                                         │
│ [Back] [Next]                           │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 3: SELECT SCENARIO                 │
├─────────────────────────────────────────┤
│ Who is applying?                        │
│                                         │
│ ○ Self (1 applicant)                    │
│ ○ Spouse (couple together)              │
│ ○ Family (with kids)                    │
│ ○ Other                                 │
│                                         │
│ [Back] [Next]                           │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 4: REQUIREMENTS OVERVIEW           │
├─────────────────────────────────────────┤
│ JAPAN - WORK VISA (Self)                │
│                                         │
│ Processing Time: 15-20 days             │
│ Fee: ₹8,000                             │
│ Validity: 5 years                       │
│                                         │
│ DOCUMENTS NEEDED (7 total):             │
│ ✓ Passport                              │
│ ✓ Certificate of Employment             │
│ ✓ Salary Slip                           │
│ ✓ Bank Statement                        │
│ ○ Cover Letter (optional)               │
│ ✓ Job Offer Letter                      │
│ ✓ Company Registration                  │
│                                         │
│ [Download as PDF]                       │
│ [Start Guided Form]                     │
│ [Save Progress]                         │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 5: GUIDED FORM - Personal Info    │
├─────────────────���───────────────────────┤
│ Progress: ███░░░░░░ 30%                 │
│                                         │
│ Full Name (as in passport)              │
│ [John Doe           ]                   │
│                                         │
│ Date of Birth                           │
│ [15 / 01 / 1990     ]                   │
│                                         │
│ Nationality                             │
│ [India            ▼]                    │
│                                         │
│ Marital Status                          │
│ ○ Single ○ Married ○ Divorced ○ Other  │
│                                         │
│ [Back] [Next] [Save Progress]           │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 6: GUIDED FORM - Passport Info    │
├─────────────────────────────────────────┤
│ Progress: ███████░░ 70%                 │
│                                         │
│ Passport Number                         │
│ [N1234567           ]                   │
│                                         │
│ Issue Date                              │
│ [20 / 05 / 2015     ]                   │
│                                         │
│ Expiry Date                             │
│ [19 / 05 / 2025     ]                   │
│ ⚠️ Warning: Expires in < 6 months       │
│    Most visas need 6+ months validity   │
│                                         │
│ [Back] [Next] [Save Progress]           │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 7: GUIDED FORM - Employment      │
├─────────────────────────────────────────┤
│ Progress: █████████ 100%                │
│                                         │
│ Current Employer                        │
│ [Google India      ]                    │
│                                         │
│ Job Title                               │
│ [Software Engineer ]                    │
│                                         │
│ Annual Salary (INR)                     │
│ [1200000           ]                    │
│                                         │
│ Employment Type                         │
│ ○ Permanent ○ Contract ○ Freelance      │
│                                         │
�� [Back] [Generate Documents]             │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ STEP 8: GENERATE DOCUMENTS             │
├─────────────────────────────────────────┤
│ Generating your visa kit...             │
│                                         │
│ ✓ Cover Letter (generated)              │
│ ✓ Itinerary (generated)                 │
│ ✓ Checklist (generated)                 │
│ ✓ Form Field Guide (generated)          │
│ ✓ Zipping all files...                  │
│                                         │
│ [Download Visa Kit]                     │
│ [View Cover Letter]                     │
│ [View Checklist]                        │
│ [Next Steps Guide]                      │
└────────────────────��────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ FINAL STEP: WHAT'S NEXT                │
├─────────────────────────────────────────┤
│ Your visa kit is ready!                 │
│                                         │
│ Download: Visa_Kit_Japan_Work.zip       │
│           Contains all documents        │
│                                         │
│ Next Steps:                             │
│ 1. Review your documents                │
│ 2. Download official form:              │
│    [Link to VFS Japan]                  │
│ 3. Fill form using our field guide      │
│ 4. Gather required originals            │
│ 5. Submit to VFS                        │
│                                         │
│ Questions?                              │
│ [FAQ] [Contact Support] [Embassy Info]  │
│                                         │
│ ✉️ Save your progress (JSON backup):   │
│    [Download Progress]                  │
│                                         │
│ [Start Another Country] [Exit]          │
└─────────────────────────────────────────┘
```

---

## 9. MVP Scope (First Release - Week 1-6)

### What's INCLUDED:

```
✅ Core Wizard Flow
   ├─ Country selection
   ├─ Visa type selection
   ├─ Scenario selection
   └─ Requirements display

✅ Guided Form (5 steps)
   ├─ Personal information
   ├─ Passport details
   ├─ Employment details
   ├─ Travel dates
   └─ Review & summary

✅ Document Generators
   ├─ Cover letter (template + generation)
   ├─ Itinerary (simple day-by-day)
   └─ Checklist (personalized)

✅ Session Management
   ├─ Browser storage (IndexedDB)
   ├─ Auto-save progress
   ├─ Export/import JSON
   └─ 7-day session expiry

✅ Visa Kit Download
   └─ ZIP bundle with all documents

✅ First Countries (1-2)
   ├─ Japan (Work + Tourist)
   └─ Korea (Work visa)

✅ Change Detection
   ├─ Daily hash monitoring
   ├─ Admin alerts
   └─ Manual update process

✅ Basic Deployment
   ├─ Frontend (Vercel)
   ├─ Backend (Render/Railway)
   ├─ Database (Supabase)
   └─ Change detection (GitHub Actions)

✅ Privacy-First
   ├─ No permanent data storage
   ├─ Browser-only sessions
   ├─ Privacy policy
   └─ DPDP compliant
```

### What's EXCLUDED (for later phases):

```
❌ User Accounts
   └─ Add in Phase 2 if demand exists

❌ AI-powered requirement extraction
   └─ Research and add in Phase 3

❌ Browser extension
   └─ Add in Phase 3+ if needed

❌ Auto-fill official PDFs
   └─ Complex, risky, exclude initially

❌ Advanced analytics
   └─ Not needed for MVP

❌ Mobile native app
   └─ Responsive web is sufficient

❌ Multiple languages
   └─ English MVP, add Hindi/others later

❌ 50+ countries
   └─ Start with 1-2, expand gradually

❌ Complex scenarios
   └─ Multi-family, business partners, etc.
   └─ Add based on demand
```

---

### MVP Development Timeline

```
Week 1: Setup & Planning
├─ Set up GitHub repo
├─ Initialize Next.js project
├─ Set up Supabase
├─ Design database schema
└─ Manually enter data for 1 country (Japan)

Week 2: Core Frontend
├─ Build country/visa/scenario selection flow
├─ Create requirements display page
├─ Build guided form (5 steps)
├─ Implement browser storage (IndexedDB)
└─ Test end-to-end flow

Week 3: Document Generation
├─ Build cover letter generator
├─ Build itinerary generator
├─ Build checklist generator
├─ Create ZIP bundle generator
└─ Test all document outputs

Week 4: Backend & API
├─ Build API endpoints
├─ Connect frontend to API
├─ Set up database
├─ Test API responses
└─ Optimize performance

Week 5: Change Detection & Deployment
├─ Build change detection script
��─ Set up GitHub Actions
├─ Deploy to Vercel (frontend)
├─ Deploy to Render (backend)
├─ Test full production setup

Week 6: Polish & Testing
├─ Add second country (Korea)
├─ Test on mobile devices
├─ Write user documentation
├─ Final security review
├─ Beta launch
└─ Gather initial feedback
```

---

## 10. Non-Functional Requirements

### Performance

```
Response Times:
├── Page load: < 2 seconds (on 4G)
├── Form submission: < 1 second
├── Document generation: < 3 seconds (PDF)
├── API response: < 200ms (p95)
└── Change detection: < 1 minute (total script)

Storage:
├── Per user session: < 5MB (IndexedDB)
├── Generated documents: Auto-delete after 1 hour
├── Database size: Start < 1GB
└── Server disk: Minimal (documents not stored)

Scalability:
├── Handle 100 concurrent users (MVP)
├── Scale to 1000+ with minor changes
├── No database bottlenecks (indexed queries)
└── CDN for static assets (automatic with Vercel)
```

---

### Reliability & Uptime

```
Target Uptime: 99.5% (43 minutes downtime/month)

Monitoring:
├── Uptime monitoring (UptimeRobot, free)
├── Error tracking (Sentry, free tier)
├── Performance monitoring (basic logs)
└── Database backups (Supabase automatic daily)

Failover:
├── Database: Supabase handles
├── Frontend: Vercel CDN provides resilience
├── Backend: Health check endpoint
└── Change detection: Retry on failure, alert admin
```

---

### Accessibility

```
✓ WCAG 2.1 Level AA compliance
├── Keyboard navigation (tab through all elements)
├── Screen reader support (semantic HTML)
├── Color contrast (4.5:1 minimum)
├── Alt text for images
├── Form labels linked to inputs
└── Focus indicators visible

Testing:
├── Manual accessibility testing
├── Browser lighthouse audits
├── Screen reader testing (NVDA)
└── Keyboard-only navigation test
```

---

### Security

```
Data In Transit:
├── HTTPS everywhere
├── TLS 1.2+ only
└── HSTS headers enabled

Data At Rest:
├── Database: Encrypted (Supabase default)
├── Files: Encrypted during transfer
└── Logs: No sensitive data

API Security:
├── Rate limiting (prevent abuse)
├── Input validation (Zod schemas)
├── CORS configured (your domain only)
├── No SQL injection (parameterized queries)
└── No XSS (output escaping)

Regular Security:
├── Dependencies scanned (npm audit)
├── Code review for security issues
├── Privacy audit (quarterly)
└── Incident response plan
```

---

## 11. Risk Assessment & Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **VFS website changes frequently** | High | Medium | Change detection system monitors daily |
| **Document generation bugs** | Medium | High | Thorough testing, user can regenerate |
| **Database goes down** | Low | High | Use managed service (Supabase), backups |
| **Browser storage lost** | Low | Low | Offer export/import feature |
| **Performance degradation** | Low | Medium | Monitor + optimize + scale horizontally |

---

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **VFS sues us** | Low | Critical | Don't scrape, only guide, disclaimer clear |
| **Low user adoption** | Medium | High | Research market, iterate fast, marketing |
| **Data breach** | Low | Critical | No PII stored, end-to-end privacy |
| **Visa requirements too complex** | Medium | Medium | Start with simple countries, add gradually |
| **Indian competitors emerge** | High | Medium | Move fast, build community, add features |

---

### Mitigation Strategy

```
1. Data Accuracy
   ├─ Double-check all requirements manually
   ├─ Test against actual VFS websites
   ├─ User feedback mechanism
   └─ Regular audits (quarterly)

2. Legal Compliance
   ├─ Clear disclaimer: "Not legal advice"
   ├─ Always link to official sources
   ├─ Privacy policy reviewed by lawyer
   ├─ Terms of service covers limitations
   └─ DPDP Act compliance audit

3. Technical Stability
   ├─ Automated testing (80%+ coverage)
   ├─ Staging environment for testing
   ├─ Blue-green deployments (zero downtime)
   ├─ Rollback plan for failed deploys
   └─ Error logging + monitoring

4. Change Management
   ├─ Change detection alerts early
   ├─ Manual review before updates
   ├─ User notification of changes
   ├─ Version history of data
   └─ Rollback capability
```

---

## 12. Success Metrics

### Launch Metrics (Week 1-4)

```
📊 User Acquisition:
├── Unique visitors: 100+
├── Completion rate: > 70%
├── Return rate: > 20%
└── Average session time: 10+ minutes

📊 Product Quality:
├── Document generation success: > 98%
├── Form validation errors: < 5%
├── Page load time: < 2 seconds
└── Uptime: > 99%

📊 Feedback:
├── User satisfaction score: 4+/5
├── Support tickets: < 2/day
├── Bug reports: < 1/day
└── Feature requests: 3+/week
```

---

### Growth Metrics (Month 2-3)

```
📊 Engagement:
├── Monthly active users: 500+
├── Visa kit downloads: 300+/month
├── Countries covered: 5+
├── Repeat visits: 30%+
└── Average rating: 4.5/5

📊 Business:
├── Cost per user acquisition: < ₹10
├── User lifetime value: TBD
├── Monetization rate: TBD (future)
└── Review score: 4.5+/5 (Google Play/App Store if applicable)

📊 Technical:
├── Uptime: 99.9%+
├── Change detection accuracy: 99%+
├── Average API response: < 100ms
└── Database query time: < 200ms (p95)
```

---

## 13. Future Enhancements (Post-MVP)

### Phase 2 (Months 4-6)

```
✨ Enhanced Document Generation
├── Auto-fill downloadable PDFs
├── Video guides for complex visas
├── Document checklist (with checkboxes)
└── Form pre-population from CV

✨ User Accounts (Optional)
├── Save progress across devices
├── Application history
├── Bookmarked countries
├── Personalized timeline
└── Email notifications for changes

✨ Expanded Coverage
├── 20+ countries
├── Multiple visa types per country
├── Common scenarios pre-configured
└── Tier 3 countries (basic info only)

✨ AI Features (Optional)
├── Chatbot for FAQ
├── Document validation
├── Cover letter improvement suggestions
└── Timeline predictions
```

---

### Phase 3 (Months 7-12)

```
✨ Community Features
├── User-submitted success stories
├── Q&A section (community moderated)
├── Reddit-like discussions per country
└── Expert consultation booking

✨ Monetization
├── Premium: Advanced features ($50-200 per visa)
├── Affiliate: Travel insurance, flight booking
├── Consultation: Video calls with visa experts
├── API: For agencies to integrate
└── Ads: Sponsorships from relevant companies

✨ Integrations
├── Calendar (add deadlines automatically)
├── Email (send timeline reminders)
├── File storage (Google Drive, Dropbox)
└── Payment gateway (if monetizing)

✨ Mobile App
├── PWA (Progressive Web App) - Phase 3
├── Native iOS app (if demand exists)
├── Native Android app (if demand exists)
└── Offline capability
```

---

## 14. Guiding Principles

These principles guide every decision:

```
1. 👤 User-Centric
   "Is this making the user's visa journey easier?"

2. 🔒 Privacy-First
   "Do we really need to store this data?"

3. ✨ Simplicity
   "Can we explain this more clearly?"

4. 📚 Accuracy
   "Is this information correct and current?"

5. 🔗 Always Point to Official Sources
   "Never replace the official process, only guide it"

6. ⚡ Performance
   "Will this work on slow 3G in India?"

7. 🎯 Focus
   "Does this support the core mission?"

8. 🚀 Launch Fast, Iterate Often
   "Perfect is the enemy of good"
```

---

## 15. One-Line Vision

**"TurboTax for visa applications — empowering Indians to confidently apply for visas without paying agents."**

---

## 16. Detailed Implementation Checklist

### Pre-Launch Checklist (Before Week 1)

```
☐ Market Research
  ☐ Survey 20+ potential users (India)
  ☐ Validate problem/solution fit
  ☐ Identify top 2-3 countries to launch
  ☐ Research competitor landscape
  
☐ Legal Setup
  ☐ Create privacy policy (template available online)
  ☐ Create terms of service
  ☐ Create disclaimers ("not legal advice")
  ☐ Consult lawyer (optional but recommended)
  
☐ Repository Setup
  ☐ Create GitHub repo
  ☐ Initialize .gitignore
  ☐ Create LICENSE file
  ☐ Set up branch protection rules
  
☐ Infrastructure Setup
  ☐ Create Supabase account
  ☐ Create Vercel account
  ☐ Create Render/Railway account
  ☐ Reserve domain name
  ☐ Set up GitHub Actions
  
☐ Initial Data
  ☐ Research Japan visa requirements
  ☐ Create spreadsheet with data
  ☐ Create database schema
  ☐ Plan data entry process
```

---

### Development Checklist (Weeks 1-6)

```
Week 1: Setup
☐ Initialize Next.js project
☐ Set up Tailwind CSS
☐ Create folder structure
☐ Set up database schema in Supabase
☐ Manually enter Japan visa data
☐ Create API endpoints (basic)
☐ Test database connection

Week 2-3: Frontend
☐ Build country selection page
☐ Build visa type selection
☐ Build scenario selection
☐ Build requirements display
☐ Build guided form (5 steps)
☐ Implement IndexedDB storage
☐ Implement session management
☐ Test end-to-end flow

Week 4: Document Generation
☐ Build cover letter generator
☐ Build itinerary generator
☐ Build checklist generator
☐ Build ZIP bundle generator
☐ Test all document formats
☐ Test file cleanup (auto-delete)

Week 5: Backend & Polish
☐ Build API endpoints (complete)
☐ Connect frontend to API
☐ Set up change detection script
☐ Set up GitHub Actions workflow
☐ Deploy to staging
☐ Test full production setup

Week 6: Launch Prep
☐ Add second country (Korea)
☐ Test on mobile devices
☐ Write user documentation
☐ Create privacy policy
☐ Create terms of service
☐ Set up monitoring (uptime, errors)
☐ Beta launch to test users
☐ Gather feedback
☐ Fix critical issues
☐ Public launch
```

---

### Post-Launch Checklist (Week 7+)

```
📊 Monitoring & Maintenance
☐ Monitor uptime (daily)
☐ Monitor change detection alerts
☐ Monitor error logs (daily)
☐ Monitor user feedback
☐ Review performance metrics (weekly)

🔄 Content Updates
☐ Check for VFS updates (weekly via change detection)
☐ Review failed change detections (weekly)
☐ Update requirements as needed
☐ Test changes before pushing (always)

👥 User Support
☐ Respond to support emails (within 24 hours)
☐ Collect user feedback (weekly survey)
☐ Track frequently asked questions
☐ Document answers in FAQ

📈 Growth
☐ Plan next country to add
☐ Research market demand
☐ Iterate based on user feedback
☐ Plan next features for Phase 2
```

---

## 17. FAQ (Anticipated User Questions)

```
Q: Is this free?
A: Yes, completely free. No hidden charges.

Q: Will my personal information be stored?
A: No. We store nothing permanently. Your data stays in your browser.

Q: Can I use this for multiple countries?
A: Yes, you can start again and apply for another country.

Q: What if I lose my progress?
A: Download your progress as a JSON file to back it up.

Q: Is this official/legal?
A: We guide you based on official requirements. You still submit 
   through official channels. We're not a substitute for official 
   advice.

Q: Why don't you fill the official form for me?
A: For legal and security reasons. We guide you step-by-step.

Q: How accurate is this information?
A: We update daily via monitoring. But always verify with official 
   sites.

Q: Can I share my progress with family?
A: Yes, download JSON and share. But each person should fill their 
   own info.

Q: What countries do you support?
A: Currently Japan and Korea. More coming soon.

Q: How long does visa processing usually take?
A: Varies by country (shown for each visa type).

Q: What if VFS requirements change after I apply?
A: We monitor changes. But submission follows the rules at submission 
   time.
```

---

## 18. Success Criteria for MVP Launch

**MVP is considered successful if:**

```
✅ Core Flow Works
   └─ User can go from "start" → "download visa kit" without errors

✅ Accurate Information
   └─ Data matches official VFS websites (verified manually)

✅ Good User Experience
   └─ Average task completion time < 15 minutes
   └─ User satisfaction score > 4/5

✅ Reliable Technology
   └─ Uptime > 99%
   └─ Document generation success > 98%
   └─ No critical bugs in first week

✅ Privacy Maintained
   └─ Zero personal data stored permanently
   └─ All documents auto-deleted from server
   └─ Browser storage respects user privacy

✅ Market Validation
   └─ 50+ organic signups in first month
   └─ Positive user feedback
   └─ Interest from multiple countries
```

---

## 19. Next Steps (Before Implementation)

```
1. Review this plan with team
2. Get feedback and iterate
3. Finalize technology stack
4. Set up all accounts (Supabase, Vercel, etc.)
5. Create detailed sprint plan (2-week sprints)
6. Start development (Week 1)
7. Weekly progress reviews
8. Launch beta at Week 6
9. Gather feedback
10. Iterate before public launch
```

---

## Final Notes

```
This plan is comprehensive yet flexible. Adjust based on:
├── Team capacity
├── Market research findings
├── Technical constraints
├── User feedback during development
└── Regulatory changes

Key Success Factors:
├── 🚀 Launch fast (don't over-engineer)
├── 🎯 Stay focused (one thing well)
├── 👂 Listen to users (iterate based on feedback)
├── 📊 Track metrics (know what's working)
└── 🔒 Maintain privacy (trust is critical)

Remember: "Perfect is the enemy of good."
Ship MVP, learn from users, iterate constantly.
```

---

**Plan Prepared:** 2026-04-24  
**Status:** Ready for Development  
**Version:** 2.0 (Final)
