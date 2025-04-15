var express = require('express');
var router = express.Router();
var category = require('../models/category');
var userModel = require("../models/user");
const JWT = require("jsonwebtoken");
const config = require("../util/config");

//lấy danh sách category
// https://and103-0ru9.onrender.com/category/list
router.get("/list", async function (req, res, next) {
    try {
        var list = await category.find();
        res.status(200).json({ success: true, message: "Lấy danh sách thành công", list: list });
    } catch (error) {
        res.status(400).json({ success: false, message: "Lấy danh sách thất bại" });
    }
})

//lấy thông tin danh mục theo tên
// https://and103-0ru9.onrender.com/category/search?key=bÁnH
router.get("/search", async function (req, res, next) {
    try {
        const { key } = req.query;
        var list = await category.find({ name: { $regex: key, $options: 'i' } });
        res.status(200).json({ success: true, message: "Lấy danh sách thành công", list: list });
    } catch (error) {
        res.status(400).json({ success: false, message: "Lấy danh sách thất bại" });
    }
})

//Thêm danh mục
//https://and103-0ru9.onrender.com/category/add
router.post("/add", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
                if (err) {
                    return res.status(403).json({ "status": 403, "err": err });
                } else {
                    if (decoded.role != "admin") {
                        return res.status(400).json({ success: false, message: 'Không phải tài khoản admin không thêm được danh mục' });
                    } else {
                        const { name, image } = req.body;
                        var newCategory = { name, image };
                        await category.create(newCategory);
                        return res.status(200).json({ success: true, message: 'Thêm danh mục thành công' });
                    }
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
});

//Sửa danh mục
//https://and103-0ru9.onrender.com/category/update
router.put("/update", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
                if (err) {
                    return res.status(403).json({ "status": 403, "err": err });
                } else {
                    if (decoded.role != "admin") {
                        return res.status(400).json({ success: false, message: 'Không phải tài khoản admin không được sửa danh mục' });
                    } else {
                        const { id, name, image } = req.body;
                        var item = await category.findById(id);
                        if (!item) {
                            res.status(400).json({ success: false, message: 'Không tồn tại danh mục này' });
                        } else {
                            item.name = name ? name : item.name;
                            item.image = image ? image : item.image;
                            await item.save();
                            res.status(200).json({ success: true, message: 'Sửa danh mục thành công', item: item });
                        }
                    }
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
});

//Xóa danh mục
//https://and103-0ru9.onrender.com/category/delete?id=
router.delete("/delete", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
                if (err) {
                    return res.status(403).json({ "status": 403, "err": err });
                } else {
                    if (decoded.role != "admin") {
                        return res.status(400).json({ success: false, message: 'Không phải tài khoản admin không được xóa danh mục' });
                    } else {
                        const { id } = req.query;
                        await category.findByIdAndDelete(id);
                        res.status(200).json({ success: true, message: 'Xóa danh mục thành công', item: item });
                    }
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
});

module.exports = router;