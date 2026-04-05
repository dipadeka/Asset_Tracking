import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from "@mui/material";

const AssetApplied = () => {

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/assets");

      if (!res.ok) {
        throw new Error("Failed to fetch asset forms");
      }

      const data = await res.json();

      if (data.success) {
        setAssets(data.data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" fontWeight="bold" mb={2}>
        Submitted Asset Forms
      </Typography>

      <Typography color="text.secondary" mb={3}>
        View your submitted asset applications here
      </Typography>

      {assets.length === 0 ? (

        <Typography>No asset forms submitted yet.</Typography>

      ) : (

        assets.map((asset, index) => (

          <Card key={asset._id || index} sx={{ mb: 2 }}>
            <CardContent>

              <Box display="flex" justifyContent="space-between">

                <Box>
                  <Typography fontWeight="bold">
                    {asset.assetName || "Asset"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Asset Code: {asset.assetCode || "-"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Submitted: {asset.createdAt ? new Date(asset.createdAt).toLocaleString() : "-"}
                  </Typography>
                </Box>

                <Chip
                  label="Submitted"
                  color="success"
                  size="small"
                />

              </Box>

            </CardContent>
          </Card>

        ))

      )}

    </Box>
  );
};

export default AssetApplied;