const mongoose = require("mongoose"); 
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const colorModel = require("../models/colorModel")

const orderSchema = new mongoose.Schema(
    {

        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userModel",
            required:true

        },

        shippingInfo:{
            name:{
                type:String,
                required:true

            },
            // lastName:{
            //     type:String,
            //     required:true
            // },
            address:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            state:{
                type:String,
                required:true
            },
            other:{
                type:String,
                //required:true
            },
            pincode:{
                type:Number,
                required:true
            },
        },
        
        paymentInfo:{
        razorpayOrderId:{
            type:String,
            required:true
        },
        razorpayPaymentId:{
            type:String,
            required:true
        },

        },

        orderItems:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"productModel",
                    required:true
                },
                color:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"colorModel",
                    //required:true
                },
                quantity:{
                    type:Number,
                    required:true
                },

                price:{
                    type:Number,
                    required:true

                },
                paidAt:{
                    type:Date,
                    default:Date.now()

                },
              
            }
        ],

        totalPrice:{
            type:Number,
            required:true
        },
        totalPriceAfterDiscount:{
            type:Number,
            required:true
        },
        orderStatus:{
            type:String,
            default:"Ordered"
        }

        
    },
    {
        timestamps:true
    }
)

  //Export the model
    const orderModel= mongoose.model("orderModel", orderSchema);
    
    module.exports =  orderModel;