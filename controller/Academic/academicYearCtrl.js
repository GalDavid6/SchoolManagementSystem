const AsyncHandler = require("express-async-handler");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");


//@desc Create Academic Year
//@route POST /api/v1/academic-years
//@acess Private
exports.createAcademicYear = AsyncHandler(async (req, res) => {
    const { name, fromYear, toYear, createdBy } = req.body;
    //check if exists
    const academicYear = await AcademicYear.findOne({ name });
    if (academicYear){
        throw new Error ("Academic year already exists");
    }
    //create
    const academicYearCreated = await AcademicYear.create({
        name,
        fromYear,
        toYear,
        createdBy: req.userAuth._id,
    });
    //push academic into admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.academicYears.push(academicYearCreated._id);
    await admin.save();
    
    res.status(201).json({
        status: "Success",
        message: "Academic year created successfully",
        data: academicYearCreated,
    });
});

//desc Get all Academic Years
//@route GET /api/v1/academic-years
//@acess Private
exports.getAcademicYears = AsyncHandler(async (req, res) => {
    const academicYears = await AcademicYear.find();

    res.status(201).json({
        status: "Success",
        message: "Academic years fetched successfully",
        data: academicYears,
    });
});

//desc Get Single Academic Year
//@route GET /api/v1/academic-years/:id
//@acess Private
exports.getAcademicYear = AsyncHandler(async (req, res) => {
    const academicYear = await AcademicYear.findById(req.params.id);

    res.status(201).json({
        status: "Success",
        message: "Academic Year fetched successfully",
        data: academicYear,
    });
});

//@desc Update Academic Year
//@route PUT /api/v1/academic-years/:id
//@acess Private
exports.updateAcademicYear = AsyncHandler(async (req, res) => {
    const { name, fromYear, toYear } = req.body;
    //check if name exists 
    const updateAcademicYearFound = await AcademicYear.findOne({ name });
    if(updateAcademicYearFound) {
        throw new Error("Academic year already exists");
    }
    const academicYear = await AcademicYear.findByIdAndUpdate(
        req.params.id,
        {
            name,
            fromYear,
            toYear,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Success",
        message: "Academic years updated successfully",
        data: academicYear,
    });
});

//@desc delete Academic Year
//@route DELETE /api/v1/academic-years/:id
//@acess Private
exports.deleteAcademicYear = AsyncHandler(async (req, res) =>{
    //check if name exists 
    const deleteAcademicYearFound = await AcademicYear.findByIdAndDelete(req.params.id);
    if(!deleteAcademicYearFound) {
        throw new Error("Academic year not exists");
    }

    res.status(201).json({
        status: "Sucess",
        message: "Academic year deleted successfully",
    });
});