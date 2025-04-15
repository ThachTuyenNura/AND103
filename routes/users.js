var express = require('express');
var router = express.Router();
var sendMail = require('../util/mailConfig');
var path = require('path');
var fs = require('fs');
var userModel = require("../models/user");
const JWT = require("jsonwebtoken");
const config = require("../util/config");

//lấy danh sách user
//https://and103-0ru9.onrender.com/users/list
router.get("/list", async function (req, res, next) {
  try {
    var list = await userModel.find();
    res.status(400).json({ success: true, message: "Lấy danh sách thành công", list: list });
  } catch (error) {
    res.status(400).json({ success: false, message: "Lấy danh sách thất bại" });
  }
});

//lấy chi tiết 1 user
//https://and103-0ru9.onrender.com/users/detail?id=67fdebc000e7f5b3ff46e153
router.get("/detail", async function (req, res, next) {
  try {
    const { id } = req.query;
    const userDetail = await userModel.findById(id);
    res.status(400).json({ success: true, message: "Lấy danh sách thành công", list: userDetail });
  } catch (error) {
    res.status(400).json({ success: false, message: "Lấy danh sách thất bại" });
  }
});

//Đăng ký
//https://and103-0ru9.onrender.com/users/register
router.post("/register", async function (req, res, next) {
  try {
    const { email, password, name, gender, phone, address } = req.body;
    if (!email) {
      res.status(400).json({ seccess: false, message: 'Hãy nhập email' })
    } else {
      const existEmail = await userModel.findOne({ email: email });
      if (existEmail) {
        return res.status(400).json({ success: false, message: 'Email đã tồn tại, mời bạn nhập email khác' });
      }
      if (password.length < 5 || password.length > 30) {
        return res.status(400).json({ success: false, message: "Mật khẩu tối thiểu 5 ký tự, tối đa 30 ký tự" });
      }
      if (phone.length != 10) {
        return res.status(400).json({ success: false, message: "Số điện thoại phải có 10 số" });
      }
      var newUser = { email, password, name, gender, phone, address };
      await userModel.create(newUser);
      res.status(200).json({ status: true, message: "Đăng ký thành công" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Đăng ký thất bại" });
  }
});

//Đăng nhập
//https://and103-0ru9.onrender.com/users/login
router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email, password: password });
    if (!user) {
      res.status(400).json({ status: false, message: "Sai email hoặc password" });
    } else {
      const token = JWT.sign({ id: user.id, email: user.email, role: user.role }, config.SECRETKEY, { expiresIn: '1m' });
      const refreshToken = JWT.sign({ id: user.id, email: user.email, role: user.role }, config.SECRETKEY, { expiresIn: '1d' });
      res.status(200).json({ status: true, message: "Đăng nhập thành công", token: token, refreshToken: refreshToken });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Đăng nhập thất bại" });
  }
});

//Tạo email
//https://and103-0ru9.onrender.com/users/create
router.post("/create", async function (req, res, next) {
  try {//fef
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
        if (err) {
          res.status(403).json({ "Status": 403, "err": err });
        } else {
          if (decoded.role != "admin") {
            res.status(400).json({ success: false, message: "Không phải tài khoản admin" });
          } else {
            const { email, password, name, gender, phone, address, role } = req.body;
            var newEmail = { email, password, name, gender, phone, address, role };
            await userModel.create(newEmail);
            res.status(400).json({ success: true, message: "Tạo tài khoản thành công" });
          }
        }
      })
    } else {
      return res.status(401).json({ "Status": 401, "err": err });
    }
  } catch (error) {
    return res.status(401).json({ "Status": 401, "err": error });
  }
});

//Sửa thông tin user
//https://and103-0ru9.onrender.com/users/update
router.put("/update", async function (req, res, next) {
  try {//fef
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
        if (err) {
          res.status(403).json({ "Status": 403, "err": err });
        } else {
          const user = await userModel.findOne({ id: decoded.id });
          if (!user) {
            return res.status(404).json({ status: false, message: "Không tìm thấy người dùng" });
          } else {
            const { name, gender, phone, address, role } = req.body;
            user.name = name ? name : user.name;
            user.gender = gender ? gender : user.gender;
            user.phone = phone ? phone : user.phone;
            user.address = address ? address : user.address;
            user.role = role ? role : user.role;
            await user.save();
            res.status(200).json({ success: true, message: "Sửa thông tin Thành công", list: user });
          }
        }
      })
    } else {
      return res.status(401).json({ "Status": 401, "err": err });
    }
  } catch (error) {
    return res.status(401).json({ "Status": 401, "err": error });
  }
});

//Xóa user
//https://and103-0ru9.onrender.com/users/delete?id=67fe0697d1a55df8f2b6090c
router.delete("/delete", async function (req, res, next) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
        if (err) {
          return res.status(403).json({ "Status": 403, "err": err });
        } else {
          if (decoded.role != "admin") {
            res.status(400).json({ success: false, message: "Không phải tài khoản admin" });
          } else {
            const { id } = req.query;
            await userModel.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: "Xóa user Thành công" });
          }
        }
      })
    } else {
      return res.status(401).json({ "Status": 401, "err": err });
    }
  } catch (error) {
    return res.status(401).json({ "Status": 401, "err": error });
  }
});

//Đổi password
//https://and103-0ru9.onrender.com/users/change-password
router.put("/change-password", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
        if (err) {
          return res.status(403).json({ "status": 403, "err": err });
        } else {
          const { oldPassword, newPassword } = req.body;
          if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Nhập mật khẩu cũ và mật khẩu mới" });
          }

          const user = await userModel.findOne({ id: decoded.id });

          if (user.password !== oldPassword) {
            return res.status(400).json({ success: false, message: "Mật khẩu cũ không chính xác" });
          }
          if (newPassword.length < 5 || newPassword.length > 30) {
            return res.status(400).json({ success: false, message: "Mật khẩu mới phải từ 5 đến 30 ký tự" });
          }
          user.password = newPassword;
          await user.save();
          res.status(200).json({ success: true, message: "Đổi mật khẩu thành công" });
        }
      });
    } else {
      res.status(401).json({ "status": 401, "err": err });
    }
  } catch (error) {
    res.status(401).json({ "status": 401, "err": error });
  }
});

//Gửi email thường
//https://and103-0ru9.onrender.com/users/send-mail
router.post("/send-mail", async function (req, res, next) {
  try {
    const { to, subject, content } = req.body;
    const mailOptions = {
      from: "ThachTuyenne <thachtuyen31@gmail.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Gửi mail thất bại" });
  }
});

//Gửi email HTML
//https://and103-0ru9.onrender.com/users/send-html
router.post("/send-html", async function (req, res, next) {
  try {
    const { to, subject } = req.body;
    const htmlPath = path.join(__dirname, "../util/guiOTP.html");
    let content = fs.readFileSync(htmlPath, "utf8");
    content = content.replace("{{email}}", to);
    const mailOptions = {
      from: "ThachTuyenne <thachtuyen31@gmail.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Gửi mail thất bại" });
  }
});

module.exports = router;