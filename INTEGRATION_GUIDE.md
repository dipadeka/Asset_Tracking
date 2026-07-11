# Integration Guide: Smart Application Features

This guide explains how to integrate the new smart application features into your existing Asset Tracking application.

## 📁 New Files Created

```
src/
├── services/
│   └── documentExtractor.js          # Document extraction and OCR logic
├── utils/
│   └── geoUtils.js                   # Geolocation and distance utilities
├── components/
│   ├── SmartDocumentUpload.jsx        # Document upload component
│   ├── ExamPreferenceSelector.jsx     # School selector component
│   └── SmartApplicationForm.jsx       # Complete application form
├── config/
│   └── uxConfig.js                   # UX configuration and helpers
├── pages/
│   └── ApplyOnline.jsx                # "Apply Online" page
├── SMART_APPLICATION_GUIDE.md         # Feature documentation
└── INTEGRATION_GUIDE.md               # This file

```

## 🔗 Step 1: Add Route for "Apply Online"

Update your routing configuration to include the new Apply Online page:

### In `src/App.jsx` or your routing file:

```jsx
import ApplyOnline from "./pages/ApplyOnline";

const routes = [
  // ... existing routes
  {
    path: "/apply-online",
    element: <ApplyOnline />,
    requiresAuth: true  // Uncomment if authentication is required
  },
  // ... other routes
];
```

### Or with React Router v6:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplyOnline from "./pages/ApplyOnline";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... existing routes */}
        <Route path="/apply-online" element={<ApplyOnline />} />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

## 🎨 Step 2: Add Navigation Link

Add a link to the Apply Online page in your navigation/menu:

```jsx
<Link to="/apply-online">
  🎓 Apply Online
</Link>
```

Or in a resources/dashboard context:

```jsx
<Button 
  variant="contained"
  onClick={() => navigate("/apply-online")}
>
  Apply Online for EMRS
</Button>
```

## 📱 Step 3: Integrate SmartDocumentUpload into Asset Form

If you want to add document extraction to your existing asset form:

```jsx
// In your asset form component (e.g., src/pages/assetManagementForm/index.jsx)

import SmartDocumentUpload from "../../components/SmartDocumentUpload";

// Add this to your form component
{currentStep === 1 && (
  <>
    {/* ... existing address fields ... */}
    
    {/* New section for smart document upload */}
    <Grid item xs={12}>
      <Typography variant="h6" sx={{
        background: "linear-gradient(to right, #1976d2, #42a5f5)",
        color: "#fff", padding: "8px 16px", borderRadius: 2, 
        fontWeight: 600, mb: 2,
      }}>
        📇 Quick Address Auto-Fill (Optional)
      </Typography>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <SmartDocumentUpload
        documentType="aadhar"
        formData={formData}
        setFormData={setFormData}
        onDataExtracted={(data) => {
          if (data.address) setValue("fullPostalAddress", data.address);
        }}
      />
    </Grid>
  </>
)}
```

## 🏫 Step 4: Integrate ExamPreferenceSelector

To add the smart school selector to any form:

```jsx
import ExamPreferenceSelector from "../../components/ExamPreferenceSelector";
import { EMRS_PINS } from "../../path/to/your/emrs-data";

// In your form component
{currentStep === examStep && (
  <>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
      🏫 Select Preferred Schools
    </Typography>
    
    <ExamPreferenceSelector
      schools={EMRS_PINS}
      selectedSchools={selectedSchools}
      onSelectionChange={setSelectedSchools}
    />
  </>
)}
```

## 📋 Step 5: Add EMRS Schools Data

Make sure your EMRS schools data includes coordinates (lat/lng):

```javascript
// src/data/emrsSchools.js (create if doesn't exist)

export const EMRS_PINS = [
  {
    name: "EMRS Dalbari, Barama",
    district: "Baksa",
    students: 300,
    cap: 300,
    classes: "VI-XII",
    status: "Functional",
    principal: "Mr. R. Basumatary",
    lat: 26.4500,    // ✓ Required for proximity sorting
    lng: 90.8500,    // ✓ Required for proximity sorting
    image: "/images/emrs-dalbari.jpg"
  },
  // ... more schools
];
```

## 🔧 Step 6: Install Required Dependencies

Make sure all required packages are installed:

```bash
# Required packages (most should already be installed)
npm install @mui/material @mui/icons-material
npm install react-hook-form
npm install dayjs

# Optional: For better OCR (if not using fallback)
npm install tesseract.js

# Ensure these are installed
npm install react-router-dom
npm install axios  # For API calls if needed
```

## 📊 Step 7: Handle Form Submissions

Update your form submission logic to handle the new application data:

```javascript
// In ApplyOnline.jsx or your form component

const handleSubmit = async (applicationData) => {
  try {
    // Option 1: Save to localStorage (for demo)
    const submissions = JSON.parse(
      localStorage.getItem("smartApplications") || "[]"
    );
    submissions.push({
      ...applicationData,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("smartApplications", JSON.stringify(submissions));

    // Option 2: Send to backend API (production)
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    });

    if (response.ok) {
      toast.success("Application submitted successfully!");
      navigate("/applications-status");
    }
  } catch (error) {
    toast.error("Failed to submit application");
    console.error(error);
  }
};
```

## 🎯 Step 8: Create Applications Dashboard

Create a page to view submitted applications:

```jsx
// src/pages/ApplicationsStatus.jsx

import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Container, Typography } from "@mui/material";

export default function ApplicationsStatus() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("smartApplications");
    if (stored) {
      setApplications(JSON.parse(stored));
    }
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        📋 My Applications
      </Typography>
      
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#f0f7ff" }}>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Schools</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.firstName} {app.lastName}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{app.preferredSchools.length}</TableCell>
              <TableCell>
                {new Date(app.submittedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

// Add route:
// <Route path="/applications-status" element={<ApplicationsStatus />} />
```

## 🔐 Step 9: Security Considerations

### For Production Deployment:

1. **Encrypt Sensitive Data**:
```javascript
// Before sending to backend
const encryptData = (data) => {
  // Use a library like crypto-js
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};
```

2. **Backend Validation**:
```javascript
// Always validate on backend
app.post("/api/applications", (req, res) => {
  const { firstName, email, preferredSchools } = req.body;
  
  // Validate all fields
  if (!firstName || !email || !preferredSchools.length) {
    return res.status(400).json({ error: "Invalid data" });
  }
  
  // Save to database
  // ...
});
```

3. **HTTPS Only**:
- Ensure all API endpoints use HTTPS
- Use secure cookies for sensitive data

## 📝 Step 10: Environment Configuration

Create environment variables for API endpoints:

```env
# .env
VITE_API_BASE_URL=https://your-api.com
VITE_OCR_API_KEY=your-ocr-service-key
VITE_ENABLE_ANALYTICS=true
```

Usage in code:
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

## 🧪 Testing Checklist

- [ ] Document upload works with sample images
- [ ] OCR extraction returns expected data
- [ ] Location detection works correctly
- [ ] Schools are sorted by proximity
- [ ] Form validation catches errors
- [ ] Submission saves data correctly
- [ ] Mobile responsive design works
- [ ] Accessibility features work (keyboard nav, screen readers)

## 📞 Troubleshooting

### OCR Not Extracting Data
- Check browser console for errors
- Verify Tesseract.js is loaded
- Try with clearer document images
- Check file format (JPG/PNG/WEBP)

### Location Not Detected
- Check browser permissions for geolocation
- Verify GPS/Location is enabled on device
- Try different browser
- Fallback to manual school selection

### Form Not Submitting
- Check internet connection
- Verify localStorage quota
- Check browser console for errors
- Try clearing cache

## 📚 Additional Resources

- [Tesseract.js Docs](https://github.com/naptha/tesseract.js)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [React Hook Form](https://react-hook-form.com/)
- [Material-UI Documentation](https://mui.com/)

## 🎉 Success!

Once you've completed these steps, your Asset Tracking application will have:

✅ Smart document upload with auto-population
✅ Intelligent school selection based on location
✅ User-friendly step-by-step application process
✅ Form validation and error handling
✅ Mobile-responsive design
✅ Accessibility features

For questions or issues, refer to the SMART_APPLICATION_GUIDE.md file.
