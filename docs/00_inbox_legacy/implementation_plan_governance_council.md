# Implementation Plan - Sprint 12.5: Governance & Council

## 🎯 Objective
Implement the "Governance & Fiscal Council" module, providing tools for financial auditing, monthly closings, and transparency management as defined in `docs/ux_flow_transparency_council.md`.

## 📦 Deliverables

### 1. API Layer (`src/api/governance.ts`)
- **Monthly Reports:** `getMonthlyReports`, `createMonthlyReport`, `getMonthlyReportDetails`.
- **Transparency Content:** `getTransparencyContents`, `saveTransparencyContent`.
- **Audit Annotations:** `getAuditAnnotations`, `createAuditAnnotation`, `resolveAuditAnnotation`.
- **Mandates:** `getMandates`, `saveMandate`.

### 2. Frontend Modules

#### A. Fiscal Council Dashboard (`FiscalDashboard.tsx`)
*   **Enhancement:** Integrate "Points of Attention" (Audit Flags).
*   **New Feature:** "Monthly Closing" workflow.
*   **UI:** Snapshot view of frozen data.

#### B. Transparency Portal (`TransparencyPortal.tsx`)
*   **Enhancement:** Render dynamic content from `transparency_contents`.
*   **Config:** Toggle "Public Mode" and "Detail Level".

#### C. Audit Visualizer (`AuditVisualizer.tsx`)
*   **Feature:** "Visual Diff" using `audit_logs` `old_record` vs `new_record`.
*   **Feature:** "Create Annotation" modal.

#### D. Settings & Mandates (`TransparencySettings.tsx`)
*   **Feature:** Manage Statutory Mandates (President, Treasurer).
*   **Feature:** Edit Institutional Texts.

## 🛠️ Technical Tasks

### Step 1: API & State Management
- [ ] Create `src/api/governance.ts` with Supabase calls.
- [ ] Create `src/hooks/useGovernance.ts` with React Query.

### Step 2: Components - Audit & Annotation
- [ ] Create `AuditDiffViewer.tsx` (Component to show JSON diffs).
- [ ] Update `AuditVisualizer.tsx` to include Annotations Sidebar.

### Step 3: Components - Fiscal Dashboard
- [ ] Implement `MonthlyClosingModal.tsx` (Actions to freeze data).
- [ ] Update `FiscalDashboard.tsx` to fetch/display `finance_monthly_reports`.

### Step 4: Components - Content & Settings
- [ ] Implement `MandateList.tsx` in Settings.
- [ ] Implement `ContentEditor.tsx` (Simple textarea/markdown) for Transparency Pages.

## 🧪 Verification Plan
- **Manual Test:** Create a monthly closing and verify `snapshot_data` is saved.
- **Manual Test:** Edit a transaction, verify audit log, and create an annotation on it.
- **Manual Test:** Check RLS: Ensure a 'Member' cannot see 'Council' annotations.
