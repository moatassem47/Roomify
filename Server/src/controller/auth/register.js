const mongoose = require("mongoose");
const User = require("../../model/userSchema");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmails");
const { generateTokens } = require("../../utils/generateTokens");


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

const sanitizeUser = (user) => {
  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.verificationToken;
  delete userResponse.verificationExpires;

  return userResponse;
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("accessToken", accessToken, {
    ...CookieOptions,
    expires: new Date(Date.now() + 3 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    ...CookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

const loginUnverifiedUser = async (user, res) => {
  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setAuthCookies(res, accessToken, refreshToken);
};




const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;
    
    const user = await User.findOne({ email: email });

    if (user) {
      if (user.providers?.includes("local")) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.phone = phone;
        user.address = address;
        user.providers = [...(user.providers || []), "local"];
        user.verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationExpires = Date.now() + 1000 * 60 * 60;
        await user.save();
        await sendVerificationEmail(user);
        await loginUnverifiedUser(user, res);
        const userResponse = sanitizeUser(user);

        return res.status(201).json({
          message:
            "Account updated successfully. You can now login using Google or email and password.",
          data: userResponse,
        });
      }
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      verificationToken: crypto.randomBytes(32).toString("hex"),
      verificationExpires: Date.now() + 1000 * 60 * 60,
      role: "customer",
      providers: ["local"],
    });

    const userResponse = sanitizeUser(newUser);
    await sendVerificationEmail(newUser);
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
