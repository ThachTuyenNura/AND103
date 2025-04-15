const mongoose = require('mongoose');
const Schema = mongoose.Schema; // collections trong mongodb
const ObjectId = Schema.ObjectId; // tạo ObjectID trong mongodb
const sinhvien = new Schema({
    mssv: { type: ObjectId }, // khóa chính
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    averageScore: { type: Number },
    department: { type: String },
    age: { type: Number }
});
module.exports = mongoose.models.sinhvien || mongoose.model('sinhvien', sinhvien);
