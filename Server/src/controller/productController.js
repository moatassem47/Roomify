const Product = require("../model/productSchema");
const mongoose = require("mongoose");

exports.getProducts = async (req, res) => {
  try {
    const q = {};

    if (req.query.search) {
      q.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.category) {
      q.category = {
        $regex: `^${req.query.category.trim()}$`,
        $options: "i",
      };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      q.price = {};
    }

    if (req.query.minPrice) {
      q.price.$gte = Number(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      q.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.available === "true") {
      q.stockQuantity = {
        $gt: 0,
      };
    }

    let sortOption = {};
    if (req.query.sort === "newest") {
      sortOption = { createdAt: -1 };
    } else if (req.query.sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (req.query.sort === "price_desc") {
      sortOption = { price: -1 };
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      sort: sortOption,
    };
    const products = await Product.paginate(q, options);

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product)
      return res
        .status(404)
        .json({ message: "Can't find product with this id" });

    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }

}
