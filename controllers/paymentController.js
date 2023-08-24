const Razorpay = require("razorpay")
const {KEY_SECRET, KEY_ID} = require("../secret")

const instance = new Razorpay({
    key_id:KEY_ID,
    key_secret:KEY_SECRET
})

const checkOut = async(req,res)=>{
    const {amount} = req.body;
    
    try{
        
    const options = {
    
        amount:Number(amount*100),
        
        currency: "INR"
    }

    const order = await instance.orders.create(options)
    
    res.json({
        success:true,
        order
    })
    }catch(error){
        console.log("error",error);
        res.json(error.message)
    }

}


const paymentVerification = async (req,res) =>{

    console.log("paymentVerification",req.body);
    const {razorpayOrderId,  razorpayPaymentId } = req.body;
    res.json({
        razorpayOrderId,
        razorpayPaymentId
    })

}


module.exports = {
    checkOut,
    paymentVerification
}