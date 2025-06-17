const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load biến môi trường
dotenv.config();

// Khởi tạo app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Import routers
const classRoutes = require('./src/routers/class');
const assignmentRoutes = require('./src/routers/assignment');

// Định tuyến API
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);

// Trang mặc định
app.get('/', (req, res) => {
  res.send('Welcome to Classroom Management System API');
});

module.exports = app;