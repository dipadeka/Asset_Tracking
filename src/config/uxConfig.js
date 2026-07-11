/**
 * User Experience (UX) Improvement Configuration
 * Contains patterns, tips, and utilities for creating user-friendly forms
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. FORM FIELD AUTO-SUGGESTIONS & HINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FIELD_HINTS = {
  firstName: "Your given name (e.g., John, Rajesh)",
  lastName: "Your family name (e.g., Doe, Sharma)",
  email: "Use a personal or professional email address",
  phone: "Include country code for international numbers",
  aadharNumber: "12-digit unique identification number",
  address: "Street number, area, city, state, and postal code",
  city: "City or district of residence",
  pincode: "6-digit postal code",
  dateOfBirth: "Format: DD/MM/YYYY",
  fathersName: "Full name of father as on certificate",
  mothersName: "Full name of mother as on certificate",
  caste: "Scheduled Caste (SC) / Scheduled Tribe (ST) / Other Backward Class (OBC)",
  religion: "Your religious community",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. FORM VALIDATION MESSAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VALIDATION_MESSAGES = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  pincode: "Please enter a 6-digit pincode",
  aadhar: "Please enter a valid 12-digit Aadhar number",
  minLength: (min) => `Minimum ${min} characters required`,
  maxLength: (max) => `Maximum ${max} characters allowed`,
  match: "Values do not match",
  future: "Cannot select a future date",
  past: "Cannot select a past date",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. INTERACTIVE FIELD BEHAVIORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Auto-complete common Indian addresses
 */
export const COMMON_ADDRESSES = [
  { city: "Guwahati", district: "Kamrup", state: "Assam", pincode: "781001" },
  { city: "Silchar", district: "Cachar", state: "Assam", pincode: "788005" },
  { city: "Tezpur", district: "Sonitpur", state: "Assam", pincode: "784001" },
  { city: "Jorhat", district: "Jorhat", state: "Assam", pincode: "785001" },
  { city: "Dibrugarh", district: "Dibrugarh", state: "Assam", pincode: "786001" },
];

/**
 * Common father/mother name patterns to suggest
 */
export const COMMON_NAME_SUFFIXES = [
  "Singh",
  "Kumar",
  "Sharma",
  "Patel",
  "Verma",
  "Rao",
  "Dey",
  "Das",
  "Nath",
  "Roy",
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. FORM STEP DESCRIPTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const STEP_DESCRIPTIONS = {
  personalInfo: {
    title: "📋 Personal Information",
    description: "Enter your basic personal details",
    expectedTime: "2-3 minutes",
    tips: [
      "Use the same name as on your official documents",
      "Provide a valid email for receiving updates",
      "Include country code with phone number",
    ],
  },
  documentUpload: {
    title: "📇 Document Upload",
    description: "Upload your Aadhar and Caste Certificate for auto-population",
    expectedTime: "3-5 minutes",
    tips: [
      "Ensure documents are clear and well-lit",
      "Take straight photos, avoid angles",
      "Make sure all text is readable and within frame",
    ],
  },
  schoolPreference: {
    title: "🏫 School Preference",
    description: "Select your preferred schools sorted by proximity",
    expectedTime: "2-3 minutes",
    tips: [
      "Schools are sorted by distance from your location",
      "Select at least one school",
      "You can change preferences later",
    ],
  },
  review: {
    title: "✅ Review & Submit",
    description: "Review your application before final submission",
    expectedTime: "1-2 minutes",
    tips: [
      "Double-check all information",
      "Ensure all required fields are filled",
      "You can go back to edit any section",
    ],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. VISUAL FEEDBACK STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FEEDBACK_STYLES = {
  success: {
    icon: "✅",
    color: "#4caf50",
    background: "#f0fdf4",
    message: "Information saved successfully",
  },
  error: {
    icon: "❌",
    color: "#ef4444",
    background: "#fef2f2",
    message: "Please fix the errors and try again",
  },
  warning: {
    icon: "⚠️",
    color: "#f59e0b",
    background: "#fef3c7",
    message: "Please review the highlighted fields",
  },
  info: {
    icon: "ℹ️",
    color: "#1976d2",
    background: "#f0f7ff",
    message: "Information to help you complete the form",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. FORM SUBMISSION TIPS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SUBMISSION_TIPS = [
  "All information should match your official documents",
  "Double-check email and phone number for accuracy",
  "Use clear and recent photos of documents",
  "Ensure stable internet connection before submitting",
  "You'll receive a confirmation email after submission",
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. PROGRESSIVE ENHANCEMENT UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Debounce function for auto-save
 * Prevents excessive saves while typing
 */
export const debounce = (func, wait = 500) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate form completion percentage
 */
export const calculateFormCompletion = (formData, requiredFields) => {
  const filled = requiredFields.filter((field) => formData[field]).length;
  return Math.round((filled / requiredFields.length) * 100);
};

/**
 * Get form auto-save status
 */
export const getAutoSaveStatus = (lastSaved) => {
  if (!lastSaved) return { status: "unsaved", message: "Not saved" };
  
  const seconds = Math.floor((Date.now() - lastSaved) / 1000);
  
  if (seconds < 60) {
    return { status: "saved", message: "Just now" };
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return { status: "saved", message: `${minutes}m ago` };
  } else {
    const hours = Math.floor(seconds / 3600);
    return { status: "saved", message: `${hours}h ago` };
  }
};

/**
 * Accessibility helpers
 */
export const ACCESSIBILITY = {
  ariaLabels: {
    firstName: "First name input field",
    lastName: "Last name input field",
    email: "Email address input field",
    phone: "Phone number input field",
    document: "Document file upload",
    submit: "Submit application button",
  },
  ariaDescriptions: {
    aadhar: "Upload a clear photo of your Aadhar card",
    caste: "Upload a clear photo of your Caste Certificate",
    schools: "Select schools by clicking on them",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. MOBILE-FIRST DESIGN BREAKPOINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BREAKPOINTS = {
  xs: 0,      // Mobile
  sm: 600,    // Tablet
  md: 960,    // Small desktop
  lg: 1280,   // Large desktop
  xl: 1920,   // Extra large
};

/**
 * Responsive grid configurations
 */
export const RESPONSIVE_GRID = {
  personalInfo: {
    xs: 12,   // Full width on mobile
    sm: 6,    // Half width on tablet
    md: 4,    // Third width on desktop
  },
  address: {
    xs: 12,   // Full width on mobile
    sm: 12,   // Full width on tablet
    md: 6,    // Half width on desktop
  },
  schools: {
    xs: 12,   // Full width on mobile
    sm: 6,    // Half width on tablet
    md: 4,    // Third width on desktop
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. COMMON FIELD VALIDATORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FIELD_VALIDATORS = {
  // Email validation
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "Invalid email address";
  },

  // Phone validation (Indian format)
  phone: (value) => {
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(value) || "Invalid phone number";
  },

  // Aadhar validation
  aadhar: (value) => {
    const regex = /^\d{4}\s\d{4}\s\d{4}$|^\d{12}$/;
    return regex.test(value.replace(/\s/g, "")) || "Invalid Aadhar number";
  },

  // Pincode validation
  pincode: (value) => {
    const regex = /^\d{6}$/;
    return regex.test(value) || "Pincode must be 6 digits";
  },

  // Date of birth validation
  dateOfBirth: (value) => {
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    
    if (age < 5) return "Must be at least 5 years old";
    if (age > 100) return "Please check your date of birth";
    
    return true;
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. ERROR RECOVERY SUGGESTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ERROR_RECOVERY = {
  documentUploadFailed: {
    problem: "Unable to extract information from document",
    suggestions: [
      "Ensure the image is clear and well-lit",
      "Try uploading a different angle of the document",
      "Check that all text is visible and readable",
      "Try a different file format (JPG, PNG, WEBP)",
      "You can also enter the information manually",
    ],
  },
  locationNotFound: {
    problem: "Could not determine your location",
    suggestions: [
      "Allow location access when prompted by browser",
      "Enable GPS/Location services on your device",
      "Try a different browser",
      "You can select schools manually from the list",
    ],
  },
  submissionFailed: {
    problem: "Application submission failed",
    suggestions: [
      "Check your internet connection",
      "Try refreshing the page and submitting again",
      "Clear browser cache and cookies",
      "Try a different browser",
      "Contact support if the problem persists",
    ],
  },
};
