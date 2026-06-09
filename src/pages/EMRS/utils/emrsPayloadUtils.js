/** Helpers to align EMRS form data with backend Mongoose schema types. */

export const toSafeNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const toOptionalNumber = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

export const isValidNumericString = (value) => {
  if (value === "" || value == null) return true;
  return /^\d+(\.\d+)?$/.test(String(value).trim());
};

export const sanitizeConstructionComponents = (rows = []) =>
  rows.map((row) => ({
    component: row.component || "",
    units: row.units || "",
    status: row.status || "",
    progress: toSafeNumber(row.progress, 0),
    startDate: row.startDate || "",
    endDate: row.endDate || "",
    assignedTo: row.assignedTo || "",
    budget: toSafeNumber(row.budget, 0),
    remarks: row.remarks || "",
  }));

export const validateEmrsFormData = ({
  data,
  constructionRows,
  operationalCostRows,
  enrollmentRows,
  teachingRows,
  nonTeachingRows,
  hospitalizationRows,
}) => {
  const errors = [];

  if (data.udaisecode && !/^\d+$/.test(String(data.udaisecode).trim())) {
    errors.push("UDISE Code must contain digits only.");
  }

  if (data.contactno && !/^[0-9]{10}$/.test(String(data.contactno).trim())) {
    errors.push("Contact number must be exactly 10 digits.");
  }

  if (data.emailid && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.emailid).trim())) {
    errors.push("Please enter a valid email address.");
  }

  ["school", "residence", "outdoor", "utilities"].forEach((key) => {
    (constructionRows[key] || []).forEach((row, i) => {
      if (row.budget !== "" && row.budget != null && !isValidNumericString(row.budget)) {
        errors.push(`Construction (${key}) row ${i + 1}: Budget must be a valid number.`);
      }
      if (row.progress !== "" && row.progress != null && !isValidNumericString(row.progress)) {
        errors.push(`Construction (${key}) row ${i + 1}: Progress must be a valid number.`);
      }
    });
  });

  (operationalCostRows || []).forEach((row, i) => {
    if (row.amount !== "" && row.amount != null && !isValidNumericString(row.amount)) {
      errors.push(`Operational cost row ${i + 1}: Amount must be a valid number.`);
    }
  });

  (enrollmentRows || []).forEach((row, i) => {
    ["sanctionedCapacity", "currentEnrollment", "appeared", "passed", "above75", "below50", "distinctions", "topScore"].forEach((field) => {
      if (row[field] !== "" && row[field] != null && !isValidNumericString(row[field])) {
        errors.push(`Enrollment row ${i + 1}: ${field} must be a valid number.`);
      }
    });
  });

  [...(teachingRows || []), ...(nonTeachingRows || [])].forEach((row, i) => {
    ["total", "filled", "vacant"].forEach((field) => {
      if (row[field] !== "" && row[field] != null && !isValidNumericString(row[field])) {
        errors.push(`Staff row ${i + 1}: ${field} must be a valid number.`);
      }
    });
  });

  (hospitalizationRows || []).forEach((row, i) => {
    ["estimatedCost", "amountClaimed"].forEach((field) => {
      if (row[field] !== "" && row[field] != null && !isValidNumericString(row[field])) {
        errors.push(`Hospitalization row ${i + 1}: ${field} must be a valid number.`);
      }
    });
  });

  return errors;
};
