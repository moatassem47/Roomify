const jwt = require("jsonwebtoken");
const dotenv=require("dotenv").config(); 

const generateTokens = (user) => {

    const accessToken = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );


    const refreshToken = jwt.sign(
        { id: user._id }, 
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

   
    return { accessToken, refreshToken };
};




module.exports = { generateTokens };