import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import * as exifr from "exifr";
import { useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
  Chip,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm, Controller } from "react-hook-form";
import { GirlSharp } from "@mui/icons-material";
const thStyle = {
  border: "1px solid #e0e0e0",
  padding: "8px",
  textAlign: "left",
  fontWeight: 600,
};
const tdStyle = { border: "1px solid #e0e0e0", padding: "8px" };
const EMRSForm = ({ addSubmittedForm }) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (file) => {
    if (!file) return;
    setUploadedImage(file);
    setValue("emrsImage", file);
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [safetyCompliance, setSafetyCompliance] = useState({
    totalFireExtinguishers: "",
    functionalFireExtinguishers: "",
    electricalSafetyInspection: "No", // (Yes/No)
    fireSafetyDrillConducted: "No", // (Yes/No)
  });
  const handleFundsChange = (field, value) => {
    setFinancialData((prev) => {
      const updated = { ...prev, [field]: value };

      const allocated = parseFloat(
        field === "totalFundsAllocated" ? value : prev.totalFundsAllocated,
      );
      const utilized = parseFloat(
        field === "totalFundsUtilized" ? value : prev.totalFundsUtilized,
      );

      if (
        !isNaN(allocated) &&
        allocated > 0 &&
        !isNaN(utilized) &&
        utilized >= 0
      ) {
        const pct = (utilized / allocated) * 100;
        updated.utilizationPercentage = parseFloat(pct.toFixed(2));

        if (pct >= 95) updated.fundUtilMarksObtained = 5;
        else if (pct >= 70) updated.fundUtilMarksObtained = 3;
        else if (pct >= 50) updated.fundUtilMarksObtained = 1;
        else updated.fundUtilMarksObtained = 0;
      } else {
        updated.utilizationPercentage = "";
        updated.fundUtilMarksObtained = 0;
      }

      return updated;
    });
  };

  const STEPS = [
    { label: "School Details", icon: "🏫" },
    { label: "Infrastructure", icon: "🔬" },
    { label: "Construction", icon: "🏗️" },
    { label: "Hostel", icon: "🏠" },
    { label: "Enrollment", icon: "🎓" },
    { label: "Extra Curricular", icon: "🎭" },
    { label: "Hospitalization", icon: "🏥" },
    { label: "Staff Details", icon: "👨‍🏫" },
    { label: "Attendence", icon: "📅" },
    { label: "Operational Cost", icon: "💰" },
    { label: "Financial & Procurement Compliance", icon: "📊" },
    { label: "EMRS Image Upload", icon: "📸" },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlyAttendance, setMonthlyAttendance] = useState([
    { month: "", workingDays: "", totalStudents: "", present: "" },
  ]);
  const [attendance, setAttendance] = useState({
    workingDays: "",
    casual: "",
    earned: "",
    medical: "",
    maternity: "",
    paternity: "",
    holidays: "",
    present: 0,
    absent: 0,
  });
  const [reservationRows, setReservationRows] = useState([
    {
      name: "",
      class: "",
      section: "",
      category: "",
    },
  ]);
  const { control, handleSubmit, setValue, watch, register } = useForm({});
  const labValues = watch([
    "physicsLabFunctional",
    "chemistryLabFunctional",
    "biologyLabFunctional",
    "computerLabFunctional",
    "mathLabFunctional",
    "skillLabFunctional",
  ]);
  useEffect(() => {
    const yesCount = labValues.filter((val) => val === "Yes").length;

    let marks = 0;

    if (yesCount === 6) {
      marks = 5;
    } else if (yesCount >= 3) {
      marks = 3;
    } else if (yesCount >= 1) {
      marks = 1;
    } else {
      marks = 0;
    }

    setValue("marksLabFunctional", marks);
  }, [labValues, setValue]);
  // ================= DROPOUT / MIGRATION / ACHIEVEMENT STATES =================
  const [enrollmentRows, setEnrollmentRows] = useState([
    {
      academicYear: "",
      class: "",
      section: "",
      sanctionedCapacity: "",
      currentEnrollment: "",
      categoryBreakdown: {
        ST: "",
        PVTG: "",
        "DNT/NT/SNT": "",
        Orphan: "",
        Divyang: "",
      },
      // Academic Performance
      boardClass: "",
      appeared: "",
      passed: "",
      passPercent: "",
      marks: "",
      stream: "",
      distinctions: "",
      topScorer: "",
      topScore: "",
      monthlyAttendance: [],
      // Dropouts
      dropouts: [
        {
          studentName: "",
          rollNo: "",
          reason: "",
          guardianName: "",
          guardianContactNo: "",
          pinCode: "",
          district: "",
          postOffice: "",
          gramPanchayat: "",
          village: "",
        },
      ],
      // Migrations
      migrations: [
        { studentName: "", migratedFrom: "", transferredTo: "", reason: "" },
      ],
      // Achievements
      achievements: [
        { studentName: "", eventName: "", level: "", recognition: "" },
      ],
    },
  ]);

  const [extraCurricularRows, setExtraCurricularRows] = useState([
    {
      academicYear: "",
      initiativeName: "",
      collaboratingPartner: "",
      areasOfDevelopment: [],
      description: "",
      targetStudents: "",
      status: "",
    },
  ]);
  // Common function to calculate marks based on two Yes/No conditions
  const calculateCommonMarks = (condition1, condition2) => {
    if (condition1 === "Yes" && condition2 === "Yes") {
      return 5; // Both YES
    } else if (condition1 === "Yes" || condition2 === "Yes") {
      return 3; // One YES
    } else if (condition1 === "No" && condition2 === "No") {
      return 0; // Both NO
    }
    return 0; // Default or if conditions are not yet selected
  };

  const blankEyeEntry = () => ({
    eyeSpecialistName: "",
    eyeCheckupDate: "",
    eyeClass: "",
    eyeSection: "",
    eyeStudentsScreened: "",
    eyeStudentsWithProblem: "",
    eyeNeedsSpectacle: "",
    eyeNeedsHigherInvestigation: "",
  });

  const blankEarEntry = () => ({
    earSpecialistName: "",
    earCheckupDate: "",
    earClass: "",
    earSection: "",
    earStudentsScreened: "",
    earStudentsWithProblem: "",
    earNeedsEquipment: "",
  });
  const blankNurseEntry = () => ({
    nurseName: "",
    nurseQualification: "",
    nurseRegNo: "",
    nurseContact: "",
    nurseShift: "",
    nurseJoiningDate: "",
  });

  const blankVisitLog = () => ({
    visitDate: "",
    actualVisitTime: "",
    visitStatus: "",
    remarks: "",
  });
  const addEyeRow = (index) => {
    const u = [...hospitalizationRows];
    u[index].eyeEntries = [...(u[index].eyeEntries || []), blankEyeEntry()];
    setHospitalizationRows(u);
  };

  const addEarRow = (index) => {
    const u = [...hospitalizationRows];
    u[index].earEntries = [...(u[index].earEntries || []), blankEarEntry()];
    setHospitalizationRows(u);
  };
  const [eyeDateErrors, setEyeDateErrors] = useState({}); // key: `${rowIndex}-${entryIndex}`
  const [earDateErrors, setEarDateErrors] = useState({}); // key: `${rowIndex}-${entryIndex}`
  const emptyHospitalizationRow = () => ({
    // Hospital
    hospitalEmpanelled: "",
    privateHospital: "",
    empanellementValidity: "",
    empanelmentDepartment: "",
    doctorName: "",
    treatmentDetails: "",
    // Student
    studentName: "",
    rollNo: "",
    class: "",
    section: "",
    guardianName: "",
    guardianContact: "",
    // Admission
    admissionDate: "",
    dischargeDate: "",
    reasonForHospitalization: "",
    // Claim
    estimatedCost: "",
    amountClaimed: "",
    claimStatus: "",
    // Health monitoring
    "Annual Health Check Conducted": "",
    "Part-Time Doctor Engaged": "",
    "Medical Register Maintained": "",
    "Sickle Cell Screening Conducted": "",
    "ABHA ID Created": "",
    "Eye Checkup Conducted": "",
    "Ear Checkup Conducted": "",
    marksHealth: undefined,

    eyeCheckupConducted: "",
    eyeEntries: [blankEyeEntry()],

    earCheckupConducted: "",
    earEntries: [blankEarEntry()],

    nurseEntries: [blankNurseEntry()],

    visitingDoctorName: "",
    visitingDoctorSpecialization: "",
    visitingDoctorRegNo: "",
    visitingDoctorContact: "",
    scheduledVisitTime: "",
    doctorVisitLogs: [blankVisitLog()],
    // ── NEW: Psychological Counsellor
    counsellorName: "",
    counsellorQualification: "",
    counsellorRegNo: "",
    counsellorContact: "",
    counsellorAvailableDays: [],
    counsellorSessionType: "",
    counsellorSessionsConducted: "",
    counsellorStudentsCounselled: "",
  });

  const hospitalizationRowExample = {
    "Annual Health Check Conducted": "Yes",
    "Part-Time Doctor Engaged": "No",
    "Medical Register Maintained": "Yes",
    "Sickle Cell Screening Conducted": "No",
    "ABHA ID Created": "Yes",
    "Eye Checkup Conducted": "Yes",
    "Ear Checkup Conducted": "Yes",
    marksHealth: 0,
  };
  const calculateHealthMarks = (rowData) => {
    const conditions = [
      "Annual Health Check Conducted",
      "Part-Time Doctor Engaged",
      "Medical Register Maintained",
      "Sickle Cell Screening Conducted",
      "ABHA ID Created",
      "Eye Checkup Conducted",
      "Ear Checkup Conducted",
    ];
    const yesCount = conditions.filter((c) => rowData[c] === "Yes").length;
    if (yesCount === 7) return 9;
    if (yesCount >= 5) return 7;
    if (yesCount >= 3) return 5;
    if (yesCount >= 1) return 3;
    return 0;
  };
  const validateBiAnnualDate = (newDate, entries, currentIndex, dateField) => {
    if (!newDate || !dayjs(newDate).isValid()) return null;

    const newDayjs = dayjs(newDate);

    for (let i = 0; i < entries.length; i++) {
      if (i === currentIndex) continue;
      const otherDate = entries[i][dateField];
      if (!otherDate) continue;
      const otherDayjs = dayjs(otherDate);
      const diffMonths = Math.abs(newDayjs.diff(otherDayjs, "month", true));
      if (diffMonths < 6 || diffMonths > 6) {
        return `Date must be exactly 6 months apart from entry #${i + 1} (${otherDayjs.format("DD MMM YYYY")}). Current gap: ${diffMonths.toFixed(1)} months.`;
      }
    }
    return null; // valid
  };

  const [hospitalizationRows, setHospitalizationRows] = useState([
    emptyHospitalizationRow,
  ]);
  const [teachingRows, setteachingRows] = useState([
    {
      post: "",
      staffName: "",
      dob: "",
      doj: "",
      email: "",
      contactNumber: "",
      total: "",
      filled: "",
      vacant: "",
      academicQualifications: [
        {
          post: "",
          staffname: " ",
          qualification: "",
          course: "",
          registrationNo: "",
          rollNo: "",
          college: "",
          marksObtained: "",
          university: "",
          passingYear: "",
        },
      ],
      professionalQualifications: [
        {
          post: "",
          staffname: " ",
          qualification: "",
          registrationNo: "",
          rollNo: "",
          examConductedBy: "",
          passingYear: "",
          marksObtained: "",
          affiliationBody: "",
        },
      ],
      tetQualifications: [
        {
          post: "",
          staffname: " ",
          qualification: "",
          registrationNo: "",
          rollNo: "",
          examConductedBy: "",
          passingYear: "",
          marksObtained: "",
          affiliationBody: "",
        },
      ],
      monthlyAttendance: [],
    },
  ]);
  const [recurringBreakup, setRecurringBreakup] = useState([
    {
      sno: "1",
      component: "Staff Salary (53.85%)",
      colA: "",
      colC: "",
      colD: "",
      colE: "",
      remarks: "",
    },
    {
      sno: "2",
      component: "Direct Expenditure on Students (23.78%)",
      colA: "",
      colC: "",
      colD: "",
      colE: "",
      remarks: "",
    },
    {
      sno: "3a",
      component: "Operational Expenditure & Co-Curricular (13.62%)",
      colA: "",
      colC: "",
      colD: "",
      colE: "",
      remarks: "",
    },
    {
      sno: "3b",
      component: "Maintenance & Repair of Buildings (4.75%)",
      colA: "",
      colC: "",
      colD: "",
      colE: "",
      remarks: "",
    },
    {
      sno: "4",
      component: "Administrative Expense of State Society (1.91%)",
      colA: "",
      colC: "",
      colD: "",
      colE: "",
      remarks: "",
    },
    {
      sno: "5",
      component: "Capital Expenditure (2.09%)",
      colA: "",
      colC: "",
      colD: "",
      colE: "",
      remarks: "",
    },
  ]);
  const handleBreakupChange = (index, field, value) => {
    const updated = [...recurringBreakup];
    updated[index] = { ...updated[index], [field]: value };
    setRecurringBreakup(updated);
  };
  const [nonTeachingRows, setnonTeachingRows] = useState([
    {
      post: "",
      name: "",
      dob: "",
      doj: "",
      email: "",
      contact: "",
      total: "",
      filled: "",
      vacant: "",
      academicQualifications: [
        {
          post: "",
          staffname: " ",
          qualification: "",
          course: "",
          registrationNo: "",
          rollNo: "",
          college: "",
          marksObtained: "",
          university: "",
          passingYear: "",
        },
      ],
      professionalQualifications: [
        {
          post: "",
          staffname: " ",
          qualification: "",
          registrationNo: "",
          rollNo: "",
          examConductedBy: "",
          passingYear: "",
          marksObtained: "",
          affiliationBody: "",
        },
      ],
      tetQualifications: [
        {
          post: "",
          staffname: " ",
          qualification: "",
          registrationNo: "",
          rollNo: "",
          examConductedBy: "",
          passingYear: "",
          marksObtained: "",
          affiliationBody: "",
        },
      ],
      monthlyAttendance: [],
    },
  ]);
  const [operationalCostRows, setOperationalCostRows] = useState([
    { year: "", month: "", costType: "", amount: "" },
  ]);
  const [messData, setMessData] = useState({
    year: "2026",
    month: "March",
    purchaseDate: "",
    purchasedFrom: "",
    items: [
      {
        category: "",
        name: "",
        quantity: "",
        unit: "",
        price: "",
        total: 0,
      },
    ],
    weeklyMenuDisplayed: "",
    messInspectionRegister: "",
    foodStockRegister: "",
    foodComplaintRegister: "",
    messCleanlinessDaily: "",
  });
  const [financialData, setFinancialData] = useState({
    academicYear: "",
    totalFundsAllocated: "",
    totalFundsUtilized: "",
    utilizationPercentage: 0,
    fundUtilMarksObtained: 0,
    auditConducted: "",
    totalProcurements: 0,
    procurementsGeM: 0,
    gemProcurementPercentage: 0,
    gemMarksObtained: 0,
  });
  const [procurements, setProcurements] = useState([]);
  const [procurementDialogOpen, setProcurementDialogOpen] = useState(false);
  const [currentProcurement, setCurrentProcurement] = useState({
    type: "",
    description: "",
    totalNumber: "",
    orderDate: "",
    value: "",
    vendor: "",
    throughGem: "",
  });

  // Auto-calculated values
  const totalProcurements = procurements.reduce(
    (sum, p) => sum + Number(p.totalNumber || 0),
    0,
  );
  const totalThroughGem = procurements.reduce(
    (sum, p) => sum + Number(p.throughGem || 0),
    0,
  );
  const gemPercentage =
    totalProcurements > 0
      ? ((totalThroughGem / totalProcurements) * 100).toFixed(2)
      : "0.00";

  const getGemMarks = (pct) => {
    const p = Number(pct);
    if (p >= 100) return 5;
    if (p >= 75) return 4;
    if (p >= 50) return 3;
    if (p >= 25) return 1;
    return 0;
  };
  const gemMarks = getGemMarks(gemPercentage);
  // ================= CONSTRUCTION STATUS STATE =================
  const [constructionRows, setConstructionRows] = useState({
    school: [
      {
        component: "Classrooms",
        units: "6 rooms",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Teachers Staff Room",
        units: "2 rooms",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Student Lab",
        units: "2 labs",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Library",
        units: "1 library",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Science Lab",
        units: "1 lab",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "↳ Biology Lab",
        units: "1 lab",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "↳ Chemistry Lab",
        units: "1 lab",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "↳ Physics Lab",
        units: "1 lab",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Mathematics Lab",
        units: "1 Lab",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Auditorium",
        units: "1 hall",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Infirmary",
        units: "1 room",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
    ],
    residence: [
      {
        component: "Boys Hostel",
        units: "50 beds",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Girls Hostel",
        units: "50 beds",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Water System",
        units: "2 tanks",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Warden Office",
        units: "1 office",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Recreation Area",
        units: "1 area",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Laundry Area",
        units: "1 area",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Kitchen",
        units: "1 kitchen",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Staff Housing",
        units: "10 units",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
    ],
    outdoor: [
      {
        component: "Compound Wall",
        units: "500 m",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Garden",
        units: "2000 sqm",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Worker Toilets",
        units: "4 units",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Parking",
        units: "500 sqm",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
    ],
    utilities: [
      {
        component: "Electrical System",
        units: "1 system",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "↳ Transformer Installed",
        units: "1 unit",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "↳ Digiset Installed",
        units: "1 unit",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Water Tanks",
        units: "2 tanks",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Sewage System",
        units: "1 plant",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Rainwater Harvest",
        units: "1 system",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
      {
        component: "Security Cabin",
        units: "1 cabin",
        status: "Not Started",
        progress: 0,
        startDate: "",
        endDate: "",
        assignedTo: "",
        budget: "",
        remarks: "",
      },
    ],
  });
  const [workingDays, setWorkingDays] = useState(26);
  const [showHolidays, setShowHolidays] = useState(false);
  const [monthYear, setMonthYear] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
  });

  const [teachRows, setTeachRows] = useState([
    { id: 1, post: "", name: "", cl: "", el: "", ml: "", mat: "" },
  ]);
  const [ntRows, setNtRows] = useState([
    { id: 1, post: "", name: "", cl: "", el: "", ml: "", mat: "" },
  ]);
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...messData.items];

    if (["quantity", "price"].includes(field)) {
      value = Math.max(0, value);
    }

    updatedItems[index][field] = value;

    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;

    updatedItems[index].total = qty * price;

    setMessData({ ...messData, items: updatedItems });
  };

  const addItem = () => {
    setMessData({
      ...messData,
      items: [
        ...messData.items,
        { category: "", name: "", quantity: "", price: "", total: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const updated = messData.items.filter((_, i) => i !== index);
    setMessData({ ...messData, items: updated });
  };

  const calculateGrandTotal = () => {
    return messData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };
  const handleAddNonTeachingSummary = () => {
    setNonTeachingSummaryRows([
      ...nonTeachingSummaryRows,
      { post: "", total: "", filled: "", vacant: "" },
    ]);
  };
  const handleGemPercentageChange = (e) => {
    const newPercentage = e.target.value;
    const marks = calculateGemMarks(newPercentage);

    setFinancialData((prev) => ({
      ...prev,
      gemProcurementPercentage: newPercentage,
      gemMarksObtained: marks,
    }));
  };

  const prepareBasicDetails = (data) => ({
    EMRScode: Number(data.EMRScode),
    EMRSid: data.EMRSid?.trim(),
    udaisecode: Number(data.udaisecode),
    schoolname: data.schoolname?.trim(),
    schooltype: data.schooltype?.trim(),
    affiliation: data.affiliation?.trim(),
    principalName: data.principalName?.trim(),
    contactno: data.contactno?.trim(),
    email: data.email?.trim(),
  });

  const prepareLocationDetails = (data) => ({
    state: data.state,
    district: data.district,
    block: data.block,
    grampanchayat: data.grampanchayat,
    village: data.village,
  });
  const prepareInfrastructureDetails = (data) => ({
    totalClassrooms: Number(data.totalClassrooms || 0),

    classroomWithSmartClass: Number(data.classroomWithSmartClass || 0),
    classroomWithProjector: Number(data.classroomWithProjector || 0),

    scienceLab: data.scienceLab || "",
    computerLab: data.computerLab || "",

    library: data.library || "",
    booksInLibrary: Number(data.booksInLibrary || 0),

    playground: data.playground || "",
    auditorium: data.auditorium || "",
    medicalroom: data.medicalroom || "",
  });
  const prepareHostelAdministration = (data) => ({
    boysHostel: {
      capacity: Number(data.boysHostelCapacity || 0),
      bedsAvailable: Number(data.boysBedsAvailable || 0),
      currentOccupancy: Number(data.boysCurrentOccupancy || 0),
      cctvInstalled: data.boysCCTVInstalled,
      noOfCCTV: Number(data.boysNoOfCCTV || 0),
      securityAgency: data.boysSecurityAgency,
      warden: {
        name: data.boysWardenName,
        email: data.boysWardenEmail,
        contact: data.boysWardenContact,
      },
    },
    girlsHostel: {
      capacity: Number(data.girlsHostelCapacity || 0),
      bedsAvailable: Number(data.girlsBedsAvailable || 0),
      currentOccupancy: Number(data.girlsCurrentOccupancy || 0),
      cctvInstalled: data.girlsCCTVInstalled,
      noOfCCTV: Number(data.girlsNoOfCCTV || 0),
      securityAgency: data.girlsSecurityAgency,
      warden: {
        name: data.girlsWardenName,
        email: data.girlsWardenEmail,
        contact: data.girlsWardenContact,
      },
    },
  });
  const prepareClassStrength = (rows) => {
    return rows.map((row) => {
      const sanctionedCapacity = Number(row.sanctionedCapacity || 0);
      const currentEnrollment = Number(row.currentEnrollment || 0);
    });
  };

  const getMarksFromPercentage = (percent) => {
    if (percent === 100) return 10;
    if (percent >= 90) return 9;
    if (percent >= 80) return 8;
    if (percent >= 70) return 7;
    if (percent >= 60) return 6;
    if (percent >= 50) return 5;
    if (percent >= 40) return 4;
    if (percent >= 33) return 3;
    return 0;
  };

  const getAttendanceMarks = (percent) => {
    if (percent === 100) return 8;
    if (percent >= 95) return 6;
    if (percent >= 90) return 4;
    if (percent >= 80) return 2;
    return 0;
  };
  // Function to calculate Marks Obtained based on Utilization Percentage
  const calculateFundUtilMarks = (percentage) => {
    const numericPercentage = parseFloat(percentage); // Convert input to a number

    if (isNaN(numericPercentage)) {
      return 0;
    }

    if (numericPercentage >= 95 && numericPercentage <= 100) {
      return 5;
    } else if (numericPercentage >= 70 && numericPercentage <= 94) {
      return 3;
    } else if (numericPercentage >= 50 && numericPercentage <= 69) {
      return 1;
    } else if (numericPercentage < 50) {
      return 0;
    }
    return 0;
  };
  // Function to calculate Marks Obtained for GeM Procurement
  const calculateGemMarks = (percentage) => {
    const numericPercentage = parseFloat(percentage);

    if (isNaN(numericPercentage)) {
      return 0;
    }

    if (numericPercentage === 100) {
      // Explicitly for 100%
      return 5;
    } else if (numericPercentage >= 75 && numericPercentage <= 99) {
      return 4;
    } else if (numericPercentage >= 50 && numericPercentage <= 74) {
      return 3;
    } else if (numericPercentage >= 25 && numericPercentage <= 49) {
      return 1;
    } else if (numericPercentage < 25) {
      return 0;
    }
    return 0;
  };
  const prepareAcademicResults = (results) => {
    return results.map((item) => {
      const appeared = Number(item.appeared || 0);
      const passed = Number(item.passed || 0);

      const percent = appeared > 0 ? (passed / appeared) * 100 : 0;

      return {
        year: item.year,
        boardClass: item.boardClass,
        appeared,
        passed,
        passPercent: percent.toFixed(2),
        marks: getMarksFromPercentage(percent),
        above75: Number(item.above75 || 0),
        below50: Number(item.below50 || 0),
      };
    });
  };
  const prepareDropouts = (dropouts) => {
    return dropouts.map((item) => ({
      year: item.year,
      class: item.class,
      studentName: item.studentName?.trim(),
      reason: item.reason,
    }));
  };
  const prepareMigrations = (migrations) => {
    return migrations.map((item) => ({
      year: item.year,
      studentName: item.studentName?.trim(),
      class: item.class?.trim(),
      migratedfrom: item.migratedfrom,
      transferredTo: item.transferredTo,
      reason: item.reason,
    }));
  };

  const prepareAchievements = (achievements) => {
    return achievements.map((item) => ({
      studentName: item.studentName?.trim(),
      class: item.class,
      eventName: item.eventName,
      level: item.level,
      recognition: item.recognition,
    }));
  };
  const prepareExtraCurricular = (rows) => {
    return rows.map((item) => ({
      academicYear: item.academicYear,
      initiativeName: item.initiativeName?.trim(),
      collaboratingPartner: item.collaboratingPartner?.trim(),
      areasOfDevelopment: item.areasOfDevelopment,
      description: item.description?.trim(),
      targetStudents: item.targetStudents?.trim(),
      status: item.status,
    }));
  };
  const prepareHospitalization = (rows) => {
    return rows.map((item) => ({
      studentName: item.studentName?.trim(),
      rollNo: item.rollNo,
      class: item.class,
      section: item.section,
      admissionDate: item.admissionDate,
      dischargeDate: item.dischargeDate,
      reasonForHospitalization: item.reasonForHospitalization?.trim(),
      hospitalEmpanelled: item.hospitalEmpanelled?.trim(),
      empanellementValidity: item.empanellementValidity,
      treatmentDetails: item.treatmentDetails?.trim(),
      doctorName: item.doctorName?.trim(),
      estimatedCost: Number(item.estimatedCost || 0),
      amountClaimed: Number(item.amountClaimed || 0),
      claimStatus: item.claimStatus,
      guardianName: item.guardianName?.trim(),
      guardianContact: item.guardianContact,
      healthMonitoring: {
        "Annual Health Check Conducted": item["Annual Health Check Conducted"],
        "Part-Time Doctor Engaged": item["Part-Time Doctor Engaged"],
        "Medical Register Maintained": item["Medical Register Maintained"],
        "Sickle Cell Screening Conducted":
          item["Sickle Cell Screening Conducted"],
        "ABHA ID Created": item["ABHA ID Created"],
        "Eye Checkup Conducted": item["Eye Checkup Conducted"],
        "Ear Checkup Conducted": item["Ear Checkup Conducted"],
        marksHealth: item.marksHealth,
      },
      // eye entries
      eyeEntries: (item.eyeEntries || []).map((e) => ({
        eyeSpecialistName: e.eyeSpecialistName?.trim(),
        eyeCheckupDate: e.eyeCheckupDate,
        eyeClass: e.eyeClass,
        eyeSection: e.eyeSection,
        eyeStudentsScreened: Number(e.eyeStudentsScreened || 0),
        eyeStudentsWithProblem: Number(e.eyeStudentsWithProblem || 0),
        eyeNeedsSpectacle: Number(e.eyeNeedsSpectacle || 0),
        eyeNeedsHigherInvestigation: Number(e.eyeNeedsHigherInvestigation || 0),
      })),
      // ear entries
      earEntries: (item.earEntries || []).map((e) => ({
        earSpecialistName: e.earSpecialistName?.trim(),
        earCheckupDate: e.earCheckupDate,
        earClass: e.earClass,
        earSection: e.earSection,
        earStudentsScreened: Number(e.earStudentsScreened || 0),
        earStudentsWithProblem: Number(e.earStudentsWithProblem || 0),
        earNeedsEquipment: Number(e.earNeedsEquipment || 0),
      })),
      // ── NEW: Staff Nurse
      nurseEntries: (item.nurseEntries || []).map((n) => ({
        nurseName: n.nurseName?.trim(),
        nurseQualification: n.nurseQualification,
        nurseRegNo: n.nurseRegNo?.trim(),
        nurseContact: n.nurseContact,
        nurseShift: n.nurseShift,
        nurseJoiningDate: n.nurseJoiningDate,
      })),
      // ── NEW: Daily Visiting Doctor
      visitingDoctorName: item.visitingDoctorName?.trim(),
      visitingDoctorSpecialization: item.visitingDoctorSpecialization,
      visitingDoctorRegNo: item.visitingDoctorRegNo?.trim(),
      visitingDoctorContact: item.visitingDoctorContact,
      scheduledVisitTime: item.scheduledVisitTime,
      doctorVisitLogs: (item.doctorVisitLogs || []).map((log) => ({
        visitDate: log.visitDate,
        actualVisitTime: log.actualVisitTime,
        visitStatus: log.visitStatus,
        remarks: log.remarks?.trim(),
      })),
      // ── NEW: Psychological Counsellor
      counsellorName: item.counsellorName?.trim(),
      counsellorQualification: item.counsellorQualification,
      counsellorRegNo: item.counsellorRegNo?.trim(),
      counsellorContact: item.counsellorContact,
      counsellorAvailableDays: item.counsellorAvailableDays || [],
      counsellorSessionType: item.counsellorSessionType,
      counsellorSessionsConducted: Number(
        item.counsellorSessionsConducted || 0,
      ),
      counsellorStudentsCounselled: Number(
        item.counsellorStudentsCounselled || 0,
      ),
    }));
  };

  const prepareTeachingStaffSummary = (summary) => {
    return summary.map((item) => {
      const total = Number(item.total || 0);
      const filled = Number(item.filled || 0);

      return {
        post: item.post,
        total,
        filled,
        vacant: total - filled,
      };
    });
  };
  const prepareTeachingStaffDetails = (staffList) => {
    return staffList.map((staff) => ({
      post: staff.post,
      name: staff.name?.trim(),
      dob: staff.dob,
      doj: staff.doj,
      email: staff.email?.trim(),
      contact: staff.contact,
    }));
  };

  const prepareNonTeachingSummary = (summary) => {
    return summary.map((item) => {
      const total = Number(item.total || 0);
      const filled = Number(item.filled || 0);

      return {
        post: item.post,
        total,
        filled,
        vacant: total - filled,
      };
    });
  };

  const prepareNonTeachingDetails = (staffList) => {
    return staffList.map((staff) => ({
      post: staff.post,
      name: staff.name?.trim(),
      dob: staff.dob,
      doj: staff.doj,
      email: staff.email?.trim(),
      contact: staff.contact,
    }));
  };

  const prepareOperationalCost = (cost) => {
    const electricity = Number(cost.electricity || 0);
    const water = Number(cost.water || 0);
    const internet = Number(cost.internet || 0);
    const maintenance = Number(cost.maintenance || 0);
    const mess = Number(cost.mess || 0);
    const amount = Number(cost.amount || 0);

    return {
      electricity,
      water,
      internet,
      maintenance,
      mess,
      totalMonthlyCost,
    };
  };

  const onSubmit = async (data) => {
    console.log("onSubmit CALLED", data);
    const hasEyeErrors = Object.keys(eyeDateErrors).length > 0;
    const hasEarErrors = Object.keys(earDateErrors).length > 0;

    if (hasEyeErrors || hasEarErrors) {
      alert(
        "⚠️ Please fix the Eye/Ear checkup date errors before submitting.\nCheckup dates must be at least 6 months apart.",
      );
      return; // stops everything — no loading, no fetch, no toast
    }
    setLoading(true);

    try {
      const payload = {
        userId: "1",
        EMRScode: Number(data.EMRScode),
        schoolname: data.schoolname?.trim(),
        schooltype: data.schooltype?.trim(),
        affiliation: data.Affiliation?.trim(),
        principalName: data.NameofthePrincipal?.trim(),
        contactno: data.contactno?.trim(),
        email: data.emailid?.trim(),
        pincode: data.pincode,
        state: data.state,
        district: data.district,
        block: data.block,
        grampanchayat: data.grampanchayat,
        totalClassrooms: Number(data.totalClassrooms || 0),
        classroomWithSmartClass: Number(data.classroomWithSmartClass || 0),
        classroomWithProjector: Number(data.classroomWithProjector || 0),
        scienceLab: data.scienceLab,
        biologyLab: data.biologyLab,
        chemistryLab: data.chemistryLab,
        physicsLab: data.physicsLab,
        computerLab: data.computerLab,
        library: data.library,
        booksInLibrary: Number(data.booksInLibrary || 0),
        playground: data.playground,
        playgroundArea: Number(data.playgroundArea || 0),
        auditorium: data.Auditorium,
        medicalRoom: data["Medical Room"],
        boysHostel: {
          capacity: Number(data.boysHostelCapacity || 0),
          bedsAvailable: Number(data.boysBedsAvailable || 0),
          currentOccupancy: Number(data.boysCurrentOccupancy || 0),
          cctvInstalled: data.boysCCTVInstalled,
          noOfCCTV: Number(data.boysNoOfCCTV || 0),
          securityAgency: data.boysSecurityAgency,
          securityAgencyName: data.boysSecurityAgencyName || null,
          securityAgencyContact: data.boysSecurityAgencyContact || null,
          warden: {
            name: data.boysWardenName?.trim(),
            email: data.boysWardenEmail?.trim(),
            contact: data.boysWardenContact,
          },
        },
        girlsHostel: {
          capacity: Number(data.girlsHostelCapacity || 0),
          bedsAvailable: Number(data.girlsBedsAvailable || 0),
          currentOccupancy: Number(data.girlsCurrentOccupancy || 0),
          cctvInstalled: data.girlsCCTVInstalled,
          noOfCCTV: Number(data.girlsNoOfCCTV || 0),
          securityAgency: data.girlsSecurityAgency,
          warden: {
            name: data.girlsWardenName?.trim(),
            email: data.girlsWardenEmail?.trim(),
            contact: data.girlsWardenContact,
          },
        },
        classStrength: enrollmentRows.map((row) => ({
          academicYear: row.academicYear,
          class: row.class,
          section: row.section,
          sanctionedCapacity: Number(row.sanctionedCapacity || 0),
          currentEnrollment: Number(row.currentEnrollment || 0),
          categoryBreakdown: row.categoryBreakdown || {},
          academicPerformance: {
            appeared: Number(row.appeared || 0),
            passed: Number(row.passed || 0),
            passPercent: row.passPercent,
            above75: Number(row.above75 || 0),
            below50: Number(row.below50 || 0),
            stream: row.stream || null,
            distinctions: Number(row.distinctions || 0),
            topScorer: row.topScorer || null,
            topScore: Number(row.topScore || 0),
          },
          dropouts: row.dropouts.map((d) => ({
            rollNo: d.rollNo,
            studentName: d.studentName?.trim(),
            reason: d.reason?.trim(),
            guardianContactNo: d.guardianContactNo,
          })),
          migrations: row.migrations.map((m) => ({
            studentName: m.studentName?.trim(),
            migratedFrom: m.migratedFrom?.trim(),
            transferredTo: m.transferredTo?.trim(),
            reason: m.reason?.trim(),
          })),
          achievements: row.achievements.map((a) => ({
            studentName: a.studentName?.trim(),
            eventName: a.eventName?.trim(),
            level: a.level,
            recognition: a.recognition?.trim(),
          })),
        })),
        extraCurricular: extraCurricularRows.map((item) => ({
          academicYear: item.academicYear,
          initiativeName: item.initiativeName?.trim(),
          collaboratingPartner: item.collaboratingPartner?.trim(),
          areasOfDevelopment: item.areasOfDevelopment,
          description: item.description?.trim(),
          targetStudents: item.targetStudents?.trim(),
          status: item.status,
        })),
        hospitalization: hospitalizationRows.map((item) => ({
          studentName: item.studentName?.trim(),
          rollNo: item.rollNo,
          class: item.class,
          section: item.section,
          admissionDate: item.admissionDate,
          dischargeDate: item.dischargeDate,
          reasonForHospitalization: item.reasonForHospitalization?.trim(),
          hospitalEmpanelled: item.hospitalEmpanelled?.trim(),
          empanellementValidity: item.empanellementValidity,
          treatmentDetails: item.treatmentDetails?.trim(),
          doctorName: item.doctorName?.trim(),
          estimatedCost: Number(item.estimatedCost || 0),
          amountClaimed: Number(item.amountClaimed || 0),
          claimStatus: item.claimStatus,
          guardianName: item.guardianName?.trim(),
          guardianContact: item.guardianContact,
        })),
        teachingStaff: teachingRows.map((staff) => ({
          post: staff.post,
          name: staff.name?.trim(),
          dob: staff.dob,
          doj: staff.doj,
          email: staff.email?.trim(),
          contact: staff.contact,
          total: Number(staff.total || 0),
          filled: Number(staff.filled || 0),
          vacant: Number(staff.total || 0) - Number(staff.filled || 0),
          academicQualifications: staff.academicQualifications,
          professionalQualifications: staff.professionalQualifications,
          tetQualifications: staff.tetQualifications,
          monthlyAttendance: staff.monthlyAttendance || [],
        })),
        nonTeachingStaff: nonTeachingRows.map((staff) => ({
          post: staff.post,
          name: staff.name?.trim(),
          dob: staff.dob,
          doj: staff.doj,
          email: staff.email?.trim(),
          contact: staff.contact,
          total: Number(staff.total || 0),
          filled: Number(staff.filled || 0),
          vacant: Number(staff.total || 0) - Number(staff.filled || 0),
          academicQualifications: staff.academicQualifications,
          professionalQualifications: staff.professionalQualifications,
          monthlyAttendance: staff.monthlyAttendance || [],
        })),
        operationalCost: operationalCostRows.map((row) => ({
          year: row.year,
          month: row.month,
          costType: row.costType,
          amount: Number(row.amount || 0),
        })),
        messCompliance: {
          weeklyMenuDisplayed: messData.weeklyMenuDisplayed,
          messInspectionRegister: messData.messInspectionRegister,
          foodStockRegister: messData.foodStockRegister,
          foodComplaintRegister: messData.foodComplaintRegister,
          messCleanlinessDaily: messData.messCleanlinessDaily,
        },
        constructionStatus: {
          projectStartDate: data.projectStartDate || null,
          expectedEndDate: data.projectEndDate || null,
          totalBudget: Number(data.totalProjectBudget || 0),
          school: constructionRows.school,
          residence: constructionRows.residence,
          outdoor: constructionRows.outdoor,
          utilities: constructionRows.utilities,
        },
      };

      console.log("FINAL EMRS PAYLOAD:", payload);

      const loadingToast = toast.loading("Submitting EMRS data...");

      const response = await fetch("http://localhost:5000/api/emrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          `Server error ${response.status} — check backend is running on port 5000`,
        );
      }

      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error(result.message || `Server error: ${response.status}`);
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success("✅ EMRS Form Submitted Successfully!");
      setSubmitSuccess(true);
      console.log("EMRS RESPONSE:", result);

      if (addSubmittedForm) {
        addSubmittedForm({
          id: result._id || Date.now(),
          schoolname: payload.schoolname,
          EMRScode: payload.EMRScode,
          district: payload.district,
          submittedAt: new Date().toLocaleString(),
          payload,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("❌ Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  // ================= PINCODE AUTO FILL =================
  const onPincodeChange = async (e) => {
    const pincode = e.target.value;

    if (pincode.length !== 6) return;

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setValue("state", postOffice.State);
        setValue("district", postOffice.District);
        setValue("block", postOffice.Block);
        setValue("gram panchayat", postOffice.gramPanchayat);
        setValue("village", postOffice.Village);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };
  // ================= SYNC INFRA → CONSTRUCTION =================
  const syncInfraToConstruction = (fieldName, value) => {
    const map = {
      scienceLab: { cat: "school", component: "Science Lab" },
      library: { cat: "school", component: "Library" },
      Auditorium: { cat: "school", component: "Auditorium" },
      "Medical Room": { cat: "school", component: "Infirmary" },
    };
    if (map[fieldName] && value === "Yes") {
      const { cat, component } = map[fieldName];
      setConstructionRows((prev) => ({
        ...prev,
        [cat]: prev[cat].map((r) =>
          r.component === component && r.status === "Not Started"
            ? { ...r, status: "In Progress" }
            : r,
        ),
      }));
    }
  };

  // ================= CONSTRUCTION TABLE RENDERER =================
  const CONSTRUCTION_CONFIG = {
    school: {
      label: "School Block",
      icon: "🏫",
      color: "#1976d2",
      light: "#e3f2fd",
    },
    residence: {
      label: "Residence Block",
      icon: "🏠",
      color: "#7b1fa2",
      light: "#f3e5f5",
    },
    outdoor: {
      label: "Outdoor Block",
      icon: "🌳",
      color: "#2e7d32",
      light: "#e8f5e9",
    },
    utilities: {
      label: "Utilities Block",
      icon: "⚡",
      color: "#e65100",
      light: "#fff3e0",
    },
  };

  const CONSTRUCTION_STATUS_STYLE = {
    Completed: { color: "#16a34a", bg: "#dcfce7" },
    "In Progress": { color: "#d97706", bg: "#fef3c7" },
    "Not Started": { color: "#6b7280", bg: "#f3f4f6" },
    "On Hold": { color: "#7c3aed", bg: "#ede9fe" },
    Cancelled: { color: "#dc2626", bg: "#fee2e2" },
  };
  const renderStaffAttendance = (staffRows, setStaffRows, staffIndex) => {
    const row = staffRows[staffIndex];
    const attendance = row.monthlyAttendance || [];

    const totalWorking = attendance.reduce(
      (s, r) => s + Number(r.workingDays || 0),
      0,
    );
    const totalPresent = attendance.reduce(
      (s, r) => s + Number(r.present || 0),
      0,
    );
    const totalAbsent = totalWorking - totalPresent;
    const overallPct =
      totalWorking > 0
        ? ((totalPresent / totalWorking) * 100).toFixed(1)
        : null;

    const updateAttRow = (aIdx, field, val) => {
      const u = [...staffRows];
      u[staffIndex].monthlyAttendance[aIdx][field] = val;
      setStaffRows(u);
    };

    const addMonth = () => {
      const u = [...staffRows];
      if (!u[staffIndex].monthlyAttendance)
        u[staffIndex].monthlyAttendance = [];
      u[staffIndex].monthlyAttendance.push({
        month: "",
        workingDays: "",
        present: "",
      });
      setStaffRows(u);
    };

    const removeMonth = (aIdx) => {
      const u = [...staffRows];
      u[staffIndex].monthlyAttendance.splice(aIdx, 1);
      setStaffRows(u);
    };

    return (
      <Box mt={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "#374151" }}
          >
            📅 Monthly Attendance
          </Typography>
          {overallPct && (
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                background:
                  Number(overallPct) >= 75
                    ? "#dcfce7"
                    : Number(overallPct) >= 50
                      ? "#fef3c7"
                      : "#fee2e2",
                color:
                  Number(overallPct) >= 75
                    ? "#16a34a"
                    : Number(overallPct) >= 50
                      ? "#d97706"
                      : "#dc2626",
              }}
            >
              Overall: {overallPct}% &nbsp;|&nbsp; {totalPresent}P /{" "}
              {totalAbsent}A / {totalWorking} days
            </Box>
          )}
        </Box>

        {attendance.length === 0 && (
          <Typography
            sx={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic", mb: 1 }}
          >
            No attendance records yet. Click "+ Add Month" to begin.
          </Typography>
        )}

        {attendance.map((att, aIdx) => {
          const workingDays = Number(att.workingDays || 0);
          const present = Number(att.present || 0);
          const absent =
            workingDays > 0 && att.present !== ""
              ? workingDays - present
              : null;
          const pct =
            workingDays > 0 && att.present !== ""
              ? ((present / workingDays) * 100).toFixed(1)
              : null;

          return (
            <Box
              key={aIdx}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 2,
                mb: 1.5,
                background: "#fff",
                position: "relative",
              }}
            >
              {/* Delete button */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ minWidth: 0, px: 1, py: 0.2, fontSize: 11 }}
                  onClick={() => removeMonth(aIdx)}
                >
                  ✕
                </Button>
              </Box>

              <Grid container spacing={2} alignItems="center">
                {/* Month */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Month"
                    fullWidth
                    size="small"
                    sx={{ minWidth: 140 }}
                    value={att.month}
                    onChange={(e) =>
                      updateAttRow(aIdx, "month", e.target.value)
                    }
                  >
                    {[
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                      "January",
                      "February",
                      "March",
                    ].map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Working Days */}
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    label="Working Days"
                    type="number"
                    fullWidth
                    size="small"
                    value={att.workingDays}
                    inputProps={{ min: 0, max: 31 }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    onChange={(e) =>
                      updateAttRow(aIdx, "workingDays", e.target.value)
                    }
                  />
                </Grid>

                {/* Days Present */}
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    label="Days Present"
                    type="number"
                    fullWidth
                    size="small"
                    value={att.present}
                    inputProps={{ min: 0, max: workingDays || 31 }}
                    error={
                      att.present !== "" &&
                      present > workingDays &&
                      workingDays > 0
                    }
                    helperText={
                      att.present !== "" &&
                      present > workingDays &&
                      workingDays > 0
                        ? `Max ${workingDays}`
                        : ""
                    }
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    onChange={(e) =>
                      updateAttRow(aIdx, "present", e.target.value)
                    }
                  />
                </Grid>

                {/* Days Absent — auto */}
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    label="Days Absent"
                    fullWidth
                    size="small"
                    value={absent !== null ? absent : ""}
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        background:
                          absent > 0
                            ? "#fff5f5"
                            : absent === 0
                              ? "#f0fff4"
                              : "#f8fafc",
                      },
                      "& input": {
                        color: absent > 0 ? "#c62828" : "#16a34a",
                        fontWeight: 700,
                      },
                    }}
                  />
                </Grid>

                {/* Attendance % bar */}
                <Grid item xs={12} sm={12} md={3}>
                  {pct !== null ? (
                    <Box sx={{ px: 0.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                          Attendance
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 800,
                            color:
                              Number(pct) >= 75
                                ? "#16a34a"
                                : Number(pct) >= 50
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        >
                          {pct}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          background: "#e2e8f0",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            borderRadius: 4,
                            width: `${Math.min(Number(pct), 100)}%`,
                            background:
                              Number(pct) >= 75
                                ? "#16a34a"
                                : Number(pct) >= 50
                                  ? "#f59e0b"
                                  : "#dc2626",
                            transition: "width 0.3s",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          mt: 0.3,
                          color:
                            Number(pct) >= 75
                              ? "#16a34a"
                              : Number(pct) >= 50
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {Number(pct) >= 75
                          ? "🟢 Good"
                          : Number(pct) >= 50
                            ? "🟡 Average"
                            : "🔴 Low"}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      Fill days to see %
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          );
        })}

        {/* Annual Summary — shows only when 2+ months filled */}
        {attendance.length >= 2 && totalWorking > 0 && (
          <Box
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)",
              border: "1px solid #90caf9",
            }}
          >
            <Typography
              sx={{ fontWeight: 700, color: "#1976d2", mb: 1.5, fontSize: 13 }}
            >
              📊 Annual Summary
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Working Days", val: totalWorking, color: "#1976d2" },
                { label: "Present", val: totalPresent, color: "#16a34a" },
                { label: "Absent", val: totalAbsent, color: "#c62828" },
                {
                  label: "Attendance %",
                  val: `${overallPct}%`,
                  color:
                    Number(overallPct) >= 75
                      ? "#16a34a"
                      : Number(overallPct) >= 50
                        ? "#d97706"
                        : "#dc2626",
                },
              ].map(({ label, val, color }) => (
                <Grid item xs={6} sm={3} key={label}>
                  <Box
                    sx={{
                      textAlign: "center",
                      background: "#fff",
                      borderRadius: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color }}>
                      {val}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                      {label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box mt={1.5}>
          <Button variant="outlined" size="small" onClick={addMonth}>
            + Add Month
          </Button>
        </Box>
      </Box>
    );
  };

  const renderConstructionTable = (catKey) => {
    const cfg = CONSTRUCTION_CONFIG[catKey];
    const rows = constructionRows[catKey];

    const updateRow = (idx, field, val) => {
      setConstructionRows((prev) => {
        const updated = [...prev[catKey]];
        updated[idx] = { ...updated[idx], [field]: val };
        if (field === "status" && val === "Completed")
          updated[idx].progress = 100;
        if (field === "status" && val === "Not Started")
          updated[idx].progress = 0;
        return { ...prev, [catKey]: updated };
      });
    };

    const thStyle = {
      background: cfg.color,
      color: "#fff",
      padding: "9px 10px",
      fontSize: 12,
      fontWeight: 600,
      textAlign: "left",
      whiteSpace: "nowrap",
      borderRight: "1px solid rgba(255,255,255,0.2)",
    };
    const tdStyle = {
      padding: "8px 10px",
      fontSize: 13,
      verticalAlign: "middle",
      borderBottom: "1px solid #e5e7eb",
      borderRight: "1px solid #f1f5f9",
    };
    const nativeInput = {
      width: "100%",
      border: "1px solid #e2e8f0",
      borderRadius: 6,
      padding: "5px 8px",
      fontSize: 12,
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      background: "#fff",
    };

    return (
      <Box key={catKey} mb={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: cfg.light,
            border: `1px solid ${cfg.color}30`,
            borderRadius: "10px 10px 0 0",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography sx={{ fontWeight: 700, color: cfg.color, fontSize: 15 }}>
            {cfg.icon} {cfg.label}
          </Typography>
          <Box display="flex" gap={1}>
            <Typography
              sx={{
                background: "#dcfce7",
                color: "#16a34a",
                px: 1.5,
                py: 0.3,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              ✅ {rows.filter((r) => r.status === "Completed").length} Done
            </Typography>
            <Typography
              sx={{
                background: "#fef3c7",
                color: "#d97706",
                px: 1.5,
                py: 0.3,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              🔄 {rows.filter((r) => r.status === "In Progress").length} Active
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            overflowX: "auto",
            border: `1px solid ${cfg.color}25`,
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1050,
            }}
          >
            <thead>
              <tr>
                {[
                  "S.No",
                  "Component",
                  "Units",
                  "Status",
                  "Progress (%)",
                  "Start Date",
                  "End Date",
                  "Assigned To",
                  "Budget (₹)",
                  "Remarks",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}
                >
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#9ca3af",
                      fontWeight: 600,
                      width: 40,
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    {row.component.startsWith("↳") ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          pl: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: "#94a3b8",
                            mt: "1px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#64748b",
                            fontStyle: "italic",
                          }}
                        >
                          {row.component.replace("↳ ", "")}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        sx={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}
                      >
                        {row.component}
                      </Typography>
                    )}
                  </td>

                  <td style={{ ...tdStyle, minWidth: 100 }}>
                    <input
                      type="text"
                      value={row.units}
                      onChange={(e) => updateRow(i, "units", e.target.value)}
                      style={nativeInput}
                      placeholder="e.g. 2 rooms"
                    />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <select
                      value={row.status}
                      onChange={(e) => updateRow(i, "status", e.target.value)}
                      style={{
                        ...nativeInput,
                        background:
                          CONSTRUCTION_STATUS_STYLE[row.status]?.bg ||
                          "#f3f4f6",
                        color:
                          CONSTRUCTION_STATUS_STYLE[row.status]?.color ||
                          "#6b7280",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {[
                        "Not Started",
                        "In Progress",
                        "Completed",
                        "On Hold",
                        "Cancelled",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.progress}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "progress",
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        )
                      }
                      style={nativeInput}
                    />
                    <Box
                      sx={{
                        mt: 0.5,
                        height: 5,
                        background: "#e5e7eb",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          borderRadius: 2,
                          transition: "width 0.3s",
                          width: `${row.progress}%`,
                          background:
                            row.progress === 100
                              ? "#16a34a"
                              : row.progress > 0
                                ? "#f59e0b"
                                : "#d1d5db",
                        }}
                      />
                    </Box>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input
                      type="date"
                      value={row.startDate}
                      onChange={(e) =>
                        updateRow(i, "startDate", e.target.value)
                      }
                      style={nativeInput}
                    />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={(e) => updateRow(i, "endDate", e.target.value)}
                      style={nativeInput}
                    />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <input
                      type="text"
                      value={row.assignedTo}
                      onChange={(e) =>
                        updateRow(i, "assignedTo", e.target.value)
                      }
                      placeholder="Name / Agency"
                      style={nativeInput}
                    />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 110 }}>
                    <input
                      type="number"
                      value={row.budget}
                      onChange={(e) => updateRow(i, "budget", e.target.value)}
                      placeholder="0"
                      style={nativeInput}
                    />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) => updateRow(i, "remarks", e.target.value)}
                      placeholder="Optional"
                      style={nativeInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  };

  // ================= EMRS BASIC DETAILS =================
  const emrsBasicFields = [
    { name: "EMRScode", label: "EMRS Code" },
    { name: "udaisecode", label: "UDISE Code" },
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
  const emrsLocationFields = [
    { name: "district", label: "District" },
    { name: "block", label: "Block" },
    { name: "grampanchayat", label: "Gram Panchayat" },
    { name: "village", label: "Village" },
  ];
  //=================INFRASTRUCTURE DETAILS ==============//
  const emrsInfrastructureFields = [
    { name: " TotalClassrooms", label: "Total Classrooms" },
    { name: "ClassroomwithSmartclass", label: "Classroom with Smart Class" },
    { name: "classroomwithprojector", label: "Classroom with Projector" },
    {
      name: "ScienceLab",
      label: "Science Lab",
      options: ["Yes", "No"],
    },
    {
      name: "ComputerLab",
      label: "Computer Lab",
      options: ["Yes", "No"],
    },
    {
      name: "Library",
      label: "Library",
      options: ["Yes", "No"],
    },
    {
      name: "booksInLibrary",
      label: "No of Books in Library",
      type: "number",
    },
    {
      name: "Playground",
      label: "Playground",
      options: ["Yes", "No"],
    },
    {
      name: "auditorium",
      label: "Auditorium",
      options: ["Yes", "No"],
    },
    {
      name: "medicalroom",
      label: "Medical Room",
      options: ["Yes", "No"],
    },
  ];
  // ================= HOSTEL ADMINISTRATION DETAILS =================
  // ================= BOYS HOSTEL =================

  const boysHostelFields = [
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

  const girlsHostelFields = [
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
  // ================= ENROLLMENT SUMMARY =================
  const enrollmentFields = [
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
  const academicFields = [
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
  const achievementLevels = [
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
  const teachingStaffSummaryFields = [
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
  const nonTeachingStaffDetailFields = [
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
  const operationalCostFields = [
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

  emrsBasicFields.map((field) => (
    <TextField
      label={field.label}
      {...register(field.name)}
      type={field.type || "text"}
      InputProps={{
        readOnly: field.readOnly || false,
      }}
    />
  ));
  const qualificationOptions = [
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

  const tetQualificationOptions = [
    "CTET Paper I",
    "CTET Paper II",
    "STET Paper I",
    "STET Paper II",
    "Other",
  ];

  const professionalQualificationOptions = [
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

  const passingYears = Array.from({ length: 40 }, (_, i) =>
    String(new Date().getFullYear() - i),
  );

  const renderQualificationTables = (
    staffRows,
    setStaffRows,
    staffIndex,
    showTET = true,
  ) => {
    const row = staffRows[staffIndex];

    const thStyle = {
      backgroundColor: "#1976d2",
      color: "#fff",
      padding: "8px 6px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 600,
      border: "1px solid #1565c0",
      whiteSpace: "nowrap",
    };
    const tdStyle = { padding: "3px", border: "1px solid #cbd5e1" };
    const tdCenterStyle = {
      textAlign: "center",
      padding: "6px",
      border: "1px solid #cbd5e1",
      fontSize: "13px",
    };

    const updateField = (qualType, qIndex, field, value) => {
      const u = [...staffRows];
      u[staffIndex][qualType][qIndex][field] = value;
      setStaffRows(u);
    };

    const addRow = (qualType, emptyObj) => {
      const u = [...staffRows];
      u[staffIndex][qualType].push(emptyObj);
      setStaffRows(u);
    };

    const resetRow = (qualType, qIndex, emptyObj) => {
      const u = [...staffRows];
      u[staffIndex][qualType][qIndex] = { ...emptyObj };
      setStaffRows(u);
    };

    const ActionButtons = ({ qualType, qIndex, emptyObj }) => (
      <Box display="flex" gap={0.5} justifyContent="center">
        <Button
          variant="contained"
          size="small"
          sx={{
            minWidth: 0,
            px: 1,
            py: 0.3,
            fontSize: "13px",
            backgroundColor: "#f59e0b",
            "&:hover": { backgroundColor: "#d97706" },
          }}
          onClick={() => {
            const u = [...staffRows];
            u[staffIndex][qualType].splice(qIndex + 1, 0, { ...emptyObj });
            setStaffRows(u);
          }}
        >
          +
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            minWidth: 0,
            px: 1,
            py: 0.3,
            fontSize: "13px",
            borderColor: "#1976d2",
            color: "#1976d2",
          }}
          onClick={() => resetRow(qualType, qIndex, emptyObj)}
        >
          ↺
        </Button>
      </Box>
    );

    const emptyAcademic = {
      post: "",
      name: " ",
      qualification: "",
      course: "",
      registrationNo: "",
      rollNo: "",
      college: "",
      marksObtained: "",
      university: "",
      passingYear: "",
    };
    const emptyProfessional = {
      post: "",
      name: " ",
      qualification: "",
      registrationNo: "",
      rollNo: "",
      examConductedBy: "",
      passingYear: "",
      marksObtained: "",
      affiliationBody: "",
    };
    const emptyTET = {
      post: "",
      name: " ",
      qualification: "",
      registrationNo: "",
      rollNo: "",
      examConductedBy: "",
      passingYear: "",
      marksObtained: "",
      affiliationBody: "",
    };

    return (
      <Box mt={2}>
        {/* ── ACADEMIC QUALIFICATION ── */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "#374151", mb: 1 }}
        >
          Academic Qualification
        </Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "S.No",
                  "Post",
                  "Name",
                  "Qualification",
                  "Course",
                  "Registration No.",
                  "Roll No.",
                  "College",
                  "Marks Obtained (%)",
                  "University",
                  "Passing Year",
                  "Action",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.academicQualifications.map((q, qIndex) => (
                <tr
                  key={qIndex}
                  style={{
                    backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff",
                  }}
                >
                  <td style={tdCenterStyle}>{qIndex + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fff",
                        background: "#1976d2",
                        px: 1,
                        py: 0.4,
                        borderRadius: 1,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.post || "—"}
                    </Typography>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        px: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.name || "—"}
                    </Typography>
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={q.qualification}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "qualification",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 110 }}
                    >
                      {qualificationOptions.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.course}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "course",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 90 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.registrationNo}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "registrationNo",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 110 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.rollNo}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "rollNo",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 90 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.college}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "college",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 120 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={q.marksObtained}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "marksObtained",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 90 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.university}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "university",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 120 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={q.passingYear}
                      onChange={(e) =>
                        updateField(
                          "academicQualifications",
                          qIndex,
                          "passingYear",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 100 }}
                    >
                      {passingYears.map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </TextField>
                  </td>
                  <td style={tdCenterStyle}>
                    <ActionButtons
                      qualType="academicQualifications"
                      qIndex={qIndex}
                      emptyObj={emptyAcademic}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* ── PROFESSIONAL QUALIFICATION ── */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "#374151", mb: 1 }}
        >
          Professional Qualification
        </Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "S.No",
                  "Post",
                  "Name",
                  "Qualification",
                  "Registration No.",
                  "Roll No.",
                  "Exam Conducted By",
                  "Passing Year",
                  "Marks Obtained (%)",
                  "Affiliation Body",
                  "Action",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.professionalQualifications.map((q, qIndex) => (
                <tr
                  key={qIndex}
                  style={{
                    backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff",
                  }}
                >
                  <td style={tdCenterStyle}>{qIndex + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fff",
                        background: "#1976d2",
                        px: 1,
                        py: 0.4,
                        borderRadius: 1,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.post || "—"}
                    </Typography>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        px: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.name || "—"}
                    </Typography>
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={q.qualification}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "qualification",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 110 }}
                    >
                      {professionalQualificationOptions.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.registrationNo}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "registrationNo",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 110 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.rollNo}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "rollNo",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 90 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.examConductedBy}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "examConductedBy",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 120 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={q.passingYear}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "passingYear",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 100 }}
                    >
                      {passingYears.map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={q.marksObtained}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "marksObtained",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 90 }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <TextField
                      fullWidth
                      size="small"
                      value={q.affiliationBody}
                      onChange={(e) =>
                        updateField(
                          "professionalQualifications",
                          qIndex,
                          "affiliationBody",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 120 }}
                    />
                  </td>
                  <td style={tdCenterStyle}>
                    <ActionButtons
                      qualType="professionalQualifications"
                      qIndex={qIndex}
                      emptyObj={emptyProfessional}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {/* ── TET QUALIFICATION ── */}
        {showTET && (
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "#374151", mb: 1 }}
          >
            TET Qualification
          </Typography>
        )}
        {showTET && (
          <Box sx={{ overflowX: "auto", mb: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "S.No",
                    "Post",
                    "Name",
                    "Qualification",
                    "Registration No.",
                    "Roll No.",
                    "Exam Conducted By",
                    "Passing Year",
                    "Marks Obtained (%)",
                    "Affiliation Body",
                    "Action",
                  ].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {row.tetQualifications.map((q, qIndex) => (
                  <tr
                    key={qIndex}
                    style={{
                      backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff",
                    }}
                  >
                    <td style={tdCenterStyle}>{qIndex + 1}</td>
                    <td style={{ ...tdStyle, minWidth: 120 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#fff",
                          background: "#1976d2",
                          px: 1,
                          py: 0.4,
                          borderRadius: 1,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.post || "—"}
                      </Typography>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 130 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          px: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.name || "—"}
                      </Typography>
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={q.qualification}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "qualification",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 130 }}
                      >
                        {tetQualificationOptions.map((o) => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                      </TextField>
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        fullWidth
                        size="small"
                        value={q.registrationNo}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "registrationNo",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 110 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        fullWidth
                        size="small"
                        value={q.rollNo}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "rollNo",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 90 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        fullWidth
                        size="small"
                        value={q.examConductedBy}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "examConductedBy",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 120 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={q.passingYear}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "passingYear",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 100 }}
                      >
                        {passingYears.map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </TextField>
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={q.marksObtained}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "marksObtained",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 90 }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <TextField
                        fullWidth
                        size="small"
                        value={q.affiliationBody}
                        onChange={(e) =>
                          updateField(
                            "tetQualifications",
                            qIndex,
                            "affiliationBody",
                            e.target.value,
                          )
                        }
                        sx={{ minWidth: 120 }}
                      />
                    </td>
                    <td style={tdCenterStyle}>
                      <ActionButtons
                        qualType="tetQualifications"
                        qIndex={qIndex}
                        emptyObj={emptyTET}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container
      sx={{
        mt: 4,
        mb: 4,
        backgroundColor: "#f1f5f9",
        padding: 3,
        borderRadius: 3,
      }}
    >
      <Toaster position="top-right" />
      {/* ===== Header ===== */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        EMRS
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create and manage EMRS details
      </Typography>

      {/* ===== STEPPER ===== */}
      <Box sx={{ overflowX: "auto", pb: 1, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 700 }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 72,
                }}
              >
                <Box
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    background:
                      i === currentStep
                        ? "#1976d2"
                        : i < currentStep
                          ? "#4caf50"
                          : "#e2e8f0",
                    color: i <= currentStep ? "#fff" : "#94a3b8",
                    cursor: i < currentStep ? "pointer" : "default",
                    fontWeight: 700,
                    transition: "all 0.3s",
                    boxShadow: i === currentStep ? "0 0 0 4px #bbdefb" : "none",
                  }}
                >
                  {i < currentStep ? "✓" : step.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    mt: 0.5,
                    fontWeight: i === currentStep ? 700 : 400,
                    color:
                      i === currentStep
                        ? "#1976d2"
                        : i < currentStep
                          ? "#4caf50"
                          : "#94a3b8",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
              {i < STEPS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    mx: 0.5,
                    background: i < currentStep ? "#4caf50" : "#e2e8f0",
                    borderRadius: 2,
                    transition: "background 0.3s",
                    minWidth: 10,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Card>
        <Box
          sx={{
            background: "linear-gradient(to right, #1976d2, #42a5f5)",
            padding: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            EMRS Details Form
          </Typography>
        </Box>

        <Divider />

        <CardContent
          sx={{
            backgroundColor: "#f8fafc",
            padding: 4,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(watch());
            }}
            style={{
              pointerEvents: loading ? "none" : "auto",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {currentStep === 0 && (
              <>
                {/* ================= BASIC SCHOOL DETAILS ROW ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      School Details
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={4}>
                  {emrsBasicFields.map((fieldItem) => {
                    if (
                      fieldItem.name === "NameofthePrincipal" &&
                      watch("principalAvailable") !== "Yes"
                    )
                      return null;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
                        <Controller
                          name={fieldItem.name}
                          control={control}
                          defaultValue=""
                          rules={{
                            ...(fieldItem.name === "contactno" && {
                              validate: (v) =>
                                !v ||
                                /^[0-9]{10}$/.test(String(v)) ||
                                "Must be exactly 10 digits",
                            }),
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              label={fieldItem.label}
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                              select={!!fieldItem.options}
                              error={!!error}
                              helperText={error ? error.message : ""}
                              {...(fieldItem.name === "contactno" && {
                                inputProps: {
                                  maxLength: 10,
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                },
                                onKeyDown: (e) => {
                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    ![
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                      "Tab",
                                    ].includes(e.key)
                                  )
                                    e.preventDefault();
                                },
                              })}
                              {...([
                                "schoolname",
                                "NameofthePrincipal",
                                "emailid",
                              ].includes(fieldItem.name) && {
                                onKeyDown: (e) => {
                                  if (/^[0-9]$/.test(e.key)) e.preventDefault();
                                },
                              })}
                            >
                              {fieldItem.options &&
                                fieldItem.options.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
                {/* ================= EMRS LOCATION SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      EMRS Location Details
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={4}>
                  {/* Pincode */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="pincode"
                      control={control}
                      defaultValue=""
                      rules={{}}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Pincode"
                          fullWidth
                          size="small"
                          onChange={(e) => {
                            field.onChange(e);
                            onPincodeChange(e);
                          }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Grid>

                  {/* District */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="district"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="District"
                          fullWidth
                          size="small"
                          onKeyDown={(e) => {
                            if (/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Block */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="block"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Block"
                          fullWidth
                          size="small"
                          onKeyDown={(e) => {
                            if (/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Gram Panchayat */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="gramPanchayat"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Gram Panchayat"
                          fullWidth
                          size="small"
                          onKeyDown={(e) => {
                            if (/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Village */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="Village"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Village"
                          fullWidth
                          size="small"
                          onKeyDown={(e) => {
                            if (/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {currentStep === 1 && (
              <>
                {/* ================= EMRS INFRASTRUCTURE DETAILS ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Infrastructure Details
                    </Typography>
                  </Grid>
                </Grid>

                {/* ── LINE 1: Classrooms ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: "#fff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    🏫 Classrooms
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4}>
                      <Controller
                        name="totalClassrooms"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Total Classrooms"
                            type="number"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <Controller
                        name="classroomWithSmartClass"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Classroom with Smart Class"
                            type="number"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <Controller
                        name="classroomWithProjector"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Classroom with Projector"
                            type="number"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* ── LINE 2: Science Lab ── */}
                <Box
                  sx={{
                    border: "1px solid #bbdefb",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: "#f0f7ff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    🔬 Science Lab
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3} md={3}>
                      <Controller
                        name="scienceLab"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Science Lab Available"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            onChange={(e) => {
                              field.onChange(e);
                              syncInfraToConstruction(
                                "scienceLab",
                                e.target.value,
                              );
                            }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                    {watch("scienceLab") === "Yes" && (
                      <>
                        <Grid item xs={12} sm={3} md={3}>
                          <Controller
                            name="biologyLab"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                label="Biology Lab"
                                fullWidth
                                size="small"
                                sx={{ minWidth: 220 }}
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                          <Controller
                            name="chemistryLab"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                label="Chemistry Lab"
                                fullWidth
                                size="small"
                                sx={{ minWidth: 220 }}
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                          <Controller
                            name="physicsLab"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                label="Physics Lab"
                                fullWidth
                                size="small"
                                sx={{ minWidth: 220 }}
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>

                {/* ── LINE 3: Computer Lab ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: "#fff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    💻 Computer Lab
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Computer Lab Yes/No */}
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="computerLab"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Computer Lab"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Conditional Internet in Computer Lab */}
                    {watch("computerLab") === "Yes" && (
                      <Grid item xs={12} sm={4} md={3}>
                        <Controller
                          name="internetComputerLab"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              label="Internet in Computer Lab"
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                            >
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </TextField>
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* ── LINE 4: Library ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: "#fff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    📚 Library
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="library"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Library Available"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            onChange={(e) => {
                              field.onChange(e);
                              syncInfraToConstruction(
                                "library",
                                e.target.value,
                              );
                            }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {watch("library") === "Yes" && (
                      <Grid item xs={12} sm={4} md={3}>
                        <Controller
                          name="booksInLibrary"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="No. of Books in Library"
                              type="number"
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* ── LINE 5: Playground ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: "#fff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    ⚽ Playground
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="playground"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Playground Available"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                    {watch("playground") === "Yes" && (
                      <Grid item xs={12} sm={4} md={3}>
                        <Controller
                          name="playgroundArea"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Playground Area (sq. ft)"
                              type="number"
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* ── LINE 6: Auditorium & Medical Room ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 2,
                    mb: 4,
                    background: "#fff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    🏛️ Other Facilities
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="Auditorium"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Auditorium"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            onChange={(e) => {
                              field.onChange(e);
                              syncInfraToConstruction(
                                "Auditorium",
                                e.target.value,
                              );
                            }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {watch("Auditorium") === "Yes" && (
                      <Grid item xs={12} sm={4} md={3}>
                        <Controller
                          name="auditoriumCapacity"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Auditorium Capacity"
                              type="number"
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                            />
                          )}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="Medical Room"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Medical Room"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            onChange={(e) => {
                              field.onChange(e);
                              syncInfraToConstruction(
                                "Medical Room",
                                e.target.value,
                              );
                            }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
                {/* ── LINE 7: Fire & Electrical Safety Compliance ── */}
                <Box
                  sx={{
                    border: "1px solid #ffccbc",
                    borderRadius: 2,
                    p: 2,
                    mb: 4,
                    background: "#fff8f6",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#d84315",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    🔥 Fire & Electrical Safety Compliance
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Total Fire Extinguishers Installed */}
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="totalFireExtinguishers"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Total Fire Extinguishers Installed"
                            type="number"
                            fullWidth
                            size="small"
                            inputProps={{ min: 0 }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e")
                                e.preventDefault();
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Functional Fire Extinguishers */}
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="functionalFireExtinguishers"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Functional Fire Extinguishers"
                            type="number"
                            fullWidth
                            size="small"
                            inputProps={{ min: 0 }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e")
                                e.preventDefault();
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Electrical Safety Inspection */}
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="electricalSafetyInspection"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Electrical Safety Inspection Conducted"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Fire Safety Drill */}
                    <Grid item xs={12} sm={4} md={3}>
                      <Controller
                        name="fireSafetyDrill"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Fire Safety Drill Conducted"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
                {/* ── Laboratory Functionality ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 3,
                    mb: 4,
                    background: "#fff",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1976d2",
                      mb: 1.5,
                      fontSize: 14,
                    }}
                  >
                    🧪 Laboratory Functionality
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Physics Lab */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="physicsLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Physics Lab Functional"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Chemistry Lab */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="chemistryLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Chemistry Lab Functional"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Biology Lab */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="biologyLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Biology Lab Functional"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Computer Lab */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="computerLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Computer Lab Functional"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Mathematics Lab */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="mathLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Mathematics Lab Functional"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Skill Lab */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="skillLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Skill Lab Functional"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* Marks Obtained */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="marksLabFunctional"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Marks Obtained (out of 5)"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            InputProps={{ readOnly: true }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  {/* Marking Criteria Table */}
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Condition</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Marks</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { condition: "All 6 Labs functional", marks: 5 },
                            { condition: "3–5 Labs functional", marks: 3 },
                            { condition: "1–2 Labs functional", marks: 1 },
                            { condition: "None functional", marks: 0 },
                          ].map((row) => (
                            <TableRow key={row.condition}>
                              <TableCell>{row.condition}</TableCell>
                              <TableCell>{row.marks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </>
            )}
            {currentStep === 2 && (
              <>
                {/* ================= CONSTRUCTION & ASSET STATUS ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      🏗️ Construction & Asset Status
                    </Typography>
                  </Grid>
                </Grid>

                {/* Project Overview */}
                <Box
                  sx={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 3,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#1976d2", mb: 2 }}
                  >
                    Project Overview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="projectStartDate"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Project Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="projectEndDate"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Expected End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name="totalProjectBudget"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Total Project Budget (₹)"
                            type="number"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Live Summary Banner */}
                {(() => {
                  const all = Object.values(constructionRows).flat();
                  const total = all.length;
                  const completed = all.filter(
                    (r) => r.status === "Completed",
                  ).length;
                  const inProgress = all.filter(
                    (r) => r.status === "In Progress",
                  ).length;
                  const pct =
                    total > 0
                      ? Math.round(
                          all.reduce((s, r) => s + r.progress, 0) / total,
                        )
                      : 0;
                  return (
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                        borderRadius: 2,
                        p: 3,
                        mb: 3,
                        color: "#fff",
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
                            Overall Construction Progress
                          </Typography>
                          <Typography sx={{ fontSize: 32, fontWeight: 800 }}>
                            {pct}%
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              height: 8,
                              background: "rgba(255,255,255,0.3)",
                              borderRadius: 2,
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                width: `${pct}%`,
                                background: "#fff",
                                borderRadius: 2,
                                transition: "width 0.5s",
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Box display="flex" gap={2} flexWrap="wrap">
                            {[
                              {
                                label: "Total",
                                val: total,
                                bg: "rgba(255,255,255,0.15)",
                              },
                              {
                                label: "✅ Completed",
                                val: completed,
                                bg: "rgba(22,163,74,0.35)",
                              },
                              {
                                label: "🔄 In Progress",
                                val: inProgress,
                                bg: "rgba(245,158,11,0.35)",
                              },
                              {
                                label: "⏳ Not Started",
                                val: total - completed - inProgress,
                                bg: "rgba(255,255,255,0.1)",
                              },
                            ].map(({ label, val, bg }) => (
                              <Box
                                key={label}
                                sx={{
                                  textAlign: "center",
                                  background: bg,
                                  borderRadius: 2,
                                  px: 2.5,
                                  py: 1.5,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 22, fontWeight: 800 }}
                                >
                                  {val}
                                </Typography>
                                <Typography sx={{ fontSize: 11, opacity: 0.9 }}>
                                  {label}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })()}

                {/* 4 Category Tables */}
                {["school", "residence", "outdoor", "utilities"].map((catKey) =>
                  renderConstructionTable(catKey),
                )}

                <Box mb={4} />
              </>
            )}
            {currentStep === 3 && (
              <>
                {/* ================= HOSTEL ADMINISTRATION SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Hostel Administration
                    </Typography>
                  </Grid>
                </Grid>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                >
                  Boys Hostel Details
                </Typography>

                <Grid container spacing={2} mb={4}>
                  {/* ── Line 1: Capacity, Beds, Occupancy ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysHostelCapacity"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Capacity cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Boys Hostel Capacity"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysBedsAvailable"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Beds available cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Beds Available"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysCurrentOccupancy"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Current occupancy cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Current Occupancy"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ padding: "0 !important" }} />

                  {/* ── Line 2: CCTV Installed, No of CCTV ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysCCTVInstalled"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="CCTV  Camera Installed"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysNoOfCCTV"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Number of CCTV cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="No of CCTV Cameras Installed"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ padding: "0 !important" }} />

                  {/* ── Line 3: Security Agency Available + conditional Name & Contact ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysSecurityAgency"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Security Agency Available"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  {watch("boysSecurityAgency") === "Yes" && (
                    <>
                      <Grid item xs={12} sm={4} md={4}>
                        <Controller
                          name="boysSecurityAgencyName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Security Agency Name"
                              fullWidth
                              size="small"
                              onKeyDown={(e) => {
                                if (/^[0-9]$/.test(e.key)) e.preventDefault();
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4}>
                        <Controller
                          name="boysSecurityAgencyContact"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Security Agency Contact"
                              fullWidth
                              size="small"
                              inputProps={{
                                maxLength: 10,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                              onKeyDown={(e) => {
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              error={
                                field.value &&
                                field.value.toString().length !== 10
                              }
                              helperText={
                                field.value &&
                                field.value.toString().length !== 10
                                  ? "Must be exactly 10 digits"
                                  : ""
                              }
                            />
                          )}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sx={{ padding: "0 !important" }} />

                  {/* ── Line 4: Warden Name, Contact, Email ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysWardenName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Boys Warden Name"
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysWardenContact"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Boys Warden Contact"
                          fullWidth
                          size="small"
                          inputProps={{
                            maxLength: 10,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              ![
                                "Backspace",
                                "Delete",
                                "ArrowLeft",
                                "ArrowRight",
                                "Tab",
                              ].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          error={
                            field.value && field.value.toString().length !== 10
                          }
                          helperText={
                            field.value && field.value.toString().length !== 10
                              ? "Must be exactly 10 digits"
                              : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="boysWardenEmail"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Boys Warden Email"
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                >
                  Girls Hostel Details
                </Typography>

                <Grid container spacing={2} mb={4}>
                  {/* ── Line 1: Capacity, Beds, Occupancy ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsHostelCapacity"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Capacity cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Girls Hostel Capacity"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsBedsAvailable"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Beds available cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Beds Available"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsCurrentOccupancy"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Current occupancy cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Current Occupancy"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ padding: "0 !important" }} />

                  {/* ── Line 2: CCTV Installed, No of CCTV ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsCCTVInstalled"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="CCTV Camera Installed"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsNoOfCCTV"
                      control={control}
                      defaultValue=""
                      rules={{
                        min: {
                          value: 0,
                          message: "Number of CCTV cannot be negative",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="No of CCTV cameras Installed"
                          type="number"
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              field.onChange(e);
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ padding: "0 !important" }} />

                  {/* ── Line 3: Security Agency Available + conditional Name & Contact ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsSecurityAgency"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Security Agency Available"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  {watch("girlsSecurityAgency") === "Yes" && (
                    <>
                      <Grid item xs={12} sm={4} md={4}>
                        <Controller
                          name="girlsSecurityAgencyName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Security Agency Name"
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4}>
                        <Controller
                          name="girlsSecurityAgencyContact"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Security Agency Contact"
                              fullWidth
                              size="small"
                              inputProps={{
                                maxLength: 10,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                              onKeyDown={(e) => {
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              error={
                                field.value &&
                                field.value.toString().length !== 10
                              }
                              helperText={
                                field.value &&
                                field.value.toString().length !== 10
                                  ? "Must be exactly 10 digits"
                                  : ""
                              }
                            />
                          )}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sx={{ padding: "0 !important" }} />

                  {/* ── Line 4: Warden Name, Contact, Email ── */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsWardenName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Girls Warden Name"
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsWardenContact"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Girls Warden Contact"
                          fullWidth
                          size="small"
                          inputProps={{
                            maxLength: 10,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              ![
                                "Backspace",
                                "Delete",
                                "ArrowLeft",
                                "ArrowRight",
                                "Tab",
                              ].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          error={
                            field.value && field.value.toString().length !== 10
                          }
                          helperText={
                            field.value && field.value.toString().length !== 10
                              ? "Must be exactly 10 digits"
                              : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Controller
                      name="girlsWardenEmail"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Girls Warden Email"
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {/* ================= MESS DETAILS ================= */}
                {/* ================= MAIN SECTION ================= */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#1976d2", mb: 2, mt: 3 }}
                >
                  🧾 Mess Management and Compliance
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 3,
                    background: "#fff",
                  }}
                >
                  {/* ================= SUBSECTION 1 ================= */}
                  <Typography sx={{ fontWeight: 600, color: "#16a34a", mb: 2 }}>
                    🧾 Mess Expenditure Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Mess Year"
                        value={messData.year}
                        onChange={(e) =>
                          setMessData({ ...messData, year: e.target.value })
                        }
                      >
                        {["2024", "2025", "2026"].map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Mess Month"
                        value={messData.month}
                        onChange={(e) =>
                          setMessData({ ...messData, month: e.target.value })
                        }
                      >
                        {[
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
                        ].map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        type="date"
                        fullWidth
                        size="small"
                        label="Purchase Date"
                        InputLabelProps={{ shrink: true }}
                        value={messData.purchaseDate}
                        onChange={(e) =>
                          setMessData({
                            ...messData,
                            purchaseDate: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Invoice/Bill No."
                        value={messData.billNo}
                        onChange={(e) =>
                          setMessData({ ...messData, billNo: e.target.value })
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        sx={{ minWidth: 220 }}
                        label="Payment Method"
                        value={messData.paymentMethod}
                        onChange={(e) =>
                          setMessData({
                            ...messData,
                            paymentMethod: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Card">Card</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  {/* TABLE */}
                  <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                      <TableHead sx={{ background: "#f1f5f9" }}>
                        <TableRow>
                          <TableCell>
                            <b>Category</b>
                          </TableCell>
                          <TableCell>
                            <b>Item</b>
                          </TableCell>
                          <TableCell>
                            <b>Qty</b>
                          </TableCell>
                          <TableCell>
                            <b>Price (₹)</b>
                          </TableCell>
                          <TableCell>
                            <b>Total (₹)</b>
                          </TableCell>
                          <TableCell>
                            <b>Action</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {messData.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                select
                                size="small"
                                value={item.category}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "category",
                                    e.target.value,
                                  )
                                }
                              >
                                <MenuItem value="Recurring">Recurring</MenuItem>
                                <MenuItem value="Non-recurring">
                                  Non-recurring
                                </MenuItem>
                              </TextField>
                            </TableCell>

                            <TableCell>
                              <TextField
                                size="small"
                                value={item.name}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={item.price}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "price",
                                    e.target.value,
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell>
                              ₹ {Number(item.total || 0).toFixed(2)}
                            </TableCell>

                            <TableCell>
                              <Button
                                color="error"
                                onClick={() => removeItem(index)}
                              >
                                X
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* ADD + TOTAL */}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button variant="outlined" onClick={addItem}>
                      + Add
                    </Button>
                    <Typography sx={{ fontWeight: 700 }}>
                      Grand Total: ₹ {calculateGrandTotal().toFixed(2)}
                    </Typography>
                  </Box>

                  {/* ================= SUBSECTION 2 ================= */}
                  <Typography
                    sx={{ fontWeight: 600, color: "#2563eb", mt: 4, mb: 2 }}
                  >
                    📋 Mess Compliance & Monitoring
                  </Typography>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead sx={{ background: "#f1f5f9" }}>
                        <TableRow>
                          <TableCell>Weekly Menu Register</TableCell>
                          <TableCell>Inspection Register</TableCell>
                          <TableCell>Stock Register</TableCell>
                          <TableCell>Complaint Register</TableCell>
                          <TableCell>Cleanliness Register</TableCell>
                          <TableCell>Marks</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {[
                            "weeklyMenuDisplayed",
                            "messInspectionRegister",
                            "foodStockRegister",
                            "foodComplaintRegister",
                            "messCleanlinessDaily",
                          ].map((field) => (
                            <TableCell key={field}>
                              <TextField
                                select
                                size="small"
                                value={messData[field] || ""}
                                onChange={(e) =>
                                  setMessData((prev) => ({
                                    ...prev,
                                    [field]: e.target.value,
                                  }))
                                }
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            </TableCell>
                          ))}

                          <TableCell>
                            <Typography sx={{ fontWeight: 700 }}>
                              {(() => {
                                const yes = [
                                  messData.weeklyMenuDisplayed,
                                  messData.messInspectionRegister,
                                  messData.foodStockRegister,
                                  messData.foodComplaintRegister,
                                  messData.messCleanlinessDaily,
                                ].filter((v) => v === "Yes").length;

                                return yes === 5
                                  ? 5
                                  : yes === 4
                                    ? 3
                                    : yes === 3
                                      ? 1
                                      : 0;
                              })()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* MARKING CRITERIA */}
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>
                      *Marking Criteria (Out of 5)
                    </Typography>

                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>All 5 fulfilled</TableCell>
                            <TableCell>5</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Any 4 fulfilled</TableCell>
                            <TableCell>3</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Any 3 fulfilled</TableCell>
                            <TableCell>1</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Less than 3 fulfilled</TableCell>
                            <TableCell>0</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </>
            )}
            {currentStep === 4 && (
              <>
                {/* ================= UNIFIED STUDENT ENROLLMENT SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Student Enrollment Details
                    </Typography>
                  </Grid>
                </Grid>

                {enrollmentRows.map((row, rowIndex) => (
                  <Box
                    key={rowIndex}
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      mb: 3,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                    }}
                  >
                    {/* ── BLOCK TITLE BAR ── */}
                    <Box
                      sx={{
                        background:
                          "linear-gradient(to right, #1e3a5f, #1976d2)",
                        px: 3,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                      >
                        📚 Enrollment Block {rowIndex + 1}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {row.academicYear && (
                          <Box
                            sx={{
                              background: "rgba(255,255,255,0.18)",
                              borderRadius: 10,
                              px: 1.5,
                              py: 0.3,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              📅 {row.academicYear}
                            </Typography>
                          </Box>
                        )}
                        {row.class && (
                          <Box
                            sx={{
                              background: "rgba(255,255,255,0.18)",
                              borderRadius: 10,
                              px: 1.5,
                              py: 0.3,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              🎓 Class {row.class}
                            </Typography>
                          </Box>
                        )}
                        {row.section && (
                          <Box
                            sx={{
                              background: "rgba(255,255,255,0.18)",
                              borderRadius: 10,
                              px: 1.5,
                              py: 0.3,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              🔖 Section {row.section}
                            </Typography>
                          </Box>
                        )}
                        {!row.academicYear && !row.class && !row.section && (
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              fontSize: 12,
                              fontStyle: "italic",
                            }}
                          >
                            Select year, class & section below
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ padding: 3 }}>
                      {/* ── ENROLLMENT HEADER ── */}
                      <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            select
                            label="Academic Year"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            value={row.academicYear}
                            onChange={(e) => {
                              const u = [...enrollmentRows];
                              u[rowIndex].academicYear = e.target.value;
                              setEnrollmentRows(u);
                            }}
                          >
                            {[
                              "2024-2025",
                              "2025-2026",
                              "2026-2027",
                              "2027-2028",
                              "2028-2029",
                              "2029-2030",
                            ].map((y) => (
                              <MenuItem key={y} value={y}>
                                {y}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            select
                            label="Class"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            value={row.class}
                            onChange={(e) => {
                              const u = [...enrollmentRows];
                              u[rowIndex].class = e.target.value;
                              setEnrollmentRows(u);
                            }}
                          >
                            {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                              <MenuItem key={c} value={c}>
                                {c}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            select
                            label="Section"
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            value={row.section}
                            onChange={(e) => {
                              const u = [...enrollmentRows];
                              u[rowIndex].section = e.target.value;
                              setEnrollmentRows(u);
                            }}
                          >
                            {["A", "B", "C"].map((s) => (
                              <MenuItem key={s} value={s}>
                                {s}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Sanctioned Capacity"
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                            size="small"
                            value={row.sanctionedCapacity}
                            onChange={(e) => {
                              const u = [...enrollmentRows];
                              u[rowIndex].sanctionedCapacity = e.target.value;
                              setEnrollmentRows(u);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Current Enrollment"
                            type="number"
                            inputProps={{ min: 0 }}
                            fullWidth
                            size="small"
                            value={row.currentEnrollment}
                            onChange={(e) => {
                              const u = [...enrollmentRows];
                              u[rowIndex].currentEnrollment = e.target.value;
                              setEnrollmentRows(u);
                            }}
                          />
                        </Grid>
                        {/* ── CATEGORY BREAKDOWN ── */}
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              border: "1px solid #bbdefb",
                              borderRadius: 2,
                              p: 2,
                              background: "#f0f7ff",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "#1976d2",
                                mb: 2,
                                fontSize: 14,
                              }}
                            >
                              📊 Student Category Breakdown
                            </Typography>

                            {(() => {
                              const categoryConfig = [
                                {
                                  key: "ST",
                                  label: "ST",
                                  group: "I",
                                  pct: "80%",
                                  color: "#1976d2",
                                  hasState: true,
                                  notApplicable: false,
                                  expected: {
                                    Block: 24,
                                    District: 15,
                                    State: 9,
                                  },
                                },
                                {
                                  key: "PVTG",
                                  label: "PVTG",
                                  group: "II",
                                  pct: "5%",
                                  color: "#7b1fa2",
                                  hasState: false,
                                  notApplicable: true,
                                  expected: { Block: 0, District: 0, State: 0 },
                                },
                                {
                                  key: "DNT_NT_SNT",
                                  label: "DNT/NT/SNT",
                                  group: "III",
                                  pct: "5%",
                                  color: "#2e7d32",
                                  hasState: false,
                                  notApplicable: true,
                                  expected: { Block: 0, District: 0, State: 0 },
                                },
                                {
                                  key: "LandDonor",
                                  label: "Land Donor",
                                  group: "IV",
                                  pct: "3%",
                                  color: "#00838f",
                                  hasState: false,
                                  notApplicable: false,
                                  expected: { Block: 1, District: 1, State: 0 },
                                },
                              ];
                              const cat4Config = [
                                {
                                  key: "LWE_Covid",
                                  label: "LWE/Covid/Insurgency",
                                  subLabel: "V a)",
                                },
                                {
                                  key: "Widow",
                                  label: "Children of Widows",
                                  subLabel: "V b)",
                                },
                                {
                                  key: "Divyang",
                                  label: "Divyang/Orphan",
                                  subLabel: "V c)",
                                },
                              ];
                              const levels = ["Block", "District", "State"];

                              const handleChange = (catKey, level, value) => {
                                const u = [...enrollmentRows];
                                if (!u[rowIndex].categoryBreakdown)
                                  u[rowIndex].categoryBreakdown = {};
                                if (!u[rowIndex].categoryBreakdown[catKey])
                                  u[rowIndex].categoryBreakdown[catKey] = {};
                                u[rowIndex].categoryBreakdown[catKey][level] =
                                  value;
                                setEnrollmentRows(u);
                              };

                              const categoryKeys = [
                                "ST",
                                "PVTG",
                                "DNT_NT_SNT",
                                "LWE_Covid",
                                "Widow",
                                "Divyang",
                                "LandDonor",
                              ];
                              const categoryLabels = [
                                "ST",
                                "PVTG",
                                "DNT/NT/SNT",
                                "LWE/Covid",
                                "Widow",
                                "Divyang/Orphan",
                                "Land Donor",
                              ];
                              const colors = [
                                "#1976d2",
                                "#7b1fa2",
                                "#2e7d32",
                                "#e65100",
                                "#f57c00",
                                "#c62828",
                                "#00838f",
                              ];
                              const breakdown = row.categoryBreakdown || {};

                              const getCatTotal = (key) => {
                                const bd = breakdown[key] || {};
                                return levels.reduce(
                                  (s, l) => s + Number(bd[l] || 0),
                                  0,
                                );
                              };
                              const total = categoryKeys.reduce(
                                (sum, key) => sum + getCatTotal(key),
                                0,
                              );

                              return (
                                <>
                                  <Grid container spacing={2}>
                                    {/* ── Cat I, II, III, V ── */}
                                    {categoryConfig.map((cat) => {
                                      const bd = breakdown[cat.key] || {};
                                      const block = Number(bd.Block || 0);
                                      const district = Number(bd.District || 0);
                                      const state = Number(bd.State || 0);
                                      const rowTotal = block + district + state;
                                      const seatsOk =
                                        rowTotal === 0 ||
                                        (block === cat.expected.Block &&
                                          district === cat.expected.District &&
                                          state === cat.expected.State);

                                      return (
                                        <Grid item xs={12} md={6} key={cat.key}>
                                          <Box
                                            sx={{
                                              border: `1px solid ${cat.notApplicable ? "#e0e0e0" : cat.color + "44"}`,
                                              borderRadius: 2,
                                              p: 1.5,
                                              background: cat.notApplicable
                                                ? "#f5f5f5"
                                                : "#fff",
                                            }}
                                          >
                                            {/* Header */}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 1.5,
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: "50%",
                                                  background: cat.notApplicable
                                                    ? "#bdbdbd"
                                                    : cat.color,
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: 13,
                                                  fontWeight: 700,
                                                  color: cat.notApplicable
                                                    ? "#9e9e9e"
                                                    : cat.color,
                                                }}
                                              >
                                                {cat.label}
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontSize: 11,
                                                  color: "#888",
                                                }}
                                              >
                                                (Cat {cat.group} · {cat.pct})
                                              </Typography>
                                              {/* ← N/A badge */}
                                              {cat.notApplicable && (
                                                <Box
                                                  sx={{
                                                    ml: "auto",
                                                    px: 1,
                                                    py: 0.2,
                                                    background: "#eeeeee",
                                                    borderRadius: 1,
                                                    border: "1px solid #bdbdbd",
                                                  }}
                                                >
                                                  <Typography
                                                    sx={{
                                                      fontSize: 10,
                                                      fontWeight: 700,
                                                      color: "#757575",
                                                    }}
                                                  >
                                                    N/A — Not applicable in
                                                    Assam
                                                  </Typography>
                                                </Box>
                                              )}
                                            </Box>

                                            {/* Block / District / State — all disabled if N/A */}
                                            <Grid container spacing={1}>
                                              {levels.map((level) => (
                                                <Grid item xs={4} key={level}>
                                                  <TextField
                                                    label={level}
                                                    type="number"
                                                    fullWidth
                                                    size="small"
                                                    disabled={
                                                      cat.notApplicable ||
                                                      (level === "State" &&
                                                        !cat.hasState)
                                                    }
                                                    value={
                                                      cat.notApplicable
                                                        ? "0"
                                                        : bd[level] || ""
                                                    }
                                                    helperText={
                                                      cat.notApplicable
                                                        ? "Not applicable"
                                                        : level === "State" &&
                                                            !cat.hasState
                                                          ? "0 (N/A)"
                                                          : `Expected: ${cat.expected[level]}`
                                                    }
                                                    onChange={(e) => {
                                                      if (cat.notApplicable)
                                                        return; // guard
                                                      handleChange(
                                                        cat.key,
                                                        level,
                                                        e.target.value,
                                                      );
                                                    }}
                                                  />
                                                </Grid>
                                              ))}
                                            </Grid>

                                            {/* Validation — skip for N/A */}
                                            {!cat.notApplicable &&
                                              rowTotal > 0 && (
                                                <Typography
                                                  sx={{
                                                    fontSize: 11,
                                                    mt: 1,
                                                    fontWeight: 600,
                                                    color: seatsOk
                                                      ? "#2e7d32"
                                                      : "#e65100",
                                                  }}
                                                >
                                                  {seatsOk
                                                    ? `✅ Matches guideline · Total: ${rowTotal}`
                                                    : `⚠️ Expected B:${cat.expected.Block} D:${cat.expected.District} S:${cat.expected.State} · Got B:${block} D:${district} S:${state}`}
                                                </Typography>
                                              )}
                                          </Box>
                                        </Grid>
                                      );
                                    })}

                                    {/* ── Cat IV grouped ── */}
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          border: "1px dashed #e65100",
                                          borderRadius: 2,
                                          p: 1.5,
                                          background: "#fff3e0",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: "#e65100",
                                            mb: 1.5,
                                          }}
                                        >
                                          Category IV — Shared Pool · 7%
                                          &nbsp;|&nbsp; Expected: Block=2,
                                          District=2, State=0
                                        </Typography>

                                        <Grid container spacing={2}>
                                          {cat4Config.map((cat) => {
                                            const bd = breakdown[cat.key] || {};
                                            return (
                                              <Grid
                                                item
                                                xs={12}
                                                md={4}
                                                key={cat.key}
                                              >
                                                <Box
                                                  sx={{
                                                    background: "#fff",
                                                    borderRadius: 1.5,
                                                    p: 1.5,
                                                    border: "1px solid #ffe0b2",
                                                  }}
                                                >
                                                  <Typography
                                                    sx={{
                                                      fontSize: 12,
                                                      fontWeight: 600,
                                                      color: "#e65100",
                                                      mb: 1,
                                                    }}
                                                  >
                                                    {cat.subLabel} {cat.label}
                                                  </Typography>
                                                  <Grid container spacing={1}>
                                                    {levels.map((level) => (
                                                      <Grid
                                                        item
                                                        xs={4}
                                                        key={level}
                                                      >
                                                        <TextField
                                                          label={level}
                                                          type="number"
                                                          fullWidth
                                                          size="small"
                                                          disabled={
                                                            level === "State"
                                                          }
                                                          value={
                                                            bd[level] || ""
                                                          }
                                                          helperText={
                                                            level === "State"
                                                              ? "0 (N/A)"
                                                              : ""
                                                          }
                                                          onChange={(e) =>
                                                            handleChange(
                                                              cat.key,
                                                              level,
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </Grid>
                                                    ))}
                                                  </Grid>
                                                </Box>
                                              </Grid>
                                            );
                                          })}
                                        </Grid>

                                        {/* Cat IV pool check */}
                                        {(() => {
                                          const cat4Total = [
                                            "LWE_Covid",
                                            "Widow",
                                            "Divyang",
                                          ].reduce(
                                            (sum, k) =>
                                              sum +
                                              levels.reduce(
                                                (s, l) =>
                                                  s +
                                                  Number(
                                                    breakdown[k]?.[l] || 0,
                                                  ),
                                                0,
                                              ),
                                            0,
                                          );
                                          const cat4Max = Math.round(
                                            (row.sanctionedCapacity || 60) *
                                              0.07,
                                          );
                                          if (cat4Total === 0) return null;
                                          return (
                                            <Typography
                                              sx={{
                                                fontSize: 11,
                                                fontWeight: 600,
                                                mt: 1.5,
                                                color:
                                                  cat4Total > cat4Max
                                                    ? "#c62828"
                                                    : "#2e7d32",
                                              }}
                                            >
                                              {cat4Total > cat4Max
                                                ? `⚠️ Cat V total ${cat4Total} exceeds pool of ${cat4Max} seats`
                                                : `✅ Cat V pool: ${cat4Total} / ${cat4Max} seats used`}
                                            </Typography>
                                          );
                                        })()}
                                      </Box>
                                    </Grid>
                                  </Grid>

                                  {/* ── VISUAL BAR ── */}
                                  {total > 0 && (
                                    <Box mt={2}>
                                      {/* Progress Bar */}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          height: 28,
                                          borderRadius: 2,
                                          overflow: "hidden",
                                          mb: 1.5,
                                        }}
                                      >
                                        {categoryKeys.map((key, i) => {
                                          const val = getCatTotal(key);
                                          const pct =
                                            total > 0 ? (val / total) * 100 : 0;
                                          if (pct === 0) return null;
                                          return (
                                            <Box
                                              key={key}
                                              sx={{
                                                width: `${pct}%`,
                                                background: colors[i],
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "width 0.4s",
                                              }}
                                            >
                                              {pct > 8 && (
                                                <Typography
                                                  sx={{
                                                    fontSize: 10,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                  }}
                                                >
                                                  {Math.round(pct)}%
                                                </Typography>
                                              )}
                                            </Box>
                                          );
                                        })}
                                      </Box>

                                      {/* Legend */}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 1.5,
                                        }}
                                      >
                                        {categoryKeys.map((key, i) => {
                                          const val = getCatTotal(key);
                                          if (!val) return null;
                                          return (
                                            <Box
                                              key={key}
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.8,
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: "50%",
                                                  background: colors[i],
                                                  flexShrink: 0,
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: 12,
                                                  color: "#374151",
                                                }}
                                              >
                                                {categoryLabels[i]}:{" "}
                                                <strong>{val}</strong>
                                              </Typography>
                                            </Box>
                                          );
                                        })}
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            ml: "auto",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 12,
                                              fontWeight: 700,
                                              color: "#1976d2",
                                            }}
                                          >
                                            Total: {total}
                                          </Typography>
                                          {row.currentEnrollment &&
                                            Number(row.currentEnrollment) > 0 &&
                                            total >
                                              Number(row.currentEnrollment) && (
                                              <Typography
                                                sx={{
                                                  fontSize: 11,
                                                  color: "#c62828",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                ⚠️ Exceeds enrollment (
                                                {row.currentEnrollment})
                                              </Typography>
                                            )}
                                        </Box>
                                      </Box>
                                    </Box>
                                  )}
                                </>
                              );
                            })()}
                          </Box>
                        </Grid>
                      </Grid>
                      {/* ── ACADEMIC PERFORMANCE ── */}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                      >
                        Academic Performance
                      </Typography>

                      {/* ── CLASS 6, 7, 8, 9 — Annual Exam ── */}
                      {["6", "7", "8", "9"].includes(row.class) && (
                        <Box
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 1,
                            p: 2,
                            mb: 3,
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#374151", mb: 2 }}
                          >
                            Annual Exam Performance — Class {row.class}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Students Appeared"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.appeared}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].appeared = e.target.value;

                                  const appeared = Number(e.target.value || 0);
                                  const passed = Number(
                                    u[rowIndex].passed || 0,
                                  );

                                  const percent =
                                    appeared > 0
                                      ? (passed / appeared) * 100
                                      : 0;

                                  u[rowIndex].passPercent = percent.toFixed(2);
                                  u[rowIndex].marks =
                                    getMarksFromPercentage(percent);

                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Students Passed"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.passed}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].passed = e.target.value;

                                  const passed = Number(e.target.value || 0);
                                  const appeared = Number(
                                    u[rowIndex].appeared || 0,
                                  );

                                  const percent =
                                    appeared > 0
                                      ? (passed / appeared) * 100
                                      : 0;

                                  u[rowIndex].passPercent = percent.toFixed(2);
                                  u[rowIndex].marks =
                                    getMarksFromPercentage(percent);

                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Pass %"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.passPercent || ""}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      {/* ── CLASS 10 — Board Exam ── */}
                      {row.class === "10" && (
                        <Box
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 1,
                            p: 2,
                            mb: 3,
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#374151", mb: 2 }}
                          >
                            Board Exam Performance — Class 10
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Students Appeared"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.appeared}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].appeared = e.target.value;

                                  const appeared = Number(e.target.value || 0);
                                  const passed = Number(
                                    u[rowIndex].passed || 0,
                                  );

                                  const percent =
                                    appeared > 0
                                      ? (passed / appeared) * 100
                                      : 0;

                                  u[rowIndex].passPercent = percent.toFixed(2);
                                  u[rowIndex].marks =
                                    getMarksFromPercentage(percent);

                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Students Passed"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.passed}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].passed = e.target.value;

                                  const passed = Number(e.target.value || 0);
                                  const appeared = Number(
                                    u[rowIndex].appeared || 0,
                                  );

                                  const percent =
                                    appeared > 0
                                      ? (passed / appeared) * 100
                                      : 0;

                                  u[rowIndex].passPercent = percent.toFixed(2);
                                  u[rowIndex].marks =
                                    getMarksFromPercentage(percent);

                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Pass %"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.passPercent || ""}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Marks Obtained (out of 10)"
                                fullWidth
                                size="small"
                                value={row.marks || ""}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Top Scorer Name"
                                fullWidth
                                size="small"
                                value={row.topScorer || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].topScorer = e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Top Score (%)"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.topScore || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].topScore = e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: "#374151", mb: 1 }}
                            >
                              Marking Criteria (Out of 10)
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Pass %</TableCell>
                                  <TableCell>Marks</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {[
                                  { range: "100%", marks: 10 },
                                  { range: "90–99%", marks: 9 },
                                  { range: "80–89%", marks: 8 },
                                  { range: "70–79%", marks: 7 },
                                  { range: "60–69%", marks: 6 },
                                  { range: "50–59%", marks: 5 },
                                  { range: "40–49%", marks: 4 },
                                  { range: "33–39%", marks: 3 },
                                  { range: "Below 33%", marks: 0 },
                                ].map((row) => (
                                  <TableRow key={row.range}>
                                    <TableCell>{row.range}</TableCell>
                                    <TableCell>{row.marks}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Box>
                      )}
                      {/* ── CLASS 11 & 12 — Board Exam by Stream ── */}
                      {["11", "12"].includes(row.class) && (
                        <Box
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 1,
                            p: 2,
                            mb: 3,
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#374151", mb: 2 }}
                          >
                            Board Exam Performance — Class {row.class}{" "}
                            (Stream-wise)
                          </Typography>

                          {/* Stream selector */}
                          <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                select
                                label="Stream"
                                fullWidth
                                size="small"
                                sx={{ minWidth: 220 }}
                                value={row.stream || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].stream = e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              >
                                {["Science", "Commerce", "Arts"].map((s) => (
                                  <MenuItem key={s} value={s}>
                                    {s}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Students Appeared"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.appeared}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].appeared = e.target.value;
                                  const appeared = Number(e.target.value || 0);
                                  const passed = Number(
                                    u[rowIndex].passed || 0,
                                  );
                                  const passPercent =
                                    appeared > 0
                                      ? ((passed / appeared) * 100).toFixed(2)
                                      : "";
                                  u[rowIndex].passPercent = passPercent;
                                  u[rowIndex].marks = getMarksFromPercentage(
                                    Number(passPercent),
                                  ); // ✅ fixed
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Students Passed"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.passed}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].passed = e.target.value;
                                  const passed = Number(e.target.value || 0);
                                  const appeared = Number(
                                    u[rowIndex].appeared || 0,
                                  );
                                  const passPercent =
                                    appeared > 0
                                      ? ((passed / appeared) * 100).toFixed(2)
                                      : "";
                                  u[rowIndex].passPercent = passPercent;
                                  u[rowIndex].marks = getMarksFromPercentage(
                                    Number(passPercent),
                                  ); // ✅ fixed
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Pass %"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.passPercent || ""}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Marks Obtained (out of 10)"
                                fullWidth
                                size="small"
                                value={row.marks || ""}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Top Scorer Name"
                                fullWidth
                                size="small"
                                value={row.topScorer || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].topScorer = e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Top Score (%)"
                                type="number"
                                fullWidth
                                size="small"
                                value={row.topScore || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].topScore = e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: "#374151", mb: 1 }}
                            >
                              Marking Criteria (Out of 10)
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Pass %</TableCell>
                                  <TableCell>Marks</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {[
                                  { range: "100%", marks: 10 },
                                  { range: "90–99%", marks: 9 },
                                  { range: "80–89%", marks: 8 },
                                  { range: "70–79%", marks: 7 },
                                  { range: "60–69%", marks: 6 },
                                  { range: "50–59%", marks: 5 },
                                  { range: "40–49%", marks: 4 },
                                  { range: "33–39%", marks: 3 },
                                  { range: "Below 33%", marks: 0 },
                                ].map((row) => (
                                  <TableRow key={row.range}>
                                    <TableCell>{row.range}</TableCell>
                                    <TableCell>{row.marks}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Box>
                      )}
                      {/* Fallback if no class selected yet */}
                      {!row.class && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#94a3b8", mb: 3, fontStyle: "italic" }}
                        >
                          Please select a Class above to fill Academic
                          Performance.
                        </Typography>
                      )}

                      {/* ── DROPOUT DETAILS ── */}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                      >
                        Dropout Details
                      </Typography>
                      {row.dropouts.map((dropout, dIndex) => (
                        <Box
                          key={dIndex}
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            background: "#f8fafc",
                          }}
                        >
                          {/* ── ROW 1: Student Info ── */}
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "#64748b",
                              mb: 1,
                              display: "block",
                            }}
                          >
                            Student Information
                          </Typography>
                          <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Student Name"
                                fullWidth
                                size="small"
                                value={dropout.studentName}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].studentName =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                label="Roll No"
                                fullWidth
                                size="small"
                                value={dropout.rollNo}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].rollNo =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                label="Reason for Dropout"
                                fullWidth
                                size="small"
                                multiline
                                rows={3}
                                placeholder="Enter reason for dropout..."
                                value={dropout.reason}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].reason =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                          </Grid>

                          {/* ── ROW 2: Guardian Info ── */}
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "#64748b",
                              mb: 1,
                              display: "block",
                            }}
                          >
                            Guardian Information
                          </Typography>
                          <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} sm={6} md={6}>
                              <TextField
                                label="Guardian Name"
                                fullWidth
                                size="small"
                                value={dropout.guardianName || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].guardianName =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                              <TextField
                                label="Guardian Contact No"
                                fullWidth
                                size="small"
                                value={dropout.guardianContactNo}
                                inputProps={{
                                  maxLength: 10,
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    ![
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                      "Tab",
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                error={
                                  dropout.guardianContactNo &&
                                  dropout.guardianContactNo.toString()
                                    .length !== 10
                                }
                                helperText={
                                  dropout.guardianContactNo &&
                                  dropout.guardianContactNo.toString()
                                    .length !== 10
                                    ? "Must be exactly 10 digits"
                                    : ""
                                }
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[
                                    dIndex
                                  ].guardianContactNo = e.target.value;
                                  setEnrollmentRows(u);
                                }}
                              />
                            </Grid>
                          </Grid>

                          {/* ── ROW 3: Address Info ── */}
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "#64748b",
                              mb: 1,
                              display: "block",
                            }}
                          >
                            Address Details
                          </Typography>
                          <Grid container spacing={2}>
                            {/* PIN Code - should be positive number */}
                            <Grid item xs={12} sm={6} md={2}>
                              <TextField
                                label="PIN Code"
                                fullWidth
                                size="small"
                                value={dropout.pinCode || ""}
                                type="number"
                                inputProps={{
                                  min: 0,
                                  maxLength: 6,
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    ![
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                      "Tab",
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }
                                  if (e.key === "-" || e.key === "e")
                                    e.preventDefault();
                                }}
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  // Only allow positive numbers
                                  if (Number(val) >= 0 || val === "") {
                                    const u = [...enrollmentRows];
                                    u[rowIndex].dropouts[dIndex].pinCode = val;
                                    setEnrollmentRows(u);

                                    if (val.length === 6) {
                                      try {
                                        const res = await fetch(
                                          `https://api.postalpincode.in/pincode/${val}`,
                                        );
                                        const data = await res.json();
                                        if (data[0].Status === "Success") {
                                          const po = data[0].PostOffice[0];
                                          const u2 = [...enrollmentRows];
                                          u2[rowIndex].dropouts[
                                            dIndex
                                          ].district = po.District;
                                          u2[rowIndex].dropouts[
                                            dIndex
                                          ].postOffice = po.Name;
                                          u2[rowIndex].dropouts[
                                            dIndex
                                          ].gramPanchayat = po.Block;
                                          u2[rowIndex].dropouts[
                                            dIndex
                                          ].village = po.Village || "";
                                          setEnrollmentRows(u2);
                                        }
                                      } catch (err) {
                                        console.error(
                                          "Pincode fetch error:",
                                          err,
                                        );
                                      }
                                    }
                                  }
                                }}
                                error={
                                  dropout.pinCode &&
                                  (Number(dropout.pinCode) < 0 ||
                                    dropout.pinCode.toString().length !== 6)
                                }
                                helperText={
                                  dropout.pinCode && Number(dropout.pinCode) < 0
                                    ? "PIN Code cannot be negative"
                                    : dropout.pinCode &&
                                        dropout.pinCode.toString().length !== 6
                                      ? "PIN Code must be 6 digits"
                                      : ""
                                }
                              />
                            </Grid>

                            {/* District - text field, no number validation  */}
                            <Grid item xs={12} sm={6} md={2}>
                              <TextField
                                label="District"
                                fullWidth
                                size="small"
                                value={dropout.district || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].district =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                                onKeyDown={(e) => {
                                  if (/^[0-9]$/.test(e.key)) e.preventDefault();
                                }}
                              />
                            </Grid>

                            {/* Post Office - text field */}
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                label="Post Office"
                                fullWidth
                                size="small"
                                value={dropout.postOffice || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].postOffice =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                                onKeyDown={(e) => {
                                  if (/^[0-9]$/.test(e.key)) e.preventDefault();
                                }}
                              />
                            </Grid>

                            {/* Gram Panchayat - text field */}
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                label="Gram Panchayat"
                                fullWidth
                                size="small"
                                value={dropout.gramPanchayat || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].gramPanchayat =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                                onKeyDown={(e) => {
                                  if (/^[0-9]$/.test(e.key)) e.preventDefault();
                                }}
                              />
                            </Grid>

                            {/* Village - text field, should NOT accept numbers */}
                            <Grid item xs={12} sm={6} md={2}>
                              <TextField
                                label="Village"
                                fullWidth
                                size="small"
                                value={dropout.village || ""}
                                onChange={(e) => {
                                  const u = [...enrollmentRows];
                                  u[rowIndex].dropouts[dIndex].village =
                                    e.target.value;
                                  setEnrollmentRows(u);
                                }}
                                onKeyDown={(e) => {
                                  // Prevent number input
                                  if (/^[0-9]$/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                // Optional: Add error for numbers
                                error={/\d/.test(dropout.village || "")}
                                helperText={
                                  /\d/.test(dropout.village || "")
                                    ? "Village name should not contain numbers"
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}

                      <Box mb={3}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const u = [...enrollmentRows];
                            u[rowIndex].dropouts.push({
                              studentName: "",
                              rollNo: "",
                              reason: "",
                              guardianName: "",
                              guardianContactNo: "",
                              pinCode: "",
                              district: "",
                              postOffice: "",
                              gramPanchayat: "",
                              village: "",
                            });
                            setEnrollmentRows(u);
                          }}
                        >
                          + Add Dropout
                        </Button>
                      </Box>

                      {/* ── MIGRATION DETAILS ── */}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                      >
                        Migration Details
                      </Typography>
                      {row.migrations.map((migration, mIndex) => (
                        <Grid container spacing={2} mb={1} key={mIndex}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Student Name"
                              fullWidth
                              size="small"
                              value={migration.studentName}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].migrations[mIndex].studentName =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                              onKeyDown={(e) => {
                                if (/^[0-9]$/.test(e.key)) e.preventDefault();
                              }}
                              error={/\d/.test(migration.studentName || "")}
                              helperText={
                                /\d/.test(migration.studentName || "")
                                  ? "Student name should not contain numbers"
                                  : ""
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Migrated From"
                              fullWidth
                              size="small"
                              value={migration.migratedFrom}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].migrations[mIndex].migratedFrom =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                              onKeyDown={(e) => {
                                if (/^[0-9]$/.test(e.key)) e.preventDefault();
                              }}
                              error={/\d/.test(migration.migratedFrom || "")}
                              helperText={
                                /\d/.test(migration.migratedFrom || "")
                                  ? "Location should not contain numbers"
                                  : ""
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Transferred To"
                              fullWidth
                              size="small"
                              value={migration.transferredTo}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].migrations[mIndex].transferredTo =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                              onKeyDown={(e) => {
                                if (/^[0-9]$/.test(e.key)) e.preventDefault();
                              }}
                              error={/\d/.test(migration.transferredTo || "")}
                              helperText={
                                /\d/.test(migration.transferredTo || "")
                                  ? "Location should not contain numbers"
                                  : ""
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Reason"
                              multiline
                              rows={4}
                              fullWidth
                              size="small"
                              value={migration.reason}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].migrations[mIndex].reason =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                              onKeyDown={(e) => {
                                if (/^[0-9]$/.test(e.key)) e.preventDefault();
                              }}
                            />
                          </Grid>
                        </Grid>
                      ))}
                      <Box mb={3}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const u = [...enrollmentRows];
                            u[rowIndex].migrations.push({
                              studentName: "",
                              migratedFrom: "",
                              transferredTo: "",
                              reason: "",
                            });
                            setEnrollmentRows(u);
                          }}
                        >
                          + Add Migration
                        </Button>
                      </Box>

                      {/* ── STUDENT ACHIEVEMENTS ── */}
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                      >
                        Student Special Achievements
                      </Typography>
                      {row.achievements.map((achievement, aIndex) => (
                        <Grid container spacing={2} mb={1} key={aIndex}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Student Name"
                              fullWidth
                              size="small"
                              value={achievement.studentName}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].achievements[aIndex].studentName =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Event Name"
                              fullWidth
                              size="small"
                              value={achievement.eventName}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].achievements[aIndex].eventName =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              select
                              label="Level / Exam"
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                              value={achievement.level}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].achievements[aIndex].level =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                            >
                              {achievementLevels.map((level) => (
                                <MenuItem key={level} value={level}>
                                  {level}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Recognition"
                              fullWidth
                              size="small"
                              value={achievement.recognition}
                              onChange={(e) => {
                                const u = [...enrollmentRows];
                                u[rowIndex].achievements[aIndex].recognition =
                                  e.target.value;
                                setEnrollmentRows(u);
                              }}
                            />
                          </Grid>
                        </Grid>
                      ))}
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const u = [...enrollmentRows];
                            u[rowIndex].achievements.push({
                              studentName: "",
                              eventName: "",
                              level: "",
                              recognition: "",
                            });
                            setEnrollmentRows(u);
                          }}
                        >
                          + Add Achievement
                        </Button>
                        {row.class === "12" && (
                          <Box mt={3}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                            >
                              Competitive Examination Selection with Admission
                            </Typography>

                            <Grid container spacing={2}>
                              {/* Exam Name */}
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="Name of Examination"
                                  fullWidth
                                  size="small"
                                  value={row.competitiveExam?.examName || ""}
                                  onChange={(e) => {
                                    const updatedRows = [...enrollmentRows];

                                    updatedRows[rowIndex] = {
                                      ...updatedRows[rowIndex],
                                      competitiveExam: {
                                        ...(updatedRows[rowIndex]
                                          .competitiveExam || {}),
                                        examName: e.target.value,
                                      },
                                    };

                                    setEnrollmentRows(updatedRows);
                                  }}
                                />
                              </Grid>

                              {/* Qualified */}
                              <Grid item xs={12} md={2}>
                                <TextField
                                  label="No. of Students Qualified"
                                  fullWidth
                                  size="small"
                                  value={row.competitiveExam?.qualified || ""}
                                  onChange={(e) => {
                                    const updatedRows = [...enrollmentRows];

                                    updatedRows[rowIndex] = {
                                      ...updatedRows[rowIndex],
                                      competitiveExam: {
                                        ...(updatedRows[rowIndex]
                                          .competitiveExam || {}),
                                        qualified: e.target.value,
                                      },
                                    };

                                    setEnrollmentRows(updatedRows);
                                  }}
                                />
                              </Grid>

                              {/* Admission */}
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="Students Secured Admission"
                                  fullWidth
                                  size="small"
                                  value={row.competitiveExam?.admission || ""}
                                  onChange={(e) => {
                                    const val = Number(e.target.value || 0);

                                    let marks = 0;
                                    if (val >= 30) marks = 7;
                                    else if (val >= 20) marks = 5;
                                    else if (val >= 10) marks = 3;
                                    else if (val > 0) marks = 1;

                                    const updatedRows = [...enrollmentRows];

                                    updatedRows[rowIndex] = {
                                      ...updatedRows[rowIndex],
                                      competitiveExam: {
                                        ...(updatedRows[rowIndex]
                                          .competitiveExam || {}),
                                        admission: e.target.value,
                                        marks: marks,
                                      },
                                    };

                                    setEnrollmentRows(updatedRows);
                                  }}
                                />
                              </Grid>

                              {/* Total */}
                              <Grid item xs={12} md={2}>
                                <TextField
                                  label="Total"
                                  fullWidth
                                  size="small"
                                  value={row.competitiveExam?.total || ""}
                                  onChange={(e) => {
                                    const updatedRows = [...enrollmentRows];

                                    updatedRows[rowIndex] = {
                                      ...updatedRows[rowIndex],
                                      competitiveExam: {
                                        ...(updatedRows[rowIndex]
                                          .competitiveExam || {}),
                                        total: e.target.value,
                                      },
                                    };

                                    setEnrollmentRows(updatedRows);
                                  }}
                                />
                              </Grid>

                              {/* Marks */}
                              <Grid item xs={12} md={2}>
                                <TextField
                                  label="Marks (out of 7)"
                                  fullWidth
                                  size="small"
                                  value={row.competitiveExam?.marks || ""}
                                  InputProps={{ readOnly: true }}
                                />
                              </Grid>
                            </Grid>

                            {/* Marking Table */}
                            <Box
                              mt={2}
                              display="flex"
                              justifyContent="flex-end"
                            >
                              <TableContainer
                                component={Paper}
                                sx={{ maxWidth: 400 }}
                              >
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>
                                        <strong>Students with Admission</strong>
                                      </TableCell>
                                      <TableCell>
                                        <strong>Marks</strong>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {[
                                      { condition: "30 or above", marks: 7 },
                                      { condition: "20 or above", marks: 5 },
                                      { condition: "10 or above", marks: 3 },
                                      { condition: "Below 10", marks: 1 },
                                    ].map((item, i) => (
                                      <TableRow key={i}>
                                        <TableCell>{item.condition}</TableCell>
                                        <TableCell>{item.marks}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}

                {/* Add new Class/Section Block */}
                <Box mb={4}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setEnrollmentRows([
                        ...enrollmentRows,
                        {
                          academicYear: "",
                          class: "",
                          section: "",
                          sanctionedCapacity: "",
                          currentEnrollment: "",
                          category: "",
                          boardClass: "",
                          appeared: "",
                          passed: "",
                          passPercent: "",
                          above75: "",
                          below50: "",
                          above75Error: "",
                          stream: "",
                          distinctions: "",
                          topScorer: "",
                          topScore: "",
                          categoryBreakdown: {
                            ST: "",
                            PVTG: "",
                            "DNT/NT/SNT": "",
                            Orphan: "",
                            Divyang: "",
                          },
                          monthlyAttendance: [],
                          dropouts: [
                            {
                              studentName: "",
                              rollNo: "",
                              reason: "",
                              guardianName: "",
                              guardianContactNo: "",
                              pinCode: "",
                              district: "",
                              postOffice: "",
                              gramPanchayat: "",
                              village: "",
                            },
                          ],
                          migrations: [
                            {
                              studentName: "",
                              migratedFrom: "",
                              transferredTo: "",
                              reason: "",
                            },
                          ],
                          achievements: [
                            {
                              studentName: "",
                              eventName: "",
                              level: "",
                              recognition: "",
                            },
                          ],
                          competitiveExam: {
                            examName: "",
                            qualified: "",
                            admission: "",
                            total: "",
                            marks: "",
                          },
                        },
                      ])
                    }
                  >
                    + Add Class / Section
                  </Button>
                </Box>
              </>
            )}

            {currentStep === 5 && (
              <>
                {/* ================= EXTRA CURRICULAR ACTIVITIES SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Extra Curricular Activities
                    </Typography>
                  </Grid>
                </Grid>

                {/* ✅ MAP — only row-specific fields */}
                {extraCurricularRows.map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      padding: 3,
                      mb: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Grid container spacing={2}>
                      {/* Academic Year */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label="Academic Year"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.academicYear}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].academicYear = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        >
                          {[
                            "2024-2025",
                            "2025-2026",
                            "2026-2027",
                            "2027-2028",
                            "2028-2029",
                            "2029-2030",
                          ].map((y) => (
                            <MenuItem key={y} value={y}>
                              {y}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Class */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label="Class"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.class}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].class = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        >
                          {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                            <MenuItem key={c} value={c}>
                              {c}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Section */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label="Section"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.section}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].section = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        >
                          {["A", "B", "C"].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Name of Program */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Name of the Program"
                          fullWidth
                          size="small"
                          value={row.initiativeName}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].initiativeName = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        />
                      </Grid>

                      {/* Collaborating Partner */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Collaborating Partner"
                          fullWidth
                          size="small"
                          value={row.collaboratingPartner}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].collaboratingPartner = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        />
                      </Grid>

                      {/* Areas of Development */}
                      <Grid item xs={12} sm={6} md={6}>
                        <Grid container spacing={1}>
                          {/* Dropdown */}
                          <Grid
                            item
                            xs={row.areasOfDevelopment === "Others" ? 6 : 12}
                          >
                            <TextField
                              select
                              label="Areas of Development"
                              fullWidth
                              size="small"
                              sx={{ minWidth: 220 }}
                              value={row.areasOfDevelopment || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const u = [...extraCurricularRows];

                                u[index].areasOfDevelopment = value;

                                if (value !== "Others") {
                                  u[index].otherAreaOfDevelopment = "";
                                }

                                setExtraCurricularRows(u);
                              }}
                            >
                              {[
                                "Sports",
                                "Culture",
                                "Health & Wellness",
                                "Value Education",
                                "Kaushalya Skill Internship",
                                "Computer Skills",
                                "Personality Development",
                                "Excursions",
                                "Career Guidance",
                                "Exposure",
                                "Competitive Exam Training",
                                "Enhancing Learning Skills",
                                "Adventure Activities",
                                "STEM Learning",
                                "Innovation",
                                "Others",
                              ].map((area) => (
                                <MenuItem key={area} value={area}>
                                  {area}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          {row.areasOfDevelopment === "Others" && (
                            <Grid item xs={6}>
                              <TextField
                                label="Specify Other"
                                fullWidth
                                size="small"
                                sx={{ minWidth: 220 }}
                                value={row.otherAreaOfDevelopment || ""}
                                onChange={(e) => {
                                  const u = [...extraCurricularRows];
                                  u[index].otherAreaOfDevelopment =
                                    e.target.value;
                                  setExtraCurricularRows(u);
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>

                      {/* Description */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Description / Objectives"
                          fullWidth
                          size="small"
                          value={row.description}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].description = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        />
                      </Grid>

                      {/* Status */}
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label="Status"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.status}
                          onChange={(e) => {
                            const u = [...extraCurricularRows];
                            u[index].status = e.target.value;
                            setExtraCurricularRows(u);
                          }}
                        >
                          {[
                            "Active",
                            "In Progress",
                            "Completed",
                            "Planned",
                          ].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                {/* ✅ OUTSIDE MAP — Cultural Meet, NCC, RBVP, Criteria Table */}

                {/* ================= NATIONAL LEVEL CULTURAL MEET ================= */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: "1.5px solid #1a56a0",
                        borderRadius: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          2. Student Participation in National Level Cultural
                          Meet (5 Marks)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          background: "#fff",
                        }}
                      >
                        <Box sx={{ flex: "1 1 220px" }}>
                          <Controller
                            name="studentsParticipatedCulturalMeet"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                size="small"
                                label="Students Participated (Yes/No)"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                        {watch("studentsParticipatedCulturalMeet") ===
                          "Yes" && (
                          <Box sx={{ flex: "1 1 160px" }}>
                            <Controller
                              name="studentsParticipatedCount"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="No. of Students"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Box>
                        )}
                        <Box sx={{ flex: "1 1 220px" }}>
                          <Controller
                            name="studentsGotMedalCulturalMeet"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                size="small"
                                label="Students Got Rank/Medal (Yes/No)"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                        {watch("studentsGotMedalCulturalMeet") === "Yes" && (
                          <Box sx={{ flex: "1 1 160px" }}>
                            <Controller
                              name="studentsRankCount"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="No. of Students"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Box>
                        )}
                        {/* Marks Obtained */}
                        <Box
                          sx={{
                            flex: "1 1 160px",
                            display: "flex",
                            alignItems: "center",
                            background: "#f7faff",
                            border: "1px solid #c8d4e8",
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            gap: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              color: "#5a6a85",
                              fontWeight: 500,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Marks Obtained*
                          </Typography>
                          {(() => {
                            const p = watch("studentsParticipatedCulturalMeet");
                            const m = watch("studentsGotMedalCulturalMeet");
                            const val = p !== "Yes" ? 0 : m === "Yes" ? 5 : 3;
                            return (
                              <Typography
                                sx={{
                                  fontSize: "1.2rem",
                                  fontWeight: 500,
                                  ml: "auto",
                                  color:
                                    val === 5
                                      ? "#155724"
                                      : val === 3
                                        ? "#856404"
                                        : "#721c24",
                                }}
                              >
                                {val}
                              </Typography>
                            );
                          })()}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* ================= NCC & SCOUT GUIDE ================= */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: "1.5px solid #1a56a0",
                        borderRadius: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          3. NCC and Scout Guide in EMRS (5 Marks)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          background: "#fff",
                        }}
                      >
                        <Box sx={{ flex: "1 1 220px" }}>
                          <Controller
                            name="nccUnitRunning"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                size="small"
                                label="NCC Unit Running (Yes/No)"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                        {watch("nccUnitRunning") === "Yes" && (
                          <Box sx={{ flex: "1 1 160px" }}>
                            <Controller
                              name="nccStudentsCount"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="No. of NCC Students"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Box>
                        )}
                        <Box sx={{ flex: "1 1 220px" }}>
                          <Controller
                            name="scoutGuideRunning"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                size="small"
                                label="Scout and Guide Running (Yes/No)"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                        {watch("scoutGuideRunning") === "Yes" && (
                          <Box sx={{ flex: "1 1 160px" }}>
                            <Controller
                              name="scoutGuideStudentsCount"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="No. of Students"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Box>
                        )}
                        {/* Marks Obtained */}
                        <Box
                          sx={{
                            flex: "1 1 160px",
                            display: "flex",
                            alignItems: "center",
                            background: "#f7faff",
                            border: "1px solid #c8d4e8",
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            gap: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              color: "#5a6a85",
                              fontWeight: 500,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Marks Obtained*
                          </Typography>
                          {(() => {
                            const yes = [
                              watch("nccUnitRunning"),
                              watch("scoutGuideRunning"),
                            ].filter((v) => v === "Yes").length;
                            const val = yes === 2 ? 5 : yes === 1 ? 3 : 0;
                            return (
                              <Typography
                                sx={{
                                  fontSize: "1.2rem",
                                  fontWeight: 500,
                                  ml: "auto",
                                  color:
                                    val === 5
                                      ? "#155724"
                                      : val === 3
                                        ? "#856404"
                                        : "#721c24",
                                }}
                              >
                                {val}
                              </Typography>
                            );
                          })()}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* ================= RBVP / INSPIRE MANAK ================= */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: "1.5px solid #1a56a0",
                        borderRadius: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          4. Selection in RBVP / INSPIRE MANAK Award (5 Marks)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          background: "#fff",
                        }}
                      >
                        <Box sx={{ flex: "1 1 220px" }}>
                          <Controller
                            name="studentsSelectedRBVP"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                size="small"
                                label="Students Selected for RBVP (Yes/No)"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                        {watch("studentsSelectedRBVP") === "Yes" && (
                          <Box sx={{ flex: "1 1 160px" }}>
                            <Controller
                              name="rbvpStudentsCount"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="No. of Students"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Box>
                        )}
                        <Box sx={{ flex: "1 1 220px" }}>
                          <Controller
                            name="studentsSelectedInspireManak"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                size="small"
                                label="Students Selected for Inspire MANAK Award (Yes/No)"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            )}
                          />
                        </Box>
                        {watch("studentsSelectedInspireManak") === "Yes" && (
                          <Box sx={{ flex: "1 1 160px" }}>
                            <Controller
                              name="inspireStudentsCount"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="No. of Students"
                                  type="number"
                                  fullWidth
                                  size="small"
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Box>
                        )}
                        {/* Marks Obtained */}
                        <Box
                          sx={{
                            flex: "1 1 160px",
                            display: "flex",
                            alignItems: "center",
                            background: "#f7faff",
                            border: "1px solid #c8d4e8",
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            gap: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              color: "#5a6a85",
                              fontWeight: 500,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Marks Obtained*
                          </Typography>
                          {(() => {
                            const yes = [
                              watch("studentsSelectedRBVP"),
                              watch("studentsSelectedInspireManak"),
                            ].filter((v) => v === "Yes").length;
                            const val = yes === 2 ? 5 : yes === 1 ? 3 : 0;
                            return (
                              <Typography
                                sx={{
                                  fontSize: "1.2rem",
                                  fontWeight: 500,
                                  ml: "auto",
                                  color:
                                    val === 5
                                      ? "#155724"
                                      : val === 3
                                        ? "#856404"
                                        : "#721c24",
                                }}
                              >
                                {val}
                              </Typography>
                            );
                          })()}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* ================= SHARED MARKING CRITERIA (Points 2, 3 & 4) ================= */}
                <Grid container spacing={2} mb={4}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: "1.5px solid #1a56a0",
                        borderRadius: 0,
                        overflow: "hidden",
                        maxWidth: 440,
                      }}
                    >
                      <Box
                        sx={{
                          background: "#1a56a0",
                          px: 2,
                          py: 0.8,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.68rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          *Marking Criteria for Points 2, 3 and 4
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.68rem",
                            opacity: 0.85,
                          }}
                        >
                          Out of 5
                        </Typography>
                      </Box>
                      <Table size="small" sx={{ tableLayout: "fixed" }}>
                        <TableHead>
                          <TableRow sx={{ background: "#e8f0fb" }}>
                            {["Participation", "Marks"].map((h) => (
                              <TableCell
                                key={h}
                                sx={{
                                  fontWeight: 500,
                                  fontSize: "0.68rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.3px",
                                  color: "#0c447c",
                                  borderBottom: "1.5px solid #1a56a0",
                                  py: 0.8,
                                }}
                              >
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            {
                              status: "Both YES",
                              marks: 5,
                              bg: "#d4edda",
                              color: "#155724",
                              border: "#b8dfc4",
                            },
                            {
                              status: "One YES",
                              marks: 3,
                              bg: "#fff3cd",
                              color: "#856404",
                              border: "#f0d78c",
                            },
                            {
                              status: "Both NO",
                              marks: 0,
                              bg: "#f8d7da",
                              color: "#721c24",
                              border: "#f0b8bd",
                            },
                          ].map((r, i) => (
                            <TableRow
                              key={i}
                              sx={{
                                background: i % 2 === 0 ? "#f7faff" : "#fff",
                                "&:last-child td": { borderBottom: 0 },
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontSize: "0.8rem",
                                  color: "#1a1a2e",
                                  py: 0.9,
                                }}
                              >
                                {r.status}
                              </TableCell>
                              <TableCell sx={{ py: 0.9 }}>
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    px: 1.5,
                                    py: 0.2,
                                    borderRadius: "3px",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    minWidth: 28,
                                    textAlign: "center",
                                    background: r.bg,
                                    color: r.color,
                                    border: `0.5px solid ${r.border}`,
                                  }}
                                >
                                  {r.marks}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Box
                        sx={{
                          background: "#e8f0fb",
                          borderTop: "1px solid #c8d4e8",
                          px: 2,
                          py: 0.6,
                          textAlign: "right",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.68rem", color: "#0c447c" }}
                        >
                          Total: out of 5 marks each
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* ================= ADD ACTIVITY BUTTON ================= */}
                <Box mb={4}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setExtraCurricularRows([
                        ...extraCurricularRows,
                        {
                          academicYear: "",
                          initiativeName: "",
                          collaboratingPartner: "",
                          areasOfDevelopment: "",
                          description: "",
                          targetStudents: "",
                          status: "",
                        },
                      ])
                    }
                  >
                    + Add Activity
                  </Button>
                </Box>
              </>
            )}
            {currentStep === 6 && (
              <>
                {/* ================= HOSPITALIZATION SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Hospitalization Details
                    </Typography>
                  </Grid>
                </Grid>

                {hospitalizationRows.map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      padding: 3,
                      mb: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* ── HOSPITAL INFO ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Hospital Details
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Nearest Government Hospital"
                          fullWidth
                          size="small"
                          value={row.hospitalEmpanelled}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].hospitalEmpanelled = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Private Hospital Engaged With (if any)"
                          fullWidth
                          size="small"
                          value={row.privateHospital || ""}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].privateHospital = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label="Department"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.empanelmentDepartment || ""}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].empanelmentDepartment = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        >
                          {[
                            "General Medicine",
                            "General Surgery",
                            "Ophthalmology (Eyes)",
                            "ENT (Ear, Nose & Throat)",
                            "Orthopaedics",
                            "Paediatrics",
                            "Dermatology (Skin)",
                            "Dental",
                            "Gynaecology",
                            "Cardiology",
                            "Neurology",
                            "Psychiatry / Mental Health",
                            "Pulmonology (Lungs)",
                            "Gastroenterology",
                            "Nephrology (Kidney)",
                            "Urology",
                            "Oncology (Cancer)",
                            "Endocrinology",
                            "Haematology (Blood)",
                            "Emergency / Trauma",
                            "Physiotherapy",
                            "Radiology / Imaging",
                            "Pathology / Lab",
                            "Other",
                          ].map((dept) => (
                            <MenuItem key={dept} value={dept}>
                              {dept}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Doctor / Treating Physician"
                          fullWidth
                          size="small"
                          value={row.doctorName}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].doctorName = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* ── STUDENT INFO ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Student Information
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Student Name"
                          fullWidth
                          size="small"
                          value={row.studentName}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].studentName = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Roll No"
                          fullWidth
                          size="small"
                          value={row.rollNo}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].rollNo = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          select
                          label="Class"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.class}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].class = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        >
                          {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                            <MenuItem key={c} value={c}>
                              {c}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          select
                          label="Section"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.section}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].section = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        >
                          {["A", "B", "C"].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Guardian Name"
                          fullWidth
                          size="small"
                          value={row.guardianName}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].guardianName = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Guardian Contact"
                          fullWidth
                          size="small"
                          value={row.guardianContact}
                          inputProps={{
                            maxLength: 10,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              ![
                                "Backspace",
                                "Delete",
                                "ArrowLeft",
                                "ArrowRight",
                                "Tab",
                              ].includes(e.key)
                            )
                              e.preventDefault();
                          }}
                          error={
                            row.guardianContact &&
                            row.guardianContact.toString().length !== 10
                          }
                          helperText={
                            row.guardianContact &&
                            row.guardianContact.toString().length !== 10
                              ? "Must be exactly 10 digits"
                              : ""
                          }
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].guardianContact = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* ── ADMISSION INFO ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Admission & Treatment Details
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Date of Admission"
                          fullWidth
                          size="small"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={row.admissionDate}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].admissionDate = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Date of Discharge"
                          fullWidth
                          size="small"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={row.dischargeDate}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].dischargeDate = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Reason for Hospitalization"
                          fullWidth
                          size="small"
                          multiline
                          rows={3}
                          value={row.reasonForHospitalization}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].reasonForHospitalization = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* ── CLAIM INFO ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Cost & Claim Details
                    </Typography>
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Estimated Cost (₹)"
                          fullWidth
                          size="small"
                          type="number"
                          value={row.estimatedCost}
                          inputProps={{ min: 0 }}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              const u = [...hospitalizationRows];
                              u[index].estimatedCost = e.target.value;
                              setHospitalizationRows(u);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Amount Claimed (₹)"
                          fullWidth
                          size="small"
                          type="number"
                          value={row.amountClaimed}
                          inputProps={{ min: 0 }}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e")
                              e.preventDefault();
                          }}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              const u = [...hospitalizationRows];
                              u[index].amountClaimed = e.target.value;
                              setHospitalizationRows(u);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label="Claim Status"
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                          value={row.claimStatus}
                          onChange={(e) => {
                            const u = [...hospitalizationRows];
                            u[index].claimStatus = e.target.value;
                            setHospitalizationRows(u);
                          }}
                        >
                          {[
                            "Pending",
                            "Submitted",
                            "Approved",
                            "Rejected",
                            "Partially Approved",
                          ].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                    {/* ── Add Case Button ── */}
                    <Box mb={4}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setHospitalizationRows([
                            ...hospitalizationRows,
                            emptyHospitalizationRow(),
                          ])
                        }
                      >
                        + Add Hospitalization Case
                      </Button>
                    </Box>

                    {/* ── HEALTH MONITORING & MEDICAL COMPLIANCE ── */}
                    <Box
                      sx={{
                        border: "1px solid #dce3f0",
                        borderRadius: 2,
                        overflow: "hidden",
                        mb: 3,
                      }}
                    >
                      <Box sx={{ background: "#1a56a0", px: 2.5, py: 1.2 }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Health Monitoring &amp; Medical Compliance
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2.5,
                          display: "flex",
                          gap: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        {/* LEFT — dropdowns + marks */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 260,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          {[
                            "Annual Health Check Conducted",
                            "Part-Time Doctor Engaged",
                            "Medical Register Maintained",
                            "Sickle Cell Screening Conducted",
                            "ABHA ID Created",
                            "Eye Checkup Conducted",
                            "Ear Checkup Conducted",
                          ].map((label, idx) => (
                            <TextField
                              key={idx}
                              select
                              fullWidth
                              size="small"
                              label={label}
                              value={row[label] || ""}
                              onChange={(e) => {
                                const u = [...hospitalizationRows];
                                u[index][label] = e.target.value;
                                u[index].marksHealth = calculateHealthMarks(
                                  u[index],
                                );
                                setHospitalizationRows(u);
                              }}
                            >
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </TextField>
                          ))}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#f7faff",
                              border: "1px solid #c8d4e8",
                              borderRadius: 1.5,
                              px: 2,
                              py: 1.2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                color: "#5a6a85",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: "0.4px",
                              }}
                            >
                              Marks Obtained (out of 9)
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "1.4rem",
                                fontWeight: 500,
                                color:
                                  row.marksHealth === 9
                                    ? "#b8860b"
                                    : row.marksHealth === 7
                                      ? "#155724"
                                      : row.marksHealth === 5
                                        ? "#856404"
                                        : row.marksHealth === 3
                                          ? "#7d3c0c"
                                          : row.marksHealth === 0
                                            ? "#721c24"
                                            : "#1a1a2e",
                              }}
                            >
                              {row.marksHealth !== undefined &&
                              row.marksHealth !== null
                                ? row.marksHealth
                                : "—"}
                            </Typography>
                          </Box>
                        </Box>
                        {/* RIGHT — criteria table */}
                        <Box
                          sx={{
                            minWidth: 300,
                            flex: "0 0 340px",
                            border: "1.5px solid #1a56a0",
                            borderRadius: 1.5,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              background: "#1a56a0",
                              px: 2,
                              py: 0.9,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: "0.68rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: "0.4px",
                              }}
                            >
                              Compliance Status
                            </Typography>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: "0.68rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: "0.4px",
                              }}
                            >
                              Marks
                            </Typography>
                          </Box>
                          {[
                            {
                              status: "All 7 conditions fulfilled",
                              marks: 9,
                              bg: "#fff8e1",
                              color: "#b8860b",
                              border: "#f9d84a",
                            },
                            {
                              status: "5 or 6 conditions fulfilled",
                              marks: 7,
                              bg: "#d4edda",
                              color: "#155724",
                              border: "#b8dfc4",
                            },
                            {
                              status: "3 or 4 conditions fulfilled",
                              marks: 5,
                              bg: "#fff3cd",
                              color: "#856404",
                              border: "#f0d78c",
                            },
                            {
                              status: "1 or 2 conditions fulfilled",
                              marks: 3,
                              bg: "#fde8d8",
                              color: "#7d3c0c",
                              border: "#f0c09a",
                            },
                            {
                              status: "No condition fulfilled",
                              marks: 0,
                              bg: "#f8d7da",
                              color: "#721c24",
                              border: "#f0b8bd",
                            },
                          ].map((r, i) => (
                            <Box
                              key={r.status}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                borderTop: "0.5px solid #dce3f0",
                                borderLeft:
                                  row.marksHealth === r.marks
                                    ? "3px solid #1a56a0"
                                    : "3px solid transparent",
                                background:
                                  row.marksHealth === r.marks
                                    ? "#e8f0fb"
                                    : i % 2 === 0
                                      ? "#f7faff"
                                      : "#fff",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.8rem", color: "#1a1a2e" }}
                              >
                                {r.status}
                              </Typography>
                              <Box
                                sx={{
                                  background: r.bg,
                                  color: r.color,
                                  border: `0.5px solid ${r.border}`,
                                  borderRadius: "3px",
                                  px: 1.5,
                                  py: 0.2,
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  minWidth: 28,
                                  textAlign: "center",
                                }}
                              >
                                {r.marks}
                              </Box>
                            </Box>
                          ))}
                          <Box
                            sx={{
                              background: "#e8f0fb",
                              borderTop: "1px solid #c8d4e8",
                              px: 2,
                              py: 0.7,
                              textAlign: "right",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "0.68rem", color: "#0c447c" }}
                            >
                              Total: out of 9 marks
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* ── EYE & EAR HEALTH ── */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                          mb: 3,
                        }}
                      >
                        {/* Eye Header */}
                        <Typography
                          sx={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "#1a56a0",
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            borderBottom: "1px solid #c8d4e8",
                            pb: 0.5,
                          }}
                        >
                          👁 Eye Health Details
                        </Typography>

                        {(row.eyeEntries || []).map((eye, ei) => (
                          <Box
                            key={ei}
                            sx={{
                              border: "1px solid #e3eaf5",
                              borderRadius: 1.5,
                              p: 2,
                              background: "#f7faff",
                              position: "relative",
                            }}
                          >
                            {(row.eyeEntries || []).length > 0 && (
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  color: "#c62828",
                                }}
                                onClick={() => {
                                  const u = [...hospitalizationRows];
                                  u[index].eyeEntries = u[
                                    index
                                  ].eyeEntries.filter((_, i) => i !== ei);
                                  setHospitalizationRows(u);
                                  // Clear error for removed entry
                                  const errKey = `${index}-${ei}`;
                                  setEyeDateErrors((prev) => {
                                    const n = { ...prev };
                                    delete n[errKey];
                                    return n;
                                  });
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Eye Specialist Name"
                                  fullWidth
                                  size="small"
                                  value={eye.eyeSpecialistName || ""}
                                  onKeyDown={(e) => {
                                    if (/[0-9]/.test(e.key)) e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].eyeEntries[ei].eyeSpecialistName =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>

                              {/* ── EYE DATE PICKER with 6-month validation ── */}
                              <Grid item xs={12} sm={6} md={4}>
                                <DesktopDatePicker
                                  label="Checkup Date (Bi-Annual)"
                                  value={
                                    eye.eyeCheckupDate
                                      ? dayjs(eye.eyeCheckupDate)
                                      : null
                                  }
                                  format="DD/MM/YYYY"
                                  onChange={(newVal) => {
                                    const formatted =
                                      newVal && newVal.isValid()
                                        ? newVal.format("YYYY-MM-DD")
                                        : "";
                                    const u = [...hospitalizationRows];
                                    const errKey = `${index}-${ei}`;

                                    // Validate 6-month gap against all other eye entries
                                    const error = formatted
                                      ? validateBiAnnualDate(
                                          formatted,
                                          u[index].eyeEntries,
                                          ei,
                                          "eyeCheckupDate",
                                        )
                                      : null;

                                    if (error) {
                                      setEyeDateErrors((prev) => ({
                                        ...prev,
                                        [errKey]: error,
                                      }));
                                      // Still update the value so user sees what they typed, but flag error
                                      u[index].eyeEntries[ei].eyeCheckupDate =
                                        formatted;
                                      setHospitalizationRows(u);
                                    } else {
                                      setEyeDateErrors((prev) => {
                                        const n = { ...prev };
                                        delete n[errKey];
                                        return n;
                                      });
                                      u[index].eyeEntries[ei].eyeCheckupDate =
                                        formatted;
                                      setHospitalizationRows(u);
                                    }
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                      error: !!eyeDateErrors[`${index}-${ei}`],
                                      helperText: eyeDateErrors[
                                        `${index}-${ei}`
                                      ]
                                        ? `⚠️ ${eyeDateErrors[`${index}-${ei}`]}`
                                        : "Must be 6+ months from other entries",
                                      FormHelperTextProps: {
                                        sx: {
                                          color: eyeDateErrors[`${index}-${ei}`]
                                            ? "#c62828"
                                            : "#888",
                                          fontSize: "0.68rem",
                                        },
                                      },
                                    },
                                  }}
                                />
                              </Grid>

                              <Grid item xs={6} sm={3} md={2}>
                                <TextField
                                  select
                                  label="Class"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={eye.eyeClass || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].eyeEntries[ei].eyeClass =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {["6", "7", "8", "9", "10", "11", "12"].map(
                                    (c) => (
                                      <MenuItem key={c} value={c}>
                                        {c}
                                      </MenuItem>
                                    ),
                                  )}
                                </TextField>
                              </Grid>

                              <Grid item xs={6} sm={3} md={2}>
                                <TextField
                                  select
                                  label="Section"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={eye.eyeSection || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].eyeEntries[ei].eyeSection =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {["A", "B", "C"].map((s) => (
                                    <MenuItem key={s} value={s}>
                                      {s}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>

                              {[
                                {
                                  label: "No. of Students Screened",
                                  field: "eyeStudentsScreened",
                                },
                                {
                                  label: "No. of Students with Eye Problem",
                                  field: "eyeStudentsWithProblem",
                                },
                                {
                                  label: "No. of Students Needing Spectacle",
                                  field: "eyeNeedsSpectacle",
                                },
                                {
                                  label:
                                    "No. Needing Higher Investigation/Treatment",
                                  field: "eyeNeedsHigherInvestigation",
                                },
                              ].map(({ label, field }) => (
                                <Grid item xs={12} sm={6} md={3} key={field}>
                                  <TextField
                                    label={label}
                                    fullWidth
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    onKeyDown={(e) => {
                                      if (e.key === "-" || e.key === "e")
                                        e.preventDefault();
                                    }}
                                    value={eye[field] || ""}
                                    onChange={(e) => {
                                      if (Number(e.target.value) >= 0) {
                                        const u = [...hospitalizationRows];
                                        u[index].eyeEntries[ei][field] =
                                          e.target.value;
                                        setHospitalizationRows(u);
                                      }
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        ))}

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ alignSelf: "flex-start" }}
                          onClick={() => addEyeRow(index)}
                        >
                          + Add Eye Entry
                        </Button>

                        {/* ══════════════════════════════════════════ */}

                        {/* Ear Header */}
                        <Typography
                          sx={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "#1a56a0",
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            borderBottom: "1px solid #c8d4e8",
                            pb: 0.5,
                            mt: 1,
                          }}
                        >
                          👂 Ear Health Details
                        </Typography>

                        {(row.earEntries || []).map((ear, eri) => (
                          <Box
                            key={eri}
                            sx={{
                              border: "1px solid #e3eaf5",
                              borderRadius: 1.5,
                              p: 2,
                              background: "#f7faff",
                              position: "relative",
                            }}
                          >
                            {(row.earEntries || []).length > 0 && (
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  color: "#c62828",
                                }}
                                onClick={() => {
                                  const u = [...hospitalizationRows];
                                  u[index].earEntries = u[
                                    index
                                  ].earEntries.filter((_, i) => i !== eri);
                                  setHospitalizationRows(u);
                                  const errKey = `${index}-${eri}`;
                                  setEarDateErrors((prev) => {
                                    const n = { ...prev };
                                    delete n[errKey];
                                    return n;
                                  });
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Ear Specialist Name"
                                  fullWidth
                                  size="small"
                                  value={ear.earSpecialistName || ""}
                                  onKeyDown={(e) => {
                                    if (/[0-9]/.test(e.key)) e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].earEntries[eri].earSpecialistName =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>

                              {/* ── EAR DATE PICKER with 6-month validation ── */}
                              <Grid item xs={12} sm={6} md={4}>
                                <DesktopDatePicker
                                  label="Checkup Date (Bi-Annual)"
                                  value={
                                    ear.earCheckupDate
                                      ? dayjs(ear.earCheckupDate)
                                      : null
                                  }
                                  format="DD/MM/YYYY"
                                  onChange={(newVal) => {
                                    const formatted =
                                      newVal && newVal.isValid()
                                        ? newVal.format("YYYY-MM-DD")
                                        : "";
                                    const u = [...hospitalizationRows];
                                    const errKey = `${index}-${eri}`;

                                    const error = formatted
                                      ? validateBiAnnualDate(
                                          formatted,
                                          u[index].earEntries,
                                          eri,
                                          "earCheckupDate",
                                        )
                                      : null;

                                    if (error) {
                                      setEarDateErrors((prev) => ({
                                        ...prev,
                                        [errKey]: error,
                                      }));
                                      u[index].earEntries[eri].earCheckupDate =
                                        formatted;
                                      setHospitalizationRows(u);
                                    } else {
                                      setEarDateErrors((prev) => {
                                        const n = { ...prev };
                                        delete n[errKey];
                                        return n;
                                      });
                                      u[index].earEntries[eri].earCheckupDate =
                                        formatted;
                                      setHospitalizationRows(u);
                                    }
                                  }}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                      error: !!earDateErrors[`${index}-${eri}`],
                                      helperText: earDateErrors[
                                        `${index}-${eri}`
                                      ]
                                        ? `⚠️ ${earDateErrors[`${index}-${eri}`]}`
                                        : "Must be 6+ months from other entries",
                                      FormHelperTextProps: {
                                        sx: {
                                          color: earDateErrors[
                                            `${index}-${eri}`
                                          ]
                                            ? "#c62828"
                                            : "#888",
                                          fontSize: "0.68rem",
                                        },
                                      },
                                    },
                                  }}
                                />
                              </Grid>

                              <Grid item xs={6} sm={3} md={2}>
                                <TextField
                                  select
                                  label="Class"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={ear.earClass || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].earEntries[eri].earClass =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {["6", "7", "8", "9", "10", "11", "12"].map(
                                    (c) => (
                                      <MenuItem key={c} value={c}>
                                        {c}
                                      </MenuItem>
                                    ),
                                  )}
                                </TextField>
                              </Grid>

                              <Grid item xs={6} sm={3} md={2}>
                                <TextField
                                  select
                                  label="Section"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={ear.earSection || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].earEntries[eri].earSection =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {["A", "B", "C"].map((s) => (
                                    <MenuItem key={s} value={s}>
                                      {s}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>

                              {[
                                {
                                  label: "No. of Students Screened",
                                  field: "earStudentsScreened",
                                },
                                {
                                  label: "No. of Students with Ear Problem",
                                  field: "earStudentsWithProblem",
                                },
                                {
                                  label:
                                    "No. of Students Needing Ear Equipment",
                                  field: "earNeedsEquipment",
                                },
                              ].map(({ label, field }) => (
                                <Grid item xs={12} sm={6} md={4} key={field}>
                                  <TextField
                                    label={label}
                                    fullWidth
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    onKeyDown={(e) => {
                                      if (e.key === "-" || e.key === "e")
                                        e.preventDefault();
                                    }}
                                    value={ear[field] || ""}
                                    onChange={(e) => {
                                      if (Number(e.target.value) >= 0) {
                                        const u = [...hospitalizationRows];
                                        u[index].earEntries[eri][field] =
                                          e.target.value;
                                        setHospitalizationRows(u);
                                      }
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        ))}

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ alignSelf: "flex-start" }}
                          onClick={() => addEarRow(index)}
                        >
                          + Add Ear Entry
                        </Button>
                      </Box>
                    </LocalizationProvider>

                    {/* ══════════════════════════════════════════════════════════════
        ✅ NEW: MEDICAL STAFF DETAILS
    ══════════════════════════════════════════════════════════════ */}
                    <Box
                      sx={{
                        border: "1px solid #dce3f0",
                        borderRadius: 2,
                        overflow: "hidden",
                        mb: 3,
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          background:
                            "linear-gradient(to right, #0d47a1, #1976d2)",
                          px: 2.5,
                          py: 1.4,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                          }}
                        >
                          🏥 Medical Staff Details
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2.5,
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        {/* ── A. STAFF NURSE (24×7) ── */}
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                color: "#0d47a1",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                borderLeft: "3px solid #1976d2",
                                pl: 1,
                              }}
                            >
                              🩺 Staff Nurse Details (24×7 Duty)
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<AddCircleOutlineIcon />}
                              onClick={() => {
                                const u = [...hospitalizationRows];
                                u[index].nurseEntries = [
                                  ...(u[index].nurseEntries || []),
                                  blankNurseEntry(),
                                ];
                                setHospitalizationRows(u);
                              }}
                            >
                              Add Nurse
                            </Button>
                          </Box>

                          {(row.nurseEntries || []).map((nurse, ni) => (
                            <Box
                              key={ni}
                              sx={{
                                border: "1px solid #e3eaf5",
                                borderRadius: 1.5,
                                p: 2,
                                mb: 1.5,
                                background: "#f7faff",
                                position: "relative",
                              }}
                            >
                              {(row.nurseEntries || []).length > 1 && (
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 6,
                                    right: 6,
                                    color: "#c62828",
                                  }}
                                  onClick={() => {
                                    const u = [...hospitalizationRows];
                                    u[index].nurseEntries = u[
                                      index
                                    ].nurseEntries.filter((_, i) => i !== ni);
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              )}
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <TextField
                                    label="Nurse Full Name"
                                    fullWidth
                                    size="small"
                                    value={nurse.nurseName}
                                    onKeyDown={(e) => {
                                      if (/[0-9]/.test(e.key))
                                        e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                      const u = [...hospitalizationRows];
                                      u[index].nurseEntries[ni].nurseName =
                                        e.target.value;
                                      setHospitalizationRows(u);
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <TextField
                                    select
                                    label="Qualification"
                                    fullWidth
                                    size="small"
                                    sx={{ minWidth: 220 }}
                                    value={nurse.nurseQualification}
                                    onChange={(e) => {
                                      const u = [...hospitalizationRows];
                                      u[index].nurseEntries[
                                        ni
                                      ].nurseQualification = e.target.value;
                                      setHospitalizationRows(u);
                                    }}
                                  >
                                    {[
                                      "GNM (General Nursing & Midwifery)",
                                      "ANM (Auxiliary Nurse Midwife)",
                                      "B.Sc Nursing",
                                      "M.Sc Nursing",
                                      "Post Basic B.Sc Nursing",
                                      "Other",
                                    ].map((q) => (
                                      <MenuItem key={q} value={q}>
                                        {q}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <TextField
                                    label="Nursing Council Reg. No."
                                    fullWidth
                                    size="small"
                                    value={nurse.nurseRegNo}
                                    onChange={(e) => {
                                      const u = [...hospitalizationRows];
                                      u[index].nurseEntries[ni].nurseRegNo =
                                        e.target.value;
                                      setHospitalizationRows(u);
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <TextField
                                    label="Contact Number"
                                    fullWidth
                                    size="small"
                                    sx={{ minWidth: 220 }}
                                    value={nurse.nurseContact}
                                    inputProps={{
                                      maxLength: 10,
                                      inputMode: "numeric",
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        !/[0-9]/.test(e.key) &&
                                        ![
                                          "Backspace",
                                          "Delete",
                                          "ArrowLeft",
                                          "ArrowRight",
                                          "Tab",
                                        ].includes(e.key)
                                      )
                                        e.preventDefault();
                                    }}
                                    error={
                                      nurse.nurseContact &&
                                      nurse.nurseContact.length !== 10
                                    }
                                    helperText={
                                      nurse.nurseContact &&
                                      nurse.nurseContact.length !== 10
                                        ? "Must be 10 digits"
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const u = [...hospitalizationRows];
                                      u[index].nurseEntries[ni].nurseContact =
                                        e.target.value;
                                      setHospitalizationRows(u);
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <TextField
                                    select
                                    label="Duty Shift"
                                    fullWidth
                                    size="small"
                                    sx={{ minWidth: 220 }}
                                    value={nurse.nurseShift}
                                    onChange={(e) => {
                                      const u = [...hospitalizationRows];
                                      u[index].nurseEntries[ni].nurseShift =
                                        e.target.value;
                                      setHospitalizationRows(u);
                                    }}
                                  >
                                    {[
                                      "Morning (6 AM – 2 PM)",
                                      "Evening (2 PM – 10 PM)",
                                      "Night (10 PM – 6 AM)",
                                      "General (Full Day)",
                                    ].map((s) => (
                                      <MenuItem key={s} value={s}>
                                        {s}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <TextField
                                    label="Date of Joining"
                                    fullWidth
                                    size="small"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={nurse.nurseJoiningDate}
                                    onChange={(e) => {
                                      const u = [...hospitalizationRows];
                                      u[index].nurseEntries[
                                        ni
                                      ].nurseJoiningDate = e.target.value;
                                      setHospitalizationRows(u);
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                        </Box>

                        <Divider />

                        {/* ── B. DAILY VISITING DOCTOR ── */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: "#0d47a1",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              borderLeft: "3px solid #1976d2",
                              pl: 1,
                              mb: 1.5,
                            }}
                          >
                            👨‍⚕️ Daily Visiting Doctor
                          </Typography>

                          {/* Doctor Profile */}
                          <Box
                            sx={{
                              border: "1px solid #e3eaf5",
                              borderRadius: 1.5,
                              p: 2,
                              mb: 2,
                              background: "#f7faff",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                color: "#5a6a85",
                                fontWeight: 500,
                                mb: 1.5,
                                textTransform: "uppercase",
                              }}
                            >
                              Doctor Profile
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Doctor Full Name"
                                  fullWidth
                                  size="small"
                                  onKeyDown={(e) => {
                                    if (/[0-9]/.test(e.key)) e.preventDefault();
                                  }}
                                  value={row.visitingDoctorName || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].visitingDoctorName =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  select
                                  label="Specialization"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={row.visitingDoctorSpecialization || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].visitingDoctorSpecialization =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {[
                                    "General Medicine / MBBS",
                                    "Paediatrics",
                                    "General Surgery",
                                    "Gynaecology",
                                    "Orthopaedics",
                                    "Dermatology",
                                    "ENT",
                                    "Ophthalmology",
                                    "Other",
                                  ].map((s) => (
                                    <MenuItem key={s} value={s}>
                                      {s}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Medical Council Reg. No."
                                  fullWidth
                                  size="small"
                                  value={row.visitingDoctorRegNo || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].visitingDoctorRegNo =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Contact Number"
                                  fullWidth
                                  size="small"
                                  value={row.visitingDoctorContact || ""}
                                  inputProps={{
                                    maxLength: 10,
                                    inputMode: "numeric",
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      !/[0-9]/.test(e.key) &&
                                      ![
                                        "Backspace",
                                        "Delete",
                                        "ArrowLeft",
                                        "ArrowRight",
                                        "Tab",
                                      ].includes(e.key)
                                    )
                                      e.preventDefault();
                                  }}
                                  error={
                                    row.visitingDoctorContact &&
                                    row.visitingDoctorContact.length !== 10
                                  }
                                  helperText={
                                    row.visitingDoctorContact &&
                                    row.visitingDoctorContact.length !== 10
                                      ? "Must be 10 digits"
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].visitingDoctorContact =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Scheduled Daily Visit Time"
                                  fullWidth
                                  size="small"
                                  type="time"
                                  InputLabelProps={{ shrink: true }}
                                  value={row.scheduledVisitTime || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].scheduledVisitTime =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Digital Visit Attendance Log */}
                          <Box
                            sx={{
                              border: "1px solid #dce3f0",
                              borderRadius: 1.5,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                background: "#1a56a0",
                                px: 2,
                                py: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontSize: "0.72rem",
                                  fontWeight: 500,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.4px",
                                }}
                              >
                                📋 Doctor Visit Attendance Log
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{
                                  color: "#fff",
                                  borderColor: "rgba(255,255,255,0.5)",
                                  fontSize: "0.68rem",
                                }}
                                onClick={() => {
                                  const u = [...hospitalizationRows];
                                  u[index].doctorVisitLogs = [
                                    ...(u[index].doctorVisitLogs || []),
                                    blankVisitLog(),
                                  ];
                                  setHospitalizationRows(u);
                                }}
                              >
                                Add Record
                              </Button>
                            </Box>
                            <TableContainer component={Paper} elevation={0}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ background: "#e8f0fb" }}>
                                    {[
                                      "Visit Date",
                                      "Actual Visit Time",
                                      "Visit Status",
                                      "Remarks / Notes",
                                      "",
                                    ].map((h) => (
                                      <TableCell
                                        key={h}
                                        sx={{
                                          fontSize: "0.7rem",
                                          fontWeight: 600,
                                          color: "#1a56a0",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.3px",
                                        }}
                                      >
                                        {h}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(row.doctorVisitLogs || []).map(
                                    (log, li) => (
                                      <TableRow
                                        key={li}
                                        sx={{
                                          "&:hover": { background: "#f7faff" },
                                        }}
                                      >
                                        <TableCell sx={{ minWidth: 150 }}>
                                          <TextField
                                            size="small"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={log.visitDate}
                                            onChange={(e) => {
                                              const u = [
                                                ...hospitalizationRows,
                                              ];
                                              u[index].doctorVisitLogs[
                                                li
                                              ].visitDate = e.target.value;
                                              setHospitalizationRows(u);
                                            }}
                                            sx={{
                                              "& .MuiInputBase-root": {
                                                fontSize: "0.78rem",
                                              },
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 130 }}>
                                          <TextField
                                            size="small"
                                            type="time"
                                            InputLabelProps={{ shrink: true }}
                                            value={log.actualVisitTime}
                                            onChange={(e) => {
                                              const u = [
                                                ...hospitalizationRows,
                                              ];
                                              u[index].doctorVisitLogs[
                                                li
                                              ].actualVisitTime =
                                                e.target.value;
                                              setHospitalizationRows(u);
                                            }}
                                            sx={{
                                              "& .MuiInputBase-root": {
                                                fontSize: "0.78rem",
                                              },
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 200 }}>
                                          <TextField
                                            select
                                            size="small"
                                            fullWidth
                                            value={log.visitStatus}
                                            onChange={(e) => {
                                              const u = [
                                                ...hospitalizationRows,
                                              ];
                                              u[index].doctorVisitLogs[
                                                li
                                              ].visitStatus = e.target.value;
                                              setHospitalizationRows(u);
                                            }}
                                            sx={{
                                              "& .MuiInputBase-root": {
                                                fontSize: "0.78rem",
                                              },
                                            }}
                                          >
                                            {[
                                              {
                                                label: "Visited",
                                                bg: "#d4edda",
                                                color: "#155724",
                                              },
                                              {
                                                label: "Absent",
                                                bg: "#f8d7da",
                                                color: "#721c24",
                                              },
                                              {
                                                label: "Rescheduled",
                                                bg: "#fff3cd",
                                                color: "#856404",
                                              },
                                              {
                                                label: "Emergency Call",
                                                bg: "#cce5ff",
                                                color: "#004085",
                                              },
                                              {
                                                label: "Early Departure",
                                                bg: "#e2e3e5",
                                                color: "#383d41",
                                              },
                                            ].map(({ label, bg, color }) => (
                                              <MenuItem
                                                key={label}
                                                value={label}
                                              >
                                                <Chip
                                                  label={label}
                                                  size="small"
                                                  sx={{
                                                    fontSize: "0.68rem",
                                                    background: bg,
                                                    color,
                                                  }}
                                                />
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 200 }}>
                                          <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Optional remarks…"
                                            value={log.remarks}
                                            onChange={(e) => {
                                              const u = [
                                                ...hospitalizationRows,
                                              ];
                                              u[index].doctorVisitLogs[
                                                li
                                              ].remarks = e.target.value;
                                              setHospitalizationRows(u);
                                            }}
                                            sx={{
                                              "& .MuiInputBase-root": {
                                                fontSize: "0.78rem",
                                              },
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          {(row.doctorVisitLogs || []).length >
                                            1 && (
                                            <IconButton
                                              size="small"
                                              sx={{ color: "#c62828" }}
                                              onClick={() => {
                                                const u = [
                                                  ...hospitalizationRows,
                                                ];
                                                u[index].doctorVisitLogs = u[
                                                  index
                                                ].doctorVisitLogs.filter(
                                                  (_, i) => i !== li,
                                                );
                                                setHospitalizationRows(u);
                                              }}
                                            >
                                              <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Box>

                        <Divider />

                        {/* ── C. PSYCHOLOGICAL COUNSELLOR ── */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: "#0d47a1",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              borderLeft: "3px solid #1976d2",
                              pl: 1,
                              mb: 1.5,
                            }}
                          >
                            🧠 Psychological Counsellor
                          </Typography>
                          <Box
                            sx={{
                              border: "1px solid #e3eaf5",
                              borderRadius: 1.5,
                              p: 2,
                              background: "#f7faff",
                            }}
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Counsellor Full Name"
                                  fullWidth
                                  size="small"
                                  value={row.counsellorName || ""}
                                  onKeyDown={(e) => {
                                    if (/[0-9]/.test(e.key)) e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].counsellorName = e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  select
                                  label="Qualification"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={row.counsellorQualification || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].counsellorQualification =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {[
                                    "M.A. Psychology",
                                    "M.Sc. Psychology",
                                    "M.Phil. Clinical Psychology",
                                    "Ph.D. Psychology",
                                    "RCI Registered Counsellor",
                                    "REBT / CBT Certified",
                                    "Other",
                                  ].map((q) => (
                                    <MenuItem key={q} value={q}>
                                      {q}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Registration / Certificate No."
                                  fullWidth
                                  size="small"
                                  value={row.counsellorRegNo || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].counsellorRegNo = e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Contact Number"
                                  fullWidth
                                  size="small"
                                  value={row.counsellorContact || ""}
                                  inputProps={{
                                    maxLength: 10,
                                    inputMode: "numeric",
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      !/[0-9]/.test(e.key) &&
                                      ![
                                        "Backspace",
                                        "Delete",
                                        "ArrowLeft",
                                        "ArrowRight",
                                        "Tab",
                                      ].includes(e.key)
                                    )
                                      e.preventDefault();
                                  }}
                                  error={
                                    row.counsellorContact &&
                                    row.counsellorContact.length !== 10
                                  }
                                  helperText={
                                    row.counsellorContact &&
                                    row.counsellorContact.length !== 10
                                      ? "Must be 10 digits"
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].counsellorContact = e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  select
                                  label="Available Days"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  SelectProps={{
                                    multiple: true,
                                    renderValue: (selected) => (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 0.5,
                                        }}
                                      >
                                        {selected.map((v) => (
                                          <Chip
                                            key={v}
                                            label={v}
                                            size="small"
                                          />
                                        ))}
                                      </Box>
                                    ),
                                  }}
                                  value={row.counsellorAvailableDays || []}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].counsellorAvailableDays =
                                      typeof e.target.value === "string"
                                        ? e.target.value.split(",")
                                        : e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {[
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                    "Sun",
                                  ].map((d) => (
                                    <MenuItem key={d} value={d}>
                                      {d}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  select
                                  label="Session Type"
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  value={row.counsellorSessionType || ""}
                                  onChange={(e) => {
                                    const u = [...hospitalizationRows];
                                    u[index].counsellorSessionType =
                                      e.target.value;
                                    setHospitalizationRows(u);
                                  }}
                                >
                                  {[
                                    "Individual",
                                    "Group",
                                    "Both Individual & Group",
                                  ].map((t) => (
                                    <MenuItem key={t} value={t}>
                                      {t}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Sessions Conducted (This Month)"
                                  fullWidth
                                  size="small"
                                  type="number"
                                  inputProps={{ min: 0 }}
                                  onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e")
                                      e.preventDefault();
                                  }}
                                  value={row.counsellorSessionsConducted || ""}
                                  onChange={(e) => {
                                    if (Number(e.target.value) >= 0) {
                                      const u = [...hospitalizationRows];
                                      u[index].counsellorSessionsConducted =
                                        e.target.value;
                                      setHospitalizationRows(u);
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  label="Students Counselled (This Month)"
                                  fullWidth
                                  size="small"
                                  type="number"
                                  inputProps={{ min: 0 }}
                                  onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e")
                                      e.preventDefault();
                                  }}
                                  value={row.counsellorStudentsCounselled || ""}
                                  onChange={(e) => {
                                    if (Number(e.target.value) >= 0) {
                                      const u = [...hospitalizationRows];
                                      u[index].counsellorStudentsCounselled =
                                        e.target.value;
                                      setHospitalizationRows(u);
                                    }
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    {/* END MEDICAL STAFF DETAILS */}
                  </Box>
                ))}
              </>
            )}
            {currentStep === 7 && (
              <>
                {/* ================= TEACHING STAFF DETAILS SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Teaching Staff Details
                    </Typography>
                  </Grid>
                </Grid>

                {/* Teaching Staff Fields */}
                {teachingRows.map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      p: 3,
                      mb: 3,
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* ── SANCTIONED STRENGTH ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Sanctioned Strength
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Grid container spacing={2}>
                        {teachingStaffSummaryFields
                          .filter(
                            (f) =>
                              f.name === "total" ||
                              f.name === "filled" ||
                              f.name === "vacant",
                          )

                          .map((field) => (
                            <Grid item xs={12} sm={4} key={field.name}>
                              <TextField
                                fullWidth
                                size="small"
                                type={field.type}
                                label={field.label}
                                value={
                                  field.name === "vacant"
                                    ? Number(row.total || 0) -
                                        Number(row.filled || 0) || ""
                                    : row[field.name]
                                }
                                inputProps={{ min: 0 }}
                                InputProps={{ readOnly: field.readOnly }}
                                onChange={(e) => {
                                  const updatedRows = [...teachingRows];
                                  updatedRows[index][field.name] =
                                    e.target.value;
                                  setteachingRows(updatedRows);
                                }}
                              />
                            </Grid>
                          ))}
                      </Grid>
                    </Box>

                    {/* ── STAFF DETAILS ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Staff Details
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Grid container spacing={2}>
                        {teachingStaffSummaryFields
                          .filter(
                            (f) =>
                              f.name !== "total" &&
                              f.name !== "filled" &&
                              f.name !== "vacant",
                          )
                          .map((field) => (
                            <Grid item xs={12} sm={6} md={4} key={field.name}>
                              {field.type === "select" ? (
                                <TextField
                                  select
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  label={field.label}
                                  value={row[field.name] ?? ""}
                                  InputProps={{ readOnly: field.readOnly }}
                                  InputLabelProps={{
                                    shrink: field.type === "date" || undefined,
                                  }}
                                  onChange={(e) => {
                                    const updatedRows = [...teachingRows];
                                    updatedRows[index][field.name] =
                                      e.target.value;
                                    setteachingRows(updatedRows);
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  {field.options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              ) : (
                                <TextField
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  type={field.type || "text"}
                                  label={field.label}
                                  value={row[field.name]}
                                  InputProps={{ readOnly: field.readOnly }}
                                  InputLabelProps={{
                                    shrink: field.type === "date" || undefined,
                                  }}
                                  onChange={(e) => {
                                    const updatedRows = [...teachingRows];
                                    updatedRows[index][field.name] =
                                      e.target.value;
                                    setteachingRows(updatedRows);
                                  }}
                                />
                              )}
                            </Grid>
                          ))}
                      </Grid>
                    </Box>

                    {/* ── EDUCATIONAL QUALIFICATION ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Educational Qualification
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      {renderQualificationTables(
                        teachingRows,
                        setteachingRows,
                        index,
                      )}
                    </Box>

                    {/* ── ADD POST BUTTON ── */}
                    <Grid container>
                      <Grid item xs={12}>
                        <Box mt={1} mb={4}>
                          <Button
                            variant="outlined"
                            sx={{ mb: 4 }}
                            onClick={() =>
                              setteachingRows([
                                ...teachingRows,
                                {
                                  post: "",
                                  name: "",
                                  dob: "",
                                  doj: "",
                                  email: "",
                                  contact: "",
                                  total: "",
                                  filled: "",
                                  vacant: "",
                                  academicQualifications: [
                                    {
                                      qualification: "",
                                      course: "",
                                      registrationNo: "",
                                      rollNo: "",
                                      college: "",
                                      marksObtained: "",
                                      university: "",
                                      passingYear: "",
                                    },
                                  ],
                                  professionalQualifications: [
                                    {
                                      qualification: "",
                                      registrationNo: "",
                                      rollNo: "",
                                      examConductedBy: "",
                                      passingYear: "",
                                      marksObtained: "",
                                      affiliationBody: "",
                                    },
                                  ],
                                },
                              ])
                            }
                          >
                            + Add Post
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                {/* =================NON TEACHING STAFF DETAILS SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Non-Teaching Staff Details
                    </Typography>
                  </Grid>
                </Grid>

                {/* Non Teaching Staff Fields */}
                {nonTeachingRows.map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      p: 3,
                      mb: 3,
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* ── SECTION 2: SANCTIONED STRENGTH ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Sanctioned Strength
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Grid container spacing={2}>
                        {nonTeachingStaffDetailFields
                          .filter(
                            (f) =>
                              f.name === "total" ||
                              f.name === "filled" ||
                              f.name === "vacant",
                          )
                          .map((field) => (
                            <Grid item xs={12} sm={4} key={field.name}>
                              <TextField
                                fullWidth
                                size="small"
                                type={field.type}
                                label={field.label}
                                value={
                                  field.name === "vacant"
                                    ? Number(row.total || 0) -
                                        Number(row.filled || 0) || ""
                                    : row[field.name]
                                }
                                InputProps={{ readOnly: field.readOnly }}
                                onChange={(e) => {
                                  const updatedRows = [...nonTeachingRows];
                                  updatedRows[index][field.name] =
                                    e.target.value;
                                  setnonTeachingRows(updatedRows);
                                }}
                              />
                            </Grid>
                          ))}
                      </Grid>
                    </Box>

                    {/*  STAFF DETAILS ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Staff Details
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Grid container spacing={2}>
                        {nonTeachingStaffDetailFields
                          .filter(
                            (f) =>
                              f.name !== "total" &&
                              f.name !== "filled" &&
                              f.name !== "vacant",
                          )
                          .map((field) => (
                            <Grid item xs={12} sm={6} md={4} key={field.name}>
                              {field.type === "select" ? (
                                <TextField
                                  select
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  type={
                                    field.name === "contact" ? "text" : "text"
                                  }
                                  label={field.label}
                                  value={row[field.name]}
                                  InputProps={{ readOnly: field.readOnly }}
                                  InputLabelProps={{
                                    shrink: field.type === "date" || undefined,
                                  }}
                                  {...(field.name === "contact" && {
                                    inputProps: {
                                      maxLength: 10,
                                      inputMode: "numeric",
                                      pattern: "[0-9]*",
                                    },
                                    onKeyDown: (e) => {
                                      if (
                                        !/[0-9]/.test(e.key) &&
                                        ![
                                          "Backspace",
                                          "Delete",
                                          "ArrowLeft",
                                          "ArrowRight",
                                          "Tab",
                                        ].includes(e.key)
                                      ) {
                                        e.preventDefault();
                                      }
                                    },
                                    error:
                                      row.contact &&
                                      row.contact.toString().length !== 10,
                                    helperText:
                                      row.contact &&
                                      row.contact.toString().length !== 10
                                        ? "Must be exactly 10 digits"
                                        : "",
                                  })}
                                  onChange={(e) => {
                                    const updatedRows = [...nonTeachingRows];
                                    updatedRows[index][field.name] =
                                      e.target.value;
                                    setnonTeachingRows(updatedRows);
                                  }}
                                >
                                  <MenuItem value="">Select</MenuItem>
                                  {field.options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              ) : (
                                <TextField
                                  fullWidth
                                  size="small"
                                  sx={{ minWidth: 220 }}
                                  type={field.type || "text"}
                                  label={field.label}
                                  value={row[field.name]}
                                  InputProps={{ readOnly: field.readOnly }}
                                  InputLabelProps={{
                                    shrink: field.type === "date" || undefined,
                                  }}
                                  onChange={(e) => {
                                    const updatedRows = [...nonTeachingRows];
                                    updatedRows[index][field.name] =
                                      e.target.value;
                                    setnonTeachingRows(updatedRows);
                                  }}
                                />
                              )}
                            </Grid>
                          ))}
                      </Grid>
                    </Box>

                    {/*  EDUCATIONAL QUALIFICATION ── */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                    >
                      Educational Qualification
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      {renderQualificationTables(
                        nonTeachingRows,
                        setnonTeachingRows,
                        index,
                        false,
                      )}
                    </Box>

                    {/* Add Post Button */}
                    <Grid container>
                      <Grid item xs={12}>
                        <Box mt={1} mb={4}>
                          <Button
                            variant="outlined"
                            sx={{ mb: 4 }}
                            onClick={() =>
                              setnonTeachingRows([
                                ...nonTeachingRows,
                                {
                                  post: "",
                                  name: "",
                                  dob: "",
                                  doj: "",
                                  email: "",
                                  contact: "",
                                  total: "",
                                  filled: "",
                                  vacant: "",
                                  academicQualifications: [
                                    {
                                      qualification: "",
                                      course: "",
                                      registrationNo: "",
                                      rollNo: "",
                                      college: "",
                                      marksObtained: "",
                                      university: "",
                                      passingYear: "",
                                    },
                                  ],
                                  professionalQualifications: [
                                    {
                                      qualification: "",
                                      registrationNo: "",
                                      rollNo: "",
                                      examConductedBy: "",
                                      passingYear: "",
                                      marksObtained: "",
                                      affiliationBody: "",
                                    },
                                  ],
                                },
                              ])
                            }
                          >
                            + Add Post
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </>
            )}
            {currentStep === 8 && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #16a34a, #4ade80)",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: 2,
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  📊 Attendance Management
                </Typography>

                {/* ================= STUDENT ATTENDANCE ================= */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                >
                  📘 Student Attendance
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Grid container spacing={2}>
                    {/* Class */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        sx={{ minWidth: 220 }}
                        label="Class"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Section */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        sx={{ minWidth: 220 }}
                        label="Section"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                      >
                        {["A", "B", "C"].map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Month */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        type="month"
                        fullWidth
                        size="small"
                        label="Month"
                        InputLabelProps={{ shrink: true }}
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      />
                    </Grid>

                    {/* Upload Excel */}
                    <Grid item xs={12} md={3}>
                      <Button variant="outlined" component="label" fullWidth>
                        Upload Excel
                        <input type="file" hidden />
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Monthly Attendance */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#1976d2", mt: 2, mb: 1 }}
                  >
                    Monthly Attendance
                  </Typography>

                  <Box
                    sx={{
                      border: "1px solid #bbdefb",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      background: "#f0f7ff",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#1976d2",
                        mb: 2,
                        fontSize: 14,
                      }}
                    >
                      📅 Monthly Attendance — Class {selectedClass || "—"}
                      {selectedSection ? ` (Section ${selectedSection})` : ""}
                    </Typography>

                    {/* Guard — show message if class/section not selected */}
                    {!selectedClass || !selectedSection ? (
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontStyle: "italic",
                          fontSize: 13,
                        }}
                      >
                        Please select Class and Section above to record
                        attendance.
                      </Typography>
                    ) : (
                      <>
                        {(monthlyAttendance || []).map((att, aIdx) => {
                          const totalStudents = Number(att.totalStudents || 0);
                          const workingDays = Number(att.workingDays || 0);
                          const totalPresent = Number(att.totalPresent || 0);

                          // Avg Present/Day = Days Present ÷ Working Days
                          const avgPresent =
                            workingDays > 0 && totalPresent > 0
                              ? (totalPresent / workingDays).toFixed(1)
                              : null;

                          // Avg Absent/Day = Total Students - Avg Present/Day
                          const avgAbsent =
                            avgPresent !== null && totalStudents > 0
                              ? (totalStudents - Number(avgPresent)).toFixed(1)
                              : null;

                          const attendancePct =
                            workingDays > 0 && totalPresent > 0
                              ? ((totalPresent / workingDays) * 100).toFixed(1)
                              : null;
                          const updateAtt = (field, val) =>
                            setMonthlyAttendance((prev) =>
                              (prev || []).map((item, i) =>
                                i === aIdx ? { ...item, [field]: val } : item,
                              ),
                            );
                          return (
                            <Box
                              key={aIdx}
                              sx={{
                                border: "1px solid #e2e8f0",
                                borderRadius: 2,
                                p: 2,
                                mb: 2,
                                background: "#fff",
                                position: "relative",
                              }}
                            >
                              {/* Delete button */}
                              <Box
                                sx={{ position: "absolute", top: 8, right: 8 }}
                              >
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  sx={{
                                    minWidth: 0,
                                    px: 1,
                                    py: 0.2,
                                    fontSize: 12,
                                  }}
                                  onClick={() =>
                                    setMonthlyAttendance((prev) =>
                                      prev.filter((_, i) => i !== aIdx),
                                    )
                                  }
                                >
                                  ✕
                                </Button>
                              </Box>

                              <Grid container spacing={2} alignItems="center">
                                {/* Month dropdown */}
                                <Grid item xs={12} sm={6} md={3}>
                                  <TextField
                                    select
                                    label="Month"
                                    fullWidth
                                    size="small"
                                    sx={{ minWidth: 220 }}
                                    value={att.month}
                                    onChange={(e) =>
                                      updateAtt("month", e.target.value)
                                    }
                                  >
                                    {[
                                      "April",
                                      "May",
                                      "June",
                                      "July",
                                      "August",
                                      "September",
                                      "October",
                                      "November",
                                      "December",
                                      "January",
                                      "February",
                                      "March",
                                    ].map((m) => (
                                      <MenuItem key={m} value={m}>
                                        {m}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField
                                    label="Total Students"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={att.totalStudents}
                                    inputProps={{ min: 0 }}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (val < 0) return;
                                      updateAtt(
                                        "totalStudents",
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </Grid>

                                {/* Working Days */}
                                <Grid item xs={12} sm={6} md={2}>
                                  <TextField
                                    label="Working Days"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={att.workingDays}
                                    inputProps={{ min: 0, max: 31 }}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (val < 0) return;
                                      updateAtt("workingDays", e.target.value);
                                    }}
                                  />
                                </Grid>

                                {/* ✅ NEW — Days Present field */}
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField
                                    label="Days Present"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={att.totalPresent || ""}
                                    inputProps={{ min: 0 }}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (val < 0) return;
                                      updateAtt("totalPresent", e.target.value);
                                    }}
                                  />
                                </Grid>

                                {/* Avg Present/Day — auto calculated */}
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField
                                    label="Avg Present/Day"
                                    fullWidth
                                    size="small"
                                    value={
                                      avgPresent !== null ? avgPresent : ""
                                    }
                                    InputProps={{
                                      readOnly: true,
                                      sx: {
                                        background: "#f0fdf4",
                                        color: "#166534",
                                        fontWeight: 700,
                                      },
                                    }}
                                  />
                                </Grid>

                                {/* Avg Absent/Day — auto calculated */}
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField
                                    label="Avg Absent/Day"
                                    fullWidth
                                    size="small"
                                    value={avgAbsent !== null ? avgAbsent : ""}
                                    InputProps={{
                                      readOnly: true,
                                      sx: {
                                        background:
                                          avgAbsent > 0 ? "#fef2f2" : "#f0fdf4",
                                        color:
                                          avgAbsent > 0 ? "#991b1b" : "#166534",
                                        fontWeight: 700,
                                      },
                                    }}
                                  />
                                </Grid>

                                {/* Attendance % progress bar */}
                                <Grid item xs={12} sm={6} md={3}>
                                  {attendancePct !== null ? (
                                    <Box sx={{ px: 1 }}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          mb: 0.5,
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: 12,
                                            color: "#64748b",
                                          }}
                                        >
                                          Attendance
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: 13,
                                            fontWeight: 800,
                                            color:
                                              Number(attendancePct) >= 75
                                                ? "#16a34a"
                                                : Number(attendancePct) >= 50
                                                  ? "#d97706"
                                                  : "#dc2626",
                                          }}
                                        >
                                          {attendancePct}%
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          height: 8,
                                          background: "#e2e8f0",
                                          borderRadius: 4,
                                          overflow: "hidden",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            height: "100%",
                                            borderRadius: 4,
                                            width: `${Math.min(Number(attendancePct), 100)}%`,
                                            background:
                                              Number(attendancePct) >= 75
                                                ? "#16a34a"
                                                : Number(attendancePct) >= 50
                                                  ? "#f59e0b"
                                                  : "#dc2626",
                                            transition: "width 0.3s",
                                          }}
                                        />
                                      </Box>
                                      <Typography
                                        sx={{
                                          fontSize: 11,
                                          fontWeight: 600,
                                          mt: 0.5,
                                          color:
                                            Number(attendancePct) >= 75
                                              ? "#16a34a"
                                              : Number(attendancePct) >= 50
                                                ? "#d97706"
                                                : "#dc2626",
                                        }}
                                      >
                                        {Number(attendancePct) >= 75
                                          ? "🟢 Good"
                                          : Number(attendancePct) >= 50
                                            ? "🟡 Average"
                                            : "🔴 Low"}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography
                                      sx={{
                                        color: "#94a3b8",
                                        fontSize: 12,
                                        fontStyle: "italic",
                                        px: 1,
                                      }}
                                    >
                                      Fill working days & present to see %
                                    </Typography>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          );
                        })}

                        {/* Add month button */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            setMonthlyAttendance((prev) => [
                              ...prev,
                              { month: "", workingDays: "", present: "" },
                            ])
                          }
                        >
                          + Add Month
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
                {/* ================= TEACHER ATTENDANCE ================= */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                >
                  👩‍🏫 Teacher Attendance
                </Typography>

                {/* Global month + working days */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    bgcolor: "#f8faff",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        type="month"
                        size="small"
                        sx={{ minWidth: 220 }}
                        fullWidth
                        label="Month & Year"
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* ── TEACHING STAFF ── */}
                <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                  Teaching Staff
                </Typography>

                {teachRows.map((row, index) => {
                  const present = Math.max(
                    0,
                    (Number(row.workingDays) || 0) -
                      (Number(row.cl) || 0) -
                      (Number(row.el) || 0) -
                      (Number(row.ml) || 0) -
                      (Number(row.mat) || 0),
                  );
                  const absent = Math.max(
                    0,
                    (Number(row.workingDays) || 0) - present,
                  );

                  const updateField = (field, val) =>
                    setTeachRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, [field]: val } : r,
                      ),
                    );

                  return (
                    <Box
                      key={row.id}
                      sx={{
                        border: "1px solid #e2e8f0",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      {/* identity */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            label="Post"
                            value={row.post}
                            onChange={(e) =>
                              updateField("post", e.target.value)
                            }
                          >
                            <MenuItem value="Principal">Principal</MenuItem>
                            <MenuItem value="Vice Principal">
                              Vice Principal
                            </MenuItem>
                            <MenuItem value="PGT">PGT</MenuItem>
                            <MenuItem value="TGT">TGT</MenuItem>
                            <MenuItem value="PRT">PRT</MenuItem>
                            <MenuItem value="HM">HM</MenuItem>
                            <MenuItem value="Lecturer">Lecturer</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Name"
                            value={row.name}
                            onChange={(e) =>
                              updateField("name", e.target.value)
                            }
                            placeholder="Enter name"
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            label="Working Days"
                            type="number"
                            value={row.workingDays}
                            inputProps={{ min: 0, max: 31 }}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val < 0) return;
                              updateField("workingDays", val);
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={2}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {row.name &&
                            (() => {
                              const rate =
                                workingDays > 0
                                  ? Math.round((present / workingDays) * 100)
                                  : 0;
                              const bg =
                                rate >= 90
                                  ? "#e8f5e9"
                                  : rate >= 75
                                    ? "#fff8e1"
                                    : "#fce4ec";
                              const color =
                                rate >= 90
                                  ? "#2e7d32"
                                  : rate >= 75
                                    ? "#f57f17"
                                    : "#c62828";
                              const label =
                                rate >= 90
                                  ? "Good"
                                  : rate >= 75
                                    ? "Average"
                                    : "Low";
                              return (
                                <Chip
                                  size="small"
                                  label={`${rate}% · ${label}`}
                                  sx={{
                                    bgcolor: bg,
                                    color,
                                    fontWeight: 600,
                                    fontSize: 12,
                                  }}
                                />
                              );
                            })()}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
                          {teachRows.length > 1 && (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() =>
                                setTeachRows((p) =>
                                  p.filter((r) => r.id !== row.id),
                                )
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      </Grid>

                      {/* leave details */}
                      <Typography
                        sx={{ fontWeight: 600, mt: 2, mb: 1, fontSize: 14 }}
                      >
                        📌 Leave Details
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Casual Leave"
                            type="number"
                            value={row.cl}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("cl", e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Earned Leave"
                            type="number"
                            value={row.el}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("el", e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Medical Leave"
                            type="number"
                            value={row.ml}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("ml", e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Maternity/Paternity"
                            type="number"
                            value={row.mat}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("mat", e.target.value)}
                          />
                        </Grid>

                        {/* ✅ Present Days — auto calculated */}
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Present Days"
                            value={present}
                            InputProps={{
                              readOnly: true,
                              sx: {
                                bgcolor: "#f0fdf4",
                                color: "#166534",
                                fontWeight: 700,
                              },
                            }}
                          />
                        </Grid>

                        {/* ✅ Absent Days — auto calculated */}
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Absent Days"
                            value={absent}
                            InputProps={{
                              readOnly: true,
                              sx: {
                                bgcolor: "#fef2f2",
                                color: "#991b1b",
                                fontWeight: 700,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}

                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                  onClick={() =>
                    setTeachRows((p) => [
                      ...p,
                      {
                        id: Date.now(),
                        post: "",
                        name: "",
                        cl: "",
                        el: "",
                        ml: "",
                        mat: "",
                      },
                    ])
                  }
                >
                  + Add Teaching Staff
                </Button>

                {/* ── NON-TEACHING STAFF ── */}
                <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                  Non-Teaching Staff
                </Typography>

                {ntRows.map((row) => {
                  const present = Math.max(
                    0,
                    (Number(row.workingDays) || 0) -
                      (Number(row.cl) || 0) -
                      (Number(row.el) || 0) -
                      (Number(row.ml) || 0) -
                      (Number(row.mat) || 0),
                  );
                  const absent = Math.max(
                    0,
                    (Number(row.workingDays) || 0) - present,
                  );

                  const updateField = (field, val) =>
                    setNtRows((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, [field]: val } : r,
                      ),
                    );

                  return (
                    <Box
                      key={row.id}
                      sx={{
                        border: "1px solid #e2e8f0",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            label="Post"
                            value={row.post}
                            onChange={(e) =>
                              updateField("post", e.target.value)
                            }
                          >
                            <MenuItem value="Librarian">Librarian</MenuItem>
                            <MenuItem value="Lab Assistant">
                              Lab Assistant
                            </MenuItem>
                            <MenuItem value="Clerk">Clerk</MenuItem>
                            <MenuItem value="Accountant">Accountant</MenuItem>
                            <MenuItem value="Peon">Peon</MenuItem>
                            <MenuItem value="Security Guard">
                              Security Guard
                            </MenuItem>
                            <MenuItem value="Computer Operator">
                              Computer Operator
                            </MenuItem>
                            <MenuItem value="Sweeper">Sweeper</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label=" Name"
                            value={row.name}
                            onChange={(e) =>
                              updateField("name", e.target.value)
                            }
                            placeholder="Enter name"
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            sx={{ minWidth: 220 }}
                            label="Working Days"
                            type="number"
                            value={row.workingDays}
                            inputProps={{ min: 0, max: 31 }}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val < 0) return;
                              updateField("workingDays", val);
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
                          {ntRows.length > 1 && (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() =>
                                setNtRows((p) =>
                                  p.filter((r) => r.id !== row.id),
                                )
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      </Grid>

                      <Typography
                        sx={{ fontWeight: 600, mt: 2, mb: 1, fontSize: 14 }}
                      >
                        📌 Leave Details
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Casual Leave"
                            type="number"
                            value={row.cl}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("cl", e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Earned Leave"
                            type="number"
                            value={row.el}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("el", e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Medical Leave"
                            type="number"
                            value={row.ml}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("ml", e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Maternity/Paternity"
                            type="number"
                            value={row.mat}
                            inputProps={{ min: 0 }}
                            onChange={(e) => updateField("mat", e.target.value)}
                          />
                        </Grid>

                        {/* ✅ Present Days — auto calculated */}
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Present Days"
                            value={present}
                            InputProps={{
                              readOnly: true,
                              sx: {
                                bgcolor: "#f0fdf4",
                                color: "#166534",
                                fontWeight: 700,
                              },
                            }}
                          />
                        </Grid>

                        {/* ✅ Absent Days — auto calculated */}
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Absent Days"
                            value={absent}
                            InputProps={{
                              readOnly: true,
                              sx: {
                                bgcolor: "#fef2f2",
                                color: "#991b1b",
                                fontWeight: 700,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}

                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                  onClick={() =>
                    setNtRows((p) => [
                      ...p,
                      {
                        id: Date.now(),
                        post: "",
                        name: "",
                        cl: "",
                        el: "",
                        ml: "",
                        mat: "",
                      },
                    ])
                  }
                >
                  + Add Non-Teaching Staff
                </Button>

                {/* ── PUBLIC HOLIDAYS ── */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}
                >
                  📅 Public Holidays
                </Typography>
              </>
            )}
            {currentStep === 9 && (
              <>
                {/* ================= OPERATIONAL COST DETAILS ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Operational Cost Details
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ overflowX: "auto", mb: 2 }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: 700,
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          "S.No",
                          "Year",
                          "Month",
                          "Cost Type",
                          "Amount (₹)",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              background: "#1976d2",
                              color: "#fff",
                              padding: "10px 12px",
                              fontSize: 13,
                              fontWeight: 600,
                              textAlign: "left",
                              whiteSpace: "nowrap",
                              borderRight: "1px solid rgba(255,255,255,0.2)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {operationalCostRows.map((row, index) => (
                        <tr
                          key={index}
                          style={{
                            background: index % 2 === 0 ? "#f8fafc" : "#fff",
                          }}
                        >
                          <td
                            style={{
                              padding: "8px 12px",
                              border: "1px solid #e2e8f0",
                              textAlign: "center",
                              color: "#94a3b8",
                              fontWeight: 700,
                              width: 50,
                              fontSize: 13,
                            }}
                          >
                            {index + 1}
                          </td>

                          <td
                            style={{
                              padding: "6px 8px",
                              border: "1px solid #e2e8f0",
                              minWidth: 130,
                            }}
                          >
                            <TextField
                              select
                              fullWidth
                              size="small"
                              value={row.year}
                              onChange={(e) => {
                                const u = [...operationalCostRows];
                                u[index].year = e.target.value;
                                setOperationalCostRows(u);
                              }}
                            >
                              {["2024-2025", "2025-2026", "2026-2027"].map(
                                (y) => (
                                  <MenuItem key={y} value={y}>
                                    {y}
                                  </MenuItem>
                                ),
                              )}
                            </TextField>
                          </td>

                          <td
                            style={{
                              padding: "6px 8px",
                              border: "1px solid #e2e8f0",
                              minWidth: 140,
                            }}
                          >
                            <TextField
                              select
                              fullWidth
                              size="small"
                              value={row.month}
                              onChange={(e) => {
                                const u = [...operationalCostRows];
                                u[index].month = e.target.value;
                                setOperationalCostRows(u);
                              }}
                            >
                              {[
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                                "January",
                                "February",
                                "March",
                              ].map((m) => (
                                <MenuItem key={m} value={m}>
                                  {m}
                                </MenuItem>
                              ))}
                            </TextField>
                          </td>

                          <td
                            style={{
                              padding: "6px 8px",
                              border: "1px solid #e2e8f0",
                              minWidth: 220,
                            }}
                          >
                            <TextField
                              select
                              fullWidth
                              size="small"
                              value={row.costType}
                              onChange={(e) => {
                                const u = [...operationalCostRows];
                                u[index].costType = e.target.value;
                                setOperationalCostRows(u);
                              }}
                            >
                              {[
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
                              ].map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </TextField>
                          </td>

                          <td
                            style={{
                              padding: "6px 8px",
                              border: "1px solid #e2e8f0",
                              minWidth: 140,
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={row.amount}
                              placeholder="0"
                              inputProps={{ min: 0 }}
                              onKeyDown={(e) => {
                                if (e.key === "-" || e.key === "e")
                                  e.preventDefault();
                              }}
                              onChange={(e) => {
                                if (Number(e.target.value) >= 0) {
                                  const u = [...operationalCostRows];
                                  u[index].amount = e.target.value;
                                  setOperationalCostRows(u);
                                }
                              }}
                            />
                          </td>

                          <td
                            style={{
                              padding: "6px 8px",
                              border: "1px solid #e2e8f0",
                              textAlign: "center",
                              width: 90,
                            }}
                          >
                            <Box
                              display="flex"
                              gap={0.5}
                              justifyContent="center"
                            >
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  minWidth: 0,
                                  px: 1.2,
                                  py: 0.3,
                                  fontSize: 16,
                                  backgroundColor: "#f59e0b",
                                  "&:hover": { backgroundColor: "#d97706" },
                                }}
                                onClick={() => {
                                  const u = [...operationalCostRows];
                                  u.splice(index + 1, 0, {
                                    year: "",
                                    month: "",
                                    costType: "",
                                    amount: "",
                                  });
                                  setOperationalCostRows(u);
                                }}
                              >
                                +
                              </Button>
                              {operationalCostRows.length > 1 && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  sx={{
                                    minWidth: 0,
                                    px: 1,
                                    py: 0.3,
                                    fontSize: 13,
                                  }}
                                  onClick={() => {
                                    const u = [...operationalCostRows];
                                    u.splice(index, 1);
                                    setOperationalCostRows(u);
                                  }}
                                >
                                  ✕
                                </Button>
                              )}
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>

                {/* Running Total */}
                {operationalCostRows.some((r) => r.amount) && (
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)",
                      border: "1px solid #90caf9",
                      borderRadius: 2,
                      p: 2,
                      mb: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 700, color: "#1976d2", fontSize: 15 }}
                    >
                      💰 Total Operational Cost
                    </Typography>
                    <Typography
                      sx={{ fontWeight: 800, color: "#1976d2", fontSize: 18 }}
                    >
                      ₹
                      {operationalCostRows
                        .reduce((sum, r) => sum + Number(r.amount || 0), 0)
                        .toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                )}
              </>
            )}
            {currentStep === 10 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Financial Management and Procurement Compliance
                    </Typography>
                  </Grid>
                </Grid>
                {/* --- Add your Financial Management and Procurement Compliance fields here --- */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 3,
                    background: "#fff",
                    mb: 4,
                  }}
                >
                  <Grid container spacing={2}>
                    {/* NEW Academic Year Dropdown */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        sx={{ minWidth: 220 }}
                        label="Academic Year"
                      >
                        <MenuItem value="2023-2024">2023-2024</MenuItem>
                        <MenuItem value="2024-2025">2024-2025</MenuItem>
                        <MenuItem value="2025-2026">2025-2026</MenuItem>
                        <MenuItem value="2027-2028">2027-2028</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  {/* Procurement through GeM Portal */}
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>
                    Procurement through GeM Portal (5 Marks)
                  </Typography>

                  {/* Add Procurement Button */}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setProcurementDialogOpen(true)}
                    sx={{ mb: 2, backgroundColor: "#1976d2" }}
                  >
                    + Add Procurement
                  </Button>

                  {/* Procurement Entries Table */}
                  {procurements.length > 0 && (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #e0e0e0",
                        marginBottom: 16,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#e3f2fd" }}>
                          <th style={thStyle}>Type</th>
                          <th style={thStyle}>Description</th>
                          <th style={thStyle}>Total No.</th>
                          <th style={thStyle}>Order Date</th>
                          <th style={thStyle}>Value (₹)</th>
                          <th style={thStyle}>Vendor</th>
                          <th style={thStyle}>Through GeM</th>
                          <th style={thStyle}>GeM %</th>
                          <th style={thStyle}>Marks</th>
                          <th style={thStyle}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {procurements.map((p, i) => {
                          const rowPct =
                            Number(p.totalNumber) > 0
                              ? (
                                  (Number(p.throughGem) /
                                    Number(p.totalNumber)) *
                                  100
                                ).toFixed(2)
                              : "0.00";
                          const rowMarks = getGemMarks(rowPct);
                          return (
                            <tr key={i}>
                              <td style={tdStyle}>{p.type}</td>
                              <td style={tdStyle}>{p.description}</td>
                              <td style={tdStyle}>{p.totalNumber}</td>
                              <td style={tdStyle}>{p.orderDate}</td>
                              <td style={tdStyle}>{p.value}</td>
                              <td style={tdStyle}>{p.vendor}</td>
                              <td style={tdStyle}>{p.throughGem}</td>
                              <td style={tdStyle}>{rowPct}%</td>
                              <td style={tdStyle}>{rowMarks}</td>
                              <td style={tdStyle}>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  onClick={() =>
                                    setProcurements((prev) =>
                                      prev.filter((_, idx) => idx !== i),
                                    )
                                  }
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  {/* Marking Criteria Table */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      *Marking Criteria (Out of 5) - GeM Procurement Percentage
                    </Typography>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                          <th style={thStyle}>GeM Procurement Percentage</th>
                          <th style={thStyle}>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "100% procurement through GeM", marks: 5 },
                          {
                            label: "75% – 99% procurement through GeM",
                            marks: 4,
                          },
                          {
                            label: "50% – 74% procurement through GeM",
                            marks: 3,
                          },
                          {
                            label: "25% – 49% procurement through GeM",
                            marks: 1,
                          },
                          { label: "Below 25%", marks: 0 },
                        ].map((row, i) => (
                          <tr
                            key={i}
                            style={{
                              background:
                                gemMarks === row.marks &&
                                procurements.length > 0
                                  ? "#e8f5e9"
                                  : "white",
                            }}
                          >
                            <td style={tdStyle}>{row.label}</td>
                            <td style={tdStyle}>{row.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Grid>

                  {/* Add Procurement Dialog */}
                  <Dialog
                    open={procurementDialogOpen}
                    onClose={() => setProcurementDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                  >
                    <DialogTitle
                      sx={{ backgroundColor: "#1976d2", color: "white" }}
                    >
                      Add Procurement Entry
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                      <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Type of Procurement</InputLabel>
                            <Select
                              value={currentProcurement.type}
                              label="Type of Procurement"
                              onChange={(e) =>
                                setCurrentProcurement((prev) => ({
                                  ...prev,
                                  type: e.target.value,
                                }))
                              }
                            >
                              <MenuItem value="Goods">Goods</MenuItem>
                              <MenuItem value="Services">Services</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Description"
                            value={currentProcurement.description}
                            onChange={(e) =>
                              setCurrentProcurement((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Total Number of Procurements"
                            type="number"
                            value={currentProcurement.totalNumber}
                            onChange={(e) =>
                              setCurrentProcurement((prev) => ({
                                ...prev,
                                totalNumber: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Procurement Order Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={currentProcurement.orderDate}
                            onChange={(e) =>
                              setCurrentProcurement((prev) => ({
                                ...prev,
                                orderDate: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Procurement Value (₹)"
                            type="number"
                            value={currentProcurement.value}
                            onChange={(e) =>
                              setCurrentProcurement((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Vendor"
                            value={currentProcurement.vendor}
                            onChange={(e) =>
                              setCurrentProcurement((prev) => ({
                                ...prev,
                                vendor: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Procurement through GeM Portal (count)"
                            type="number"
                            value={currentProcurement.throughGem}
                            onChange={(e) =>
                              setCurrentProcurement((prev) => ({
                                ...prev,
                                throughGem: e.target.value,
                              }))
                            }
                          />
                        </Grid>

                        {/* Live preview inside dialog */}
                        {currentProcurement.totalNumber &&
                          currentProcurement.throughGem && (
                            <Grid item xs={12}>
                              <Typography
                                variant="body2"
                                sx={{ color: "#1976d2", fontWeight: 600 }}
                              >
                                GeM %:{" "}
                                {(
                                  (Number(currentProcurement.throughGem) /
                                    Number(currentProcurement.totalNumber)) *
                                  100
                                ).toFixed(2)}
                                % &nbsp;→&nbsp; Marks:{" "}
                                {getGemMarks(
                                  (
                                    (Number(currentProcurement.throughGem) /
                                      Number(currentProcurement.totalNumber)) *
                                    100
                                  ).toFixed(2),
                                )}
                              </Typography>
                            </Grid>
                          )}
                      </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                      <Button
                        onClick={() => {
                          setCurrentProcurement({
                            type: "",
                            description: "",
                            totalNumber: "",
                            orderDate: "",
                            value: "",
                            vendor: "",
                            throughGem: "",
                          });
                          setProcurementDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        disabled={
                          !currentProcurement.type ||
                          !currentProcurement.totalNumber ||
                          !currentProcurement.throughGem
                        }
                        onClick={() => {
                          setProcurements((prev) => [
                            ...prev,
                            currentProcurement,
                          ]);
                          setCurrentProcurement({
                            type: "",
                            description: "",
                            totalNumber: "",
                            orderDate: "",
                            value: "",
                            vendor: "",
                            throughGem: "",
                          });
                          setProcurementDialogOpen(false);
                        }}
                      >
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>
                    Fund Utilization Efficiency
                  </Typography>
                  <Grid container spacing={2}>
                    {/* KPI: Fund Utilization Efficiency */}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Total Funds Allocated"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={financialData.totalFundsAllocated}
                        onChange={(e) =>
                          handleFundsChange(
                            "totalFundsAllocated",
                            e.target.value,
                          )
                        }
                      />
                    </Grid>

                    {/* Total Funds Utilized */}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Total Funds Utilized"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={financialData.totalFundsUtilized}
                        onChange={(e) =>
                          handleFundsChange(
                            "totalFundsUtilized",
                            e.target.value,
                          )
                        }
                      />
                    </Grid>

                    {/* Utilization Percentage - NOW READ ONLY, auto-calculated */}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Utilization Percentage (%)"
                        type="number"
                        value={financialData.utilizationPercentage}
                        InputProps={{ readOnly: true }} // ← add readOnly here
                      />
                    </Grid>

                    {/* Marks Obtained */}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Marks Obtained"
                        type="number"
                        InputProps={{ readOnly: true }}
                        value={financialData.fundUtilMarksObtained}
                      />
                    </Grid>

                    {/* Audit Conducted Annually */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Audit Conducted Annually"
                      />
                    </Grid>
                    {/* Marking Criteria for Fund Utilization (Visual Table) - MOVED HERE */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        *Marking Criteria (Out of 5) - Fund Utilization
                      </Typography>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <thead>
                          <tr style={{ background: "#f5f5f5" }}>
                            <th
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                                textAlign: "left",
                              }}
                            >
                              Fund Utilization
                            </th>
                            <th
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                                textAlign: "left",
                              }}
                            >
                              Marks
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              95% – 100%
                            </td>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              5
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              70% – 94%
                            </td>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              3
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              50% – 69%
                            </td>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              1
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              Below 50%
                            </td>
                            <td
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                              }}
                            >
                              0
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </Box>
                {/* ===== RECURRING COST BREAKUP TABLE ===== */}
                <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>
                  Component-wise Breakup of Recurring Fund (300 Students)
                </Typography>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #e0e0e0",
                    marginBottom: "24px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#1976d2", color: "#fff" }}>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        S.No
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Component
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          width: "140px",
                        }}
                      >
                        Max. Permissible Annual Expenditure per Student (w.e.f.
                        01.04.2025) (A)
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          width: "150px",
                        }}
                      >
                        Max. Permissible Annual Expenditure for FY 2025-26 for
                        300 Students as per MIS Portal (B) = (A) × 300
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          width: "140px",
                        }}
                      >
                        Fund Demanded by State Society for FY 2025-26 (C)
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          width: "140px",
                        }}
                      >
                        Funds Already Released to the Society (D)
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          width: "150px",
                        }}
                      >
                        Fund Released for Remaining Period of FY 2025-26 (E)
                      </th>
                      <th
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "left",
                          width: "160px",
                        }}
                      >
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recurringBreakup.map((row, index) => (
                      <tr
                        key={index}
                        style={{
                          background: index % 2 === 0 ? "#fafafa" : "#fff",
                          verticalAlign: "middle",
                        }}
                      >
                        {/* S.No */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {row.sno}
                        </td>

                        {/* Component - read only, auto populated */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "8px",
                            fontWeight: "500",
                            color: "#333",
                          }}
                        >
                          {row.component}
                        </td>

                        {/* Column A - user input */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                            textAlign: "right",
                          }}
                        >
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{
                              min: 0,
                              style: { textAlign: "right" },
                            }}
                            value={row.colA}
                            onChange={(e) =>
                              handleBreakupChange(index, "colA", e.target.value)
                            }
                            sx={{ width: "130px" }}
                          />
                        </td>

                        {/* Column B - auto calculated = A × 300 */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                            textAlign: "right",
                          }}
                        >
                          <TextField
                            size="small"
                            type="number"
                            value={(Number(row.colA) || 0) * 300}
                            InputProps={{ readOnly: true }}
                            inputProps={{
                              style: {
                                textAlign: "right",
                                background: "#f0f4ff",
                                color: "#1976d2",
                              },
                            }}
                            sx={{ width: "140px" }}
                          />
                        </td>

                        {/* Column C - user input */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                            textAlign: "right",
                          }}
                        >
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{
                              min: 0,
                              style: { textAlign: "right" },
                            }}
                            value={row.colC}
                            onChange={(e) =>
                              handleBreakupChange(index, "colC", e.target.value)
                            }
                            sx={{ width: "130px" }}
                          />
                        </td>

                        {/* Column D - user input */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                            textAlign: "right",
                          }}
                        >
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{
                              min: 0,
                              style: { textAlign: "right" },
                            }}
                            value={row.colD}
                            onChange={(e) =>
                              handleBreakupChange(index, "colD", e.target.value)
                            }
                            sx={{ width: "130px" }}
                          />
                        </td>

                        {/* Column E - user input */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                            textAlign: "right",
                          }}
                        >
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{
                              min: 0,
                              style: { textAlign: "right" },
                            }}
                            value={row.colE}
                            onChange={(e) =>
                              handleBreakupChange(index, "colE", e.target.value)
                            }
                            sx={{ width: "140px" }}
                          />
                        </td>

                        {/* Remarks - user input */}
                        <td
                          style={{
                            border: "1px solid #e0e0e0",
                            padding: "4px",
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Remarks"
                            value={row.remarks}
                            onChange={(e) =>
                              handleBreakupChange(
                                index,
                                "remarks",
                                e.target.value,
                              )
                            }
                            sx={{ width: "150px" }}
                          />
                        </td>
                      </tr>
                    ))}

                    {/* TOTAL ROW */}
                    <tr style={{ background: "#e3f2fd" }}>
                      <td
                        colSpan={2}
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        TOTAL
                      </td>
                      <td
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹
                        {recurringBreakup
                          .reduce((sum, r) => sum + (Number(r.colA) || 0), 0)
                          .toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹
                        {recurringBreakup
                          .reduce(
                            (sum, r) => sum + (Number(r.colA) || 0) * 300,
                            0,
                          )
                          .toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹
                        {recurringBreakup
                          .reduce((sum, r) => sum + (Number(r.colC) || 0), 0)
                          .toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹
                        {recurringBreakup
                          .reduce((sum, r) => sum + (Number(r.colD) || 0), 0)
                          .toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹
                        {recurringBreakup
                          .reduce((sum, r) => sum + (Number(r.colE) || 0), 0)
                          .toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{ border: "1px solid #e0e0e0", padding: "8px" }}
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            {currentStep === 11 && (
              <>
                {/* ================= IMAGE UPLOAD SECTION ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #1976d2, #42a5f5)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 2,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      EMRS Image
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setOpenImageDialog(true)}
                  >
                    Add Photo
                  </Button>
                </Grid>
                {/* Preview */}
                {uploadedImage && (
                  <Grid item xs={12} md={4}>
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginTop: "16px",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", mt: 0.5, display: "block" }}
                    >
                      📎 {uploadedImage.name}
                    </Typography>
                  </Grid>
                )}
                {/* ── PREVIEW ── */}
                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    p: 3,
                    mb: 3,
                    background: "#f8fafc",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}
                  >
                    📋 Preview & Confirm
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        School Name
                      </Typography>
                      <Typography fontWeight={600}>
                        {watch("schoolname") || "—"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        EMRS Code
                      </Typography>
                      <Typography fontWeight={600}>
                        {watch("EMRScode") || "—"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Principal Name
                      </Typography>
                      <Typography fontWeight={600}>
                        {watch("NameofthePrincipal") || "—"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        District
                      </Typography>
                      <Typography fontWeight={600}>
                        {watch("district") || "—"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Affiliation
                      </Typography>
                      <Typography fontWeight={600}>
                        {watch("Affiliation") || "—"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        School Type
                      </Typography>
                      <Typography fontWeight={600}>
                        {watch("schooltype") || "—"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Teaching Staff Records
                      </Typography>
                      <Typography fontWeight={600}>
                        {teachingRows.length} record(s)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Non-Teaching Staff Records
                      </Typography>
                      <Typography fontWeight={600}>
                        {nonTeachingRows.length} record(s)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Enrollment Records
                      </Typography>
                      <Typography fontWeight={600}>
                        {enrollmentRows.length} class(es)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Hospitalization Cases
                      </Typography>
                      <Typography fontWeight={600}>
                        {hospitalizationRows.length} case(s)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Extra Curricular Activities
                      </Typography>
                      <Typography fontWeight={600}>
                        {extraCurricularRows.length} activity(s)
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Submit */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        background:
                          "linear-gradient(to right, #16a34a, #4ade80)",
                        minWidth: 160,
                      }}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        ) : null
                      }
                    >
                      {loading ? "Submitting..." : "✅ Submit"}
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
            {/* ================= NAVIGATION BUTTONS ================= */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={4}
              pt={3}
              sx={{ borderTop: "1px solid #e2e8f0" }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={currentStep === 0}
                sx={{ minWidth: 120 }}
              >
                ← Back
              </Button>

              <Typography
                sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}
              >
                Step {currentStep + 1} of {STEPS.length}
              </Typography>

              {currentStep < STEPS.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    minWidth: 150,
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
                  }}
                >
                  Save & Next →
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Select Image Option</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {/* Capture Photo */}
          <Button variant="outlined" component="label">
            📷 Capture Photo
            <input
              type="file"
              hidden
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                handleImageUpload(e.target.files[0]);
                setOpenImageDialog(false);
              }}
            />
          </Button>

          {/* Upload From Device */}
          <Button variant="outlined" component="label">
            🖼 Upload From Device
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e.target.files[0]);
                setOpenImageDialog(false);
              }}
            />
          </Button>
        </DialogContent>
        <Dialog open={submitSuccess} onClose={() => setSubmitSuccess(false)}>
          <DialogTitle sx={{ color: "#16a34a", fontWeight: 700 }}>
            ✅ Form Uploaded Successfully!
          </DialogTitle>
          <DialogContent>
            <Typography>
              Your EMRS form has been submitted successfully. You can view it in
              the <strong>Submitted Forms</strong> section below.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setSubmitSuccess(false)}
              variant="contained"
              color="success"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EMRSForm
