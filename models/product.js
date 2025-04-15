const mongoose = require('mongoose');
const Schema = mongoose.Schema; // collections trong mongodb
const ObjectId = Schema.ObjectId; // tạo ObjectID trong môngdb
const product = new Schema({
    id: { type: ObjectId }, // khóa chính
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    category: { type: ObjectId, ref: 'category' }
});
module.exports = mongoose.models.product || mongoose.model('product', product);