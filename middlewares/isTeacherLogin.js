const Teacher = require("../model/Staff/Teacher");
const verifyToken = require("../utills/verifyToken");

const isTeacherLogin = async (req, res, next) =>{
    // get token from header
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1]; // ? before . mean Optinal chaining 
    // verify token
    const verifiedToken = verifyToken(token);
    if(verifiedToken) {
        //find teacher
        const teacher = await Teacher.findById(verifiedToken.id).select(
            'name email role'
            );
        // save the user info req.obj
        req.userAuth = teacher;
        next();
    } else {
        const err = new Error("Token expired/invalid");
        next(err);
    }
};

module.exports = isTeacherLogin;