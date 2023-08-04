const express = require("express");
const { 
    checkExamResult, 
    getAllExamsResults, 
    adminToggleExamResult
} = require("../../controller/Academic/examResultCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const Student = require("../../model/Academic/Student");
const roleRestriction = require("../../middlewares/roleRestriction");

const examResultRouter = express.Router();

examResultRouter.get("/:id",isAuthenticated(Student), roleRestriction('student'), checkExamResult);
examResultRouter.get("/",isAuthenticated(Student), roleRestriction('student'), getAllExamsResults);
examResultRouter.put("/:id/admin-toggle-publish", isAuthenticated(Admin), roleRestriction('admin'), adminToggleExamResult);

module.exports = examResultRouter;