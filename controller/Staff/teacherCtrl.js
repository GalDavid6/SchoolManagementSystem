const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const { hashPassword, isPassMatched } = require("../../utills/helpers");
const generateToken = require("../../utills/generateToken");
const Admin = require("../../model/Staff/Admin");

//@desc Admin Register Teacher
//@route POST /api/v1/teachers/admin/register
//@access Private
exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //find admin
    const adminFound = await Admin.findById(req.userAuth._id);
    if(!adminFound){
        throw new Error("Admin not found");
    }
    //check if teacher already exsits
    const teacher = await Teacher.findOne({ email });
    if(teacher){
        throw new Error("Teacher already employed");
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    //Create
    const teacherCreated = await Teacher.create({
        name,
        email,
        password: hashedPassword
    });
    //push teacher into admin
    adminFound.teachers.push(teacherCreated?._id);
    await adminFound.save();
    //Respone
    res.status(201).json({
        status: "Success",
        message: "Teacher registered successfully",
        data: teacherCreated,
    });
});

//@desc Login a Teacher
//@route POST /api/v1/teachers/login
//@access Public
exports.loginTeacher = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //find teacher
    const teacher = await Teacher.findOne({ email });
    if(!teacher){
        return res.json({ message: "Invalid login credentials" });
    }
    //verify password
    const isMatched = await isPassMatched(password, teacher?.password);
    if(!isMatched){
        return res.json({ message: "Invalid credentials" });
    } else {
        res.status(200).json({
            status: "Success",
            message: "Teacher logged in successfully",
            data: generateToken(teacher?._id),
        });
    }
});

//@desc Get all Teachers
//@route GET /api/v1/teachers/admin
//@access Private Admin only
exports.getAllTeachersAdmin = AsyncHandler(async (req, res) => {
    const teachers = await Teacher.find();
    res.status(200).json({
        status: "Success",
        message: "Teachers fetched successfully",
        data: teachers,
    });
});

//@desc Get Single Teacher
//@route GET /api/v1/teachers/:teacherID/admin
//@access Private Admin only
exports.getSingleTeacherAdmin = AsyncHandler(async (req, res) => {
    //find teacher
    const teacherID = req.params.teacherID;
    const teacher = await Teacher.findById(teacherID);
    if(!teacher){
        throw new Error("Teacher not found");
    }
    res.status(200).json({
        status: "Success",
        message: "Teacher fetched successfully",
        data: teacher,
    });
});

//@desc Get Teacher Profile
//@route GET /api/v1/teachers/profile
//@access Private Teacher only
exports.getTeacherProfile = AsyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.userAuth?._id).select('-password -createdAt -updatedAt');
    if(!teacher){
        throw new Error("Teacher not found");
    }
    res.status(200).json({
        status: "Success",
        message: "Teacher profile fetched successfully",
        data: teacher,
    });
});

//desc Teacher update
//@route UPDATE /api/v1/teachers/
//@access Private Teacher only
exports.updateTeacherCtrl = AsyncHandler(async (req, res)=>{
    const { email, name, password } = req.body;
    //if email is taken
    const emailExist = await Teacher.findOne({ email });
    if (emailExist){
        throw new Error("This email is taken/exist");
    } 
    //check if teacher is updating password
    if(password){
        //update
        const teacher = await Teacher.findByIdAndUpdate(
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
            data: teacher,
            message: "Teacher updated successfully",
        });
    } else {
               //update
               const teacher = await Teacher.findByIdAndUpdate(
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
                data: teacher,
                message: "Teacher updated successfully",
            }); 
    }
});

//desc Admin Update Teacher Profile
//@route UPDATE /api/v1/teachers/:teacherID/admin
//@access Private Admin only
exports.adminUpdateTeacher = AsyncHandler(async (req, res)=>{
    const { program, classLevel, academicYear, subject } = req.body;
    const teacherFound = await Teacher.findById(req.params.teacherID);
    if(!teacherFound){
        throw new Error("Teacher not found");
    }
    //check if teacher is withdrawn
    if(teacherFound.isWitdrawn){
        throw new Error("Action denied, Teacher is withdrawn.");
    }
    //assign a program
    if(program){
        teacherFound.program = program;
    }
    //assign a classLevel
    if(classLevel){
        teacherFound.classLevel = classLevel;
    }
    //assign a academicYear
    if(academicYear){
        teacherFound.academicYear = academicYear;
    }
    //assign a subject
    if(subject){
        teacherFound.subject = subject;
    }
    await teacherFound.save();
    res.status(200).json({
        status: "Success",
        data: teacherFound,
        message: "Admin updated teacher successfully",
    });
});
