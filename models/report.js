const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    where: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;