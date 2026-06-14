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
  Divider,
  Container,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AssetForm = () => {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});

  let navigate;
  try {
    navigate = useNavigate();
  } catch (_) {
    navigate = null;
  }

  const STEPS = [
    { label: "Project Details",        icon: "📋" },
    { label: "Address Details",        icon: "📍" },
    { label: "Implementation Details", icon: "💰" },
    { label: "Asset Image",            icon: "🖼️" },
  ];

  // Fields belonging to each step — used for per-step validation
  const STEP_FIELDS = {
    0: ["assetId", "assetCode", "assetName", "projectName", "implementingAgency"],
    1: ["pincode", "district", "block", "gramPanchayat", "village", "latitude", "longitude", "areaSize", "fullPostalAddress"],
    2: [
      "schemeName", "fundingSource",
      "projectCost", "actualCost", "contractValue",
      "workOrderNumber", "workOrderDate",
      "timeOfCompletion", "constructionStartDate", "constructionEndDate",
      "pointOfContact", "status", "remarks",
    ],
    3: [],
  };

  const [costSubsections, setCostSubsections] = useState([
    { id: 1, category: "Construction Site", amount: "" },
    { id: 2, category: "Building",          amount: "" },
    { id: 3, category: "Road",              amount: "" },
    { id: 4, category: "Painting",          amount: "" },
  ]);
  const [otherPhotos, setOtherPhotos] = useState([]);
  const [costSubsectionErrors, setCostSubsectionErrors] = useState({});

  const addSubsection = () => {
    setCostSubsections(prev => [
      ...prev,
      { id: Date.now(), category: "", amount: "" },
    ]);
  };

  const removeSubsection = (id) => {
    setCostSubsections(prev => prev.filter(s => s.id !== id));
    setCostSubsectionErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const updateSubsection = (id, field, value) => {
    setCostSubsections(prev =>
      prev.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
    // Clear error for that field when user types
    setCostSubsectionErrors(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: "" },
    }));
  };

  const validateCostSubsections = () => {
    const errors = {};
    let valid = true;
    costSubsections.forEach(s => {
      const rowErrors = {};
      if (!s.category.trim()) { rowErrors.category = "Category is required"; valid = false; }
      if (s.amount === "" || s.amount === null) { rowErrors.amount = "Amount is required"; valid = false; }
      else if (Number(s.amount) < 0) { rowErrors.amount = "Amount must be ≥ 0"; valid = false; }
      if (Object.keys(rowErrors).length) errors[s.id] = rowErrors;
    });
    setCostSubsectionErrors(errors);
    return valid;
  };

  const { control, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      status: "",
      completionPercentage: "",
    },
  });

  const startDate        = watch("constructionStartDate");
  const completionMonths = watch("timeOfCompletion");
  const status           = watch("status");

  // ── Validate current step fields then advance ──
  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const valid = await trigger(fieldsToValidate);
    const subsValid = currentStep === 2 ? validateCostSubsections() : true;

    if (valid && subsValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ──
  const onSubmit = async (data) => {
    const subsValid = validateCostSubsections();
    if (!subsValid) return;

    setLoading(true);
    try {
      const toBase64 = (file) =>
        new Promise((res, rej) => {
          if (!file) return res(null);
          const reader = new FileReader();
          reader.onload  = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });

      const photoKeys = [
        "photoConstructionSite",
        "photoPriorConstruction",
        "photoBoundaryWall",
        "photoRoad",
        "photoSchoolBuilding1",
        "photoSchoolBuilding2",
      ];

      const photoBase64 = {};
      for (const key of photoKeys) {
        photoBase64[key] = await toBase64(data[key] || null);
      }

      const otherBase64 = await Promise.all(otherPhotos.map(toBase64));

      const payload = {
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        assetId:              data.assetId,
        assetName:            data.assetName,
        assetCode:            Number(data.assetCode),
        projectName:          data.projectName,
        implementingAgency:   data.implementingAgency,
        district:             data.district,
        block:                data.block,
        gramPanchayat:        data.gramPanchayat,
        village:              data.village,
        pincode:              data.pincode,
        fullPostalAddress:    data.fullPostalAddress,
        latitude:             Number(data.latitude),
        longitude:            Number(data.longitude),
        areaSize:             Number(data.areaSize),
        schemeName:           data.schemeName,
        fundingSource:        data.fundingSource,
        projectCost:          Number(data.projectCost),
        actualCost:           Number(data.actualCost),
        contractValue:        Number(data.contractValue),
        costBreakdown:        costSubsections,
        workOrderNumber:      data.workOrderNumber,
        workOrderDate:        data.workOrderDate,
        timeOfCompletion:     Number(data.timeOfCompletion),
        pointOfContact:       data.pointOfContact,
        constructionStartDate: data.constructionStartDate,
        constructionEndDate:   data.constructionEndDate,
        status:               data.status === "Work In Progress" ? "Ongoing" : data.status,
        completionPercentage: Number(data.completionPercentage || 0),
        remarks:              data.remarks,
        photos:               photoBase64,
        otherPhotos:          otherBase64,
      };

      const existing = JSON.parse(localStorage.getItem("submittedAssets") || "[]");
      existing.push(payload);
      localStorage.setItem("submittedAssets", JSON.stringify(existing));

      setSuccessOpen(true);
      setTimeout(() => {
        if (navigate) navigate("/asset/dashboard/applied/assets");
      }, 1500);

    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Failed to save asset ❌ — " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Pincode auto-fill ──
  const onPincodeChange = async (e) => {
    const pincode = e.target.value;
    if (pincode.length !== 6) return;
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === "Success") {
        const po = data[0].PostOffice[0];
        setValue("state",             po.State,    { shouldValidate: true });
        setValue("district",          po.District, { shouldValidate: true });
        setValue("block",             po.Block,    { shouldValidate: true });
        setValue("gramPanchayat",     po.gramPanchayat || "", { shouldValidate: true });
        setValue("village",           po.Village,  { shouldValidate: true });
        setValue("fullPostalAddress",
          `${po.Village}, ${po.Block}, ${po.District}, ${po.State} - ${pincode}`,
          { shouldValidate: true }
        );
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // ── Live location ──
  const getLiveLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setValue("latitude",  coords.latitude,  { shouldValidate: true });
        setValue("longitude", coords.longitude, { shouldValidate: true });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const gpsData = await exifr.gps(file);
      if (gpsData?.latitude && gpsData?.longitude) {
        setValue("latitude",  gpsData.latitude,  { shouldValidate: true });
        setValue("longitude", gpsData.longitude, { shouldValidate: true });
      }
      setValue("assetImage", file);
    } catch (error) {
      console.error("Error reading image metadata:", error);
    }
  };

  useEffect(() => { getLiveLocation(); }, []); // eslint-disable-line

  useEffect(() => {
    if (startDate && completionMonths) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + parseInt(completionMonths));
      setValue("constructionEndDate", d.toISOString().split("T")[0], { shouldValidate: true });
    }
  }, [startDate, completionMonths, setValue]);

  useEffect(() => {
    if (!status) return;
    const pct = status === "Planned" ? 0 : status === "Work In Progress" ? 50 : 100;
    setValue("completionPercentage", pct, { shouldValidate: true });
  }, [status, setValue]);

  // ── Validation rules ──
  const RULES = {
    assetId: {
      required: "Asset ID is required",
      maxLength: { value: 50, message: "Asset ID must be ≤ 50 characters" },
    },
    assetCode: {
      required: "Asset Code is required",
      pattern: { value: /^\d+$/, message: "Asset Code must be a positive integer" },
    },
    assetName: {
      required: "Asset Name is required",
      minLength: { value: 3, message: "Asset Name must be at least 3 characters" },
      maxLength: { value: 100, message: "Asset Name must be ≤ 100 characters" },
    },
    projectName: {
      required: "Project Name is required",
      minLength: { value: 3, message: "Project Name must be at least 3 characters" },
    },
    implementingAgency: {
      required: "Implementing Agency is required",
      minLength: { value: 2, message: "Implementing Agency must be at least 2 characters" },
    },
    pincode: {
      required: "Pincode is required",
      pattern: { value: /^\d{6}$/, message: "Pincode must be exactly 6 digits" },
    },
    district: { required: "District is required" },
    block: { required: "Block is required" },
    gramPanchayat: { required: "Gram Panchayat is required" },
    village: { required: "Village is required" },
    latitude: {
      required: "Latitude is required",
      min: { value: -90,  message: "Latitude must be between -90 and 90" },
      max: { value: 90,   message: "Latitude must be between -90 and 90" },
    },
    longitude: {
      required: "Longitude is required",
      min: { value: -180, message: "Longitude must be between -180 and 180" },
      max: { value: 180,  message: "Longitude must be between -180 and 180" },
    },
    areaSize: {
      required: "Area / Size is required",
      min: { value: 0.01, message: "Area must be greater than 0" },
    },
    fullPostalAddress: {
      required: "Full Postal Address is required",
      minLength: { value: 10, message: "Please enter a complete postal address" },
    },
    schemeName: {
      required: "Scheme Name is required",
      minLength: { value: 3, message: "Scheme Name must be at least 3 characters" },
    },
    fundingSource: { required: "Funding Source is required" },
    projectCost: {
      required: "Project Cost is required",
      min: { value: 0.01, message: "Project Cost must be greater than 0" },
    },
    actualCost: {
      required: "Actual Cost is required",
      min: { value: 0, message: "Actual Cost must be ≥ 0" },
    },
    contractValue: {
      required: "Contract Value is required",
      min: { value: 0.01, message: "Contract Value must be greater than 0" },
    },
    workOrderNumber: {
      required: "Work Order Number is required",
      pattern: { value: /^[A-Za-z0-9\-\/]+$/, message: "Only alphanumeric characters, hyphens, and slashes are allowed" },
    },
    workOrderDate: {
      required: "Work Order Date is required",
      validate: (v) => {
        const d = new Date(v);
        const today = new Date();
        today.setHours(0,0,0,0);
        return d <= today || "Work Order Date cannot be in the future";
      },
    },
    timeOfCompletion: {
      required: "Time of Completion is required",
      min: { value: 1,   message: "Completion time must be at least 1 month" },
      max: { value: 240, message: "Completion time cannot exceed 240 months (20 years)" },
      pattern: { value: /^\d+$/, message: "Must be a whole number" },
    },
    constructionStartDate: {
      required: "Construction Start Date is required",
    },
    constructionEndDate: {
      required: "Construction End Date is required",
      validate: (v, formValues) => {
        if (!formValues.constructionStartDate) return true;
        return new Date(v) > new Date(formValues.constructionStartDate) ||
          "End Date must be after Start Date";
      },
    },
    pointOfContact: {
      required: "Point of Contact is required",
      minLength: { value: 2, message: "Must be at least 2 characters" },
      maxLength: { value: 100, message: "Must be ≤ 100 characters" },
    },
    status: { required: "Status is required" },
    remarks: {
      required: "Remarks are required",
      minLength: { value: 5, message: "Remarks must be at least 5 characters" },
      maxLength: { value: 500, message: "Remarks must be ≤ 500 characters" },
    },
  };

  // ── Field configs ──
  const fields = [
    { name: "assetId",            label: "Asset ID" },
    { name: "assetCode",          label: "Asset Code" },
    { name: "assetName",          label: "Asset Name" },
    { name: "projectName",        label: "Project Name" },
    { name: "implementingAgency", label: "Implementing Agency" },
  ];

  const addressFields = [
    { name: "district",      label: "District" },
    { name: "block",         label: "Block" },
    { name: "gramPanchayat", label: "Gram Panchayat" },
    { name: "village",       label: "Village" },
    { name: "latitude",      label: "Latitude",  readOnly: true },
    { name: "longitude",     label: "Longitude", readOnly: true },
    { name: "areaSize",      label: "Area / Size (sq. m / acres)" },
  ];

  // ── Shared section header style ──
  const sectionLabelSx = {
    fontSize: 12, fontWeight: 700, color: "#64748b",
    mb: 1.5, textTransform: "uppercase", letterSpacing: 1,
  };

  const sectionBoxSx = {
    border: "1px solid #e2e8f0", borderRadius: 2,
    p: 2, mb: 3, background: "#fff",
  };

  return (
    <Container sx={{ pb: 4, backgroundColor: "#f1f5f9", padding: 0, borderRadius: 3 }}>
      {/* Success snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Asset Created Successfully ✅ — Redirecting to Assets list…
        </Alert>
      </Snackbar>

      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom pt={4}>
        Asset Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create and manage asset details
      </Typography>

      {/* Stepper */}
      <Box sx={{ overflowX: "auto", pb: 1, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 400 }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
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
                <Typography sx={{
                  fontSize: 10, mt: 0.5, fontWeight: i === currentStep ? 700 : 400,
                  color: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#94a3b8",
                  textAlign: "center", lineHeight: 1.2,
                }}>
                  {step.label}
                </Typography>
              </Box>
              {i < STEPS.length - 1 && (
                <Box sx={{
                  flex: 1, height: 3, mx: 0.5,
                  background: i < currentStep ? "#4caf50" : "#e2e8f0",
                  borderRadius: 2, transition: "background 0.3s", minWidth: 10,
                }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Card>
        <Box sx={{
          background: "linear-gradient(to right, #1976d2, #42a5f5)",
          padding: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16,
        }}>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>
            Asset Details Form
          </Typography>
        </Box>

        <Divider />

        <CardContent sx={{ backgroundColor: "#f8fafc", padding: 4, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}
          >

            {/* ========== STEP 0: PROJECT DETAILS ========== */}
            {currentStep === 0 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{
                      background: "linear-gradient(to right, #1976d2, #42a5f5)",
                      color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
                    }}>
                      Project Details
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={4}>
                  {fields.map((fieldItem) => (
                    <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
                      <Controller
                        name={fieldItem.name}
                        control={control}
                        defaultValue=""
                        rules={RULES[fieldItem.name]}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label={fieldItem.label}
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error ? error.message : ""}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* ========== STEP 1: ADDRESS DETAILS ========== */}
            {currentStep === 1 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{
                      background: "linear-gradient(to right, #1976d2, #42a5f5)",
                      color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
                    }}>
                      Address Details
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="pincode"
                      control={control}
                      defaultValue=""
                      rules={RULES.pincode}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Pincode"
                          onChange={(e) => { field.onChange(e); onPincodeChange(e); }}
                          fullWidth
                          size="small"
                          error={!!error}
                          helperText={error ? error.message : "Enter 6-digit pincode to auto-fill address"}
                          inputProps={{ maxLength: 6 }}
                        />
                      )}
                    />
                  </Grid>

                  {addressFields.map((addressItem) => (
                    <Grid item xs={12} sm={6} md={3} key={addressItem.name}>
                      <Controller
                        name={addressItem.name}
                        control={control}
                        defaultValue=""
                        rules={RULES[addressItem.name]}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label={addressItem.label}
                            fullWidth
                            size="small"
                            disabled={addressItem?.readOnly}
                            InputProps={{ readOnly: addressItem?.readOnly }}
                            error={!!error}
                            helperText={error ? error.message : ""}
                            type={["latitude", "longitude", "areaSize"].includes(addressItem.name) ? "number" : "text"}
                            inputProps={
                              addressItem.name === "latitude"  ? { min: -90,  max: 90,  step: "any" } :
                              addressItem.name === "longitude" ? { min: -180, max: 180, step: "any" } :
                              addressItem.name === "areaSize"  ? { min: 0,               step: "any" } :
                              {}
                            }
                          />
                        )}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Controller
                      name="fullPostalAddress"
                      control={control}
                      defaultValue=""
                      rules={RULES.fullPostalAddress}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Full Postal Address"
                          multiline
                          rows={3}
                          fullWidth
                          size="small"
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* ========== STEP 2: IMPLEMENTATION DETAILS ========== */}
            {currentStep === 2 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{
                      background: "linear-gradient(to right, #1976d2, #42a5f5)",
                      color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
                    }}>
                      Project Implementation Details
                    </Typography>
                  </Grid>
                </Grid>

                {/* Scheme & Funding */}
                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionLabelSx}>Scheme & Funding</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="schemeName"
                        control={control}
                        defaultValue=""
                        rules={RULES.schemeName}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Name of the Scheme"
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="fundingSource"
                        control={control}
                        defaultValue=""
                        rules={RULES.fundingSource}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth size="small" error={!!error}>
                            <InputLabel>Funding Source</InputLabel>
                            <Select {...field} label="Funding Source">
                              {["Article 275 Grant", "Central Sector Scheme", "Centrally Sponsored Scheme", "State Fund"].map(opt => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                              ))}
                            </Select>
                            {error && <FormHelperText>{error.message}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Cost Details */}
                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionLabelSx}>Cost Details</Typography>
                  <Grid container spacing={2} mb={2}>
                    {[
                      { name: "projectCost",   label: "Project Cost (In Lakhs)" },
                      { name: "actualCost",    label: "Actual Cost (In Lakhs)" },
                      { name: "contractValue", label: "Contract Value (In Lakhs)" },
                    ].map(({ name, label }) => (
                      <Grid item xs={12} sm={6} md={4} key={name}>
                        <Controller
                          name={name}
                          control={control}
                          defaultValue=""
                          rules={RULES[name]}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              label={label}
                              type="number"
                              fullWidth
                              size="small"
                              error={!!error}
                              helperText={error?.message}
                              inputProps={{ min: 0, step: "any" }}
                              onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                              onChange={(e) => { if (Number(e.target.value) >= 0) field.onChange(e); }}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Cost Breakdown */}
                  <Box sx={{ border: "1.5px dashed #90caf9", borderRadius: 2, p: 2, background: "#f0f7ff" }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                      <Typography sx={{ fontWeight: 700, color: "#1976d2", fontSize: 13 }}>
                        📦 Project Cost Breakdown
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={addSubsection}
                        sx={{ background: "linear-gradient(to right,#1976d2,#42a5f5)", fontSize: 12 }}
                      >
                        + Add Category
                      </Button>
                    </Box>
                    <Grid container spacing={1.5}>
                      {costSubsections.map((section) => (
                        <Grid item xs={12} sm={6} md={3} key={section.id}>
                          <Box sx={{ background: "#fff", borderRadius: 2, p: 1.5, border: "1px solid #e2e8f0" }}>
                            <TextField
                              label="Category"
                              value={section.category}
                              onChange={(e) => updateSubsection(section.id, "category", e.target.value)}
                              fullWidth
                              size="small"
                              sx={{ mb: 1 }}
                              error={!!costSubsectionErrors[section.id]?.category}
                              helperText={costSubsectionErrors[section.id]?.category || ""}
                            />
                            <TextField
                              label="Amount (In Lakhs)"
                              type="number"
                              value={section.amount}
                              onChange={(e) => {
                                if (Number(e.target.value) >= 0) updateSubsection(section.id, "amount", e.target.value);
                              }}
                              fullWidth
                              size="small"
                              inputProps={{ min: 0, step: "any" }}
                              onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                              error={!!costSubsectionErrors[section.id]?.amount}
                              helperText={costSubsectionErrors[section.id]?.amount || ""}
                            />
                            <Box display="flex" justifyContent="flex-end" mt={0.5}>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => removeSubsection(section.id)}
                                sx={{ fontSize: 11 }}
                              >
                                ✕ Remove
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>

                {/* Work Order */}
                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionLabelSx}>Work Order</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="workOrderNumber"
                        control={control}
                        defaultValue=""
                        rules={RULES.workOrderNumber}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Work Order Number"
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="workOrderDate"
                        control={control}
                        defaultValue=""
                        rules={RULES.workOrderDate}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Work Order Date"
                            type="date"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: new Date().toISOString().split("T")[0] }}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Timeline */}
                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionLabelSx}>Timeline</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="timeOfCompletion"
                        control={control}
                        defaultValue=""
                        rules={RULES.timeOfCompletion}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Time of Completion (In Months)"
                            type="number"
                            fullWidth
                            size="small"
                            inputProps={{ min: 1, max: 240 }}
                            onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault(); }}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="constructionStartDate"
                        control={control}
                        defaultValue=""
                        rules={RULES.constructionStartDate}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Construction Start Date"
                            type="date"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="constructionEndDate"
                        control={control}
                        defaultValue=""
                        rules={RULES.constructionEndDate}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Construction End Date"
                            type="date"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!error}
                            helperText={error?.message || "Auto-calculated from Start Date + Completion Months"}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Status & Contact */}
                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionLabelSx}>Status & Contact</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name="pointOfContact"
                        control={control}
                        defaultValue=""
                        rules={RULES.pointOfContact}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Point of Contact"
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        rules={RULES.status}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth size="small" error={!!error}>
                            <InputLabel>Status</InputLabel>
                            <Select
                              {...field}
                              label="Status"
                              sx={{
                                background:
                                  field.value === "Completed" ? "#dcfce7" :
                                  field.value === "Work In Progress" ? "#fef3c7" : "#f1f5f9",
                                fontWeight: 600,
                                color:
                                  field.value === "Completed" ? "#16a34a" :
                                  field.value === "Work In Progress" ? "#d97706" : "#64748b",
                              }}
                            >
                              <MenuItem value="Planned">⏳ Planned</MenuItem>
                              <MenuItem value="Work In Progress">🔄 Work In Progress</MenuItem>
                              <MenuItem value="Completed">✅ Completed</MenuItem>
                            </Select>
                            {error && <FormHelperText>{error.message}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name="completionPercentage"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Completion % is required",
                          min: { value: 0,   message: "Must be between 0 and 100" },
                          max: { value: 100, message: "Must be between 0 and 100" },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Box>
                            <TextField
                              {...field}
                              label="Completion %"
                              fullWidth
                              size="small"
                              type="number"
                              inputProps={{ min: 0, max: 100 }}
                              error={!!error}
                              helperText={error?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  background:
                                    Number(field.value) === 100 ? "#dcfce7" :
                                    Number(field.value) >= 50  ? "#fef3c7" : "#f8fafc",
                                },
                                "& input": {
                                  fontWeight: 800,
                                  color:
                                    Number(field.value) === 100 ? "#16a34a" :
                                    Number(field.value) >= 50  ? "#d97706" : "#64748b",
                                },
                              }}
                            />
                            {status && (
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ height: 10, borderRadius: 5, background: "#e2e8f0", overflow: "hidden" }}>
                                  <Box sx={{
                                    height: "100%", width: `${field.value || 0}%`, borderRadius: 5,
                                    transition: "width 0.5s ease",
                                    background:
                                      Number(field.value) === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" :
                                      Number(field.value) >= 50  ? "linear-gradient(90deg,#fbbf24,#d97706)" :
                                      "#cbd5e1",
                                  }} />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                  <Typography sx={{
                                    fontSize: 11, fontWeight: 700, px: 1.5, py: 0.3, borderRadius: 10,
                                    background:
                                      status === "Completed"       ? "#dcfce7" :
                                      status === "Work In Progress" ? "#fef3c7" : "#f1f5f9",
                                    color:
                                      status === "Completed"       ? "#16a34a" :
                                      status === "Work In Progress" ? "#d97706" : "#64748b",
                                  }}>
                                    {status === "Completed" ? "✅ Completed" : status === "Work In Progress" ? "🔄 In Progress" : "⏳ Planned"}
                                  </Typography>
                                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: Number(field.value) === 100 ? "#16a34a" : "#64748b" }}>
                                    {field.value || 0}%
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="remarks"
                        control={control}
                        defaultValue=""
                        rules={RULES.remarks}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Remarks"
                            multiline
                            rows={2}
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message || `${(field.value || "").length}/500`}
                            inputProps={{ maxLength: 500 }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {/* ========== STEP 3: ASSET IMAGE ========== */}
            {currentStep === 3 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{
                      background: "linear-gradient(to right, #1976d2, #42a5f5)",
                      color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
                    }}>
                      Asset Image
                    </Typography>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mb: 2 }}>
                  Photos are optional but recommended. Accepted formats: JPG, PNG, WEBP. Max 10 MB per file.
                </Alert>

                <Grid container spacing={3}>
                  {[
                    { key: "photoConstructionSite",  label: "Photo 1 – Construction Site" },
                    { key: "photoPriorConstruction",  label: "Photo 2 – Prior to Construction" },
                    { key: "photoBoundaryWall",        label: "Photo 3 – Boundary Wall" },
                    { key: "photoRoad",                label: "Photo 4 – Road" },
                    { key: "photoSchoolBuilding1",     label: "Photo 5 – School Building" },
                    { key: "photoSchoolBuilding2",     label: "Photo 6 – School Building (2)" },
                    { key: "photoOthers", label: "Photo 7 – Others", multiple: true },
                  ].map(({ key, label, multiple }) => {
                    const file = watch(key);

                    const validateFile = (f) => {
                      if (!f) return true; // optional
                      const validTypes = ["image/jpeg", "image/png", "image/webp"];
                      if (!validTypes.includes(f.type)) return "Only JPG, PNG, or WEBP images are allowed";
                      if (f.size > 10 * 1024 * 1024) return "File size must be ≤ 10 MB";
                      return true;
                    };

                    return (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Box sx={{
                          border: "1.5px dashed #90caf9", borderRadius: 2, p: 2,
                          background: "#f0f7ff", textAlign: "center", minHeight: 180,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", gap: 1,
                        }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1976d2", mb: 1 }}>
                            {label}
                          </Typography>

                          {multiple ? (
                            <>
                              {otherPhotos.length > 0 && (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1, justifyContent: "center" }}>
                                  {otherPhotos.map((f, idx) => (
                                    <Box key={idx} sx={{ position: "relative" }}>
                                      <img
                                        src={URL.createObjectURL(f)}
                                        alt={`other-${idx}`}
                                        style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6 }}
                                      />
                                      <Box
                                        onClick={() => setOtherPhotos(prev => prev.filter((_, i) => i !== idx))}
                                        sx={{
                                          position: "absolute", top: -6, right: -6,
                                          background: "#ef4444", color: "#fff", borderRadius: "50%",
                                          width: 18, height: 18, fontSize: 11,
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          cursor: "pointer", fontWeight: 700,
                                        }}
                                      >✕</Box>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                              <Typography sx={{ fontSize: 28 }}>📷</Typography>
                              <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                                <Button size="small" variant="contained" component="label"
                                  sx={{ fontSize: 11, background: "linear-gradient(to right,#1976d2,#42a5f5)" }}>
                                  + Capture
                                  <input
                                    type="file" hidden accept="image/jpeg,image/png,image/webp" capture="environment"
                                    onChange={(e) => {
                                      const f = e.target.files[0];
                                      if (!f) return;
                                      const err = validateFile(f);
                                      if (err !== true) { alert(err); return; }
                                      setOtherPhotos(prev => [...prev, f]);
                                    }}
                                  />
                                </Button>
                                <Button size="small" variant="outlined" component="label" sx={{ fontSize: 11 }}>
                                  + Upload
                                  <input
                                    type="file" hidden accept="image/jpeg,image/png,image/webp" multiple
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files);
                                      const invalid = files.find(f => validateFile(f) !== true);
                                      if (invalid) { alert(validateFile(invalid)); return; }
                                      setOtherPhotos(prev => [...prev, ...files]);
                                    }}
                                  />
                                </Button>
                              </Box>
                              {otherPhotos.length > 0 && (
                                <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5 }}>
                                  {otherPhotos.length} photo{otherPhotos.length > 1 ? "s" : ""} added
                                </Typography>
                              )}
                            </>
                          ) : (
                            <Controller
                              name={key}
                              control={control}
                              defaultValue={null}
                              rules={{ validate: validateFile }}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  {field.value ? (
                                    <>
                                      <img
                                        src={URL.createObjectURL(field.value)}
                                        alt={label}
                                        style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 6 }}
                                      />
                                      <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                                        {field.value.name} ({(field.value.size / 1024 / 1024).toFixed(2)} MB)
                                      </Typography>
                                      <Box display="flex" gap={1} mt={0.5}>
                                        <Button size="small" variant="outlined" component="label" sx={{ fontSize: 11 }}>
                                          Change
                                          <input
                                            type="file" hidden accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => {
                                              const f = e.target.files[0];
                                              if (!f) return;
                                              const err = validateFile(f);
                                              if (err !== true) { alert(err); return; }
                                              setValue(key, f, { shouldValidate: true });
                                            }}
                                          />
                                        </Button>
                                        <Button size="small" variant="outlined" color="error" sx={{ fontSize: 11 }}
                                          onClick={() => setValue(key, null, { shouldValidate: true })}>
                                          Remove
                                        </Button>
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <Typography sx={{ fontSize: 28 }}>📷</Typography>
                                      <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                                        <Button size="small" variant="contained" component="label"
                                          sx={{ fontSize: 11, background: "linear-gradient(to right,#1976d2,#42a5f5)" }}>
                                          Capture
                                          <input
                                            type="file" hidden accept="image/jpeg,image/png,image/webp" capture="environment"
                                            onChange={(e) => {
                                              const f = e.target.files[0];
                                              if (!f) return;
                                              const err = validateFile(f);
                                              if (err !== true) { alert(err); return; }
                                              setValue(key, f, { shouldValidate: true });
                                            }}
                                          />
                                        </Button>
                                        <Button size="small" variant="outlined" component="label" sx={{ fontSize: 11 }}>
                                          Upload
                                          <input
                                            type="file" hidden accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => {
                                              const f = e.target.files[0];
                                              if (!f) return;
                                              const err = validateFile(f);
                                              if (err !== true) { alert(err); return; }
                                              setValue(key, f, { shouldValidate: true });
                                            }}
                                          />
                                        </Button>
                                      </Box>
                                    </>
                                  )}
                                  {error && (
                                    <Typography sx={{ fontSize: 11, color: "#ef4444", mt: 0.5 }}>
                                      {error.message}
                                    </Typography>
                                  )}
                                </>
                              )}
                            />
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Submit */}
                <Grid item xs={12} mt={3}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}
                      sx={{ minWidth: 150, background: "linear-gradient(to right,#1976d2,#42a5f5)" }}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </Grid>
              </>
            )}

            {/* Navigation Buttons */}
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
              <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                Step {currentStep + 1} of {STEPS.length}
              </Typography>
              {currentStep < STEPS.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ minWidth: 150, background: "linear-gradient(to right, #1976d2, #42a5f5)" }}
                >
                  Save & Next →
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Image dialog */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Select Image Option</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Button variant="outlined" component="label">
            📷 Capture Photo
            <input
              type="file" hidden accept="image/jpeg,image/png,image/webp" capture="environment"
              onChange={(e) => { handleImageUpload(e.target.files[0]); setOpenImageDialog(false); }}
            />
          </Button>
          <Button variant="outlined" component="label">
            🖼 Upload From Device
            <input
              type="file" hidden accept="image/jpeg,image/png,image/webp"
              onChange={(e) => { handleImageUpload(e.target.files[0]); setOpenImageDialog(false); }}
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

export default AssetForm;