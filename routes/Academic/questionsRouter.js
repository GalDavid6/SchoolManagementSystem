const express = require("express");
const { 
    createQuestion, 
    getQuestions, 
    getQuestion, 
    updateQuestion
} = require("../../controller/Academic/questionsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Teacher = require("../../model/Staff/Teacher");
const roleRestriction = require("../../middlewares/roleRestriction");

const questionsRouter = express.Router();

questionsRouter.post("/:examID", isAuthenticated(Teacher), roleRestriction('teacher'), createQuestion);
questionsRouter.get("/", isAuthenticated(Teacher), roleRestriction('teacher'), getQuestions);

questionsRouter
.route("/:id")
.get(isAuthenticated(Teacher), roleRestriction('teacher'), getQuestion)
.put(isAuthenticated(Teacher), roleRestriction('teacher'), updateQuestion);

module.exports = questionsRouter;