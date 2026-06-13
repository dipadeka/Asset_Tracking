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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm, Controller } from "react-hook-form";
import { GirlSharp } from "@mui/icons-material";
// ─── FIX: import useAuth so we can read the logged-in school's credentials ───
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

const EMRSForm = ({ addSubmittedForm }) => {
  // ─── FIX: pull the logged-in user so we can stamp their credentials ───────
  const { user } = useAuth();

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

  const { control, handleSubmit, setValue, watch, register } = useForm({
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
    { sno: "1", component: "Staff Salary (53.85%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "2", component: "Direct Expenditure on Students (23.78%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "3a", component: "Operational Expenditure & Co-Curricular (13.62%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "3b", component: "Maintenance & Repair of Buildings (4.75%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "4", component: "Administrative Expense of State Society (1.91%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "5", component: "Capital Expenditure (2.09%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
  ]);

  const handleBreakupChange = (index, field, value) => {
    const updated = [...recurringBreakup];
    updated[index] = { ...updated[index], [field]: value };
    setRecurringBreakup(updated);
  };

  const [nonTeachingRows, setnonTeachingRows] = useState([
    {
      post: "", name: "", dob: "", doj: "", email: "", contact: "",
      total: "", filled: "", vacant: "",
      academicQualifications: [{ post: "", staffname: " ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
      professionalQualifications: [{ post: "", staffname: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
      tetQualifications: [{ post: "", staffname: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
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
    type: "", description: "", totalNumber: "", orderDate: "", value: "", vendor: "", throughGem: "",
  });

  const totalProcurements = procurements.reduce((sum, p) => sum + Number(p.totalNumber || 0), 0);
  const totalThroughGem = procurements.reduce((sum, p) => sum + Number(p.throughGem || 0), 0);
  const gemPercentage = totalProcurements > 0 ? ((totalThroughGem / totalProcurements) * 100).toFixed(2) : "0.00";

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
    { id: 1, post: "", name: "", cl: "", el: "", ml: "", mat: "" },
  ]);
  const [ntRows, setNtRows] = useState([
    { id: 1, post: "", name: "", cl: "", el: "", ml: "", mat: "" },
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

  const handleGemPercentageChange = (e) => {
    const newPercentage = e.target.value;
    const marks = calculateGemMarks(newPercentage);
    setFinancialData((prev) => ({
      ...prev,
      gemProcurementPercentage: newPercentage,
      gemMarksObtained: marks,
    }));
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
      warden: { name: data.boysWardenName, email: data.boysWardenEmail, contact: data.boysWardenContact },
    },
    girlsHostel: {
      capacity: toSafeNumber(data.girlsHostelCapacity),
      bedsAvailable: toSafeNumber(data.girlsBedsAvailable),
      currentOccupancy: toSafeNumber(data.girlsCurrentOccupancy),
      cctvInstalled: data.girlsCCTVInstalled || "",
      noOfCCTV: toSafeNumber(data.girlsNoOfCCTV),
      securityAgencyName: data.girlsSecurityAgencyName || null,
      securityAgencyContact: data.girlsSecurityAgencyContact || null,
      warden: { name: data.girlsWardenName, email: data.girlsWardenEmail, contact: data.girlsWardenContact },
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

  // ─────────────────────────────────────────────────────────────────────────────
  // FIX: resolve the credential record for the currently logged-in school user.
  //      We look up by user.username (the login id stored in AuthContext).
  //      This gives us the canonical schoolCode ("EMRS-AS-03") and schoolName.
  // ─────────────────────────────────────────────────────────────────────────────
  const resolveCredential = () => {
    if (!user) return null;
    const loginId = String(user.username || user.loginId || user.id || "").trim().toLowerCase();
    return SCHOOL_CREDENTIALS.find(
      (c) => String(c.username || "").trim().toLowerCase() === loginId
    ) || null;
  };

  const onSubmit = async (data) => {
    const hasEyeErrors = Object.keys(eyeDateErrors).length > 0;
    const hasEarErrors = Object.keys(earDateErrors).length > 0;
    if (hasEyeErrors || hasEarErrors) {
      alert("⚠️ Please fix the Eye/Ear checkup date errors before submitting.\nCheckup dates must be at least 6 months apart.");
      return;
    }

    const validationErrors = validateEmrsFormData({
      data,
      constructionRows,
      operationalCostRows,
      enrollmentRows,
      teachingRows,
      nonTeachingRows,
      hospitalizationRows,
    });
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      if (validationErrors.length > 1) {
        console.warn("EMRS validation errors:", validationErrors);
      }
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

      // ── FIX: resolve the credential and stamp ALL identity fields ────────────
      // This is the critical fix — without these fields the admin dashboard
      // cannot match this record back to the right school entry.
      const cred = resolveCredential();
      if (cred) {
        payload.username   = cred.username;   // e.g. "emrs_as_03"
        payload.loginId    = cred.username;   // alias so both field names work
        payload.schoolCode = cred.schoolCode; // e.g. "EMRS-AS-03"
        payload.EMRScode   = cred.schoolCode; // overwrite numeric with canonical code
        payload.schoolname = payload.schoolname || cred.schoolName;
        payload.district   = payload.district   || cred.district;
        payload.block      = payload.block      || cred.block;
      } else if (user) {
        // Fallback: at minimum stamp the raw login id so normalization can find it
        payload.username = String(user.username || user.loginId || user.id || "");
        payload.loginId  = payload.username;
      }
      // ────────────────────────────────────────────────────────────────────────

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
          console.warn(`Backend returned ${response.status}, saving locally.`);
          submittedId = `local_${Date.now()}`;
        }
      } catch (fetchError) {
        console.warn("Backend unavailable, saving locally:", fetchError.message);
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
        // ── FIX: save the FULL payload (which now includes username & schoolCode)
        //    Match on schoolCode (canonical) to avoid duplicate entries.
        const recordToSave = {
          ...payload,
          _id: submittedId || `local_${Date.now()}`,
          createdAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
        };

        const existing = JSON.parse(localStorage.getItem("emrs_submitted_forms") || "[]");

        // ── FIX: deduplicate by canonical schoolCode first, then by username ──
        const idx = existing.findIndex((f) => {
          if (payload.schoolCode && f.schoolCode === payload.schoolCode) return true;
          if (payload.username && f.username === payload.username) return true;
          // Legacy: numeric EMRScode comparison
          if (payload.EMRScode && String(f.EMRScode) === String(payload.EMRScode)) return true;
          return false;
        });

        if (idx !== -1) {
          existing[idx] = recordToSave;   // update existing record
        } else {
          existing.push(recordToSave);    // add new record
        }
        localStorage.setItem("emrs_submitted_forms", JSON.stringify(existing));

        // Tell admin dashboard to refresh immediately
        window.dispatchEvent(new CustomEvent("emrs-form-submitted"));
      } catch (storageError) {
        console.warn("localStorage save failed:", storageError.message);
      }

      toast.dismiss(loadingToast);
      toast.success("✅ EMRS Form Submitted Successfully!");

      if (addSubmittedForm) {
        addSubmittedForm(submittedRecord);
      }

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
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();

    if (data[0]?.Status === "Success") {
      const po = data[0].PostOffice[0];
      setValue("district",      po.District || "");
      setValue("block",         po.Block    || "");
      setValue("gramPanchayat", po.Name     || "");
      setValue("village",       po.Division || "");
    } else {
      setValue("district",      "");
      setValue("block",         "");
      setValue("gramPanchayat", "");
      setValue("village",       "");
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
      backgroundColor: "#1976d2", color: "#fff", padding: "8px 6px",
      textAlign: "center", fontSize: "12px", fontWeight: 600,
      border: "1px solid #1565c0", whiteSpace: "nowrap",
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
          variant="contained" size="small"
          sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
          onClick={() => {
            const u = [...staffRows];
            u[staffIndex][qualType].splice(qIndex + 1, 0, { ...emptyObj });
            setStaffRows(u);
          }}
        >+</Button>
        <Button
          variant="outlined" size="small"
          sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", borderColor: "#1976d2", color: "#1976d2" }}
          onClick={() => resetRow(qualType, qIndex, emptyObj)}
        >↺</Button>
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
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>
                      {row.post || "—"}
                    </Typography>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>
                      {row.name || "—"}
                    </Typography>
                  </td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("academicQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 110 }}>
                      {qualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.course} onChange={(e) => updateField("academicQualifications", qIndex, "course", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.registrationNo} onChange={(e) => updateField("academicQualifications", qIndex, "registrationNo", e.target.value)} sx={{ minWidth: 110 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.rollNo} onChange={(e) => updateField("academicQualifications", qIndex, "rollNo", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.college} onChange={(e) => updateField("academicQualifications", qIndex, "college", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" type="number" value={q.marksObtained} onChange={(e) => updateField("academicQualifications", qIndex, "marksObtained", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.university} onChange={(e) => updateField("academicQualifications", qIndex, "university", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("academicQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>
                      {passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                  </td>
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
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>
                      {row.post || "—"}
                    </Typography>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>
                      {row.name || "—"}
                    </Typography>
                  </td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("professionalQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 110 }}>
                      {professionalQualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.registrationNo} onChange={(e) => updateField("professionalQualifications", qIndex, "registrationNo", e.target.value)} sx={{ minWidth: 110 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.rollNo} onChange={(e) => updateField("professionalQualifications", qIndex, "rollNo", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={tdStyle}><TextField fullWidth size="small" value={q.examConductedBy} onChange={(e) => updateField("professionalQualifications", qIndex, "examConductedBy", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("professionalQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>
                      {passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                  </td>
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
                      <td style={{ ...tdStyle, minWidth: 120 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>
                          {row.post || "—"}
                        </Typography>
                      </td>
                      <td style={{ ...tdStyle, minWidth: 130 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>
                          {row.name || "—"}
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("tetQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 130 }}>
                          {tetQualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                        </TextField>
                      </td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.registrationNo} onChange={(e) => updateField("tetQualifications", qIndex, "registrationNo", e.target.value)} sx={{ minWidth: 110 }} /></td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.rollNo} onChange={(e) => updateField("tetQualifications", qIndex, "rollNo", e.target.value)} sx={{ minWidth: 90 }} /></td>
                      <td style={tdStyle}><TextField fullWidth size="small" value={q.examConductedBy} onChange={(e) => updateField("tetQualifications", qIndex, "examConductedBy", e.target.value)} sx={{ minWidth: 120 }} /></td>
                      <td style={tdStyle}>
                        <TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("tetQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>
                          {passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                        </TextField>
                      </td>
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
                <Typography
                  sx={{
                    fontSize: 10, mt: 0.5,
                    fontWeight: i === currentStep ? 700 : 400,
                    color: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#94a3b8",
                    textAlign: "center", lineHeight: 1.2,
                  }}
                >
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
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>
            EMRS Details Form
          </Typography>
        </Box>
        <Divider />
        <CardContent sx={{ backgroundColor: "#f8fafc", padding: 4, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <form
            onSubmit={handleSubmit(onSubmit, () => toast.error("Please fix the highlighted form errors before submitting."))}
            style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}
          >
            {/* ── STEP 0: School Details ── */}
            {currentStep === 0 && (
              <SchoolDetails control={control} watch={watch}  setValue={setValue} emrsBasicFields={emrsBasicFields} onPincodeChange={onPincodeChange} />
            )}

            {/* ── STEP 1: Infrastructure ── */}
            {currentStep === 1 && (
              <InfrastructureDetails control={control} watch={watch} syncInfraToConstruction={syncInfraToConstruction} />
            )}

            {/* ── STEP 2: Construction ── */}
            {currentStep === 2 && (
              <ConstructionDetails control={control} constructionRows={constructionRows} setConstructionRows={setConstructionRows} />
            )}

            {/* ── STEP 3: Hostel ── */}
            {currentStep === 3 && (
              <HostelDetails
                control={control} watch={watch} messData={messData} setMessData={setMessData}
                addItem={addItem} removeItem={removeItem} handleItemChange={handleItemChange}
                calculateGrandTotal={calculateGrandTotal}
              />
            )}

            {/* ── STEP 4: Enrollment ── */}
            {currentStep === 4 && (
              <Enrollment enrollmentRows={enrollmentRows} setEnrollmentRows={setEnrollmentRows} />
            )}

            {/* ── STEP 5: Extra Curricular ── */}
            {currentStep === 5 && (
              <ExtraCurricular
                extraCurricularRows={extraCurricularRows}
                setExtraCurricularRows={setExtraCurricularRows}
                control={control}
                watch={watch}
              />
            )}

            {/* ── STEP 6: Hospitalization ── */}
            {currentStep === 6 && (
              <HospitalizationSection
                hospitalizationRows={hospitalizationRows}
                setHospitalizationRows={setHospitalizationRows}
                eyeDateErrors={eyeDateErrors} setEyeDateErrors={setEyeDateErrors}
                earDateErrors={earDateErrors} setEarDateErrors={setEarDateErrors}
                emptyHospitalizationRow={emptyHospitalizationRow}
                calculateHealthMarks={calculateHealthMarks}
                validateBiAnnualDate={validateBiAnnualDate}
                addEyeRow={addEyeRow} addEarRow={addEarRow}
                blankNurseEntry={blankNurseEntry} blankActivity={blankActivity}
                blankVisitLog={blankVisitLog}
              />
            )}

            {/* ── STEP 7: Staff Details ── */}
            {currentStep === 7 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>
                      Teaching Staff Details
                    </Typography>
                  </Grid>
                </Grid>
                {teachingRows.map((row, index) => (
                  <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Sanctioned Strength</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {teachingStaffSummaryFields.filter((f) => ["total","filled","vacant"].includes(f.name)).map((field) => (
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
                        {teachingStaffSummaryFields.filter((f) => !["total","filled","vacant"].includes(f.name)).map((field) => (
                          <Grid item xs={12} sm={6} md={4} key={field.name}>
                            {field.type === "select" ? (
                              <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label={field.label} value={row[field.name] ?? ""}
                                InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: field.type === "date" || undefined }}
                                onChange={(e) => { const u = [...teachingRows]; u[index][field.name] = e.target.value; setteachingRows(u); }}>
                                <MenuItem value="">Select</MenuItem>
                                {field.options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                              </TextField>
                            ) : (
                              <TextField fullWidth size="small" sx={{ minWidth: 220 }} type={field.type || "text"} label={field.label}
                                value={row[field.name]} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: field.type === "date" || undefined }}
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
                        onClick={() => setteachingRows([...teachingRows, {
                          post: "", name: "", dob: "", doj: "", email: "", contact: "",
                          total: "", filled: "", vacant: "",
                          academicQualifications: [{ qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
                          professionalQualifications: [{ qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
                        }])}>
                        + Add Post
                      </Button>
                    </Box>
                  </Box>
                ))}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>
                      Non-Teaching Staff Details
                    </Typography>
                  </Grid>
                </Grid>
                {nonTeachingRows.map((row, index) => (
                  <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Sanctioned Strength</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {nonTeachingStaffDetailFields.filter((f) => ["total","filled","vacant"].includes(f.name)).map((field) => (
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
                        onClick={() => setnonTeachingRows([...nonTeachingRows, {
                          post: "", name: "", dob: "", doj: "", email: "", contact: "",
                          total: "", filled: "", vacant: "",
                          academicQualifications: [{ qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
                          professionalQualifications: [{ qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
                        }])}>
                        + Add Post
                      </Button>
                    </Box>
                  </Box>
                ))}
              </>
            )}

            {/* ── STEP 8: Attendance ── */}
            {currentStep === 8 && (
              <>
                <Typography variant="h6" sx={{ background: "linear-gradient(to right, #16a34a, #4ade80)", color: "#fff", padding: "10px 16px", borderRadius: 2, fontWeight: 600, mb: 3 }}>
                  📊 Attendance Management
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>📘 Student Attendance</Typography>
                <Box sx={{ border: "1px solid #e2e8f0", p: 2, borderRadius: 2, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label="Class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        {["6","7","8","9","10","11","12"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label="Section" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                        {["A","B","C"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField type="month" fullWidth size="small" label="Month" InputLabelProps={{ shrink: true }} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button variant="outlined" component="label" fullWidth>
                        Upload Excel
                        <input type="file" hidden />
                      </Button>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mt: 2, mb: 1 }}>Monthly Attendance</Typography>
                  <Box sx={{ border: "1px solid #bbdefb", borderRadius: 2, p: 2, mb: 2, background: "#f0f7ff" }}>
                    <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 2, fontSize: 14 }}>
                      📅 Monthly Attendance — Class {selectedClass || "—"}{selectedSection ? ` (Section ${selectedSection})` : ""}
                    </Typography>
                    {!selectedClass || !selectedSection ? (
                      <Typography sx={{ color: "#94a3b8", fontStyle: "italic", fontSize: 13 }}>
                        Please select Class and Section above to record attendance.
                      </Typography>
                    ) : (
                      <>
                        {(monthlyAttendance || []).map((att, aIdx) => {
                          const totalStudents = Number(att.totalStudents || 0);
                          const workingDays = Number(att.workingDays || 0);
                          const totalPresent = Number(att.totalPresent || 0);
                          const avgPresent = workingDays > 0 && totalPresent > 0 ? (totalPresent / workingDays).toFixed(1) : null;
                          const avgAbsent = avgPresent !== null && totalStudents > 0 ? (totalStudents - Number(avgPresent)).toFixed(1) : null;
                          const attendancePct = workingDays > 0 && totalPresent > 0 ? ((totalPresent / workingDays) * 100).toFixed(1) : null;
                          const updateAtt = (field, val) =>
                            setMonthlyAttendance((prev) => (prev || []).map((item, i) => i === aIdx ? { ...item, [field]: val } : item));
                          return (
                            <Box key={aIdx} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#fff", position: "relative" }}>
                              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                                <Button size="small" color="error" variant="outlined" sx={{ minWidth: 0, px: 1, py: 0.2, fontSize: 12 }}
                                  onClick={() => setMonthlyAttendance((prev) => prev.filter((_, i) => i !== aIdx))}>✕</Button>
                              </Box>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6} md={3}>
                                  <TextField select label="Month" fullWidth size="small" sx={{ minWidth: 220 }} value={att.month} onChange={(e) => updateAtt("month", e.target.value)}>
                                    {["April","May","June","July","August","September","October","November","December","January","February","March"].map((m) => (
                                      <MenuItem key={m} value={m}>{m}</MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField label="Total Students" type="number" fullWidth size="small" value={att.totalStudents} inputProps={{ min: 0 }}
                                    onChange={(e) => { if (Number(e.target.value) >= 0) updateAtt("totalStudents", e.target.value); }} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                  <TextField label="Working Days" type="number" fullWidth size="small" value={att.workingDays} inputProps={{ min: 0, max: 31 }}
                                    onChange={(e) => { if (Number(e.target.value) >= 0) updateAtt("workingDays", e.target.value); }} />
                                </Grid>
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField label="Days Present" type="number" fullWidth size="small" value={att.totalPresent || ""} inputProps={{ min: 0 }}
                                    onChange={(e) => { if (Number(e.target.value) >= 0) updateAtt("totalPresent", e.target.value); }} />
                                </Grid>
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField label="Avg Present/Day" fullWidth size="small" value={avgPresent !== null ? avgPresent : ""} InputProps={{ readOnly: true, sx: { background: "#f0fdf4", color: "#166534", fontWeight: 700 } }} />
                                </Grid>
                                <Grid item xs={6} sm={4} md={1.5}>
                                  <TextField label="Avg Absent/Day" fullWidth size="small" value={avgAbsent !== null ? avgAbsent : ""} InputProps={{ readOnly: true, sx: { background: avgAbsent > 0 ? "#fef2f2" : "#f0fdf4", color: avgAbsent > 0 ? "#991b1b" : "#166534", fontWeight: 700 } }} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  {attendancePct !== null ? (
                                    <Box sx={{ px: 1 }}>
                                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>Attendance</Typography>
                                        <Typography sx={{ fontSize: 13, fontWeight: 800, color: Number(attendancePct) >= 75 ? "#16a34a" : Number(attendancePct) >= 50 ? "#d97706" : "#dc2626" }}>
                                          {attendancePct}%
                                        </Typography>
                                      </Box>
                                      <Box sx={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                                        <Box sx={{ height: "100%", borderRadius: 4, width: `${Math.min(Number(attendancePct), 100)}%`, background: Number(attendancePct) >= 75 ? "#16a34a" : Number(attendancePct) >= 50 ? "#f59e0b" : "#dc2626", transition: "width 0.3s" }} />
                                      </Box>
                                      <Typography sx={{ fontSize: 11, fontWeight: 600, mt: 0.5, color: Number(attendancePct) >= 75 ? "#16a34a" : Number(attendancePct) >= 50 ? "#d97706" : "#dc2626" }}>
                                        {Number(attendancePct) >= 75 ? "🟢 Good" : Number(attendancePct) >= 50 ? "🟡 Average" : "🔴 Low"}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography sx={{ color: "#94a3b8", fontSize: 12, fontStyle: "italic", px: 1 }}>Fill working days & present to see %</Typography>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          );
                        })}
                        <Button variant="outlined" size="small" onClick={() => setMonthlyAttendance((prev) => [...prev, { month: "", workingDays: "", present: "" }])}>
                          + Add Month
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>👩‍🏫 Teacher Attendance</Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, bgcolor: "#f8faff" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField type="month" size="small" sx={{ minWidth: 220 }} fullWidth label="Month & Year" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                </Box>

                <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Teaching Staff</Typography>
                {teachRows.map((row) => {
                  const present = Math.max(0, (Number(row.workingDays) || 0) - (Number(row.cl) || 0) - (Number(row.el) || 0) - (Number(row.ml) || 0) - (Number(row.mat) || 0));
                  const absent = Math.max(0, (Number(row.workingDays) || 0) - present);
                  const updateField = (field, val) => setTeachRows((prev) => prev.map((r) => r.id === row.id ? { ...r, [field]: val } : r));
                  return (
                    <Box key={row.id} sx={{ border: "1px solid #e2e8f0", p: 2, borderRadius: 2, mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label="Post" value={row.post} onChange={(e) => updateField("post", e.target.value)}>
                            {["Principal","Vice Principal","PGT","TGT","PRT","HM","Lecturer"].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField fullWidth size="small" label="Name" value={row.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Enter name" />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField fullWidth size="small" sx={{ minWidth: 220 }} label="Working Days" type="number" value={row.workingDays} inputProps={{ min: 0, max: 31 }}
                            onChange={(e) => { if (Number(e.target.value) >= 0) updateField("workingDays", Number(e.target.value)); }} />
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center" }}>
                          {row.name && (() => {
                            const rate = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
                            const bg = rate >= 90 ? "#e8f5e9" : rate >= 75 ? "#fff8e1" : "#fce4ec";
                            const color = rate >= 90 ? "#2e7d32" : rate >= 75 ? "#f57f17" : "#c62828";
                            const label = rate >= 90 ? "Good" : rate >= 75 ? "Average" : "Low";
                            return <Chip size="small" label={`${rate}% · ${label}`} sx={{ bgcolor: bg, color, fontWeight: 600, fontSize: 12 }} />;
                          })()}
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
                          {teachRows.length > 1 && (
                            <Button size="small" color="error" variant="outlined" onClick={() => setTeachRows((p) => p.filter((r) => r.id !== row.id))}>Remove</Button>
                          )}
                        </Grid>
                      </Grid>
                      <Typography sx={{ fontWeight: 600, mt: 2, mb: 1, fontSize: 14 }}>📌 Leave Details</Typography>
                      <Grid container spacing={2}>
                        {["cl","el","ml","mat"].map((field, i) => (
                          <Grid item xs={6} md={2} key={field}>
                            <TextField fullWidth size="small" label={["Casual Leave","Earned Leave","Medical Leave","Maternity/Paternity"][i]} type="number"
                              value={row[field]} inputProps={{ min: 0 }} onChange={(e) => updateField(field, e.target.value)} />
                          </Grid>
                        ))}
                        <Grid item xs={6} md={2}>
                          <TextField fullWidth size="small" label="Present Days" value={present} InputProps={{ readOnly: true, sx: { bgcolor: "#f0fdf4", color: "#166534", fontWeight: 700 } }} />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField fullWidth size="small" label="Absent Days" value={absent} InputProps={{ readOnly: true, sx: { bgcolor: "#fef2f2", color: "#991b1b", fontWeight: 700 } }} />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
                <Button variant="outlined" size="small" sx={{ mb: 3 }}
                  onClick={() => setTeachRows((p) => [...p, { id: Date.now(), post: "", name: "", cl: "", el: "", ml: "", mat: "" }])}>
                  + Add Teaching Staff
                </Button>

                <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Non-Teaching Staff</Typography>
                {ntRows.map((row) => {
                  const present = Math.max(0, (Number(row.workingDays) || 0) - (Number(row.cl) || 0) - (Number(row.el) || 0) - (Number(row.ml) || 0) - (Number(row.mat) || 0));
                  const absent = Math.max(0, (Number(row.workingDays) || 0) - present);
                  const updateField = (field, val) => setNtRows((prev) => prev.map((r) => r.id === row.id ? { ...r, [field]: val } : r));
                  return (
                    <Box key={row.id} sx={{ border: "1px solid #e2e8f0", p: 2, borderRadius: 2, mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label="Post" value={row.post} onChange={(e) => updateField("post", e.target.value)}>
                            {["Librarian","Lab Assistant","Clerk","Accountant","Peon","Security Guard","Computer Operator","Sweeper"].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField fullWidth size="small" label="Name" value={row.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Enter name" />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField fullWidth size="small" sx={{ minWidth: 220 }} label="Working Days" type="number" value={row.workingDays} inputProps={{ min: 0, max: 31 }}
                            onChange={(e) => { if (Number(e.target.value) >= 0) updateField("workingDays", Number(e.target.value)); }} />
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
                          {ntRows.length > 1 && (
                            <Button size="small" color="error" variant="outlined" onClick={() => setNtRows((p) => p.filter((r) => r.id !== row.id))}>Remove</Button>
                          )}
                        </Grid>
                      </Grid>
                      <Typography sx={{ fontWeight: 600, mt: 2, mb: 1, fontSize: 14 }}>📌 Leave Details</Typography>
                      <Grid container spacing={2}>
                        {["cl","el","ml","mat"].map((field, i) => (
                          <Grid item xs={6} md={2} key={field}>
                            <TextField fullWidth size="small" label={["Casual Leave","Earned Leave","Medical Leave","Maternity/Paternity"][i]} type="number"
                              value={row[field]} inputProps={{ min: 0 }} onChange={(e) => updateField(field, e.target.value)} />
                          </Grid>
                        ))}
                        <Grid item xs={6} md={2}>
                          <TextField fullWidth size="small" label="Present Days" value={present} InputProps={{ readOnly: true, sx: { bgcolor: "#f0fdf4", color: "#166534", fontWeight: 700 } }} />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField fullWidth size="small" label="Absent Days" value={absent} InputProps={{ readOnly: true, sx: { bgcolor: "#fef2f2", color: "#991b1b", fontWeight: 700 } }} />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
                <Button variant="outlined" size="small" sx={{ mb: 3 }}
                  onClick={() => setNtRows((p) => [...p, { id: Date.now(), post: "", name: "", cl: "", el: "", ml: "", mat: "" }])}>
                  + Add Non-Teaching Staff
                </Button>

                {/* Public Holidays */}
                <Box mt={2}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#b71c1c", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                    📅 Public Holidays (Assam – 2026)
                  </Typography>
                  <Box sx={{ border: "1px solid #ffcdd2", borderRadius: 2, overflow: "hidden" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "2fr 3fr 2fr", background: "linear-gradient(to right, #b71c1c, #e53935)", px: 2, py: 1 }}>
                      {["Date","Holiday Name","Type"].map((h) => (
                        <Typography key={h} sx={{ color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>{h}</Typography>
                      ))}
                    </Box>
                    {[
                      { date: "01 Jan 2026", name: "New Year's Day", type: "National" },
                      { date: "14 Jan 2026", name: "Magh Bihu (Bhogali Bihu)", type: "Assam State" },
                      { date: "26 Jan 2026", name: "Republic Day", type: "National" },
                      { date: "19 Feb 2026", name: "Maha Shivaratri", type: "Restricted" },
                      { date: "20 Mar 2026", name: "Holi", type: "Restricted" },
                      { date: "02 Apr 2026", name: "Good Friday", type: "National" },
                      { date: "14 Apr 2026", name: "Dr. Ambedkar Jayanti", type: "National" },
                      { date: "14 Apr 2026", name: "Bohag Bihu (Rongali Bihu)", type: "Assam State" },
                      { date: "15 Apr 2026", name: "Bohag Bihu (2nd Day)", type: "Assam State" },
                      { date: "16 Apr 2026", name: "Bohag Bihu (3rd Day)", type: "Assam State" },
                      { date: "01 May 2026", name: "Labour Day", type: "National" },
                      { date: "24 May 2026", name: "Buddha Purnima", type: "National" },
                      { date: "27 Jun 2026", name: "Eid ul-Adha (Bakrid)", type: "National" },
                      { date: "27 Jul 2026", name: "Muharram", type: "Restricted" },
                      { date: "15 Aug 2026", name: "Independence Day", type: "National" },
                      { date: "25 Aug 2026", name: "Janmashtami", type: "Restricted" },
                      { date: "05 Sep 2026", name: "Milad-un-Nabi", type: "National" },
                      { date: "02 Oct 2026", name: "Gandhi Jayanti", type: "National" },
                      { date: "20 Oct 2026", name: "Durga Puja (Maha Saptami)", type: "Assam State" },
                      { date: "21 Oct 2026", name: "Durga Puja (Maha Ashtami)", type: "Assam State" },
                      { date: "22 Oct 2026", name: "Durga Puja (Maha Navami)", type: "Assam State" },
                      { date: "23 Oct 2026", name: "Durga Puja (Vijaya Dashami)", type: "Assam State" },
                      { date: "29 Oct 2026", name: "Diwali (Lakshmi Puja)", type: "National" },
                      { date: "31 Oct 2026", name: "Kali Puja", type: "Assam State" },
                      { date: "01 Nov 2026", name: "Bhai Dooj", type: "Restricted" },
                      { date: "16 Nov 2026", name: "Kartik Puja", type: "Assam State" },
                      { date: "19 Nov 2026", name: "Guru Nanak Jayanti", type: "National" },
                      { date: "25 Dec 2026", name: "Christmas Day", type: "National" },
                    ].map((holiday, i) => (
                      <Box key={i} sx={{ display: "grid", gridTemplateColumns: "2fr 3fr 2fr", px: 2, py: 1, background: i % 2 === 0 ? "#fff5f5" : "#ffffff", borderTop: "1px solid #ffcdd2", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "0.78rem", color: "#333" }}>{holiday.date}</Typography>
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 500, color: "#212121" }}>{holiday.name}</Typography>
                        <Box>
                          <Typography sx={{ display: "inline-block", fontSize: "0.68rem", fontWeight: 600, px: 1, py: 0.3, borderRadius: 1, background: holiday.type === "National" ? "#e3f2fd" : holiday.type === "Assam State" ? "#e8f5e9" : "#fff8e1", color: holiday.type === "National" ? "#0d47a1" : holiday.type === "Assam State" ? "#1b5e20" : "#e65100" }}>
                            {holiday.type}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}

            {/* ── STEP 9: Operational Cost ── */}
            {currentStep === 9 && (
              <OperationalCost
                operationalCostRows={operationalCostRows}
                setOperationalCostRows={setOperationalCostRows}
              />
            )}

            {/* ── STEP 10: Financial & Procurement ── */}
            {currentStep === 10 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>
                      Financial Management and Procurement Compliance
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3, background: "#fff", mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label="Academic Year">
                        {["2023-2024","2024-2025","2025-2026","2027-2028"].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>Procurement through GeM Portal (5 Marks)</Typography>
                  <Button variant="contained" size="small" onClick={() => setProcurementDialogOpen(true)} sx={{ mb: 2, backgroundColor: "#1976d2" }}>
                    + Add Procurement
                  </Button>
                  {procurements.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0", marginBottom: 16 }}>
                      <thead>
                        <tr style={{ background: "#e3f2fd" }}>
                          {["Type","Description","Total No.","Order Date","Value (₹)","Vendor","Through GeM","GeM %","Marks","Action"].map((h) => (
                            <th key={h} style={thStyle}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {procurements.map((p, i) => {
                          const rowPct = Number(p.totalNumber) > 0 ? ((Number(p.throughGem) / Number(p.totalNumber)) * 100).toFixed(2) : "0.00";
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
                                <Button size="small" color="error" variant="outlined" onClick={() => setProcurements((prev) => prev.filter((_, idx) => idx !== i))}>Remove</Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>*Marking Criteria (Out of 5) - GeM Procurement Percentage</Typography>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0" }}>
                      <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                          <th style={thStyle}>GeM Procurement Percentage</th>
                          <th style={thStyle}>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[{ label: "100% procurement through GeM", marks: 5 },{ label: "75% – 99% procurement through GeM", marks: 4 },{ label: "50% – 74% procurement through GeM", marks: 3 },{ label: "25% – 49% procurement through GeM", marks: 1 },{ label: "Below 25%", marks: 0 }].map((row, i) => (
                          <tr key={i} style={{ background: gemMarks === row.marks && procurements.length > 0 ? "#e8f5e9" : "white" }}>
                            <td style={tdStyle}>{row.label}</td>
                            <td style={tdStyle}>{row.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Grid>
                  <Dialog open={procurementDialogOpen} onClose={() => setProcurementDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white" }}>Add Procurement Entry</DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                      <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Type of Procurement</InputLabel>
                            <Select value={currentProcurement.type} label="Type of Procurement" onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, type: e.target.value }))}>
                              <MenuItem value="Goods">Goods</MenuItem>
                              <MenuItem value="Services">Services</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size="small" label="Description" value={currentProcurement.description} onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, description: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size="small" label="Total Number of Procurements" type="number" value={currentProcurement.totalNumber} onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, totalNumber: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size="small" label="Procurement Order Date" type="date" InputLabelProps={{ shrink: true }} value={currentProcurement.orderDate} onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, orderDate: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size="small" label="Procurement Value (₹)" type="number" value={currentProcurement.value} onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, value: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size="small" label="Vendor" value={currentProcurement.vendor} onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, vendor: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size="small" label="Procurement through GeM Portal (count)" type="number" value={currentProcurement.throughGem} onChange={(e) => setCurrentProcurement((prev) => ({ ...prev, throughGem: e.target.value }))} />
                        </Grid>
                        {currentProcurement.totalNumber && currentProcurement.throughGem && (
                          <Grid item xs={12}>
                            <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 600 }}>
                              GeM %: {((Number(currentProcurement.throughGem) / Number(currentProcurement.totalNumber)) * 100).toFixed(2)}% → Marks: {getGemMarks(((Number(currentProcurement.throughGem) / Number(currentProcurement.totalNumber)) * 100).toFixed(2))}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                      <Button onClick={() => { setCurrentProcurement({ type: "", description: "", totalNumber: "", orderDate: "", value: "", vendor: "", throughGem: "" }); setProcurementDialogOpen(false); }}>Cancel</Button>
                      <Button variant="contained"
                        disabled={!currentProcurement.type || !currentProcurement.totalNumber || !currentProcurement.throughGem}
                        onClick={() => { setProcurements((prev) => [...prev, currentProcurement]); setCurrentProcurement({ type: "", description: "", totalNumber: "", orderDate: "", value: "", vendor: "", throughGem: "" }); setProcurementDialogOpen(false); }}>
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>Fund Utilization Efficiency</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Total Funds Allocated" type="number" inputProps={{ min: 0 }} value={financialData.totalFundsAllocated} onChange={(e) => handleFundsChange("totalFundsAllocated", e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Total Funds Utilized" type="number" inputProps={{ min: 0 }} value={financialData.totalFundsUtilized} onChange={(e) => handleFundsChange("totalFundsUtilized", e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Utilization Percentage (%)" type="number" value={financialData.utilizationPercentage} InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Marks Obtained" type="number" InputProps={{ readOnly: true }} value={financialData.fundUtilMarksObtained} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="Audit Conducted Annually" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>*Marking Criteria (Out of 5) - Fund Utilization</Typography>
                      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0" }}>
                        <thead>
                          <tr style={{ background: "#f5f5f5" }}>
                            <th style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "left" }}>Fund Utilization</th>
                            <th style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "left" }}>Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[["95% – 100%",5],["70% – 94%",3],["50% – 69%",1],["Below 50%",0]].map(([label, marks], i) => (
                            <tr key={i}><td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{label}</td><td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{marks}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>Component-wise Breakup of Recurring Fund (300 Students)</Typography>
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0", marginBottom: "24px" }}>
                  <thead>
                    <tr style={{ background: "#1976d2", color: "#fff" }}>
                      {["S.No","Component","Max. Permissible Annual Expenditure per Student (A)","Max. Permissible Annual Expenditure for 300 Students (B) = A×300","Fund Demanded by State Society (C)","Funds Already Released (D)","Fund Released for Remaining Period (E)","Remarks"].map((h) => (
                        <th key={h} style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: h === "S.No" ? "center" : "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recurringBreakup.map((row, index) => (
                      <tr key={index} style={{ background: index % 2 === 0 ? "#fafafa" : "#fff", verticalAlign: "middle" }}>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "center" }}>{row.sno}</td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px", fontWeight: "500", color: "#333" }}>{row.component}</td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                          <TextField size="small" type="number" inputProps={{ min: 0, style: { textAlign: "right" } }} value={row.colA} onChange={(e) => handleBreakupChange(index, "colA", e.target.value)} sx={{ width: "130px" }} />
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                          <TextField size="small" type="number" value={(Number(row.colA) || 0) * 300} InputProps={{ readOnly: true }} inputProps={{ style: { textAlign: "right", background: "#f0f4ff", color: "#1976d2" } }} sx={{ width: "140px" }} />
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                          <TextField size="small" type="number" inputProps={{ min: 0, style: { textAlign: "right" } }} value={row.colC} onChange={(e) => handleBreakupChange(index, "colC", e.target.value)} sx={{ width: "130px" }} />
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                          <TextField size="small" type="number" inputProps={{ min: 0, style: { textAlign: "right" } }} value={row.colD} onChange={(e) => handleBreakupChange(index, "colD", e.target.value)} sx={{ width: "130px" }} />
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                          <TextField size="small" type="number" inputProps={{ min: 0, style: { textAlign: "right" } }} value={row.colE} onChange={(e) => handleBreakupChange(index, "colE", e.target.value)} sx={{ width: "140px" }} />
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "4px" }}>
                          <TextField size="small" placeholder="Remarks" value={row.remarks} onChange={(e) => handleBreakupChange(index, "remarks", e.target.value)} sx={{ width: "150px" }} />
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#e3f2fd" }}>
                      <td colSpan={2} style={{ border: "1px solid #e0e0e0", padding: "8px", fontWeight: "bold" }}>TOTAL</td>
                      {["colA","colA*300","colC","colD","colE"].map((col, i) => (
                        <td key={i} style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "right", fontWeight: "bold" }}>
                          ₹{col === "colA*300"
                            ? recurringBreakup.reduce((sum, r) => sum + (Number(r.colA) || 0) * 300, 0).toLocaleString("en-IN")
                            : recurringBreakup.reduce((sum, r) => sum + (Number(r[col]) || 0), 0).toLocaleString("en-IN")}
                        </td>
                      ))}
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}></td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {/* ── STEP 11: Image Upload ── */}
            {currentStep === 11 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>
                      EMRS Image
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button variant="contained" fullWidth onClick={() => setOpenImageDialog(true)}>Add Photo</Button>
                </Grid>
                {uploadedImage && (
                  <Grid item xs={12} md={4}>
                    <img src={URL.createObjectURL(uploadedImage)} alt="preview" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px", marginTop: "16px" }} />
                    <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>📎 {uploadedImage.name}</Typography>
                  </Grid>
                )}
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3, mb: 3, background: "#f8fafc" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>📋 Preview & Confirm</Typography>
                  <Grid container spacing={2}>
                    {[
                      ["School Name", watch("schoolname")],
                      ["EMRS Code", watch("EMRScode")],
                      ["Principal Name", watch("NameofthePrincipal")],
                      ["District", watch("district")],
                      ["Affiliation", watch("Affiliation")],
                      ["School Type", watch("schooltype")],
                    ].map(([label, val]) => (
                      <Grid item xs={12} sm={6} md={4} key={label}>
                        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                        <Typography fontWeight={600}>{val || "—"}</Typography>
                      </Grid>
                    ))}
                    {[
                      ["Teaching Staff Records", `${teachingRows.length} record(s)`],
                      ["Non-Teaching Staff Records", `${nonTeachingRows.length} record(s)`],
                      ["Enrollment Records", `${enrollmentRows.length} class(es)`],
                      ["Hospitalization Cases", `${hospitalizationRows.length} case(s)`],
                      ["Extra Curricular Activities", `${extraCurricularRows.length} activity(s)`],
                    ].map(([label, val]) => (
                      <Grid item xs={12} sm={6} md={4} key={label}>
                        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                        <Typography fontWeight={600}>{val}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button type="submit" variant="contained" disabled={loading}
                      sx={{ background: "linear-gradient(to right, #16a34a, #4ade80)", minWidth: 160 }}
                      startIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}>
                      {loading ? "Submitting..." : "✅ Submit"}
                    </Button>
                  </Box>
                </Grid>
              </>
            )}

            {/* ── Navigation ── */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} pt={3} sx={{ borderTop: "1px solid #e2e8f0" }}>
              <Button variant="outlined" onClick={handleBack} disabled={currentStep === 0} sx={{ minWidth: 120 }}>← Back</Button>
              <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Step {currentStep + 1} of {STEPS.length}</Typography>
              {currentStep < STEPS.length - 1 && (
                <Button variant="contained" onClick={handleNext} sx={{ minWidth: 150, background: "linear-gradient(to right, #1976d2, #42a5f5)" }}>
                  Save & Next →
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