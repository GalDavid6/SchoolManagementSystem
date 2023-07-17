const express = require("express");
const { adminRegisterTeacher, loginTeacher, getAllTeachersAdmin } = require("../../controller/Staff/teacherCtrl");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const teacherRouter = express.Router();

teacherRouter.post("/admin/register", isLogin, isAdmin, adminRegisterTeacher);
teacherRouter.post("/login", loginTeacher);
teacherRouter.get("/admin", isLogin, isAdmin, getAllTeachersAdmin);
module.exports = teacherRouter;