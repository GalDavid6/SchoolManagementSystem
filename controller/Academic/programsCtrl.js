const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");


//@desc Create Program
//@route POST /api/v1/programs
//@acess Private
exports.createProgram = AsyncHandler(async (req, res) => {
    const { name, description, } = req.body;
    //check if exists
    const programFound = await Program.findOne({ name });
    if (programFound){
        throw new Error ("Program already exists");
    }
    //create
    const programCreated = await Program.create({
        name,
        description,
        createdBy: req.userAuth._id,
    });
    //push program into admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.programs.push(programCreated._id);
    //save
    await admin.save();
    res.status(201).json({
        status: "Success",
        message: "Program created successfully",
        data: programCreated,
    });
});

//desc Get all Programs
//@route GET /api/v1/programs
//@acess Private
exports.getPrograms = AsyncHandler(async (req, res) => {
    res.status(201).json(res.results);
});

//desc Get Single Program
//@route GET /api/v1/programs/:id
//@acess Private
exports.getProgram = AsyncHandler(async (req, res) => {
    const program = await Program.findById(req.params.id);

    res.status(201).json({
        status: "Success",
        message: "Program fetched successfully",
        data: program,
    });
});

//@desc Update Program
//@route PUT /api/v1/programs/:id
//@acess Private
exports.updateProgram = AsyncHandler(async (req, res) => {
    const { name, description, } = req.body;
    //check if name exists 
    const programFound = await Program.findOne({ name });
    if(programFound) {
        throw new Error("Program already exists");
    }
    const program = await Program.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Success",
        message: "Program updated successfully",
        data: program,
    });
});

//@desc delete Program
//@route DELETE /api/v1/programs/:id
//@acess Private
exports.deleteProgram = AsyncHandler(async (req, res) =>{
    //check if name exists 
    const deleteProgramFound = await Program.findByIdAndDelete(req.params.id);
    if(!deleteProgramFound) {
        throw new Error("Program not exists");
    }

    res.status(201).json({
        status: "Sucess",
        message: "Program deleted successfully",
    });
});