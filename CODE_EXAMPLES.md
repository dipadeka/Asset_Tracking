# Code Examples & Usage Guide

This document provides practical code examples for using the smart application features.

---

## 1️⃣ Smart Document Upload Examples

### Basic Usage

```jsx
import SmartDocumentUpload from "@/components/SmartDocumentUpload";

function MyForm() {
  const [formData, setFormData] = useState({});

  const handleDataExtracted = (extractedData) => {
    console.log("Extracted data:", extractedData);
    // Process extracted data
  };

  return (
    <SmartDocumentUpload
      documentType="aadhar"
      formData={formData}
      setFormData={setFormData}
      onDataExtracted={handleDataExtracted}
    />
  );
}
```

### With Validation

```jsx
import SmartDocumentUpload from "@/components/SmartDocumentUpload";
import { validateExtractedData } from "@/services/documentExtractor";

function ApplicationForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleDataExtracted = (extractedData) => {
    // Validate extracted data
    const validated = validateExtractedData(extractedData);
    
    // Check required fields
    if (!validated.address || !validated.name) {
      setErrors({
        extraction: "Required fields missing from document"
      });
      return;
    }
    
    // Update form with validated data
    setFormData(prev => ({
      ...prev,
      address: validated.address,
      name: validated.name,
    }));
  };

  return (
    <>
      <SmartDocumentUpload
        documentType="aadhar"
        formData={formData}
        setFormData={setFormData}
        onDataExtracted={handleDataExtracted}
      />
      {errors.extraction && (
        <Alert severity="error">{errors.extraction}</Alert>
      )}
    </>
  );
}
```

---

## 2️⃣ Geolocation & School Selection Examples

### Get User Location

```jsx
import { getUserLocation } from "@/utils/geoUtils";

async function getCurrentLocation() {
  try {
    const location = await getUserLocation();
    console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
    console.log(`Accuracy: ±${location.accuracy} meters`);
  } catch (error) {
    console.error("Location access denied:", error.message);
  }
}
```

### Sort Schools by Proximity

```jsx
import { sortSchoolsByProximity, calculateDistance } from "@/utils/geoUtils";

const schools = [
  { name: "EMRS Dalbari", lat: 26.45, lng: 90.85 },
  { name: "EMRS Jalah", lat: 26.46, lng: 90.86 },
  { name: "EMRS Kharadhara", lat: 26.67, lng: 91.18 },
];

const userLat = 26.5;
const userLng = 90.9;

// Sort schools by proximity
const sorted = sortSchoolsByProximity(schools, userLat, userLng);
console.log("Sorted schools:", sorted);

// Calculate distance to specific school
const distance = calculateDistance(
  userLat, userLng,
  sorted[0].lat, sorted[0].lng
);
console.log(`Distance to nearest school: ${distance} km`);
```

### Get Schools Within Radius

```jsx
import { getSchoolsWithinRadius, formatDistance } from "@/utils/geoUtils";

const schools = [...]; // Your schools array
const userLocation = { lat: 26.5, lng: 90.9 };

// Get schools within 25km radius
const nearby = getSchoolsWithinRadius(
  schools,
  userLocation.lat,
  userLocation.lng,
  25 // radius in km
);

// Display with formatted distance
nearby.forEach(school => {
  const distance = calculateDistance(
    userLocation.lat, userLocation.lng,
    school.lat, school.lng
  );
  console.log(`${school.name}: ${formatDistance(distance)}`);
});
```

### Use ExamPreferenceSelector Component

```jsx
import ExamPreferenceSelector from "@/components/ExamPreferenceSelector";
import { EMRS_PINS } from "@/data/emrsSchools";

function SchoolSelectionStep() {
  const [selectedSchools, setSelectedSchools] = useState([]);

  const handleSchoolSelection = (schools) => {
    setSelectedSchools(schools);
    console.log("Selected schools:", schools);
  };

  return (
    <div>
      <h2>Select Your Preferred Schools</h2>
      <ExamPreferenceSelector
        schools={EMRS_PINS}
        selectedSchools={selectedSchools}
        onSelectionChange={handleSchoolSelection}
      />
      
      {selectedSchools.length > 0 && (
        <div>
          <h3>You selected {selectedSchools.length} schools:</h3>
          <ul>
            {selectedSchools.map(school => (
              <li key={school}>{school}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

## 3️⃣ Complete Application Form Examples

### Basic Implementation

```jsx
import SmartApplicationForm from "@/components/SmartApplicationForm";
import { EMRS_PINS } from "@/data/emrsSchools";

export default function ApplyPage() {
  return <SmartApplicationForm schools={EMRS_PINS} />;
}
```

### With Custom Styling

```jsx
import SmartApplicationForm from "@/components/SmartApplicationForm";
import { Box, Container } from "@mui/material";

export default function ApplyPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4, background: "#f5f5f5", borderRadius: 2 }}>
        <SmartApplicationForm schools={EMRS_PINS} />
      </Box>
    </Container>
  );
}
```

### With Custom Success Handling

```jsx
import SmartApplicationForm from "@/components/SmartApplicationForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ApplyPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a success message in location state
    const state = window.history.state;
    if (state?.success) {
      // Show success notification
      console.log("Application submitted successfully!");
    }
  }, []);

  return <SmartApplicationForm schools={EMRS_PINS} />;
}
```

---

## 4️⃣ Form Validation & Error Handling Examples

### Using UX Config Validators

```jsx
import { FIELD_VALIDATORS, VALIDATION_MESSAGES } from "@/config/uxConfig";
import { TextField } from "@mui/material";
import { useState } from "react";

function EmailField() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Validate on change
    const result = FIELD_VALIDATORS.email(value);
    setError(result === true ? "" : result);
  };

  return (
    <TextField
      label="Email"
      value={email}
      onChange={handleChange}
      error={!!error}
      helperText={error || VALIDATION_MESSAGES.required}
    />
  );
}
```

### Custom Validation Logic

```jsx
import { FIELD_VALIDATORS } from "@/config/uxConfig";

function validateForm(formData) {
  const errors = {};
  
  // Validate each field
  if (!formData.email) {
    errors.email = "Email is required";
  } else {
    const emailResult = FIELD_VALIDATORS.email(formData.email);
    if (emailResult !== true) {
      errors.email = emailResult;
    }
  }
  
  if (!formData.phone) {
    errors.phone = "Phone is required";
  } else {
    const phoneResult = FIELD_VALIDATORS.phone(formData.phone);
    if (phoneResult !== true) {
      errors.phone = phoneResult;
    }
  }
  
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const dobResult = FIELD_VALIDATORS.dateOfBirth(formData.dateOfBirth);
    if (dobResult !== true) {
      errors.dateOfBirth = dobResult;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Usage
const { valid, errors } = validateForm(formData);
if (!valid) {
  console.log("Validation errors:", errors);
}
```

---

## 5️⃣ Document Extraction Examples

### Extract Aadhar Data

```jsx
import { extractAadharData, validateExtractedData } from "@/services/documentExtractor";

async function processAadharCard(imageFile) {
  try {
    // Extract data from document
    const extractedData = await extractAadharData(imageFile);
    
    console.log("Extraction confidence:", extractedData.confidence);
    console.log("Address:", extractedData.address);
    console.log("Name:", extractedData.name);
    console.log("DOB:", extractedData.dateOfBirth);
    
    // Validate extracted data
    const validated = validateExtractedData(extractedData);
    
    // Use validated data
    return validated;
  } catch (error) {
    console.error("Extraction failed:", error.message);
    throw error;
  }
}
```

### Extract Caste Certificate Data

```jsx
import { extractCasteCertificateData } from "@/services/documentExtractor";

async function processCasteCertificate(imageFile) {
  try {
    const extractedData = await extractCasteCertificateData(imageFile);
    
    return {
      fathersName: extractedData.fathersName,
      mothersName: extractedData.mothersName,
      dateOfBirth: extractedData.dateOfBirth,
      caste: extractedData.caste,
      religion: extractedData.religion,
      certificateNumber: extractedData.certificateNumber,
      confidence: extractedData.confidence
    };
  } catch (error) {
    console.error("Certificate extraction failed:", error);
    throw error;
  }
}
```

### Merge Extracted Data

```jsx
import { mergeExtractedDataToForm } from "@/services/documentExtractor";

const formData = {
  firstName: "",
  lastName: "",
  address: "",
  // ...
};

const extractedAadhar = await extractAadharData(file);

// Merge extracted data into form
const mergedData = mergeExtractedDataToForm(
  formData,
  extractedAadhar,
  "aadhar"
);

console.log("Merged form data:", mergedData);
```

---

## 6️⃣ Integration with React Hook Form

### Complete Form with Auto-Population

```jsx
import { useForm, Controller } from "react-hook-form";
import SmartDocumentUpload from "@/components/SmartDocumentUpload";
import { TextField, Button } from "@mui/material";

function ApplicationForm() {
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
      fathersName: "",
      mothersName: "",
      preferredSchools: [],
    }
  });

  const handleDataExtracted = (extractedData) => {
    // Auto-populate form fields
    if (extractedData.name) {
      const [first, ...last] = extractedData.name.split(" ");
      setValue("firstName", first);
      setValue("lastName", last.join(" "));
    }
    
    if (extractedData.address) {
      setValue("address", extractedData.address);
    }
    
    if (extractedData.dateOfBirth) {
      setValue("dateOfBirth", extractedData.dateOfBirth);
    }
    
    if (extractedData.fathersName) {
      setValue("fathersName", extractedData.fathersName);
    }
    
    if (extractedData.mothersName) {
      setValue("mothersName", extractedData.mothersName);
    }
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Save or submit form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SmartDocumentUpload
        documentType="aadhar"
        onDataExtracted={handleDataExtracted}
      />
      
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="First Name" />
        )}
      />
      
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Address" multiline rows={3} />
        )}
      />
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## 7️⃣ Error Handling & Recovery

### Handle Document Extraction Errors

```jsx
import SmartDocumentUpload from "@/components/SmartDocumentUpload";
import { Alert, Box } from "@mui/material";
import { ERROR_RECOVERY } from "@/config/uxConfig";
import { useState } from "react";

function DocumentUploadWithErrorHandling() {
  const [error, setError] = useState(null);

  const handleDataExtracted = (data) => {
    try {
      // Process extracted data
      if (!data || !data.address) {
        throw new Error("Required fields missing");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <SmartDocumentUpload
        onDataExtracted={handleDataExtracted}
      />
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <strong>Document Upload Failed</strong>
          <Box component="div" sx={{ mt: 1 }}>
            {ERROR_RECOVERY.documentUploadFailed.suggestions.map((suggestion, idx) => (
              <div key={idx}>• {suggestion}</div>
            ))}
          </Box>
        </Alert>
      )}
    </>
  );
}
```

### Handle Geolocation Errors

```jsx
import ExamPreferenceSelector from "@/components/ExamPreferenceSelector";
import { Alert, Box } from "@mui/material";
import { ERROR_RECOVERY } from "@/config/uxConfig";
import { useEffect, useState } from "react";

function SchoolSelectionWithErrorHandling() {
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Check if location access is denied
    navigator.permissions?.query({ name: "geolocation" }).then(result => {
      if (result.state === "denied") {
        setLocationError("Location access is blocked");
      }
    });
  }, []);

  return (
    <>
      <ExamPreferenceSelector schools={schools} />
      
      {locationError && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <strong>Location Access Issue</strong>
          <Box component="div" sx={{ mt: 1 }}>
            {ERROR_RECOVERY.locationNotFound.suggestions.map((suggestion, idx) => (
              <div key={idx}>• {suggestion}</div>
            ))}
          </Box>
        </Alert>
      )}
    </>
  );
}
```

---

## 8️⃣ Data Persistence Examples

### Save to LocalStorage

```jsx
import { useState } from "react";

function SaveApplicationToStorage(applicationData) {
  try {
    // Get existing applications
    const existing = JSON.parse(
      localStorage.getItem("smartApplications") || "[]"
    );
    
    // Add new application
    const newApplication = {
      ...applicationData,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };
    
    existing.push(newApplication);
    
    // Save to localStorage
    localStorage.setItem(
      "smartApplications",
      JSON.stringify(existing)
    );
    
    console.log("Application saved successfully");
    return true;
  } catch (error) {
    console.error("Failed to save application:", error);
    return false;
  }
}

// Usage
const success = SaveApplicationToStorage(formData);
if (success) {
  // Show success message
}
```

### Save to Backend API

```jsx
async function submitApplicationToBackend(applicationData) {
  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(applicationData)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Application submitted:", result);
    return result;
  } catch (error) {
    console.error("Submission failed:", error);
    throw error;
  }
}

// Usage with error handling
try {
  const result = await submitApplicationToBackend(formData);
  navigate(`/application-status/${result.id}`);
} catch (error) {
  setError("Failed to submit application. Please try again.");
}
```

---

## 9️⃣ Performance Optimization

### Debounce Auto-Save

```jsx
import { debounce } from "@/config/uxConfig";
import { useState, useCallback } from "react";

function FormWithAutoSave() {
  const [formData, setFormData] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  const saveToStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("formDraft", JSON.stringify(data));
      setLastSaved(new Date());
      console.log("Form auto-saved");
    }, 1000),
    []
  );

  const handleFormChange = (data) => {
    setFormData(data);
    saveToStorage(data);  // Debounced save
  };

  return (
    <div>
      {/* Form fields */}
      {lastSaved && (
        <p>Last saved: {lastSaved.toLocaleTimeString()}</p>
      )}
    </div>
  );
}
```

### Lazy Load Schools

```jsx
import { useMemo, useCallback } from "react";
import { sortSchoolsByProximity } from "@/utils/geoUtils";

function SchoolListWithLazyLoading() {
  const [userLocation, setUserLocation] = useState(null);
  const [schools, setSchools] = useState([]);

  // Memoize sorted schools to avoid recalculation
  const sortedSchools = useMemo(() => {
    if (!userLocation) return schools;
    return sortSchoolsByProximity(
      schools,
      userLocation.lat,
      userLocation.lng
    );
  }, [schools, userLocation]);

  return (
    <div>
      {sortedSchools.map(school => (
        <SchoolCard key={school.name} school={school} />
      ))}
    </div>
  );
}
```

---

## 🔟 Testing Examples

### Unit Test for Document Extraction

```javascript
import { extractAadharData } from "@/services/documentExtractor";

describe("Document Extraction", () => {
  test("should extract Aadhar data from image", async () => {
    const mockFile = new File(["dummy"], "aadhar.jpg", { type: "image/jpeg" });
    
    const result = await extractAadharData(mockFile);
    
    expect(result).toHaveProperty("aadharNumber");
    expect(result).toHaveProperty("address");
    expect(result).toHaveProperty("confidence");
    expect(result.confidence).toBeGreaterThan(0.7);
  });
});
```

### Unit Test for Geolocation

```javascript
import { calculateDistance } from "@/utils/geoUtils";

describe("Geolocation Utils", () => {
  test("should calculate distance between two points", () => {
    const distance = calculateDistance(
      26.45, 90.85,  // Point 1 (EMRS Dalbari)
      26.46, 90.86   // Point 2 (EMRS Jalah)
    );
    
    // Expected distance is approximately 1.2-1.3 km
    expect(distance).toBeBetween(1, 2);
  });
});
```

---

## 🎯 Quick Start Template

```jsx
import React, { useState } from "react";
import SmartApplicationForm from "@/components/SmartApplicationForm";
import { EMRS_PINS } from "@/data/emrsSchools";
import { Container } from "@mui/material";

export default function QuickStartApp() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SmartApplicationForm schools={EMRS_PINS} />
    </Container>
  );
}
```

---

**For more information, refer to:**
- `SMART_APPLICATION_GUIDE.md` - Complete API reference
- `INTEGRATION_GUIDE.md` - Integration instructions
- Source code comments for detailed implementation

Happy coding! 🚀
