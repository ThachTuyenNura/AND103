const mongoose = require('mongoose');
const Schema = mongoose.Schema; // collections trong mongodb
const ObjectId = Schema.ObjectId; // tạo ObjectID trong mongodb
const user = new Schema({
    id: { type: ObjectId },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 5, maxlength: 30, trim: true },
    name: { type: String, default: 'No name' },
    gender: { type: String, default: 'Unset' },
    phone: { type: String, minlength: 1, maxlength: 10 },
    address: { type: String },
    role: { type: String, default: 'user' }
});
module.exports = mongoose.models.user || mongoose.model('user', user);
