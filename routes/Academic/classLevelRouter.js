const express = require("express");
const {
     createClassLevel,
     getClassLevels,
     getClassLevel,
     updateClassLevel,
     deleteClassLevel
     } = require("../../controller/Academic/classLevelCtrl");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");

const classLevelRouter = express.Router();

classLevelRouter
    .route("/")
    .post(isAuthenticated(Admin), roleRestriction('admin'), createClassLevel)
    .get(isAuthenticated(Admin), roleRestriction('admin'), getClassLevels);

classLevelRouter
    .route("/:id")
    .get(isAuthenticated(Admin), roleRestriction('admin'), getClassLevel)
    .put(isAuthenticated(Admin), roleRestriction('admin'), updateClassLevel)
    .delete(isAuthenticated(Admin), roleRestriction('admin'), deleteClassLevel);

module.exports = classLevelRouter;