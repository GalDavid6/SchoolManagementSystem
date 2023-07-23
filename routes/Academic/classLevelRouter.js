const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const {
     createClassLevel,
     getClassLevels,
     getClassLevel,
     updateClassLevel,
     deleteClassLevel
     } = require("../../controller/Academic/classLevelCtrl");

const classLevelRouter = express.Router();

classLevelRouter
    .route("/")
    .post(isLogin, isAdmin, createClassLevel)
    .get(isLogin, isAdmin, getClassLevels);

classLevelRouter
    .route("/:id")
    .get(isLogin, isAdmin, getClassLevel)
    .put(isLogin, isAdmin, updateClassLevel)
    .delete(isLogin, isAdmin, deleteClassLevel);

module.exports = classLevelRouter;