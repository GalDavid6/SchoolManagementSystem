const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Subject = require("../../model/Academic/Subject");
const Program = require("../../model/Academic/Program");
const YearGroup = require("../../model/Academic/YearGroup");

//@desc Create Year Group
//@route POST /api/v1/years-group
//@acess Private
exports.createYearGroup = AsyncHandler(async (req, res) => {
    const { name, academicYear } = req.body;
    //find the program
    const yearGroupFound = await YearGroup.findOne({ name });
    if(yearGroupFound){
        throw new Error("Year Group/Graduation already exsist");
    }
    //create
    const yearGroup = await YearGroup.create({
        name,
        academicYear,
        createdBy: req.userAuth._id,
    });
    //find the admin
    const admin = await Admin.findById(req.userAuth._id);
    if(!admin){
        throw new Error("Admin not found");
    }
    //push year group into admin
    admin.yearGroups.push(yearGroup._id);
    //save
    await admin.save();
    res.status(201).json({
        status: "Success",
        message: "Year Group created successfully",
        data: yearGroup,
    });
});

//desc Get all Year Groups
//@route GET /api/v1/year-groups
//@acess Private
exports.getYearGroups = AsyncHandler(async (req, res) => {
    res.status(201).json(res.results);
});

//desc Get Single Year Group
//@route GET /api/v1/year-groups/:id
//@acess Private
exports.getYearGroup = AsyncHandler(async (req, res) => {
    const yearGroup = await YearGroup.findById(req.params.id);

    res.status(201).json({
        status: "Success",
        message: "Year Group fetched successfully",
        data: yearGroup,
    });
});

//@desc Update Year Group  
//@route PUT /api/v1/year-groups/:id
//@acess Private
exports.updateYearGroup = AsyncHandler(async (req, res) => {
    const { name, academicYear } = req.body;
    //check if name exists 
    const yearGroupFound = await YearGroup.findOne({ name });
    if(yearGroupFound) {
        throw new Error("Subject already exists");
    }
    const yearGroup = await YearGroup.findByIdAndUpdate(
        req.params.id,
        {
            name,
            academicYear,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Success",
        message: "Year Group updated successfully",
        data: yearGroup,
    });
});

//@desc delete Year Group 
//@route DELETE /api/v1/year-groups/:id
//@acess Private
exports.deleteYearGroup = AsyncHandler(async (req, res) =>{
    //check if name exists 
    const deleteYearGroup = await YearGroup.findByIdAndDelete(req.params.id);
    if(!deleteYearGroup) {
        throw new Error("Year Group not exists");
    }

    res.status(201).json({
        status: "Sucess",
        message: "Year Group deleted successfully",
    });
});