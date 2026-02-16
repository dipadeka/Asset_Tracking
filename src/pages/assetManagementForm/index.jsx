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
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      state: "Assam",
    },
  });

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
    { name: "wardNo", label: "Ward No" },
    { name: "latitude", label: "Latitude", readOnly: true },
    { name: "longitude", label: "Longitude", readOnly: true },
    { name: "areaSize", label: "Area / Size (sq. m / acres)" },
  ];

  // ================= FINANCIAL FIELDS =================
  const financialFields = [
    {
      name: "constructionCost",
      label: "Construction Cost (in Rs)",
      type: "number",
    },
    { name: "fundingSource", label: "Funding Source" },
    { name: "estimatedCost", label: "Estimated Cost", type: "number" },
    { name: "actualCost", label: "Actual Cost", type: "number" },
    { name: "pointOfContact", label: "Point of Contact" },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* ===== Header ===== */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Asset Management
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create and manage asset details
      </Typography>

      <Card>
        <CardHeader title="Asset Details Form" />
        <Divider />

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ================= BASIC DETAILS ROW ================= */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Financial Details
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={4}>
              {/* Date Fields */}
              {[
                { name: "sanctionDate", label: "Sanction Date" },
                {
                  name: "constructionStartDate",
                  label: "Construction Start Date",
                },
                { name: "constructionEndDate", label: "Construction End Date" },
              ].map((dateField) => (
                <Grid item xs={12} sm={6} md={3} key={dateField.name}>
                  <Controller
                    name={dateField.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dateField.label}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                      />
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
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status" fullWidth>
                        <MenuItem value="Planned">Planned</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Financial Fields */}
              {financialFields.map((financeItem) => (
                <Grid item xs={12} sm={6} md={3} key={financeItem.name}>
                  <Controller
                    name={financeItem.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={financeItem.label}
                        type={financeItem.type || "text"}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
              ))}

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
