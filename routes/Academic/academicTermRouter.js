const express = require("express");
const {
     createAcademicTerm,
     getAcademicTerm,
     getAcademicTerms,
     updateAcademicTerm,   
     deleteAcademicTerm
     } = require("../../controller/Academic/academicTermCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");
const academicTermRouter = express.Router();

academicTermRouter
    .route("/")
    .post(isAuthenticated(Admin), roleRestriction('admin'), createAcademicTerm)
    .get(isAuthenticated(Admin), roleRestriction('admin'), getAcademicTerms);

academicTermRouter
    .route("/:id")
    .get(isAuthenticated(Admin), roleRestriction('admin'), getAcademicTerm)
    .put(isAuthenticated(Admin), roleRestriction('admin'), updateAcademicTerm)
    .delete(isAuthenticated(Admin), roleRestriction('admin'), deleteAcademicTerm);

module.exports = academicTermRouter;