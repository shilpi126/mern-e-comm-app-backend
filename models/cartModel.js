const mongoose = require("mongoose"); 
const productModel = require("./productModel");


// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
        userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"userModel"
        },
        productId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"productModel"
        },
        quantity:{
          type:Number,
          required:true
        },
        price:{
          type:Number,
          required:true
        }
        // color:{
        //   type:mongoose.Schema.Types.ObjectId,
        //   ref:"colorModel"
        // }
    },
    { timestamps: true }
  );
  
  //Export the model
   const cartModel= mongoose.model("cartModel", cartSchema);
  
   module.exports = cartModel;