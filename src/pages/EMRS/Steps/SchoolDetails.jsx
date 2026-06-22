import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";

const EMRS_SCHOOLS = [
  { district: "Baksa",              name: "EMRS, Dalbari, Barama",                   value: "EMRS, Dalbari, Barama",                   enabled: false },
  { district: "Baksa",              name: "EMRS, Jalah, Vill. Daodhara",             value: "EMRS, Jalah, Vill. Daodhara",             enabled: true  },
  { district: "Baksa",              name: "EMRS, Sarupeta, Vill. Tatikuchi",         value: "EMRS, Sarupeta, Vill. Tatikuchi",         enabled: false },
  { district: "Bajali",             name: "EMRS, Kharadhara",                        value: "EMRS,Kharadhara",                         enabled: true  },
  { district: "Kokrajhar",          name: "EMRS, Bedlangmari",                       value: "EMRS, Bedlangmari",                       enabled: false },
  { district: "Karbi Anglong",      name: "EMRS, Howraghat",                         value: "EMRS, Howraghat",                         enabled: true  },
  { district: "Karbi Anglong",      name: "EMRS, Phuloni, Vill. Donghap",           value: "EMRS, Phuloni, Vill. Donghap",           enabled: false },
  { district: "Karbi Anglong",      name: "EMRS, Silonijan, Vill. Thengkur Terang", value: "EMRS, Silonijan, Vill. Thengkur Terang", enabled: false },
  { district: "West Karbi Anglong", name: "EMRS, Donka, Vill. Taralangso NC",       value: "EMRS, Donka, Vill. Taralangso NC",       enabled: false },
  { district: "Dhemaji",            name: "EMRS, Jonai, Vill. Purana Jhelom",       value: "EMRS, Jonai, Vill. Purana Jhelom",       enabled: true  },
  { district: "Dima Hasao",         name: "EMRS,Haflong, Vill. Ardaopur",           value: "EMRS,Haflong, Vill. Ardaopur",           enabled: true  },
  { district: "Dima Hasao",         name: "EMRS,Umrangso, Vill. Taisiling Hower",   value: "EMRS,Umrangso, Vill. Taisiling Hower",   enabled: false },
  { district: "Dima Hasao",         name: "EMRS, Harangajao, Vill. Dolaidisa",      value: "EMRS, Harangajao, Vill. Dolaidisa",      enabled: false },
  { district: "Dima Hasao",         name: "EMRS, Diyungbra, Vill. Larbo",           value: "EMRS, Diyungbra, Vill. Larbo",           enabled: false },
  { district: "Kamrup",             name: "EMRS,Boko, Vill. Nagopara",              value: "EMRS, Boko, Vill. Nagopara",             enabled: false },
  { district: "Goalpara",           name: "EMRS, Dudhnoi, Vill. Jakhuwapara",       value: "EMRS, Dudhnoi, Vill. Jakhuwapara",       enabled: false },
  { district: "Udalguri",           name: "EMRS, Khoirabari, Vill. Malmura",        value: "EMRS, Khoirabari, Vill. Malmura",        enabled: false },
];

const DISTRICTS = [...new Set(EMRS_SCHOOLS.map((s) => s.district))];

// Fields that should be auto-filled and locked
const AUTO_FILLED_FIELDS = {
  schooltype: "Co-Ed",
  Affiliation: "CBSE",
};

export default function SchoolDetails({
  control,
  watch,
  setValue,
  emrsBasicFields,
  onPincodeChange,
}) {

  // ── Auto-populate schooltype and Affiliation on mount ──
  useEffect(() => {
    setValue("schooltype", "Co-Ed",    { shouldDirty: false });
    setValue("Affiliation", "CBSE",    { shouldDirty: false });
  }, [setValue]);

  return (
    <>
      {/* ================= BASIC SCHOOL DETAILS ================= */}
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
        {emrsBasicFields.map((fieldItem) => {
          if (
            fieldItem.name === "NameofthePrincipal" &&
            watch("principalAvailable") !== "Yes"
          )
            return null;

          // ── EMRS School Name dropdown ──────────────────────────────────
          if (fieldItem.name === "schoolname") {
            return (
              <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
                <Controller
                  name="schoolname"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="School Name"
                      fullWidth
                      size="small"
                      sx={{ minWidth: 220 }}
                      select
                      error={!!error}
                      helperText={error ? error.message : ""}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: { sx: { maxHeight: 400 } },
                        },
                      }}
                    >
                      {DISTRICTS.map((district) => {
                        const schoolsInDistrict = EMRS_SCHOOLS.filter(
                          (s) => s.district === district
                        );
                        return [
                          <MenuItem
                            key={`header-${district}`}
                            disabled
                            sx={{
                              background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
                              color: "#1565c0 !important",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              opacity: "1 !important",
                              py: 0.5,
                              borderLeft: "4px solid #1976d2",
                              mt: 0.5,
                            }}
                          >
                            {district}
                          </MenuItem>,
                          ...schoolsInDistrict.map((school) => (
                            <MenuItem
                              key={school.value}
                              value={school.value}
                              sx={{
                                pl: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                                opacity: school.enabled ? 1 : 0.55,
                                "&:hover": school.enabled
                                  ? { backgroundColor: "#e3f2fd" }
                                  : {},
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  fontSize: "0.875rem",
                                  color: school.enabled
                                    ? "text.primary"
                                    : "text.disabled",
                                }}
                              >
                                {school.name}
                              </Box>
                              {school.enabled ? (
                                <Chip
                                  label="Functional"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    backgroundColor: "#e8f5e9",
                                    color: "#2e7d32",
                                    border: "1px solid #a5d6a7",
                                    pointerEvents: "none",
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Coming Soon"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    backgroundColor: "#fff3e0",
                                    color: "#e65100",
                                    border: "1px solid #ffcc80",
                                    pointerEvents: "none",
                                  }}
                                />
                              )}
                            </MenuItem>
                          )),
                        ];
                      })}
                    </TextField>
                  )}
                />
              </Grid>
            );
          }

          // ── Auto-filled read-only fields (schooltype, Affiliation) ──────
          if (AUTO_FILLED_FIELDS[fieldItem.name]) {
            return (
              <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
                <Controller
                  name={fieldItem.name}
                  control={control}
                  defaultValue={AUTO_FILLED_FIELDS[fieldItem.name]}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={AUTO_FILLED_FIELDS[fieldItem.name]}  // always locked
                      label={fieldItem.label}
                      fullWidth
                      size="small"
                      sx={{ minWidth: 220 }}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          backgroundColor: "#f5f5f5",   // grey tint like location fields
                          color: "text.secondary",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            );
          }

          // ── All other fields ───────────────────────────────────────────
          return (
            <Grid item xs={12} sm={6} md={4} key={fieldItem.name}>
              <Controller
                name={fieldItem.name}
                control={control}
                defaultValue=""
                rules={{
                  ...(fieldItem.name === "contactno" && {
                    validate: (v) =>
                      !v ||
                      /^[0-9]{10}$/.test(String(v)) ||
                      "Must be exactly 10 digits",
                  }),
                  ...(fieldItem.name === "udaisecode" && {
                    validate: (v) => {
                      if (!v) return true;
                      const trimmed = String(v).trim();
                      if (!/^\d+$/.test(trimmed))
                        return "UDISE Code must contain digits only";
                      if (trimmed.length !== 11)
                        return "UDISE Code must be exactly 11 digits";
                      return true;
                    },
                  }),
                  ...(fieldItem.name === "emailid" && {
                    validate: (v) =>
                      !v ||
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()) ||
                      "Enter a valid email",
                  }),
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
                    helperText={
                      fieldItem.name === "udaisecode"
                        ? error
                          ? error.message
                          : `${String(field.value || "").length}/11 digits`
                        : error
                        ? error.message
                        : ""
                    }
                    FormHelperTextProps={
                      fieldItem.name === "udaisecode" && !error
                        ? { sx: { color: "text.secondary" } }
                        : undefined
                    }
                    {...(fieldItem.name === "contactno" && {
                      inputProps: {
                        maxLength: 10,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                      onKeyDown: (e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                        )
                          e.preventDefault();
                      },
                    })}
                    {...(fieldItem.name === "udaisecode" && {
                      inputProps: {
                        maxLength: 11,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                      onKeyDown: (e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                        )
                          e.preventDefault();
                      },
                      onPaste: (e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData
                          .getData("text")
                          .replace(/\D/g, "")
                          .slice(0, 11);
                        field.onChange(pasted);
                      },
                    })}
                    {...(fieldItem.type === "number" &&
                      fieldItem.name !== "contactno" &&
                      fieldItem.name !== "udaisecode" && {
                        type: "number",
                        inputProps: { min: 0 },
                      })}
                    {...(["NameofthePrincipal", "emailid"].includes(fieldItem.name) && {
                      onKeyDown: (e) => {
                        if (/^[0-9]$/.test(e.key)) e.preventDefault();
                      },
                    })}
                  >
                    {fieldItem.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* ================= LOCATION ================= */}
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
        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="pincode"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Pincode"
                fullWidth
                size="small"
                inputProps={{ maxLength: 6 }}
                onChange={(e) => {
                  field.onChange(e);
                  onPincodeChange(e.target.value);
                }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        {[
          { name: "district",      label: "District" },
          { name: "block",         label: "Block" },
          { name: "gramPanchayat", label: "Gram Panchayat" },
          { name: "village",       label: "Village" },
        ].map(({ name, label }) => (
          <Grid item xs={12} sm={6} md={3} key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label={label}
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: { backgroundColor: "#f5f5f5" },
                  }}
                />
              )}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}