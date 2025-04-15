var express = require('express');
var router = express.Router();
var category = require('../models/category');

//lấy danh sách category
// localhost:3000/category/list
router.get("/list", async function (req, res, next) {
    var list = await category.find();
    res.status(200).json({ success: true, message: "Thành công", list: list });
})

//lấy thông tin danh mục theo tên
// localhost:3000/category/search?key=Bánh
router.get("/search", async function (req, res, next) {
    const { key } = req.query;
    var list = await category.find({ name: key });
    if (list) {
        res.status(200).json({ success: true, message: "Thành công", list: list });
    } else {
        res.status(400).json({ success: false, message: "Không có thông tin sản phẩm" });
    }
})

module.exports = router;