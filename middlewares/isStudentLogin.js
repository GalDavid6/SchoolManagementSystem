const Student = require("../model/Academic/Student");
const verifyToken = require("../utills/verifyToken");

const isStudentLogin = async (req, res, next) =>{
    // get token from header
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1]; // ? before . mean optinal chaining 
    // verify token
    const verifiedToken = verifyToken(token);
    if(verifiedToken) {
        //find student
        const student = await Student.findById(verifiedToken.id).select(
            'name email role'
            );
        // save the user info req.obj
        req.userAuth = student;
        next();
    } else {
        const err = new Error("Token expired/invalid");
        next(err);
    }
};

module.exports = isStudentLogin;