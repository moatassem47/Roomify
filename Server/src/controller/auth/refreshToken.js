const jwt = require("jsonwebtoken");
const User = require("../../model/userSchema");
const dotenv = require("dotenv").config();
const {generateTokens} = require("../../utils/generateTokens");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const refreshToken = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken;

    if (!currentRefreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token found, please log in again." });
    }

    const decode = jwt.verify(
      currentRefreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const user = await User.findOne({
      _id: decode.id,
      refreshToken: currentRefreshToken,
     isDeleted: { $ne: true },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    if (decode.tokenVersion !== user.tokenVersion) {
      
    
      user.tokenVersion += 1;
      await user.save({ validateBeforeSave: false });

      
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(403).json({ message: "Compromised session detected. All sessions revoked for security." });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        refreshToken: currentRefreshToken,
        tokenVersion: user.tokenVersion,
        isDeleted: { $ne: true },
      },
      { $inc: { tokenVersion: 1 } },
      { new: true }        
    );

    if (!updatedUser) {
       return res.status(409).json({ message: "Concurrent request, please try again." });
    }



    const { accessToken, refreshToken:newRefreshToken } = generateTokens(updatedUser);

    updatedUser.refreshToken = newRefreshToken;
    await updatedUser.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({message:"token refreshed succefully"})
  } catch (e) {
    console.log(e);
    const status = e.name === "JsonWebTokenError" || e.name === "TokenExpiredError" ? 401 : 500;
    res.status(status).json({
      name: e.name,
      message: e.message,
    });
  }
};


module.exports=refreshToken
