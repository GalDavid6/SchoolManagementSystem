const express = require('express');
const { registerAdmin,
    loginAdmin,
    getAdmins,
    getAdminProfile,        
    updateAdmin,
    adminToggleExamResult,
    adminToggleSuspendTeacher,
    adminToggleWithdrawTeacher,
} = require('../../controller/Staff/adminCtrl');
const advancedResults = require('../../middlewares/advancedResults');
const Admin = require('../../model/Staff/Admin');
const isAuthenticated = require('../../middlewares/isAuthenticated');
const roleRestriction = require('../../middlewares/roleRestriction');

const adminRouter = express.Router();

adminRouter.post("/register",registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/", isAuthenticated(Admin), roleRestriction('admin'),
    advancedResults(Admin, "academicTerms programs yearGroups academicYears classLevels teachers students"), getAdmins);
adminRouter.get("/profile", isAuthenticated(Admin), roleRestriction('admin'), getAdminProfile);
adminRouter.put("/", isAuthenticated(Admin), roleRestriction('admin'), updateAdmin);
adminRouter.put("/toggle-suspend/teacher/:id", isAuthenticated(Admin), roleRestriction('admin'), adminToggleSuspendTeacher);
adminRouter.put("/toggle-withdraw/teacher/:id", isAuthenticated(Admin), roleRestriction('admin'), adminToggleWithdrawTeacher);
adminRouter.put("/toggle-publish/exam/:id", isAuthenticated(Admin), roleRestriction('admin'), adminToggleExamResult);


module.exports = adminRouter;