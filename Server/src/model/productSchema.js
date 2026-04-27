const mongoose = require("mongoose");
const mongoosePaginate=require("mongoose-paginate-v2")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 20
  },

  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    required: true,
    enum: ["Living Room", "Bedroom", "Office","Hallway","Kitchen"] 
  },

  imageUrls: {
    type: [String],
    validate: v => v.length > 0 
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  model3dUrl: {
    type: String,
    default: ""
  },
  hasdim:{
    type:Boolean,
    default:true
  },
  has3d: {
    type: Boolean,
    default: function () {
      return !!this.model3dUrl;
    }
  },

  specs: {
    width: String,
    depth: String,
    height: String,
    material: [String],
    color: [String]
  },

}, {
  timestamps: true
});

productSchema.plugin(mongoosePaginate);


const Product =mongoose.model("Product",productSchema)

module.exports=Product