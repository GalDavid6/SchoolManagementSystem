const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const {
     createAcademicTerm,
     getAcademicTerm,
     getAcademicTerms,
     updateAcademicTerm,   
     deleteAcademicTerm
     } = require("../../controller/Academic/academicTermCtrl");
const academicTermRouter = express.Router();

academicTermRouter
    .route("/")
    .post(isLogin, isAdmin, createAcademicTerm)
    .get(isLogin, isAdmin, getAcademicTerms);

academicTermRouter
    .route("/:id")
    .get(isLogin, isAdmin, getAcademicTerm)
    .put(isLogin, isAdmin, updateAcademicTerm)
    .delete(isLogin, isAdmin, deleteAcademicTerm);

module.exports = academicTermRouter;