const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const crypto = require("crypto");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOneAndUpdate({
      verificationToken: hashToken(token),
      verificationExpires: { $gt: Date.now() },
      isDeleted: { $ne: true },
    }, {
      isVerified: true,
      $unset: { verificationToken: "", verificationExpires: "" },
    }, { new: true });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired.",
      });
    }

    res.status(200).json({
      message: "Your email has been verified successfully.",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};





module.exports=verifyEmail
