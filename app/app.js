const express = require('express');
const {
     globalErrHandler,
     notFoundErr,
     } = require('../middlewares/globalErrHandler');
const adminRouter = require('../routes/Staff/adminRouter');
const academicYearRouter = require("../routes/Academic/academicYear");
const academicTermRouter = require('../routes/Academic/academicTerm');
const classLevelRouter = require('../routes/Academic/classLevel');
const programRouter = require('../routes/Academic/program');
const subjectRouter = require('../routes/Academic/subject');
const yearGroupRouter = require('../routes/Academic/yearGroup');
const teacherRouter = require('../routes/Staff/teacherRouter');

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

// Error Middleware
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
