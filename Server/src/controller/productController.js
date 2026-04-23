const Product = require("../model/productModel");
const mongoose = require("mongoose");


exports.getProducts = async (req, res) => {
  try {
    const q = {};

    if (req.query.search) {
      q.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.category) {
      q.category = req.query.category;
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

    const products = await Product.find(q);
    if (!products)
      return res
        .status(404)
        .json({ message: "No products match your criteria" });
    res.status(200).json({
      count: products.length,
      products: products,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


exports.getProductById=async(req,res)=>{
    try{
        const id=req.params.id

        const product= await Product.findById(id)

        if(!Product) return res.status(404).json({message:"Can't find product with this id"})

        res.status(200).json(product)
    }catch(e){
        res.status(500).json({ message: e.message });
    }

}

