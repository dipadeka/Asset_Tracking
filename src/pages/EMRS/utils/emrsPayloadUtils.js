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

const hasValue = (value) =>
  value !== "" && value !== null && value !== undefined && String(value).trim() !== "";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
const isValidPhone = (value) => /^[0-9]{10}$/.test(String(value).trim());

const addRequired = (errors, value, label) => {
  if (!hasValue(value)) errors.push(`${label} is required.`);
};

const addNumber = (errors, value, label, { min, max, integer = false } = {}) => {
  if (!hasValue(value)) return;
  if (!isValidNumericString(value)) {
    errors.push(`${label} must be a valid number.`);
    return;
  }
  const n = Number(value);
  if (integer && !Number.isInteger(n)) errors.push(`${label} must be a whole number.`);
  if (min !== undefined && n < min) errors.push(`${label} cannot be less than ${min}.`);
  if (max !== undefined && n > max) errors.push(`${label} cannot be more than ${max}.`);
};

const addDateOrder = (errors, startDate, endDate, label) => {
  if (!hasValue(startDate) || !hasValue(endDate)) return;
  if (new Date(endDate) < new Date(startDate)) {
    errors.push(`${label}: end date cannot be before start date.`);
  }
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
  data = {},
  constructionRows = {},
  operationalCostRows = [],
  enrollmentRows = [],
  extraCurricularRows = [],
  teachingRows = [],
  nonTeachingRows = [],
  hospitalizationRows = [],
  messData,
  selectedClass,
  selectedSection,
  selectedMonth,
  monthlyAttendance = [],
  teachRows = [],
  ntRows = [],
  financialData,
  procurements = [],
  currentStep,
}) => {
  const errors = [];
  const shouldValidate = (step) => currentStep === undefined || currentStep === step;

  if (shouldValidate(0)) {
    [
      ["EMRScode", "EMRS Code"],
      ["udaisecode", "UDISE Code"],
      ["schoolname", "School Name"],
      ["schooltype", "School Type"],
      ["Affiliation", "Affiliation"],
      ["principalAvailable", "Principal Availability"],
      ["contactno", "Contact Number"],
      ["emailid", "Email ID"],
      ["pincode", "Pincode"],
      ["state", "State"],
      ["district", "District"],
      ["block", "Block"],
      ["gramPanchayat", "Gram Panchayat"],
      ["village", "Village"],
    ].forEach(([field, label]) => addRequired(errors, data[field], label));

    if (data.principalAvailable === "Yes") addRequired(errors, data.NameofthePrincipal, "Principal Name");
    if (data.pincode && !/^\d{6}$/.test(String(data.pincode).trim())) {
      errors.push("Pincode must be exactly 6 digits.");
    }
  }

  if (data.udaisecode && !/^\d+$/.test(String(data.udaisecode).trim())) {
    errors.push("UDISE Code must contain digits only.");
  }
  if (data.contactno && !isValidPhone(data.contactno)) {
    errors.push("Contact number must be exactly 10 digits.");
  }
  if (data.emailid && !isValidEmail(data.emailid)) {
    errors.push("Please enter a valid email address.");
  }

  if (shouldValidate(1)) {
    [
      ["totalClassrooms", "Total Classrooms"],
      ["classroomWithSmartClass", "Classroom with Smart Class"],
      ["classroomWithProjector", "Classroom with Projector"],
      ["scienceLab", "Science Lab Available"],
      ["computerLab", "Computer Lab"],
      ["library", "Library Available"],
      ["playground", "Playground Available"],
      ["Auditorium", "Auditorium"],
      ["Medical Room", "Medical Room"],
      ["totalFireExtinguishers", "Total Fire Extinguishers Installed"],
      ["functionalFireExtinguishers", "Functional Fire Extinguishers"],
      ["electricalSafetyInspection", "Electrical Safety Inspection"],
      ["fireSafetyDrill", "Fire Safety Drill"],
      ["physicsLabFunctional", "Physics Lab Functional"],
      ["chemistryLabFunctional", "Chemistry Lab Functional"],
      ["biologyLabFunctional", "Biology Lab Functional"],
      ["computerLabFunctional", "Computer Lab Functional"],
      ["mathLabFunctional", "Mathematics Lab Functional"],
      ["skillLabFunctional", "Skill Lab Functional"],
    ].forEach(([field, label]) => addRequired(errors, data[field], label));

    if (data.scienceLab === "Yes") {
      [
        ["biologyLab", "Biology Lab"],
        ["chemistryLab", "Chemistry Lab"],
        ["physicsLab", "Physics Lab"],
      ].forEach(([field, label]) => addRequired(errors, data[field], label));
    }
    if (data.computerLab === "Yes") addRequired(errors, data.internetComputerLab, "Internet in Computer Lab");
    if (data.library === "Yes") addRequired(errors, data.booksInLibrary, "No. of Books in Library");
    if (data.playground === "Yes") addRequired(errors, data.playgroundArea, "Playground Area");
    if (data.Auditorium === "Yes") addRequired(errors, data.auditoriumCapacity, "Auditorium Capacity");

    [
      ["totalClassrooms", "Total Classrooms"],
      ["classroomWithSmartClass", "Classroom with Smart Class"],
      ["classroomWithProjector", "Classroom with Projector"],
      ["booksInLibrary", "No. of Books in Library"],
      ["playgroundArea", "Playground Area"],
      ["auditoriumCapacity", "Auditorium Capacity"],
      ["totalFireExtinguishers", "Total Fire Extinguishers Installed"],
      ["functionalFireExtinguishers", "Functional Fire Extinguishers"],
    ].forEach(([field, label]) => addNumber(errors, data[field], label, { min: 0, integer: true }));

    if (Number(data.classroomWithSmartClass || 0) > Number(data.totalClassrooms || 0)) {
      errors.push("Classroom with Smart Class cannot exceed Total Classrooms.");
    }
    if (Number(data.classroomWithProjector || 0) > Number(data.totalClassrooms || 0)) {
      errors.push("Classroom with Projector cannot exceed Total Classrooms.");
    }
    if (Number(data.functionalFireExtinguishers || 0) > Number(data.totalFireExtinguishers || 0)) {
      errors.push("Functional Fire Extinguishers cannot exceed Total Fire Extinguishers Installed.");
    }
  }

  if (shouldValidate(2)) {
    addRequired(errors, data.projectStartDate, "Project Start Date");
    addRequired(errors, data.projectEndDate, "Expected End Date");
    addRequired(errors, data.totalProjectBudget, "Total Project Budget");
    addDateOrder(errors, data.projectStartDate, data.projectEndDate, "Project Overview");
    addNumber(errors, data.totalProjectBudget, "Total Project Budget", { min: 0 });

    ["school", "residence", "outdoor", "utilities"].forEach((key) => {
      (constructionRows[key] || []).forEach((row, i) => {
        const rowLabel = `Construction (${key}) row ${i + 1}`;
        addRequired(errors, row.units, `${rowLabel}: Units`);
        addRequired(errors, row.status, `${rowLabel}: Status`);
        addNumber(errors, row.progress, `${rowLabel}: Progress`, { min: 0, max: 100 });
        addNumber(errors, row.budget, `${rowLabel}: Budget`, { min: 0 });
        addDateOrder(errors, row.startDate, row.endDate, rowLabel);
      });
    });
  }

  if (shouldValidate(3)) {
    [
      ["boysHostelCapacity", "Boys Hostel Capacity"],
      ["boysBedsAvailable", "Boys Beds Available"],
      ["boysCurrentOccupancy", "Boys Current Occupancy"],
      ["boysCCTVInstalled", "Boys CCTV Installed"],
      ["boysNoOfCCTV", "Boys No. of CCTV"],
      ["boysSecurityAgency", "Boys Security Agency"],
      ["boysWardenName", "Boys Warden Name"],
      ["boysWardenContact", "Boys Warden Contact"],
      ["boysWardenEmail", "Boys Warden Email"],
      ["girlsHostelCapacity", "Girls Hostel Capacity"],
      ["girlsBedsAvailable", "Girls Beds Available"],
      ["girlsCurrentOccupancy", "Girls Current Occupancy"],
      ["girlsCCTVInstalled", "Girls CCTV Installed"],
      ["girlsNoOfCCTV", "Girls No. of CCTV"],
      ["girlsSecurityAgency", "Girls Security Agency"],
      ["girlsWardenName", "Girls Warden Name"],
      ["girlsWardenContact", "Girls Warden Contact"],
      ["girlsWardenEmail", "Girls Warden Email"],
    ].forEach(([field, label]) => addRequired(errors, data[field], label));

    if (data.boysSecurityAgency === "Yes") {
      addRequired(errors, data.boysSecurityAgencyName, "Boys Security Agency Name");
      addRequired(errors, data.boysSecurityAgencyContact, "Boys Security Agency Contact");
    }
    if (data.girlsSecurityAgency === "Yes") {
      addRequired(errors, data.girlsSecurityAgencyName, "Girls Security Agency Name");
      addRequired(errors, data.girlsSecurityAgencyContact, "Girls Security Agency Contact");
    }

    [
      ["boysHostelCapacity", "Boys Hostel Capacity"],
      ["boysBedsAvailable", "Boys Beds Available"],
      ["boysCurrentOccupancy", "Boys Current Occupancy"],
      ["boysNoOfCCTV", "Boys No. of CCTV"],
      ["girlsHostelCapacity", "Girls Hostel Capacity"],
      ["girlsBedsAvailable", "Girls Beds Available"],
      ["girlsCurrentOccupancy", "Girls Current Occupancy"],
      ["girlsNoOfCCTV", "Girls No. of CCTV"],
    ].forEach(([field, label]) => addNumber(errors, data[field], label, { min: 0, integer: true }));

    if (data.boysWardenEmail && !isValidEmail(data.boysWardenEmail)) errors.push("Boys Warden Email must be valid.");
    if (data.girlsWardenEmail && !isValidEmail(data.girlsWardenEmail)) errors.push("Girls Warden Email must be valid.");
    if (data.boysWardenContact && !isValidPhone(data.boysWardenContact)) errors.push("Boys Warden Contact must be exactly 10 digits.");
    if (data.girlsWardenContact && !isValidPhone(data.girlsWardenContact)) errors.push("Girls Warden Contact must be exactly 10 digits.");

    if (Number(data.boysBedsAvailable || 0) > Number(data.boysHostelCapacity || 0)) {
      errors.push("Boys Beds Available cannot exceed Boys Hostel Capacity.");
    }
    if (Number(data.boysCurrentOccupancy || 0) > Number(data.boysHostelCapacity || 0)) {
      errors.push("Boys Current Occupancy cannot exceed Boys Hostel Capacity.");
    }
    if (Number(data.girlsBedsAvailable || 0) > Number(data.girlsHostelCapacity || 0)) {
      errors.push("Girls Beds Available cannot exceed Girls Hostel Capacity.");
    }
    if (Number(data.girlsCurrentOccupancy || 0) > Number(data.girlsHostelCapacity || 0)) {
      errors.push("Girls Current Occupancy cannot exceed Girls Hostel Capacity.");
    }

    if (messData) {
      ["weeklyMenuDisplayed", "messInspectionRegister", "foodStockRegister", "foodComplaintRegister", "messCleanlinessDaily"].forEach((field) => {
        addRequired(errors, messData[field], field.replace(/([A-Z])/g, " $1"));
      });
      (messData.items || []).forEach((item, i) => {
        addRequired(errors, item.category, `Mess item ${i + 1}: Category`);
        addRequired(errors, item.name, `Mess item ${i + 1}: Item Name`);
        addRequired(errors, item.quantity, `Mess item ${i + 1}: Quantity`);
        addRequired(errors, item.price, `Mess item ${i + 1}: Price`);
        addNumber(errors, item.quantity, `Mess item ${i + 1}: Quantity`, { min: 0 });
        addNumber(errors, item.price, `Mess item ${i + 1}: Price`, { min: 0 });
      });
    }
  }

  if (shouldValidate(4)) {
    (enrollmentRows || []).forEach((row, i) => {
      const rowLabel = `Enrollment row ${i + 1}`;
      ["academicYear", "class", "section", "sanctionedCapacity", "currentEnrollment"].forEach((field) => {
        addRequired(errors, row[field], `${rowLabel}: ${field}`);
      });
      ["sanctionedCapacity", "currentEnrollment", "appeared", "passed", "above75", "below50", "distinctions", "topScore"].forEach((field) => {
        addNumber(errors, row[field], `${rowLabel}: ${field}`, { min: 0 });
      });
      if (Number(row.currentEnrollment || 0) > Number(row.sanctionedCapacity || 0)) {
        errors.push(`${rowLabel}: Current Enrollment cannot exceed Sanctioned Capacity.`);
      }
      if (Number(row.passed || 0) > Number(row.appeared || 0)) {
        errors.push(`${rowLabel}: Students Passed cannot exceed Students Appeared.`);
      }
    });
  }

  if (shouldValidate(5)) {
    (extraCurricularRows || []).forEach((row, i) => {
      const rowLabel = `Extra Curricular row ${i + 1}`;
      ["academicYear", "class", "section", "initiativeName", "areasOfDevelopment", "description", "status"].forEach((field) => {
        addRequired(errors, row[field], `${rowLabel}: ${field}`);
      });
      if (row.areasOfDevelopment === "Others") addRequired(errors, row.otherAreaOfDevelopment, `${rowLabel}: Specify Other`);
    });
  }

  if (shouldValidate(6)) {
    (hospitalizationRows || []).forEach((row, i) => {
      const rowLabel = `Hospitalization row ${i + 1}`;
      [
        "Annual Health Check Conducted",
        "Part-Time Doctor Engaged",
        "Medical Register Maintained",
        "Sickle Cell Screening Conducted",
        "ABHA ID Created",
        "Eye Checkup Conducted",
        "Ear Checkup Conducted",
      ].forEach((field) => addRequired(errors, row[field], `${rowLabel}: ${field}`));

      const hasHospitalization = ["studentName", "rollNo", "class", "section", "admissionDate", "dischargeDate", "reasonForHospitalization"].some((field) => hasValue(row[field]));
      if (hasHospitalization) {
        ["studentName", "rollNo", "class", "section", "guardianName", "guardianContact", "admissionDate", "dischargeDate", "reasonForHospitalization", "claimStatus"].forEach((field) => {
          addRequired(errors, row[field], `${rowLabel}: ${field}`);
        });
      }
      if (row.guardianContact && !isValidPhone(row.guardianContact)) errors.push(`${rowLabel}: Guardian Contact must be exactly 10 digits.`);
      addDateOrder(errors, row.admissionDate, row.dischargeDate, rowLabel);
      ["estimatedCost", "amountClaimed"].forEach((field) => addNumber(errors, row[field], `${rowLabel}: ${field}`, { min: 0 }));
    });
  }

  if (shouldValidate(7)) {
    const validateStaffRows = (rows = [], label) => {
      rows.forEach((row, i) => {
        const rowLabel = `${label} row ${i + 1}`;
        const name = row.name || row.staffName;
        const contact = row.contact || row.contactNumber;
        [
          [row.post, "Post"],
          [name, "Name"],
          [row.dob, "Date of Birth"],
          [row.doj, "Date of Joining"],
          [row.email, "Email"],
          [contact, "Contact"],
          [row.total, "Total"],
          [row.filled, "Filled"],
        ].forEach(([value, field]) => addRequired(errors, value, `${rowLabel}: ${field}`));
        if (row.email && !isValidEmail(row.email)) errors.push(`${rowLabel}: Email must be valid.`);
        if (contact && !isValidPhone(contact)) errors.push(`${rowLabel}: Contact must be exactly 10 digits.`);
        addNumber(errors, row.total, `${rowLabel}: Total`, { min: 0, integer: true });
        addNumber(errors, row.filled, `${rowLabel}: Filled`, { min: 0, integer: true });
        if (Number(row.filled || 0) > Number(row.total || 0)) errors.push(`${rowLabel}: Filled cannot exceed Total.`);
      });
    };
    validateStaffRows(teachingRows, "Teaching staff");
    validateStaffRows(nonTeachingRows, "Non-teaching staff");
  }

  if (shouldValidate(8)) {
    addRequired(errors, selectedClass, "Attendance Class");
    addRequired(errors, selectedSection, "Attendance Section");
    addRequired(errors, selectedMonth, "Attendance Month");
    (monthlyAttendance || []).forEach((row, i) => {
      const rowLabel = `Student attendance row ${i + 1}`;
      ["month", "workingDays", "totalStudents", "totalPresent"].forEach((field) => addRequired(errors, row[field], `${rowLabel}: ${field}`));
      addNumber(errors, row.workingDays, `${rowLabel}: Working Days`, { min: 0, max: 31, integer: true });
      addNumber(errors, row.totalStudents, `${rowLabel}: Total Students`, { min: 0, integer: true });
      addNumber(errors, row.totalPresent, `${rowLabel}: Days Present`, { min: 0, integer: true });
      if (Number(row.totalPresent || 0) > Number(row.totalStudents || 0) * Number(row.workingDays || 0)) {
        errors.push(`${rowLabel}: Days Present cannot exceed Total Students x Working Days.`);
      }
    });
    [...(teachRows || []), ...(ntRows || [])].forEach((row, i) => {
      const rowLabel = `Staff attendance row ${i + 1}`;
      addRequired(errors, row.post, `${rowLabel}: Post`);
      addRequired(errors, row.name, `${rowLabel}: Name`);
      ["cl", "el", "ml", "mat"].forEach((field) => addNumber(errors, row[field], `${rowLabel}: ${field}`, { min: 0, max: 31 }));
    });
  }

  if (shouldValidate(9)) {
    (operationalCostRows || []).forEach((row, i) => {
      const rowLabel = `Operational cost row ${i + 1}`;
      ["year", "month", "costType", "amount"].forEach((field) => addRequired(errors, row[field], `${rowLabel}: ${field}`));
      addNumber(errors, row.amount, `${rowLabel}: Amount`, { min: 0 });
    });
  }

  if (shouldValidate(10)) {
    if (financialData) {
      addRequired(errors, financialData.totalFundsAllocated, "Total Funds Allocated");
      addRequired(errors, financialData.totalFundsUtilized, "Total Funds Utilized");
      addNumber(errors, financialData.totalFundsAllocated, "Total Funds Allocated", { min: 0 });
      addNumber(errors, financialData.totalFundsUtilized, "Total Funds Utilized", { min: 0 });
      if (Number(financialData.totalFundsUtilized || 0) > Number(financialData.totalFundsAllocated || 0)) {
        errors.push("Total Funds Utilized cannot exceed Total Funds Allocated.");
      }
    }
    (procurements || []).forEach((row, i) => {
      const rowLabel = `Procurement row ${i + 1}`;
      ["type", "description", "totalNumber", "orderDate", "value", "vendor", "throughGem"].forEach((field) => addRequired(errors, row[field], `${rowLabel}: ${field}`));
      addNumber(errors, row.totalNumber, `${rowLabel}: Total Number`, { min: 0, integer: true });
      addNumber(errors, row.value, `${rowLabel}: Value`, { min: 0 });
      addNumber(errors, row.throughGem, `${rowLabel}: Through GeM`, { min: 0, integer: true });
      if (Number(row.throughGem || 0) > Number(row.totalNumber || 0)) {
        errors.push(`${rowLabel}: Through GeM cannot exceed Total Number.`);
      }
    });
  }

  return errors;
};
