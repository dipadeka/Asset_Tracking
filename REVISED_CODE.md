# REVISED CODE - Complete Reference

## 1. App.jsx (Complete Revised Version)

```javascript
// src/App.jsx — REVISED FOR CLEAN WORKFLOW
// Workflow:
// - Homepage (/)
//   ├─→ EMRS Portal: /emrs/login → EMRS Dashboard → EMRSForm
//   └─→ Asset Portal: /asset/login → Asset Dashboard → AssetForm

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ── Home ──────────────────────────────────────────────────────
import HomePage from "./pages/home/homepage";

// ── EMRS Portal ───────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import EMRSLoginPage from "./pages/auth/login/index";
import EMRSProtectedRoute from "./components/ProtectedRoute";
import SchoolEMRSWrapper from "./pages/EMRS/SchoolEMRSWrapper";
import EMRSAdminDashboard from "./pages/EMRS/EMRSAdminDashboard";

// ── Asset Portal ──────────────────────────────────────────────
import AssetLoginPage from "./pages/auth/login/login";
import AssetProtectedRoute from "./pages/routes/protected-routes";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import AssetForm from "./pages/assetManagementForm/index";
import NewApplication from "./pages/NewApplication";
import EMRSApplied from "./pages/submitted-application/EMRSApplied";
import AssetApplied from "./pages/AssetApplied";

import ReduxDevTools from "./components/ReduxDevTools";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          {/* ════════════════════════════════════════════════════════════
              ── HOME PAGE ──
          ════════════════════════════════════════════════════════════ */}
          <Route path="/" element={<HomePage />} />

          {/* ════════════════════════════════════════════════════════════
              ── EMRS PORTAL (/emrs/*)
              Separate login system for schools/EMRS admin
          ════════════════════════════════════════════════════════════ */}
          <Route path="/emrs/login" element={<EMRSLoginPage />} />
          
          <Route
            path="/emrs/dashboard"
            element={
              <EMRSProtectedRoute allowedRoles={["school", "admin"]}>
                <SchoolEMRSWrapper />
              </EMRSProtectedRoute>
            }
          />
          
          <Route
            path="/emrs/admin"
            element={
              <EMRSProtectedRoute allowedRoles={["admin"]}>
                <EMRSAdminDashboard />
              </EMRSProtectedRoute>
            }
          />

          {/* ════════════════════════════════════════════════════════════
              ── ASSET PORTAL (/asset/*)
              Separate login system for asset managers
          ════════════════════════════════════════════════════════════ */}
          <Route path="/asset/login" element={<AssetLoginPage />} />
          
          <Route
            path="/asset/dashboard"
            element={
              <AssetProtectedRoute>
                <DashboardLayout />
              </AssetProtectedRoute>
            }
          >
            <Route path="new" element={<NewApplication />} />
            <Route path="applied" element={<Navigate to="/asset/dashboard/applied/assets" replace />} />
            <Route path="applied/emrs" element={<EMRSApplied />} />
            <Route path="applied/assets" element={<AssetApplied />} />
            <Route path="form" element={<AssetForm />} />
          </Route>

          {/* ════════════════════════════════════════════════════════════
              ── LEGACY ROUTES (kept for backwards compatibility)
          ════════════════════════════════════════════════════════════ */}
          <Route path="/signin" element={<Navigate to="/asset/login" replace />} />
          <Route path="/admin/signin" element={<Navigate to="/emrs/login" replace />} />

          {/* ════════════════════════════════════════════════════════════
              ── CATCH ALL ──
          ════════════════════════════════════════════════════════════ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ReduxDevTools />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 2. Homepage.jsx - Portal Cards Update

### Updated portals array:
```javascript
const portals = [
  {
    title: "EMRS Management", 
    subtitle: "Eklavya Model Residential School",
    description: "Manage school details, infrastructure, student enrollment, staff records, hostel administration, and operational data.",
    icon: "🏫", 
    gradient: "linear-gradient(135deg,#1e3a8a,#2563eb)", 
    accent: "#60a5fa", 
    glowColor: "rgba(37,99,235,0.3)",
    features: [
      { icon: "🏫", text: "School & Location Details" }, 
      { icon: "🎓", text: "Student Enrollment" },
      { icon: "👨‍🏫", text: "Staff Management" }, 
      { icon: "🏠", text: "Hostel Administration" },
      { icon: "🏗️", text: "Construction Status" },
    ],
    path: "/emrs/login",  // ← CHANGED from /signin
    badge: "17 Schools",
  },
  {
    title: "Asset Management", 
    subtitle: "Infrastructure & Project Tracking",
    description: "Track government assets, monitor construction projects, record financial details, and maintain comprehensive asset lifecycle.",
    icon: "🏗️", 
    gradient: "linear-gradient(135deg,#064e3b,#059669)", 
    accent: "#34d399", 
    glowColor: "rgba(5,150,105,0.3)",
    features: [
      { icon: "📊", text: "Project Details" }, 
      { icon: "🏛️", text: "Asset Tracking" },
      { icon: "💰", text: "Financial Records" }, 
      { icon: "🔨", text: "Construction Status" },
      { icon: "📍", text: "GPS Location Tagging" },
    ],
    path: "/asset/login",  // ← CHANGED from /signin
    badge: "50+ Assets",
  },
];
```

### Updated hero buttons:
```javascript
<div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
  <button onClick={() => navigate("/emrs/login")} style={{...}}>
    🏫 Access EMRS Portal
  </button>
  <button onClick={() => navigate("/asset/login")} style={{...}}>
    🏗️ Asset Portal
  </button>
</div>
```

### Updated quick links:
```javascript
const quickLinks = [
  { icon: "📋", label: "New Application", path: "/asset/login", color: "#3b82f6" },
  { icon: "🏫", label: "EMRS Portal",     path: "/emrs/login", color: "#8b5cf6" },
  { icon: "✅", label: "Already Applied", path: "/asset/login", color: "#10b981" },
  { icon: "📊", label: "View Reports",    path: "/asset/login", color: "#f59e0b" },
];
```

---

## 3. Asset Login Page - Updated Redirect

**File**: `src/pages/auth/login/login.jsx`

```javascript
// After successful login
setTimeout(() => navigate("/asset/dashboard/new"), 900);  // ← CHANGED from /dashboard/new
```

---

## 4. Sidebar Component - Updated Navigations

**File**: `src/components/layouts/header/Sidebar.jsx`

```javascript
// New Application Button
<ListItemButton
  selected={isActive("/asset/dashboard/new")}
  onClick={() => navigate("/asset/dashboard/new")}  // ← CHANGED
  sx={{...}}
>

// EMRS Link (for switching portals)
<ListItemButton
  onClick={() => navigate("/emrs/login")}  // ← CHANGED from /dashboard/emrs
  sx={{...}}
>

// Already Applied - EMRS
<ListItemButton
  onClick={() => navigate("/asset/dashboard/applied/emrs")}  // ← CHANGED
  sx={{...}}
>

// Already Applied - Assets  
<ListItemButton
  onClick={() => navigate("/asset/dashboard/applied/assets")}  // ← CHANGED
  sx={{...}}
>
```

---

## 5. Asset Form - Updated Post-Submission

**File**: `src/pages/assetManagementForm/index.jsx`

```javascript
// After form submission
if (navigate) navigate("/asset/dashboard/applied/assets");  // ← CHANGED from /dashboard/Applied/assets
```

---

## 6. EMRS Form - Updated Post-Submission

**File**: `src/pages/EMRS/EMRSForm.jsx`

```javascript
// After form submission
navigate("/emrs/dashboard");  // ← CHANGED from /dashboard/applied/emrs
```

---

## 7. Summary of Path Changes

| Old Path | New Path | Portal | Reason |
|----------|----------|--------|--------|
| `/signin` | `/asset/login` | Asset | Separate asset login |
| `/admin/signin` | `/emrs/login` | EMRS | Separate EMRS login |
| `/dashboard` | `/asset/dashboard` | Asset | Separate asset dashboard |
| `/dashboard/new` | `/asset/dashboard/new` | Asset | Asset new application |
| `/dashboard/form` | `/asset/dashboard/form` | Asset | Asset form |
| `/dashboard/applied/assets` | `/asset/dashboard/applied/assets` | Asset | Asset submissions |
| `/dashboard/applied/emrs` | `/emrs/dashboard` | EMRS | EMRS dashboard |
| `/dashboard/emrs` | `/emrs/login` | EMRS | EMRS login |
| N/A | `/emrs/login` | EMRS | New EMRS login |
| N/A | `/emrs/dashboard` | EMRS | New EMRS dashboard |
| N/A | `/asset/login` | Asset | New asset login |

---

## 8. Component Hierarchy

### Asset Portal
```
App
└── BrowserRouter
    └── Routes
        └── /asset/login (AssetLoginPage)
        └── /asset/dashboard (AssetProtectedRoute > DashboardLayout)
            ├── Sidebar (Asset navigation)
            ├── Topbar
            └── Outlet
                ├── /new (NewApplication)
                ├── /form (AssetForm)
                ├── /applied/assets (AssetApplied)
                └── /applied/emrs (EMRSApplied)
```

### EMRS Portal
```
App
└── BrowserRouter
    └── Routes
        └── /emrs/login (EMRSLoginPage)
        └── /emrs/dashboard (EMRSProtectedRoute > SchoolEMRSWrapper)
            └── EMRSForm
        └── /emrs/admin (EMRSProtectedRoute > EMRSAdminDashboard)
```

### Homepage
```
App
└── BrowserRouter
    └── Routes
        └── / (HomePage)
            ├── Portal Card: "EMRS Portal" → /emrs/login
            └── Portal Card: "Asset Portal" → /asset/login
```

---

## 9. Authentication Flow

### EMRS (Context-based)
```
EMRSLoginPage
  ↓
User enters school code/password
  ↓
authenticateUser() → checks Schoolcredentials.js
  ↓
AuthContext.login() → setUser() & localStorage
  ↓
Redirect to /emrs/dashboard
  ↓
EMRSProtectedRoute validates user exists
  ↓
SchoolEMRSWrapper loads EMRSForm with school data
```

### Asset (Redux-based)
```
AssetLoginPage
  ↓
User enters email/password
  ↓
dispatch(loginUser())
  ↓
API call to backend
  ↓
Redux store token + user
  ↓
localStorage saves token
  ↓
Redirect to /asset/dashboard/new
  ↓
AssetProtectedRoute checks token
  ↓
DashboardLayout loads with sidebar
```

---

## 10. Key Files Summary

| File | Status | Changes |
|------|--------|---------|
| `src/App.jsx` | ✏️ MODIFIED | Route restructuring for separate portals |
| `src/pages/home/homepage.jsx` | ✏️ MODIFIED | Updated portal paths to /emrs/login and /asset/login |
| `src/pages/auth/login/login.jsx` | ✏️ MODIFIED | Redirect to /asset/dashboard/new |
| `src/components/layouts/header/Sidebar.jsx` | ✏️ MODIFIED | Updated nav paths to /asset/dashboard |
| `src/pages/assetManagementForm/index.jsx` | ✏️ MODIFIED | Post-submit redirect to /asset/dashboard/applied/assets |
| `src/pages/EMRS/EMRSForm.jsx` | ✏️ MODIFIED | Post-submit redirect to /emrs/dashboard |
| `src/context/AuthContext.jsx` | ✅ NO CHANGE | Already correct |
| `src/components/ProtectedRoute.jsx` | ✅ NO CHANGE | Already correct |
| `src/pages/routes/protected-routes.jsx` | ✅ NO CHANGE | Already correct |

---

## Testing Guide

### Test Asset Portal Flow
1. Go to `http://localhost:5173/`
2. Click "Asset Portal" card
3. Should redirect to `/asset/login`
4. Login with valid credentials
5. Should redirect to `/asset/dashboard/new`
6. Verify sidebar shows asset navigation
7. Navigate to form and submit
8. Should redirect to `/asset/dashboard/applied/assets`

### Test EMRS Portal Flow
1. Go to `http://localhost:5173/`
2. Click "EMRS Portal" card
3. Should redirect to `/emrs/login`
4. Login with school code
5. Should redirect to `/emrs/dashboard`
6. Should show EMRSForm with school banner
7. Submit form
8. Should redirect to `/emrs/dashboard`

### Test Navigation Consistency
1. From Asset dashboard, try accessing `/emrs/login` - should work
2. From EMRS dashboard, try accessing `/asset/login` - should work
3. Try accessing `/asset/dashboard` without login - should redirect to `/asset/login`
4. Try accessing `/emrs/dashboard` without login - should redirect to `/emrs/login`

---

This completes the clean workflow! 🎉
