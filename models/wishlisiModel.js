const mongoose = require("mongoose"); 
const productModel = require("./productModel");


// Declare the Schema of the Mongo model
var wishlistSchema = new mongoose.Schema(
    {
        userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"userModel"
        },
        productId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"productModel"
        },
        
    },
    { timestamps: true }
  );
  
  //Export the model
   const wishlistModel= mongoose.model("wishlistModel", wishlistSchema);
  
   module.exports = wishlistModel;