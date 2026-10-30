# Security Guidelines & Threat Model — MIB

## 1. Core Security Invariants

1. **Zero Public Leakage of Real Identities**:
   - `real_name` is strictly classified and accessible only to authenticated admins.
   - Public schemas (`PublicAgentDetail`, `PublicAgentSummary`) must NEVER include `real_name`, internal UUIDs, card assignments, or admin notes.
   - Unauthenticated callers attempting to guess unpublished agent slugs receive `404 Not Found`, identical to non-existent agents, preventing enumeration.

2. **No Secret Data on NFC Hardware**:
   - NFC cards store ONLY the canonical URL (`https://mib.gameserver1.cc/agent/{slug}`).
   - Authentication tokens, API keys, or admin passwords must NEVER be embedded into NFC tags or QR codes.

3. **Authentication & Session Security**:
   - Argon2id password hashing.
   - HttpOnly, SameSite=Lax, Secure cookies for admin session tokens.
   - No public user registration endpoint.

4. **Network & Infrastructure Isolation**:
   - Backend and database communicate over an isolated Docker network.
   - Database port 5432 is not exposed to the public internet.
   - File uploads validated for MIME type, image dimensions, and max file size (e.g. 5MB), re-encoded to WebP.

5. **Classification Controls**:
   - Classified dossiers (CONFIDENTIAL, SECRET, TOP SECRET) must be filtered at the query layer in SQL/ORM, not filtered client-side in React.
