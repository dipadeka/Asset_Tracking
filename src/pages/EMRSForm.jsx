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
const EMRSForm = () => {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [dropoutRows, setDropoutRows] = useState([
    { year: "", class: "",section: "", studentName: "", reason: "" }
  ]);

  const [migrationRows, setMigrationRows] = useState([
    { year: "", studentName: "",class: "", migratedfrom: "", transferredTo: "", reason: "" }
  ]);
 
   const [academicRows, setAcademicRows] = useState([
  {
    year: "",
    boardClass: "",
    appeared: "",
    passed: "",
    passPercent: "",
    above75: "",
    below50: ""
  }
]);

  const [achievementRows, setAchievementRows] = useState([
    { studentName: "", class: "", eventName: "", level: "", recognition: "" }

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
    vacant: ""
   
  }
]);
  const [nonTeachingRows, setnonTeachingRows] = useState([
  { post: "", name: "", dob: "", doj: "", email: "", contact: "" }
]);

const handleAcademicChange = (index, field, value) => {
  const updatedRows = [...academicRows];

  updatedRows[index][field] = value;

  const appeared = Number(updatedRows[index].appeared || 0);
  const passed = Number(updatedRows[index].passed || 0);

  updatedRows[index].passPercent =
    appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";

  setAcademicRows(updatedRows);
};   // ✅ CLOSE FUNCTION


const handleAddAcademicRows = () => {
  setAcademicRows([
    ...academicRows,
    {
      year: "",
      boardClass: "",
      appeared: "",
      passed: "",
      passPercent: "",
      above75: "",
      below50: ""
    }
  ]);
};const handleAddNonTeachingSummary = () => {
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

  playground: data.playground || ""
});
const prepareHostelAdministration = (data) => ({
  boysHostelCapacity: Number(data.boysHostelCapacity || 0),

  girlsHostelCapacity: Number(data.girlsHostelCapacity || 0),

  bedsAvailable: Number(data.bedsAvailable || 0),

  currentOccupancy: Number(data.currentOccupancy || 0),

  cctvInstalled: data.cctvInstalled || "",

  noOfCCTV: Number(data.noOfCCTV || 0),

  securityAgency: data.securityAgency || "",

  girlsWarden: {
    name: data.girlsWardenName?.trim() || "",
    email: data.girlsWardenEmail?.trim() || "",
    contact: data.girlsWardenContact || ""
  },

  boysWarden: {
    name: data.boysWardenName?.trim() || "",
    email: data.boysWardenEmail?.trim() || "",
    contact: data.boysWardenContact || ""
  },

  otherAmenities: data.otherAmenities?.trim() || ""

});
  const prepareClassStrength = (rows) => {
  return rows.map((row) => {

    const sanctionedCapacity = Number(row.sanctionedCapacity || 0);
    const currentEnrollment = Number(row.currentEnrollment || 0);

    return {
      academicYear: row.academicYear,
      class: row.class,
      section: row.section,
      sanctionedCapacity,
      currentEnrollment

    };
  });
};
  const prepareReservationDetails = (rows) => {
  return rows.map((row) => ({
    name: row.name,
    class: row.class,
    section: row.section,
    category: row.category
  }));
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

    return {
      electricity,
      water,
      internet,
      maintenance,
      mess,
      totalMonthlyCost:
        electricity + water + internet + maintenance + mess
    };
  };
  const preparePayload = (data) => {
    return {
      BasicDetails: prepareBasicDetails(data),
      locationDetais: prepareLocationDetails(data),
      InfrastructureDetails: prepareInfrastructureDetails(data),
      HostelAdministration: prepareHostelAdministration(data),
      EnrollmentSummary: prepareEnrollmentSummary(data),
      ClassStrength: prepareClassStrength(data),
      ReservationDetails: prepareReservationDetails(reservationRows),
      AcademicResults: prepareAcademicResults(academicRows),
      Dropouts: prepareDropouts(dropoutRows),
      Migrations: prepareMigrations(migrationRows),
      Achievements: prepareAchievements(achievementRows),
      teachingStaff: {
        Summary: prepareTeachingStaffSummary(data.teachingSummary),
        Details: prepareTeachingStaffDetails(data.teachingDetails)
      },
      nonTeachingStaff: {
        Summary: prepareNonTeachingSummary(data.nonTeachingSummary),
        Details: prepareNonTeachingDetails(data.nonTeachingDetails)
      },
      OperationalCost: prepareOperationalCost(data.operationalCost)
    };
  };

  const onSubmit = (data) => {
    const payload = preparePayload(data);
    console.log("FINAL EMRS PAYLOAD:", payload);
  };
  const submitEMRS = async (payload) => {
    try {
      setLoading(true);   // 🟢 START LOADER

      const response = await fetch("/api/emrs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      alert("EMRS Data Submitted Successfully ✅");
      console.log("EMRS RESPONSE:", result);

    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to Submit EMRS Data ❌");
    } finally {
      setLoading(false);   // 🔴 STOP LOADER
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





  // ================= EMRS BASIC DETAILS =================
  const emrsBasicFields = [
    { name: "EMRScode", label: "EMRS Code" },
    { name: "EMRSid", label: "EMRS ID" },
    { name: "udaisecode", label: "UDISE Code" },
    { name: "schoolname", label: "School Name" },
    { name: "schooltype", label: "School Type",  type: "select",
    options: [
        "Girls",
        "Boys",
        "Co-Ed",
      ],
    },
    { name: "Affiliation", label: "Affiliation",  type: "select",
      options: [
        "SEBA",
        "CBSE",
        "ICSC",
      ],
    },
    { name: "NameofthePrincipal", label: "Principal Name"},
    { name: "contactno", label: "Contact Number", type: "number"},
    { name: "emailid", label: "Email-id"},

  ];
  // ================= EMRS LOCATION =================
  const emrsLocationFields = [
    { name: "district", label: "District" },
    { name: "block", label: "Block" },
    { name: "grampanchayat", label: "Gram Panchayat" },
    { name: "village", label: "Village" },
  ];
  //=================INFRASTRUCTURE DETAILS ==============//
  const emrsInfrastructureFields=[
    { name: " TotalClassrooms", label: "Total Classrooms"},
    { name: "ClassroomwithSmartclass", label: "Classroom with Smart Class"},
    { name: "classroomwithprojector", label: "Classroom with Projector"},
     {name: "ScienceLab", label: "Science Lab",
      options: [
        "Yes",
        "No",
      ],
    }, 
    {name: "ComputerLab", label: "Computer Lab",
      options: [
        "Yes",
        "No",
      ],
    }, 
{name: "Library", label: "Library",
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
    {name: "Playground", label: "Playground",
      options: [
        "Yes",
        "No",
      ],
    }, 
  ];
   // ================= HOSTEL ADMINISTRATION DETAILS =================
  const emrsHostelFields = [

  { name: "boysHostelCapacity", label: "Boys Hostel Capacity", type: "number" },
  { name: "girlsHostelCapacity", label: "Girls Hostel Capacity", type: "number" },

  { name: "bedsAvailable", label: "No of Beds Available", type: "number" },

  { name: "currentOccupancy", label: "Current Occupancy", type: "number" },

  {
    name: "cctvInstalled",
    label: "CCTV Installed",
    options: ["Yes", "No"],
  },

  { name: "noOfCCTV", label: "No of CCTV Installed", type: "number" },

  {
    name: "securityAgency",
    label: "Security Agency Available",
    options: ["Yes", "No"],
  },

  { name: "girlsWardenName", label: "Girls Hostel Warden Name" },
  { name: "girlsWardenEmail", label: "Girls Hostel Warden Email" },
  { name: "girlsWardenContact", label: "Girls Hostel Warden Contact No", type: "number" },

  { name: "boysWardenName", label: "Boys Hostel Warden Name" },
  { name: "boysWardenEmail", label: "Boys Hostel Warden Email" },
  { name: "boysWardenContact", label: "Boys Hostel Warden Contact No", type: "number" },

  {
  name: "otherAmenities",
  label: "Other Amenities to be Made Available",
  multiline: true,
  rows: 3
}

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
    options: ["6","7","8","9","10","11","12"]
  },

  {
    name: "section",
    label: "Section",
    options: ["A","B","C"]
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
  }

];
// ================= RESERVATION DETAILS =================
  const reservationFields = [
  { name: "Student Name", label: "Student Name" },

  {
    name: "class",
    label: "Class",
    options: ["6","7","8","9","10","11","12"]
  },

  {
    name: "section",
    label: "Section",
    options: ["A","B","C"]
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
      "Divyang Parent"
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
    { name:"Year", label: "Year",
      options:[
        "2024-2025",
        "2025-2026",
        "2026-2027"
      ],
    },
    { name:"month", label: "Month",
      options:[
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
    { name: "operationalcost", label: "Operational Cost",
      options:[
        "Electricity",
        "Water",
        "Internet",
        "Maintenance",
        "Establishment",
        "Miscellaneous",
        "Others"
      ], 
    },
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


  return (
    <Container
      maxWidth="xl"
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
        rules={{ required: `${fieldItem.label} is required` }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={fieldItem.label}
            fullWidth
            size="small"
            select={!!fieldItem.options}
            error={!!error}
            helperText={error ? error.message : ""}
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

</Grid>

{/* ================= EMRS INFRASTRUCTURE DETAILS ================= */}

<Grid container spacing={3}>

  {/* Heading Row */}
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
      Infrastructure Details
    </Typography>
  </Grid>

</Grid>

{/* Fields Row (New Line) */}
<Grid container spacing={3} mb={4}>

  <Grid item xs={12} sm={6} md={3}>
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

  <Grid item xs={12} sm={6} md={3}>
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

<Grid item xs={12} sm={6} md={3}>
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

  <Grid item xs={12} sm={6} md={3}>
    <Controller
      name="scienceLab"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Science Lab" fullWidth size="small">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <Controller
      name="computerLab"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Computer Lab" fullWidth size="small">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <Controller
      name="library"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Library" fullWidth size="small">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
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

  <Grid item xs={12} sm={6} md={3}>
    <Controller
      name="playground"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Playground" fullWidth size="small">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <Controller
      name="smartClassroom"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField {...field} select label="Smart Classroom" fullWidth size="small">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      )}
    />
  </Grid>

</Grid>   
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
                    mb: 2,
                  }}
                >
                  Hostel Administration
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={4}>
              {emrsHostelFields.map((fieldItem) => (
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
  fullWidth
  size="small"
  type={fieldItem.type || "text"}
  multiline={fieldItem.multiline || false}
  rows={fieldItem.rows || 1}
  select={
    fieldItem.name === "cctvInstalled" ||
    fieldItem.name === "securityAgency"
  }
  error={!!error}
  helperText={error ? error.message : ""}
>
    {(fieldItem.name === "cctvInstalled" ||
      fieldItem.name === "securityAgency") && [
      <MenuItem key="yes" value="Yes">
        Yes
      </MenuItem>,
      <MenuItem key="no" value="No">
        No
      </MenuItem>,
      
    ]}
  </TextField>
)}
      />              
                  
                </Grid>
              ))}
            </Grid>

           {/* ================= STUDENT ENROLLEMENT SECTION ================= */}
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
            <Grid container spacing={2} mb={4}>
  {enrollmentFields.map((fieldItem) => (
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
            fullWidth
            size="small"
            type={fieldItem.type || "text"}
            select={!!fieldItem.options}
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


            {/* ================= STUDENT RESERVATION DETAILS SECTION ================= */}
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
                  Student Reservation Details
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={4}>
              {reservationFields.map((fieldItem) => (
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
    fullWidth
    size="small"
    type={fieldItem.type || "text"}
    select={!!fieldItem.options}
    error={!!error}
    helperText={error ? error.message : ""}
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

            {/* ================= ACADEMIC PERFORMANCE DETAILS SECTION ================= */}
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
                  Academic Performance Details
                </Typography>
                
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
  {academicFields.map((fieldItem) => (
    <Grid item xs={12} sm={6} md={3} key={fieldItem.name}>
      <Controller
        name={fieldItem.name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label={fieldItem.label}
            fullWidth
            size="small"
                      />
                    )}
                  />
                </Grid>

              ))}

              <Button
  variant="contained"
  onClick={handleAddAcademicRows}
  sx={{ mb: 2 }}
>
  Add Row
</Button>
            
             {/* ================= DROPOUT DETAILS ================= */}
<Grid container spacing={2} sx={{ width: "100%", mt: 2 }}>
  <Grid item xs={12}>
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          display: "block",
          width: "fit-content",
          background: "linear-gradient(to right, #1976d2, #42a5f5)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 2,
          fontWeight: 600,
          mt: 2
        }}
      >
        Dropout Details (Class VI–XII)
      </Typography>
    </Box>
  </Grid>
</Grid>
              {dropoutRows.map((row, index) => (
                <Grid container spacing={2} key={index} mb={2}>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Year"
                      fullWidth
                      size="small"
                      onChange={(e) => {
                        const updated = [...dropoutRows];
                        updated[index].year = e.target.value;
                        setDropoutRows(updated);
                      }}
                    />
                  </Grid>

                 <Grid item xs={12} sm={6} md={4}>
  <TextField
    select
    label="Class"
    fullWidth
    size="small"
    value={row.class}
    onChange={(e) => {
      const updated = [...dropoutRows];
      updated[index].class = e.target.value;
      setDropoutRows(updated);
    }}
  >
    {["6", "7", "8", "9", "10", "11", "12"].map((cls) => (
      <MenuItem key={cls} value={cls}>
        {cls}
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
    value={row.section}
    onChange={(e) => {
      const updated = [...dropoutRows];
      updated[index].section = e.target.value;
      setDropoutRows(updated);
    }}
  >
    {["A", "B", "C"].map((sec) => (
      <MenuItem key={sec} value={sec}>
        {sec}
      </MenuItem>
    ))}
  </TextField>
</Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Student Name"
                      fullWidth
                      size="small"
                      onChange={(e) => {
                        const updated = [...dropoutRows];
                        updated[index].studentName = e.target.value;
                        setDropoutRows(updated);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Reason"
                      fullWidth
                      size="small"
                      onChange={(e) => {
                        const updated = [...dropoutRows];
                        updated[index].reason = e.target.value;
                        setDropoutRows(updated);
                      }}
                    />
                  </Grid>
                </Grid>
              ))}

              {/* Add Dropout Button in Next Line */}
<Grid container>
  <Grid item xs={12}>
    <Box mt={1} mb={4}>
      <Button
        variant="outlined"
        onClick={() =>
          setDropoutRows([
            ...dropoutRows,
            { year: "", class: "", section: "", studentName: "", reason: "" }
          ])
        }
      >
        + Add Dropout
      </Button>
    </Box>
  </Grid>
</Grid>

              {/* ================= STUDENT MIGRATION ================= */}
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
                    Student Migration Details
                  </Typography>
                </Grid>


                {migrationRows.map((row, index) => (
  <Grid container spacing={2} key={index} mb={2}>

    {/* Year */}
    <Grid item xs={12} md={2}>
      <TextField
        label="Year"
        fullWidth
        size="small"
        value={row.year}
        onChange={(e) => {
          const updated = [...migrationRows];
          updated[index].year = e.target.value;
          setMigrationRows(updated);
        }}
      />
    </Grid>

    {/* Student Name */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Student Name"
        fullWidth
        size="small"
        value={row.studentName}
        onChange={(e) => {
          const updated = [...migrationRows];
          updated[index].studentName = e.target.value;
          setMigrationRows(updated);
        }}
      />
    </Grid>

    {/* Class (Added after Student Name) */}
    <Grid item xs={12} md={2}>
      <TextField
        select
        label="Class"
        fullWidth
        size="small"
        value={row.class}
        onChange={(e) => {
          const updated = [...migrationRows];
          updated[index].class = e.target.value;
          setMigrationRows(updated);
        }}
      >
        {["6","7","8","9","10","11","12"].map((cls) => (
          <MenuItem key={cls} value={cls}>
            {cls}
          </MenuItem>
        ))}
      </TextField>
    </Grid>

    {/* Migrated From */}
    <Grid item xs={12} md={2}>
      <TextField
        label="Migrated From"
        fullWidth
        size="small"
        value={row.migratedfrom}
        onChange={(e) => {
          const updated = [...migrationRows];
          updated[index].migratedfrom = e.target.value;
          setMigrationRows(updated);
        }}
      />
    </Grid>

    {/* Transferred To */}
    <Grid item xs={12} md={2}>
      <TextField
        label="Transferred To"
        fullWidth
        size="small"
        value={row.transferredTo}
        onChange={(e) => {
          const updated = [...migrationRows];
          updated[index].transferredTo = e.target.value;
          setMigrationRows(updated);
        }}
      />
    </Grid>

    {/* Reason */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Reason"
        fullWidth
        size="small"
        value={row.reason}
        onChange={(e) => {
          const updated = [...migrationRows];
          updated[index].reason = e.target.value;
          setMigrationRows(updated);
        }}
      />
    </Grid>

  </Grid>
))}
                <Grid container>
                  <Grid item xs={12}>
                    <Box mt={2} mb={4}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setMigrationRows([
                            ...migrationRows,
                            { year: "", studentName: "", migratedfrom: "", transferredTo: "", reason: "" }
                          ])
                        }
                      >
                        + Add Migration
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* ================= STUDENT ACHIEVEMENTS ================= */}
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
                    Student Special Achievements
                  </Typography>
                </Grid>
              </Grid>

              {achievementRows.map((row, index) => (
                <Grid container spacing={2} key={index} mb={2}>
                  <Grid item xs={12} md={3}>
                    <TextField label="Student Name" fullWidth size="small"
                      onChange={(e) => {
                        const updated = [...achievementRows];
                        updated[index].studentName = e.target.value;
                        setAchievementRows(updated);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField label="Class" fullWidth size="small"
                      onChange={(e) => {
                        const updated = [...achievementRows];
                        updated[index].class = e.target.value;
                        setAchievementRows(updated);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField label="Event Name" fullWidth size="small"
                      onChange={(e) => {
                        const updated = [...achievementRows];
                        updated[index].eventName = e.target.value;
                        setAchievementRows(updated);
                      }}
                    />
                  </Grid>

                 <Grid item xs={12} sm={6} md={3}>
  <TextField
    select
    label="Level / Exam"
    fullWidth
    size="small"
    value={row.level}
    onChange={(e) => {
      const updated = [...achievementRows];
      updated[index].level = e.target.value;
      setAchievementRows(updated);
    }}
  >
    {achievementLevels.map((level) => (
      <MenuItem key={level} value={level}>
        {level}
      </MenuItem>
    ))}
  </TextField>
</Grid>
                  <Grid item xs={12} md={2}>
                    <TextField label="Recognition" fullWidth size="small"
                      onChange={(e) => {
                        const updated = [...achievementRows];
                        updated[index].recognition = e.target.value;
                        setAchievementRows(updated);
                      }}
                    />
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="outlined"
                sx={{ mb: 4 }}
                onClick={() =>
                  setAchievementRows([
                    ...achievementRows,
                    { studentName: "", class: "", eventName: "", level: "", recognition: "" }
                  ])
                }
              >
                + Add Achievement
              </Button>
            </Grid>

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
  <Grid container spacing={2} mb={2} key={index}>

    {/* ===== FIRST ROW (STAFF DETAILS) ===== */}
    {teachingStaffSummaryFields
      .filter(
        (field) =>
          field.name !== "total" &&
          field.name !== "filled" &&
          field.name !== "vacant"
      )
      .map((field) => (
        <Grid item xs={12} sm={3} key={field.name}>
          {field.type === "select" ? (
            <TextField
              select
              fullWidth
              size="small"
              label={field.label}
              value={row[field.name]}
              onChange={(e) => {
                const updatedRows = [...teachingRows];
                updatedRows[index][field.name] = e.target.value;
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
              type={field.type}
              label={field.label}
              value={row[field.name]}
              InputProps={{ readOnly: field.readOnly }}
              onChange={(e) => {
                const updatedRows = [...teachingRows];
                updatedRows[index][field.name] = e.target.value;
                setteachingRows(updatedRows);
              }}
            />
          )}
        </Grid>
      ))}

    {/* ===== SECOND ROW (TOTAL / FILLED / VACANT) ===== */}
    <Grid container spacing={2} mt={1}>
      {teachingStaffSummaryFields
        .filter(
          (field) =>
            field.name === "total" ||
            field.name === "filled" ||
            field.name === "vacant"
        )
        .map((field) => (
          <Grid item xs={12} sm={4} key={field.name}>
            <TextField
              fullWidth
              size="small"
              type={field.type}
              label={field.label}
              value={row[field.name]}
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

  </Grid>
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
                    { post: "",
  name: "",
  dob: "",
  doj: "",
  email: "",
  contact: "",
  total: "",
  filled: "",
  vacant: ""
}                ])
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
  <Grid container spacing={2} mb={2} key={index}>

    {/* ===== FIRST ROW (DETAILS) ===== */}
    {nonTeachingStaffDetailFields
      .filter(
        (field) =>
          field.name !== "total" &&
          field.name !== "filled" &&
          field.name !== "vacant"
      )
      .map((field) => (
        <Grid item xs={12} sm={3} key={field.name}>
          <TextField
            fullWidth
            size="small"
            type={field.type}
            label={field.label}
            value={row[field.name]}
            onChange={(e) => {
              const updatedRows = [...nonTeachingRows];
              updatedRows[index][field.name] = e.target.value;
              setnonTeachingRows(updatedRows);
            }}
          />
        </Grid>
      ))}

    {/* ===== SECOND ROW (TOTAL / FILLED / VACANT) ===== */}
    <Grid container spacing={2} mt={1}>
      {nonTeachingStaffDetailFields
        .filter(
          (field) =>
            field.name === "total" ||
            field.name === "filled" ||
            field.name === "vacant"
        )
        .map((field) => (
          <Grid item xs={12} sm={4} key={field.name}>
            <TextField
              fullWidth
              size="small"
              type={field.type}
              label={field.label}
              value={row[field.name]}
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

  </Grid>
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
  post: "",
  name: "",
  dob: "",
  doj: "",
  email: "",
  contact: "",
  total: "",
  filled: "",
  vacant: ""
}
                  ])
                }
              >
        + Add Post
      </Button>
    </Box>
  </Grid>
</Grid>
           
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
            {watch("emrsImage") && (
              <Grid item xs={12} md={4}>
                <img
                  src={URL.createObjectURL(watch("emrsImage"))}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : null
                  }
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Grid>


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

        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EMRSForm;