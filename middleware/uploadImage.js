//const { log } = require("console");
const multer = require("multer");

const path = require("path");
//const fs = require("fs");


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       //cb(null, path.join(__dirname, "../public/images"));
//       cb(null,"/Fullstack_Project/e-comm-app/backend/public\images" )
//     },
//     filename: function (req, file, cb) {
//       const uniquesuffix = Date.now() 
//       + "-" + Math.round(Math.random() * 1e9);
//       cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
//     },
//     //console.log("in multer storage")
//   });


//   const multerFilter = (req, file, cb) => {
//     console.log("in multer filter >>>>>>")
//     if (file.mimetype.startsWith("image")) {
        
//       cb(null, true);
//     } else {
//       cb({ message: "Unsupported file format" }, false);
//     }
//     console.log("in multer filter ")
//   };


//   const uploadPhoto = multer({
//     storage: storage,
//     fileFilter: multerFilter
//     //limits: { fileSize: 1000000 },
//   });





//upload => storage, filter
const multerStorage = multer.diskStorage({
  destination:function(req,file,cb){
    console.log("from multer storage in",file);
      cb(null,"/Fullstack_Project/e-comm-app/backend/public/images")
  },
  filename:function(req,file,cb){
    console.log("from multer storage out",file);
      cb(null, `product-${Date.now()}.jpg`)

  }


  // filename: function (req, file, cb) {
  //   console.log("}}}}}}}}}}}}}}",file);
  //         const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //         cb(null, "product" + "-" + uniquesuffix + ".jpg");
  //       },

})

const filter = function(req,file,cb){
  console.log("from multer filter",file);
  if(file.mimetype.startsWith("image")){
      cb(null, true)
  }else{
      cb(new Error("Not an Image! Please upload an image"))
  }
}



const upload = multer({
  storage: multerStorage,
  fileFilter:filter
});



  module.exports = {upload}
