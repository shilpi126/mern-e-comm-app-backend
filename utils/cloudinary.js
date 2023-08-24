const cloudinary = require("cloudinary");
const {CLOUD_NAME,CLOUD_API_SECRET,CLOUD_API_KEY} = require("../secret")

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET
});



module.exports=cloudinary;