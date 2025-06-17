const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const Class = require('../models/class');

router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  const newClass = new Class(req.body);
  await newClass.save();
  res.json(newClass);
});

router.get('/', authenticate, async (req, res) => {
  const classes = await Class.find().populate('teacher');
  res.json(classes);
});3

module.exports = router;
