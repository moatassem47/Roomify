const Cart = require("../model/cartSchema");
const mongoose = require("mongoose");
const Product = require("../model/productSchema");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "there's no product with this id" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            productId,
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() == productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res.status(201).json({
      message: "item added succefully to cart",
      cartLength: cart.items.length,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      name: e.name,
      message: e.message,
    });
  }
};

//------------------------------------------------------------------------------------------------------------------

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price imageUrls",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ cart: { items: [] }, totalPrice: 0 });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      const productTotalprice = item.productId.price * item.quantity;
      return (total += productTotalprice);
    }, 0);

    res.status(200).json({ cart, totalPrice });
  } catch (e) {
    console.log(e);

    res.status(500).json({ name: e.name, message: e.message });
  }
};

//------------------------------------------------------------------------------------------------------------------

const deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;


    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "there's no items in your cart" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(200).json({ message: "Item deleted successfully" });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (e) {
    console.log(e);

    res.status(500).json({ name: e.name, message: e.message });
  }
};

//-------------------------------------------------------------------------------------------------

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "there's no items in your cart" });
    }

    cart.items = [];
    await cart.save();
    return res.status(200).json({ message: "cart cleard sucefully" });
  } catch (e) {
    console.log(e);

    res.status(500).json({ name: e.name, message: e.message });
  }
};

//----------------------------------------------------------------------------------------------
const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, action } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "There are no items in your cart" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (action === "increment") {
        cart.items[itemIndex].quantity += 1;
      } else if (action === "decrement") {
        if (cart.items[itemIndex].quantity === 1) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity -= 1;
        }
      }
      await cart.save();
      return res.status(200).json({ message: "Quantity updated successfully" });

    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ name: e.name, message: e.message });
  }
};

module.exports = { addToCart, getCart, deleteItem, clearCart, updateQuantity };
