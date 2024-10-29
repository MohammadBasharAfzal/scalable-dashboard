// models/DataRecord.js
const mongoose = require('mongoose');

const dataRecordSchema = new mongoose.Schema({
    // Define your schema fields based on the CSV structure
    field1: { type: String, required: true },
    field2: { type: Number, required: true },
    // Add more fields as needed
});

module.exports = mongoose.model('DataRecord', dataRecordSchema);
