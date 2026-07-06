const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmails");

const sendVerificationEmail = async (user) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${user.verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h2>Welcome to Roomify 👋</h2>
      <p>Please verify your email by clicking the button below.</p>

      <a href="${verificationLink}"
      style="background:#8B5E3C; color:white; padding:12px 20px; text-decoration:none; border-radius:8px;display:inline-block;">
        Verify Email
      </a>
    `,
  });
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }
    user.verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationExpires = Date.now() + 1000 * 60 * 60;
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user);
    return res.status(200).json({
      message: "Verification email sent successfully.",
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

module.exports = resendVerificationEmail;
