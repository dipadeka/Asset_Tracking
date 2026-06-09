import React from "react";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";
// ─────────────────────────────────────────────
// All 17 EMRS schools — only 5 are functional
// ─────────────────────────────────────────────
const EMRS_SCHOOLS = [
  // ── Baksa ──────────────────────────────────
  {
    district: "Baksa",
    name: "EMRS, Dalbari, Barama",
    value: "EMRS, Dalbari, Barama",
    enabled: false,
  },
  {
    district: "Baksa",
    name: "EMRS, Jalah, Vill. Daodhara",
    value: "EMRS, Jalah, Vill. Daodhara",
    enabled: true,  // ✅ FUNCTIONAL
  },
  {
    district: "Baksa",
    name: "EMRS, Sarupeta, Vill. Tatikuchi",
    value: "EMRS, Sarupeta, Vill. Tatikuchi",
    enabled: false,
  },

  // ── Bajali ─────────────────────────────────
  {
    district: "Bajali",
    name: "EMRS, Kharadhara",
    value: "EMRS,Kharadhara",
    enabled: true, // ✅ FUNCTIONAL
  },

  // ── Kokrajhar ──────────────────────────────
  {
    district: "Kokrajhar",
    name: "EMRS, Bedlangmari",
    value: "EMRS, Bedlangmari",
    enabled: false,
  },

  // ── Karbi Anglong ──────────────────────────
  {
    district: "Karbi Anglong",
    name: "EMRS, Howraghat",
    value: "EMRS, Howraghat",
    enabled: true,       // ✅ FUNCTIONAL
  },
  {
    district: "Karbi Anglong",
    name: "EMRS, Phuloni, Vill. Donghap",
    value: "EMRS, Phuloni, Vill. Donghap",
    enabled: false,
  },
  {
    district: "Karbi Anglong",
    name: "EMRS, Silonijan, Vill. Thengkur Terang",
    value: "EMRS, Silonijan, Vill. Thengkur Terang",
    enabled: false,
  },

  // ── West Karbi Anglong ─────────────────────
  {
    district: "West Karbi Anglong",
    name: "EMRS, Donka, Vill. Taralangso NC",
    value: "EMRS, Donka, Vill. Taralangso NC",
    enabled: false,
  },

  // ── Dhemaji ────────────────────────────────
  {
    district: "Dhemaji",
    name: "EMRS, Jonai, Vill. Purana Jhelom",
    value: "EMRS, Jonai, Vill. Purana Jhelom",
    enabled: true,       // ✅ FUNCTIONAL
  },

  // ── Dima Hasao ─────────────────────────────
  {
    district: "Dima Hasao",
    name: "EMRS,Haflong, Vill. Ardaopur",
    value: "EMRS,Haflong, Vill. Ardaopur",
    enabled: true,       // ✅ FUNCTIONAL
  },
  {
    district: "Dima Hasao",
    name: "EMRS,Umrangso, Vill. Taisiling Hower",
    value: "EMRS,Umrangso, Vill. Taisiling Hower",
    enabled: false,
  },
  {
    district: "Dima Hasao",
    name: "EMRS, Harangajao, Vill. Dolaidisa",
    value: "EMRS, Harangajao, Vill. Dolaidisa",
    enabled: false,
  },
  {
    district: "Dima Hasao",
    name: "EMRS, Diyungbra, Vill. Larbo",
    value: "EMRS, Diyungbra, Vill. Larbo",
    enabled: false,
  },

  // ── Kamrup ─────────────────────────────────
  {
    district: "Kamrup",
    name: "EMRS,Boko, Vill. Nagopara",
    value: "EMRS, Boko, Vill. Nagopara",
    enabled: false,
  },

  // ── Goalpara ───────────────────────────────
  {
    district: "Goalpara",
    name: "EMRS, Dudhnoi, Vill. Jakhuwapara",
    value: "EMRS, Dudhnoi, Vill. Jakhuwapara",
    enabled: false,
  },

  // ── Udalguri ───────────────────────────────
  {
    district: "Udalguri",
    name: "EMRS, Khoirabari, Vill. Malmura",
    value: "EMRS, Khoirabari, Vill. Malmura",
    enabled: false,
  },
];

// Group schools by district for the dropdown header labels
const DISTRICTS = [...new Set(EMRS_SCHOOLS.map((s) => s.district))];

// ─────────────────────────────────────────────────────────────────────────────

export default function SchoolDetails({
  control,
  watch,
  emrsBasicFields,
  onPincodeChange,
}) {
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
          // Hide principal name if not available
          if (
            fieldItem.name === "NameofthePrincipal" &&
            watch("principalAvailable") !== "Yes"
          )
            return null;

          // ── EMRS School Name — custom dropdown ────────────────
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
                          PaperProps: {
                            sx: { maxHeight: 400 },
                          },
                        },
                      }}
                    >
                      {DISTRICTS.map((district) => {
                        const schoolsInDistrict = EMRS_SCHOOLS.filter(
                          (s) => s.district === district
                        );

                        return [
                          // ── District header (non-selectable) ──
                          <MenuItem
                            key={`header-${district}`}
                            disabled
                            sx={{
                              background:
                                "linear-gradient(to right, #e3f2fd, #bbdefb)",
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

                          // ── Schools in this district ───────────
                          ...schoolsInDistrict.map((school) => (
                            <MenuItem
                              key={school.value}
                              value={school.value}
                              disabled={!school.enabled}
                              sx={{
                                pl: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                                opacity: school.enabled ? 1 : 0.55,
                                "&:hover": school.enabled
                                  ? {
                                      backgroundColor: "#e3f2fd",
                                    }
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

          // ── All other fields (unchanged logic) ────────────────
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
                      inputProps: {
                        maxLength: 10,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                      onKeyDown: (e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        )
                          e.preventDefault();
                      },
                    })}
                    {...(["NameofthePrincipal", "emailid"].includes(
                      fieldItem.name
                    ) && {
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
  {/* Pincode */}
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
            field.onChange(e);   // ✅ update RHF state first
            onPincodeChange(e.target.value);  // ✅ then trigger autofill
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  </Grid>

  {/* ✅ All names exactly match setValue() keys — camelCase, no spaces */}
  {[
    { name: "district",       label: "District" },
    { name: "block",          label: "Block" },
    { name: "gramPanchayat",  label: "Gram Panchayat" },
    { name: "village",        label: "Village" },
  ].map(({ name, label }) => (
    <Grid item xs={12} sm={6} md={3} key={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}  // ✅ prevents uncontrolled→controlled warning
            label={label}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}  // ✅ autofilled fields shouldn't be manually edited
            onKeyDown={(e) => {
              if (/^[0-9]$/.test(e.key)) e.preventDefault();
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