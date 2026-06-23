import React from "react";
import { Grid, Typography, TextField, MenuItem, Box,
         Button, Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, Paper } from "@mui/material";
import { Controller } from "react-hook-form";
const AUTO_FILLED_FIELDS = {
  
  "Hostel Capacity": "240"
};


export default function HostelDetails({
  control,
  watch,
  messData,
  setMessData,
  addItem,
  removeItem,
  handleItemChange,
  calculateGrandTotal,
}) {
   
  
  return (
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
                       defaultValue="240"
                       rules={{
                         min: {
                           value: 0,
                           message: "Capacity cannot be negative",
                         },
                       }}
                       render={({ field, fieldState: { error } }) => (
                         <TextField
                           {...field}
                           label="Hostel Capacity"
                           type="number"
                           fullWidth
                           size="small"
                           InputProps={{
  readOnly: true,
}}
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
                           label="Warden Name"
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
                           label="Warden Contact"
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
                           label="Warden Email"
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
                       defaultValue="240"
                       rules={{
                         min: {
                           value: 0,
                           message: "Capacity cannot be negative",
                         },
                       }}
                       render={({ field, fieldState: { error } }) => (
                         <TextField
                           {...field}
                           label="Hostel Capacity"
                           type="number"
                           fullWidth
                           size="small"
                           InputProps={{
  readOnly: true,
}}
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
                           label="Warden Name"
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
                           label="Warden Contact"
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
                           label="Warden Email"
                           fullWidth
                           size="small"
                         />
                       )}
                     />
                   </Grid>
                 </Grid>
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
                  
                  
{/* ================= MENU CHART ================= */}
<Typography
  variant="subtitle1"
  sx={{ fontWeight: 700, color: "#d97706", mb: 2, mt: 4 }}
>
  📋 Food Menu for Students (As per NEST Guideline)
</Typography>

<TableContainer component={Paper}>
  <Table size="small">
    <TableHead sx={{ background: "#f1f5f9" }}>
      <TableRow>
        <TableCell><b>Meal</b></TableCell>
        <TableCell><b>Items Served</b></TableCell>
        <TableCell><b>Timing</b></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {[
        {
          meal: "Pre-Breakfast",
          items: "Nuts (Almonds – 4 nuts per student), Tea & Biscuit",
          timing: "6:15 AM – 7:00 AM",
        },
        {
          meal: "Breakfast",
          items: "Puri/Sabji (Kabuli, Chanadal, Rajma), Rice, Suji/Upma, Poha, Milk, Boiled Egg, Bread with Butter/Jam, Tea, Juice, Honey, Fruits",
          timing: "8:55 AM – 9:30 AM",
        },
        {
          meal: "Lunch",
          items: "Rice/Roti with lentils and vegetables, Salad, Pickle, Rajma",
          timing: "1:40 PM – 3:00 PM",
        },
        {
          meal: "Evening Meal",
          items: "Noodles, Cake, Samosa, Kachori, Tea/Coffee, Pakoda",
          timing: "6:00 PM – 6:20 PM",
        },
        {
          meal: "Dinner",
          items: "Rice with lentils, Boiled Vegetable, Mixed Veg Fry/Curry, Fried Rice, Soup, Pickle. *Fish/Chicken/Egg curry on alternate days. *Paneer – one day a week.",
          timing: "8:00 PM – 8:45 PM",
        },
      ].map((row, index) => (
        <TableRow key={index}>
          <TableCell sx={{ fontWeight: 600 }}>{row.meal}</TableCell>
          <TableCell>{row.items}</TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>{row.timing}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>                   {/* ================= SUBSECTION 2 ================= */}
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
  
