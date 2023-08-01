const express = require('express');
const {
     globalErrHandler,
     notFoundErr,
     } = require('../middlewares/globalErrHandler');
const adminRouter = require('../routes/Staff/adminRouter');
const academicYearRouter = require("../routes/Academic/academicYearRouter");
const academicTermRouter = require('../routes/Academic/academicTermRouter');
const classLevelRouter = require('../routes/Academic/classLevelRouter');
const programRouter = require('../routes/Academic/programRouter');
const subjectRouter = require('../routes/Academic/subjectRouter');
const yearGroupRouter = require('../routes/Academic/yearGroupRouter');
const teacherRouter = require('../routes/Staff/teacherRouter');
const examRouter = require('../routes/Academic/examRouter');
const studentRouter = require('../routes/students/studentRouter');
const questionsRouter = require('../routes/Academic/questionsRouter');
const examResultRouter = require('../routes/Academic/examResultRouter');


const app = express();

app.use(express.json()); // pass incoming json data

// Routes
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/exam-results", examResultRouter);

// Error Middleware
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
