const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, required: true },
    company_name: { type: String, required: true },
    start_date: Number,
    work_hour: { // Store the minimum (eg. 0-10 => 0)
        type: Number,
        min: -1, // Not typical work_hour, see work_hour_description
        max: 41,
        required: true,
    },
    work_hour_description: String,
    job_content: String,
    payment: { // Store the minimum (eg. 1-132 => 1)
        type: Number,
        min: -1, // Not typical payment, see payment_description
        max: 200,
    },
    payment_description: String,
    payment_score: { type: Number, min: 0, max: 5 },
    payment_rationality: String,
    feeling: { type: String, required: true },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    suggestion: String,
    job_duration: { type: String, required: true },
    job_title: String,
    insurance: { type: Number, min: -1, max: 1 },
    reward: String,
    industry: String,
    job_description: String,
    job_description_gap: String,
    reward_score: { type: Number, min: 0, max: 5 },
    job_description_gap_score: { type: Number, min: 0, max: 5 },
}, {
    timestamps: true,
});

module.exports = mongoose.model('article', articleSchema);
