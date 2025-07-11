const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateEmail, validateMobile } = require('../validation');

// Add User Form
router.get('/add', (req, res) => {
  res.render('add-user');
});

// Create User
router.post('/add', async (req, res) => {
  const { name, email, mobile } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  if (!validateMobile(mobile)) {
    return res.status(400).send('Mobile must be 10 digits');
  }

  try {
    await User.query().insert({ name, email, mobile });
    res.render('success', { message: 'User created successfully!' });
  } catch (error) {
    res.status(500).send('Error creating user: ' + error.message);
  }
});

module.exports = router;