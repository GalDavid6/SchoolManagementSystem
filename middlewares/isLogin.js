const Admin = require("../model/Staff/Admin");
const verifyToken = require("../utills/verifyToken");

const isLogin = async (req, res, next) =>{
    // get token from header
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1]; // ? before . mean Optinal chaining 
    // verify token
    const verifiedToken = verifyToken(token);
    if(verifiedToken) {
        //find user
        const user = await Admin.findById(verifiedToken.id).select(
            'name email role'
            );
        // save the user info req.obj
        req.userAuth = user;
        next();
    } else {
        const err = new Error("Token expired/invalid");
        next(err);
    }
};

module.exports = isLogin;