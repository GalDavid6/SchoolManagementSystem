const AsyncHandler = require("express-async-handler");
const { hashPassword, isPassMatched } = require("../../utills/helpers");
const generateToken = require("../../utills/generateToken");
const Student = require("../../model/Academic/Student");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");
const Admin = require("../../model/Staff/Admin");

//@desc Admin Register Student
//@route POST /api/v1/students/admin/register
//@access Private
exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //find admin
    const adminFound = await Admin.findById(req.userAuth._id);
    if(!adminFound){
        throw new Error("Admin not found");
    }
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
    //push student into admin
    adminFound.students.push(studentCreated?._id);
    await adminFound.save();
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
    const student = await Student.findById(req.userAuth?._id)
    .select('-password -createdAt -updatedAt')
    .populate("examResults");
    if(!student){
        throw new Error("student not found");
    }
    //get student profile
    const studentProfile = {
        name: student?.name,
        email: student?.email,
        currentClassLevel: student?.currentClassLevel,
        program: student?.program,
        dateAdmitted: student?.dateAdmitted,
        isSuspended: student?.isSuspended,
        isWithdrawn: student?.isWithdrawn,
        studentId: student?.studentId,
        prefectName: student?.prefectName,
    }
    //get student exam results
    const examResult = student?.examResults;
    //current exam, last exam
    const currentExamResult = examResult[examResult.length - 1];
    //check if exam is published
    const isPublished = currentExamResult?.isPublished;
    res.status(200).json({
        status: "Success",
        message: "Student profile fetched successfully",
        data: {
            studentProfile,
            currentExamResult: isPublished ? currentExamResult : [],
        },
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
    const { 
        program, 
        classLevel, 
        academicYear, 
        name, 
        email, 
        prefectName,
        isSuspended,
        isWithdrawn,
    } = req.body;
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
                isSuspended,
                isWithdrawn,
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

//desc Student taking Exams
//@route POST /api/v1/students/exam/:examID/write
//@access Private Students only
exports.writeExam = AsyncHandler(async (req, res) =>{
    //get student 
    const studentFound = await Student.findById(req.userAuth?._id);
    if (!studentFound) {
        throw new Error("Student not found");
    }
    //get exam
    const examFound = await Exam.findById(req.params.examID)
    .populate("questions")
    .populate("academicTerm");
    if (!examFound) {
        throw new Error("Exam not found");
    }
    //get questions
    const questions = examFound?.questions;
    //get student questions
    const studentAnswers = req.body.answers;

    //check if student answered all questions
    if(studentAnswers.length !== questions.length){
        throw new Error("You have not answered all the questions");
    }

    //check if student already taken the exam
    //@@@@@ not Working!!
    const studentFoundInResult = await ExamResult.findOne({
        student: studentFound?.id,
    });
    if (studentFoundInResult) {
        throw new Error("You have already taken this exam");
    }


    //check if student is suspended/withdrawn
    if(studentFound.isWithdrawn || studentFound.isSuspended){
        throw new Error("You are Suspended/Withdrawn, You cant take this exam");
    }
    //build report object
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let totalQuestions = questions.length;
    let grade = 0;
    let score = 0;
    let answeredQuestions = [];
    let status = "";
    let remarks = "";
    //check for answers
    for(let i = 0; i < questions.length; i++){
        //find question
        const question = questions[i];
        //check if the answer is correct 
        if(question.correctAnswer === studentAnswers[i]){
            correctAnswers++;
            score++;
            question.isCorrect = true;
        } else {
            wrongAnswers++;
        }
    }
    //calculate reports
    grade = (correctAnswers / totalQuestions) * 100;
    answeredQuestions = questions.map(question => {
        return {
            question: question.question,
            correctAnswer: question.correctAnswer,
            isCorrect: question.isCorrect,
        };
    });
    //calculate status
    if (grade >= 50){
        status = "Pass";
    } else {
        status = "Fail";
    }
    //remarks
    if(grade >= 80){
        remarks = "Excellent";
    } else if (grade >= 70) {
        remarks = "Very Good";
    } else if (grade >= 60) {
        remarks = "Good";
    } else if (grade >= 50) {
        remarks = "Fair";
    } else {
        remarks = "Poor";
    }

    //generate exam results
    const examResults = await ExamResult.create({
        studentID: studentFound?.studentId,
        exam: examFound?._id,
        grade,
        score,
        status,
        remarks,
        classLevel: examFound?.classLevel,
        academicTerm: examFound?.academicTerm,
        academicYear: examFound?.academicYear,
        answeredQuestions: answeredQuestions,
    });
    //push the result into student
    studentFound.examResults.push(examResults?._id);
    //save
    await studentFound.save();

    //promoting
    //promote student to level 200
    if(examFound.academicTerm.name === "3RD term" &&
    status === "Pass" && 
    studentFound?.currentClassLevel === "Level 100") {
        studentFound.classLevels.push("Level 200");
        studentFound.currentClassLevel = "Level 200";
        await studentFound.save();
    }
    //promote student to level 300
    if(examFound.academicTerm.name === "3RD term" && 
    status === "Pass" && 
    studentFound?.currentClassLevel === "Level 200") {
        studentFound.classLevels.push("Level 300");
        studentFound.currentClassLevel = "Level 300";
        await studentFound.save();
    }
    //promote student to level 400
    if(examFound.academicTerm.name === "3RD term" && 
    status === "Pass" && 
    studentFound?.currentClassLevel === "Level 300") {
        studentFound.classLevels.push("Level 400");
        studentFound.currentClassLevel = "Level 400";
        await studentFound.save();
    }
    //promote student to graduate
    if(examFound.academicTerm.name === "3RD term" && 
    status === "Pass" && 
    studentFound?.currentClassLevel === "Level 400") {
        studentFound.isGraduated = true;
        studentFound.yearGraduated = new Date();
        await studentFound.save();
    }

    res.status(200).json({
        status: "Success",
        message: "You have submitted your exam, Check later for the results",
    });
});
