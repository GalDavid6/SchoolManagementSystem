const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const { hashPassword, isPassMatched } = require("../../utills/helpers");
const generateToken = require("../../utills/generateToken");

//@desc Admin Register Teacher
//@route POST /api/v1/teachers/admin/register
//@access Private
exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
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