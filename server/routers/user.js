const express = require(`express`);
const router = express.Router();
const service = require("../services/userService.js");
const { body } = require("express-validator");

// 登录/注册校验
const vaildator = [
  body("user").isString().withMessage("用户名类型错误"),
  body("pwd").isString().withMessage("密码类型错误"),
];

router.post("/login", vaildator, service.login);
router.post("/register", vaildator, service.register);

module.exports = router;
