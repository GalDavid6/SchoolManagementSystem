const AsyncHandler = require("express-async-handler");
const ExamResult = require("../../model/Academic/ExamResults");
const Student = require("../../model/Academic/Student");


//@desc Exam Result 
//@route GET /api/v1/exam-results/:id/
//@access Private Student Only
exports.checkExamResult = AsyncHandler(async (req, res) => {
    //find student
    const studentFound = await Student.findById(req.userAuth?._id);
    if(!studentFound){
        throw new Error("Didn't find the student");
    }
    //find the exam results
    const examResult = await ExamResult.findOne({
        studentID: studentFound?.studentId,
        _id: req.params.id,
    })
        .populate({
            path: "exam",
            populate: {
                path: "questions",
            },
        })
        .populate("classLevel")
        .populate("academicTerm")
        .populate("academicYear");

    //check if exam is published
    if(!examResult?.isPublished) {
        throw new Error("Exam result is not available, Check out later");
    }
    res.json({
        status: "Success",
        message: "Exam result",
        data: examResult,
    });
});

//@desc Get all Exams Results (name, id)
//@route GET /api/v1/exam-results
//@access Private Student Only
exports.getAllExamsResults = AsyncHandler(async (req, res) => {
    const results = await ExamResult.find().select("exam").populate("exam");
    res.status(200).json({
        status: "Success",
        message: "Exam results fetched",
        data: results,
    });
});

//@desc Admin publish exam results
//@route PUT /api/v1/exam-results/:id/admin-toggle-publish
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
    const results = await ExamResult.find().select("exam").populate("exam");
    res.status(200).json({
        status: "Success",
        message: "Exam results publish or unpublish",
        data: publishResult,
    });
});