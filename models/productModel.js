const mongoose = require("mongoose"); // Erase if already required
const colorModel = require("../models/colorModel")

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    // },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    
    images: [
      {
        public_id: String,
        url: String,
        
      },
    ],

    //images:[],

   // photo:[],
      
      
    color: [{type:mongoose.Schema.Types.ObjectId, ref: "colorModel"}],
    tags: String,
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
 const productModel= mongoose.model("productModel", productSchema);

 module.exports = productModel

