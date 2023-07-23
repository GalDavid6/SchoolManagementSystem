const AsyncHandler = require("express-async-handler");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const Question = require("../../model/Academic/Questions");
const Teacher = require("../../model/Staff/Teacher");
const Exam = require("../../model/Academic/Exam");

//@desc Create Questions
//@route POST /api/v1/questions/:examID
//@access Teacher Only
exports.createQuestion = AsyncHandler(async (req, res) => {
    const {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer, 
        } = req.body;
    //find exam
    const examFound = await Exam.findById(req.params.examID);
    if (!examFound){
        throw new Error("Exam not found");
    }
    //check if question exists
    const questionExists = await Question.findOne({ question });
    if (questionExists){
        throw new Error("Question already exists");
    }
    //create question
    const questionCreated = await Question.create({
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        createdBy: req.userAuth._id,
    });
    //add the question into exam
    examFound.questions.push(questionCreated?._id);
    await examFound.save();
    res.status(201).json({
        status: "Success",
        message: "Question created and added to exam",
        data: questionCreated,
    });
});

//@desc Get All Questions
//@route GET /api/v1/questions
//@access Private Teacher Only
exports.getQuestions = AsyncHandler(async (req, res) => {
    const questions = await Question.find();
    res.status(201).json({
        status: "Success",
        message: "Questions fetched successfully",
        data: questions,
    });
});

//@desc Get Single Question
//@route /api/v1/questions/:id
//@access Private Teacher Only
exports.getQuestion = AsyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.status(201).json({
        status: "Success",
        message: "Question fetched successfully",
        data: question,
    });
});

//@desc Update Question
//@route PUT /api/v1/questions/:id
//@acess Private Teacher Only
exports.updateQuestion = AsyncHandler(async (req, res) => {
    const {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer, 
        } = req.body;
    //check if name exists 
    const questionFound = await Question.findOne({ question });
    if(questionFound) {
        throw new Error("Question already exists");
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer, 
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Success",
        message: "Question updated successfully",
        data: updatedQuestion,
    });
});