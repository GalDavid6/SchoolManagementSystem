const express = require('express');
const { registerAdminCtrl,
    loginAdminCtrl,
    getAdminsCtrl,
    getAdminProfileCtrl,        
    updateAdminCtrl,
    deleteAdminCtrl,
    adminSuspendTeacherCtrl, 
    adminUnSuspendTeacherCtrl,
    adminWithdrawTeacherCtrl,
    adminUnWithdrawTeacherCtrl,
    adminPublishResults,
    adminUnPublishResults,
} = require('../../controller/Staff/adminCtrl');
const isLogin = require('../../middlewares/isLogin');
const isAdmin = require('../../middlewares/isAdmin');
const adminRouter = express.Router();

adminRouter.post("/register",registerAdminCtrl);
adminRouter.post("/login", loginAdminCtrl);
adminRouter.delete("/:id", deleteAdminCtrl);
adminRouter.get("/", isLogin, isAdmin, getAdminsCtrl);
adminRouter.get("/profile", isLogin, isAdmin, getAdminProfileCtrl);
adminRouter.put("/", isLogin, isAdmin, updateAdminCtrl);
adminRouter.put("/suspend/teacher/:id", isLogin, isAdmin, adminSuspendTeacherCtrl);
adminRouter.put("/unsuspend/teacher/:id", isLogin, isAdmin, adminUnSuspendTeacherCtrl);
adminRouter.put("/withdraw/teacher/:id", isLogin, isAdmin, adminWithdrawTeacherCtrl);
adminRouter.put("/unwithdraw/teacher/:id", isLogin, isAdmin, adminUnWithdrawTeacherCtrl);
adminRouter.put("/publish/exam/:id", isLogin, isAdmin, adminPublishResults);
adminRouter.put("/unpublish/exam/:id", isLogin, isAdmin, adminUnPublishResults);

module.exports = adminRouter;