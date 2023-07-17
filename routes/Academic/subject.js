const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubject
    } = require("../../controller/Academic/subjectsCtrl");
const subjectRouter = express.Router();

subjectRouter.post('/:programID', isLogin, isAdmin, createSubject);
subjectRouter.get("/", isLogin, isAdmin, getSubjects);
subjectRouter.get("/:id", isLogin, isAdmin, getSubject);
subjectRouter.put("/:id", isLogin, isAdmin, updateSubject);
subjectRouter.delete("/:id", isLogin, isAdmin, deleteSubject);



module.exports = subjectRouter;