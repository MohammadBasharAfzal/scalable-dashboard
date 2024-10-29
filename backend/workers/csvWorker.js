// workers/csvWorker.js
const Queue = require('bull');
const csv = require('csv-parser'); // You may need to install this
const fs = require('fs');
const DataRecord = require('../models/DataRecord');

const csvUploadQueue = new Queue('csvUploadQueue');

csvUploadQueue.process(async (job, done) => {
    const filePath = job.data.filePath;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (data) => {
            const record = new DataRecord(data);
            await record.save();
        })
        .on('end', () => {
            console.log('CSV file processed successfully');
            done();
        })
        .on('error', (error) => {
            console.error('Error processing CSV:', error);
            done(error);
        });
});

module.exports = csvUploadQueue;

