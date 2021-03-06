const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    OAuthid: Number,
    method: String, // FB | Google
    name: String,
    nickname: String,
    email: String,
    created_at: Date,
}, {
    timestamps: true,
});

// Makes { OAuthid + method } unique.
userSchema.index({ OAuthid: 1, method: 1 }, { unique: true });

module.exports = mongoose.model('user', userSchema);
