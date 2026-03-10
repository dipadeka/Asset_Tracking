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

const AssetForm = () => {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

const STEPS = [
  { label: "Project Details",        icon: "📋" },
  { label: "Address Details",        icon: "📍" },
  { label: "Implementation Details", icon: "💰" },
  { label: "Asset Image",            icon: "🖼️" },
];

const handleNext = () => {
  setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleBack = () => {
  setCurrentStep(prev => Math.max(prev - 1, 0));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      status: "",
      completionPercentage: "",
    },
  });

  const startDate = watch("constructionStartDate");
  const completionMonths = watch("timeOfCompletion");
  const endDate = watch("constructionEndDate");
  const status = watch("status");

  // ================= SUBMIT =================
  const onSubmit = async (data) => {
    setLoading(true); // 🔴 START LOADER
    console.log("Form Data:", data);
    try {
      const payload = {
        assetId: data.assetId,
        assetname: data.assetName, // mapped
        assetCode: Number(data.assetCode),
        projectName: data.projectName,
        ImplementingAgency: data.implementingAgency, // mapped
        district: data.district,
        block: data.block,
        gramPanchayat: data.gramPanchayat,
        village: data.village,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        areaSize: Number(data.areaSize),
        schemeName: data.schemeName,
        fundingSource: data.fundingSource,
        estimatedCost: Number(data.estimatedCost),
        actualCost: Number(data.actualCost),
        contractvalue: Number(data.contractValue), // mapped
        workorderNumber: data.workOrderNumber,
        workorderDate: data.workOrderDate,
        timeofcompletion: Number(data.timeOfCompletion),
        pointofcontact: data.pointOfContact,
        constructionStartDate: data.constructionStartDate,
        constructionEndDate: data.constructionEndDate,
        status: data.status === "Work In Progress" ? "Ongoing" : data.status,
        completionPercentage: Number(data.completionPercentage || 0),
        remarks: data.remarks,
      };

      const response = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      alert("Asset Created Successfully ✅");
      console.log(result);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create asset ❌");
    } finally {
      setLoading(false); // 🔴 STOP LOADER
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
        setValue(
          "fullPostalAddress",
          `${postOffice.Village}, ${postOffice.gramPanchayat} ${postOffice.Block}, ${postOffice.District}, ${postOffice.State} - ${pincode}`,
        );
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // ================== To fetch live location for  lang and long =======================
  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setValue("latitude", latitude);
        setValue("longitude", longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to fetch location. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const gpsData = await exifr.gps(file);

      if (gpsData?.latitude && gpsData?.longitude) {
        setValue("latitude", gpsData.latitude);
        setValue("longitude", gpsData.longitude);
        alert("Location extracted from image!");
      } else {
        alert("No GPS data found in the image.");
      }

      setValue("assetImage", file);
    } catch (error) {
      console.error("Error reading image metadata:", error);
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    if (startDate && completionMonths) {
      const start = new Date(startDate);
      // Add months
      start.setMonth(start.getMonth() + parseInt(completionMonths));

      const formattedDate = start.toISOString().split("T")[0];

      setValue("constructionEndDate", formattedDate);
    }
  }, [startDate, completionMonths, setValue]);

  useEffect(() => {
    if (!status) return;

    let percentage = 0;

    if (status === "Planned") {
      percentage = 0;
    } else if (status === "Work In Progress") {
      percentage = 50;
    } else if (status === "Completed") {
      percentage = 100;
    }

    setValue("completionPercentage", percentage);
  }, [status, setValue]);

  // ================= BASIC FIELDS =================
  const fields = [
    { name: "assetId", label: "Asset Id" },
    { name: "assetCode", label: "Asset Code" },
    { name: "assetName", label: "Asset Name" },
    // { name: "categoryId", label: "Category Id" },
    { name: "projectName", label: "Project Name" },
    { name: "implementingAgency", label: "Implementing Agency" },
  ];

  // ================= ADDRESS FIELDS =================
  const addressFields = [
    { name: "district", label: "District" },
    { name: "block", label: "Block" },
    { name: "gramPanchayat", label: "Gram Panchayat" },
    { name: "village", label: "Village" },
    { name: "latitude", label: "Latitude", readOnly: true },
    { name: "longitude", label: "Longitude", readOnly: true },
    { name: "areaSize", label: "Area / Size (sq. m / acres)" },
  ];

  // ================= FINANCIAL FIELDS =================
  const finencialFields = [
    { name: "schemeName", label: "Name of the Scheme" },
    {
      name: "fundingSource",
      label: "Funding Source",
      type: "select",
      options: [
        "Article 275 Grant",
        "Central Sector Scheme",
        "Centrally Sponsored Scheme",
        "State Fund",
      ],
    },
    { name: "projectCost", label: "Project Cost (In Lakhs)", type: "number" },
    {
      name: "constructionCost",
      label: "Construction Cost(In Lakhs)",
      type: "number",
    },
    {
      name: "estimatedCost",
      label: "Estimated Cost(In Lakhs)",
      type: "number",
    },
    { name: "actualCost", label: "Actual Cost(In Lakhs)", type: "number" },
    {
      name: "contractValue",
      label: "Contract Value(In Lakhs)",
      type: "number",
    },
    { name: "workOrderNumber", label: "Work Order Number" },
    { name: "workOrderDate", label: "Work Order Date", type: "date" },
    {
      name: "timeOfCompletion",
      label: "Time of Completion (In Months)",
      type: "number",
    },
    { name: "pointOfContact", label: "Point of Contact" },
    {
      name: "constructionStartDate",
      label: "Construction Start Date",
      type: "date",
    },
    {
      name: "constructionEndDate",
      label: "Construction End Date",
      type: "date",
    },
  ];

  return (
    <Container
      sx={{
        pb: 4,
        backgroundColor: "#f1f5f9",
        padding: 0,
        borderRadius: 3,
      }}
    >
      {/* ===== Header ===== */}
      <Typography variant="h4" fontWeight="bold" gutterBottom pt={4}>
        Asset Management
      </Typography>


      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create and manage asset details
      </Typography>

      {/* ===== STEPPER ===== */}
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
            Asset Details Form
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
            {/* ================= BASIC DETAILS ROW ================= */}
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
                    rules={{ required: `${fieldItem.label} is required` }}
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
            </>)}
{currentStep === 1 && (<>
            {/* ================= ADDRESS DETAILS SECTION ================= */}
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
                  Address Details
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
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
                      onChange={(e) => {
                        field.onChange(e);
                        onPincodeChange(e);
                      }}
                      fullWidth
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              {/* Address Fields */}
              {addressFields.map((addressItem) => (
                <Grid item xs={12} sm={6} md={3} key={addressItem.name}>
                  <Controller
                    name={addressItem.name}
                    control={control}
                    defaultValue=""
                    rules={{ required: `${addressItem.label} is required` }}
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
                      />
                    )}
                  />
                </Grid>
              ))}

              {/* Full Address */}
              <Grid item xs={12}>
                <Controller
                  name="fullPostalAddress"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Full Postal Address is required" }}
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
</>)}
{currentStep === 2 && (<>
            {/* ================= PROJECT / FINANCIAL SECTION ================= */}

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
                  Project Implementation Details
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={4}>
              {/* Financial Fields */}
              {finencialFields.map((financeItem) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={financeItem.name}>
                  <Controller
                    name={financeItem.name}
                    control={control}
                    defaultValue=""
                    rules={{ required: `${financeItem.label} is required` }}
                    render={({ field, fieldState: { error } }) =>
                      financeItem.type === "select" ? (
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!error}
                          sx={{ minWidth: 220 }}
                        >
                          <InputLabel>{financeItem.label}</InputLabel>
                          <Select {...field} label={financeItem.label}>
                            {financeItem.options.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          <Typography variant="caption" color="error">
                            {error?.message}
                          </Typography>
                        </FormControl>
                      ) : (
                        <TextField
                          {...field}
                          label={financeItem.label}
                          type={financeItem.type || "text"}
                          fullWidth
                          size="small"
                          InputLabelProps={
                            financeItem.type === "date" ? { shrink: true } : {}
                          }
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }
                  />
                </Grid>
              ))}

          
              {/* Status */}
<Grid item xs={12} sm={6} md={3}>
  <Controller
    name="status"
    control={control}
    defaultValue=""
    rules={{ required: "Status is required" }}
    render={({ field, fieldState: { error } }) => (
      <FormControl fullWidth size="small" error={!!error} sx={{ minWidth: 220 }}>
        <InputLabel>Status</InputLabel>
        <Select
          {...field}
          label="Status"
          sx={{
            background:
              field.value === "Completed"       ? "#dcfce7" :
              field.value === "Work In Progress" ? "#fef3c7" :
              field.value === "Planned"          ? "#f1f5f9" :
              "white",
            fontWeight: 600,
            color:
              field.value === "Completed"       ? "#16a34a" :
              field.value === "Work In Progress" ? "#d97706" :
              field.value === "Planned"          ? "#64748b" :
              "inherit",
          }}
        >
          <MenuItem value="Planned">⏳ Planned</MenuItem>
          <MenuItem value="Work In Progress">🔄 Work In Progress</MenuItem>
          <MenuItem value="Completed">✅ Completed</MenuItem>
        </Select>
        <Typography variant="caption" color="error">
          {error?.message}
        </Typography>
      </FormControl>
    )}
  />
</Grid>

              <Grid item xs={12} sm={6} md={3}>
  <Controller
    name="completionPercentage"
    control={control}
    defaultValue=""
    render={({ field }) => (
      <Box>
        {/* % Input */}
        <TextField
          {...field}
          label="Completion %"
          fullWidth
          size="small"
          InputProps={{ readOnly: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              background:
                Number(field.value) === 100 ? "#dcfce7" :
                Number(field.value) >= 50   ? "#fef3c7" :
                Number(field.value) > 0     ? "#eff6ff" :
                "#f8fafc",
            },
            "& input": {
              fontWeight: 800,
              color:
                Number(field.value) === 100 ? "#16a34a" :
                Number(field.value) >= 50   ? "#d97706" :
                Number(field.value) > 0     ? "#1d4ed8" :
                "#64748b",
            }
          }}
        />

        {/* Progress Bar — only shows when status is selected */}
        {status && (
          <Box sx={{ mt: 1 }}>

            {/* Bar Track */}
            <Box sx={{
              height: 10, borderRadius: 5,
              background: "#e2e8f0", overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}>
              <Box sx={{
                height: "100%",
                width: `${field.value || 0}%`,
                borderRadius: 5,
                transition: "width 0.5s ease",
                background:
                  Number(field.value) === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" :
                  Number(field.value) >= 50   ? "linear-gradient(90deg,#fbbf24,#d97706)" :
                  Number(field.value) > 0     ? "linear-gradient(90deg,#60a5fa,#1d4ed8)" :
                  "#cbd5e1",
                boxShadow:
                  Number(field.value) === 100 ? "0 0 8px #22c55e80" :
                  Number(field.value) >= 50   ? "0 0 8px #fbbf2480" :
                  "none"
              }} />
            </Box>

            {/* Badge + % label */}
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5
            }}>
              <Typography sx={{
                fontSize: 11, fontWeight: 700,
                px: 1.5, py: 0.3, borderRadius: 10,
                background:
                  status === "Completed"        ? "#dcfce7" :
                  status === "Work In Progress"  ? "#fef3c7" :
                  "#f1f5f9",
                color:
                  status === "Completed"        ? "#16a34a" :
                  status === "Work In Progress"  ? "#d97706" :
                  "#64748b",
                border: `1px solid ${
                  status === "Completed"        ? "#86efac" :
                  status === "Work In Progress"  ? "#fcd34d" :
                  "#e2e8f0"}`
              }}>
                {status === "Completed"        ? "✅ Completed" :
                 status === "Work In Progress"  ? "🔄 In Progress" :
                 "⏳ Planned"}
              </Typography>

              <Typography sx={{
                fontSize: 16, fontWeight: 800,
                color:
                  Number(field.value) === 100 ? "#16a34a" :
                  Number(field.value) >= 50   ? "#d97706" :
                  "#64748b"
              }}>
                {field.value || 0}%
              </Typography>
            </Box>

            {/* Helper text */}
            <Typography sx={{
              fontSize: 11, color: "#94a3b8",
              fontStyle: "italic", mt: 0.5
            }}>
              {status === "Completed"        && "✅ Project fully completed"}
              {status === "Work In Progress"  && "🔄 50% auto-set — edit if needed"}
              {status === "Planned"           && "📋 Work has not begun yet"}
            </Typography>

          </Box>
        )}
      </Box>
    )}
  />
</Grid>

              {/* Remarks */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="remarks"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Remarks is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Remarks"
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
            </>)}
{currentStep === 3 && (<>
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
                  Asset Image
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setOpenImageDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Add Photo
                </Button>
              </Grid>
            </Grid>

            {/* Preview */}
            {watch("assetImage") && (
              <Grid item xs={12} md={4}>
                <img
                  src={URL.createObjectURL(watch("assetImage"))}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
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
      sx={{ minWidth: 150, background: "linear-gradient(to right, #1976d2, #42a5f5)" }}
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

        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssetForm;
