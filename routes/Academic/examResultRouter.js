const express = require("express");
const { 
    checkExamResult, 
    getAllExamsResults, 
    adminToggleExamResult
} = require("../../controller/Academic/examResultCtrl");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isStudent = require("../../middlewares/isStudent");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const examResultRouter = express.Router();

examResultRouter.get("/:id",isStudentLogin, isStudent, checkExamResult);
examResultRouter.get("/",isStudentLogin, isStudent, getAllExamsResults);
examResultRouter.put("/:id/admin-toggle-publish", isLogin, isAdmin, adminToggleExamResult);

module.exports = examResultRouter;