const express = require("express");
const { updateProductImage } = require("../controllers/uploadController");
//const { isAdmin, authMiddleware } = require("..");
const {upload } = require("../middleware/uploadImage");
const uploadRouter = express.Router();



uploadRouter.route("/:id")
.patch(upload.array("image",10),updateProductImage)



//uploadRouter.put("/:id",upload.array("image",10),updateProductImage)



//uploadRouter.patch("/:id", upload.single("image"),updateProductImage)


//router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = uploadRouter;