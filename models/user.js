const mongoose = require('mongoose');
const Schema = mongoose.Schema; // collections trong mongodb
const ObjectId = Schema.ObjectId; // tạo ObjectID trong mongodb
const user = new Schema({
    id: { type: ObjectId },
    username: { type: String },
    password: { type: String },
    name: { type: String }
});
module.exports = mongoose.models.user || mongoose.model('user', user);
