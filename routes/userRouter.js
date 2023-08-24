const express = require("express")

const {signup,login, getUserCart, removeProductFromCart, updateProductQuantityFromCart,createOrder, getwishlist, getMyOrder, updateUser, getAllUser, deleteUser, logout, forgotPassword, resetPassword} =  require("../controllers/userController")
const { protectRoute, isAuthorised } = require("../middleware/authMiddleware")
const { paymentVerification, checkOut } = require("../controllers/paymentController")

const userRouter = express.Router()

userRouter
.route("/signup")
.post(signup)

userRouter
.route("/login")
.post(login)

userRouter
.route("/forgot-password")
.post(forgotPassword)

userRouter
.route("/resetPassword/:resetToken")
.post(resetPassword)




userRouter
.route("/logout")
.get(protectRoute,logout)



userRouter
.route("/")
.get(protectRoute,isAuthorised("admin"),getAllUser)


userRouter
.route("/update/:id")
.patch(protectRoute,updateUser)

userRouter
.route("/delete/:id")
.delete(protectRoute,isAuthorised("admin"),deleteUser)




userRouter.use(protectRoute);
userRouter
.route("/order/checkout")
.post(checkOut)



userRouter.use(protectRoute);
userRouter
.route("/order/paymentverification")
.post(paymentVerification)

userRouter.use(protectRoute);
userRouter
.route("/createorder")
.post(createOrder)

userRouter.use(protectRoute);
userRouter
.route("/getmyorder")
.get(getMyOrder)


userRouter.use(protectRoute);
userRouter
.route("/getwishlist")
.get(getwishlist)

userRouter.use(protectRoute);
userRouter
.route("/getcart")
.get(getUserCart)

userRouter.use(protectRoute);
userRouter
.route("/deletecartproduct/:cartProductId")
.delete(removeProductFromCart)

userRouter.use(protectRoute);
userRouter
.route("/updatecartquantity/:cartProductId/:newQuantity")
.patch(updateProductQuantityFromCart)














module.exports=userRouter