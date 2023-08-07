const express = require("express");
const {
    createYearGroup,
    getYearGroups,
    getYearGroup,
    updateYearGroup,
    deleteYearGroup    
} = require("../../controller/Academic/yearGroupCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");
const advancedResults = require("../../middlewares/advancedResults");
const YearGroup = require("../../model/Academic/YearGroup");
const yearGroupRouter = express.Router();

yearGroupRouter
    .route("/")
    .post(isAuthenticated(Admin), roleRestriction('admin'), createYearGroup)
    .get(isAuthenticated(Admin), roleRestriction('admin'), advancedResults(YearGroup), getYearGroups);

yearGroupRouter
    .route("/:id")
    .get(isAuthenticated(Admin), roleRestriction('admin'), getYearGroup)
    .put(isAuthenticated(Admin), roleRestriction('admin'), updateYearGroup)
    .delete(isAuthenticated(Admin), roleRestriction('admin'), deleteYearGroup);

module.exports = yearGroupRouter;