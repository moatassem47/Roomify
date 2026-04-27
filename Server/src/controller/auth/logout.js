const User=require("../../model/userSchema")


const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

   
    if (refreshToken) {
      const user = await User.findOne({ refreshToken: refreshToken });
      if (user) {
        user.refreshToken = ""; // أو undefined
        await user.save({ validateBeforeSave: false });
      }
    }

    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = logout;
