const express = require("express");
const { 
    createExam, 
    getExams, 
    getExam, 
    updateExam,
    deleteExam
} = require("../../controller/Academic/examsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Teacher = require("../../model/Staff/Teacher");
const roleRestriction = require("../../middlewares/roleRestriction");
const advancedResults = require("../../middlewares/advancedResults");
const Exam = require("../../model/Academic/Exam");

const examRouter = express.Router();

examRouter
.route("/")
.post(isAuthenticated(Teacher), roleRestriction('teacher'), createExam)
.get(isAuthenticated(Teacher), roleRestriction('teacher'), advancedResults(Exam, {
    path: 'questions',
    populate: {
        path: "createdBy",
    },
}), getExams);

examRouter
.route("/:id")
.get(isAuthenticated(Teacher), roleRestriction('teacher'), getExam)
.put(isAuthenticated(Teacher), roleRestriction('teacher'), updateExam)
.delete(isAuthenticated(Teacher), roleRestriction('teacher'), deleteExam);

module.exports = examRouter; 