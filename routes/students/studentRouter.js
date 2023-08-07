const express = require("express");
const { 
    adminRegisterStudent, 
    loginStudent, 
    getStudentProfile, 
    getAllStudentsAdmin, 
    getSingleStudentAdmin, 
    updateStudent, 
    adminUpdateStudent,
    writeExam, 
} = require("../../controller/students/studentsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const Student = require("../../model/Academic/Student");
const roleRestriction = require("../../middlewares/roleRestriction");
const advancedResults = require("../../middlewares/advancedResults");

const studentRouter = express.Router();

studentRouter.post("/admin/register", isAuthenticated(Admin), roleRestriction('admin'), adminRegisterStudent);
studentRouter.post("/login", loginStudent);
studentRouter.get("/profile", isAuthenticated(Student), roleRestriction('student'), getStudentProfile);
studentRouter.get("/admin", isAuthenticated(Admin), roleRestriction('admin'), 
            advancedResults(Student, 'examResults' ), getAllStudentsAdmin);
studentRouter.get("/:studentID/admin", isAuthenticated(Admin), roleRestriction('admin'), getSingleStudentAdmin);
studentRouter.put("/update", isAuthenticated(Student), roleRestriction('student'), updateStudent);
studentRouter.put("/:studentID/update/admin", isAuthenticated(Admin), roleRestriction('admin'), adminUpdateStudent);
studentRouter.post("/exam/:examID/write", isAuthenticated(Student), roleRestriction('student'), writeExam);

module.exports = studentRouter;