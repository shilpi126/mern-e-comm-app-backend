const express = require("express")

const {protectRoute,isAuthorised} = require("../middleware/authMiddleware")

const {createColor,updateColor, getColor, deleteColor, getallColor} = require("../controllers/colorController")

const colorRoute = express.Router();

colorRoute.use(protectRoute);
colorRoute
.route("/getallcolor")
.get(getallColor)

colorRoute.use(protectRoute,isAuthorised("admin"));
colorRoute
.route("/")
.post(createColor)

colorRoute.use(protectRoute);
colorRoute
.route("/:id")
.put(updateColor)
.delete(deleteColor)


colorRoute.use(protectRoute);
colorRoute
.route("/:id")
.get(getColor)




module.exports = colorRoute

