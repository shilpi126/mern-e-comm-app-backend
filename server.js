const express = require("express")
const userRouter = require("./routes/userRouter")
const connectDB = require("./config/db")
const productRoute = require("./routes/productRoute")
const cookieParser = require('cookie-parser')
const cartRoute = require("./routes/cartRoute")
const colorRoute = require("./routes/colorRoute")
const {PORT} = require("./secret")
const cors = require("cors");

const uploadRouter = require("./routes/uploadRoute")

const app = express()

app.use(cors())


app.use(cookieParser())
app.use(express.json())
express.static("public");
app.use(express.urlencoded({extended:true}))


app.use("/user",userRouter)
app.use("/product",productRoute)
app.use("/cart",cartRoute)
app.use("/color",colorRoute)
app.use("/upload-img",uploadRouter)





app.listen(PORT,() => (
    console.log("server is running on port",PORT),
    connectDB()
))