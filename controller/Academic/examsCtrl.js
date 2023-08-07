const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");
const AsyncHandler = require("express-async-handler");

//@desc Create Exam
//@route POST /api/v1/exams
//@access Private Teacher only
exports.createExam = AsyncHandler(async (req, res) => {
    const {
        name,
        description,
        subject,
        program,
        academicTerm,
        classLevel,
        examStatus,
        duration,
        examDate,
        examTime,
        examType,
        createdBy,
        academicYear,
    } = req.body;
    //find teacher
    const teacherFound = await Teacher.findById(req.userAuth?._id);
    if(!teacherFound){
        throw new Error("Teacher not found");
    }
    //exam exists 
    const examExists = await Exam.findOne({ name });
    if(examExists){
        throw new Error("Exam already exists");
    }
    //create
    const examCreated = await new Exam({
        name,
        description,
        academicTerm,
        academicYear,
        classLevel,
        createdBy: req.userAuth?._id,
        duration,
        examDate,
        examStatus,
        examTime,
        examType,
        subject,
        program, 
    });
    //push the exam into teacher
    teacherFound.examsCreated.push(examCreated._id);
    //save exam
    await examCreated.save();
    await teacherFound.save();
    res.status(201).json({
        status: "Success",
        message: "Exam created",
        data: examCreated,
    });
});

//desc Get all Exams
//@route GET /api/v1/exams
//@acess Private
exports.getExams = AsyncHandler(async (req, res) => {
    res.status(201).json(res.results);
});

//desc Get Single Exam
//@route GET /api/v1/exams/:id
//@acess Private Teachers Only
exports.getExam = AsyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id).populate({
        path: 'questions',
        populate: {
            path: "createdBy",
        },
    });
    res.status(201).json({
        status: "Success",
        message: "Exam fetched successfully",
        data: exam,
    });
});

//@desc Update Exam  
//@route PUT /api/v1/exams/:id
//@acess Private Teacher Only
exports.updateExam = AsyncHandler(async (req, res) => {
    const {
        name,
        description,
        subject,
        program,
        academicTerm,
        classLevel,
        examStatus,
        duration,
        examDate,
        examTime,
        examType,
        createdBy,
        academicYear,
    } = req.body;
    //check if name exists 
    const examFound = await Exam.findOne({ name });
    if(examFound) {
        throw new Error("Exam already exists");
    }
    const exam = await Exam.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            subject,
            program,
            academicTerm,
            classLevel,
            examStatus,
            duration,
            examDate,
            examTime,
            examType,
            createdBy : req.userAuth._id,
            academicYear,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Success",
        message: "Exam updated successfully",
        data: exam,
    });
});

//@desc delete Exam 
//@route DELETE /api/v1/exams/:id
//@acess Private Teacher Only
exports.deleteExam = AsyncHandler(async (req, res) =>{
    //check if name exists 
    const deleteExamFound = await Exam.findByIdAndDelete(req.params.id);
    if(!deleteExamFound) {
        throw new Error("Exam not exists");
    }

    res.status(201).json({
        status: "Success",
        message: "Exam deleted successfully",
    });
});