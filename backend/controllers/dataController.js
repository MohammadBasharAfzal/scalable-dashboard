// controllers/dataController.js
const DataRecord = require('../models/DataRecord');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const upload = multer({
    dest: 'uploads/', // Directory to store uploaded files temporarily
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB size limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /csv/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
}).single('file'); // Use 'file' as the field name for the upload

// Implement functions for handling data records
exports.uploadData = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'File not provided' });
        }

        // Here, implement file processing logic, such as parsing the CSV file
        // and saving data to the database

        // Example placeholder for CSV processing (use csv-parser or similar)
        fs.readFile(req.file.path, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ message: 'Error reading file' });
            }
            // Process CSV data here (parse and insert into DataRecord model)
            // Clean up the uploaded file after processing
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error removing temp file:', err);
            });

            // Send success response
            res.status(200).json({ message: 'File uploaded and processed successfully' });
        });
    });
};

exports.getData = async (req, res) => {
    try {
        const records = await DataRecord.find().limit(100); // Adjust as needed
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};