const mongoose = require("mongoose");
const User = require("../../model/userSchema");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired.",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Your email has been verified successfully.",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};





module.exports=verifyEmail