const express = require("express");
const {
    adminRegisterTeacher,
    loginTeacher,
    getAllTeachersAdmin,
    getSingleTeacherAdmin,
    getTeacherProfile,
    updateTeacherCtrl, 
    adminUpdateTeacher} = require("../../controller/Staff/teacherCtrl");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

const teacherRouter = express.Router();

teacherRouter.post("/admin/register", isLogin, isAdmin, adminRegisterTeacher);
teacherRouter.post("/login", loginTeacher);
teacherRouter.get("/admin", isLogin, isAdmin, getAllTeachersAdmin);
teacherRouter.get("/profile", isTeacherLogin, isTeacher, getTeacherProfile);
teacherRouter.get("/:teacherID/admin", isLogin, isAdmin, getSingleTeacherAdmin);
teacherRouter.put("/", isTeacherLogin, isTeacher, updateTeacherCtrl);
teacherRouter.put("/:teacherID/admin", isLogin, isAdmin, adminUpdateTeacher);

module.exports = teacherRouter;