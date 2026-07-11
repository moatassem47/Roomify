const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const crypto = require("crypto");
const { generateTokens } = require("../../utils/generateTokens");
const sendEmail = require("../../utils/sendEmails");
const cookieOptions = require("../../utils/cookieOptions");
const { buildFrontendUrl } = require("../../config/urls");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const sendVerificationEmail = async (user, token) => {
  const verificationLink = buildFrontendUrl(`/verify-email/${token}`);

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

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 3 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

const loginUnverifiedUser = async (user, res) => {
  const { accessToken, refreshToken } = generateTokens(user);

  setAuthCookies(res, accessToken, refreshToken);
};




const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;
    if (typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    
    const user = await User.findOne({ email: normalizedEmail, isDeleted: { $ne: true } });

    if (user) {
     if (user.providers && user.providers.includes("google") && !user.providers.includes("local")) {
        return res.status(409).json({
          message: "Account exists with Google. Sign in with Google to add a password.",
        });
      }

      return res.status(409).json({
    message: "This user already exist",
  });
}
    

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      phone,
      address,
      verificationToken: hashToken(verificationToken),
      verificationExpires: Date.now() + 1000 * 60 * 60,
      role: "customer",
      providers: ["local"],
    });

    const userResponse = sanitizeUser(newUser);
    await sendVerificationEmail(newUser, verificationToken);
    await loginUnverifiedUser(newUser, res);

    res
      .status(201)
      .json({ message: "Your account created succefully", data: userResponse });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

module.exports = register;
