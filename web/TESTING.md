# 🧪 VisaMate Testing Framework Developer Guide

This document describes the testing setup, test organization, and CLI command options available for developers to test and verify the VisaMate application.

---

## 🔍 1. Architecture & Testing Stack

VisaMate uses **Vitest** for unit and integration testing:
*   **Framework:** Vitest (runs natively with ES Modules and TypeScript).
*   **Environment:** `jsdom` (simulates a browser environment to mock global objects like `window` and `window.localStorage`).
*   **Config File:** [vitest.config.ts](file:///d:/visamate/web/vitest.config.ts) (manually resolves Next.js path aliases like `@/*` and `@data/*`).

---

## 📂 2. Directory Structure of Test Files

Tests are co-located alongside the source code files they verify for high discoverability and easy refactoring:
```text
web/src/
├── features/
│   └── documents/
│       ├── mapRequirements.ts
│       └── mapRequirements.test.ts   ← Integration tests for checklist parsing
└── lib/
    └── utils/
        ├── date.ts
        ├── date.test.ts              ← Unit tests for date formatting/math
        ├── smoke.test.ts             ← Vitest configuration verification
        ├── storage.ts
        ├── storage.test.ts           ← SSR-safety and localStorage tests
        ├── validators.ts
        └── validators.test.ts        ← Form fields and keyboard inputs tests
```

---

## ⚡ 3. How to Run the Tests

Commands can be run from the **monorepo root** `/visamate` or from inside the `/web` directory:

### Run Options (from Monorepo Root)

| Command | Mode | Output Style | Use Case |
| :--- | :--- | :--- | :--- |
| `npm run test` | Quiet | Minimal Summary | Fast sanity check before committing code or in CI/CD. |
| `npm run test:verbose` | Verbose | Full test descriptions + **Checklist Tables** | Inspecting generated lists and viewing all 58+ assertions in detail. |
| `npm run test:watch` | Watch | Interactive CLI | Local development. Reruns tests on file save. |

---

## 🎛️ 4. Granular Override Switch (Filtering Runs)

The dynamic checklist test scans [web/src/data/requirements](file:///d:/visamate/web/src/data/requirements) and runs tests for all countries and VFS locations. You can filter the run using environment variables to focus only on specific inputs:

| Environment Variable | Description | Example Values |
| :--- | :--- | :--- |
| `TEST_COUNTRY` | Filter by target country | `JP`, `FR` |
| `TEST_VISA` | Filter by visa category | `TOURIST`, `BUSINESS` |
| `TEST_LOCATION` | Filter by VFS center | `DELHI`, `MUMBAI`, `KOLKATA` |
| `TEST_SPONSORSHIP` | Filter by sponsorship type | `SELF`, `SPONSORED` |

### Override CLI Examples

#### Bash / Git Bash / macOS / Linux
Prepend variables directly before the run command:
```bash
# Run only Delhi checks
TEST_LOCATION=DELHI npm run test:verbose

# Run only Self-Sponsored checks in Mumbai
TEST_LOCATION=MUMBAI TEST_SPONSORSHIP=SELF npm run test:verbose

# Run only Japan Tourist visa checks
TEST_COUNTRY=JP TEST_VISA=TOURIST npm run test:verbose
```

#### Windows PowerShell
Set variables on the environment namespace, run, and optionally clean them:
```powershell
# Run only Delhi checks
$env:TEST_LOCATION="DELHI"; npm run test:verbose; Remove-Item Env:\TEST_LOCATION

# Run only Self-Sponsored checks in Mumbai
$env:TEST_LOCATION="MUMBAI"; $env:TEST_SPONSORSHIP="SELF"; npm run test:verbose; Remove-Item Env:\TEST_LOCATION; Remove-Item Env:\TEST_SPONSORSHIP
```

---

## 📊 5. Visual Logs Output (Verbose Mode)
When running `npm run test:verbose`, the test runner outputs beautifully formatted boxes displaying the generated categories and checklist structure matching your input criteria:

```text
stdout | src/features/documents/mapRequirements.test.ts > Config: JP · TOURIST · DELHI > should map documents correctly for SELF-sponsored applicants

  ┌────────────────────────────────────────────────────────────────────────────┐
  │ INPUTS: Country: JP | Visa: TOURIST | Location: DELHI | Sponsorship: SELF  │
  ├────────────────────────────────────────────────────────────────────────────┤
  │ 📁 Category: Common Documents                                              │
  │   - [REQUIRED] Visa Application Form                                       │
  │   - [REQUIRED] Original Passport                                           │
  ...
  │ 📁 Category: Financial Documents (Self Sponsored)                          │
  │   - [REQUIRED] Latest Income Tax Return                                    │
  │   - [OPTIONAL] Salary Slips (Last 3 Months)                                │
  │   - [REQUIRED] Bank Statement (Last 3 Months)                              │
  └────────────────────────────────────────────────────────────────────────────┘
```
