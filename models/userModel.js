const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

//create schema
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"]

    },
    email:{
        type:String,
        required:[true, "please enter an email"],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    mobile:{
        type:String,
        required:[true, "Please enter a mobile no"],
        unique:true,
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minLength:8,
        select:false
    },
    // confirmPassword:{
    //     type:String,
    //     required:[true, "Please enter your confirm password"],
    //     validate: {
    //         validator: function(val){
    //             return val == this.password;
    //         },
    //         message: "Please & Confirm Password does not match"
    //     }
    // },
    photo:String,
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },

    cart:{
        type:Array,
        default:[],
    },

    //cart: [{type:mongoose.Schema.Types.ObjectId, ref: "cartModel"}],
    
    address:[{type:mongoose.Schema.Types.ObjectId, ref: "Address"}],
    wishlist:[{type:mongoose.Schema.Types.ObjectId, ref: "productModel"}],
    refreshToken : {
        type: String,
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpires:Date,
},
{
    timestamps:true,
}
)

//hash the password
userSchema.pre("save", async function(next){
    //when user did not change the password in that case we simply call the next function.
    if(!this.isModified("password")) return next();

    //encrypt the password before saving to db.
    // const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, 10)

    //we do not want to save confirm password in db so.
    this.confirmPassword = undefined;
    next()

})

//compare password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };


//reset password token
userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    //console.log("====>???",resetToken,this.passwordResetToken);
    return resetToken;
}



//model
const userModel = mongoose.model("userModel", userSchema)
module.exports = userModel;