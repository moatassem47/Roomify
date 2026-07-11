const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const sendEmail = require("../../utils/sendEmails");
const crypto = require("crypto");
const { buildFrontendUrl } = require("../../config/urls");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const resetResponse = {
  message:
    "If an account exists with this email, a password reset link has been sent.",
};

const isStrongPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  password.length <= 72 &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const sendResetEmail = async (user, token) => {
  const resetLink = buildFrontendUrl(`/changePassword/${token}`);

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
    if (typeof email !== "string") {
      return res.status(200).json(resetResponse);
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: { $ne: true },
    }).select("+password");
    if (!user || !user.password) {
      return res.status(200).json(resetResponse);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = Date.now() + 1000 * 60 * 15;
    await user.save({ validateBeforeSave: false });

    await sendResetEmail(user, resetToken);
    return res.status(200).json(resetResponse);
  } catch (e) {
    res.status(500).json(e);
  }
};

const enterNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be 8-72 characters and include a number and special character.",
      });
    }

    const user = await User.findOneAndUpdate({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: Date.now() },
      isDeleted: { $ne: true },
    }, {
      $unset: { passwordResetToken: "", passwordResetExpires: "", refreshToken: "" },
      $inc: { tokenVersion: 1 },
    }, { new: true }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired.",
      });
    }

    if (user.password && await require("bcrypt").compare(password, user.password)) {
      return res.status(400).json({ message: "Please choose a new password." });
    }

    user.password = password;

    await user.save();

    res.status(200).json({
      message: "Your password has been changed successfully.",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = { resetPassword ,enterNewPassword};
