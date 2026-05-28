import React from "react";
import { Grid, Typography, TextField, MenuItem, Box,
         Button, Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, Paper } from "@mui/material";
import { Controller } from "react-hook-form";

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
                       defaultValue=""
                       rules={{
                         min: {
                           value: 0,
                           message: "Capacity cannot be negative",
                         },
                       }}
                       render={({ field, fieldState: { error } }) => (
                         <TextField
                           {...field}
                           label="Boys Hostel Capacity"
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
                           label="Boys Warden Name"
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
                           label="Boys Warden Contact"
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
                           label="Boys Warden Email"
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
                       defaultValue=""
                       rules={{
                         min: {
                           value: 0,
                           message: "Capacity cannot be negative",
                         },
                       }}
                       render={({ field, fieldState: { error } }) => (
                         <TextField
                           {...field}
                           label="Girls Hostel Capacity"
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
                           label="Girls Warden Name"
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
                           label="Girls Warden Contact"
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
                           label="Girls Warden Email"
                           fullWidth
                           size="small"
                         />
                       )}
                     />
                   </Grid>
                 </Grid>
                 {/* ================= MESS DETAILS ================= */}
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
                   {/* ================= SUBSECTION 1 ================= */}
                   <Typography sx={{ fontWeight: 600, color: "#16a34a", mb: 2 }}>
                     🧾 Mess Expenditure Details
                   </Typography>
 
                   <Grid container spacing={2}>
                     <Grid item xs={12} md={2}>
                       <TextField
                         select
                         fullWidth
                         size="small"
                         label="Mess Year"
                         value={messData.year}
                         onChange={(e) =>
                           setMessData({ ...messData, year: e.target.value })
                         }
                       >
                         {["2024", "2025", "2026"].map((y) => (
                           <MenuItem key={y} value={y}>
                             {y}
                           </MenuItem>
                         ))}
                       </TextField>
                     </Grid>
 
                     <Grid item xs={12} md={2}>
                       <TextField
                         select
                         fullWidth
                         size="small"
                         label="Mess Month"
                         value={messData.month}
                         onChange={(e) =>
                           setMessData({ ...messData, month: e.target.value })
                         }
                       >
                         {[
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
                           "December",
                         ].map((m) => (
                           <MenuItem key={m} value={m}>
                             {m}
                           </MenuItem>
                         ))}
                       </TextField>
                     </Grid>
 
                     <Grid item xs={12} md={2}>
                       <TextField
                         type="date"
                         fullWidth
                         size="small"
                         label="Purchase Date"
                         InputLabelProps={{ shrink: true }}
                         value={messData.purchaseDate}
                         onChange={(e) =>
                           setMessData({
                             ...messData,
                             purchaseDate: e.target.value,
                           })
                         }
                       />
                     </Grid>
 
                     <Grid item xs={12} md={3}>
                       <TextField
                         fullWidth
                         size="small"
                         label="Invoice/Bill No."
                         value={messData.billNo}
                         onChange={(e) =>
                           setMessData({ ...messData, billNo: e.target.value })
                         }
                       />
                     </Grid>
 
                     <Grid item xs={12} md={3}>
                       <TextField
                         select
                         fullWidth
                         size="small"
                         sx={{ minWidth: 220 }}
                         label="Payment Method"
                         value={messData.paymentMethod}
                         onChange={(e) =>
                           setMessData({
                             ...messData,
                             paymentMethod: e.target.value,
                           })
                         }
                       >
                         <MenuItem value="Cash">Cash</MenuItem>
                         <MenuItem value="Card">Card</MenuItem>
                         <MenuItem value="Online">Online</MenuItem>
                       </TextField>
                     </Grid>
                   </Grid>
 
                   {/* TABLE */}
                   <TableContainer component={Paper} sx={{ mt: 3 }}>
                     <Table size="small">
                       <TableHead sx={{ background: "#f1f5f9" }}>
                         <TableRow>
                           <TableCell>
                             <b>Category</b>
                           </TableCell>
                           <TableCell>
                             <b>Item</b>
                           </TableCell>
                           <TableCell>
                             <b>Quantity</b>
                           </TableCell>
                           <TableCell>
                             <b>Price (₹)</b>
                           </TableCell>
                           <TableCell>
                             <b>Total (₹)</b>
                           </TableCell>
                           <TableCell>
                             <b>Action</b>
                           </TableCell>
                         </TableRow>
                       </TableHead>
 
                       <TableBody>
                         {messData.items.map((item, index) => (
                           <TableRow key={index}>
                             <TableCell>
                               <TextField
                                 select
                                 size="small"
                                 value={item.category}
                                 onChange={(e) =>
                                   handleItemChange(
                                     index,
                                     "category",
                                     e.target.value,
                                   )
                                 }
                               >
                                 <MenuItem value="Recurring">Recurring</MenuItem>
                                 <MenuItem value="Non-recurring">
                                   Non-recurring
                                 </MenuItem>
                               </TextField>
                             </TableCell>
 
                             <TableCell>
                               <TextField
                                 size="small"
                                 value={item.name}
                                 onChange={(e) =>
                                   handleItemChange(
                                     index,
                                     "name",
                                     e.target.value,
                                   )
                                 }
                               />
                             </TableCell>
 
                             <TableCell>
                               <TextField
                                 type="number"
                                 size="small"
                                 value={item.quantity}
                                 onChange={(e) =>
                                   handleItemChange(
                                     index,
                                     "quantity",
                                     e.target.value,
                                   )
                                 }
                               />
                             </TableCell>
 
                             <TableCell>
                               <TextField
                                 type="number"
                                 size="small"
                                 value={item.price}
                                 onChange={(e) =>
                                   handleItemChange(
                                     index,
                                     "price",
                                     e.target.value,
                                   )
                                 }
                               />
                             </TableCell>
 
                             <TableCell>
                               ₹ {Number(item.total || 0).toFixed(2)}
                             </TableCell>
 
                             <TableCell>
                               <Button
                                 color="error"
                                 onClick={() => removeItem(index)}
                               >
                                 X
                               </Button>
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                   </TableContainer>
 
                   {/* ADD + TOTAL */}
                   <Box
                     sx={{
                       mt: 2,
                       display: "flex",
                       justifyContent: "space-between",
                     }}
                   >
                     <Button variant="outlined" onClick={addItem}>
                       + Add
                     </Button>
                     <Typography sx={{ fontWeight: 700 }}>
                       Grand Total: ₹ {calculateGrandTotal().toFixed(2)}
                     </Typography>
                   </Box>
 {/* ================= MENU CHART ================= */}
 <Typography
   variant="subtitle1"
   sx={{ fontWeight: 700, color: "#d97706", mb: 2, mt: 4 }}
 >
   📋 Menu Chart as per NEST Guideline
 </Typography>
 
 <TableContainer component={Paper}>
   <Table size="small">
     <TableHead sx={{ background: "#f1f5f9" }}>
       <TableRow>
         <TableCell><b>Day</b></TableCell>
         <TableCell><b>Breakfast</b></TableCell>
         <TableCell><b>Snacks (Morning)</b></TableCell>
         <TableCell><b>Lunch</b></TableCell>
         <TableCell><b>Snacks (Evening)</b></TableCell>
         <TableCell><b>Dinner</b></TableCell>
       </TableRow>
     </TableHead>
 
     <TableBody>
       {[
         {
           day: "Monday",
           breakfast: "Suji, Motor chana curry",
           morning: "Moongdal",
           lunch: "Rice, Dal, Mix Veg Curry",
           evening: "Samosa / Bora",
           dinner: "Rice, Dal, Seasonal Veg",
         },
         {
           day: "Tuesday",
           breakfast: "Veg Biryani",
           morning: "Biscuit",
           lunch: "Rice, Dal, Egg Curry",
           evening: "Milk with Biscuit",
           dinner: "Rice, Dal, Potato Soyabin",
         },
         {
           day: "Wednesday",
           breakfast: "Mudhi Mixture",
           morning: "Cake",
           lunch: "Rice, Dal, Fish/Mushroom",
           evening: "Masala Channa",
           dinner: "Rice, Dalama",
         },
         {
           day: "Thursday",
           breakfast: "Idli with curry",
           morning: "Fruit / Sev",
           lunch: "Rice, Dal, Veg Curry",
           evening: "Milk with Biscuit",
           dinner: "Rice, Dal, Soyabin",
         },
         {
           day: "Friday",
           breakfast: "Bread and Milk",
           morning: "Sonpapdi",
           lunch: "Rice, Dal, Egg Curry",
           evening: "Mudhi Mixture",
           dinner: "Rice, Dal, Veg Curry",
         },
         {
           day: "Saturday",
           breakfast: "Veg Biryani",
           morning: "Peanut",
           lunch: "Rice, Dal, Veg Curry",
           evening: "Cake / Bun",
           dinner: "Rice, Dal, Veg Curry",
         },
         {
           day: "Sunday",
           breakfast: "Idli with curry",
           morning: "-",
           lunch: "Rice, Dal, Chicken/Paneer",
           evening: "Biscuit",
           dinner: "Rice, Dalama with Papad",
         },
       ].map((row, index) => (
         <TableRow key={index}>
           <TableCell>{row.day}</TableCell>
           <TableCell>{row.breakfast}</TableCell>
           <TableCell>{row.morning}</TableCell>
           <TableCell>{row.lunch}</TableCell>
           <TableCell>{row.evening}</TableCell>
           <TableCell>{row.dinner}</TableCell>
         </TableRow>
       ))}
     </TableBody>
   </Table>
 </TableContainer>
                   {/* ================= SUBSECTION 2 ================= */}
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
  
