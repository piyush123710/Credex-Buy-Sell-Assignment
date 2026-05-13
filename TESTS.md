# Automated Tests

The following tests ensure the reliability of the SpendWise audit engine and lead capture flow.

## 1. Audit Engine Logic
- **File**: `src/lib/audit-engine.test.ts`
- **Coverage**:
  - `Identify Claude Team over-provisioning`: Verifies that < 5 users on Team plan triggers a downgrade recommendation.
  - `Single-user Cursor Business`: Verifies that solo users are moved to Pro for $20 savings.
  - `Credex Opportunity Flag`: Ensures spend > $500/mo is correctly marked for consultation.
  - `Retail Price Detection`: Checks if standard retail prices trigger a Credex sourcing suggestion.
- **Run command**: `npx vitest run src/lib/audit-engine.test.ts`

## 2. API Validation
- **Path**: `src/app/api/leads/route.ts` (Manual Verification)
- **Coverage**:
  - `Honeypot Detection`: Ensures bot submissions with the hidden field filled are rejected.
  - `Email Validation`: Prevents malformed email addresses from entering the DB.
  - `Audit ID Linkage`: Verifies that leads are correctly associated with a UUID.

## 3. Form Persistence
- **Component**: `AuditForm.tsx` (Manual Verification)
- **Coverage**:
  - `LocalStorage Load`: Verify that refreshing the page mid-audit restores the form state.
  - `Data Integrity`: Ensure numeric inputs stay numeric across reloads.
