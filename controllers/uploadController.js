const fs = require("fs");
const cloudinary = require("../utils/cloudinary")
const productModel = require("../models/productModel")







// module.exports.updateSingleProductImage = async function updateSingleProductImage(req,res) {
  
//   const {id} = req.params;

  
//   try{
//        // Upload image to cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path, "images");
//         //console.log("????????????", result);
//         const updatedProduct = await productModel?.findByIdAndUpdate(
//         id,
//         {
//          images:{
//           url: result.secure_url,
//           asset_id: result.asset_id,
//           public_id: result.public_id
//          }

//        },
//        {new:true}
       
//        );


//        //console.log("Product image has been added!");

//        res.json({
//         status:"success",
//         message:"product updated successfully",
//         updatedProduct
//        });


//   }catch(err){
//     res.json(err.message)
//   }
// }






module.exports.updateProductImage = async function updateProductImage(req,res){
  
  const {id} = req.params;
  //console.log("<<<<<<<<<<<<<",id);
  
  try{
       // Upload image to cloudinary
       
        const urls = [];
        const files = req.files;
        let result;

        for (const file of files) {
          const { path } = file;
          
          result = await cloudinary.uploader.upload(path, "images");
          //console.log("MMMMMMMMMMMMM",result);
          urls.push(result);
          fs.unlinkSync(path);
        }
        
        // const images = urls.map((file) => {
        //   return (

        //       {
        //       url: file.secure_url,
        //       asset_id: file.asset_id,
        //       public_id: file.public_id
        //       }

        //   );
        // })
      
        const updatedProduct = await productModel?.findByIdAndUpdate(
        id,
        {
        images : urls.map((file) => {
          return {
          url: file.secure_url,
          asset_id: file.asset_id,
          public_id: file.public_id
        }
        })

      },

      {new:true}
        
      );


      //console.log(" Product image has been added!");

        res.json({
        status:"success",
        message:"product updated successfully",
        updatedProduct
        
        
        });


  }catch(err){
    res.json(err.message)
  }
}







// module.exports.updateProductImage=async function(req,res) {
  
//   try{
//        // Upload image to cloudinary
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       console.log(newpath);
//       urls.push(newpath);
//      // fs.unlinkSync(path);
//     }

//     const images = urls.map((file) => {
//       return file;
//     });
    
//       console.log("Product image has been added!");
//        res.json({
//         status:"success",
//         message:"product updated successfully",
//         images
//        });
//   }catch(err){
//     res.json(err.message)
//   }
// }
