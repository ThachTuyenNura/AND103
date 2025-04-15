var express = require('express');
var router = express.Router();

listSinhVien = [
    {
        "mssv": 1,
        "ten": "Nguyễn Văn Tuấn",
        "lop": "MD18401",
        "dtb": 7
    },
    {
        "mssv": 2,
        "ten": "Trần Bình",
        "lop": "MD18401",
        "dtb": 9.1
    },
    {
        "mssv": 3,
        "ten": "Lê Trang",
        "lop": "MD18402",
        "dtb": 8
    }, {
        "mssv": 4,
        "ten": "Lý Trí",
        "lop": "MD18402",
        "dtb": 9.2
    }
]

//Lấy danh sách tất cả sinh viên
//localhost:3000/students/list
router.get("/list", function (req, res, next) {
    res.status(200).json({ success: true, message: "Thành công", list: listSinhVien });
})


//Thêm sinh viên
//localhost:3000/students/add
router.post("/add", function (req, res, next) {
    const { mssv, ten, lop, dtb } = req.body;
    var checkMSSV = listSinhVien.find(p => p.mssv == mssv);
    if (checkMSSV) {
        res.status(400).json({ success: false, message: "Trùng MSSV" });
    } else {
        var newStudent = { mssv, ten, lop, dtb };
        listSinhVien.push(newStudent);
        res.status(200).json({ success: true, message: "Thêm Thành công" });
    }
})

//Thay đổi thông tin sinh viên theo MSSV
//localhost:3000/students/update
router.put("/update", function (req, res, next) {
    const { mssv, ten, lop, dtb } = req.body;
    var studentUpdate = listSinhVien.find(p => p.mssv == mssv);
    if (!studentUpdate) {
        res.status(400).json({ success: false, message: "Không tìm thấy sinh viên này" });
    } else {
        studentUpdate.ten = ten ? ten : studentUpdate.ten;
        studentUpdate.lop = lop ? lop : studentUpdate.lop;
        studentUpdate.dtb = dtb ? dtb : studentUpdate.dtb;
        res.status(200).json({ success: true, message: "Cập nhật thành công" });
    }
})

//Xóa 1 sinh viên ra khỏi danh sách
//localhost:3000/students/delete?mssv=3
router.delete("/delete", function (req, res, next) {
    const { mssv } = req.query;
    var indexStudent = listSinhVien.findIndex(p => p.mssv == mssv);
    if (indexStudent == -1) {
        res.status(400).json({ success: false, message: "Không tìm thấy sinh viên này" });
    } else {
        listSinhVien.splice(indexStudent, 1);
        res.status(200).json({ success: true, message: "Thành công" });
    }
})

//Lấy thông tin chi tiết của 1 sinh viên theo mssv
//localhost:3000/students/detail?mssv=3
router.get("/detail", function (req, res, next) {
    const { mssv } = req.query;
    var detailStudent = listSinhVien.find(p => p.mssv == mssv);
    if (!detailStudent) {
        res.status(400).json({ success: false, message: "Không tìm thấy sinh viên này" });
    } else {
        res.status(200).json({ success: true, message: "Thành công", data: detailStudent });
    }
})

//Lấy danh sách các sinh viên có điểm trung bình từ 6.5 đến 8.0
//localhost:3000/students/range/6.5/8
router.get("/range/:min/:max", function (req, res, next) {
    const { min, max } = req.params;
    const rangeDTB = listSinhVien.filter(p => p.dtb >= Number(min) && p.dtb <= Number(max));
    res.status(200).json({ success: true, message: "Thành công", list: rangeDTB });
})

//Lấy ra danh sách các sinh viên thuộc lớp MD18401 và có điểm trung bình lớn hơn 9
//localhost:3000/students/general?lop=MD18401&dtb=9
router.get("/general", function (req, res, next) {
    const { lop, dtb } = req.query;
    var list = listSinhVien.filter(p => p.lop == lop && p.dtb > dtb);
    res.status(200).json({ success: true, message: "Thành công", list: list });
})

//Sắp xếp danh sách sinh viên theo điểm trung bình
//localhost:3000/students/sort
router.get("/sort", function (req, res, next) {
    for (let i = 0; i < listSinhVien.length - 1; i++) {
        for (let j = i + 1; j < listSinhVien.length; j++) {
            if (listSinhVien[i].dtb < listSinhVien[j].dtb) {
                let t = listSinhVien[i];
                listSinhVien[i] = listSinhVien[j];
                listSinhVien[j] = t;
            }
        }
    }
    res.status(200).json({ success: true, message: "Thành công", list: listSinhVien });
})

//Tìm ra sinh viên có điểm trung bình cao nhất thuộc lớp MD18401
//localhost:3000/students/maxdtb
router.get("/maxdtb", function (req, res, next) {
    var listMD18401 = listSinhVien.filter(p => p.lop == "MD18401");
    for (let i = 0; i < listMD18401.length - 1; i++) {
        for (let j = i + 1; j < listMD18401.length; j++) {
            if (listMD18401[i].dtb < listMD18401[j].dtb) {
                let t = listMD18401[i];
                listMD18401[i] = listMD18401[j];
                listMD18401[j] = t;
            }
        }
    }
    var studentMaxDTB = listMD18401[0].dtb;
    var listMaxDTB = listMD18401.filter(p => p.dtb >= Number(studentMaxDTB));
    res.status(200).json({ success: true, message: "Thành công", list: listMaxDTB });
})

module.exports = router;