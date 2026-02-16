import React, { useEffect } from "react";
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
  InputLabel
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const AssetForm = () => {
  const { control, handleSubmit, setValue, watch } = useForm({
  defaultValues: {
    state: "Assam",
  },
});

const startDate = watch("constructionStartDate");
const completionMonths = watch("timeOfCompletion");


  // ================= SUBMIT =================
  const onSubmit = (data) => {
    console.log("Form Data:", data);
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
        setValue("village", postOffice.Village);
        setValue("fullPostalAddress",
          `${postOffice.Village}, ${postOffice.Block}, ${postOffice.District}, ${postOffice.State} - ${pincode}`
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
    { name: "state", label: "State" },
    { name: "district", label: "District" },
    { name: "block", label: "Block" },
    { name: "village", label: "Village" },
    { name: "latitude", label: "Latitude", readOnly: true },
    { name: "longitude", label: "Longitude", readOnly: true },
    { name: "areaSize", label: "Area / Size (sq. m / acres)" },
  ];

  // ================= FINANCIAL FIELDS =================
  const schemeFields = [
    
       {name: "schemeName", label: "Name of the Scheme"},
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
       {name: "projectCost", label: "Project Cost (In Lakhs)", type: "number" },
       {name: "constructionCost", label: "Construction Cost(In Lakhs)", type: "number"},
       {name: "estimatedCost", label: "Estimated Cost(In Lakhs)", type: "number" },
       {name: "actualCost", label: "Actual Cost(In Lakhs)", type: "number" },
       {name: "contractValue", label: "Contract Value(In Lakhs)", type: "number"},
       {name: "workOrderNumber", label: "Work Order Number" },
       {name: "workOrderDate", label: "Work Order Date", type: "date" },
       {name: "timeOfCompletion", label: "Time of Completion (In Months)", type: "number"},
       {name: "pointOfContact", label: "Point of Contact" },
       { name: "constructionStartDate", label: "Construction Start Date", type: "date" },
       { name: "constructionEndDate", label: "Construction End Date", type: "date" },

       
  ];
  

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4,
      backgroundColor: "#f1f5f9",
    padding: 3,
    borderRadius: 3
     }}>
      {/* ===== Header ===== */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Asset Management
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create and manage asset details
      </Typography>

      <Card>
        <Box
  sx={{
    background: "linear-gradient(to right, #1976d2, #42a5f5)",
    padding: 2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  }}
>
  <Typography
    variant="h6"
    sx={{
      color: "#fff",
      fontWeight: 600,
      letterSpacing: 0.5
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
    borderBottomRightRadius: 16
  }}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
    mb: 2
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
            </Grid>

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
    mb: 2
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
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Pincode"
                      onChange={(e) => {
                        field.onChange(e);
                        onPincodeChange(e);
                      }}
                      fullWidth
                      size="small"
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
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={addressItem.label}
                        fullWidth
                        size="small"
                        disabled={addressItem?.readOnly}
                        InputProps={{ readOnly: addressItem?.readOnly }}
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
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Postal Address"
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>

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
    mb: 2
  }}
>
  Project Implementation Details
</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={4}>
              {/* Financial Fields */}
              {schemeFields.map((financeItem) => (
                <Grid item xs={12} sm={6} md={3} key={financeItem.name}>
                  <Controller
                    name={financeItem.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
  financeItem.type === "select" ? (

    <FormControl fullWidth size="small">
      <InputLabel>{financeItem.label}</InputLabel>
      <Select {...field} label={financeItem.label}>
        {financeItem.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  ) : (

    <TextField
      {...field}
      label={financeItem.label}
      type={financeItem.type || "text"}
      fullWidth
      size="small"
      InputLabelProps={
        financeItem.type === "date"
          ? { shrink: true }
          : {}
      }
    />

  )
)}

                  />
                </Grid>
              ))}
              
{/* Status */}
              <Grid item xs={12} sm={6} md={3} fullWidth>
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select {...field} labelId="status-label" id="status-select" label="Status">
                        <MenuItem value="Planned">Planned</MenuItem>
                        <MenuItem value="Work In Progress">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        
                      </Select>
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
      <TextField
        {...field}
        label="Completion %"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    )}
  />
</Grid>

              {/* Remarks */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="remarks"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Remarks"
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  height="100%"
                >
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssetForm;
