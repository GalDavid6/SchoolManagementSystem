const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utills/generateToken");
const verifyToken = require("../../utills/verifyToken");
const { hashPassword, isPassMatched } = require("../../utills/helpers");


//@desc Register admin
//@route POST /api/admins/register
//@access Private
exports.registerAdminCtrl = AsyncHandler(async (req, res)=>{
    const { name, email, password } = req.body;
    //Check if email exists
    const adminFound = await Admin.findOne({ email });
    if(adminFound){
        res.json("Admin Exists");
    }
    //register
    const user = await Admin.create({
        name,
        email,
        password: await hashPassword(password),
    });
    res.status(201).json({
        status: "success",
        data: user,
        message: "Admin registered successfully",
    });
});

//@desc login admins
//@route POST /api/admins/login
//@access Private
exports.loginAdminCtrl = AsyncHandler(async (req, res)=>{
    const { email, password } = req.body;
        //find user
        const user = await Admin.findOne({email});
        if(!user){
            return res.json({message: "User not found"});
        }
        //verify password
        const isMatched = await isPassMatched(password, user.password);
        if(!isMatched){
            return res.json({ message: "Invalid login crendentials"});
        } else{
            return res.json({
                data: generateToken(user._id),
                message: "Admin logged in successfully",
            });
        }
}); 

//@desc get all admins
//@route GET /api/admins
//@access Private
exports.getAdminsCtrl = AsyncHandler(async (req, res)=>{
    const admins = await Admin.find();
    res.status(200).json({
        status: "Success",
        message: "Admin fetched successfully",
        data: admins,
    });
});

//@desc get single admin
//@route GET /api/v1/admins/:id
//@access Private
exports.getAdminProfileCtrl = AsyncHandler(async (req, res)=>{
    const admin = await Admin.findById(req.userAuth._id)
        .select("-password -createdAt -updatedAt")
        .populate("academicYears");
    if(!admin) {
        throw new Error("Admin not found");
    } else {
        res.status(200).json({
            status: "Success",
            data: admin,
            message: "Admin profile fetched successfully",
        });
    }
}) ;

//desc update admin
//@route UPDATE /api/v1/admins/:id
//@access Private
exports.updateAdminCtrl = AsyncHandler(async (req, res)=>{
    const { email, name, password } = req.body;
    //if email is taken
    const emailExist = await Admin.findOne({ email });
    if (emailExist){
        throw new Error("This email is taken/exist");
    } 
    //check if user is updating password
    if(password){
        //update
        const admin = await Admin.findByIdAndUpdate(
            req.userAuth._id,
        {
            email,
            password: await hashPassword(password),
            name,
        },
        {
            new: true,
            runValidators: true,
        }
        );
        res.status(200).json({
            status: "Success",
            data: admin,
            message: "Admin updated successfully",
        });
    } else {
               //update
               const admin = await Admin.findByIdAndUpdate(
                req.userAuth._id,
            {
                email,
                name,
            },
            {
                new: true,
                runValidators: true,
            }
            );
            res.status(200).json({
                status: "Success",
                data: admin,
                message: "Admin updated successfully",
            }); 
    }
});

//@desc delete admin
//@route DELETE /api/v1/admins/:id
//@access Private
exports.deleteAdminCtrl =  (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "delete admin",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
};

//@desc suspend admin
//@route PUT /api/v1/admins/suspend/teacher/:id
//@access Private
exports.adminSuspendTeacherCtrl = (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "Admin suspend teacher",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
};

//@desc unsuspend admin
//@route PUT /api/v1/admins/:id
//@access Private
exports.adminUnSuspendTeacherCtrl =  (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "Admin unsuspend teacher",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
};

//@desc withdraw teacher
//@route PUT /api/v1/admins/withdraw/teacher/:id
//@access Private
exports.adminWithdrawTeacherCtrl =  (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "Admin withdraw teacher",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
}

//@desc unwithdraw teacher
//@route PUT /api/v1/admins/unwithdraw/teacher/:id
//@access Private
exports.adminUnWithdrawTeacherCtrl = (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "Admin unwithdraw teacher",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
};

//@desc publish exam
//@route PUT /api/v1/admins/publish/exam/:id
//@access Private
exports.adminPublishResults = (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "Admin publish exam",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
}; 

//@desc unpublish exam
//@route PUT /api/v1/admins/unpublish/exam/:id
//@access Private
exports.adminUnPublishResults = (req, res)=>{
    try{
        res.status(201).json({
            status: "success",
            data: "Admin unpublish exam",
        });
    } catch(error){
        res.json({
            status: "failed",
            error: error.message,
        });
    }
};