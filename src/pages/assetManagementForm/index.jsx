import React from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const AssetForm = () => {
  const { control, handleSubmit, setValue} = useForm({
    defaultValues: {
      State: "Assam",
    
    }
  });

  const onPincodeChange = async(e) => {
    const pincode = e.target.value;
    if(pincode.length !== 6) return; 

    try{
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if(data[0].Status === "Success"){
        const postOffice = data[0].PostOffice[0];
        setValue('state', postOffice.State);
        setValue('district', postOffice.District);
        setValue('block', postOffice.Block);
      }
    }
    catch(error){
      console.error("Error fetching location data:", error);
    } 

  };

  
  const fields = [
    { name: "assetId", label: "Asset Id" },
    { name: "assetCode", label: "Asset Code" },
    { name: "assetName", label: "Asset Name" },
    { name: "categoryId", label: "Category Id" },
    { name: "projectName", label: "Project Name" },
    { name: "implementingAgency", label: "Implementing Agency" },
    { name: "state", label: "State" },
    { name: "district", label: "District" },
    { name: "block", label: "Block" },
    { name: "village", label: "Village" },
    { name: "wardNo", label: "Ward No" },
    { name: "latitude", label: "Latitude" },
    { name: "longitude", label: "Longitude" },
    { name: "areaSize", label: "Area / Size (sq. m / acres)" },
    { name: "constructionCost", label: "Construction Cost (in Rs)", type: "number" },
    { name: "fundingSource", label: "Funding Source" },
    { name: "estimatedCost", label: "Estimated Cost", type: "number" },
    { name: "actualCost", label: "Actual Cost", type: "number" },
    { name: "pointOfContact", label: "Point of Contact" },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

      {/* ===== Page Header ===== */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Asset Management
      </Typography>



      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create and manage asset details
      </Typography>

      {/* ===== Card Wrapper ===== */}
      <Card elevation={3}>
        <CardHeader title="Asset Details Form" />
        <Divider />

        <CardContent>
          <form onSubmit={handleSubmit(onPincodeChange)}>
            <Grid container spacing={2}>
<Grid item xs={12} sm={6} md={3} >
                  <Controller
                    name="pincode"
                    control={control}
                    defaultValue=""
                    render={({  }) => (
                      <TextField
                        label="Pincode"
                        onChange={onPincodeChange}
                        type= "text"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
              {/* 4 Columns Layout */}
              {fields.map((fieldItem) => (
                <Grid item xs={12} sm={6} md={3} key={fieldItem.name}>
                  <Controller
                    name={fieldItem.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={fieldItem.label}
                        type={fieldItem.type || "text"}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
              ))}

              {/* Full Address - Full Row */}
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

              {/* Date Fields */}
              {[
                { name: "sanctionDate", label: "Sanction Date" },
                { name: "constructionStartDate", label: "Construction Start Date" },
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

              {/* Status Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Status"
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="Planned">Planned</MenuItem>
                      <MenuItem value="Ongoing">Ongoing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* Remarks - Full Row */}
              <Grid item xs={12}>
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

              {/* ===== Separate Submit Row ===== */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                  >
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
