
const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require("../secret")
const userModel = require("../models/userModel")

module.exports.protectRoute=async function protectRoute(req,res,next){
    try{

        let token;
        if(req.cookies.token){
        //1. read the token & check if exist
        token = req.cookies.token;
        
        //2. validate the token
        let payload = jwt.verify(token,SECRET_KEY);
        
        if(payload){
            
            const user = await userModel.findById(payload.id)
            
            req.role=user.role;
            req.id=user._id;
            req.user=user;
            
            next()
        }else{
            return res.json({
                message:"please login again"
            })
        }

    }else{
        //browser
        const client = req.get("User-Agent");
        if(client.includes("Mozilla")==true){
            return res.redirect("/login")
        }else{
            res.json({
                message:"please login"
            })
    
        }
    }
    }catch{
        res.send({
            message:"operation not allowed"
        })
    }

}


//isAuthorise => to check the user's role
module.exports.isAuthorised=function isAuthorised(roles){
    
    return function (req,res,next){
        
        if(roles.includes(req.role)==true){
            
            next()
        }else{
            res.status(401).json({
                message:"user not allowed"
            })
        }
    }
}




