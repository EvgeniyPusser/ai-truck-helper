import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.post('/route', async (req, res) => {
  try {
    const { coordinates } = req.body;
    const orsKey = process.env.ORS_API_KEY || process.env.VITE_ORS_API_KEY;
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: {
        'Authorization': orsKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
