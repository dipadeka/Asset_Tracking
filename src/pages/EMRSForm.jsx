import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import * as exifr from "exifr";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { GirlSharp } from "@mui/icons-material";
const EMRSForm = ({ addSubmittedForm }) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

const handleImageUpload = (file) => {
  if (!file) return;
  setUploadedImage(file);
  setValue("emrsImage", file);
};
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedForms, setSubmittedForms] = useState([]);

const STEPS = [
  { label: "School Details",     icon: "🏫" },
  { label: "Infrastructure",     icon: "🔬" },
  { label: "Construction",       icon: "🏗️" },
  { label: "Hostel",             icon: "🏠" },
  { label: "Enrollment",         icon: "🎓" },
  { label: "Extra Curricular",   icon: "🎭" },
  { label: "Hospitalization",    icon: "🏥" },
  { label: "Staff Details",      icon: "👨‍🏫" },
  { label: "Operational Cost",   icon: "💰" },
];

const handleNext = () => {
  setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleBack = () => {
  setCurrentStep(prev => Math.max(prev - 1, 0));
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const [reservationRows, setReservationRows] = useState([
    {
      name: "",
      class: "",
      section: "",
      category: ""
    }
  ]);

  const { control, handleSubmit, setValue, watch, register } = useForm({});
  // ================= DROPOUT / MIGRATION / ACHIEVEMENT STATES =================
  const [enrollmentRows, setEnrollmentRows] = useState([
    {
      academicYear: "",
      class: "",
      section: "",
      sanctionedCapacity: "",
      currentEnrollment: "",
      categoryBreakdown: { ST: "", PVTG: "", "DNT/NT/SNT": "", Orphan: "", LWE: "", "Divyang": "" },
      // Academic Performance
      boardClass: "",
      appeared: "",
      passed: "",
      passPercent: "",
      above75: "",
      above75Error: "",
      below50: "",
      stream: "",
      distinctions: "",
      topScorer: "",
      topScore: "",
      // Dropouts
     dropouts: [{ studentName: "", rollNo: "", reason: "", guardianName: "", guardianContactNo: "", pinCode: "", district: "", postOffice: "", gramPanchayat: "", village: "" }],
      // Migrations
      migrations: [{ studentName: "", migratedFrom: "", transferredTo: "", reason: "" }],
      // Achievements
      achievements: [{ studentName: "", eventName: "", level: "", recognition: "" }]
    }
  ]);

  const [extraCurricularRows, setExtraCurricularRows] = useState([
    {
      academicYear: "",
      initiativeName: "",
      collaboratingPartner: "",
      areasOfDevelopment: [],
      description: "",
      targetStudents: "",
      status: ""
    }
  ]);

  const [hospitalizationRows, setHospitalizationRows] = useState([
    {
      studentName: "",
      rollNo: "",
      class: "",
      section: "",
      admissionDate: "",
      dischargeDate: "",
      reasonForHospitalization: "",
      hospitalEmpanelled: "",
      empanellementValidity: "",
      treatmentDetails: "",
       empanelmentDepartment: "",
      doctorName: "",
      estimatedCost: "",
      amountClaimed: "",
      claimStatus: "",
      guardianName: "",
      guardianContact: ""
    }
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
      academicQualifications: [{ post:"", staffname:" ",  qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
      professionalQualifications: [{  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
      tetQualifications: [{  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }]
    }
  ]);
  const [nonTeachingRows, setnonTeachingRows] = useState([
    {
      post: "", name: "", dob: "", doj: "", email: "", contact: "",
      total: "", filled: "", vacant: "",
      academicQualifications: [{  post:"", staffname:" ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
      professionalQualifications: [{  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
      tetQualifications: [{  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }]
    }
  ]);
  // ================= CONSTRUCTION STATUS STATE =================
  const [constructionRows, setConstructionRows] = useState({
    school: [
      { component: "Classrooms",   units: "6 rooms",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Teachers Lab", units: "2 rooms",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Student Lab",  units: "2 labs",    status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Library",      units: "1 library", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
     { component: "Science Lab",      units: "1 lab",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
{ component: "↳ Biology Lab",    units: "1 lab",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
{ component: "↳ Chemistry Lab",  units: "1 lab",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
{ component: "↳ Physics Lab",    units: "1 lab",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Auditorium",   units: "1 hall",    status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Infirmary",    units: "1 room",    status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    residence: [
      { component: "Boys Hostel",  units: "50 beds",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Girls Hostel",  units: "50 beds",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Water System",    units: "2 tanks",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Warden Office",   units: "1 office",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Recreation Area", units: "1 area",    status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Laundry Area",    units: "1 area",    status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Kitchen",         units: "1 kitchen", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Staff Housing",   units: "10 units",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    outdoor: [
      { component: "Compound Wall",  units: "500 m",     status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Garden",         units: "2000 sqm",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Worker Toilets", units: "4 units",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Parking",        units: "500 sqm",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
      utilities: [
  { component: "Electrical System",      units: "1 system", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
  { component: "↳ Transformer Installed", units: "1 unit",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
  { component: "↳ Digiset Installed",     units: "1 unit",   status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Water Tanks",       units: "2 tanks",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Sewage System",     units: "1 plant",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Rainwater Harvest", units: "1 system", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Security Cabin",    units: "1 cabin",  status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ]
  });

  const handleAddNonTeachingSummary = () => {
    setNonTeachingSummaryRows([
      ...nonTeachingSummaryRows,
      { post: "", total: "", filled: "", vacant: "" }
    ]);
  };

  const prepareBasicDetails = (data) => ({
    EMRScode: Number(data.EMRScode),
    EMRSid: data.EMRSid?.trim(),
    udaisecode: Number(data.udaisecode),
    schoolname: data.schoolname?.trim(),
    schooltype: data.schooltype?.trim(),        // dropdown value
    affiliation: data.affiliation?.trim(),      // dropdown value
    principalName: data.principalName?.trim(),
    contactno: data.contactno?.trim(),
    email: data.email?.trim()
  });


  const prepareLocationDetails = (data) => ({
    state: data.state,
    district: data.district,
    block: data.block,
    grampanchayat: data.grampanchayat,
    village: data.village
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
    medicalroom: data.medicalroom || ""
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
        contact: data.boysWardenContact
      }
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
        contact: data.girlsWardenContact
      }
    }
  });
  const prepareClassStrength = (rows) => {
    return rows.map((row) => {

      const sanctionedCapacity = Number(row.sanctionedCapacity || 0);
      const currentEnrollment = Number(row.currentEnrollment || 0);

      // ── CSV EXPORT ──
const exportCSV = (form) => {
  const rows = [
    ["Field", "Value"],
    ["School Name", form.payload.schoolname],
    ["EMRS Code", form.payload.EMRScode],
    ["District", form.payload.district],
    ["Principal", form.payload.principalName],
    ["Affiliation", form.payload.affiliation],
    ["School Type", form.payload.schooltype],
    ["Contact", form.payload.contactno],
    ["Email", form.payload.email],
    ["Submitted At", form.submittedAt],
  ];
  const csvContent = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EMRS_${form.EMRScode || "form"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── PDF EXPORT (uses browser print) ──
const exportPDF = (form) => {
  const p = form.payload;
  const html = `
    <html><head><title>EMRS Form</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 30px; }
      h1 { color: #1976d2; } h2 { color: #374151; border-bottom: 1px solid #e2e8f0; pb: 4px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { background: #1976d2; color: #fff; padding: 8px; text-align: left; }
      td { padding: 7px 8px; border: 1px solid #e2e8f0; }
      tr:nth-child(even) { background: #f8fafc; }
    </style></head>
    <body>
      <h1>EMRS Details Form</h1>
      <p><strong>Submitted:</strong> ${form.submittedAt}</p>
      <h2>Basic Details</h2>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>School Name</td><td>${p.schoolname || "—"}</td></tr>
        <tr><td>EMRS Code</td><td>${p.EMRScode || "—"}</td></tr>
        <tr><td>District</td><td>${p.district || "—"}</td></tr>
        <tr><td>Principal</td><td>${p.principalName || "—"}</td></tr>
        <tr><td>Affiliation</td><td>${p.affiliation || "—"}</td></tr>
        <tr><td>School Type</td><td>${p.schooltype || "—"}</td></tr>
        <tr><td>Contact</td><td>${p.contactno || "—"}</td></tr>
        <tr><td>Email</td><td>${p.email || "—"}</td></tr>
      </table>
      <h2>Infrastructure</h2>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Total Classrooms</td><td>${p.totalClassrooms || "—"}</td></tr>
        <tr><td>Smart Class</td><td>${p.classroomWithSmartClass || "—"}</td></tr>
        <tr><td>Science Lab</td><td>${p.scienceLab || "—"}</td></tr>
        <tr><td>Computer Lab</td><td>${p.computerLab || "—"}</td></tr>
        <tr><td>Library</td><td>${p.library || "—"}</td></tr>
        <tr><td>Playground</td><td>${p.playground || "—"}</td></tr>
      </table>
    </body></html>
  `;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

      return {
        academicYear: row.academicYear,
        class: row.class,
        section: row.section,
        sanctionedCapacity,
        currentEnrollment,
        category: row.category

      };
    });
  };

  const prepareAcademicResults = (results) => {
    return results.map((item) => {
      const appeared = Number(item.appeared || 0);
      const passed = Number(item.passed || 0);

      return {
        year: item.year,
        boardClass: item.boardClass,
        appeared,
        passed,
        passPercent:
          appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : 0,
        above75: Number(item.above75 || 0),
        below50: Number(item.below50 || 0)
      };
    });
  };
  const prepareDropouts = (dropouts) => {
    return dropouts.map((item) => ({
      year: item.year,
      class: item.class,
      studentName: item.studentName?.trim(),
      reason: item.reason
    }));
  };
  const prepareMigrations = (migrations) => {
    return migrations.map((item) => ({
      year: item.year,
      studentName: item.studentName?.trim(),
      class: item.class?.trim(),
      migratedfrom: item.migratedfrom,
      transferredTo: item.transferredTo,
      reason: item.reason
    }));
  };

  const prepareAchievements = (achievements) => {
    return achievements.map((item) => ({
      studentName: item.studentName?.trim(),
      class: item.class,
      eventName: item.eventName,
      level: item.level,
      recognition: item.recognition
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
      status: item.status
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
      guardianContact: item.guardianContact
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
        vacant: total - filled
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
      contact: staff.contact
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
        vacant: total - filled
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
      contact: staff.contact
    }));
  };

  const prepareOperationalCost = (cost) => {
    const electricity = Number(cost.electricity || 0);
    const water = Number(cost.water || 0);
    const internet = Number(cost.internet || 0);
    const maintenance = Number(cost.maintenance || 0);
    const mess = Number(cost.mess || 0);
    const amount = Number(cost.amount || 0)

    return {
      electricity,
      water,
      internet,
      maintenance,
      mess,
      totalMonthlyCost
    };
  };
  
  const onSubmit = async (data) => {
  setLoading(true);
  console.log("Form Data:", data);

  try {
    const payload = {
      // ── BASIC DETAILS ──
      EMRScode: Number(data.EMRScode),
      EMRSid: data.EMRSid?.trim(),
      udaisecode: Number(data.udaisecode),
      schoolname: data.schoolname?.trim(),
      schooltype: data.schooltype?.trim(),
      affiliation: data.Affiliation?.trim(),
      principalName: data.NameofthePrincipal?.trim(),
      contactno: data.contactno?.trim(),
      email: data.emailid?.trim(),

      // ── LOCATION DETAILS ──
      pincode: data.pincode,
      state: data.state,
      district: data.district,
      block: data.block,
      grampanchayat: data.grampanchayat,

      // ── INFRASTRUCTURE DETAILS ──
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

      // ── HOSTEL ADMINISTRATION ──
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
          contact: data.boysWardenContact
        }
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
          contact: data.girlsWardenContact
        }
      },

      // ── CLASS STRENGTH + ACADEMIC PERFORMANCE ──
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
          topScore: Number(row.topScore || 0)
        },
        dropouts: row.dropouts.map((d) => ({
          rollNo: d.rollNo,
          studentName: d.studentName?.trim(),
          reason: d.reason?.trim(),
          guardianContactNo: d.guardianContactNo
        })),
        migrations: row.migrations.map((m) => ({
          studentName: m.studentName?.trim(),
          migratedFrom: m.migratedFrom?.trim(),
          transferredTo: m.transferredTo?.trim(),
          reason: m.reason?.trim()
        })),
        achievements: row.achievements.map((a) => ({
          studentName: a.studentName?.trim(),
          eventName: a.eventName?.trim(),
          level: a.level,
          recognition: a.recognition?.trim()
        }))
      })),

      // ── EXTRA CURRICULAR ──
      extraCurricular: extraCurricularRows.map((item) => ({
        academicYear: item.academicYear,
        initiativeName: item.initiativeName?.trim(),
        collaboratingPartner: item.collaboratingPartner?.trim(),
        areasOfDevelopment: item.areasOfDevelopment,
        description: item.description?.trim(),
        targetStudents: item.targetStudents?.trim(),
        status: item.status
      })),

      // ── HOSPITALIZATION ──
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
        guardianContact: item.guardianContact
      })),

      // ── TEACHING STAFF ──
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
        tetQualifications: staff.tetQualifications
      })),

      // ── NON-TEACHING STAFF ──
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
        professionalQualifications: staff.professionalQualifications
      })),

      // ── OPERATIONAL COST ──
      operationalCost: {
        year: data.Year,
        month: data.month,
        costType: data.operationalcost,
        amount: Number(data.amount || 0)
      },
      // ── CONSTRUCTION STATUS ──
        constructionStatus: {
          projectStartDate: data.projectStartDate || null,
          expectedEndDate:  data.projectEndDate   || null,
          totalBudget:      Number(data.totalProjectBudget || 0),
          school:    constructionRows.school,
          residence: constructionRows.residence,
          outdoor:   constructionRows.outdoor,
          utilities: constructionRows.utilities,
        },
    };

    console.log("FINAL EMRS PAYLOAD:", payload);

    const response = await fetch("/api/emrs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setSubmittedForms(prev => [...prev, {
  id: result._id || Date.now(),
  schoolname: payload.schoolname,
  EMRScode: payload.EMRScode,
  district: payload.district,
  submittedAt: new Date().toLocaleString(),
  payload // store full data for export
}]);
setSubmitSuccess(true);

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

   setSubmitSuccess(true);
    console.log("EMRS RESPONSE:", result);

  } catch (error) {
    console.error("Error:", error.message);
    alert("Failed to Submit EMRS Data ❌ " + error.message);
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
      scienceLab:     { cat: "school", component: "Science Lab" },
      library:        { cat: "school", component: "Library" },
      Auditorium:     { cat: "school", component: "Auditorium" },
      "Medical Room": { cat: "school", component: "Infirmary" },
    };
    if (map[fieldName] && value === "Yes") {
      const { cat, component } = map[fieldName];
      setConstructionRows(prev => ({
        ...prev,
        [cat]: prev[cat].map(r =>
          r.component === component && r.status === "Not Started"
            ? { ...r, status: "In Progress" }
            : r
        )
      }));
    }
  };

  // ================= CONSTRUCTION TABLE RENDERER =================
  const CONSTRUCTION_CONFIG = {
    school:    { label: "School Block",    icon: "🏫", color: "#1976d2", light: "#e3f2fd" },
    residence: { label: "Residence Block", icon: "🏠", color: "#7b1fa2", light: "#f3e5f5" },
    outdoor:   { label: "Outdoor Block",   icon: "🌳", color: "#2e7d32", light: "#e8f5e9" },
    utilities: { label: "Utilities Block", icon: "⚡", color: "#e65100", light: "#fff3e0" },
  };

  const CONSTRUCTION_STATUS_STYLE = {
    "Completed":   { color: "#16a34a", bg: "#dcfce7" },
    "In Progress": { color: "#d97706", bg: "#fef3c7" },
    "Not Started": { color: "#6b7280", bg: "#f3f4f6" },
    "On Hold":     { color: "#7c3aed", bg: "#ede9fe" },
    "Cancelled":   { color: "#dc2626", bg: "#fee2e2" },
  };

  const renderConstructionTable = (catKey) => {
    const cfg = CONSTRUCTION_CONFIG[catKey];
    const rows = constructionRows[catKey];

    const updateRow = (idx, field, val) => {
      setConstructionRows(prev => {
        const updated = [...prev[catKey]];
        updated[idx] = { ...updated[idx], [field]: val };
        if (field === "status" && val === "Completed")   updated[idx].progress = 100;
        if (field === "status" && val === "Not Started") updated[idx].progress = 0;
        return { ...prev, [catKey]: updated };
      });
    };

    const thStyle = {
      background: cfg.color, color: "#fff", padding: "9px 10px",
      fontSize: 12, fontWeight: 600, textAlign: "left",
      whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.2)"
    };
    const tdStyle = {
      padding: "8px 10px", fontSize: 13, verticalAlign: "middle",
      borderBottom: "1px solid #e5e7eb", borderRight: "1px solid #f1f5f9"
    };
    const nativeInput = {
      width: "100%", border: "1px solid #e2e8f0", borderRadius: 6,
      padding: "5px 8px", fontSize: 12, fontFamily: "inherit",
      outline: "none", boxSizing: "border-box", background: "#fff"
    };

    return (
      <Box key={catKey} mb={3}>
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: cfg.light, border: `1px solid ${cfg.color}30`,
          borderRadius: "10px 10px 0 0", px: 2, py: 1.5
        }}>
          <Typography sx={{ fontWeight: 700, color: cfg.color, fontSize: 15 }}>
            {cfg.icon}  {cfg.label}
          </Typography>
          <Box display="flex" gap={1}>
            <Typography sx={{ background: "#dcfce7", color: "#16a34a", px: 1.5, py: 0.3, borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
              ✅ {rows.filter(r => r.status === "Completed").length} Done
            </Typography>
            <Typography sx={{ background: "#fef3c7", color: "#d97706", px: 1.5, py: 0.3, borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
              🔄 {rows.filter(r => r.status === "In Progress").length} Active
            </Typography>
          </Box>
        </Box>
        <Box sx={{ overflowX: "auto", border: `1px solid ${cfg.color}25`, borderTop: "none", borderRadius: "0 0 10px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1050 }}>
            <thead>
              <tr>
                {["S.No","Component","Units","Status","Progress (%)","Start Date","End Date","Assigned To","Budget (₹)","Remarks"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                  <td style={{ ...tdStyle, textAlign: "center", color: "#9ca3af", fontWeight: 600, width: 40 }}>{i + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
  {row.component.startsWith("↳") ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 2 }}>
      <Box sx={{ width: 3, height: 3, borderRadius: "50%", background: "#94a3b8", mt: "1px" }} />
      <Typography sx={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
        {row.component.replace("↳ ", "")}
      </Typography>
    </Box>
  ) : (
    <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{row.component}</Typography>
  )}
</td>

                  <td style={{ ...tdStyle, minWidth: 100 }}>
  <input
    type="text"
    value={row.units}
    onChange={e => updateRow(i, "units", e.target.value)}
    style={nativeInput}
    placeholder="e.g. 2 rooms"
  />
</td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <select
                      value={row.status}
                      onChange={e => updateRow(i, "status", e.target.value)}
                      style={{
                        ...nativeInput,
                        background: CONSTRUCTION_STATUS_STYLE[row.status]?.bg || "#f3f4f6",
                        color: CONSTRUCTION_STATUS_STYLE[row.status]?.color || "#6b7280",
                        fontWeight: 600, cursor: "pointer"
                      }}
                    >
                      {["Not Started","In Progress","Completed","On Hold","Cancelled"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input
                      type="number" min={0} max={100} value={row.progress}
                      onChange={e => updateRow(i, "progress", Math.min(100, Math.max(0, Number(e.target.value))))}
                      style={nativeInput}
                    />
                    <Box sx={{ mt: 0.5, height: 5, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
                      <Box sx={{
                        height: "100%", borderRadius: 2, transition: "width 0.3s",
                        width: `${row.progress}%`,
                        background: row.progress === 100 ? "#16a34a" : row.progress > 0 ? "#f59e0b" : "#d1d5db"
                      }} />
                    </Box>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input type="date" value={row.startDate} onChange={e => updateRow(i, "startDate", e.target.value)} style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input type="date" value={row.endDate} onChange={e => updateRow(i, "endDate", e.target.value)} style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <input type="text" value={row.assignedTo} onChange={e => updateRow(i, "assignedTo", e.target.value)} placeholder="Name / Agency" style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 110 }}>
                    <input type="number" value={row.budget} onChange={e => updateRow(i, "budget", e.target.value)} placeholder="0" style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <input type="text" value={row.remarks} onChange={e => updateRow(i, "remarks", e.target.value)} placeholder="Optional" style={nativeInput} />
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
      name: "schooltype", label: "School Type", type: "select",
      options: [
        "Girls",
        "Boys",
        "Co-Ed",
      ],
    },
    {
      name: "Affiliation", label: "Affiliation", type: "select",
      options: [
        "SEBA",
        "CBSE",
        "ICSC",
      ],
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
      name: "ScienceLab", label: "Science Lab",
      options: [
        "Yes",
        "No",
      ],
    },
    {
      name: "ComputerLab", label: "Computer Lab",
      options: [
        "Yes",
        "No",
      ],
    },
    {
      name: "Library", label: "Library",
      options: [
        "Yes",
        "No",
      ],
    },
    {
      name: "booksInLibrary",
      label: "No of Books in Library",
      type: "number"
    },
    {
      name: "Playground", label: "Playground",
      options: [
        "Yes",
        "No",
      ],
    },
    {
      name: "auditorium", label: "Auditorium",
      options: [
        "Yes",
        "No",
      ],
    },
    {
      name: "medicalroom", label: "Medical Room",
      options: [
        "Yes",
        "No",
      ],
    },
  ];
  // ================= HOSTEL ADMINISTRATION DETAILS =================
  // ================= BOYS HOSTEL =================

  const boysHostelFields = [

    { name: "boysHostelCapacity", label: "Boys Hostel Capacity", type: "number" },

    { name: "boysBedsAvailable", label: "Beds Available", type: "number" },

    { name: "boysCurrentOccupancy", label: "Current Occupancy", type: "number" },

    {
      name: "boysCCTVInstalled",
      label: "CCTV Installed",
      options: ["Yes", "No"]
    },

    { name: "boysNoOfCCTV", label: "No of CCTV Installed", type: "number" },

    {
      name: "boysSecurityAgency",
      label: "Security Agency Available",
      options: ["Yes", "No"]
    },

    { name: "boysWardenName", label: "Boys Warden Name" },

    { name: "boysWardenEmail", label: "Boys Warden Email" },

   { name: "boysWardenContact", label: "Boys Warden Contact", type: "number" },


  ];


  // ================= GIRLS HOSTEL =================

  const girlsHostelFields = [

    { name: "girlsHostelCapacity", label: "Girls Hostel Capacity", type: "number" },

    { name: "girlsBedsAvailable", label: "Beds Available", type: "number" },

    { name: "girlsCurrentOccupancy", label: "Current Occupancy", type: "number" },

    {
      name: "girlsCCTVInstalled",
      label: "CCTV Installed",
      options: ["Yes", "No"]
    },

    { name: "girlsNoOfCCTV", label: "No of CCTV Installed", type: "number" },

    {
      name: "girlsSecurityAgency",
      label: "Security Agency Available",
      options: ["Yes", "No"]
    },

    { name: "girlsWardenName", label: "Girls Warden Name" },

    { name: "girlsWardenEmail", label: "Girls Warden Email" },

   { name: "girlsWardenContact", label: "Girls Warden Contact", type: "number" },



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
        "2029-2030"
      ]
    },

    {
      name: "class",
      label: "Class",
      options: ["6", "7", "8", "9", "10", "11", "12"]
    },

    {
      name: "section",
      label: "Section",
      options: ["A", "B", "C"]
    },

    {
      name: "sanctionedCapacity",
      label: "Sanctioned Capacity",
      type: "number"
    },

    {
      name: "currentEnrollment",
      label: "Current Enrollment",
      type: "number"
    },
    {
      name: "category",
      label: "Category",
      options: [
        "ST",
        "PVTG",
        "DNT/NT/SNT",
        "Orphan",
        "LWE",
        "Divyang"
      ]
    }
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
    "National Cultural Competition"
  ];


  // ================= TEACHING STAFF =================
  const teachingStaffSummaryFields = [
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

    { name: "name", label: "Staff Name" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "doj", label: "Date of Joining", type: "date" },
    { name: "email", label: "Email" },
    { name: "contact", label: "Contact Number" },

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
        "Hostel Warden"
      ],
    },

    { name: "name", label: "Staff Name" },
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
      name: "Year", label: "Year",
      options: [
        "2024-2025",
        "2025-2026",
        "2026-2027"
      ],
    },
    {
      name: "month", label: "Month",
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
        "December"
      ],
    },
    {
      name: "operationalcost", label: "Operational Cost",
      options: [
        "Electricity",
        "Water",
        "Internet",
        "Security Agency",
        "Event Organized",
        "Maintenance",
        "Establishment",
        "Miscellaneous",
        "Others"
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

  ))
  const qualificationOptions = [
    "10th", "12th", "B.A", "B.Sc", "B.Com", "B.Ed", "M.A", "M.Sc", "M.Com", "M.Ed",
    "BCA", "MCA", "B.Tech", "M.Tech", "MBA", "Ph.D", "Diploma", "Other"
  ];

  const tetQualificationOptions = [
    "CTET Paper I", "CTET Paper II", "STET Paper I", "STET Paper II", "Other"
  ];

  const professionalQualificationOptions = [
    "B.Ed", "D.El.Ed", "NTT", "BTC", "JBT", "M.Ed", "B.P.Ed", "M.P.Ed", "Other"
  ];

  const passingYears = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i));

  const renderQualificationTables = (staffRows, setStaffRows, staffIndex, showTET = true) => {
    const row = staffRows[staffIndex];

    const thStyle = {
      backgroundColor: "#1976d2", color: "#fff", padding: "8px 6px",
      textAlign: "center", fontSize: "12px", fontWeight: 600,
      border: "1px solid #1565c0", whiteSpace: "nowrap"
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
        <Button variant="contained" size="small"
          sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
          onClick={() => { const u = [...staffRows]; u[staffIndex][qualType].splice(qIndex + 1, 0, { ...emptyObj }); setStaffRows(u); }}>
          +
        </Button>
        <Button variant="outlined" size="small"
          sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", borderColor: "#1976d2", color: "#1976d2" }}
          onClick={() => resetRow(qualType, qIndex, emptyObj)}>
          ↺
        </Button>
      </Box>
    );

    const emptyAcademic = {  post:"", staffname:" ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" };
    const emptyProfessional = {  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" };
    const emptyTET = {  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" };

    return (
      <Box mt={2}>

        {/* ── ACADEMIC QUALIFICATION ── */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
          Academic Qualification
        </Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["S.No",  "Post", "Staff Name", "Qualification", "Course", "Registration No.", "Roll No.", "College", "Marks Obtained (%)", "University", "Passing Year", "Action"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.academicQualifications.map((q, qIndex) => (
                <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                
                
                
                  <td style={tdCenterStyle}>{qIndex + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <Typography sx={{
    fontSize: 12, fontWeight: 700, color: "#fff",
    background: "#1976d2", px: 1, py: 0.4,
    borderRadius: 1, textAlign: "center", whiteSpace: "nowrap"
  }}>
    {row.post || "—"}
  </Typography>
</td>
<td style={{ ...tdStyle, minWidth: 130 }}>
  <Typography sx={{
    fontSize: 12, fontWeight: 600, color: "#374151",px: 1, whiteSpace: "nowrap"
  }}>
    {row.name || "—"}
  </Typography>
</td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.qualification}
                      onChange={(e) => updateField("academicQualifications", qIndex, "qualification", e.target.value)}
                
    
                  
                  sx={{ minWidth: 110 }}>
                      {qualificationOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.course}
                      onChange={(e) => updateField("academicQualifications", qIndex, "course", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.registrationNo}
                      onChange={(e) => updateField("academicQualifications", qIndex, "registrationNo", e.target.value)}
                      sx={{ minWidth: 110 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.rollNo}
                      onChange={(e) => updateField("academicQualifications", qIndex, "rollNo", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.college}
                      onChange={(e) => updateField("academicQualifications", qIndex, "college", e.target.value)}
                      sx={{ minWidth: 120 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" type="number" value={q.marksObtained}
                      onChange={(e) => updateField("academicQualifications", qIndex, "marksObtained", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.university}
                      onChange={(e) => updateField("academicQualifications", qIndex, "university", e.target.value)}
                      sx={{ minWidth: 120 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.passingYear}
                      onChange={(e) => updateField("academicQualifications", qIndex, "passingYear", e.target.value)}
                      sx={{ minWidth: 100 }}>
                      {passingYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdCenterStyle}>
                    <ActionButtons qualType="academicQualifications" qIndex={qIndex} emptyObj={emptyAcademic} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* ── PROFESSIONAL QUALIFICATION ── */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
          Professional Qualification
        </Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["S.No", "Post", "Staff Name", "Qualification", "Registration No.", "Roll No.", "Exam Conducted By", "Passing Year", "Marks Obtained (%)", "Affiliation Body", "Action"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.professionalQualifications.map((q, qIndex) => (
                <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                 <td style={tdCenterStyle}>{qIndex + 1}</td>
<td style={{ ...tdStyle, minWidth: 120 }}>
  <Typography sx={{
    fontSize: 12, fontWeight: 700, color: "#fff",
    background: "#1976d2", px: 1, py: 0.4,
    borderRadius: 1, textAlign: "center", whiteSpace: "nowrap"
  }}>
    {row.post || "—"}
  </Typography>
</td>
<td style={{ ...tdStyle, minWidth: 130 }}>
  <Typography sx={{
    fontSize: 12, fontWeight: 600, color: "#374151",
    px: 1, whiteSpace: "nowrap"
  }}>
    {row.name || "—"}
  </Typography>
</td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.qualification}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "qualification", e.target.value)}                      sx={{ minWidth: 110 }}>
                      {professionalQualificationOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.registrationNo}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "registrationNo", e.target.value)}
                      sx={{ minWidth: 110 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.rollNo}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "rollNo", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.examConductedBy}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "examConductedBy", e.target.value)}
                      sx={{ minWidth: 120 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.passingYear}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "passingYear", e.target.value)}
                      sx={{ minWidth: 100 }}>
                      {passingYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" type="number" value={q.marksObtained}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "marksObtained", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.affiliationBody}
                      onChange={(e) => updateField("professionalQualifications", qIndex, "affiliationBody", e.target.value)}
                      sx={{ minWidth: 120 }} />
                  </td>
                  <td style={tdCenterStyle}>
                    <ActionButtons qualType="professionalQualifications" qIndex={qIndex} emptyObj={emptyProfessional} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {/* ── TET QUALIFICATION ── */}
        {showTET && <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
          TET Qualification
        </Typography>}
        {showTET && <Box sx={{ overflowX: "auto", mb: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["S.No",  "Post", "Staff Name", "Qualification", "Registration No.", "Roll No.", "Exam Conducted By", "Passing Year", "Marks Obtained (%)", "Affiliation Body", "Action"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.tetQualifications.map((q, qIndex) => (
                <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                <td style={tdCenterStyle}>{qIndex + 1}</td>
<td style={{ ...tdStyle, minWidth: 120 }}>
  <Typography sx={{
    fontSize: 12, fontWeight: 700, color: "#fff",
    background: "#1976d2", px: 1, py: 0.4,
    borderRadius: 1, textAlign: "center", whiteSpace: "nowrap"
  }}>
    {row.post || "—"}
  </Typography>
</td>
<td style={{ ...tdStyle, minWidth: 130 }}>
  <Typography sx={{
    fontSize: 12, fontWeight: 600, color: "#374151",
    px: 1, whiteSpace: "nowrap"
  }}>
    {row.name || "—"}
  </Typography>
</td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.qualification}
                      onChange={(e) => updateField("tetQualifications", qIndex, "qualification", e.target.value)}
                      sx={{ minWidth: 130 }}>
                      {tetQualificationOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.registrationNo}
                      onChange={(e) => updateField("tetQualifications", qIndex, "registrationNo", e.target.value)}
                      sx={{ minWidth: 110 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.rollNo}
                      onChange={(e) => updateField("tetQualifications", qIndex, "rollNo", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.examConductedBy}
                      onChange={(e) => updateField("tetQualifications", qIndex, "examConductedBy", e.target.value)}
                      sx={{ minWidth: 120 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField select fullWidth size="small" value={q.passingYear}
                      onChange={(e) => updateField("tetQualifications", qIndex, "passingYear", e.target.value)}
                      sx={{ minWidth: 100 }}>
                      {passingYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" type="number" value={q.marksObtained}
                      onChange={(e) => updateField("tetQualifications", qIndex, "marksObtained", e.target.value)}
                      sx={{ minWidth: 90 }} />
                  </td>
                  <td style={tdStyle}>
                    <TextField fullWidth size="small" value={q.affiliationBody}
                      onChange={(e) => updateField("tetQualifications", qIndex, "affiliationBody", e.target.value)}
                      sx={{ minWidth: 120 }} />
                  </td>
                  <td style={tdCenterStyle}>
                    <ActionButtons qualType="tetQualifications" qIndex={qIndex} emptyObj={emptyTET} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>}

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
                    boxShadow: i === currentStep ? "0 0 0 4px #bbdefb" : "none"
                  }}
                >
                  {i < currentStep ? "✓" : step.icon}
                </Box>
                <Typography sx={{
                  fontSize: 10, mt: 0.5, fontWeight: i === currentStep ? 700 : 400,
                  color: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#94a3b8",
                  textAlign: "center", lineHeight: 1.2
                }}>
                  {step.label}
                </Typography>
              </Box>
              {i < STEPS.length - 1 && (
                <Box sx={{
                  flex: 1, height: 3, mx: 0.5,
                  background: i < currentStep ? "#4caf50" : "#e2e8f0",
                  borderRadius: 2, transition: "background 0.3s", minWidth: 10
                }} />
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
            onSubmit={handleSubmit(onSubmit)}
            style={{
              pointerEvents: loading ? "none" : "auto",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {currentStep === 0 && (<>
            {/* ================= BASIC SCHOOL DETAILS ROW ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
              {emrsBasicFields.map((fieldItem) => (
  <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
    <Controller
      name={fieldItem.name}
      control={control}
      defaultValue=""
      rules={{
        required: `${fieldItem.label} is required`,
        ...(fieldItem.name === "contactno" && {
          validate: (v) => /^[0-9]{10}$/.test(v) || "Must be exactly 10 digits"
        })
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
            inputProps: { maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" },
            onKeyDown: (e) => {
              if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
                e.preventDefault();
              }
            }
          })}
        >
          {fieldItem.options && fieldItem.options.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
      )}
    />
  </Grid>
))}
            </Grid>
            {/* ================= EMRS LOCATION SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
                  rules={{ required: "Pincode is required" }}
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
                    <TextField {...field} label="District" fullWidth size="small" />
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
                    <TextField {...field} label="Block" fullWidth size="small" />
                  )}
                />
              </Grid>

              {/* Gram Panchayat */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="grampanchayat"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} label="Gram Panchayat" fullWidth size="small" />
                  )}
                />
              </Grid>

              {/* Village */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="village"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} label="Village" fullWidth size="small" />
                  )}
                />
              </Grid>

            </Grid>
                   </>)}
                   {currentStep === 1 && (<>
          {/* ================= EMRS INFRASTRUCTURE DETAILS ================= */}
<Grid container spacing={2}>
  <Grid item xs={12}>
    <Typography variant="h6" sx={{
      background: "linear-gradient(to right, #1976d2, #42a5f5)",
      color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
    }}>
      Infrastructure Details
    </Typography>
  </Grid>
</Grid>

{/* ── LINE 1: Classrooms ── */}
<Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#fff" }}>
  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>🏫 Classrooms</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4} md={4}>
      <Controller name="totalClassrooms" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} label="Total Classrooms" type="number" fullWidth size="small" />
        )} />
    </Grid>
    <Grid item xs={12} sm={4} md={4}>
      <Controller name="classroomWithSmartClass" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} label="Classroom with Smart Class" type="number" fullWidth size="small" />
        )} />
    </Grid>
    <Grid item xs={12} sm={4} md={4}>
      <Controller name="classroomWithProjector" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} label="Classroom with Projector" type="number" fullWidth size="small" />
        )} />
    </Grid>
  </Grid>
</Box>

{/* ── LINE 2: Science Lab ── */}
<Box sx={{ border: "1px solid #bbdefb", borderRadius: 2, p: 2, mb: 2, background: "#f0f7ff" }}>
  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>🔬 Science Lab</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={3} md={3}>
      <Controller name="scienceLab" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} select label="Science Lab Available" fullWidth size="small" sx={{ minWidth: 220 }}
            onChange={(e) => { field.onChange(e); syncInfraToConstruction("scienceLab", e.target.value); }}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        )} />
    </Grid>
    {watch("scienceLab") === "Yes" && (
      <>
        <Grid item xs={12} sm={3} md={3}>
          <Controller name="biologyLab" control={control} defaultValue=""
            render={({ field }) => (
              <TextField {...field} select label="Biology Lab" fullWidth size="small" sx={{ minWidth: 220 }}>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            )} />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Controller name="chemistryLab" control={control} defaultValue=""
            render={({ field }) => (
              <TextField {...field} select label="Chemistry Lab" fullWidth size="small" sx={{ minWidth: 220 }}>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            )} />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Controller name="physicsLab" control={control} defaultValue=""
            render={({ field }) => (
              <TextField {...field} select label="Physics Lab" fullWidth size="small" sx={{ minWidth: 220 }}>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            )} />
        </Grid>
      </>
    )}
  </Grid>
</Box>

{/* ── LINE 3: Computer Lab ── */}
<Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#fff" }}>
  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>💻 Computer Lab</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4} md={3}>
      <Controller name="computerLab" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} select label="Computer Lab" fullWidth size="small" sx={{ minWidth: 220 }}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        )} />
    </Grid>
  </Grid>
</Box>

{/* ── LINE 4: Library ── */}
<Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#fff" }}>
  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>📚 Library</Typography>
  <Grid container spacing={2}>
    
    <Grid item xs={12} sm={4} md={3}>
      <Controller name="library" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} select label="Library Available" fullWidth size="small" sx={{ minWidth: 220 }}
            onChange={(e) => { field.onChange(e); syncInfraToConstruction("library", e.target.value); }}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        )} />
    </Grid>

    {watch("library") === "Yes" && (
      <Grid item xs={12} sm={4} md={3}>
        <Controller name="booksInLibrary" control={control} defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="No. of Books in Library" type="number" fullWidth size="small" />
          )} />
      </Grid>
    )}
  </Grid>
</Box>

{/* ── LINE 5: Playground ── */}
<Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#fff" }}>
  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>⚽ Playground</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4} md={3}>
      <Controller name="playground" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} select label="Playground Available" fullWidth size="small" sx={{ minWidth: 220 }}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        )} />
    </Grid>
    {watch("playground") === "Yes" && (
      <Grid item xs={12} sm={4} md={3}>
        <Controller name="playgroundArea" control={control} defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Playground Area (sq. ft)" type="number" fullWidth size="small" sx={{ minWidth: 220 }} />
          )} />
      </Grid>
    )}
  </Grid>
</Box>

{/* ── LINE 6: Auditorium & Medical Room ── */}
<Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 4, background: "#fff" }}>
  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>🏛️ Other Facilities</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4} md={3}>
      <Controller name="Auditorium" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} select label="Auditorium" fullWidth size="small" sx={{ minWidth: 220 }}
            onChange={(e) => { field.onChange(e); syncInfraToConstruction("Auditorium", e.target.value); }}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        )} />
    </Grid>

    {/* ← ADD HERE */}
    {watch("Auditorium") === "Yes" && (
      <Grid item xs={12} sm={4} md={3}>
        <Controller name="auditoriumCapacity" control={control} defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Auditorium Capacity" type="number" fullWidth size="small" sx={{ minWidth: 220 }} />
          )} />
      </Grid>
    )}

    <Grid item xs={12} sm={4} md={3}>
            <Controller name="Medical Room" control={control} defaultValue=""
        render={({ field }) => (
          <TextField {...field} select label="Medical Room" fullWidth size="small" sx={{ minWidth: 220 }}
            onChange={(e) => { field.onChange(e); syncInfraToConstruction("Medical Room", e.target.value); }}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        )} />
    </Grid>
  </Grid>
</Box>
</>)}
{currentStep === 2 && (<>
{/* ================= CONSTRUCTION & ASSET STATUS ================= */}            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  background: "linear-gradient(to right, #1976d2, #42a5f5)",
                  color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
                }}>
                  🏗️ Construction & Asset Status
                </Typography>
              </Grid>
            </Grid>

            {/* Project Overview */}
            <Box sx={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 2, p: 3, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 2 }}>
                Project Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller name="projectStartDate" control={control} defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Project Start Date" type="date"
                        InputLabelProps={{ shrink: true }} fullWidth size="small" />
                    )} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller name="projectEndDate" control={control} defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Expected End Date" type="date"
                        InputLabelProps={{ shrink: true }} fullWidth size="small" />
                    )} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller name="totalProjectBudget" control={control} defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Total Project Budget (₹)" type="number" fullWidth size="small" />
                    )} />
                </Grid>
              </Grid>
            </Box>

            {/* Live Summary Banner */}
            {(() => {
              const all = Object.values(constructionRows).flat();
              const total = all.length;
              const completed = all.filter(r => r.status === "Completed").length;
              const inProgress = all.filter(r => r.status === "In Progress").length;
              const pct = total > 0 ? Math.round(all.reduce((s, r) => s + r.progress, 0) / total) : 0;
              return (
                <Box sx={{ background: "linear-gradient(135deg, #1976d2, #42a5f5)", borderRadius: 2, p: 3, mb: 3, color: "#fff" }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography sx={{ fontSize: 13, opacity: 0.85 }}>Overall Construction Progress</Typography>
                      <Typography sx={{ fontSize: 32, fontWeight: 800 }}>{pct}%</Typography>
                      <Box sx={{ mt: 1, height: 8, background: "rgba(255,255,255,0.3)", borderRadius: 2 }}>
                        <Box sx={{ height: "100%", width: `${pct}%`, background: "#fff", borderRadius: 2, transition: "width 0.5s" }} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" gap={2} flexWrap="wrap">
                        {[
                          { label: "Total",          val: total,                          bg: "rgba(255,255,255,0.15)" },
                          { label: "✅ Completed",    val: completed,                      bg: "rgba(22,163,74,0.35)"   },
                          { label: "🔄 In Progress",  val: inProgress,                     bg: "rgba(245,158,11,0.35)"  },
                          { label: "⏳ Not Started",  val: total - completed - inProgress, bg: "rgba(255,255,255,0.1)"  },
                        ].map(({ label, val, bg }) => (
                          <Box key={label} sx={{ textAlign: "center", background: bg, borderRadius: 2, px: 2.5, py: 1.5 }}>
                            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{val}</Typography>
                            <Typography sx={{ fontSize: 11, opacity: 0.9 }}>{label}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              );
            })()}

            {/* 4 Category Tables */}
            {["school", "residence", "outdoor", "utilities"].map(catKey => renderConstructionTable(catKey))}

            <Box mb={4} />
            </>)}
            {currentStep === 3 && (<>
            {/* ================= HOSTEL ADMINISTRATION SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 2,
                    fontWeight: 600,
                    mb: 2
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
    <Controller name="boysHostelCapacity" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Boys Hostel Capacity" type="number" fullWidth size="small" />
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysBedsAvailable" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Beds Available" type="number" fullWidth size="small" />
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysCurrentOccupancy" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Current Occupancy" type="number" fullWidth size="small" />
      )} />
  </Grid>

  {/* ── Force new row ── */}
  <Grid item xs={12} sx={{ padding: "0 !important" }} />

  {/* ── Line 2: CCTV Installed, No of CCTV ── */}
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysCCTVInstalled" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="CCTV Installed" fullWidth size="small" sx={{ minWidth: 220 }}>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysNoOfCCTV" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="No of CCTV Installed" type="number" fullWidth size="small" />
      )} />
  </Grid>

  {/* ── Force new row ── */}
  <Grid item xs={12} sx={{ padding: "0 !important" }} />

  {/* ── Line 3: Security Agency Available + conditional Name & Contact ── */}
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysSecurityAgency" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Security Agency Available" fullWidth size="small" sx={{ minWidth: 220 }}>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )} />
  </Grid>
  {watch("boysSecurityAgency") === "Yes" && (
    <>
      <Grid item xs={12} sm={4} md={4}>
        <Controller name="boysSecurityAgencyName" control={control} defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Security Agency Name" fullWidth size="small" sx={{ minWidth: 220 }}/>
          )} />
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
       <Controller name="boysSecurityAgencyContact" control={control} defaultValue=""
  render={({ field }) => (
    <TextField
      {...field}
      label="Security Agency Contact"
      fullWidth
      size="small"
      inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
      onKeyDown={(e) => {
        if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
          e.preventDefault();
        }
      }}
      error={field.value && field.value.toString().length !== 10}
      helperText={field.value && field.value.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
    />
  )} />
      </Grid>
    </>
  )}

  {/* ── Force new row ── */}
  <Grid item xs={12} sx={{ padding: "0 !important" }} />

  {/* ── Line 4: Warden Name, Contact, Email ── */}
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysWardenName" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Boys Warden Name" fullWidth size="small" />
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysWardenContact" control={control} defaultValue=""
  render={({ field }) => (
    <TextField
      {...field}
      label="Boys Warden Contact"
      fullWidth
      size="small"
      inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
      onKeyDown={(e) => {
        if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
          e.preventDefault();
        }
      }}
      error={field.value && field.value.toString().length !== 10}
      helperText={field.value && field.value.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
    />
  )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="boysWardenEmail" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Boys Warden Email" fullWidth size="small" />
      )} />
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
    <Controller name="girlsHostelCapacity" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Girls Hostel Capacity" type="number" fullWidth size="small" />
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsBedsAvailable" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Beds Available" type="number" fullWidth size="small" />
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsCurrentOccupancy" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Current Occupancy" type="number" fullWidth size="small" />
      )} />
  </Grid>

  {/* ── Force new row ── */}
  <Grid item xs={12} sx={{ padding: "0 !important" }} />

  {/* ── Line 2: CCTV Installed, No of CCTV ── */}
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsCCTVInstalled" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="CCTV Installed" fullWidth size="small" sx={{ minWidth: 220 }}>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsNoOfCCTV" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="No of CCTV Installed" type="number" fullWidth size="small" />
      )} />
  </Grid>

  {/* ── Force new row ── */}
  <Grid item xs={12} sx={{ padding: "0 !important" }} />

  {/* ── Line 3: Security Agency Available + conditional Name & Contact ── */}
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsSecurityAgency" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Security Agency Available" fullWidth size="small" sx={{ minWidth: 220 }}>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )} />
  </Grid>
  {watch("girlsSecurityAgency") === "Yes" && (
    <>
      <Grid item xs={12} sm={4} md={4}>
        <Controller name="girlsSecurityAgencyName" control={control} defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Security Agency Name" fullWidth size="small" sx={{ minWidth: 220 }}/>
          )} />
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
       <Controller name="girlsSecurityAgencyContact" control={control} defaultValue=""
  render={({ field }) => (
    <TextField
      {...field}
      label="Security Agency Contact"
      fullWidth
      size="small"
      inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
      onKeyDown={(e) => {
        if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
          e.preventDefault();
        }
      }}
      error={field.value && field.value.toString().length !== 10}
      helperText={field.value && field.value.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
    />
  )} />
      </Grid>
    </>
  )}

  {/* ── Force new row ── */}
  <Grid item xs={12} sx={{ padding: "0 !important" }} />

  {/* ── Line 4: Warden Name, Contact, Email ── */}
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsWardenName" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Girls Warden Name" fullWidth size="small" />
      )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsWardenContact" control={control} defaultValue=""
  render={({ field }) => (
    <TextField
      {...field}
      label="Girls Warden Contact"
      fullWidth
      size="small"
      inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
      onKeyDown={(e) => {
        if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
          e.preventDefault();
        }
      }}
      error={field.value && field.value.toString().length !== 10}
      helperText={field.value && field.value.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
    />
  )} />
  </Grid>
  <Grid item xs={12} sm={4} md={4}>
    <Controller name="girlsWardenEmail" control={control} defaultValue=""
      render={({ field }) => (
        <TextField {...field} label="Girls Warden Email" fullWidth size="small" />
      )} />
  </Grid>

</Grid>
</>)}
{currentStep === 4 && (<>

            {/* ================= UNIFIED STUDENT ENROLLMENT SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
                  padding: 3,
                  mb: 3,
                  backgroundColor: "#fff"
                }}
              >
                {/* ── ENROLLMENT HEADER ── */}
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField select label="Academic Year" fullWidth size="small" sx={{ minWidth: 220 }} value={row.academicYear}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].academicYear = e.target.value; setEnrollmentRows(u); }}>
                      {["2024-2025", "2025-2026", "2026-2027", "2027-2028", "2028-2029", "2029-2030"].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField select label="Class" fullWidth size="small" sx={{ minWidth: 220 }} value={row.class}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].class = e.target.value; setEnrollmentRows(u); }}>
                      {["6", "7", "8", "9", "10", "11", "12"].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField select label="Section" fullWidth size="small" sx={{ minWidth: 220 }} value={row.section}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].section = e.target.value; setEnrollmentRows(u); }}>
                      {["A", "B", "C"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Sanctioned Capacity" type="number" fullWidth size="small" value={row.sanctionedCapacity}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].sanctionedCapacity = e.target.value; setEnrollmentRows(u); }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Current Enrollment" type="number" fullWidth size="small" value={row.currentEnrollment}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].currentEnrollment = e.target.value; setEnrollmentRows(u); }} />
                  </Grid>
                  {/* ── CATEGORY BREAKDOWN ── */}
<Grid item xs={12}>
  <Box sx={{ border: "1px solid #bbdefb", borderRadius: 2, p: 2, background: "#f0f7ff" }}>
    <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 2, fontSize: 14 }}>
      📊 Student Category Breakdown
    </Typography>
    <Grid container spacing={2}>
      {["ST", "PVTG", "DNT/NT/SNT", "Orphan", "LWE", "Divyang"].map(cat => (
        <Grid item xs={6} sm={4} md={2} key={cat}>
          <TextField
            label={cat}
            type="number"
            fullWidth
            size="small"
            value={row.categoryBreakdown?.[cat] || ""}
            onChange={(e) => {
              const u = [...enrollmentRows];
              if (!u[rowIndex].categoryBreakdown) u[rowIndex].categoryBreakdown = {};
              u[rowIndex].categoryBreakdown[cat] = e.target.value;
              setEnrollmentRows(u);
            }}
          />
        </Grid>
      ))}
    </Grid>

    {/* ── VISUAL BAR ── */}
    {(() => {
      const breakdown = row.categoryBreakdown || {};
      const categories = ["ST", "PVTG", "DNT/NT/SNT", "Orphan", "LWE", "Divyang"];
      const colors = ["#1976d2", "#7b1fa2", "#2e7d32", "#e65100", "#c62828", "#00838f"];
      const total = categories.reduce((sum, cat) => sum + Number(breakdown[cat] || 0), 0);
      if (total === 0) return null;

      return (
        <Box mt={2}>
          {/* Progress Bar */}
          <Box sx={{ display: "flex", height: 28, borderRadius: 2, overflow: "hidden", mb: 1.5 }}>
            {categories.map((cat, i) => {
              const val = Number(breakdown[cat] || 0);
              const pct = total > 0 ? (val / total) * 100 : 0;
              if (pct === 0) return null;
              return (
                <Box key={cat} sx={{
                  width: `${pct}%`, background: colors[i],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "width 0.4s"
                }}>
                  {pct > 8 && (
                    <Typography sx={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>
                      {Math.round(pct)}%
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Legend */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {categories.map((cat, i) => {
              const val = Number(breakdown[cat] || 0);
              if (!val) return null;
              return (
                <Box key={cat} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: colors[i], flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12, color: "#374151" }}>
                    {cat}: <strong>{val}</strong>
                  </Typography>
                </Box>
              );
            })}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, ml: "auto" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1976d2" }}>
                Total: {total}
              </Typography>
              {row.currentEnrollment && Number(row.currentEnrollment) > 0 && total > Number(row.currentEnrollment) && (
                <Typography sx={{ fontSize: 11, color: "#c62828", fontWeight: 600 }}>
                  ⚠️ Exceeds enrollment ({row.currentEnrollment})
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      );
    })()}
  </Box>
</Grid>
                </Grid>

                {/* ── ACADEMIC PERFORMANCE ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Academic Performance
                </Typography>

                {/* ── CLASS 6, 7, 8, 9 — Annual Exam ── */}
                {["6", "7", "8", "9"].includes(row.class) && (
                  <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 3, backgroundColor: "#f8fafc" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                      Annual Exam Performance — Class {row.class}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Students Appeared" type="number" fullWidth size="small" value={row.appeared}
                          onChange={(e) => {
                            const u = [...enrollmentRows];
                            u[rowIndex].appeared = e.target.value;
                            const appeared = Number(e.target.value || 0);
                            const passed = Number(u[rowIndex].passed || 0);
                            u[rowIndex].passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                            setEnrollmentRows(u);
                          }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Students Passed" type="number" fullWidth size="small" value={row.passed}
                          onChange={(e) => {
                            const u = [...enrollmentRows];
                            u[rowIndex].passed = e.target.value;
                            const passed = Number(e.target.value || 0);
                            const appeared = Number(u[rowIndex].appeared || 0);
                            u[rowIndex].passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                            setEnrollmentRows(u);
                          }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Pass %" fullWidth size="small" value={row.passPercent} InputProps={{ readOnly: true }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
  <TextField
  label="No. of Students Scored Above 75%"
  type="number"
  fullWidth
  size="small"
  value={row.above75}
  error={!!row.above75Error}          // ← turns border RED
  helperText={row.above75Error || ""} // ← shows message below
  FormHelperTextProps={{
    style: { color: "#c62828", fontWeight: 600, fontSize: 12 }
  }}
    onChange={(e) => {
  const val = Number(e.target.value);
  const appeared = Number(enrollmentRows[rowIndex].appeared || 0);
  const enrolled = Number(enrollmentRows[rowIndex].currentEnrollment || 0);

  const u = [...enrollmentRows];
  u[rowIndex].above75 = e.target.value;

  // ── VALIDATION — appeared is strictest limit ──
  if (appeared > 0 && val > appeared) {
    u[rowIndex].above75Error =
      `❌ Cannot be more than Students Appeared (${appeared})`;
  } else if (enrolled > 0 && val > enrolled) {
    u[rowIndex].above75Error =
      `❌ Cannot be more than Current Enrollment (${enrolled})`;
  } else {
    u[rowIndex].above75Error = "";
  }

  setEnrollmentRows(u);
}}
  />

  {/* ── DISPLAY CARD — shows only when above75 is filled ── */}
  {row.above75 && Number(row.above75) > 0 && (
    <Box sx={{
      mt: 1,
      p: 1.5,
      borderRadius: 2,
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
      border: "1px solid #a5d6a7",
      display: "flex",
      flexDirection: "column",
      gap: 0.5
    }}>

      {/* Line 1 — Count */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <span style={{ fontSize: 16 }}>🎯</span>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2e7d32" }}>
          {row.above75} students scored above 75%
        </Typography>
      </Box>

      {/* Line 2 — Out of appeared */}
      {row.appeared && Number(row.appeared) > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 14 }}>📝</span>
          <Typography sx={{ fontSize: 12, color: "#388e3c" }}>
            Out of {row.appeared} appeared →{" "}
            <strong>
              {((Number(row.above75) / Number(row.appeared)) * 100).toFixed(1)}%
            </strong>
          </Typography>
        </Box>
      )}

      {/* Line 3 — Out of enrolled */}
      {row.currentEnrollment && Number(row.currentEnrollment) > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 14 }}>🏫</span>
          <Typography sx={{ fontSize: 12, color: "#388e3c" }}>
            Out of {row.currentEnrollment} enrolled →{" "}
            <strong>
              {((Number(row.above75) / Number(row.currentEnrollment)) * 100).toFixed(1)}%
            </strong>
          </Typography>
        </Box>
      )}

      {/* Line 4 — Performance label */}
      <Box sx={{
        mt: 0.5,
        px: 1, py: 0.3,
        borderRadius: 10,
        display: "inline-fit-content",
        background:
          ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
            ? "#c8e6c9"
            : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
            ? "#fff9c4"
            : "#ffccbc",
        width: "fit-content"
      }}>
        <Typography sx={{
          fontSize: 11, fontWeight: 700,
          color:
            ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
              ? "#1b5e20"
              : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
              ? "#f57f17"
              : "#bf360c"
        }}>
          {((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
            ? "🟢 Excellent Performance"
            : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
            ? "🟡 Average Performance"
            : "🔴 Needs Improvement"}
        </Typography>
      </Box>

    </Box>
  )}
</Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Below 50%" type="number" fullWidth size="small" value={row.below50}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].below50 = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* ── CLASS 10 — Board Exam ── */}
                {row.class === "10" && (
                  <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 3, backgroundColor: "#f8fafc" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                      Board Exam Performance — Class 10
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Students Appeared" type="number" fullWidth size="small" value={row.appeared}
                          onChange={(e) => {
                            const u = [...enrollmentRows];
                            u[rowIndex].appeared = e.target.value;
                            const appeared = Number(e.target.value || 0);
                            const passed = Number(u[rowIndex].passed || 0);
                            u[rowIndex].passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                            setEnrollmentRows(u);
                          }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Students Passed" type="number" fullWidth size="small" value={row.passed}
                          onChange={(e) => {
                            const u = [...enrollmentRows];
                            u[rowIndex].passed = e.target.value;
                            const passed = Number(e.target.value || 0);
                            const appeared = Number(u[rowIndex].appeared || 0);
                            u[rowIndex].passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                            setEnrollmentRows(u);
                          }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Pass %" fullWidth size="small" value={row.passPercent} InputProps={{ readOnly: true }} />
                      </Grid>
                     <Grid item xs={12} sm={6} md={4}>
  <TextField
  label="No. of Students Scored Above 75%"
  type="number"
  fullWidth
  size="small"
  value={row.above75}
  error={!!row.above75Error}          // ← turns border RED
  helperText={row.above75Error || ""} // ← shows message below
  FormHelperTextProps={{
    style: { color: "#c62828", fontWeight: 600, fontSize: 12 }
  }}
    onChange={(e) => {
  const val = Number(e.target.value);
  const appeared = Number(enrollmentRows[rowIndex].appeared || 0);
  const enrolled = Number(enrollmentRows[rowIndex].currentEnrollment || 0);

  const u = [...enrollmentRows];
  u[rowIndex].above75 = e.target.value;

  // ── VALIDATION — appeared is strictest limit ──
  if (appeared > 0 && val > appeared) {
    u[rowIndex].above75Error =
      `❌ Cannot be more than Students Appeared (${appeared})`;
  } else if (enrolled > 0 && val > enrolled) {
    u[rowIndex].above75Error =
      `❌ Cannot be more than Current Enrollment (${enrolled})`;
  } else {
    u[rowIndex].above75Error = "";
  }

  setEnrollmentRows(u);

    }}
  />

  {/* ── DISPLAY CARD — shows only when above75 is filled ── */}
  {row.above75 && Number(row.above75) > 0 && (
    <Box sx={{
      mt: 1,
      p: 1.5,
      borderRadius: 2,
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
      border: "1px solid #a5d6a7",
      display: "flex",
      flexDirection: "column",
      gap: 0.5
    }}>

      {/* Line 1 — Count */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <span style={{ fontSize: 16 }}>🎯</span>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2e7d32" }}>
          {row.above75} students scored above 75%
        </Typography>
      </Box>

      {/* Line 2 — Out of appeared */}
      {row.appeared && Number(row.appeared) > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 14 }}>📝</span>
          <Typography sx={{ fontSize: 12, color: "#388e3c" }}>
            Out of {row.appeared} appeared →{" "}
            <strong>
              {((Number(row.above75) / Number(row.appeared)) * 100).toFixed(1)}%
            </strong>
          </Typography>
        </Box>
      )}

      {/* Line 3 — Out of enrolled */}
      {row.currentEnrollment && Number(row.currentEnrollment) > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 14 }}>🏫</span>
          <Typography sx={{ fontSize: 12, color: "#388e3c" }}>
            Out of {row.currentEnrollment} enrolled →{" "}
            <strong>
              {((Number(row.above75) / Number(row.currentEnrollment)) * 100).toFixed(1)}%
            </strong>
          </Typography>
        </Box>
      )}

      {/* Line 4 — Performance label */}
      <Box sx={{
        mt: 0.5,
        px: 1, py: 0.3,
        borderRadius: 10,
        display: "inline-fit-content",
        background:
          ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
            ? "#c8e6c9"
            : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
            ? "#fff9c4"
            : "#ffccbc",
        width: "fit-content"
      }}>
        <Typography sx={{
          fontSize: 11, fontWeight: 700,
          color:
            ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
              ? "#1b5e20"
              : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
              ? "#f57f17"
              : "#bf360c"
        }}>
          {((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
            ? "🟢 Excellent Performance"
            : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
            ? "🟡 Average Performance"
            : "🔴 Needs Improvement"}
        </Typography>
      </Box>

    </Box>
  )}
</Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Below 50%" type="number" fullWidth size="small" value={row.below50}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].below50 = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Distinctions (≥ 75%)" type="number" fullWidth size="small" value={row.distinctions || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].distinctions = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Top Scorer Name" fullWidth size="small" value={row.topScorer || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScorer = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Top Score (%)" type="number" fullWidth size="small" value={row.topScore || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScore = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* ── CLASS 11 & 12 — Board Exam by Stream ── */}
                {["11", "12"].includes(row.class) && (
                  <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 3, backgroundColor: "#f8fafc" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                      Board Exam Performance — Class {row.class} (Stream-wise)
                    </Typography>

                    {/* Stream selector */}
                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField select label="Stream" fullWidth size="small" sx={{ minWidth: 220 }}
                          value={row.stream || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].stream = e.target.value; setEnrollmentRows(u); }}>
                          {["Science", "Commerce", "Arts"].map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Students Appeared" type="number" fullWidth size="small" value={row.appeared}
                          onChange={(e) => {
                            const u = [...enrollmentRows];
                            u[rowIndex].appeared = e.target.value;
                            const appeared = Number(e.target.value || 0);
                            const passed = Number(u[rowIndex].passed || 0);
                            u[rowIndex].passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                            setEnrollmentRows(u);
                          }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Students Passed" type="number" fullWidth size="small" value={row.passed}
                          onChange={(e) => {
                            const u = [...enrollmentRows];
                            u[rowIndex].passed = e.target.value;
                            const passed = Number(e.target.value || 0);
                            const appeared = Number(u[rowIndex].appeared || 0);
                            u[rowIndex].passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                            setEnrollmentRows(u);
                          }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Pass %" fullWidth size="small" value={row.passPercent} InputProps={{ readOnly: true }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
  <TextField
  label="No. of Students Scored Above 75%"
  type="number"
  fullWidth
  size="small"
  value={row.above75}
  error={!!row.above75Error}          // ← turns border RED
  helperText={row.above75Error || ""} // ← shows message below
  FormHelperTextProps={{
    style: { color: "#c62828", fontWeight: 600, fontSize: 12 }
  }}
  onChange={(e) => {
  const val = Number(e.target.value);
  const appeared = Number(enrollmentRows[rowIndex].appeared || 0);
  const enrolled = Number(enrollmentRows[rowIndex].currentEnrollment || 0);

  const u = [...enrollmentRows];
  u[rowIndex].above75 = e.target.value;

  // ── VALIDATION — appeared is strictest limit ──
  if (appeared > 0 && val > appeared) {
    u[rowIndex].above75Error =
      `❌ Cannot be more than Students Appeared (${appeared})`;
  } else if (enrolled > 0 && val > enrolled) {
    u[rowIndex].above75Error =
      `❌ Cannot be more than Current Enrollment (${enrolled})`;
  } else {
    u[rowIndex].above75Error = "";
  }

  setEnrollmentRows(u);
}}
  />

  {/* ── DISPLAY CARD — shows only when above75 is filled ── */}
  {row.above75 && Number(row.above75) > 0 && (
    <Box sx={{
      mt: 1,
      p: 1.5,
      borderRadius: 2,
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
      border: "1px solid #a5d6a7",
      display: "flex",
      flexDirection: "column",
      gap: 0.5
    }}>

      {/* Line 1 — Count */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <span style={{ fontSize: 16 }}>🎯</span>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2e7d32" }}>
          {row.above75} students scored above 75%
        </Typography>
      </Box>

      {/* Line 2 — Out of appeared */}
      {row.appeared && Number(row.appeared) > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 14 }}>📝</span>
          <Typography sx={{ fontSize: 12, color: "#388e3c" }}>
            Out of {row.appeared} appeared →{" "}
            <strong>
              {((Number(row.above75) / Number(row.appeared)) * 100).toFixed(1)}%
            </strong>
          </Typography>
        </Box>
      )}

      {/* Line 3 — Out of enrolled */}
      {row.currentEnrollment && Number(row.currentEnrollment) > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: 14 }}>🏫</span>
          <Typography sx={{ fontSize: 12, color: "#388e3c" }}>
            Out of {row.currentEnrollment} enrolled →{" "}
            <strong>
              {((Number(row.above75) / Number(row.currentEnrollment)) * 100).toFixed(1)}%
            </strong>
          </Typography>
        </Box>
      )}

      {/* Line 4 — Performance label */}
      <Box sx={{
        mt: 0.5,
        px: 1, py: 0.3,
        borderRadius: 10,
        display: "inline-fit-content",
        background:
          ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
            ? "#c8e6c9"
            : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
            ? "#fff9c4"
            : "#ffccbc",
        width: "fit-content"
      }}>
        <Typography sx={{
          fontSize: 11, fontWeight: 700,
          color:
            ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
              ? "#1b5e20"
              : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
              ? "#f57f17"
              : "#bf360c"
        }}>
          {((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 75
            ? "🟢 Excellent Performance"
            : ((Number(row.above75) / Number(row.appeared || row.currentEnrollment)) * 100) >= 50
            ? "🟡 Average Performance"
            : "🔴 Needs Improvement"}
        </Typography>
      </Box>

    </Box>
  )}
</Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Below 50%" type="number" fullWidth size="small" value={row.below50}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].below50 = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Distinctions (≥ 75%)" type="number" fullWidth size="small" value={row.distinctions || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].distinctions = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Top Scorer Name" fullWidth size="small" value={row.topScorer || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScorer = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField label="Top Score (%)" type="number" fullWidth size="small" value={row.topScore || ""}
                          onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScore = e.target.value; setEnrollmentRows(u); }} />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Fallback if no class selected yet */}
                {!row.class && (
                  <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3, fontStyle: "italic" }}>
                    Please select a Class above to fill Academic Performance.
                  </Typography>
                )}
                {/* ── DROPOUT DETAILS ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Dropout Details
                </Typography>
                {row.dropouts.map((dropout, dIndex) => (
  <Box key={dIndex} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#f8fafc" }}>

    {/* ── ROW 1: Student Info ── */}
    <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", mb: 1, display: "block" }}>
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
            u[rowIndex].dropouts[dIndex].studentName = e.target.value;
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
            u[rowIndex].dropouts[dIndex].rollNo = e.target.value;
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
      u[rowIndex].dropouts[dIndex].reason = e.target.value;
      setEnrollmentRows(u);
        }}
        />
      </Grid>
    </Grid>

    {/* ── ROW 2: Guardian Info ── */}
    <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", mb: 1, display: "block" }}>
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
            u[rowIndex].dropouts[dIndex].guardianName = e.target.value;
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
          inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          error={dropout.guardianContactNo && dropout.guardianContactNo.toString().length !== 10}
          helperText={dropout.guardianContactNo && dropout.guardianContactNo.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
          onChange={(e) => {
            const u = [...enrollmentRows];
            u[rowIndex].dropouts[dIndex].guardianContactNo = e.target.value;
            setEnrollmentRows(u);
          }}
        />
      </Grid>
    </Grid>

    {/* ── ROW 3: Address Info ── */}
    <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", mb: 1, display: "block" }}>
      Address Details
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="PIN Code"
          fullWidth
          size="small"
          value={dropout.pinCode || ""}
          inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={async (e) => {
            const val = e.target.value;
            const u = [...enrollmentRows];
            u[rowIndex].dropouts[dIndex].pinCode = val;
            setEnrollmentRows(u);

            if (val.length === 6) {
              try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                const data = await res.json();
                if (data[0].Status === "Success") {
                  const po = data[0].PostOffice[0];
                  const u2 = [...enrollmentRows];
                  u2[rowIndex].dropouts[dIndex].district = po.District;
                  u2[rowIndex].dropouts[dIndex].postOffice = po.Name;
                  u2[rowIndex].dropouts[dIndex].gramPanchayat = po.Block;
                  u2[rowIndex].dropouts[dIndex].village = po.Village || "";
                  setEnrollmentRows(u2);
                }
              } catch (err) {
                console.error("Pincode fetch error:", err);
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="District"
          fullWidth
          size="small"
          value={dropout.district || ""}
          onChange={(e) => {
            const u = [...enrollmentRows];
            u[rowIndex].dropouts[dIndex].district = e.target.value;
            setEnrollmentRows(u);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="Post Office"
          fullWidth
          size="small"
          value={dropout.postOffice || ""}
          onChange={(e) => {
            const u = [...enrollmentRows];
            u[rowIndex].dropouts[dIndex].postOffice = e.target.value;
            setEnrollmentRows(u);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="Gram Panchayat"
          fullWidth
          size="small"
          value={dropout.gramPanchayat || ""}
          onChange={(e) => {
            const u = [...enrollmentRows];
            u[rowIndex].dropouts[dIndex].gramPanchayat = e.target.value;
            setEnrollmentRows(u);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          label="Village"
          fullWidth
          size="small"
          value={dropout.village || ""}
          onChange={(e) => {
            const u = [...enrollmentRows];
            u[rowIndex].dropouts[dIndex].village = e.target.value;
            setEnrollmentRows(u);
          }}
        />
      </Grid>
    </Grid>

  </Box>
))}
  
          
                <Box mb={3}>
                  <Button variant="outlined" size="small"
                    onClick={() => {
                      const u = [...enrollmentRows];
                     u[rowIndex].dropouts.push({ studentName: "", rollNo: "", reason: "", guardianName: "", guardianContactNo: "", pinCode: "", district: "", postOffice: "", gramPanchayat: "", village: "" });
                      setEnrollmentRows(u);
                    }}>
                    + Add Dropout
                  </Button>
                </Box>

                {/* ── MIGRATION DETAILS ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Migration Details
                </Typography>
                {row.migrations.map((migration, mIndex) => (
                  <Grid container spacing={2} mb={1} key={mIndex}>
                    <Grid item xs={12} md={3}>
                      <TextField label="Student Name" fullWidth size="small" value={migration.studentName}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].studentName = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField label="Migrated From" fullWidth size="small" value={migration.migratedFrom}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].migratedFrom = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField label="Transferred To" fullWidth size="small" value={migration.transferredTo}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].transferredTo = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField label="Reason" multiline
  rows={4} fullWidth size="small" value={migration.reason}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].reason = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                  </Grid>
                ))}
                <Box mb={3}>
                  <Button variant="outlined" size="small"
                    onClick={() => {
                      const u = [...enrollmentRows];
                      u[rowIndex].migrations.push({ studentName: "", migratedFrom: "", transferredTo: "", reason: "" });
                      setEnrollmentRows(u);
                    }}>
                    + Add Migration
                  </Button>
                </Box>

                {/* ── STUDENT ACHIEVEMENTS ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Student Special Achievements
                </Typography>
                {row.achievements.map((achievement, aIndex) => (
                  <Grid container spacing={2} mb={1} key={aIndex}>
                    <Grid item xs={12} md={3}>
                      <TextField label="Student Name" fullWidth size="small" value={achievement.studentName}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].studentName = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField label="Event Name" fullWidth size="small" value={achievement.eventName}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].eventName = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField select label="Level / Exam" fullWidth size="small" sx={{ minWidth: 220 }} value={achievement.level}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].level = e.target.value; setEnrollmentRows(u); }}>
                        {achievementLevels.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField label="Recognition" fullWidth size="small" value={achievement.recognition}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].recognition = e.target.value; setEnrollmentRows(u); }} />
                    </Grid>
                  </Grid>
                ))}
                <Box>
                  <Button variant="outlined" size="small"
                    onClick={() => {
                      const u = [...enrollmentRows];
                      u[rowIndex].achievements.push({ studentName: "", eventName: "", level: "", recognition: "" });
                      setEnrollmentRows(u);
                    }}>
                    + Add Achievement
                  </Button>
                </Box>

              </Box>
            ))}

            {/* Add new Class/Section Block */}
            <Box mb={4}>
              <Button variant="contained"
                onClick={() =>
                  setEnrollmentRows([...enrollmentRows, {
                    academicYear: "", class: "", section: "", sanctionedCapacity: "",
                    currentEnrollment: "", category: "", boardClass: "", appeared: "",
                    passed: "", passPercent: "", above75: "", below50: "",
                    above75Error: "",
                    stream: "",
                    distinctions: "",
                    topScorer: "",
                    topScore: "",
                    categoryBreakdown: { ST: "", PVTG: "", "DNT/NT/SNT": "", Orphan: "", LWE: "", "Divyang": "" },
                    
                   dropouts: [{ studentName: "", rollNo: "", reason: "", guardianName: "", guardianContactNo: "", pinCode: "", district: "", postOffice: "", gramPanchayat: "", village: "" }],
                    migrations: [{ studentName: "", migratedFrom: "", transferredTo: "", reason: "" }],
                    achievements: [{ studentName: "", eventName: "", level: "", recognition: "" }]
                  }])
                }>
                + Add Class / Section
              </Button>
            </Box>
</>)}
{currentStep === 5 && (<>
            {/* ================= EXTRA CURRICULAR ACTIVITIES SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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

            {extraCurricularRows.map((row, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #cbd5e1",
                  borderRadius: 2,
                  padding: 3,
                  mb: 2,
                  backgroundColor: "#fff"
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
                      {["2024-2025", "2025-2026", "2026-2027", "2027-2028", "2028-2029", "2029-2030"].map(y => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Application / Initiative Name */}
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

                  {/* Areas of Development - multi select */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      label="Areas of Development"
                      fullWidth
                      size="small"
                      sx={{ minWidth: 220 }}
                  
                      value={row.areasOfDevelopment}
                      onChange={(e) => {
                        const u = [...extraCurricularRows];
                        u[index].areasOfDevelopment = e.target.value;
                        setExtraCurricularRows(u);
                      }}
                    >
                      {[
                        "Sports",
                        "Culture",
                        "Health & Wellness",
                        "Value Education",
                        "Computer Skills",
                        "Personality Development",
                        "Excursions",
                        "Career Guidance",
                        "Exposure",
                        "Competitive Exam Training",
                        "Enhancing Learning Skills",
                        "Adventure Activities",
                        "STEM Learning",
                        "Innovation"
                      ].map(area => (
                        <MenuItem key={area} value={area}>{area}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Description / Objectives */}
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

                  {/* Class */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Class"
                      fullWidth
                      size="small"
                      value={row.targetStudents}
                      onChange={(e) => {
                        const u = [...extraCurricularRows];
                        u[index].targetStudents = e.target.value;
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
                      {["Active", "In Progress", "Completed", "Planned"].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                </Grid>
              </Box>
            ))}

            {/* Add Activity Button */}
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
                      status: ""
                    }
                  ])
                }
              >
                + Add Activity
              </Button>
            </Box>
            </>)}
            {currentStep === 6 && (<>
            {/* ================= HOSPITALIZATION SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
                  backgroundColor: "#fff"
                }}
              >
{/* ── HOSPITAL INFO ── */}
<Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
  Hospital & Empanelment Details
</Typography>
<Grid container spacing={2} mb={2}>

  <Grid item xs={12} sm={6} md={4}>
    <TextField
      label="Hospital Empanelled With"
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
      label="Validity of Empanelment"
      fullWidth
      size="small"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={row.empanellementValidity}
      onChange={(e) => {
        const u = [...hospitalizationRows];
        u[index].empanellementValidity = e.target.value;
        setHospitalizationRows(u);
      }}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <TextField
      select
      label="Department (Empanelment)"
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
        "Other"
      ].map(dept => (
        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
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
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
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
                      {["6", "7", "8", "9", "10", "11", "12"].map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
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
                      {["A", "B", "C"].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
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
  inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
  onKeyDown={(e) => {
    if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  error={row.guardianContact && row.guardianContact.toString().length !== 10}
  helperText={row.guardianContact && row.guardianContact.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
  onChange={(e) => {
    const u = [...hospitalizationRows];
    u[index].guardianContact = e.target.value;
    setHospitalizationRows(u);
  }}
/>
                  </Grid>

                </Grid>
                {/* ── ADMISSION INFO ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
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
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Cost & Claim Details
                </Typography>
                <Grid container spacing={2}>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Estimated Cost (₹)"
                      fullWidth
                      size="small"
                      sx={{ minWidth: 220 }}
                      type="number"
                      value={row.estimatedCost}
                      onChange={(e) => {
                        const u = [...hospitalizationRows];
                        u[index].estimatedCost = e.target.value;
                        setHospitalizationRows(u);
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
                      onChange={(e) => {
                        const u = [...hospitalizationRows];
                        u[index].amountClaimed = e.target.value;
                        setHospitalizationRows(u);
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
                      {["Pending", "Submitted", "Approved", "Rejected", "Partially Approved"].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                </Grid>

              </Box>
            ))}

            {/* Add Case Button */}
            <Box mb={4}>
              <Button
                variant="outlined"
                onClick={() =>
                  setHospitalizationRows([
                    ...hospitalizationRows,
                    {
                      studentName: "",
                      rollNo: "",
                      class: "",
                      section: "",
                      admissionDate: "",
                      dischargeDate: "",
                      reasonForHospitalization: "",
                      hospitalEmpanelled: "",
                      empanellementValidity: "",
                      empanelmentDepartment: "",
                      doctorName: "",
                      estimatedCost: "",
                      amountClaimed: "",
                      claimStatus: "",
                      guardianName: "",
                      guardianContact: ""
                    }
                  ])
                }
              >
                + Add Hospitalization Case
              </Button>
            </Box>
            </>)}
            {currentStep === 7 && (<>

            {/* ================= TEACHING STAFF DETAILS SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
                sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}
              >

                {/* ── SECTION 1: PERSONAL & POST DETAILS ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Staff Details
                </Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                  <Grid container spacing={2}>
                    {teachingStaffSummaryFields
                      .filter(f => f.name !== "total" && f.name !== "filled" && f.name !== "vacant")
                      .map((field) => (
                        <Grid item xs={12} sm={6} md={4} key={field.name}>
                          {field.type === "select" ? (
                            <TextField
  select                                          
  fullWidth size="small" sx={{ minWidth: 220 }}
  type={field.name === "contact" ? "text" : "text"}  
  label={field.label}
  value={row[field.name]}
  InputProps={{ readOnly: field.readOnly }}
  InputLabelProps={{ shrink: field.type === "date" || undefined }}
  {...(field.name === "contact" && {
    inputProps: { maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" },
    onKeyDown: (e) => {
      if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
        e.preventDefault();
      }
    },
    error: row.contact && row.contact.toString().length !== 10,
    helperText: row.contact && row.contact.toString().length !== 10 ? "Must be exactly 10 digits" : ""
     })}
  onChange={(e) => {
    const updatedRows = [...teachingRows];
    updatedRows[index][field.name] = e.target.value;
    setteachingRows(updatedRows);
                              }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {field.options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            <TextField
                              fullWidth size="small" sx={{ minWidth: 220 }} type={field.type} label={field.label}
                              value={row[field.name]}
                              InputProps={{ readOnly: field.readOnly }}
                              InputLabelProps={{ shrink: field.type === "date" || undefined }}
                              onChange={(e) => {
                                const updatedRows = [...teachingRows];
                                updatedRows[index][field.name] = e.target.value;
                                setteachingRows(updatedRows);
                              }}
                            />
                          )}
                        </Grid>
                      ))}
                  </Grid>
                </Box>

                {/* ── SECTION 2: SANCTIONED STRENGTH ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Sanctioned Strength
                </Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                  <Grid container spacing={2}>
                    {teachingStaffSummaryFields
                      .filter(f => f.name === "total" || f.name === "filled" || f.name === "vacant")
                      .map((field) => (
                        <Grid item xs={12} sm={4} key={field.name}>
                          <TextField
                            fullWidth size="small" type={field.type} label={field.label}
                            value={field.name === "vacant"
                              ? (Number(row.total || 0) - Number(row.filled || 0)) || ""
                              : row[field.name]}
                            InputProps={{ readOnly: field.readOnly }}
                            onChange={(e) => {
                              const updatedRows = [...teachingRows];
                              updatedRows[index][field.name] = e.target.value;
                              setteachingRows(updatedRows);
                            }}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Box>

                {/* ── SECTION 3: EDUCATIONAL QUALIFICATION ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Educational Qualification
                </Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, backgroundColor: "#f8fafc" }}>
                  {renderQualificationTables(teachingRows, setteachingRows, index)}
                </Box>

              </Box>
            ))}
            {/* Add Post Button */}
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
                          post: "", name: "", dob: "", doj: "", email: "", contact: "",
                          total: "", filled: "", vacant: "",
                          academicQualifications: [{  post:"", staffname:" ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
                          professionalQualifications: [{  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
                          tetQualifications: [{  post:"", staffname:" ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }]
                        }])
                    }
                  >
                    + Add Post
                  </Button>
                </Box>
              </Grid>
            </Grid>
            {/* =================NON TEACHING STAFF DETAILS SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
                sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}
              >

                {/* ── SECTION 1: STAFF DETAILS ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Staff Details
                </Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                  <Grid container spacing={2}>
                    {nonTeachingStaffDetailFields
                      .filter(f => f.name !== "total" && f.name !== "filled" && f.name !== "vacant")
                      .map((field) => (
                        <Grid item xs={12} sm={6} md={4} key={field.name}>
                          {field.type === "select" ? (
                           <TextField
  select                                                   
  fullWidth size="small" sx={{ minWidth: 220 }}
  type={field.name === "contact" ? "text" : "text"}       
  label={field.label}
  value={row[field.name]}
  InputProps={{ readOnly: field.readOnly }}
  InputLabelProps={{ shrink: field.type === "date" || undefined }}
  {...(field.name === "contact" && {
    inputProps: { maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" },
    onKeyDown: (e) => {
      if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
        e.preventDefault();
      }
    },
    error: row.contact && row.contact.toString().length !== 10,
    helperText: row.contact && row.contact.toString().length !== 10 ? "Must be exactly 10 digits" : ""
  })}
  onChange={(e) => {
    const updatedRows = [...nonTeachingRows];
    updatedRows[index][field.name] = e.target.value;
    setnonTeachingRows(updatedRows);
                              }}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {field.options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            <TextField
                              fullWidth size="small" sx={{ minWidth: 220 }} type={field.type || "text"} label={field.label}
                              value={row[field.name]}
                              InputProps={{ readOnly: field.readOnly }}
                              InputLabelProps={{ shrink: field.type === "date" || undefined }}
                              onChange={(e) => {
                                const updatedRows = [...nonTeachingRows];
                                updatedRows[index][field.name] = e.target.value;
                                setnonTeachingRows(updatedRows);
                              }}
                            />
                          )}
                        </Grid>
                      ))}
                  </Grid>
                </Box>

                {/* ── SECTION 2: SANCTIONED STRENGTH ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Sanctioned Strength
                </Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                  <Grid container spacing={2}>
                    {nonTeachingStaffDetailFields
                      .filter(f => f.name === "total" || f.name === "filled" || f.name === "vacant")
                      .map((field) => (
                        <Grid item xs={12} sm={4} key={field.name}>
                          <TextField
                            fullWidth size="small" type={field.type} label={field.label}
                            value={field.name === "vacant"
                              ? (Number(row.total || 0) - Number(row.filled || 0)) || ""
                              : row[field.name]}
                            InputProps={{ readOnly: field.readOnly }}
                            onChange={(e) => {
                              const updatedRows = [...nonTeachingRows];
                              updatedRows[index][field.name] = e.target.value;
                              setnonTeachingRows(updatedRows);
                            }}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Box>

                {/* ── SECTION 3: EDUCATIONAL QUALIFICATION ── */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                  Educational Qualification
                </Typography>
                <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, backgroundColor: "#f8fafc" }}>
                  {renderQualificationTables(nonTeachingRows, setnonTeachingRows, index, false)}
                </Box>

              </Box>
            ))}
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
                          post: "", name: "", dob: "", doj: "", email: "", contact: "",
                          total: "", filled: "", vacant: "",
                          academicQualifications: [{ qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
                          professionalQualifications: [{ qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
                        }
                      ])
                    }
                  >
                    + Add Post
                  </Button>
                </Box>
              </Grid>
            </Grid>
            </>)}
            {currentStep === 8 && (<>

            {/* ================= OPERATIONAL COST DETAILS ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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

            <Grid container spacing={2} mb={4}>
              {operationalCostFields.map((fieldItem) => (
                <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
                  <Controller
                    name={fieldItem.name}
                    control={control}
                    defaultValue=""
                    rules={{ required: `${fieldItem.label} is required` }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label={fieldItem.label}
                        type={fieldItem.type || "text"}
                        select={!!fieldItem.options}
                        fullWidth
                        size="small"
                        sx={{ minWidth: 220 }}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        InputProps={{
                          readOnly: fieldItem.readOnly || false,
                        }}
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
              ))}
            </Grid>

            {/* ================= IMAGE UPLOAD SECTION ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
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
                    marginTop: "16px"
                  }}
                />
                <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
      📎 {uploadedImage.name}
    </Typography>
              </Grid>
            )}

           {/* ── PREVIEW ── */}
            <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3, mb: 3, background: "#f8fafc" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>
                📋 Preview & Confirm
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">School Name</Typography>
                  <Typography fontWeight={600}>{watch("schoolname") || "—"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">EMRS Code</Typography>
                  <Typography fontWeight={600}>{watch("EMRScode") || "—"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Principal Name</Typography>
                  <Typography fontWeight={600}>{watch("NameofthePrincipal") || "—"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">District</Typography>
                  <Typography fontWeight={600}>{watch("district") || "—"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Affiliation</Typography>
                  <Typography fontWeight={600}>{watch("Affiliation") || "—"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">School Type</Typography>
                  <Typography fontWeight={600}>{watch("schooltype") || "—"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Teaching Staff Records</Typography>
                  <Typography fontWeight={600}>{teachingRows.length} record(s)</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Non-Teaching Staff Records</Typography>
                  <Typography fontWeight={600}>{nonTeachingRows.length} record(s)</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Enrollment Records</Typography>
                  <Typography fontWeight={600}>{enrollmentRows.length} class(es)</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Hospitalization Cases</Typography>
                  <Typography fontWeight={600}>{hospitalizationRows.length} case(s)</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Extra Curricular Activities</Typography>
                  <Typography fontWeight={600}>{extraCurricularRows.length} activity(s)</Typography>
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
                  sx={{ background: "linear-gradient(to right, #16a34a, #4ade80)", minWidth: 160 }}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}
                >
                  {loading ? "Submitting..." : "✅ Submit"}
                </Button>
              </Box>
            </Grid>

            </>)}
{/* ================= NAVIGATION BUTTONS ================= */}
            <Box
              display="flex" justifyContent="space-between" alignItems="center"
              mt={4} pt={3} sx={{ borderTop: "1px solid #e2e8f0" }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={currentStep === 0}
                sx={{ minWidth: 120 }}
              >
                ← Back
              </Button>

              <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                Step {currentStep + 1} of {STEPS.length}
              </Typography>

              {currentStep < STEPS.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    minWidth: 150,
                    background: "linear-gradient(to right, #1976d2, #42a5f5)"
                  }}
                >
                  Save & Next →
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
      {submittedForms.length > 0 && (
  <Card sx={{ mt: 4 }}>
    <Box sx={{ background: "linear-gradient(to right, #16a34a, #4ade80)", p: 2, borderRadius: "16px 16px 0 0" }}>
      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
        📋 Submitted EMRS Forms
      </Typography>
    </Box>
    <CardContent>
      {submittedForms.map((form, i) => (
        <Box key={i} sx={{
          border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#f8fafc"
        }}>
          <Box>
            <Typography fontWeight={700}>{form.schoolname || "—"}</Typography>
            <Typography variant="caption" color="text.secondary">
              EMRS Code: {form.EMRScode} | District: {form.district} | Submitted: {form.submittedAt}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small" onClick={() => exportCSV(form)}>
              ⬇ CSV
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={() => exportPDF(form)}>
              ⬇ PDF
            </Button>
          </Box>
        </Box>
      ))}
    </CardContent>
  </Card>
)}


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
    <Typography>Your EMRS form has been submitted successfully. You can view it in the <strong>Submitted Forms</strong> section below.</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSubmitSuccess(false)} variant="contained" color="success">OK</Button>
  </DialogActions>
</Dialog>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
};


export default EMRSForm;