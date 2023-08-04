const express = require('express');
const { registerAdmin,
    loginAdmin,
    getAdmins,
    getAdminProfile,        
    updateAdmin,
    deleteAdmin,
    adminSuspendTeacher, 
    adminUnSuspendTeacher,
    adminWithdrawTeacher,
    adminUnWithdrawTeacher,
    adminPublishResults,
    adminUnPublishResults,
} = require('../../controller/Staff/adminCtrl');
const advancedResults = require('../../middlewares/advancedResults');
const Admin = require('../../model/Staff/Admin');
const isAuthenticated = require('../../middlewares/isAuthenticated');
const roleRestriction = require('../../middlewares/roleRestriction');

const adminRouter = express.Router();

adminRouter.post("/register",registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.delete("/:id", deleteAdmin);
adminRouter.get("/", isAuthenticated(Admin), roleRestriction('admin'), advancedResults(Admin), getAdmins);
adminRouter.get("/profile", isAuthenticated(Admin), roleRestriction('admin'), getAdminProfile);
adminRouter.put("/", isAuthenticated(Admin), roleRestriction('admin'), updateAdmin);
adminRouter.put("/suspend/teacher/:id", isAuthenticated(Admin), roleRestriction('admin'), adminSuspendTeacher);
adminRouter.put("/unsuspend/teacher/:id", isAuthenticated(Admin), roleRestriction('admin'), adminUnSuspendTeacher);
adminRouter.put("/withdraw/teacher/:id", isAuthenticated(Admin), roleRestriction('admin'), adminWithdrawTeacher);
adminRouter.put("/unwithdraw/teacher/:id", isAuthenticated(Admin), roleRestriction('admin'), adminUnWithdrawTeacher);
adminRouter.put("/publish/exam/:id", isAuthenticated(Admin), roleRestriction('admin'), adminPublishResults);
adminRouter.put("/unpublish/exam/:id", isAuthenticated(Admin), roleRestriction('admin'), adminUnPublishResults);

module.exports = adminRouter;