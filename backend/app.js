// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

// Load environment variables here 
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
connectDB();

// Middleware here 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded limit if needed

// Routes here 
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Error handling middleware here 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
