const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utills/generateToken");
const { hashPassword, isPassMatched } = require("../../utills/helpers");
const Teacher = require("../../model/Staff/Teacher");
const ExamResult = require("../../model/Academic/ExamResults");

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

//@desc Admin Toggle suspend on teacher
//@route PUT /api/v1/admins/toggle-suspend/teacher/:id
//@access Private Admin Only
exports.adminToggleSuspendTeacher = AsyncHandler(async (req, res) => {
    //find teacher result
    const teacher = await Teacher.findById(req.params.id);
    if(!teacher) {
        throw new Error("Teacher not found");
    }
    const suspendTeacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        {
        isSuspended: req.body.suspend,
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "Success",
        message: "Teacher suspend or unsuspend",
        data: suspendTeacher,
    });
});

//@desc Admin Toggle Teacher Withdraw
//@route PUT /api/v1/admins/toggle-withdraw/teacher/:id
//@access Private Admin Only
exports.adminToggleWithdrawTeacher = AsyncHandler(async (req, res) => {
    //find teacher result
    const teacher = await Teacher.findById(req.params.id);
    if(!teacher) {
        throw new Error("Teacher not found");
    }
    const withdrawnTeacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        {
            isWitdrawn: req.body.withdraw,
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "Success",
        message: "Teacher withdrawn or unwithdrawn",
        data: withdrawnTeacher,
    });
});

//@desc Admin Toggle publish exam results
//@route PUT /api/v1/admins/toggle-publish/exam/:id
//@access Private Admin Only
exports.adminToggleExamResult = AsyncHandler(async (req, res) => {
    //find exam result
    const examResult = await ExamResult.findById(req.params.id);
    if(!examResult) {
        throw new Error("Exam result not found");
    }
    const publishResult = await ExamResult.findByIdAndUpdate(
        req.params.id,
        {
        isPublished: req.body.publish,
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "Success",
        message: "Exam results publish or unpublish",
        data: publishResult,
    });
});