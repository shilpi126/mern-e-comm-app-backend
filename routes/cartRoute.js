const express = require("express")
const cartRoute = express.Router()

const {userCart, getUserCart, emptyCart, getWishList} = require("../controllers/userController");
const { protectRoute } = require("../middleware/authMiddleware");
const { addToWishList } = require("../controllers/productController");





cartRoute.use(protectRoute);
cartRoute
.route("/addtocart")
.post(userCart)

cartRoute.use(protectRoute);
cartRoute
.route("/empty")
.delete(emptyCart)

// cartRoute.use(protectRoute);
// cartRoute
// .route("/addwishlist")
// .put(addToWishList)







module.exports= cartRoute;