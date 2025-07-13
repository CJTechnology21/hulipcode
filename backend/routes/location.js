const express = require('express');
const router = express.Router();

router.get('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Reverse geocode error:', err);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

module.exports = router;

// const express = require('express');
// const fetch = require('node-fetch');
// const router = express.Router();

// router.get('/reverse-geocode', async (req, res) => {
//   const { lat, lon } = req.query;

//   if (!lat || !lon) {
//     return res.status(400).json({ error: 'Latitude and longitude are required' });
//   }

//   try {
//     const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     console.error('Reverse geocode error:', err);
//     res.status(500).json({ error: 'Failed to fetch location data' });
//   }
// });

// module.exports = router;
