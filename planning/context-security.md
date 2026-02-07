# Security & Licensing Context

## Security Model
- **Zero trust** admin routes with strict RBAC
- **Audit logs** for all content changes
- **Strict validation** for all user inputs
- **Least privilege** database roles

## Licensing (Immutable, Non-Editable)
**Goal**: Prevent local tampering; enforce server-side validation.

### Recommended Approach
1. **License issuance**: Server generates a signed license using asymmetric keys.
2. **Verification**: Client submits key; server verifies signature (public key).
3. **Entitlement binding**:
   - License includes `tenant_id`, `plan`, `features`, `expires_at`
   - Stored server-side; client receives a signed token
4. **Tamper resistance**:
   - Key validation only on server
   - Token integrity via signature

### License Enforcement
Use server-enforced entitlements, never client-only checks.

## Compliance & Privacy
- PII retention policy and delete/export flows
- Audit log retention and archival
- GDPR/CCPA-ready data export

## Secure Media & Storage
- Content type allowlists
- Size limits
- Optional malware scanning (extension)
- Signed URLs for sensitive media
