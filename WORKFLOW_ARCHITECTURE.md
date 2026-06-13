# Clean Workflow Architecture - Revised Structure

## Overview
The application now has a **clean, separated workflow** for two independent portals:
- **EMRS Portal**: Eklavya Model Residential School Management
- **Asset Portal**: Infrastructure & Project Tracking

---

## 1. Application Flow Diagram

```
Homepage (/)
    ├─── EMRS Portal Card
    │    ├─→ /emrs/login (EMRSLoginPage)
    │    ├─→ Authenticate with School Credentials
    │    └─→ /emrs/dashboard (SchoolEMRSWrapper)
    │        └─→ EMRSForm.jsx
    │
    └─── Asset Portal Card
         ├─→ /asset/login (AssetLoginPage)
         ├─→ Authenticate with Redux/JWT
         └─→ /asset/dashboard (DashboardLayout)
              ├─→ /asset/dashboard/new (NewApplication)
              ├─→ /asset/dashboard/form (AssetForm)
              ├─→ /asset/dashboard/applied/assets (AssetApplied)
              └─→ /asset/dashboard/applied/emrs (EMRSApplied)
```

---

## 2. Route Structure (App.jsx)

### Routes Configuration

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Landing page with two portal cards |
| **EMRS Portal** | | |
| `/emrs/login` | EMRSLoginPage | School/Admin authentication |
| `/emrs/dashboard` | SchoolEMRSWrapper | EMRS form & submission |
| `/emrs/admin` | EMRSAdminDashboard | EMRS admin dashboard |
| **Asset Portal** | | |
| `/asset/login` | AssetLoginPage | User authentication |
| `/asset/dashboard` | DashboardLayout | Asset dashboard layout |
| `/asset/dashboard/new` | NewApplication | Create new application |
| `/asset/dashboard/form` | AssetForm | Asset management form |
| `/asset/dashboard/applied/*` | Applied pages | View submitted applications |
| **Legacy** | | |
| `/signin` | Redirect → `/asset/login` | Backwards compatibility |
| `/admin/signin` | Redirect → `/emrs/login` | Backwards compatibility |

---

## 3. Authentication Systems

### EMRS Portal (Context-based)
- **File**: `src/context/AuthContext.jsx`
- **Method**: localStorage + Context API
- **Protected by**: `EMRSProtectedRoute` component
- **Allowed roles**: `["school", "admin"]`
- **Login file**: `src/pages/auth/login/index.jsx`

```javascript
// EMRS Login Flow
EMRSLoginPage 
  → authenticateUser() from Schoolcredentials.js
  → setUser() in AuthContext
  → store to localStorage
  → redirect to /emrs/dashboard
```

### Asset Portal (Redux-based)
- **File**: `src/redux/slices/authSlice.js`
- **Method**: Redux + JWT tokens
- **Protected by**: `AssetProtectedRoute` component (ProtectedRoute.jsx)
- **Login file**: `src/pages/auth/login/login.jsx`

```javascript
// Asset Login Flow
AssetLoginPage
  → loginUser() async thunk
  → API call to server
  → store token & user in Redux
  → store to localStorage
  → redirect to /asset/dashboard/new
```

---

## 4. Protected Route Components

### EMRSProtectedRoute
**Location**: `src/components/ProtectedRoute.jsx`

```javascript
// Protects EMRS routes
// Checks: useAuth() from AuthContext
// Allowed roles: admin, school
<Route
  path="/emrs/dashboard"
  element={
    <EMRSProtectedRoute allowedRoles={["school", "admin"]}>
      <SchoolEMRSWrapper />
    </EMRSProtectedRoute>
  }
/>
```

### AssetProtectedRoute
**Location**: `src/pages/routes/protected-routes.jsx`

```javascript
// Protects Asset routes
// Checks: Redux store token
<Route
  path="/asset/dashboard"
  element={
    <AssetProtectedRoute>
      <DashboardLayout />
    </AssetProtectedRoute>
  }
>
```

---

## 5. Dashboard Layouts

### EMRS Dashboard
- **Component**: `SchoolEMRSWrapper`
- **Location**: `src/pages/EMRS/SchoolEMRSWrapper.jsx`
- **Contents**:
  - School banner with name
  - EMRSForm.jsx with pre-filled school data
  - Submission handling with school code

### Asset Dashboard
- **Component**: `DashboardLayout`
- **Location**: `src/pages/layouts/DashboardLayout.jsx`
- **Contents**:
  - Sidebar navigation (Asset-specific)
  - Topbar with user info
  - Nested routes for:
    - New applications
    - Asset forms
    - Submitted applications
    - Reports

---

## 6. Key Files Modified

### Updated Files

1. **src/App.jsx**
   - Changed: Route structure for separate portals
   - Added: `/emrs/*` routes, `/asset/*` routes
   - Removed: Mixed dashboard at `/dashboard`

2. **src/pages/home/homepage.jsx**
   - Changed: Portal cards to route correctly
   - Updated: `/emrs/login` and `/asset/login` paths
   - Fixed: Hero buttons to separate portals

3. **src/pages/auth/login/login.jsx** (Asset)
   - Changed: Redirect from `/dashboard/new` → `/asset/dashboard/new`

4. **src/components/layouts/header/Sidebar.jsx**
   - Changed: All navigation paths to `/asset/dashboard/*`
   - Updated: EMRS link to `/emrs/login`

5. **src/pages/assetManagementForm/index.jsx**
   - Changed: Post-submit redirect to `/asset/dashboard/applied/assets`

6. **src/pages/EMRS/EMRSForm.jsx**
   - Changed: Post-submit redirect to `/emrs/dashboard`

---

## 7. Navigation Flow Examples

### Example 1: Asset User Journey
```
User clicks "Asset Portal" on Homepage
  ↓
Navigate to /asset/login
  ↓
User enters credentials
  ↓
Redux dispatch loginUser() action
  ↓
API validates credentials
  ↓
Token stored in Redux + localStorage
  ↓
Redirect to /asset/dashboard/new
  ↓
DashboardLayout renders with sidebar
  ↓
User can navigate within asset dashboard
```

### Example 2: EMRS User Journey
```
User clicks "EMRS Portal" on Homepage
  ↓
Navigate to /emrs/login
  ↓
User enters school credentials
  ↓
AuthContext authenticateUser() validates
  ↓
User stored in Context + localStorage
  ↓
Redirect to /emrs/dashboard
  ↓
SchoolEMRSWrapper renders
  ↓
EMRSForm pre-populated with school data
```

---

## 8. Benefits of This Architecture

✅ **Separation of Concerns**
- Each portal has its own login system
- Independent authentication mechanisms
- No mixed dashboards

✅ **Clear User Experience**
- Users choose portal on homepage
- Each portal has dedicated interface
- No confusing navigation

✅ **Maintainability**
- Asset routes isolated in `/asset/*`
- EMRS routes isolated in `/emrs/*`
- Easy to modify one portal without affecting the other

✅ **Scalability**
- Can add more portals easily
- Each portal can have its own styling, features
- Backwards compatible with legacy routes

✅ **Security**
- Separate protected route components
- Different auth mechanisms per portal
- Clear permission boundaries

---

## 9. Future Enhancements

- [ ] Add role-based UI variants for each portal
- [ ] Create separate Topbar components for each portal
- [ ] Add portal-specific theming/branding
- [ ] Implement breadcrumb navigation per portal
- [ ] Add portal-specific error pages

---

## 10. Testing Checklist

- [ ] Homepage loads and displays both portal cards
- [ ] Asset Portal card redirects to /asset/login
- [ ] EMRS Portal card redirects to /emrs/login
- [ ] Asset login works and redirects to /asset/dashboard/new
- [ ] EMRS login works and redirects to /emrs/dashboard
- [ ] Asset sidebar navigation works correctly
- [ ] Asset form submission redirects to /asset/dashboard/applied/assets
- [ ] EMRS form submission redirects to /emrs/dashboard
- [ ] Unauthorized access to /asset/dashboard redirects to /asset/login
- [ ] Unauthorized access to /emrs/dashboard redirects to /emrs/login
- [ ] Legacy routes (/signin, /admin/signin) redirect correctly

---

## Summary

The application now has a **clean, professional workflow** where:
1. **Users start at the homepage** and choose their portal
2. **Each portal has its own login page** (no confusion)
3. **Each portal has its own dashboard** (no mixing)
4. **Authentication is portal-specific** (EMRS uses Context, Asset uses Redux)
5. **All navigation routes are clear and consistent**

This resolves the "messy workflow" issue completely! 🎉
