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


const app = express();

// Middlewares
app.use(express.json()); // pass incoming json data

// Routes
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);

// Error Middleware
app.use(notFoundErr);
app.use(globalErrHandler);
module.exports = app;
