export const emrsBasicFields = [
    { name: "EMRScode", label: "EMRS Code" },
    { name: "udaisecode", label: "UDISE Code", type: "number" },
    { name: "schoolname", label: "School Name" },
    {
      name: "schooltype",
      label: "School Type",
      type: "select",
      options: ["Girls", "Boys", "Co-Ed"],
    },
    {
      name: "Affiliation",
      label: "Affiliation",
      type: "select",
      options: ["SEBA", "CBSE", "ICSC"],
    },
    {
      name: "principalAvailable",
      label: "Principal Available",
      options: ["Yes", "No"],
    },
    { name: "NameofthePrincipal", label: "Principal Name" },
    { name: "contactno", label: "Contact Number", type: "number" },
    { name: "emailid", label: "Email-id" },
  ];
  // ================= EMRS LOCATION =================
  export const emrsLocationFields = [
    { name: "district", label: "District" },
    { name: "block", label: "Block" },
    { name: "grampanchayat", label: "Gram Panchayat" },
    { name: "village", label: "Village" },
  ];
// ================= INFRASTRUCTURE =================
export const emrsInfrastructureFields = [
  { name: "totalClassrooms", label: "Total Classrooms", type: "number" },
  { name: "classroomWithSmartClass", label: "Classroom with Smart Class", type: "number" },
  { name: "classroomWithProjector", label: "Classroom with Projector", type: "number" },
  { name: "scienceLab", label: "Science Lab", options: ["Yes", "No"] },
  { name: "biologyLab", label: "Biology Lab", options: ["Yes", "No"] },
  { name: "chemistryLab", label: "Chemistry Lab", options: ["Yes", "No"] },
  { name: "physicsLab", label: "Physics Lab", options: ["Yes", "No"] },
  { name: "computerLab", label: "Computer Lab", options: ["Yes", "No"] },
  { name: "internetComputerLab", label: "Internet in Computer Lab", options: ["Yes", "No"] },
  { name: "library", label: "Library", options: ["Yes", "No"] },
  { name: "booksInLibrary", label: "No. of Books in Library", type: "number" },
  { name: "playground", label: "Playground", options: ["Yes", "No"] },
  { name: "playgroundArea", label: "Playground Area (sq. ft)", type: "number" },
  { name: "Auditorium", label: "Auditorium", options: ["Yes", "No"] },
  { name: "auditoriumCapacity", label: "Auditorium Capacity", type: "number" },
  { name: "Medical Room", label: "Medical Room", options: ["Yes", "No"] },
  { name: "totalFireExtinguishers", label: "Total Fire Extinguishers Installed", type: "number" },
  { name: "functionalFireExtinguishers", label: "Functional Fire Extinguishers", type: "number" },
  { name: "electricalSafetyInspection", label: "Electrical Safety Inspection Conducted", options: ["Yes", "No"] },
  { name: "fireSafetyDrill", label: "Fire Safety Drill Conducted", options: ["Yes", "No"] },
];

// ================= CONSTRUCTION CONFIG =================
export const CONSTRUCTION_CONFIG = {
  school:    { label: "School Block",    icon: "🏫", color: "#1976d2", light: "#e3f2fd" },
  residence: { label: "Residence Block", icon: "🏠", color: "#7b1fa2", light: "#f3e5f5" },
  outdoor:   { label: "Outdoor Block",   icon: "🌳", color: "#2e7d32", light: "#e8f5e9" },
  utilities: { label: "Utilities Block", icon: "⚡", color: "#e65100", light: "#fff3e0" },
};

export const CONSTRUCTION_STATUS_STYLE = {
  Completed:    { color: "#16a34a", bg: "#dcfce7" },
  "In Progress":{ color: "#d97706", bg: "#fef3c7" },
  "Not Started":{ color: "#6b7280", bg: "#f3f4f6" },
  "On Hold":    { color: "#7c3aed", bg: "#ede9fe" },
  Cancelled:    { color: "#dc2626", bg: "#fee2e2" },
};

  // ================= HOSTEL ADMINISTRATION DETAILS =================
  // ================= BOYS HOSTEL =================

 export const boysHostelFields = [
    {
      name: "boysHostelCapacity",
      label: "Boys Hostel Capacity",
      type: "number",
    },

    { name: "boysBedsAvailable", label: "Beds Available", type: "number" },

    {
      name: "boysCurrentOccupancy",
      label: "Current Occupancy",
      type: "number",
    },

    {
      name: "boysCCTVInstalled",
      label: "CCTV Camera Installed",
      options: ["Yes", "No"],
    },

    {
      name: "boysNoOfCCTV",
      label: "No of CCTV Camera Installed",
      type: "number",
    },

    {
      name: "boysSecurityAgency",
      label: "Security Agency Available",
      options: ["Yes", "No"],
    },

    { name: "boysWardenName", label: "Boys Warden Name" },

    { name: "boysWardenEmail", label: "Boys Warden Email" },

    { name: "boysWardenContact", label: "Boys Warden Contact", type: "number" },
  ];

  // ================= GIRLS HOSTEL =================

  export const girlsHostelFields = [
    {
      name: "girlsHostelCapacity",
      label: "Girls Hostel Capacity",
      type: "number",
    },

    { name: "girlsBedsAvailable", label: "Beds Available", type: "number" },

    {
      name: "girlsCurrentOccupancy",
      label: "Current Occupancy",
      type: "number",
    },

    {
      name: "girlsCCTVInstalled",
      label: "CCTV Camera Installed",
      options: ["Yes", "No"],
    },

    {
      name: "girlsNoOfCCTV",
      label: "No of CCTV Camera Installed",
      type: "number",
    },

    {
      name: "girlsSecurityAgency",
      label: "Security Agency Available",
      options: ["Yes", "No"],
    },

    { name: "girlsWardenName", label: "Girls Warden Name" },

    { name: "girlsWardenEmail", label: "Girls Warden Email" },

    {
      name: "girlsWardenContact",
      label: "Girls Warden Contact",
      type: "number",
    },
  ];
  export const messComplianceFields = [
  { name: "weeklyMenuDisplayed", label: "Weekly Menu Register" },
  { name: "messInspectionRegister", label: "Inspection Register" },
  { name: "foodStockRegister", label: "Stock Register" },
  { name: "foodComplaintRegister", label: "Complaint Register" },
  { name: "messCleanlinessDaily", label: "Cleanliness Register" },
];
// ================= ENROLLMENT SUMMARY =================
  export const enrollmentFields = [
    {
      name: "academicYear",
      label: "Academic Year",
      options: [
        "2024-2025",
        "2025-2026",
        "2026-2027",
        "2027-2028",
        "2028-2029",
        "2029-2030",
      ],
    },

    {
      name: "class",
      label: "Class",
      options: ["6", "7", "8", "9", "10", "11", "12"],
    },

    {
      name: "section",
      label: "Section",
      options: ["A", "B", "C"],
    },

    {
      name: "sanctionedCapacity",
      label: "Sanctioned Capacity",
      type: "number",
    },

    {
      name: "currentEnrollment",
      label: "Current Enrollment",
      type: "number",
    },
    {
      name: "category",
      label: "Category",
      options: [
        "ST", // Cat I  — 80%
        "PVTG", // Cat II — 5%
        "DNT/NT/SNT", // Cat III — 5%
        "LWE/Covid/Insurgency", // Cat IV a) — 7% shared
        "Children of Widows", // Cat IV b) — 7% shared
        "Divyang/Orphan", // Cat IV c) — 7% shared
        "Land Donor", // Cat V  — 3%
      ],
    },
  ];

  // ================= ACADEMIC RESULT =================
  export const academicFields = [
    { name: "year", label: "Academic Year" },
    { name: "appeared", label: "Students Appeared", type: "number" },
    { name: "passed", label: "Students Passed", type: "number" },

    {
      name: "passPercent",
      label: "Pass %",
      type: "number",
      readOnly: true,
    },
  ];
  export const achievementLevels = [
    "School Level",
    "District Level",
    "State Level",
    "National Level",

    // Olympiads
    "Mathematics Olympiad",
    "Physics Olympiad",
    "Chemistry Olympiad",
    "Biology Olympiad",
    "Astronomy Olympiad",
    "Junior Science Olympiad",

    // Board Exams
    "Board Topper",
    "Board Merit List",

    // National Entrance Exams
    "JEE Mains",
    "JEE Advanced",
    "NEET",
    "CUET",
    "NDA",
    "CLAT",

    // Other Competitive Exams
    "NTSE",
    "KVPY",
    "INSPIRE Scholarship",
    "National Talent Exam",

    // Sports / Cultural
    "National Sports Championship",
    "State Sports Championship",
    "National Cultural Competition",
  ];

  // ================= TEACHING STAFF =================
  export const teachingStaffSummaryFields = [
    {
      name: "total",
      label: "Total Teaching Staff",
      type: "number",
    },
    {
      name: "filled",
      label: "Filled",
      type: "number",
    },
    {
      name: "vacant",
      label: "Vacant",
      type: "number",
      readOnly: true,
    },
    {
      name: "post",
      label: "Post",
      type: "select",
      options: [
        "Principal",
        "Vice Principal",
        "PGT",
        "TGT",
        "Music Teacher",
        "Art Teacher",
        "Physical Education Teacher",
      ],
    },

    { name: "name", label: "Name" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "doj", label: "Date of Joining", type: "date" },
    { name: "email", label: "Email" },
    { name: "contact", label: "Contact Number" },
  ];
  // ================= NON TEACHING STAFF DETAILS =================
 export const nonTeachingStaffDetailFields = [
    {
      name: "post",
      label: "Post",
      type: "select",
      options: [
        "Accountant",
        "UDC/LDC",
        "Lab Assistant",
        "Librarian",
        "Councellor",
        "Cook",
        "Security Guard",
        "Sweeper",
        "Driver",
        "Helper",
        "Chowkidar",
        "Staff Nurse",
        "Hostel Warden",
      ],
    },

    { name: "name", label: "Name" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "doj", label: "Date of Joining", type: "date" },
    { name: "email", label: "Email" },
    { name: "contact", label: "Contact Number" },

    {
      name: "total",
      label: "Total Non-Teaching Staff",
      type: "number",
    },
    {
      name: "filled",
      label: "Filled",
      type: "number",
    },
    {
      name: "vacant",
      label: "Vacant",
      type: "number",
      readOnly: true,
    },
  ];

  // ================= OPERATIONAL COST =================
  export const operationalCostFields = [
    {
      name: "Year",
      label: "Year",
      options: ["2024-2025", "2025-2026", "2026-2027"],
    },
    {
      name: "month",
      label: "Month",
      options: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    {
      name: "operationalcost",
      label: "Operational Cost",
      options: [
        "Electricity",
        "Water",
        "Internet",
        "Security Agency",
        "Event Organized",
        "Maintenance",
        "Establishment",
        "Salary - Contractual Teaching Staff",
        "Salary - Contractual Non-Teaching Staff",
        "Miscellaneous",
        "Others",
      ],
    },
    { name: "amount", label: "Amount", type: "number" },
  ];
 export const qualificationOptions = [
    "10th",
    "12th",
    "B.A",
    "B.Sc",
    "B.Com",
    "B.Ed",
    "M.A",
    "M.Sc",
    "M.Com",
    "M.Ed",
    "BCA",
    "MCA",
    "B.Tech",
    "M.Tech",
    "MBA",
    "Ph.D",
    "Diploma",
    "Other",
  ];

 export const tetQualificationOptions = [
    "CTET Paper I",
    "CTET Paper II",
    "STET Paper I",
    "STET Paper II",
    "Other",
  ];

  export const professionalQualificationOptions = [
    "B.Ed",
    "D.El.Ed",
    "NTT",
    "BTC",
    "JBT",
    "M.Ed",
    "B.P.Ed",
    "M.P.Ed",
    "Other",
  ];
