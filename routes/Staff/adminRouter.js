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

// admin register
adminRouter.post("/register",registerAdminCtrl);

// admin login
adminRouter.post("/login", loginAdminCtrl);

// get all
adminRouter.get("/", isLogin, isAdmin, getAdminsCtrl);

// get profile
adminRouter.get("/profile", isLogin, isAdmin, getAdminProfileCtrl);

// update
adminRouter.put("/", isLogin, isAdmin, updateAdminCtrl);

// delete
adminRouter.delete("/:id", deleteAdminCtrl);

// suspend
adminRouter.put("/suspend/teacher/:id", adminSuspendTeacherCtrl);

//unsuspend
adminRouter.put("/unsuspend/teacher/:id", adminUnSuspendTeacherCtrl);

//withdraw
adminRouter.put("/withdraw/teacher/:id", adminWithdrawTeacherCtrl);

// unwithdraw
adminRouter.put("/unwithdraw/teacher/:id", adminUnWithdrawTeacherCtrl);

//publish
adminRouter.put("/publish/exam/:id", adminPublishResults);

//unpublish
adminRouter.put("/unpublish/exam/:id", adminUnPublishResults);

module.exports = adminRouter;