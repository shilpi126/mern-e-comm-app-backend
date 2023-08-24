const mongoose = require("mongoose")

const {MONGO_URL} = require("../secret")

 const connectDB = () => {
   try{
    mongoose.connect(MONGO_URL),
    console.log("db connected");
   }catch(err){
    console.log("err");

   }
 }

module.exports = connectDB;
