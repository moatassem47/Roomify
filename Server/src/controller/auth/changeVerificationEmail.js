const crypto = require("crypto");
const User = require("../../model/userSchema");
const sendEmail = require("../../utils/sendEmails");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h2>Welcome to Roomify</h2>
      <p>Please verify your email by clicking the button below.</p>

      <a href="${verificationLink}"
      style="background:#8B5E3C; color:white; padding:12px 20px; text-decoration:none; border-radius:8px;display:inline-block;">
        Verify Email
      </a>
    `,
  });
};

const sanitizeUser = (user) => {
  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.verificationToken;
  delete userResponse.verificationExpires;

  return userResponse;
};

const changeVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ _id: req.user.id, isDeleted: { $ne: true } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "customer") {
      return res.status(400).json({
        message: "This account does not require email verification.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
      isDeleted: { $ne: true },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already registered to another account.",
      });
    }

    user.email = normalizedEmail;
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = hashToken(verificationToken);
    user.verificationExpires = Date.now() + 1000 * 60 * 60;

    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(user, verificationToken);

    return res.status(200).json({
      message: "Email updated. Verification email sent successfully.",
      data: sanitizeUser(user),
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

module.exports = changeVerificationEmail;
