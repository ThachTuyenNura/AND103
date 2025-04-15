var express = require('express');
var router = express.Router();
var product = require('../models/product');
var upload = require('../util/upload');

//upload 1 file
router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                return res.json({ status: 0, link: "" });
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: "" });
        }
    });

//upload nhiều file
router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
                return res.json({ status: 0, link: [] });
            } else {
                const url = [];
                for (const singleFile of files) {
                    url.push(`http://localhost:3000/images/${singleFile.filename}`);
                }
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: [] });
        }
    });


//lấy danh sách product
router.get("/list", async function (req, res, next) {
    var list = await product.find();
    res.status(200).json({ success: true, message: "Thành công", list: list });
})

//thêm sản phẩm mới
router.post("/add", async function (req, res, next) {
    const { name, price, quantity, category } = req.body;
    var newItem = { name, price, quantity, category };
    await product.create(newItem);
    res.status(200).json({ success: true, message: "Thành công", list: product });
})

//chỉnh sửa thông tin
// localhost:3000/products/edit
router.put("/edit", async function (req, res, next) {
    const { id, name, price, quantity } = req.body;
    // var itemUpdate = await product.find({ _id: id });
    var itemUpdate = await product.findById(id);
    if (!itemUpdate) {
        res.status(400).json({ success: false, message: "Không tìm thấy sản phẩm" });
    } else {
        itemUpdate.name = name ? name : itemUpdate.name;
        itemUpdate.price = price ? price : itemUpdate.price;
        itemUpdate.quantity = quantity ? quantity : itemUpdate.quantity;
        await itemUpdate.save();
        res.status(200).json({ success: true, message: "Thành công", item: itemUpdate });
    }
})

//xóa sản phẩm
//localhost:3000/products/delete
router.delete("/delete", async function (req, res, next) {
    const { id } = req.query;
    var itemDelete = await product.findByIdAndDelete(id);
    if (!itemDelete) {
        res.status(400).json({ success: false, message: "Không tìm thấy id này" });
    } else {
        res.status(200).json({ success: true, message: "Thành công" });
    }
})

//lấy danh sách sản phẩm có giá từ 3000 đến 6000
router.get("/listDK", async function (req, res, next) {
    // var list = product.find({ price: { $gt: 6000 } });
    var list = product.find({ price: { $gte: 3000, $lte: 6000 } });
    res.status(200).json({ success: true, message: "Thành công", list: list });
})

//lấy danh sách sản phẩm có giá lớn hơn 3000 hoặc số lượng bé hơn 10
router.get("/listDK", async function (req, res, next) {
    var list = product.find({ $or: [{ price: { $gt: 3000 } }, { quantity: { $lt: 10 } }] });
    res.status(200).json({ success: true, message: "Thành công", list: list });
})

// var listData = [
//     {
//         "id": 1,
//         "name": "Bánh",
//         "price": 5000
//     },
//     {
//         "id": 2,
//         "name": "Kẹo",
//         "price": 7000
//     },
//     {
//         "id": 3,
//         "name": "Trái cây",
//         "price": 10000
//     }
// ];

// //get: lấy, post: thêm, put: sửa, delete: xóa
// //Lấy danh sách sản phẩm
// //localhost:3000/products/list
// router.get("/list", function (req, res, next) {
//     res.status(200).json({ success: true, message: "Thành công", list: listData })
// });

// //Lấy thông tin sản phẩm theo id dùng query
// //localhost:3000/products/detail?id=1&name='Bánh'&price=5000
// //localhost:3000/products/detail?id=1
// router.get("/detail", function (req, res, next) {
//     const { id } = req.query;
//     var item = listData.find(p => p.id == id);//Kiểu lambda hay arrow function
//     if (!item) {
//         res.status(400).json({ success: false, message: 'Không tìm thấy' });
//     } else {
//         res.status(200).json({ success: true, message: "Thành công", data: item });
//     }
// });

// //Lấy thông tin sản phẩm theo id dùng params
// //localhost:3000/products/detail/1
// router.get("/detail/:id", function (req, res, next) {
//     const { id } = req.params;
//     var item = listData.find(p => p.id == id);
//     if (!item) {
//         res.status(400).json({ success: false, message: "Không tìm thấy sản phẩm" });
//     } else {
//         res.status(200).json({ success: true, message: "Thành công", data: item });
//     }
// })

// //Lấy danh sách sản phẩm có giá trong khoảng từ min đến max
// //localhost:3000/products/range?min=6000&max=9000
// router.get("/range", function (req, res, next) {
//     const { min, max } = req.query;
//     var list = listData.filter(p => p.price >= Number(min) && p.price <= Number(max));
//     res.status(200).json({ success: true, message: "Thành công", list: list });
// })

// //Thêm sản phẩm mới
// //localhost:3000/products/add
// router.post("/add", function (req, res, next) {
//     const { id, name, price } = req.body;
//     var newItem = { id, name, price };
//     listData.push(newItem);
//     res.status(200).json({ success: true, message: "Thành công", list: listData });
// })

// //Cập nhật thông tin sản phẩm bất kỳ theo id
// //localhost:3000/products/update
// router.put("/update", function (req, res, next) {
//     const { id, name, price } = req.body;
//     var itemUpdate = listData.find(p => p.id == id);
//     if (!itemUpdate) {
//         res.status(400).json({ success: false, message: "Không tìm thấy sản phẩm" });
//     } else {
//         itemUpdate.name = name ? name : itemUpdate.name;
//         itemUpdate.price = price ? price : itemUpdate.price;
//         res.status(200).json({ success: true, message: "Cập nhật thành công", item: itemUpdate });
//     }
// })

// //Xóa sản phẩm
// //localhost:3000/products/delete?id=2
// router.delete("/delete", function (req, res, next) {
//     const { id } = req.query;
//     var indexItem = listData.findIndex(p => p.id == id);
//     if (indexItem == -1) {
//         res.status(400).json({ success: false, message: "Không tìm thấy sản phẩm" });
//     } else {
//         listData.splice(indexItem, 1);
//         res.status(200).json({ success: true, message: "Thành công" });
//     }
// })

module.exports = router;
