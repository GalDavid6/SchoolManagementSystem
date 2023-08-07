const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const AcademicTerm = require("../../model/Academic/AcademicTerm");


//@desc Create Academic Term Year
//@route POST /api/v1/academic-terms
//@acess Private
exports.createAcademicTerm = AsyncHandler(async (req, res) => {
    const { name, description, duration, } = req.body;
    //check if exists
    const academicTerm = await AcademicTerm.findOne({ name });
    if (academicTerm){
        throw new Error ("Academic term already exists");
    }
    //create
    const academicTermCreated = await AcademicTerm.create({
        name,
        description,
        duration,
        createdBy: req.userAuth._id,
    });
    //push academic into admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.academicTerms.push(academicTermCreated._id);
    await admin.save();
    res.status(201).json({
        status: "Success",
        message: "Academic term created successfully",
        data: academicTermCreated,
    });
});

//desc Get all Academic Terms
//@route GET /api/v1/academic-terms
//@acess Private
exports.getAcademicTerms = AsyncHandler(async (req, res) => {
    res.status(200).json(res.results);
});

//desc Get Single Academic Term
//@route GET /api/v1/academic-terms/:id
//@acess Private
exports.getAcademicTerm = AsyncHandler(async (req, res) => {
    const academicTerm = await AcademicTerm.findById(req.params.id);

    res.status(201).json({
        status: "Success",
        message: "Academic Term fetched successfully",
        data: academicTerm,
    });
});

//@desc Update Academic Term
//@route PUT /api/v1/academic-terms/:id
//@acess Private
exports.updateAcademicTerm = AsyncHandler(async (req, res) => {
    const { name, description, duration, } = req.body;
    //check if name exists 
    const updateAcademicTermFound = await AcademicTerm.findOne({ name });
    if(updateAcademicTermFound) {
        throw new Error("Academic Term already exists");
    }
    const academicTerm = await AcademicTerm.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            duration,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Success",
        message: "Academic Term updated successfully",
        data: academicTerm,
    });
});

//@desc delete Academic Term
//@route DELETE /api/v1/academic-terms/:id
//@acess Private
exports.deleteAcademicTerm = AsyncHandler(async (req, res) =>{
    //check if name exists 
    const deleteAcademicTermFound = await AcademicTerm.findByIdAndDelete(req.params.id);
    if(!deleteAcademicTermFound) {
        throw new Error("Academic term not exists");
    }

    res.status(201).json({
        status: "Sucess",
        message: "Academic term deleted successfully",
    });
});