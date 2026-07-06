const mongoose = require("mongoose");

const productVectorSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    metadata: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: String,

      category: String,

      price: Number,

      rating: Number,
    },
  },
  {
    timestamps: true,
    collection: "product_vectors",
  }
);

module.exports = mongoose.model("ProductVector", productVectorSchema);