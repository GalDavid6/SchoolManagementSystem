const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const ClassLevel = require("../../model/Academic/ClassLevel");


//@desc Create class level
//@route POST /api/v1/class-levels
//@acess Private
exports.createClassLevel = AsyncHandler(async (req, res) => {
    const { name, description, } = req.body;
    //check if exists
    const classFound = await ClassLevel.findOne({ name });
    if (classFound){
        throw new Error ("Class already exists");
    }
    //create
    const classCreated = await ClassLevel.create({
        name,
        description,
        createdBy: req.userAuth._id,
    });
    //push class into admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.classLevels.push(classCreated._id);
    //save
    await admin.save();
    res.status(201).json({
        status: "Success",
        message: "Class created successfully",
        data: classCreated,
    });
});

//desc Get all class levels
//@route GET /api/v1/class-levels
//@acess Private
exports.getClassLevels = AsyncHandler(async (req, res) => {
    res.status(201).json(res.results);
});

//desc Get Single class level
//@route GET /api/v1/class-levels/:id
//@acess Private
exports.getClassLevel = AsyncHandler(async (req, res) => {
    const classLevel = await ClassLevel.findById(req.params.id);

    res.status(201).json({
        status: "Success",
        message: "Class fetched successfully",
        data: classLevel,
    });
});

//@desc Update Class Level
//@route PUT /api/v1/class-levels/:id
//@acess Private
exports.updateClassLevel = AsyncHandler(async (req, res) => {
    const { name, description, } = req.body;
    //check if name exists 
    const classFound = await ClassLevel.findOne({ name });
    if(classFound) {
        throw new Error("Class already exists");
    }
    const classLevel = await ClassLevel.findByIdAndUpdate(
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
        message: "Class level updated successfully",
        data: classLevel,
    });
});

//@desc delete Class Level
//@route DELETE /api/v1/class-levels/:id
//@acess Private
exports.deleteClassLevel = AsyncHandler(async (req, res) =>{
    //check if name exists 
    const deleteClassLevelFound = await ClassLevel.findByIdAndDelete(req.params.id);
    if(!deleteClassLevelFound) {
        throw new Error("Class Level not exists");
    }

    res.status(201).json({
        status: "Sucess",
        message: "Class Level deleted successfully",
    });
});