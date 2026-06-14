import React, { useState, useEffect } from "react";
import SchoolDetails from "./Steps/SchoolDetails";
import InfrastructureDetails from "./Steps/Infrastructure";
import ConstructionDetails from "./Steps/Construction";
import ExtraCurricular from "./Steps/ExtraCurricular";
import OperationalCost from "./Steps/OperationalCost";
import {
  emrsBasicFields,
  emrsLocationFields,
  emrsInfrastructureFields,
  boysHostelFields,
  girlsHostelFields,
  enrollmentFields,
  academicFields,
  achievementLevels,
  teachingStaffSummaryFields,
  nonTeachingStaffDetailFields,
  qualificationOptions,
  tetQualificationOptions,
  professionalQualificationOptions,
  operationalCostFields,
} from "./Steps/constants/emrsfields";
import StaffAttendance from "./Steps/StaffDetails";
import HostelDetails from "./Steps/Hostel";
import Enrollment from "./Steps/Enrollment";
import HospitalizationSection from "./Steps/Hospitalization";
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
  Alert,
  Collapse,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { SCHOOL_CREDENTIALS } from "./Schoolcredentials";
import {
  sanitizeConstructionComponents,
  toSafeNumber,
  toOptionalNumber,
  validateEmrsFormData,
} from "./utils/emrsPayloadUtils";

const thStyle = {
  border: "1px solid #e0e0e0",
  padding: "8px",
  textAlign: "left",
  fontWeight: 600,
};
const tdStyle = { border: "1px solid #e0e0e0", padding: "8px" };

// ── Validation Error Panel ────────────────────────────────────────────────────
const ValidationErrorPanel = ({ errors, onDismiss }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <Box
      sx={{
        mb: 3,
        border: "1px solid #fca5a5",
        borderRadius: 2,
        background: "#fff1f2",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.2,
          background: "#fee2e2",
          borderBottom: "1px solid #fca5a5",
        }}
      >
        <ErrorOutlineIcon sx={{ color: "#dc2626", fontSize: 20 }} />
        <Typography
          sx={{ fontWeight: 700, color: "#dc2626", fontSize: 14, flex: 1 }}
        >
          Please fix {errors.length} issue{errors.length > 1 ? "s" : ""} before
          continuing
        </Typography>
        <Button
          size="small"
          onClick={onDismiss}
          sx={{ color: "#dc2626", minWidth: 0, px: 1, fontWeight: 700 }}
        >
          ✕
        </Button>
      </Box>
      <Box component="ul" sx={{ m: 0, pl: 3, py: 1.5 }}>
        {errors.map((err, i) => (
          <Box
            component="li"
            key={i}
            sx={{ color: "#7f1d1d", fontSize: 13, mb: 0.4, lineHeight: 1.6 }}
          >
            {err}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ── Per-step validation ───────────────────────────────────────────────────────
// Returns an array of error strings. Empty array = valid.
const validateStepByIndex = (stepIndex, ctx) => {
  const errors = [];
  const {
    data = {},
    constructionRows,
    operationalCostRows,
    enrollmentRows,
    extraCurricularRows,
    teachingRows,
    nonTeachingRows,
    hospitalizationRows,
    messData,
    selectedClass,
    selectedSection,
    selectedMonth,
    monthlyAttendance,
    teachRows,
    ntRows,
    financialData,
    procurements,
    uploadedImage,
    monthYear,
  } = ctx;

  switch (stepIndex) {
    // ── Step 0: School Details ─────────────────────────────────────────────
    case 0: {
      if (!data.EMRScode?.trim()) errors.push("EMRS Code is required.");
      if (!data.schoolname?.trim()) errors.push("School Name is required.");
      if (!data.schooltype?.trim()) errors.push("School Type is required.");
      const affiliation = (data.affiliation || data.Affiliation || "").trim();
      if (!affiliation) errors.push("Affiliation is required.");
      if (!data.principalAvailable) errors.push("Principal Available field is required.");
      if (!data.contactno?.trim()) errors.push("Contact Number is required.");
      else if (!/^\d{10}$/.test(data.contactno.trim()))
        errors.push("Contact Number must be exactly 10 digits.");
      if (!data.emailid?.trim()) errors.push("Email ID is required.");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailid.trim()))
        errors.push("Email ID is not valid.");
      if (!data.pincode?.trim()) errors.push("Pincode is required.");
      else if (!/^\d{6}$/.test(data.pincode.trim()))
        errors.push("Pincode must be exactly 6 digits.");
      if (!data.district?.trim()) errors.push("District is required.");
      if (!data.block?.trim()) errors.push("Block is required.");
      break;
    }

    // ── Step 1: Infrastructure ─────────────────────────────────────────────
    case 1: {
      if (!data.totalClassrooms && data.totalClassrooms !== 0)
        errors.push("Total Classrooms is required.");
      else if (Number(data.totalClassrooms) < 0)
        errors.push("Total Classrooms cannot be negative.");
      // Soft checks — just warn if labs not filled
      break;
    }

    // ── Step 2: Construction ───────────────────────────────────────────────
    case 2: {
      // No hard-required fields; construction rows are optional.
      break;
    }

    // ── Step 3: Hostel ─────────────────────────────────────────────────────
    case 3: {
      if (!data.boysHostelCapacity && data.boysHostelCapacity !== 0)
        errors.push("Boys Hostel Capacity is required.");
      if (!data.girlsHostelCapacity && data.girlsHostelCapacity !== 0)
        errors.push("Girls Hostel Capacity is required.");
      break;
    }

    // ── Step 4: Enrollment ─────────────────────────────────────────────────
    case 4: {
      if (!enrollmentRows || enrollmentRows.length === 0) {
        errors.push("At least one enrollment record is required.");
      } else {
        enrollmentRows.forEach((row, i) => {
          if (!row.academicYear)
            errors.push(`Enrollment row ${i + 1}: Academic Year is required.`);
          if (!row.class)
            errors.push(`Enrollment row ${i + 1}: Class is required.`);
          if (!row.section)
            errors.push(`Enrollment row ${i + 1}: Section is required.`);
        });
      }
      break;
    }

    // ── Step 5: Extra Curricular ───────────────────────────────────────────
    case 5: {
      if (extraCurricularRows && extraCurricularRows.length > 0) {
        extraCurricularRows.forEach((row, i) => {
          if (!row.academicYear)
            errors.push(`Extra Curricular row ${i + 1}: Academic Year is required.`);
          if (!row.initiativeName?.trim())
            errors.push(`Extra Curricular row ${i + 1}: Initiative Name is required.`);
        });
      }
      break;
    }

    // ── Step 6: Hospitalization ────────────────────────────────────────────
    case 6: {
      // Hospitalization rows are optional case-by-case data.
      break;
    }

    // ── Step 7: Staff Details ──────────────────────────────────────────────
    case 7: {
      if (!teachingRows || teachingRows.length === 0) {
        errors.push("At least one Teaching Staff record is required.");
      } else {
        teachingRows.forEach((row, i) => {
          if (!row.post)
            errors.push(`Teaching Staff ${i + 1}: Post is required.`);
          const name = (row.name || row.staffName || "").trim();
          if (!name)
            errors.push(`Teaching Staff ${i + 1}: Name is required.`);
        });
      }
      break;
    }

    // ── Step 8: Attendance ─────────────────────────────────────────────────
    case 8: {
      if (!selectedClass) errors.push("Please select a Class for student attendance.");
      if (!selectedSection) errors.push("Please select a Section for student attendance.");
      if (!monthYear) errors.push("Month & Year is required for teacher attendance.");
      if (teachRows && teachRows.length > 0) {
        teachRows.forEach((row, i) => {
          if (!row.post) errors.push(`Teaching Staff attendance row ${i + 1}: Post is required.`);
          if (!row.name?.trim()) errors.push(`Teaching Staff attendance row ${i + 1}: Name is required.`);
        });
      }
      break;
    }

    // ── Step 9: Operational Cost ───────────────────────────────────────────
    case 9: {
      if (!operationalCostRows || operationalCostRows.length === 0) {
        errors.push("At least one Operational Cost record is required.");
      } else {
        operationalCostRows.forEach((row, i) => {
          if (!row.year) errors.push(`Operational Cost row ${i + 1}: Year is required.`);
          if (!row.month) errors.push(`Operational Cost row ${i + 1}: Month is required.`);
          if (!row.costType) errors.push(`Operational Cost row ${i + 1}: Cost Type is required.`);
          if (!row.amount && row.amount !== 0)
            errors.push(`Operational Cost row ${i + 1}: Amount is required.`);
          else if (Number(row.amount) < 0)
            errors.push(`Operational Cost row ${i + 1}: Amount cannot be negative.`);
        });
      }
      break;
    }

    // ── Step 10: Financial & Procurement ──────────────────────────────────
    case 10: {
      if (!financialData?.academicYear)
        errors.push("Academic Year is required.");
      if (!financialData?.totalFundsAllocated && financialData?.totalFundsAllocated !== 0)
        errors.push("Total Funds Allocated is required.");
      else if (Number(financialData?.totalFundsAllocated) <= 0)
        errors.push("Total Funds Allocated must be greater than 0.");
      if (!financialData?.totalFundsUtilized && financialData?.totalFundsUtilized !== 0)
        errors.push("Total Funds Utilized is required.");
      else if (Number(financialData?.totalFundsUtilized) < 0)
        errors.push("Total Funds Utilized cannot be negative.");
      if (!financialData?.auditConducted)
        errors.push("Please specify whether Audit was conducted annually.");
      break;
    }

    // ── Step 11: Image Upload ──────────────────────────────────────────────
    case 11: {
      if (!uploadedImage) errors.push("An EMRS photo is required before submitting.");
      break;
    }

    default:
      break;
  }

  return errors;
};

const EMRSForm = ({ addSubmittedForm }) => {
  const { user } = useAuth();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [stepErrors, setStepErrors] = useState([]);

  const handleImageUpload = (file) => {
    if (!file) return;
    setUploadedImage(file);
    setValue("emrsImage", file);
    setStepErrors((prev) => prev.filter((e) => !e.toLowerCase().includes("photo")));
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [safetyCompliance, setSafetyCompliance] = useState({
    totalFireExtinguishers: "",
    functionalFireExtinguishers: "",
    electricalSafetyInspection: "No",
    fireSafetyDrillConducted: "No",
  });

  const handleFundsChange = (field, value) => {
    setFinancialData((prev) => {
      const updated = { ...prev, [field]: value };
      const allocated = parseFloat(
        field === "totalFundsAllocated" ? value : prev.totalFundsAllocated
      );
      const utilized = parseFloat(
        field === "totalFundsUtilized" ? value : prev.totalFundsUtilized
      );
      if (!isNaN(allocated) && allocated > 0 && !isNaN(utilized) && utilized >= 0) {
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
    { label: "Attendance", icon: "📅" },
    { label: "Operational Cost", icon: "💰" },
    { label: "Financial & Procurement Compliance", icon: "📊" },
    { label: "EMRS Image Upload", icon: "📸" },
  ];

  // ── Build context object for validators ───────────────────────────────────
  const getValidationContext = (data = watch(), step) => ({
    data,
    constructionRows,
    operationalCostRows,
    enrollmentRows,
    extraCurricularRows,
    teachingRows,
    nonTeachingRows,
    hospitalizationRows,
    messData,
    selectedClass,
    selectedSection,
    selectedMonth,
    monthlyAttendance,
    teachRows,
    ntRows,
    financialData,
    procurements,
    uploadedImage,
    monthYear,
    ...(step !== undefined ? { currentStep: step } : {}),
  });

  // ── validateCurrentStep ───────────────────────────────────────────────────
  const validateCurrentStep = async () => {
    // Run custom per-step validation (no React Hook Form trigger needed for state-only steps)
    const customErrors = validateStepByIndex(
      currentStep,
      getValidationContext(watch(), currentStep)
    );

    // Also run legacy global validator but only surface errors relevant to this step
    let legacyErrors = [];
    try {
      const allLegacy = validateEmrsFormData(
        getValidationContext(watch(), currentStep)
      );
      legacyErrors = (allLegacy || []).filter(
        (le) => !customErrors.includes(le)
      );
    } catch (_) {
      // If the legacy validator throws, ignore it — don't block navigation
    }

    const allErrors = [...customErrors, ...legacyErrors];

    setStepErrors(allErrors);

    if (allErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    const canContinue = await validateCurrentStep();
    if (!canContinue) return;
    setStepErrors([]);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStepErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlyAttendance, setMonthlyAttendance] = useState([
    { month: "", workingDays: "", totalStudents: "", totalPresent: "" },
  ]);
  const [staffRows, setStaffRows] = useState([]);
  const [staffIndex, setStaffIndex] = useState(0);
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
    { name: "", class: "", section: "", category: "" },
  ]);

  const { control, handleSubmit, setValue, watch, register, trigger } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      EMRScode: "",
      EMRSid: "",
      udaisecode: "",
      schoolname: "",
      schooltype: "",
      Affiliation: "",
      affiliation: "",
      principalAvailable: "",
      NameofthePrincipal: "",
      contactno: "",
      emailid: "",
      state: "Assam",
      pincode: "",
      district: "",
      block: "",
      gramPanchayat: "",
      village: "",
    },
  });

  useEffect(() => {
    if (!user || user.role !== "school") return;
    const loginId = String(user.username || user.loginId || user.id || "")
      .trim()
      .toLowerCase();
    const school = SCHOOL_CREDENTIALS.find(
      (item) => String(item.username).trim().toLowerCase() === loginId
    );
    if (!school) return;
    setValue("EMRScode", school.schoolCode || "");
    setValue("schoolname", school.schoolName || "");
    setValue("state", school.state || "Assam");
    setValue("pincode", school.pincode || "");
    setValue("district", school.district || "");
    setValue("block", school.block || "");
    setValue("gramPanchayat", school.gramPanchayat || "");
    setValue("village", school.village || "");
    setValue("NameofthePrincipal", school.principal || "");
    setValue("principalAvailable", school.principal ? "Yes" : "");
    setValue("contactno", school.contact || "");
    setValue("emailid", school.email || "");
  }, [user, setValue]);

  const physicsLabFunctional = watch("physicsLabFunctional");
  const chemistryLabFunctional = watch("chemistryLabFunctional");
  const biologyLabFunctional = watch("biologyLabFunctional");
  const computerLabFunctional = watch("computerLabFunctional");
  const mathLabFunctional = watch("mathLabFunctional");
  const skillLabFunctional = watch("skillLabFunctional");

  useEffect(() => {
    const yesCount = [
      physicsLabFunctional,
      chemistryLabFunctional,
      biologyLabFunctional,
      computerLabFunctional,
      mathLabFunctional,
      skillLabFunctional,
    ].filter((val) => val === "Yes").length;
    let marks = 0;
    if (yesCount === 6) marks = 5;
    else if (yesCount >= 3) marks = 3;
    else if (yesCount >= 1) marks = 1;
    else marks = 0;
    setValue("marksLabFunctional", marks);
  }, [
    physicsLabFunctional,
    chemistryLabFunctional,
    biologyLabFunctional,
    computerLabFunctional,
    mathLabFunctional,
    skillLabFunctional,
    setValue,
  ]);

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
        { studentName: "", migratedFrom: "", transferredTo: "", reason: "" },
      ],
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
      areasOfDevelopment: "",
      description: "",
      targetStudents: "",
      status: "",
    },
  ]);

  const calculateCommonMarks = (condition1, condition2) => {
    if (condition1 === "Yes" && condition2 === "Yes") return 5;
    if (condition1 === "Yes" || condition2 === "Yes") return 3;
    return 0;
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
    activities: [],
  });

  const blankActivity = () => ({
    activityType: "",
    activityDesc: "",
    activityDateTime: "",
    remarks: "",
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

  const [eyeDateErrors, setEyeDateErrors] = useState({});
  const [earDateErrors, setEarDateErrors] = useState({});

  const emptyHospitalizationRow = () => ({
    hospitalEmpanelled: "",
    privateHospital: "",
    empanellementValidity: "",
    empanelmentDepartment: "",
    doctorName: "",
    treatmentDetails: "",
    studentName: "",
    rollNo: "",
    class: "",
    section: "",
    guardianName: "",
    guardianContact: "",
    admissionDate: "",
    dischargeDate: "",
    reasonForHospitalization: "",
    estimatedCost: "",
    amountClaimed: "",
    claimStatus: "",
    "Annual Health Check Conducted": "",
    "Part-Time Doctor Engaged": "",
    "Medical Register Maintained": "",
    "Sickle Cell Screening Conducted": "",
    "ABHA ID Created": "",
    "Eye Checkup Conducted": "",
    "Ear Checkup Conducted": "",
    marksHealth: "",
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
    counsellorName: "",
    counsellorQualification: "",
    counsellorRegNo: "",
    counsellorContact: "",
    counsellorAvailableDays: [],
    counsellorSessionType: "",
    counsellorSessionsConducted: "",
    counsellorStudentsCounselled: "",
  });

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
    return null;
  };

  const [hospitalizationRows, setHospitalizationRows] = useState([
    emptyHospitalizationRow(),
  ]);

  const [teachingRows, setteachingRows] = useState([
    {
      post: "",
      staffName: "",
      name: "",
      dob: "",
      doj: "",
      email: "",
      contactNumber: "",
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

  const [recurringBreakup, setRecurringBreakup] = useState([
    { sno: "1",  component: "Staff Salary (53.85%)",                                   colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "2",  component: "Direct Expenditure on Students (23.78%)",                 colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "3a", component: "Operational Expenditure & Co-Curricular (13.62%)",        colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "3b", component: "Maintenance & Repair of Buildings (4.75%)",               colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "4",  component: "Administrative Expense of State Society (1.91%)",         colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "5",  component: "Capital Expenditure (2.09%)",                             colA: "", colC: "", colD: "", colE: "", remarks: "" },
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
    billNo: "",
    paymentMethod: "",
    items: [{ category: "", name: "", quantity: "", unit: "", price: "", total: 0 }],
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

  const totalProcurements = procurements.reduce((sum, p) => sum + Number(p.totalNumber || 0), 0);
  const totalThroughGem = procurements.reduce((sum, p) => sum + Number(p.throughGem || 0), 0);
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

  const [constructionRows, setConstructionRows] = useState({
    school: [
      { component: "Classrooms", units: "6 rooms", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Teachers Staff Room", units: "2 rooms", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Student Lab", units: "2 labs", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Library", units: "1 library", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Science Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Biology Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Chemistry Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Physics Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Mathematics Lab", units: "1 Lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Auditorium", units: "1 hall", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Infirmary", units: "1 room", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    residence: [
      { component: "Boys Hostel", units: "50 beds", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Girls Hostel", units: "50 beds", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Water System", units: "2 tanks", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Warden Office", units: "1 office", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Recreation Area", units: "1 area", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Laundry Area", units: "1 area", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Kitchen", units: "1 kitchen", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Staff Housing", units: "10 units", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    outdoor: [
      { component: "Compound Wall", units: "500 m", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Garden", units: "2000 sqm", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Worker Toilets", units: "4 units", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Parking", units: "500 sqm", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    utilities: [
      { component: "Electrical System", units: "1 system", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Transformer Installed", units: "1 unit", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Digiset Installed", units: "1 unit", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Water Tanks", units: "2 tanks", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Sewage System", units: "1 plant", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Rainwater Harvest", units: "1 system", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Security Cabin", units: "1 cabin", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
  });

  const [workingDays, setWorkingDays] = useState(26);
  const [showHolidays, setShowHolidays] = useState(false);
  const [monthYear, setMonthYear] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
  });

  const [teachRows, setTeachRows] = useState([
    { id: 1, post: "", name: "", cl: "", el: "", ml: "", mat: "", workingDays: "" },
  ]);
  const [ntRows, setNtRows] = useState([
    { id: 1, post: "", name: "", cl: "", el: "", ml: "", mat: "", workingDays: "" },
  ]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...messData.items];
    if (["quantity", "price"].includes(field)) value = Math.max(0, value);
    updatedItems[index][field] = value;
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;
    updatedItems[index].total = qty * price;
    setMessData({ ...messData, items: updatedItems });
  };

  const addItem = () => {
    setMessData({
      ...messData,
      items: [...messData.items, { category: "", name: "", quantity: "", price: "", total: 0 }],
    });
  };

  const removeItem = (index) => {
    const updated = messData.items.filter((_, i) => i !== index);
    setMessData({ ...messData, items: updated });
  };

  const calculateGrandTotal = () =>
    messData.items.reduce((sum, item) => sum + (item.total || 0), 0);

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

  const calculateFundUtilMarks = (percentage) => {
    const n = parseFloat(percentage);
    if (isNaN(n)) return 0;
    if (n >= 95 && n <= 100) return 5;
    if (n >= 70 && n <= 94) return 3;
    if (n >= 50 && n <= 69) return 1;
    return 0;
  };

  const calculateGemMarks = (percentage) => {
    const n = parseFloat(percentage);
    if (isNaN(n)) return 0;
    if (n === 100) return 5;
    if (n >= 75 && n <= 99) return 4;
    if (n >= 50 && n <= 74) return 3;
    if (n >= 25 && n <= 49) return 1;
    return 0;
  };

  const prepareBasicDetails = (data) => {
    const details = {
      EMRScode: data.EMRScode?.trim(),
      EMRSid: data.EMRSid?.trim(),
      schoolname: data.schoolname?.trim(),
      schooltype: data.schooltype?.trim(),
      affiliation: data.affiliation?.trim() || data.Affiliation?.trim(),
      principalName: data.principalName?.trim() || data.NameofthePrincipal?.trim(),
      contactno: data.contactno?.trim(),
      email: data.email?.trim() || data.emailid?.trim(),
    };
    const udise = toOptionalNumber(data.udaisecode);
    if (udise !== undefined) details.udaisecode = udise;
    return details;
  };

  const prepareLocationDetails = (data) => ({
    pincode: data.pincode || "",
    state: data.state || "",
    district: data.district || "",
    block: data.block || "",
    grampanchayat: data.gramPanchayat || data.grampanchayat || "",
    village: data.village || "",
  });

  const prepareInfrastructureDetails = (data) => ({
    totalClassrooms: toSafeNumber(data.totalClassrooms),
    classroomWithSmartClass: toSafeNumber(data.classroomWithSmartClass),
    classroomWithProjector: toSafeNumber(data.classroomWithProjector),
    scienceLab: data.scienceLab || "",
    biologyLab: data.biologyLab || "",
    chemistryLab: data.chemistryLab || "",
    physicsLab: data.physicsLab || "",
    computerLab: data.computerLab || "",
    internetComputerLab: data.internetComputerLab || "",
    library: data.library || "",
    booksInLibrary: toSafeNumber(data.booksInLibrary),
    playground: data.playground || "",
    playgroundArea: toSafeNumber(data.playgroundArea),
    auditorium: data.Auditorium || "",
    auditoriumCapacity: toSafeNumber(data.auditoriumCapacity),
    medicalRoom: data["Medical Room"] || "",
    totalFireExtinguishers: toSafeNumber(data.totalFireExtinguishers),
    functionalFireExtinguishers: toSafeNumber(data.functionalFireExtinguishers),
    electricalSafetyInspection: data.electricalSafetyInspection || "",
    fireSafetyDrill: data.fireSafetyDrill || "",
  });

  const prepareConstructionDetails = (data, constructionRows) => ({
    projectStartDate: data.projectStartDate || "",
    expectedEndDate: data.projectEndDate || "",
    totalBudget: toSafeNumber(data.totalProjectBudget),
    school: sanitizeConstructionComponents(constructionRows.school),
    residence: sanitizeConstructionComponents(constructionRows.residence),
    outdoor: sanitizeConstructionComponents(constructionRows.outdoor),
    utilities: sanitizeConstructionComponents(constructionRows.utilities),
  });

  const prepareHostelAdministration = (data) => ({
    boysHostel: {
      capacity: toSafeNumber(data.boysHostelCapacity),
      bedsAvailable: toSafeNumber(data.boysBedsAvailable),
      currentOccupancy: toSafeNumber(data.boysCurrentOccupancy),
      cctvInstalled: data.boysCCTVInstalled || "",
      noOfCCTV: toSafeNumber(data.boysNoOfCCTV),
      securityAgencyName: data.boysSecurityAgencyName || null,
      securityAgencyContact: data.boysSecurityAgencyContact || null,
      warden: {
        name: data.boysWardenName,
        email: data.boysWardenEmail,
        contact: data.boysWardenContact,
      },
    },
    girlsHostel: {
      capacity: toSafeNumber(data.girlsHostelCapacity),
      bedsAvailable: toSafeNumber(data.girlsBedsAvailable),
      currentOccupancy: toSafeNumber(data.girlsCurrentOccupancy),
      cctvInstalled: data.girlsCCTVInstalled || "",
      noOfCCTV: toSafeNumber(data.girlsNoOfCCTV),
      securityAgencyName: data.girlsSecurityAgencyName || null,
      securityAgencyContact: data.girlsSecurityAgencyContact || null,
      warden: {
        name: data.girlsWardenName,
        email: data.girlsWardenEmail,
        contact: data.girlsWardenContact,
      },
    },
  });

  const prepareMessCompliance = (messData) => ({
    messCompliance: {
      weeklyMenuDisplayed: messData.weeklyMenuDisplayed,
      messInspectionRegister: messData.messInspectionRegister,
      foodStockRegister: messData.foodStockRegister,
      foodComplaintRegister: messData.foodComplaintRegister,
      messCleanlinessDaily: messData.messCleanlinessDaily,
    },
  });

  const resolveCredential = () => {
    if (!user) return null;
    const loginId = String(user.username || user.loginId || user.id || "")
      .trim()
      .toLowerCase();
    return (
      SCHOOL_CREDENTIALS.find(
        (c) => String(c.username || "").trim().toLowerCase() === loginId
      ) || null
    );
  };

  const onSubmit = async (data) => {
    const hasEyeErrors = Object.keys(eyeDateErrors).length > 0;
    const hasEarErrors = Object.keys(earDateErrors).length > 0;
    if (hasEyeErrors || hasEarErrors) {
      alert(
        "⚠️ Please fix the Eye/Ear checkup date errors before submitting.\nCheckup dates must be at least 6 months apart."
      );
      return;
    }

    // Run full validation across ALL steps on final submit
    const allStepErrors = [];
    for (let s = 0; s < STEPS.length; s++) {
      const errs = validateStepByIndex(s, {
        ...getValidationContext(data),
        uploadedImage,
      });
      if (errs.length > 0) {
        allStepErrors.push(
          `Step ${s + 1} (${STEPS[s].label}): ${errs[0]}${
            errs.length > 1 ? ` (+${errs.length - 1} more)` : ""
          }`
        );
      }
    }

    if (allStepErrors.length > 0) {
      setStepErrors(allStepErrors);
      toast.error(`Please fix issues in ${allStepErrors.length} step(s) before submitting.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Submitting EMRS data...");

    try {
      const payload = {
        userId: "1",
        ...prepareBasicDetails(data),
        ...prepareLocationDetails(data),
        ...prepareInfrastructureDetails(data),
        constructionStatus: prepareConstructionDetails(data, constructionRows),
        ...prepareHostelAdministration(data),
        ...prepareMessCompliance(data),
        classStrength: enrollmentRows.map((row) => ({
          academicYear: row.academicYear,
          class: row.class,
          section: row.section,
          sanctionedCapacity: toSafeNumber(row.sanctionedCapacity),
          currentEnrollment: toSafeNumber(row.currentEnrollment),
          categoryBreakdown: row.categoryBreakdown || {},
          academicPerformance: {
            appeared: toSafeNumber(row.appeared),
            passed: toSafeNumber(row.passed),
            passPercent: row.passPercent || "",
            above75: toSafeNumber(row.above75),
            below50: toSafeNumber(row.below50),
            stream: row.stream || "",
            distinctions: toSafeNumber(row.distinctions),
            topScorer: row.topScorer || "",
            topScore: toSafeNumber(row.topScore),
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
          areasOfDevelopment: item.areasOfDevelopment ? [item.areasOfDevelopment] : [],
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
          estimatedCost: toSafeNumber(item.estimatedCost),
          amountClaimed: toSafeNumber(item.amountClaimed),
          claimStatus: item.claimStatus,
          guardianName: item.guardianName?.trim(),
          guardianContact: item.guardianContact,
        })),
        teachingStaff: teachingRows.map((staff) => ({
          post: staff.post,
          name: (staff.name || staff.staffName)?.trim(),
          dob: staff.dob,
          doj: staff.doj,
          email: staff.email?.trim(),
          contact: staff.contact || staff.contactNumber,
          total: toSafeNumber(staff.total),
          filled: toSafeNumber(staff.filled),
          vacant: toSafeNumber(staff.total) - toSafeNumber(staff.filled),
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
          total: toSafeNumber(staff.total),
          filled: toSafeNumber(staff.filled),
          vacant: toSafeNumber(staff.total) - toSafeNumber(staff.filled),
          academicQualifications: staff.academicQualifications,
          professionalQualifications: staff.professionalQualifications,
          monthlyAttendance: staff.monthlyAttendance || [],
        })),
        operationalCost: operationalCostRows.map((row) => ({
          year: row.year,
          month: row.month,
          costType: row.costType,
          amount: toSafeNumber(row.amount),
        })),
      };

      const cred = resolveCredential();
      if (cred) {
        payload.username = cred.username;
        payload.loginId = cred.username;
        payload.schoolCode = cred.schoolCode;
        payload.EMRScode = cred.schoolCode;
        payload.schoolname = payload.schoolname || cred.schoolName;
        payload.district = payload.district || cred.district;
        payload.block = payload.block || cred.block;
      } else if (user) {
        payload.username = String(user.username || user.loginId || user.id || "");
        payload.loginId = payload.username;
      }

      let submittedId = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch("http://localhost:5000/api/emrs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const contentType = response.headers.get("content-type");
        let result = {};
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        }
        if (response.ok) {
          submittedId = result.data?._id || result._id;
        } else {
          submittedId = `local_${Date.now()}`;
        }
      } catch (fetchError) {
        submittedId = `local_${Date.now()}`;
      }

      const submittedRecord = {
        id: submittedId || `local_${Date.now()}`,
        schoolname: payload.schoolname || "—",
        EMRScode: payload.EMRScode || "—",
        district: payload.district || "—",
        principalName: payload.principalName || "—",
        affiliation: payload.affiliation || "—",
        schooltype: payload.schooltype || "—",
        submittedAt: new Date().toLocaleString(),
        teachingStaff: payload.teachingStaff || [],
        nonTeachingStaff: payload.nonTeachingStaff || [],
        classStrength: payload.classStrength || [],
        hospitalization: payload.hospitalization || [],
        extraCurricular: payload.extraCurricular || [],
        operationalCost: payload.operationalCost || [],
        constructionStatus: payload.constructionStatus || {},
        infrastructure: {
          totalClassrooms: payload.totalClassrooms,
          scienceLab: payload.scienceLab,
          library: payload.library,
          playground: payload.playground,
          auditorium: payload.auditorium,
          medicalRoom: payload.medicalRoom,
        },
        hostel: {
          boysHostel: payload.boysHostel,
          girlsHostel: payload.girlsHostel,
        },
        payload,
      };

      try {
        const recordToSave = {
          ...payload,
          _id: submittedId || `local_${Date.now()}`,
          createdAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem("emrs_submitted_forms") || "[]");
        const idx = existing.findIndex((f) => {
          if (payload.schoolCode && f.schoolCode === payload.schoolCode) return true;
          if (payload.username && f.username === payload.username) return true;
          if (payload.EMRScode && String(f.EMRScode) === String(payload.EMRScode)) return true;
          return false;
        });
        if (idx !== -1) {
          existing[idx] = recordToSave;
        } else {
          existing.push(recordToSave);
        }
        localStorage.setItem("emrs_submitted_forms", JSON.stringify(existing));
        window.dispatchEvent(new CustomEvent("emrs-form-submitted"));
      } catch (storageError) {
        console.warn("localStorage save failed:", storageError.message);
      }

      toast.dismiss(loadingToast);
      toast.success("✅ EMRS Form Submitted Successfully!");
      if (addSubmittedForm) addSubmittedForm(submittedRecord);
      navigate("/emrs/dashboard");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("❌ Submission failed: " + error.message);
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPincodeChange = async (pincode) => {
    if (!pincode || String(pincode).length !== 6) return;
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0]?.Status === "Success") {
        const po = data[0].PostOffice[0];
        setValue("district", po.District || "");
        setValue("block", po.Block || "");
        setValue("gramPanchayat", po.Name || "");
        setValue("village", po.Division || "");
      } else {
        setValue("district", "");
        setValue("block", "");
        setValue("gramPanchayat", "");
        setValue("village", "");
      }
    } catch (error) {
      console.error("Pincode lookup failed:", error);
    }
  };

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
            : r
        ),
      }));
    }
  };

  const passingYears = Array.from({ length: 40 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  const renderQualificationTables = (staffRows, setStaffRows, staffIndex, showTET = true) => {
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
    const tdCenterStyle = { textAlign: "center", padding: "6px", border: "1px solid #cbd5e1", fontSize: "13px" };

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
          sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
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
          sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", borderColor: "#1976d2", color: "#1976d2" }}
          onClick={() => resetRow(qualType, qIndex, emptyObj)}
        >
          ↺
        </Button>
      </Box>
    );

    const emptyAcademic = { post: "", name: " ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" };
    const emptyProfessional = { post: "", name: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" };
    const emptyTET = { post: "", name: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" };

    return (
      <Box mt={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>Academic Qualification</Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["S.No","Post","Name","Qualification","Course","Registration No.","Roll No.","College","Marks Obtained (%)","University","Passing Year","Action"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.academicQualifications.map((q, qIndex) => (
                <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                  <td style={tdCenterStyle}>{qIndex + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>{row.post || "—"}</Typography>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>{row.name || row.staffName || "—"}</Typography>
                  </td>
                  <td style={tdStyle}><TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("academicQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 110 }}>{qualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.course} onChange={(e) => updateField("academicQualifications", qIndex, "course", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.registrationNo} onChange={(e) => updateField("academicQualifications", qIndex, "registrationNo", e.target.value)} sx={{ minWidth: 110 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.rollNo} onChange={(e) => updateField("academicQualifications", qIndex, "rollNo", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.college} onChange={(e) => updateField("academicQualifications", qIndex, "college", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" type="number" value={q.marksObtained} onChange={(e) => updateField("academicQualifications", qIndex, "marksObtained", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.university} onChange={(e) => updateField("academicQualifications", qIndex, "university", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdStyle}><TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("academicQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>{passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}</TextField></td>
                  <td style={tdCenterStyle}><ActionButtons qualType="academicQualifications" qIndex={qIndex} emptyObj={emptyAcademic} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>Professional Qualification</Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["S.No","Post","Name","Qualification","Registration No.","Roll No.","Exam Conducted By","Passing Year","Marks Obtained (%)","Affiliation Body","Action"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.professionalQualifications.map((q, qIndex) => (
                <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                  <td style={tdCenterStyle}>{qIndex + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 120 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>{row.post || "—"}</Typography></td>
                  <td style={{ ...tdStyle, minWidth: 130 }}><Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>{row.name || row.staffName || "—"}</Typography></td>
                  <td style={tdStyle}><TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("professionalQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 110 }}>{professionalQualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.registrationNo} onChange={(e) => updateField("professionalQualifications", qIndex, "registrationNo", e.target.value)} sx={{ minWidth: 110 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.rollNo} onChange={(e) => updateField("professionalQualifications", qIndex, "rollNo", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.examConductedBy} onChange={(e) => updateField("professionalQualifications", qIndex, "examConductedBy", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdStyle}><TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("professionalQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>{passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}</TextField></td>
                  <td style={tdStyle}><TextField fullWidth size="small" type="number" value={q.marksObtained} onChange={(e) => updateField("professionalQualifications", qIndex, "marksObtained", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.affiliationBody} onChange={(e) => updateField("professionalQualifications", qIndex, "affiliationBody", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdCenterStyle}><ActionButtons qualType="professionalQualifications" qIndex={qIndex} emptyObj={emptyProfessional} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {showTET && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>TET Qualification</Typography>
            <Box sx={{ overflowX: "auto", mb: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["S.No","Post","Name","Qualification","Registration No.","Roll No.","Exam Conducted By","Passing Year","Marks Obtained (%)","Affiliation Body","Action"].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {row.tetQualifications.map((q, qIndex) => (
                    <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                      <td style={tdCenterStyle}>{qIndex + 1}</td>
                      <td style={{ ...tdStyle, minWidth: 120 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>{row.post || "—"}</Typography></td>
                      <td style={{ ...tdStyle, minWidth: 130 }}><Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>{row.name || row.staffName || "—"}</Typography></td>
                      <td style={tdStyle}><TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("tetQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 130 }}>{tetQualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField></td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.registrationNo} onChange={(e) => updateField("tetQualifications", qIndex, "registrationNo", e.target.value)} sx={{ minWidth: 110 }} /></td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.rollNo} onChange={(e) => updateField("tetQualifications", qIndex, "rollNo", e.target.value)} sx={{ minWidth: 90 }} /></td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.examConductedBy} onChange={(e) => updateField("tetQualifications", qIndex, "examConductedBy", e.target.value)} sx={{ minWidth: 120 }} /></td>
                      <td style={tdStyle}><TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("tetQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>{passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}</TextField></td>
                      <td style={tdStyle}><TextField fullWidth size="small" type="number" value={q.marksObtained} onChange={(e) => updateField("tetQualifications", qIndex, "marksObtained", e.target.value)} sx={{ minWidth: 90 }} /></td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.affiliationBody} onChange={(e) => updateField("tetQualifications", qIndex, "affiliationBody", e.target.value)} sx={{ minWidth: 120 }} /></td>
                      <td style={tdCenterStyle}><ActionButtons qualType="tetQualifications" qIndex={qIndex} emptyObj={emptyTET} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </>
        )}
      </Box>
    );
  };

  // ── The rest of the JSX is identical to the original ─────────────────────
  // (All step rendering, stepper, navigation, dialogs are unchanged)
  // Paste the return() block from the original EMRSForm here unchanged.
  // Only the logic above (validateStepByIndex + validateCurrentStep) changed.

  return (
    <Container sx={{ mt: 4, mb: 4, backgroundColor: "#f1f5f9", padding: 3, borderRadius: 3 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" fontWeight="bold" gutterBottom>EMRS</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>Create and manage EMRS details</Typography>

      {/* ===== STEPPER ===== */}
      <Box sx={{ overflowX: "auto", pb: 1, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 700 }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 72 }}>
                <Box
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  sx={{
                    width: 40, height: 40, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                    background: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#e2e8f0",
                    color: i <= currentStep ? "#fff" : "#94a3b8",
                    cursor: i < currentStep ? "pointer" : "default",
                    fontWeight: 700, transition: "all 0.3s",
                    boxShadow: i === currentStep ? "0 0 0 4px #bbdefb" : "none",
                  }}
                >
                  {i < currentStep ? "✓" : step.icon}
                </Box>
                <Typography sx={{ fontSize: 10, mt: 0.5, fontWeight: i === currentStep ? 700 : 400, color: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>
                  {step.label}
                </Typography>
              </Box>
              {i < STEPS.length - 1 && (
                <Box sx={{ flex: 1, height: 3, mx: 0.5, background: i < currentStep ? "#4caf50" : "#e2e8f0", borderRadius: 2, transition: "background 0.3s", minWidth: 10 }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Card>
        <Box sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", padding: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>EMRS Details Form</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ backgroundColor: "#f8fafc", padding: 4, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <ValidationErrorPanel errors={stepErrors} onDismiss={() => setStepErrors([])} />

          <form
            onSubmit={handleSubmit(onSubmit, () => {
              toast.error("Please fix the highlighted form errors before submitting.");
            })}
            style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}
          >
            {currentStep === 0 && (
              <SchoolDetails control={control} watch={watch} setValue={setValue} emrsBasicFields={emrsBasicFields} onPincodeChange={onPincodeChange} />
            )}
            {currentStep === 1 && (
              <InfrastructureDetails control={control} watch={watch} syncInfraToConstruction={syncInfraToConstruction} />
            )}
            {currentStep === 2 && (
              <ConstructionDetails control={control} constructionRows={constructionRows} setConstructionRows={setConstructionRows} />
            )}
            {currentStep === 3 && (
              <HostelDetails control={control} watch={watch} messData={messData} setMessData={setMessData} addItem={addItem} removeItem={removeItem} handleItemChange={handleItemChange} calculateGrandTotal={calculateGrandTotal} />
            )}
            {currentStep === 4 && (
              <Enrollment enrollmentRows={enrollmentRows} setEnrollmentRows={setEnrollmentRows} />
            )}
            {currentStep === 5 && (
              <ExtraCurricular extraCurricularRows={extraCurricularRows} setExtraCurricularRows={setExtraCurricularRows} control={control} watch={watch} />
            )}
            {currentStep === 6 && (
              <HospitalizationSection
                hospitalizationRows={hospitalizationRows}
                setHospitalizationRows={setHospitalizationRows}
                eyeDateErrors={eyeDateErrors}
                setEyeDateErrors={setEyeDateErrors}
                earDateErrors={earDateErrors}
                setEarDateErrors={setEarDateErrors}
                emptyHospitalizationRow={emptyHospitalizationRow}
                calculateHealthMarks={calculateHealthMarks}
                validateBiAnnualDate={validateBiAnnualDate}
                addEyeRow={addEyeRow}
                addEarRow={addEarRow}
                blankNurseEntry={blankNurseEntry}
                blankActivity={blankActivity}
                blankVisitLog={blankVisitLog}
              />
            )}

            {/* Step 7: Staff Details */}
            {currentStep === 7 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>Teaching Staff Details</Typography>
                  </Grid>
                </Grid>
                {teachingRows.map((row, index) => (
                  <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Sanctioned Strength</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {teachingStaffSummaryFields.filter((f) => ["total", "filled", "vacant"].includes(f.name)).map((field) => (
                          <Grid item xs={12} sm={4} key={field.name}>
                            <TextField fullWidth size="small" type={field.type} label={field.label}
                              value={field.name === "vacant" ? Number(row.total || 0) - Number(row.filled || 0) || "" : row[field.name]}
                              inputProps={{ min: 0 }} InputProps={{ readOnly: field.readOnly }}
                              onChange={(e) => { const u = [...teachingRows]; u[index][field.name] = e.target.value; setteachingRows(u); }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Staff Details</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {teachingStaffSummaryFields.filter((f) => !["total", "filled", "vacant"].includes(f.name)).map((field) => (
                          <Grid item xs={12} sm={6} md={4} key={field.name}>
                            {field.type === "select" ? (
                              <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label={field.label} value={row[field.name] ?? ""} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: field.type === "date" || undefined }}
                                onChange={(e) => { const u = [...teachingRows]; u[index][field.name] = e.target.value; setteachingRows(u); }}>
                                <MenuItem value="">Select</MenuItem>
                                {field.options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                              </TextField>
                            ) : (
                              <TextField fullWidth size="small" sx={{ minWidth: 220 }} type={field.type || "text"} label={field.label} value={row[field.name]} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: field.type === "date" || undefined }}
                                onChange={(e) => { const u = [...teachingRows]; u[index][field.name] = e.target.value; setteachingRows(u); }}
                              />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Educational Qualification</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, backgroundColor: "#f8fafc" }}>
                      {renderQualificationTables(teachingRows, setteachingRows, index)}
                    </Box>
                    <Box mt={1} mb={4}>
                      <Button variant="outlined" sx={{ mb: 4 }}
                        onClick={() => setteachingRows([...teachingRows, { post: "", name: "", dob: "", doj: "", email: "", contact: "", total: "", filled: "", vacant: "", academicQualifications: [{ qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }], professionalQualifications: [{ qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }], tetQualifications: [{ qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }], monthlyAttendance: [] }])}>
                        + Add Post
                      </Button>
                    </Box>
                  </Box>
                ))}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>Non-Teaching Staff Details</Typography>
                  </Grid>
                </Grid>
                {nonTeachingRows.map((row, index) => (
                  <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Sanctioned Strength</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {nonTeachingStaffDetailFields.filter((f) => ["total", "filled", "vacant"].includes(f.name)).map((field) => (
                          <Grid item xs={12} sm={4} key={field.name}>
                            <TextField fullWidth size="small" type={field.type} label={field.label}
                              value={field.name === "vacant" ? Number(row.total || 0) - Number(row.filled || 0) || "" : row[field.name]}
                              InputProps={{ readOnly: field.readOnly }}
                              onChange={(e) => { const u = [...nonTeachingRows]; u[index][field.name] = e.target.value; setnonTeachingRows(u); }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Educational Qualification</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, backgroundColor: "#f8fafc" }}>
                      {renderQualificationTables(nonTeachingRows, setnonTeachingRows, index, false)}
                    </Box>
                    <Box mt={1} mb={4}>
                      <Button variant="outlined" sx={{ mb: 4 }}
                        onClick={() => setnonTeachingRows([...nonTeachingRows, { post: "", name: "", dob: "", doj: "", email: "", contact: "", total: "", filled: "", vacant: "", academicQualifications: [{ qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }], professionalQualifications: [{ qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }] }])}>
                        + Add Post
                      </Button>
                    </Box>
                  </Box>
                ))}
              </>
            )}

            {/* Steps 8–11 are identical to original — paste from original file */}
            {currentStep === 8 && (
              // ── Attendance step — paste original Step 8 JSX here unchanged ──
              <Typography sx={{ color: "#64748b", fontStyle: "italic" }}>
                [Paste original Step 8 (Attendance) JSX block here — it is unchanged]
              </Typography>
            )}
            {currentStep === 9 && (
              <OperationalCost operationalCostRows={operationalCostRows} setOperationalCostRows={setOperationalCostRows} />
            )}
            {currentStep === 10 && (
              // ── Financial & Procurement — paste original Step 10 JSX here unchanged ──
              <Typography sx={{ color: "#64748b", fontStyle: "italic" }}>
                [Paste original Step 10 (Financial) JSX block here — it is unchanged]
              </Typography>
            )}
            {currentStep === 11 && (
              // ── Image Upload — paste original Step 11 JSX here unchanged ──
              <Typography sx={{ color: "#64748b", fontStyle: "italic" }}>
                [Paste original Step 11 (Image Upload) JSX block here — it is unchanged]
              </Typography>
            )}

            {/* Navigation */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} pt={3} sx={{ borderTop: "1px solid #e2e8f0" }}>
              <Button variant="outlined" onClick={handleBack} disabled={currentStep === 0} sx={{ minWidth: 120 }}>← Back</Button>
              <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Step {currentStep + 1} of {STEPS.length}</Typography>
              {currentStep < STEPS.length - 1 && (
                <Button variant="contained" onClick={handleNext} sx={{ minWidth: 150, background: "linear-gradient(to right, #1976d2, #42a5f5)" }}>
                  Save &amp; Next →
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Select Image Option</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Button variant="outlined" component="label">
            📷 Capture Photo
            <input type="file" hidden accept="image/*" capture="environment" onChange={(e) => { handleImageUpload(e.target.files[0]); setOpenImageDialog(false); }} />
          </Button>
          <Button variant="outlined" component="label">
            🖼 Upload From Device
            <input type="file" hidden accept="image/*" onChange={(e) => { handleImageUpload(e.target.files[0]); setOpenImageDialog(false); }} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EMRSForm;