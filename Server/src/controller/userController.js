const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Product = require("../model/productSchema");

const getUserData = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id).select("-password -__v");

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

    const user = await User.findById(id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    if (newPassword) {
      if (!password) {
        return res.status(400).json({
          message: "Please provide your current password to set a new one",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        user.password = newPassword;
      } else {
        return res.status(400).json({
          message: "Current password is incorrect. Please try again.",
        });
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

const toggleWishlist = async (req, res) => {
  try {
    const { id } = req.user;
    const { ProductID } = req.params;

    const user = await User.findById(id);
    const productExists = await Product.exists({ _id: ProductID });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!productExists) {
      return res.status(404).json({
        message: "product not found.",
      });
    }

    const exists = user.wishlist.some((id) => id.toString() === ProductID);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== ProductID);

      await user.save();

      return res.status(200).json({
        message: "Product removed from wishlist.",
      });
    }

    user.wishlist.push(ProductID);

    await user.save();

    return res.status(200).json({
      message: "Product added to wishlist.",
    });
  } catch (e) {
    return res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { password } = req.body;

    const user = await User.findById(id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect.",
      });
    }

    user.isDeleted = true;
    user.email = `deleted_${user._id}@deleted.local`;
    user.refreshToken = null;
    user.wishlist = [];

    await user.save();

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate(
      "wishlist",
      "name price imageUrls",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json(user.wishlist);
  } catch (e) {
    return res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

module.exports = {
  getUserData,
  changeUserData,
  deleteAccount,
  toggleWishlist,
  getWishlist,
};
