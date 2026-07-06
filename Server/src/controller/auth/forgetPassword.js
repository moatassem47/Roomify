const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const sendEmail = require("../../utils/sendEmails");
const crypto = require("crypto");

const sendResetEmail = async (user) => {
  const resetLink = `${process.env.FRONTEND_URL}/changePassword/${user.passwordResetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Forget your password?",
    html: `
      <h2>Roomify</h2>
        <p>We received a request to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
      <a href="${resetLink}"
      style="background:#8B5E3C; color:white; padding:12px 20px; text-decoration:none; border-radius:8px;display:inline-block;">
        Change password
      </a>
    `,
  });
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }
    user.passwordResetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetExpires = Date.now() + 1000 * 60 * 15;
    await user.save();

    await sendResetEmail(user);
    return res.status(200).json({
      message: "Password reset email sent successfully.",
    });
  } catch (e) {
    res.status(500).json(e);
  }
};

const enterNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired.",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;

    await user.save();

    res.status(200).json({
      message: "Your password has been changed successfully.",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = { resetPassword ,enterNewPassword};
