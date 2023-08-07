const express = require("express");
const {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubject
    } = require("../../controller/Academic/subjectsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");
const advancedResults = require("../../middlewares/advancedResults");
const Subject = require("../../model/Academic/Subject");
const subjectRouter = express.Router();

subjectRouter.post('/:programID', isAuthenticated(Admin), roleRestriction('admin'), createSubject);
subjectRouter.get("/", isAuthenticated(Admin), roleRestriction('admin'), advancedResults(Subject), getSubjects);
subjectRouter.get("/:id", isAuthenticated(Admin), roleRestriction('admin'), getSubject);
subjectRouter.put("/:id", isAuthenticated(Admin), roleRestriction('admin'), updateSubject);
subjectRouter.delete("/:id", isAuthenticated(Admin), roleRestriction('admin'), deleteSubject);



module.exports = subjectRouter;