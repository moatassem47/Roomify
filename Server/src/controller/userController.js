const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Product = require("../model/productSchema");
const Order = require("../model/orderSchema");
const mongoose = require("mongoose");
const cookieOptions = require("../utils/cookieOptions");

const getUserData = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findOne({ _id: id, isDeleted: { $ne: true } }).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ name: e.name, message: e.message });
  }
};

const changeUserData = async (req, res) => {
  try {
    const id = req.user.id;
    const { firstName, lastName, phone, password, newPassword, address } =
      req.body;

    const user = await User.findOne({ _id: id, isDeleted: { $ne: true } }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    if (newPassword) {
  const isLocalUser = user.providers.includes("local");

  if (isLocalUser && !password) {
    return res.status(400).json({
      message: "Please provide your current password to set a new one",
    });
  }

  if (!isLocalUser) {
    user.password = newPassword;
    user.providers.push("local");
  } 
  
  else {
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect. Please try again.",
      });
    }
    user.password = newPassword;
  }
}

    if (address) {
      user.address = { ...user.address, ...address };
    }

    await user.save();

    res.status(200).json({
      message: "Data Updated Successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      return res.status(400).json({
        message:
          "This phone number or email is already registered to another account",
      });
    }
    res.status(500).json({ name: e.name, message: e.message });
  }
};


const deleteAccount = async (req, res) => {

  const session=await mongoose.startSession()
  session.startTransaction()

  try {
    const { id } = req.user;
    const { password } = req.body;

    const user = await User.findOne({ _id: id, isDeleted: { $ne: true } }).session(session).select("+password");

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const activeOrder = await Order.findOne({
    userId: id,
    status: { $nin: ["Delivered", "Cancelled"] },
    }).session(session);

    if (activeOrder) {
      await session.abortTransaction();
      return res.status(400).json({
        message:
          "Please cancel your active orders first or wait until they are completed.",
      });
    }



    if (user.providers.includes("local")) {
      if (!password) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Password is required.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Password is incorrect.",
        });
      }
    }

    user.isDeleted = true;
    user.email = `deleted_${user._id}@deleted.local`;
    user.tokenVersion += 1;
    user.googleId = null;
    user.providers = [];
    user.avatar = "";
    user.address = {};

    await user.save({session});

    await session.commitTransaction()

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (e) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }finally{
     session.endSession()
  }
};

module.exports = {
  getUserData,
  changeUserData,
  deleteAccount,
};
