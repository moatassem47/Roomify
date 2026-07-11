const User=require("../../model/userSchema")
const jwt = require("jsonwebtoken");


const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

   
    if (refreshToken) {
      try {
        const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decode.id);
        if (user) {
          user.tokenVersion += 1;
          await user.save({ validateBeforeSave: false });
        }
      } catch (e) {
        // Ignore token validation error on logout
      }
    }

    
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = logout;
