var express = require('express');
var router = express.Router();
var sendMail = require('../util/mailConfig');
var path = require('path');
var fs = require('fs');
var userModel = require("../models/user");
const JWT = require("jsonwebtoken");
const config = require("../util/config");

//localhost:3000/users/register
router.post("/register", async function (req, res, next) {
  try {
    const { username, password, name } = req.body;
    var newUser = { username, password, name };
    await userModel.create(newUser);
    res.status(200).json({ status: true, message: "Đăng ký thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: "Đăng ký thất bại" });
  }
});

//localhost:3000/users/login
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username, password: password });
    if (!user) {
      res.status(400).json({ status: false, message: "Đăng nhập thất bại" });
    } else {
      const token = JWT.sign({ id: user.username }, config.SECRETKEY, { expiresIn: '30s' });
      const refreshToken = JWT.sign({ id: user.username }, config.SECRETKEY, { expiresIn: '1d' });
      res.status(200).json({ status: true, message: "Đăng nhập thành công", token: token, refreshToken: refreshToken });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Đăng nhập thất bại" });
  }
});

//localhost:3000/users/send-mail
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

//localhost:3000/users/send-html
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