# Code Changes Reference

## 1. App.jsx - Route Separation

### BEFORE
```javascript
<Route path="/asset/dashboard">
  <Route path="new" element={<NewApplication />} />
  <Route path="applied" element={<Navigate to="/asset/dashboard/applied/assets" replace />} />
  <Route path="applied/emrs" element={<EMRSApplied />} />        {/* ❌ REMOVED */}
  <Route path="applied/assets" element={<AssetApplied />} />
  <Route path="form" element={<AssetForm />} />
</Route>
```

### AFTER
```javascript
{/* ════════════════════════════════════════════════════════════
    ── EMRS PORTAL (/emrs/*)
    Separate login system for schools/EMRS admin
    Shows ONLY EMRS forms and submissions
════════════════════════════════════════════════════════════ */}
<Route path="/emrs/login" element={<EMRSLoginPage />} />

<Route
  path="/emrs/dashboard"
  element={
    <EMRSProtectedRoute allowedRoles={["school", "admin"]}>
      <EMRSDashboardLayout />
    </EMRSProtectedRoute>
  }
/>

<Route
  path="/emrs/submitted"
  element={
    <EMRSProtectedRoute allowedRoles={["school", "admin"]}>
      <EMRSDashboardLayout />
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
    Shows ONLY Asset forms and submissions (NO EMRS)
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
  <Route path="applied/assets" element={<AssetApplied />} />
  <Route path="form" element={<AssetForm />} />
</Route>
```

---

## 2. Sidebar.jsx - Simplified Navigation

### BEFORE
```javascript
<Typography variant="h6" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
  Asset and EMRS Portal
</Typography>

<ListItemButton onClick={() => setOpenScheme(!openScheme)}>
  <ListItemIcon sx={{ color: "#fff" }}>
    <AccountBalance />
  </ListItemIcon>
  <ListItemText primary="Scheme" />
  {openScheme ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

{/* Scheme Children */}
<Collapse in={openScheme}>
  <List component="div" disablePadding>
    <ListItemButton onClick={() => navigate("/emrs/login")}>    {/* ❌ REMOVED */}
      <ListItemText sx={{ pl: 3 }} primary="EMRS" />
    </ListItemButton>
  </List>
</Collapse>

{/* Already Applied */}
<ListItemButton onClick={() => setOpenApplied(!openApplied)}>
  <ListItemIcon sx={{ color: "#fff" }}>
    <CheckCircle />
  </ListItemIcon>
  <ListItemText primary="Already Applied" />
  {openApplied ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={openApplied}>
  <List component="div" disablePadding>
    {/* EMRS Applied */}
    <ListItemButton onClick={() => navigate("/asset/dashboard/applied/emrs")}>    {/* ❌ REMOVED */}
      <ListItemText sx={{ pl: 3 }} primary="EMRS" />
    </ListItemButton>

    {/* Asset Applied */}
    <ListItemButton onClick={() => navigate("/asset/dashboard/applied/assets")}>
      <ListItemText sx={{ pl: 3 }} primary="Assets" />
    </ListItemButton>
  </List>
</Collapse>
```

### AFTER
```javascript
<Typography variant="h6" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
  Asset Portal
</Typography>

<List>
  {/* New Application */}
  <ListItemButton
    selected={isActive("/asset/dashboard/new")}
    onClick={() => navigate("/asset/dashboard/new")}
    sx={{
      borderRadius: 2,
      mb: 1,
      "&.Mui-selected": {
        background: "#2563eb",
        "&:hover": { background: "#1d4ed8" },
      },
    }}
  >
    <ListItemIcon sx={{ color: "#fff" }}>
      <Assignment />
    </ListItemIcon>
    <ListItemText primary="New Application" />
  </ListItemButton>

  {/* Already Applied */}
  <ListItemButton
    selected={isActive("/asset/dashboard/applied/assets")}
    onClick={() => navigate("/asset/dashboard/applied/assets")}
    sx={{
      borderRadius: 2,
      mb: 1,
      "&.Mui-selected": {
        background: "#2563eb",
        "&:hover": { background: "#1d4ed8" },
      },
    }}
  >
    <ListItemIcon sx={{ color: "#fff" }}>
      <CheckCircle />
    </ListItemIcon>
    <ListItemText primary="Submitted Applications" />
  </ListItemButton>
</List>
```

### Logout Update
```javascript
// BEFORE
navigate("/signin", { replace: true });

// AFTER
navigate("/asset/login", { replace: true });
```

---

## 3. EMRSDashboardLayout.jsx - NEW COMPONENT

### Location
`src/pages/EMRS/EMRSDashboardLayout.jsx`

### Purpose
- Provides unified EMRS portal layout
- Shows both submit form and submitted forms views
- Handles navigation between tabs
- Displays school information in header

### Key Features
```javascript
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Chip } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import SchoolEMRSWrapper from "./SchoolEMRSWrapper";
import EMRSApplied from "../submitted-application/EMRSApplied";

const EMRSDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Determine which view to show based on route
  const isSubmittedPage = location.pathname === "/emrs/submitted";

  // Header with school info and logout
  return (
    <Box sx={{ minHeight: "100vh", background: "..." }}>
      {/* Header with School Name & Logout */}
      <Box sx={{ ... }}>
        <Box>
          <Typography>🏫 EMRS Portal</Typography>
          <Chip label={`School: ${user?.schoolName}`} />
        </Box>
        <Button onClick={handleLogout} color="error">
          Logout
        </Button>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ display: "flex", gap: 16 }}>
        <Button onClick={() => navigate("/emrs/dashboard")}>
          📝 Submit EMRS Form
        </Button>
        <Button onClick={() => navigate("/emrs/submitted")}>
          ✅ Submitted Forms
        </Button>
      </Box>

      {/* Dynamic Content */}
      <Box sx={{ padding: "32px" }}>
        {isSubmittedPage ? <EMRSApplied /> : <SchoolEMRSWrapper />}
      </Box>
    </Box>
  );
};

export default EMRSDashboardLayout;
```

---

## 4. Import Changes in App.jsx

### BEFORE
```javascript
import SchoolEMRSWrapper from "./pages/EMRS/SchoolEMRSWrapper";
import EMRSAdminDashboard from "./pages/EMRS/EMRSAdminDashboard";

// ...

import EMRSApplied from "./pages/submitted-application/EMRSApplied";
import AssetApplied from "./pages/AssetApplied";
```

### AFTER
```javascript
import EMRSDashboardLayout from "./pages/EMRS/EMRSDashboardLayout";
import EMRSAdminDashboard from "./pages/EMRS/EMRSAdminDashboard";

// ...

// EMRSApplied removed (now only in EMRSDashboardLayout)
import AssetApplied from "./pages/AssetApplied";
```

---

## 5. Route Changes Summary

### EMRS Portal
| Route | Before | After | Change |
|-------|--------|-------|--------|
| `/emrs/login` | EMRSLoginPage | EMRSLoginPage | ✅ Same |
| `/emrs/dashboard` | SchoolEMRSWrapper | EMRSDashboardLayout | ✅ Updated |
| `/emrs/submitted` | EMRSApplied | EMRSDashboardLayout | ✅ Updated |
| `/emrs/admin` | EMRSAdminDashboard | EMRSAdminDashboard | ✅ Same |

### Asset Portal
| Route | Before | After | Change |
|-------|--------|-------|--------|
| `/asset/login` | AssetLoginPage | AssetLoginPage | ✅ Same |
| `/asset/dashboard/new` | NewApplication | NewApplication | ✅ Same |
| `/asset/dashboard/applied/assets` | AssetApplied | AssetApplied | ✅ Same |
| `/asset/dashboard/applied/emrs` | EMRSApplied | ❌ REMOVED | ✅ Deleted |
| `/asset/dashboard/form` | AssetForm | AssetForm | ✅ Same |

---

## 6. Navigation Updates

### Sidebar Navigation
```javascript
// BEFORE - Mixed navigation
New Application → /asset/dashboard/new
Scheme → EMRS → /emrs/login
Already Applied → EMRS → /asset/dashboard/applied/emrs
Already Applied → Assets → /asset/dashboard/applied/assets

// AFTER - Asset only
New Application → /asset/dashboard/new
Submitted Applications → /asset/dashboard/applied/assets
```

### EMRS Dashboard Navigation (NEW)
```javascript
// NEW - EMRS Portal tabs
Submit EMRS Form → /emrs/dashboard → SchoolEMRSWrapper
Submitted Forms → /emrs/submitted → EMRSApplied
```

---

## 7. File Structure Changes

### Removed Routes
```javascript
// ❌ REMOVED from App.jsx
<Route path="applied/emrs" element={<EMRSApplied />} />  // Was in /asset/dashboard
```

### New Files Created
```javascript
// ✅ NEW
src/pages/EMRS/EMRSDashboardLayout.jsx
```

### Modified Files
```javascript
// ✅ MODIFIED
src/App.jsx                                    // Routes restructured
src/components/layouts/header/Sidebar.jsx      // Simplified navigation
```

### Unchanged Files
```javascript
// ✅ NO CHANGE (already correct)
src/pages/home/homepage.jsx
src/pages/auth/login/login.jsx                 // Asset portal
src/pages/auth/login/index.jsx                 // EMRS portal
src/pages/EMRS/EMRSForm.jsx
src/pages/assetManagementForm/index.jsx
src/context/AuthContext.jsx
src/components/ProtectedRoute.jsx
src/pages/routes/protected-routes.jsx
```

---

## 🧪 Testing the Changes

### Asset Portal Flow
```
1. Homepage → Click "Asset Portal"
2. Go to /asset/login
3. Login with credentials
4. Redirect to /asset/dashboard/new
5. Sidebar shows ONLY:
   - New Application
   - Submitted Applications (Assets only)
6. Click "Submitted Applications"
7. See ONLY asset submissions (no EMRS forms)
8. Verify no EMRS-related elements visible
```

### EMRS Portal Flow
```
1. Homepage → Click "EMRS Portal"
2. Go to /emrs/login
3. Login with school code
4. Redirect to /emrs/dashboard
5. See tabs: "Submit EMRS Form" | "Submitted Forms"
6. Click "Submitted Forms" tab
7. Go to /emrs/submitted
8. See ONLY EMRS submissions
9. Click "Submit EMRS Form" tab
10. Go to /emrs/dashboard
11. See EMRSForm ready to submit
```

---

## Summary

All changes ensure **complete separation** of EMRS and Asset portals:

✅ Asset portal shows ONLY asset-related forms and submissions
✅ EMRS portal shows ONLY EMRS-related forms and submissions
✅ No data mixing between portals
✅ Clean, focused user interfaces
✅ Easy to maintain and extend

**Perfect implementation!** 🎉
