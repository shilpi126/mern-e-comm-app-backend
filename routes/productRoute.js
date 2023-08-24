const express = require("express")
const productRoute = express.Router()
const {protectRoute,isAuthorised} = require("../middleware/authMiddleware")
const {createProduct, updateProduct,deleteProduct, getAllProduct, rating, getProduct, addToWishList} = require("../controllers/productController")
//const { createwishlist, deletewishlist } = require("../controllers/userController")


//productRoute.use(protectRoute);
productRoute
.route("/getallproduct")
.get(getAllProduct)

productRoute
.route("/getproduct/:id")
.get(getProduct)


productRoute
.route("/create")
.post(createProduct)

productRoute
.route("/create/:id")
.put(updateProduct)
.delete(deleteProduct)




productRoute.use(protectRoute);
productRoute
.route("/rating")
.put(rating)

productRoute.use(protectRoute);
productRoute
.route("/createwishlist")
.post(addToWishList)






module.exports = productRoute;