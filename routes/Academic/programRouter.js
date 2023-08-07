const express = require("express");
const { 
    createProgram,
    getPrograms,
    getProgram,
    updateProgram,
    deleteProgram
 } = require("../../controller/Academic/programsCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");
const advancedResults = require("../../middlewares/advancedResults");
const Program = require("../../model/Academic/Program");
const programRouter = express.Router();

programRouter
    .route("/")
    .post(isAuthenticated(Admin), roleRestriction('admin'), createProgram)
    .get(isAuthenticated(Admin), roleRestriction('admin'), advancedResults(Program), getPrograms);

programRouter
    .route("/:id")
    .get(isAuthenticated(Admin), roleRestriction('admin'), getProgram)
    .put(isAuthenticated(Admin), roleRestriction('admin'), updateProgram)
    .delete(isAuthenticated(Admin), roleRestriction('admin'), deleteProgram);

module.exports = programRouter;