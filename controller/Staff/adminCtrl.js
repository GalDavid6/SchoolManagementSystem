const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utills/generateToken");
const { hashPassword, isPassMatched } = require("../../utills/helpers");


//@desc Register admin
//@route POST /api/admins/register
//@access Private
exports.registerAdmin = AsyncHandler(async (req, res)=>{
    const { name, email, password } = req.body;
    //Check if email exists
    const adminFound = await Admin.findOne({ email });
    if(adminFound){
        throw new Error("Admin exists");
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
exports.loginAdmin = AsyncHandler(async (req, res)=>{
    const { name, email, password } = req.body;
        //find admin
        const admin = await Admin.findOne({ name, email });
        if(!admin){
            return res.json({message: "Admin not found"});
        }
        //verify password
        const isMatched = await isPassMatched(password, admin.password);
        if(!isMatched){
            return res.json({ message: "Invalid login crendentials"});
        } else{
            return res.json({
                data: generateToken(admin._id),
                message: "Admin logged in successfully",
            });
        }
}); 

//@desc get all admins
//@route GET /api/admins
//@access Private
exports.getAdmins = AsyncHandler(async (req, res)=>{
    res.status(200).json(res.results);
});

//@desc get single admin
//@route GET /api/v1/admins/:id
//@access Private
exports.getAdminProfile = AsyncHandler(async (req, res)=>{
    const admin = await Admin.findById(req.userAuth._id)
        .select("-password -createdAt -updatedAt")
        .populate("academicYears")
        .populate("academicTerms")
        .populate("programs")
        .populate("yearGroups")
        .populate("classLevels")
        .populate("teachers")
        .populate("students");
    if(!admin) {
        throw new Error("Admin not found");
    } else {
        res.status(200).json({
            status: "Success",
            data: admin,
            message: "Admin profile fetched successfully",
        });
    }
});

//desc update admin
//@route UPDATE /api/v1/admins/
//@access Private
exports.updateAdmin = AsyncHandler(async (req, res)=>{
    const { email, name, password } = req.body;
    //if email is taken
    const emailExist = await Admin.findOne({ email });
    if (emailExist){
        throw new Error("This email is taken/exist");
    } 
    //check if admin is updating password
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
exports.deleteAdmin =  (req, res)=>{
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
exports.adminSuspendTeacher = (req, res)=>{
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
exports.adminUnSuspendTeacher =  (req, res)=>{
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
exports.adminWithdrawTeacher =  (req, res)=>{
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
exports.adminUnWithdrawTeacher = (req, res)=>{
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