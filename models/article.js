const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, required: true },
    company_name: { type: String, required: true },
    start_date: Number,
    work_hour: String,
    job_content: String,
    hourly_payment: String,
    hourly_payment_description: String,
    monthly_payment: String,
    monthly_payment_description: String,
    other_payment: String,
    payment_method: String,
    payment_score: { type: Number, min: 0, max: 5 },
    payment_description: String,
    payment_rationality: String,
    feeling: { type: String, required: true },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    suggestion: String,
    job_duration: String,
    job_title: String,
    insurance: { type: Number, min: -1, max: 1 },
    learn: String,
    learn_score: { type: Number, min: 0, max: 5 },
    reward: String,
    reward_score: { type: Number, min: 0, max: 5 },
    industry: String,
    job_description: String,
    job_description_gap: String,
    job_description_gap_score: { type: Number, min: 0, max: 5 },
    contact: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('article', articleSchema);
