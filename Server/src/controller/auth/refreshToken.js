const jwt = require("jsonwebtoken");
const User = require("../../model/userSchema");
const dotenv = require("dotenv").config();
const {generateTokens} = require("../../utils/generateTokens");

const refreshToken = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;

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
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { accessToken, refreshToken:newRefreshToken } = generateTokens(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...CookieOptions,
      expires: new Date(Date.now() + 3 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...CookieOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({message:"token refreshed succefully"})
  } catch (e) {
    console.log(e);
    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};


module.exports=refreshToken