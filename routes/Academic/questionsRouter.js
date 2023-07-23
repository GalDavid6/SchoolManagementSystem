const express = require("express");
const { 
    createQuestion, 
    getQuestions, 
    getQuestion, 
    updateQuestion
} = require("../../controller/Academic/questionsCtrl");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

const questionsRouter = express.Router();

questionsRouter.post("/:examID", isTeacherLogin, isTeacher, createQuestion);
questionsRouter.get("/", isTeacherLogin, isTeacher, getQuestions);

questionsRouter
.route("/:id")
.get(isTeacherLogin, isTeacher, getQuestion)
.put(isTeacherLogin, isTeacher, updateQuestion);

module.exports = questionsRouter;