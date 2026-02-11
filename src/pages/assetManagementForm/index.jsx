import * as React from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper,
  MenuItem
} from '@mui/material';

// -------------------- Asset Management Form Page --------------------
export default function AssetManagementForm() {
  const [assetData, setAssetData] = useState({
    category: '',
    'project name': '',
    'Implementing Agency': '',
    state: '',
    district: '',
    block: '',
    village: ''
  });

  const handleChange = (e) => {
    setAssetData({
      ...assetData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: '#0b1220', color: '#fff' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Asset Management Form
          </Typography>

          <TextField
            fullWidth
            label="Asset Name"
            placeholder="Enter asset name"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            label="AssetID"
            placeholder="Enter asset type"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            label="Asset Code"
            placeholder="Enter asset code"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Asset Category"
            name="category"
            value={assetData.category}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          >
            <MenuItem value="Office Building">Office Building</MenuItem>
            <MenuItem value="School Building">School Building</MenuItem>
            <MenuItem value="Market">Market</MenuItem>
            <MenuItem value="Commercial Building">Commercial Building</MenuItem>
            <MenuItem value="Warehouse">Warehouse</MenuItem>
            <MenuItem value="Godown">Godown</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Project Name"
            name="project name"
            value={assetData['project name']}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Implementing Agency"
            name="Implementing Agency"
            value={assetData['Implementing Agency']}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="State"
            name="state"
            value={assetData.state}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="District"
            name="district"
            value={assetData.district}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Block"
            name="block"
            value={assetData.block}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Village"
            name="village"
            value={assetData.village}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            type="number" 
            label="Ward No" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            type="number" 
            label="Pincode" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            type="number" 
            label="Latitude" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            type="number" 
            label="Longitude" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Full Postal Address"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            type="number" 
            label="Area / Size" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            type="number" 
            label="Construction Cost (₹)" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            select 
            fullWidth 
            label="Funding Source" 
            margin="normal"
            defaultValue=""
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          >
            <MenuItem value="State Govt">State Govt</MenuItem>
            <MenuItem value="Central Govt">Central Govt</MenuItem>
            <MenuItem value="CSS">CSS</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="date"
            label="Sanction Date"
            margin="normal"
            InputLabelProps={{ shrink: true, style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            fullWidth 
            label="Point of Contact" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField 
            select 
            fullWidth 
            label="Status" 
            margin="normal"
            defaultValue=""
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          >
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </TextField>

          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            label="Remarks" 
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <Button fullWidth variant="contained" sx={{ mt: 2, py: 1.2 }}>
            Submit Asset Details
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}