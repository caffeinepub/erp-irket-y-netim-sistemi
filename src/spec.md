# Specification

## Summary
**Goal:** Fix Internet Identity authentication flow on all three login screens (Company, Manager, Employee) so that clicking 'Devam Et' buttons properly triggers the authentication window and routes authenticated users to their role-based dashboards.

**Planned changes:**
- Fix CompanyLogin.tsx to open Internet Identity authentication window when 'Devam Et' is clicked
- Fix ManagerLogin.tsx to open Internet Identity authentication window when 'Devam Et' is clicked
- Fix EmployeeLogin.tsx to open Internet Identity authentication window when 'Devam Et' is clicked
- Implement proper post-authentication role-based routing (Owner → /owner/dashboard, Manager → /manager/dashboard, Employee → /employee/dashboard)
- Display appropriate Turkish error messages for authentication failures

**User-visible outcome:** Users can successfully authenticate using Internet Identity on all three login screens by clicking 'Devam Et', and are automatically redirected to their appropriate role-based dashboard after successful authentication.
