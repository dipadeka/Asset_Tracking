import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const IMAGE_CATEGORIES = [
  { key: "schoolBuilding", label: "🏫 School Building", description: "Front view, campus, classrooms" },
  { key: "hostel", label: "🏠 Hostel", description: "Boys & Girls hostel facilities" },
  { key: "laboratory", label: "🔬 Laboratory", description: "Science, computer labs" },
  { key: "library", label: "📚 Library", description: "Library and reading rooms" },
  { key: "playground", label: "⚽ Playground", description: "Sports ground, equipment" },
  { key: "kitchen", label: "🍽️ Kitchen / Mess", description: "Mess hall, kitchen area" },
  { key: "medical", label: "🏥 Medical Room", description: "Infirmary, health facilities" },
  { key: "events", label: "🎭 Events / Activities", description: "Cultural, sports events" },
  { key: "other", label: "📷 Other", description: "Miscellaneous photos" },
];

const EMRSImageUpload = ({ uploadedImages = {}, setUploadedImages }) => {
  const [activeCategory, setActiveCategory] = useState("schoolBuilding");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFiles = (files, category) => {
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!validFiles.length) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => {
          const existing = prev[category] || [];
          return {
            ...prev,
            [category]: [
              ...existing,
              {
                name: file.name,
                size: file.size,
                dataUrl: e.target.result,
                uploadedAt: new Date().toISOString(),
              },
            ],
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (category, index) => {
    setUploadedImages((prev) => {
      const updated = [...(prev[category] || [])];
      updated.splice(index, 1);
      return { ...prev, [category]: updated };
    });
  };

  const totalImages = Object.values(uploadedImages).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  const currentImages = uploadedImages[activeCategory] || [];
  const activeCategoryMeta = IMAGE_CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
          borderRadius: 2,
          px: 3,
          py: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 32 }}>📸</Typography>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
            EMRS Image Upload
          </Typography>
          <Typography sx={{ color: "#bfdbfe", fontSize: 13 }}>
            Upload photos category-wise — School, Hostel, Labs, Events &amp; more
          </Typography>
        </Box>
        {totalImages > 0 && (
          <Chip
            label={`${totalImages} Photo${totalImages > 1 ? "s" : ""} Uploaded`}
            sx={{ ml: "auto", background: "#ffffff22", color: "#fff", fontWeight: 700 }}
          />
        )}
      </Box>

      {/* Category Tabs */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {IMAGE_CATEGORIES.map((cat) => {
          const count = (uploadedImages[cat.key] || []).length;
          return (
            <Chip
              key={cat.key}
              label={`${cat.label}${count > 0 ? ` (${count})` : ""}`}
              onClick={() => setActiveCategory(cat.key)}
              variant={activeCategory === cat.key ? "filled" : "outlined"}
              color={activeCategory === cat.key ? "primary" : "default"}
              sx={{
                fontWeight: activeCategory === cat.key ? 700 : 400,
                cursor: "pointer",
              }}
            />
          );
        })}
      </Box>

      {/* Upload Area */}
      <Paper
        elevation={0}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files, activeCategory);
        }}
        sx={{
          border: `2px dashed ${dragOver ? "#2563eb" : "#94a3b8"}`,
          borderRadius: 3,
          p: 4,
          mb: 3,
          textAlign: "center",
          background: dragOver ? "#eff6ff" : "#f8fafc",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files, activeCategory)}
        />
        <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>
          {activeCategoryMeta?.label} — Drop images here or click to browse
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5 }}>
          {activeCategoryMeta?.description} · JPG, PNG, WEBP supported
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="small"
            component="label"
            sx={{ background: "#2563eb", pointerEvents: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files, activeCategory)}
            />
            📁 Browse Files
          </Button>
          <Button
            variant="outlined"
            size="small"
            component="label"
            sx={{ borderColor: "#2563eb", color: "#2563eb", pointerEvents: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFiles(e.target.files, activeCategory)}
            />
            📷 Take Photo
          </Button>
        </Box>
      </Paper>

      {/* Image Grid */}
      {currentImages.length > 0 ? (
        <>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#374151", mb: 2 }}>
            {activeCategoryMeta?.label} — {currentImages.length} image{currentImages.length > 1 ? "s" : ""}
          </Typography>
          <Grid container spacing={2}>
            {currentImages.map((img, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <Paper
                  elevation={2}
                  sx={{ borderRadius: 2, overflow: "hidden", position: "relative" }}
                >
                  <Box
                    component="img"
                    src={img.dataUrl}
                    alt={img.name}
                    sx={{
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(activeCategory, idx)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "#dc2626",
                      color: "#fff",
                      "&:hover": { background: "#b91c1c" },
                      width: 26,
                      height: 26,
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Box sx={{ px: 1, py: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#374151",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {img.name}
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>
                      {(img.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No images uploaded yet for <strong>{activeCategoryMeta?.label}</strong>. Use the upload area above.
        </Alert>
      )}

      {/* Summary across all categories */}
      {totalImages > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#374151", mb: 1.5 }}>
            📊 Upload Summary
          </Typography>
          <Grid container spacing={1}>
            {IMAGE_CATEGORIES.filter((cat) => (uploadedImages[cat.key] || []).length > 0).map((cat) => (
              <Grid item xs={6} sm={4} md={3} key={cat.key}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { borderColor: "#2563eb" },
                  }}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <Typography sx={{ fontSize: 18 }}>{cat.label.split(" ")[0]}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1e40af" }}>
                    {(uploadedImages[cat.key] || []).length}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                    {cat.label.split(" ").slice(1).join(" ")}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default EMRSImageUpload;