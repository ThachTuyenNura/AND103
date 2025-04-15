var express = require('express');
var router = express.Router();
var sinhvien = require('../models/sinhvien');
const JWT = require("jsonwebtoken");
const config = require("../util/config");

//lấy toàn bộ danh sách sinh viên
//localhost:3000/sinhviens/list
router.get("/list", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    //xử lý chức năng tương ứng với API
                    var list = await sinhvien.find();
                    res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            });
        } else {
            res.status(401).json({ "status": 401 });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     var list = await sinhvien.find();
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Thất bại" });
    // }
})

//lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
//localhost:3000/sinhviens/list/cNTt
router.get("/list/:key", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { key } = req.params;
                    const isValid = await sinhvien.exists({ department: { $regex: key, $options: "i" } });
                    if (!isValid) {
                        return res.status(400).json({ success: false, message: "Không có bộ môn " + key + " trong danh sách" });
                    }
                    var list = await sinhvien.find({ department: { $regex: key, $options: "i" } });
                    res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            })
        } else {
            res.status(401).json({ "status": 401 });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     const { key } = req.params;
    //     const isValid = await sinhvien.exists({ department: { $regex: key, $options: "i" } });
    //     if (!isValid) {
    //         return res.status(400).json({ success: false, message: "Không có bộ môn " + key + " trong danh sách" });
    //     }
    //     var list = await sinhvien.find({ department: { $regex: key, $options: "i" } });
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

//Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
//localhost:3000/sinhviens/average?avg1=6.5&avg2=8.5
router.get("/average", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { avg1, avg2 } = req.query;
                    var list = await sinhvien.find({ averageScore: { $gte: avg1, $lte: avg2 } });
                    res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            })
        } else {
            res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
        }
    } catch (error) {
        res.status(401).json({ "status": 401, "err": error });
    }
    // try {
    //     const { avg1, avg2 } = req.query;
    //     var list = await sinhvien.find({ averageScore: { $gte: avg1, $lte: avg2 } });
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

//Tìm kiếm thông tin của sinh viên theo MSSV
//localhost:3000/sinhviens/search?mssv=67ee0129655ab184104aaee2
router.get("/search", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { mssv } = req.query;
                    var sv = await sinhvien.findById(mssv);
                    if (sv) {
                        res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", sv: sv });
                    } else {
                        res.status(400).json({ success: false, message: "Lấy danh sách sinh viên thất bại" });
                    }
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (err) {
        res.status(401).json({ "status": 401, "err": err });
    }
    // try {
    //     const { mssv } = req.query;
    //     var sv = await sinhvien.findById(mssv);
    //     if (sv) {
    //         res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: sv });
    //     }
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

//Thêm mới sinh viên
//localhost:3000/sinhviens/add
router.post("/add", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { name, averageScore, department, age } = req.body;
                    var newSV = { name, averageScore, department, age };
                    await sinhvien.create(newSV);
                    res.status(200).json({ success: true, message: "Thêm thành công" });
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     const { name, averageScore, department, age } = req.body;
    //     var newSV = { name, averageScore, department, age };
    //     await sinhvien.create(newSV);
    //     res.status(200).json({ success: true, message: "Thêm sinh viên Thành công" });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Thêm sinh viên Thất bại" });
    // }
})

//Thay đổi thông tin sinh viên theo MSSV
//localhost:3000/sinhviens/edit
router.put("/edit", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { mssv, name, averageScore, department, age } = req.body;
                    var svUpdate = await sinhvien.findById(mssv);
                    if (svUpdate) {
                        svUpdate.name = name ? name : svUpdate.name;
                        svUpdate.averageScore = averageScore ? averageScore : svUpdate.averageScore;
                        svUpdate.department = department ? department : svUpdate.department;
                        svUpdate.age = age ? age : svUpdate.age;
                        await svUpdate.save();
                        res.status(200).json({ success: true, message: "Sửa thông tin Thành công", list: svUpdate });
                    } else {
                        res.status(400).json({ success: false, message: "Không có mã sinh viên: " + mssv + " trong danh sách" });
                    }
                }
            })
        } else {
            res.status(401).json({ "status": 401 });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     const { mssv, name, averageScore, department, age } = req.body;
    //     var svUpdate = await sinhvien.findById(mssv);
    //     if (svUpdate) {
    //         svUpdate.name = name ? name : svUpdate.name;
    //         svUpdate.averageScore = averageScore ? averageScore : svUpdate.averageScore;
    //         svUpdate.department = department ? department : svUpdate.department;
    //         svUpdate.age = age ? age : svUpdate.age;
    //         await svUpdate.save();
    //         res.status(200).json({ success: true, message: "Sửa thông tin Thành công", list: svUpdate });
    //     }
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Sửa thông tin thất bại" });
    // }
})

//Xóa sinh viên
//localhost:3000/sinhviens/delete?mssv=
router.delete("/delete", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { mssv } = req.query;
                    await sinhvien.findByIdAndDelete(mssv);
                    res.status(200).json({ success: true, message: "Xóa thành công" });
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     const { mssv } = req.query;
    //     await sinhvien.findByIdAndDelete(mssv);
    //     res.status(200).json({ success: true, message: "Xóa sinh viên thành công" });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Xóa sinh viên thất bại" });
    // }
})

//Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
//localhost:3000/sinhviens/cntt9?department=cNTt&averageScore=9
router.get("/cntt9", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async (err, id) => {
                if (err) {
                    return res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { averageScore, department } = req.query;
                    var isValid = await sinhvien.exists({ department: { $regex: department, $options: "i" } });
                    if (!isValid) {
                        return res.status(400).json({ success: false, message: "Không có bộ môn " + department + " trong danh sách" });
                    }
                    var list = await sinhvien.find({ $and: [{ department: { $regex: department, $options: "i" } }, { averageScore: { $gte: averageScore } }] });
                    return res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     const { department, averageScore } = req.query;
    //     var isValid = await sinhvien.exists({ department: { $regex: department, $options: "i" } });
    //     if (!isValid) {
    //         return res.status(400).json({ success: false, message: "Không có bộ môn " + key + " trong danh sách" });
    //     }
    //     var list = await sinhvien.find({ $and: [{ department: { $regex: department, $options: "i" } }, { averageScore: { $gte: averageScore } }] });
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

//Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
//localhost:3000/sinhviens/all?age1=18&age2=20&department=cNTt&averageScore=6.5
router.get("/all", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async (err, id) => {
                if (err) {
                    return res.status(403).json({ "status": 403, "err": err });
                } else {
                    const { age1, age2, department, averageScore } = req.query;
                    var isValid = await sinhvien.exists({ department: { $regex: department, $options: "i" } });
                    if (!isValid) {
                        return res.status(400).json({ success: false, message: "Không có bộ môn này trong danh sách" });
                    }
                    var list = await sinhvien.find({ $and: [{ age: { $gte: age1, $lte: age2 } }, { department: { $regex: department, $options: "i" } }, { averageScore: { $gte: averageScore } }] });
                    return res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (error) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     const { age1, age2, department, averageScore } = req.query;
    //     var isValid = await sinhvien.exists({ department: { $regex: department, $options: "i" } });
    //     if (!isValid) {
    //         return res.status(400).json({ success: false, message: "Không có bộ môn này trong danh sách" });
    //     }
    //     var list = await sinhvien.find({ $and: [{ age: { $gte: age1, $lte: age2 } }, { department: { $regex: department, $options: "i" } }, { averageScore: { $gte: averageScore } }] });
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

//Sắp xếp danh sách sinh viên tăng dần theo dtb
//localhost:3000/sinhviens/sort
router.get("/sort", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async (err, id) => {
                if (err) {
                    return res.status(403).json({ "status": 403, "err": err });
                } else {
                    var list = await sinhvien.find().sort({ averageScore: 1 });
                    return res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (err) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     var list = await sinhvien.find().sort({ averageScore: 1 });
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

//Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
//localhost:3000/sinhviens/maxcntt
router.get("/maxcntt", async function (req, res, next) {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async (err, id) => {
                if (err) {
                    return res.status(403).json({ "Status": 403, "err": err });
                } else {
                    var svCNTT = await sinhvien.find({ department: "CNTT" }).sort({ averageScore: -1 });
                    var maxAverage = svCNTT[0].averageScore;
                    var list = await sinhvien.find({ averageScore: { $eq: maxAverage } });
                    return res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
                }
            })
        } else {
            res.status(401).json({ "status": 401, "err": err });
        }
    } catch (err) {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     var svCNTT = await sinhvien.find({ department: "CNTT" }).sort({ averageScore: -1 });
    //     var maxAverage = Number(svCNTT[0].averageScore);
    //     var list = await sinhvien.find({ averageScore: { $eq: maxAverage } })
    //     res.status(200).json({ success: true, message: "Lấy danh sách sinh viên thành công", list: list });
    // } catch (error) {
    //     res.status(400).json({ success: false, message: "Lấy danh sách sinh viên Thất bại" });
    // }
})

module.exports = router;