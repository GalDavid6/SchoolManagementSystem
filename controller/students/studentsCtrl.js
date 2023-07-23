const AsyncHandler = require("express-async-handler");
const { hashPassword, isPassMatched } = require("../../utills/helpers");
const generateToken = require("../../utills/generateToken");
const Student = require("../../model/Academic/Student");

//@desc Admin Register Student
//@route POST /api/v1/students/admin/register
//@access Private
exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //check if student already exsits
    const student = await Student.findOne({ email });
    if(student){
        throw new Error("Student already exists");
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    //Create
    const studentCreated = await Student.create({
        name,
        email,
        password: hashedPassword
    });
    //Respone
    res.status(201).json({
        status: "Success",
        message: "Student registered successfully",
        data: studentCreated,
    });
});

//@desc Login a Student
//@route POST /api/v1/students/login
//@access Public
exports.loginStudent = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //find student
    const student = await Student.findOne({ email });
    if(!student){
        return res.json({ message: "Invalid login credentials" });
    }
    //verify password
    const isMatched = await isPassMatched(password, student?.password);
    if(!isMatched){
        return res.json({ message: "Invalid credentials" });
    } else {
        res.status(200).json({
            status: "Success",
            message: "Student logged in successfully",
            data: generateToken(student?._id),
        });
    }
});

//@desc Get all Students
//@route GET /api/v1/students/admin
//@access Private Admin only
exports.getAllStudentsAdmin = AsyncHandler(async (req, res) => {
    const students = await Student.find();
    res.status(200).json({
        status: "Success",
        message: "Students fetched successfully",
        data: students,
    });
});

//@desc Get Single Student
//@route GET /api/v1/students/:studentID/admin
//@access Private Admin only
exports.getSingleStudentAdmin = AsyncHandler(async (req, res) => {
    //find student
    const studentID = req.params.studentID;
    const student = await Student.findById(studentID);
    if(!student){
        throw new Error("Student not found");
    }
    res.status(200).json({
        status: "Success",
        message: "Student fetched successfully",
        data: student,
    });
});

//@desc Get Student Profile
//@route GET /api/v1/students/profile
//@access Private Student only
exports.getStudentProfile = AsyncHandler(async (req, res) => {
    const student = await Student.findById(req.userAuth?._id).select('-password -createdAt -updatedAt');
    if(!student){
        throw new Error("student not found");
    }
    res.status(200).json({
        status: "Success",
        message: "Student profile fetched successfully",
        data: student,
    });
});

//@desc Student update
//@route UPDATE /api/v1/students/update
//@access Private Student Only
exports.updateStudent = AsyncHandler(async (req, res)=>{
    const { email, password } = req.body;
    //if email is taken
    const emailExist = await Student.findOne({ email });
    if (emailExist){
        throw new Error("This email is taken/exist");
    } 
    //check if student is updating password
    if(password){
        //update
        const student = await Student.findByIdAndUpdate(
            req.userAuth._id,
        {
            email,
            password: await hashPassword(password),
        },
        {
            new: true,
            runValidators: true,
        }
        );
        res.status(200).json({
            status: "Success",
            data: student,
            message: "Student updated successfully",
        });
    } else {
               //update
               const student = await Student.findByIdAndUpdate(
                req.userAuth._id,
            {
                email,
            },
            {
                new: true,
                runValidators: true,
            }
            );
            res.status(200).json({
                status: "Success",
                data: student,
                message: "Student updated successfully",
            }); 
    }
});

//desc Admin Update Student Profile : Assigning classes etc...
//@route UPDATE /api/v1/students/:studentID/update/admin
//@access Private Admin only
exports.adminUpdateStudent = AsyncHandler(async (req, res)=>{
    const { program, classLevel, academicYear, name, email, prefectName } = req.body;
    //find studentID
    const studentFound = await Student.findById(req.params.studentID);
    if(!studentFound){
        throw new Error("Student not found");
    }
    //update 
    const studentUpdated = await Student.findByIdAndUpdate(
        req.params.studentID,
        {
            $set: {
                name,
                email,
                academicYear,
                program,
                prefectName,
            },
            $addToSet: {
                classLevels: classLevel,
            },
        },
        {
            new: true,
        },
    );
    await studentUpdated.save();
    res.status(200).json({
        status: "Success",
        data: studentUpdated,
        message: "Admin updated student successfully",
    });
});
