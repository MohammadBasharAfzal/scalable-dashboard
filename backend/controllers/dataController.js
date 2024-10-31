// controllers/dataController.js
const DataRecord = require('../models/DataRecord');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser'); // Ensure you have this package installed

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

// Upload data and process CSV file
exports.uploadData = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err.message);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            console.error('File not provided');
            return res.status(400).json({ message: 'File not provided' });
        }

        try {
            const records = [];

            fs.createReadStream(req.file.path)
                .pipe(csvParser())
                .on('data', (row) => {
                    // Create a record structure with required fields and any additional dynamic fields
                    const record = {
                        Date: row.Date ? new Date(row.Date) : new Date(),
                        Open: row.Open ? parseFloat(row.Open) : 0,
                        High: row.High ? parseFloat(row.High) : 0,
                        Low: row.Low ? parseFloat(row.Low) : 0,
                        Close: row.Close ? parseFloat(row.Close) : 0,
                        Volume: row.Volume ? parseInt(row.Volume, 10) : 0,
                        OpenInt: row.OpenInt ? parseInt(row.OpenInt, 10) : 0,
                        userId: req.userId // Associate record with the logged-in user
                    };

                    // Capture additional dynamic fields
                    const additionalFields = {};
                    Object.keys(row).forEach((key) => {
                        if (!record.hasOwnProperty(key)) {
                            additionalFields[key] = row[key];
                        }
                    });

                    // Add additional fields if any exist
                    if (Object.keys(additionalFields).length > 0) {
                        record.additionalFields = additionalFields;
                    }

                    records.push(record);
                })
                .on('end', async () => {
                    try {
                        // Insert parsed CSV data into the database
                        await DataRecord.insertMany(records);
                        console.log('Records successfully inserted:', records.length);

                        // Clean up the uploaded file after processing
                        fs.unlink(req.file.path, (err) => {
                            if (err) console.error('Error removing temp file:', err);
                        });

                        res.status(200).json({ message: 'File uploaded and processed successfully' });
                    } catch (dbError) {
                        console.error('Database insertion error:', dbError.message);
                        res.status(500).json({ message: 'Error saving records to the database' });
                    }
                })
                .on('error', (parseError) => {
                    console.error('CSV parsing error:', parseError.message);
                    res.status(500).json({ message: 'Error processing CSV data' });
                });
        } catch (error) {
            console.error('Error processing data:', error.message);
            res.status(500).json({ message: 'Error processing data' });
        }
    });
};

// Fetch data for the logged-in user
exports.getData = async (req, res) => {
    try {
        const records = await DataRecord.find({ userId: req.userId }) // Filter records by userId
            .limit(100) // Adjust as needed
            .exec(); // Ensure we execute the query

        console.log("Retrieved records:", records); // Log retrieved records for verification
        res.json(records);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: error.message });
    }
};
