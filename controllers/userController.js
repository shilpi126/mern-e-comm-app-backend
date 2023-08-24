const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const {SECRET_KEY} = require("../secret")

const crypto = require("crypto")

const {sendMail} = require("../utils/email")

const signToken = id => {
    return jwt.sign({id},SECRET_KEY,{expiresIn:1000*60*60*24})
}

//signup user
module.exports.signup = async function signup(req,res){
    try{
        let dataObj= req.body;
        let user = await userModel.create(dataObj)
        // sendMail("signup",user);
        if(user){
            
            //console.log("backend",user);
            res.json({
                message:"user sign up successfully",
                data:user
            })
        }else{
            res.json({
                message:"error while signup"
            })
        }
    }catch(err){
        res.json({
            message:err.message
        })
    }
    }
    

module.exports.login = async function login (req,res){
    try{
        const {email, password} = req.body;
        //check if email & password exists or not.
        if(!email || !password){
            //const error = new CustomError("Please provide email ID & password for login !")
            res.json({
                message:"Please provide email ID & password for login !"
            })
        }

        //check if user exists with given email.
        const user = await userModel.findOne({email}).select("+password")
        //console.log("+++++++++>>>>>",user.id);
        //if the user does not exists with this email then this code give exception.
        //const  isMatch = await user.isPasswordMatched(password)

        //check if the user exists & password matches.
        if(!user || !(await user.isPasswordMatched(password))){
            res.json({
                message:"Incorrect email or password"
            })
        }

        const token = signToken(user?._id)
        

        const updateuser = await userModel.findByIdAndUpdate(
            user.id,
            {
                token: token,
            },
            { new: true }
            );
        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            });

        res.json({
            status:"success",
            message:"User has logged in",
            token,
            user
            
        })


    }catch(err){
     res.json({
         "message":err.message
         
     })
    }
 }

 module.exports.updateUser = async function updateUser(req, res) {
    console.log("req.body-> ", req.body);
    //update data in users obj
    try {
      let id = req.params.id;
      console.log(id);
      let user = await userModel.findById(id);
      console.log(user);
      let dataToBeUpdated = req.body;
      if (user) {
        console.log('inside user');
        const keys = [];
        for (let key in dataToBeUpdated) {
          console.log(key);
          keys.push(key);
        }
  
        for (let i = 0; i < keys.length; i++) {
          //console.log(keys[i]);
          user[keys[i]] = dataToBeUpdated[keys[i]];
        }
        console.log(user);
        user.confirmPassword=user.password;
        const updatedData = await user.save();
        //console.log(updatedData);

        res.json({
          message: "data updated successfully",
          data: updatedData,
        });
      } else {
        res.json({
          message: "user not found",
        });
      }
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  };
  


  module.exports.getAllUser = async function getAllUser (req, res){
   
    try{

     
     let users = await userModel.find();
 
     if(users){
         res.json({
             message:"users retrived",
             users:users,
             
         })
     }else{
       res.json({
         message:"empty users"
         
     })
     }
 
  
    }catch(err){
     res.json({
       message:err.message
     })
    }
 }


module.exports.deleteUser = async function deleteUser (req,res){

    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id)
    if(!user){
        res.json({
            message:"user not found"
        })
    }
    res.json({
        message:"data has been deleted",
        data:user
    })
}


//logout
module.exports.logout= async function logout(req,res){
   
try{
   
    res.cookie("token", " ", {maxAge:1})
  
     res.json({
        status:"success",
        message:"user logout",
        

     })


}catch(err){
    res.json({
        message:err.message
    })
}
}


module.exports.forgotPassword = async function forgotPassword(req,res){
        const {email} = req.body;
    
        try{

            const user = await userModel.findOne({email});
        
            if(!user){
                res.json({
                    message:"We could not find the user with given email"
                })
            }
    
            const resetToken = user.createResetPasswordToken();
    
            await user.save({validateBeforeSave:false})
    
            //const resetUrl = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`
            const resetUrl = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`
            const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}`
            
            const data = {
                email: user.email,
                subject:"Password change request recieved",
                message:message,
                html:resetUrl
            }
            await sendMail(data)

            res.json({
                
                message:"forgot password mail send on this email",
                

            })

        }catch(err){
            //user.passwordResetToken = undefined;
            //user.passwordResetTokenExpires = undefined;
           // user.save({validateBeforeSave:false})
            res.json({
                message:err.message
            })

    }
}
    

    
module.exports.resetPassword= async function resetPassword (req,res){
    
    try{

        const { password } = req.body;
        const token  = req.params.resetToken;

        console.log("i am here >>>>>>>>>>>>",password,token);

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        console.log("?????????????",hashedToken);
        
        const user = await userModel.findOne({
            passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() }
        });

        console.log("*******************", user);

        if (!user) throw new Error(" Token Expired, Please try again later");

        user.password = password;
        //user.confirmPassword=req.body.confirmPassword
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();
    
        console.log("password  reset successfully",user);
        res.json({
            message:"Password Reset Successfully",
            user
            
        })
        
    }catch(err){
        res.json({
            message:err.message
            
        })
    }
}



module.exports.getwishlist= async function getwishlist (req,res){
    const {_id} = req.user;
    try{

        const findUser = await userModel.findById({_id}).populate("wishlist")
        res.json(findUser)
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}


module.exports.userCart= async function userCart (req,res){
    
    const {_id}= req.user

    
    const {productId,quantity,price,color}= req.body;
    try{
        let newCart = await new cartModel({
            userId:_id,
            productId,
            color,
            price,
            quantity
        }).save()

        
        res.json(newCart)
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}


module.exports.getUserCart= async function getUserCart (req,res){
    const {_id} = req.user;
    
    try{
    const cart = await cartModel.find({userId: _id}).populate("productId");
        res.json(cart)
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}

module.exports.removeProductFromCart= async function removeProductFromCart (req,res){
    const {_id} = req.user;
    const cartProductId = req.params.cartProductId;
    console.log(cartProductId);
    
    try{

        const deleteProductFromCart = await cartModel.deleteOne({userId:_id, _id:cartProductId})

        res.json(deleteProductFromCart)
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}

module.exports.updateProductQuantityFromCart= async function updateProductQuantityFromCart (req,res){
    const {_id} = req.user;
    const {cartProductId,newQuantity} = req.params;
    console.log(cartProductId,newQuantity);
    
    try{

        const cartItem = await cartModel.findOne({userId:_id, _id:cartProductId})
              cartItem.quantity=newQuantity;
              cartItem.save()
        res.json(cartItem)
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}


module.exports.emptyCart= async function emptyCart (req,res){
    const {_id} = req.user;
    try{
        const user = await userModel.findOne({_id});
        const cart = await cartModel.findOneAndRemove({orderby:user._id})
        res.json({
            "success":true,
            "message":"cart is empty",
            cart
            
        })
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}




module.exports.createOrder= async function createOrder (req,res){
   
    const {_id}= req.user
    console.log("createOrder ====>",req.body );

    //const {productId, color,quantity,price}= req.body;
    const {shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo}= req.body;
    try{
        const order = await orderModel.create({
            shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo,user:_id
        })
        res.json({
            order,
            success: true
        })
          
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}


module.exports.getMyOrder = async function getMyOrder(req,res){
    
    const {_id}= req.user
    try{
        const orders = await orderModel.find({user:_id}).populate("user").populate("orderItems.product").populate("orderItems.color")
        res.json(orders)
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}


module.exports.createwishlist= async function createwishlist (req,res){
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        //const user = await userModel.findOne({_id});
        const wishlist = await wishlistModel.create({prodId})
        res.json({
            "success":true,
            "message":"product Added to wishlist",
            wishlist
            
        })
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}


module.exports.deletewishlist= async function deletewishlist (req,res){
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        //const user = await userModel.findOne({_id});
        const wishlist = await wishlistModel.findByIdAndDelete(prodId)
        res.json({
            "success":true,
            "message":"product Deleted to the wishlist",
            wishlist
            
        })
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}







