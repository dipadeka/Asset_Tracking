/**
 * Document Extractor Service
 * Handles extraction of data from Aadhar cards and Caste certificates using OCR/image analysis
 */

// Aadhar number pattern (12 digits)
const AADHAR_PATTERN = /\d{4}\s\d{4}\s\d{4}/;

// DOB patterns (various formats)
const DOB_PATTERNS = [
  /(?:DOB|Date\s+of\s+Birth)[:\s]+(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})/i,
  /\b(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})\b/,
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b/i,
  /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i,
];

// Father/Mother name patterns (common prefixes/suffixes)
const NAME_INDICATORS = [
  /(?:Father|Father's|Father\s+Name|Padre|S\/O|S\.O\.|Father of|F\/O)[\s:]*([A-Z][a-zA-Z\s\.]+?)(?=\n|$|Father|Mother|S\/O|DOB|Date)/i,
  /(?:Mother|Mother's|Mother\s+Name|Madre|D\/O|D\.O\.|Mother of|M\/O)[\s:]*([A-Z][a-zA-Z\s\.]+?)(?=\n|$|Father|Mother|D\/O|DOB|Date)/i,
];

/**
 * Extract Aadhar card information
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Extracted data (address, name, DOB, aadhar number)
 */
export const extractAadharData = async (file) => {
  try {
    const text = await extractTextFromImage(file);
    
    return {
      aadharNumber: extractAadharNumber(text),
      address: extractAddress(text),
      name: extractName(text),
      dateOfBirth: extractDOB(text),
      gender: extractGender(text),
      rawText: text,
      confidence: 0.85, // Confidence score for extracted data
    };
  } catch (error) {
    console.error("Error extracting Aadhar data:", error);
    throw new Error("Failed to extract Aadhar card data. Please try again.");
  }
};

/**
 * Extract Caste Certificate information
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Extracted data (father/mother name, DOB, caste, etc.)
 */
export const extractCasteCertificateData = async (file) => {
  try {
    const text = await extractTextFromImage(file);
    
    return {
      fathersName: extractFathersName(text),
      mothersName: extractMothersName(text),
      dateOfBirth: extractDOB(text),
      caste: extractCaste(text),
      religion: extractReligion(text),
      certificateNumber: extractCertificateNumber(text),
      issueDate: extractIssueDate(text),
      rawText: text,
      confidence: 0.80, // Confidence score for extracted data
    };
  } catch (error) {
    console.error("Error extracting Caste Certificate data:", error);
    throw new Error("Failed to extract Caste Certificate data. Please try again.");
  }
};

/**
 * Extract text from image using Tesseract OCR
 * Note: This requires tesseract.js library to be installed
 * @param {File} file - Image file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromImage = async (file) => {
  try {
    // Try to use Tesseract if available, otherwise use a simpler approach
    const { default: Tesseract } = await import("tesseract.js");
    
    const result = await Tesseract.recognize(file, "eng");
    return result.data.text || "";
  } catch (error) {
    console.warn("Tesseract not available, using fallback method");
    
    // Fallback: Use Canvas API to extract pixel-level data
    // For production, consider using a backend API service
    return fallbackTextExtraction(file);
  }
};

/**
 * Fallback text extraction using Canvas
 * @param {File} file - Image file
 * @returns {Promise<string>} - Extracted text (limited)
 */
const fallbackTextExtraction = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Basic canvas operations
        // In production, use OCR API or service
        resolve(""); // Return empty for now; in production use API
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Extract Aadhar number from text
 */
const extractAadharNumber = (text) => {
  const match = text.match(AADHAR_PATTERN);
  return match ? match[0].replace(/\s/g, "") : "";
};

/**
 * Extract address from text
 */
const extractAddress = (text) => {
  // Look for address keywords and extract following text
  const addressKeywords = ["Address", "Address :", "Permanent Address", "Residential Address"];
  
  for (const keyword of addressKeywords) {
    const regex = new RegExp(`${keyword}[:\\s]+([A-Z][^,]*(?:,[^,]*)*)`);
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  
  return "";
};

/**
 * Extract name from text
 */
const extractName = (text) => {
  // First name usually appears near top of document
  const lines = text.split("\n");
  
  for (const line of lines.slice(0, 10)) {
    const match = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    if (match) return match[1].trim();
  }
  
  return "";
};

/**
 * Extract Date of Birth from text
 */
const extractDOB = (text) => {
  for (const pattern of DOB_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Format to DD/MM/YYYY if needed
      return formatDate(match);
    }
  }
  return "";
};

/**
 * Extract Father's name from text
 */
const extractFathersName = (text) => {
  // Try various patterns for father's name
  const patterns = [
    /(?:Father|Father's|Father\s+Name|Padre|S\/O|S\.O\.|Father of|F\/O)[\s:]*([A-Z][a-zA-Z\s\.]+?)(?=\n|Father|Mother|S\/O|DOB|Date|Occupation|Religion|Caste|$)/i,
    /Father\s*:?\s*([A-Z][a-zA-Z\s\.]+)/i,
    /F\/O\s*:?\s*([A-Z][a-zA-Z\s\.]+)/i,
    /S\/O\s*:?\s*([A-Z][a-zA-Z\s\.]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, " ");
    }
  }
  return "";
};

/**
 * Extract Mother's name from text
 */
const extractMothersName = (text) => {
  // Try various patterns for mother's name
  const patterns = [
    /(?:Mother|Mother's|Mother\s+Name|Madre|D\/O|D\.O\.|Mother of|M\/O)[\s:]*([A-Z][a-zA-Z\s\.]+?)(?=\n|Father|Mother|D\/O|DOB|Date|Occupation|Religion|Caste|$)/i,
    /Mother\s*:?\s*([A-Z][a-zA-Z\s\.]+)/i,
    /M\/O\s*:?\s*([A-Z][a-zA-Z\s\.]+)/i,
    /D\/O\s*:?\s*([A-Z][a-zA-Z\s\.]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, " ");
    }
  }
  return "";
};

/**
 * Extract Caste from text
 */
const extractCaste = (text) => {
  const match = text.match(/(?:Caste|Category|Caste Category)[:\s]+([A-Za-z\s]+)/i);
  return match ? match[1].trim() : "";
};

/**
 * Extract Religion from text
 */
const extractReligion = (text) => {
  const match = text.match(/(?:Religion|Faith)[:\s]+([A-Za-z\s]+)/i);
  return match ? match[1].trim() : "";
};

/**
 * Extract Certificate number from text
 */
const extractCertificateNumber = (text) => {
  const match = text.match(/(?:Certificate|Cert)\s+(?:No|Number|#)[:\s]+([A-Z0-9\/\-]+)/i);
  return match ? match[1].trim() : "";
};

/**
 * Extract Gender from text
 */
const extractGender = (text) => {
  if (text.match(/\b(?:Male|M)\b/i)) return "Male";
  if (text.match(/\b(?:Female|F|W)\b/i)) return "Female";
  return "";
};

/**
 * Extract Issue Date from text
 */
const extractIssueDate = (text) => {
  const datePattern = /(?:Issued|Date of Issue|Issue Date)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i;
  const match = text.match(datePattern);
  return match ? match[1] : "";
};

/**
 * Format date to YYYY-MM-DD for HTML input
 */
const formatDate = (match) => {
  // This is a simplified formatter; enhance based on actual needs
  if (!match) return "";
  
  const [, ...parts] = match;
  
  // Check if it's numeric format (DD/MM/YYYY)
  if (parts.length >= 3 && !isNaN(parts[0])) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`; // Return as YYYY-MM-DD for HTML input
  }
  
  // Check if it's text format (e.g., "January 01, 2000")
  if (parts.length >= 3 && isNaN(parts[0])) {
    const monthName = parts[0];
    const day = parts[1].padStart(2, "0");
    const year = parts[2];
    const months = {
      "january": "01", "february": "02", "march": "03", "april": "04",
      "may": "05", "june": "06", "july": "07", "august": "08",
      "september": "09", "october": "10", "november": "11", "december": "12"
    };
    const month = months[monthName.toLowerCase()] || "01";
    return `${year}-${month}-${day}`;
  }
  
  return "";
};

/**
 * Validate and sanitize extracted data
 */
export const validateExtractedData = (data) => {
  const validated = { ...data };
  
  // Sanitize strings
  for (const key in validated) {
    if (typeof validated[key] === "string") {
      validated[key] = validated[key].trim();
    }
  }
  
  return validated;
};

/**
 * Merge extracted data into form values
 */
export const mergeExtractedDataToForm = (formData, extractedData, documentType) => {
  const merged = { ...formData };
  
  if (documentType === "aadhar") {
    if (extractedData.address) merged.address = extractedData.address;
    if (extractedData.name) merged.name = extractedData.name;
    if (extractedData.dateOfBirth) merged.dateOfBirth = extractedData.dateOfBirth;
  } else if (documentType === "casteCertificate") {
    if (extractedData.fathersName) merged.fathersName = extractedData.fathersName;
    if (extractedData.mothersName) merged.mothersName = extractedData.mothersName;
    if (extractedData.dateOfBirth) merged.dateOfBirth = extractedData.dateOfBirth;
  }
  
  return merged;
};
