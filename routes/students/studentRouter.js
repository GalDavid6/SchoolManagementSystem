const express = require("express");
const { 
    adminRegisterStudent, loginStudent, getStudentProfile, getAllStudentsAdmin, getSingleStudentAdmin, updateStudent, adminUpdateStudent 
} = require("../../controller/students/studentsCtrl");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const { isValidObjectId } = require("mongoose");

const studentRouter = express.Router();

studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);
studentRouter.post("/login", loginStudent);
studentRouter.get("/profile", isStudentLogin, isStudent, getStudentProfile);
studentRouter.get("/admin", isLogin, isAdmin, getAllStudentsAdmin);
studentRouter.get("/:studentID/admin", isLogin, isAdmin, getSingleStudentAdmin);
studentRouter.put("/update", isStudentLogin, isStudent, updateStudent);
studentRouter.put("/:studentID/update/admin", isLogin, isAdmin, adminUpdateStudent);

module.exports = studentRouter;