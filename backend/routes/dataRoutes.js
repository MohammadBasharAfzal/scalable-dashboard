// routes/dataRoutes.js
const express = require('express');
const { uploadData, getData } = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Route for uploading data (protected by auth middleware)
router.post('/upload', authMiddleware, uploadData);

// Route for fetching data (protected by auth middleware)
router.get('/', authMiddleware, getData);

module.exports = router;