// routes/data.js
const express = require('express');
const { uploadData, getData } = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/upload', authMiddleware, uploadData);
router.get('/', authMiddleware, getData);

module.exports = router;

