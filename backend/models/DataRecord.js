// models/DataRecord.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataRecordSchema = new Schema({
    Date: { type: Date, required: true },
    Open: { type: Number, required: true },
    High: { type: Number, required: true },
    Low: { type: Number, required: true },
    Close: { type: Number, required: true },
    Volume: { type: Number, required: true },
    OpenInt: { type: Number, required: true },
    // Optional field to handle dynamic or unknown fields
    additionalFields: { type: Schema.Types.Mixed }
});

module.exports = mongoose.model('DataRecord', dataRecordSchema);
