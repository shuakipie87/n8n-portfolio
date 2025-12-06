const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db/database');

router.post('/', async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  db.run(
    `INSERT INTO leads (name, email, company, message) VALUES (?, ?, ?, ?)`,
    [name, email, company, message],
    (err) => {
      if (err) console.error('DB insert error:', err);
    }
  );

  // Send to n8n
  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, { name, email, company, message });
    res.status(200).json({ name, email, company, message });
  } catch (error) {
    console.error('n8n Error:', error);
    res.status(500).json({ error: 'Failed to send data to n8n' });
  }
});

module.exports = router;
